import { afterEach, describe, expect, it, vi } from 'vitest'
import type { DeclarativeSyncAdapterError } from './declarative-sync-boundary'
import { createHttpDeclarativeSyncAdapter } from './declarative-sync-http'

describe('createHttpDeclarativeSyncAdapter', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('posts pull requests and returns the decoded response', async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(
        JSON.stringify({
          changes: [],
          nextCursor: 'cursor:page:1',
          hasMore: false,
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      ),
    )

    const adapter = createHttpDeclarativeSyncAdapter({
      baseUrl: 'http://localhost:8080/api/v1/declarative/sync',
      fetch: fetchMock,
      headers: {
        'X-Autoform-Tenant-Id': 'tenant_demo',
      },
    })

    await expect(
      adapter.pullChanges({
        documentKind: 'page',
        sinceCursor: 'cursor:page:0',
        limit: 50,
      }),
    ).resolves.toEqual({
      changes: [],
      nextCursor: 'cursor:page:1',
      hasMore: false,
    })

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock.mock.calls[0]?.[0]).toBe('http://localhost:8080/api/v1/declarative/sync/pull')
    expect(fetchMock.mock.calls[0]?.[1]).toMatchObject({
      method: 'POST',
      body: JSON.stringify({
        documentKind: 'page',
        sinceCursor: 'cursor:page:0',
        limit: 50,
      }),
    })
    const headers = fetchMock.mock.calls[0]?.[1]?.headers as Headers | undefined
    expect(headers).toBeInstanceOf(Headers)
    expect(headers?.get('Content-Type')).toBe('application/json')
    expect(headers?.get('X-Autoform-Tenant-Id')).toBe('tenant_demo')
  })

  it('maps typed remote errors into DeclarativeSyncAdapterError', async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(
        JSON.stringify({
          error: {
            code: 'invalid-cursor',
            message: 'cursor expired',
          },
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      ),
    )

    const adapter = createHttpDeclarativeSyncAdapter({
      baseUrl: 'http://localhost:8080/api/v1/declarative/sync',
      fetch: fetchMock,
    })

    await expect(adapter.pullChanges({ sinceCursor: 'stale' })).rejects.toMatchObject({
      name: 'DeclarativeSyncAdapterError',
      code: 'invalid-cursor',
      message: 'cursor expired',
    } satisfies Partial<DeclarativeSyncAdapterError>)
  })

  it('maps auth-related API errors into auth failures', async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(
        JSON.stringify({
          error: {
            code: 'auth_unavailable',
            message: 'header-based auth is disabled in this environment',
          },
        }),
        {
          status: 503,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      ),
    )

    const adapter = createHttpDeclarativeSyncAdapter({
      baseUrl: 'http://localhost:8080/api/v1/declarative/sync',
      fetch: fetchMock,
    })

    await expect(adapter.pullChanges({ documentKind: 'page' })).rejects.toMatchObject({
      name: 'DeclarativeSyncAdapterError',
      code: 'auth',
      message: 'header-based auth is disabled in this environment',
    } satisfies Partial<DeclarativeSyncAdapterError>)
  })

  it('maps rate limits and retry-after headers', async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(
        JSON.stringify({
          error: {
            code: 'rate-limited',
            message: 'slow down',
          },
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': '2',
          },
        },
      ),
    )

    const adapter = createHttpDeclarativeSyncAdapter({
      baseUrl: 'http://localhost:8080/api/v1/declarative/sync',
      fetch: fetchMock,
    })

    await expect(adapter.pushChanges({ changes: [] })).rejects.toMatchObject({
      name: 'DeclarativeSyncAdapterError',
      code: 'rate-limited',
      retryable: true,
      retryAfterMs: 2000,
    } satisfies Partial<DeclarativeSyncAdapterError>)
  })

  it('treats non-ok response body read failures as transient retryable failures', async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue({
      ok: false,
      status: 503,
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      text: vi.fn().mockRejectedValue(new TypeError('response stream interrupted')),
    } as unknown as Response)

    const adapter = createHttpDeclarativeSyncAdapter({
      baseUrl: 'http://localhost:8080/api/v1/declarative/sync',
      fetch: fetchMock,
    })

    await expect(adapter.pullChanges({ documentKind: 'page' })).rejects.toMatchObject({
      name: 'DeclarativeSyncAdapterError',
      code: 'transient',
      retryable: true,
      message: 'Sync request failed with HTTP 503',
    } satisfies Partial<DeclarativeSyncAdapterError>)
  })

  it('preserves status-based auth classification when a non-ok response body read fails', async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue({
      ok: false,
      status: 401,
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      text: vi.fn().mockRejectedValue(new TypeError('response stream interrupted')),
    } as unknown as Response)

    const adapter = createHttpDeclarativeSyncAdapter({
      baseUrl: 'http://localhost:8080/api/v1/declarative/sync',
      fetch: fetchMock,
    })

    await expect(adapter.pullChanges({ documentKind: 'page' })).rejects.toMatchObject({
      name: 'DeclarativeSyncAdapterError',
      code: 'auth',
      retryable: false,
      message: 'Sync request failed with HTTP 401',
    } satisfies Partial<DeclarativeSyncAdapterError>)
  })

  it('times out stalled requests as transient retryable failures', async () => {
    vi.useFakeTimers()

    const fetchMock = vi.fn<typeof fetch>().mockImplementation((_input, init) => {
      return new Promise<Response>((_resolve, reject) => {
        const signal = init?.signal
        signal?.addEventListener('abort', () => {
          reject(signal.reason)
        })
      })
    })

    const adapter = createHttpDeclarativeSyncAdapter({
      baseUrl: 'http://localhost:8080/api/v1/declarative/sync',
      fetch: fetchMock,
      timeoutMs: 50,
    })

    const pending = adapter.pullChanges({ documentKind: 'page' })
    void pending.catch(() => undefined)
    const assertion = expect(pending).rejects.toMatchObject({
      name: 'DeclarativeSyncAdapterError',
      code: 'transient',
      retryable: true,
      message: 'Sync request timed out after 50ms',
    } satisfies Partial<DeclarativeSyncAdapterError>)
    await vi.advanceTimersByTimeAsync(50)

    await assertion
  })
})
