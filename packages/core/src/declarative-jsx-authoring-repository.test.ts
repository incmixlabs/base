import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  initializeJsxAuthoringWorkbenchRepository,
  JsxAuthoringWorkbenchPageNotFoundError,
  resolveJsxAuthoringWorkbenchSyncTransportOptions,
} from './declarative-jsx-authoring-repository'
import type { DeclarativeSyncAdapter, DeclarativeSyncChangeEnvelope, PageDocument } from './index'

const page: PageDocument = {
  kind: 'page',
  id: 'support.dashboard',
  title: 'Support Dashboard',
  root: {
    type: 'layout',
    props: {},
    children: [],
  },
}

function parseCursor(cursor: string | undefined): number {
  const value = Number(cursor?.split(':').at(-1) ?? 0)
  return Number.isFinite(value) ? value : 0
}

function createFakeRemoteSyncAdapter(): DeclarativeSyncAdapter {
  let sequence = 0
  const log: Array<{ sequence: number; change: DeclarativeSyncChangeEnvelope }> = []

  return {
    async pullChanges(request) {
      const since = parseCursor(request.sinceCursor)
      const changes = log
        .filter(entry => entry.sequence > since)
        .map(entry => entry.change)
        .filter(change => {
          if (request.documentKind == null) return true
          if (change.operation === 'upsert') return change.record.documentKind === request.documentKind
          return change.document.documentKind === request.documentKind
        })

      return {
        changes,
        nextCursor: `cursor:sync:${sequence}`,
        hasMore: false,
      }
    },
    async pushChanges(request) {
      const applied = []
      for (const change of request.changes) {
        sequence += 1
        if (change.operation === 'upsert') {
          const record = {
            ...structuredClone(change.record),
            revision: `rev_remote_${sequence}`,
            updatedAt: new Date(Date.UTC(2026, 3, 11, 12, 0, sequence)).toISOString(),
          }
          log.push({
            sequence,
            change: {
              operation: 'upsert',
              record,
              baseRevision: change.baseRevision,
              source: 'worker',
            },
          })
          applied.push({
            documentKind: record.documentKind,
            id: record.id,
            revision: record.revision,
          })
          continue
        }

        log.push({
          sequence,
          change: {
            operation: 'delete',
            document: change.document,
            baseRevision: change.baseRevision,
            source: 'worker',
          },
        })
        applied.push(change.document)
      }

      return {
        applied,
        conflicts: [],
        acceptedCursor: `cursor:sync:${sequence}`,
      }
    },
  }
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('resolveJsxAuthoringWorkbenchSyncTransportOptions', () => {
  it('falls back to the default local sync endpoint and auth headers', () => {
    expect(resolveJsxAuthoringWorkbenchSyncTransportOptions()).toEqual({
      baseUrl: 'http://127.0.0.1:8080/api/v1/declarative/sync',
      headers: {
        'X-Autoform-Tenant-Id': 'tenant_demo',
        'X-Autoform-Actor-Id': 'user_demo',
      },
      timeoutMs: 8000,
    })
  })

  it('prefers explicit transport options over environment defaults', () => {
    expect(
      resolveJsxAuthoringWorkbenchSyncTransportOptions({
        syncEnvironment: {
          VITE_DECLARATIVE_SYNC_BASE_URL: 'http://example.invalid/from-env',
          VITE_DECLARATIVE_SYNC_TENANT_ID: 'tenant_env',
          VITE_DECLARATIVE_SYNC_ACTOR_ID: 'actor_env',
        },
        syncTransport: {
          baseUrl: 'http://example.invalid/explicit',
          headers: {
            Authorization: 'Bearer demo',
          },
        },
      }),
    ).toEqual({
      baseUrl: 'http://example.invalid/explicit',
      headers: {
        Authorization: 'Bearer demo',
      },
      timeoutMs: 8000,
    })
  })
})

describe('JsxAuthoringWorkbenchPageNotFoundError', () => {
  it('preserves the missing page id', () => {
    const error = new JsxAuthoringWorkbenchPageNotFoundError('page.missing')

    expect(error.name).toBe('JsxAuthoringWorkbenchPageNotFoundError')
    expect(error.id).toBe('page.missing')
    expect(error.message).toContain('page.missing')
  })
})

describe('initializeJsxAuthoringWorkbenchRepository', () => {
  it('initializes remote-only mode without touching OPFS', async () => {
    const getDirectory = vi.fn(() => {
      throw new Error('OPFS should not be initialized in remote-only mode')
    })
    vi.stubGlobal('navigator', {
      storage: {
        getDirectory,
      },
    })

    const repository = await initializeJsxAuthoringWorkbenchRepository(page, {
      persistence: { mode: 'remote-only' },
      syncAdapter: createFakeRemoteSyncAdapter(),
    })

    try {
      expect(repository.storageMode).toBe('remote-only')
      expect(repository.persistenceMode).toBe('remote-only')
      expect(getDirectory).not.toHaveBeenCalled()
      await expect(repository.loadDocument(page.id)).resolves.toMatchObject({
        documentKind: 'page',
        id: page.id,
      })
    } finally {
      await repository.destroy()
    }
  })
})
