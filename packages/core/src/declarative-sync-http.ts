import {
  type DeclarativeSyncAdapter,
  DeclarativeSyncAdapterError,
  type DeclarativeSyncErrorCode,
  type DeclarativeSyncPullRequest,
  type DeclarativeSyncPullResponse,
  type DeclarativeSyncPushRequest,
  type DeclarativeSyncPushResponse,
} from './declarative-sync-boundary'

type SyncFetch = typeof fetch

export type CreateHttpDeclarativeSyncAdapterOptions = {
  baseUrl: string
  fetch?: SyncFetch
  headers?: HeadersInit | (() => HeadersInit | undefined)
  timeoutMs?: number
}

type ApiErrorEnvelope = {
  error?: {
    code?: string
    message?: string
    details?: {
      retryAfterMs?: unknown
    }
  }
}

export const DEFAULT_DECLARATIVE_SYNC_TIMEOUT_MS = 8_000
const MAX_DECLARATIVE_SYNC_TIMEOUT_MS = 2_147_483_647

function normalizeBaseUrl(baseUrl: string): string {
  return baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl
}

function resolveHeaders(headers: CreateHttpDeclarativeSyncAdapterOptions['headers']): HeadersInit | undefined {
  return typeof headers === 'function' ? headers() : headers
}

function parseRetryAfterMs(response: Response, error: ApiErrorEnvelope['error']): number | undefined {
  const explicit = error?.details?.retryAfterMs
  if (typeof explicit === 'number' && Number.isFinite(explicit) && explicit >= 0) {
    return explicit
  }

  const retryAfter = response.headers.get('Retry-After')
  if (retryAfter == null) {
    return undefined
  }

  const seconds = Number(retryAfter)
  if (Number.isFinite(seconds) && seconds >= 0) {
    return seconds * 1000
  }

  const at = Date.parse(retryAfter)
  if (Number.isNaN(at)) {
    return undefined
  }

  return Math.max(0, at - Date.now())
}

function normalizeErrorCode(status: number, code: string | undefined): DeclarativeSyncErrorCode {
  switch (code) {
    case 'conflict':
    case 'invalid-cursor':
    case 'invalid-request':
    case 'auth':
    case 'rate-limited':
    case 'transient':
    case 'fatal':
      return code
    case 'unauthorized':
    case 'auth_unavailable':
      return 'auth'
    case 'rate_limited':
      return 'rate-limited'
  }

  if (status === 400) {
    return 'invalid-request'
  }
  if (status === 401 || status === 403) {
    return 'auth'
  }
  if (status === 408) {
    return 'transient'
  }
  if (status === 409) {
    return 'conflict'
  }
  if (status === 429) {
    return 'rate-limited'
  }
  if (status >= 500) {
    return 'transient'
  }

  return 'fatal'
}

async function parseResponseJson<T>(response: Response): Promise<T | undefined> {
  const text = await response.text()
  if (text.trim() === '') {
    return undefined
  }

  return JSON.parse(text) as T
}

export function createHttpDeclarativeSyncAdapter(
  options: CreateHttpDeclarativeSyncAdapterOptions,
): DeclarativeSyncAdapter {
  const fetchImplementation = options.fetch ?? fetch
  const baseUrl = normalizeBaseUrl(options.baseUrl)
  const rawTimeoutMs = options.timeoutMs ?? DEFAULT_DECLARATIVE_SYNC_TIMEOUT_MS
  const timeoutMs =
    Number.isFinite(rawTimeoutMs) && rawTimeoutMs > 0
      ? Math.min(rawTimeoutMs, MAX_DECLARATIVE_SYNC_TIMEOUT_MS)
      : DEFAULT_DECLARATIVE_SYNC_TIMEOUT_MS

  async function request<TResponse>(path: string, body: DeclarativeSyncPullRequest | DeclarativeSyncPushRequest) {
    const mergedHeaders = new Headers(resolveHeaders(options.headers))
    mergedHeaders.set('Content-Type', 'application/json')
    const controller = new AbortController()
    const timeout = setTimeout(() => {
      controller.abort(new DOMException(`Sync request timed out after ${timeoutMs}ms`, 'AbortError'))
    }, timeoutMs)

    try {
      const response = await fetchImplementation(`${baseUrl}${path}`, {
        method: 'POST',
        headers: mergedHeaders,
        body: JSON.stringify(body),
        signal: controller.signal,
      })
      if (!response.ok) {
        const fallbackCode = normalizeErrorCode(response.status, undefined)
        const fallbackRetryAfterMs = parseRetryAfterMs(response, undefined)
        let payload: ApiErrorEnvelope | undefined
        try {
          payload = await parseResponseJson<ApiErrorEnvelope>(response)
        } catch (error) {
          if (!(error instanceof SyntaxError)) {
            const isAbort = error instanceof DOMException && error.name === 'AbortError' && controller.signal.aborted
            throw new DeclarativeSyncAdapterError({
              code: fallbackCode,
              message: isAbort
                ? `Sync request timed out after ${timeoutMs}ms`
                : `Sync request failed with HTTP ${response.status}`,
              retryable: fallbackCode === 'transient' || fallbackCode === 'rate-limited',
              retryAfterMs: fallbackRetryAfterMs,
            })
          }
        }
        const code = normalizeErrorCode(response.status, payload?.error?.code)
        throw new DeclarativeSyncAdapterError({
          code,
          message: payload?.error?.message ?? `Sync request failed with HTTP ${response.status}`,
          retryable: code === 'transient' || code === 'rate-limited',
          retryAfterMs: parseRetryAfterMs(response, payload?.error),
        })
      }

      const payload = await parseResponseJson<TResponse>(response)
      if (payload == null) {
        throw new Error('Empty sync response')
      }
      return payload
    } catch (error) {
      if (error instanceof DeclarativeSyncAdapterError) {
        throw error
      }

      const isAbort = error instanceof DOMException && error.name === 'AbortError' && controller.signal.aborted
      const isTransportFailure =
        error instanceof TypeError || (error instanceof DOMException && error.name === 'NetworkError')
      throw new DeclarativeSyncAdapterError({
        code: isAbort || isTransportFailure ? 'transient' : 'fatal',
        message: isAbort
          ? `Sync request timed out after ${timeoutMs}ms`
          : error instanceof Error
            ? error.message
            : 'Failed to decode sync response',
        retryable: isAbort || isTransportFailure,
      })
    } finally {
      clearTimeout(timeout)
    }
  }

  return {
    pullChanges(requestBody): Promise<DeclarativeSyncPullResponse> {
      return request<DeclarativeSyncPullResponse>('/pull', requestBody)
    },
    pushChanges(requestBody): Promise<DeclarativeSyncPushResponse> {
      return request<DeclarativeSyncPushResponse>('/push', requestBody)
    },
  }
}
