import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  COMPONENT_REGISTRY_ENTRY_KIND,
  COMPONENT_REGISTRY_SCHEMA_VERSION,
  type AppDocument,
  type ComponentRegistryEntry,
  type DeclarativeSyncAdapter,
  type DeclarativeSyncChangeEnvelope,
  type DeclarativeSyncConflict,
  type DeclarativeSyncDocumentRecord,
  type DeclarativeSyncSupportedDocumentKind,
  initializeDeclarativeAppSyncRepository,
  resolveDeclarativeAppSyncRecordLoadBatchSize,
} from './index'

const app: AppDocument = {
  kind: 'app',
  id: 'example.app',
  title: 'Example App',
  pages: {
    home: {
      title: 'Home',
      root: {
        type: 'layout',
        props: {},
        children: [],
      },
    },
  },
  routes: [
    {
      path: '/',
      page: '#/pages/home',
      title: 'Home',
    },
  ],
}

const localCompositeEntry: ComponentRegistryEntry = {
  schemaVersion: COMPONENT_REGISTRY_SCHEMA_VERSION,
  kind: COMPONENT_REGISTRY_ENTRY_KIND,
  id: 'ui.composite.local-summary',
  slug: 'local-summary',
  title: 'Local Summary',
  description: 'Locally authored summary composite.',
  runtime: {
    kind: 'known-renderer',
    rendererId: 'ui.composite',
    componentName: 'Composite',
  },
  discovery: {
    summary: 'Locally authored summary composite.',
    group: 'Local',
    hierarchy: ['composites', 'local'],
    tags: ['local', 'summary'],
    keywords: ['local summary', 'composite'],
  },
  ownership: {
    scope: 'private',
    ownerKind: 'user',
    ownerId: 'user_demo',
  },
  persistence: {
    source: 'registry',
    mutable: true,
    scope: 'repository',
  },
  meta: {
    templateKind: 'composite',
    sourceKind: 'local',
    compositeDefinition: {
      name: 'local-summary',
      sampleData: { label: 'Local summary' },
      jsonSchema: {
        type: 'object',
        properties: {
          label: { type: 'string' },
        },
        required: ['label'],
        additionalProperties: false,
      },
      renderDefinition: {
        component: 'Text',
        children: { $data: 'label' },
      },
    },
  },
}

function parseCursor(cursor: string | undefined): number {
  const value = Number(cursor?.split(':').at(-1) ?? 0)
  return Number.isFinite(value) ? value : 0
}

type FakeRemoteSyncAdapter = DeclarativeSyncAdapter & {
  getRecord(documentKind: DeclarativeSyncSupportedDocumentKind, id: string): DeclarativeSyncDocumentRecord | undefined
}
type FakeComponentRegistrySyncRecord = DeclarativeSyncDocumentRecord & {
  documentKind: 'component-registry-entry'
  document: ComponentRegistryEntry
}

function buildRemoteRowId(documentKind: DeclarativeSyncSupportedDocumentKind, id: string): string {
  return `${documentKind}:${id}`
}

function createFakeRemoteSyncAdapter(): FakeRemoteSyncAdapter {
  let sequence = 0
  const log: Array<{ sequence: number; change: DeclarativeSyncChangeEnvelope }> = []
  const records = new Map<string, DeclarativeSyncDocumentRecord>()

  return {
    getRecord(documentKind, id) {
      const record = records.get(buildRemoteRowId(documentKind, id))
      return record == null ? undefined : structuredClone(record)
    },
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
      const conflicts: DeclarativeSyncConflict[] = []

      for (const change of request.changes) {
        if (change.operation === 'upsert') {
          const rowId = buildRemoteRowId(change.record.documentKind, change.record.id)
          const existing = records.get(rowId)
          if (change.baseRevision !== existing?.revision) {
            if (existing != null) {
              conflicts.push({
                reason: 'revision-mismatch',
                document: {
                  documentKind: existing.documentKind,
                  id: existing.id,
                  revision: existing.revision,
                },
                serverRecord: structuredClone(existing),
              })
              continue
            }

            conflicts.push({
              reason: 'deleted-remotely',
              document: {
                documentKind: change.record.documentKind,
                id: change.record.id,
                revision: change.baseRevision ?? 'missing',
              },
            })
            continue
          }

          sequence += 1
          const record = {
            ...structuredClone(change.record),
            revision: `rev_remote_${sequence}`,
            updatedAt: new Date(Date.UTC(2026, 3, 11, 12, 0, sequence)).toISOString(),
          }
          records.set(rowId, record)
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

        const rowId = buildRemoteRowId(change.document.documentKind, change.document.id)
        const existing = records.get(rowId)
        if (change.baseRevision !== existing?.revision) {
          if (existing != null) {
            conflicts.push({
              reason: 'revision-mismatch',
              document: {
                documentKind: existing.documentKind,
                id: existing.id,
                revision: existing.revision,
              },
              serverRecord: structuredClone(existing),
            })
            continue
          }

          conflicts.push({
            reason: 'deleted-remotely',
            document: change.document,
          })
          continue
        }

        sequence += 1
        const deletedDocument = {
          documentKind: change.document.documentKind,
          id: change.document.id,
          revision: existing?.revision ?? change.document.revision,
        }
        records.delete(rowId)
        log.push({
          sequence,
          change: {
            operation: 'delete',
            document: deletedDocument,
            baseRevision: change.baseRevision,
            source: 'worker',
          },
        })
        applied.push(deletedDocument)
      }

      return {
        applied,
        conflicts,
        acceptedCursor: `cursor:sync:${sequence}`,
      }
    },
  }
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('declarative app sync record load batch size', () => {
  it('uses a default batch size with environment and explicit overrides', () => {
    expect(resolveDeclarativeAppSyncRecordLoadBatchSize()).toBe(50)
    expect(
      resolveDeclarativeAppSyncRecordLoadBatchSize({
        syncEnvironment: {
          VITE_DECLARATIVE_SYNC_RECORD_LOAD_BATCH_SIZE: '12',
        },
      }),
    ).toBe(12)
    expect(
      resolveDeclarativeAppSyncRecordLoadBatchSize({
        syncRecordLoadBatchSize: 8,
        syncEnvironment: {
          VITE_DECLARATIVE_SYNC_RECORD_LOAD_BATCH_SIZE: '12',
        },
      }),
    ).toBe(8)
    expect(
      resolveDeclarativeAppSyncRecordLoadBatchSize({
        syncEnvironment: {
          VITE_DECLARATIVE_SYNC_RECORD_LOAD_BATCH_SIZE: '0',
        },
      }),
    ).toBe(50)
    expect(
      resolveDeclarativeAppSyncRecordLoadBatchSize({
        syncRecordLoadBatchSize: 0.5,
        syncEnvironment: {
          VITE_DECLARATIVE_SYNC_RECORD_LOAD_BATCH_SIZE: '12',
        },
      }),
    ).toBe(12)
    expect(
      resolveDeclarativeAppSyncRecordLoadBatchSize({
        syncEnvironment: {
          VITE_DECLARATIVE_SYNC_RECORD_LOAD_BATCH_SIZE: '0.5',
        },
      }),
    ).toBe(50)
    expect(
      resolveDeclarativeAppSyncRecordLoadBatchSize({
        syncEnvironment: {
          VITE_DECLARATIVE_SYNC_RECORD_LOAD_BATCH_SIZE: '9999',
        },
      }),
    ).toBe(500)
  })
})

describe('declarative app sync repository component registry entries', () => {
  it('stores, lists, loads, watches, and deletes local component registry entries', async () => {
    const storageNamespace = `test.local-composites.${crypto.randomUUID()}`
    const repository = await initializeDeclarativeAppSyncRepository(app, {
      storageNamespace,
      syncTransport: {
        baseUrl: 'http://127.0.0.1:1',
      },
    })
    const events: string[] = []

    try {
      const unsubscribe = await repository.watchComponentRegistryEntries(event => {
        events.push(`${event.reason}:${event.result.items.length}`)
      })

      const saved = await repository.saveComponentRegistryEntry(localCompositeEntry)

      expect(saved.documentKind).toBe('component-registry-entry')
      expect(saved.document).toMatchObject({
        id: 'ui.composite.local-summary',
        slug: 'local-summary',
        meta: {
          compositeDefinition: {
            name: 'local-summary',
          },
        },
      })

      const list = await repository.listComponentRegistryEntries()
      expect(list).toHaveLength(1)
      expect(list[0]).toMatchObject({
        id: 'ui.composite.local-summary',
        slug: 'local-summary',
        scope: 'private',
        tags: ['local', 'summary'],
      })

      const loaded = await repository.loadComponentRegistryEntry('ui.composite.local-summary')
      expect(loaded).toMatchObject({
        documentKind: 'component-registry-entry',
        id: 'ui.composite.local-summary',
      })

      const deleted = await repository.deleteComponentRegistryEntry('ui.composite.local-summary', saved.revision)
      expect(deleted).toMatchObject({
        type: 'delete-document',
        deleted: true,
        documentKind: 'component-registry-entry',
        id: 'ui.composite.local-summary',
      })

      expect(await repository.listComponentRegistryEntries()).toEqual([])
      expect(events).toEqual(['initial:0', 'changed:1', 'deleted:0'])

      unsubscribe()
    } finally {
      await repository.destroy()
    }
  })

  it('syncs local-first component registry entry upserts to the remote adapter', async () => {
    const syncAdapter = createFakeRemoteSyncAdapter()
    const repository = await initializeDeclarativeAppSyncRepository(app, {
      storageNamespace: `test.local-composite-upsert.${crypto.randomUUID()}`,
      syncAdapter,
    })

    try {
      await repository.syncApps()

      await repository.saveComponentRegistryEntry(localCompositeEntry)
      const result = await repository.syncApps()

      expect(result).toMatchObject({
        pulled: 0,
        pushed: 1,
        conflicts: [],
      })
      expect(syncAdapter.getRecord('component-registry-entry', localCompositeEntry.id)).toMatchObject({
        documentKind: 'component-registry-entry',
        id: localCompositeEntry.id,
        document: {
          id: localCompositeEntry.id,
          kind: COMPONENT_REGISTRY_ENTRY_KIND,
          meta: {
            templateKind: 'composite',
            sourceKind: 'local',
          },
          persistence: {
            mutable: true,
            scope: 'repository',
          },
        },
      })
    } finally {
      await repository.destroy()
    }
  })

  it('syncs local-first component registry entry deletes to the remote adapter', async () => {
    const syncAdapter = createFakeRemoteSyncAdapter()
    const repository = await initializeDeclarativeAppSyncRepository(app, {
      storageNamespace: `test.local-composite-delete.${crypto.randomUUID()}`,
      syncAdapter,
    })

    try {
      await repository.syncApps()
      const saved = await repository.saveComponentRegistryEntry(localCompositeEntry)
      await repository.syncApps()

      await repository.deleteComponentRegistryEntry(localCompositeEntry.id, saved.revision)
      const result = await repository.syncApps()

      expect(result).toMatchObject({
        pulled: 0,
        pushed: 1,
        conflicts: [],
      })
      expect(syncAdapter.getRecord('component-registry-entry', localCompositeEntry.id)).toBeUndefined()
    } finally {
      await repository.destroy()
    }
  })

  it('reports component registry entry revision conflicts during local-first sync', async () => {
    const syncAdapter = createFakeRemoteSyncAdapter()
    const repository = await initializeDeclarativeAppSyncRepository(app, {
      storageNamespace: `test.local-composite-conflict.${crypto.randomUUID()}`,
      syncAdapter,
    })

    try {
      await repository.syncApps()
      const saved = await repository.saveComponentRegistryEntry(localCompositeEntry)
      await repository.syncApps()

      const remoteRecord = syncAdapter.getRecord('component-registry-entry', localCompositeEntry.id) as
        | FakeComponentRegistrySyncRecord
        | undefined
      expect(remoteRecord).toBeDefined()
      const remoteEntry: ComponentRegistryEntry = {
        ...localCompositeEntry,
        title: 'Remote Summary',
        discovery: {
          ...localCompositeEntry.discovery,
          summary: 'Remote update wins until conflict resolution is explicit.',
        },
      }
      await syncAdapter.pushChanges({
        changes: [
          {
            operation: 'upsert',
            record: {
              ...remoteRecord!,
              title: remoteEntry.title,
              document: remoteEntry,
            },
            baseRevision: remoteRecord!.revision,
            source: 'worker',
          },
        ],
      })

      await repository.saveComponentRegistryEntry(
        {
          ...localCompositeEntry,
          title: 'Local Summary Draft',
          discovery: {
            ...localCompositeEntry.discovery,
            summary: 'Local draft should conflict with the newer remote record.',
          },
        },
        saved.revision,
      )
      const result = await repository.syncApps()

      expect(result.pushed).toBe(0)
      expect(result.conflicts).toEqual([
        expect.objectContaining({
          reason: 'revision-mismatch',
          document: expect.objectContaining({
            documentKind: 'component-registry-entry',
            id: localCompositeEntry.id,
          }),
        }),
      ])
      expect(syncAdapter.getRecord('component-registry-entry', localCompositeEntry.id)).toMatchObject({
        document: {
          title: 'Remote Summary',
        },
      })
    } finally {
      await repository.destroy()
    }
  })

  it('initializes remote-only mode without touching OPFS', async () => {
    const getDirectory = vi.fn(() => {
      throw new Error('OPFS should not be initialized in remote-only mode')
    })
    vi.stubGlobal('navigator', {
      storage: {
        getDirectory,
      },
    })

    const repository = await initializeDeclarativeAppSyncRepository(app, {
      persistence: { mode: 'remote-only' },
      syncAdapter: createFakeRemoteSyncAdapter(),
    })

    try {
      expect(repository.storageMode).toBe('remote-only')
      expect(repository.persistenceMode).toBe('remote-only')
      expect(getDirectory).not.toHaveBeenCalled()
      await expect(repository.loadDocument(app.id!)).resolves.toMatchObject({
        documentKind: 'app',
        id: app.id,
      })

      const savedEntry = await repository.saveComponentRegistryEntry(localCompositeEntry)
      expect(savedEntry).toMatchObject({
        documentKind: 'component-registry-entry',
        id: localCompositeEntry.id,
        slug: localCompositeEntry.slug,
        scope: localCompositeEntry.ownership.scope,
        tags: localCompositeEntry.discovery.tags,
      })

      await expect(repository.loadComponentRegistryEntry(localCompositeEntry.id)).resolves.toMatchObject({
        documentKind: 'component-registry-entry',
        id: localCompositeEntry.id,
      })
      await expect(repository.listComponentRegistryEntries()).resolves.toEqual([
        expect.objectContaining({
          documentKind: 'component-registry-entry',
          id: localCompositeEntry.id,
        }),
      ])
      await expect(
        repository.deleteComponentRegistryEntry(localCompositeEntry.id, savedEntry.revision),
      ).resolves.toMatchObject({
        deleted: true,
        documentKind: 'component-registry-entry',
        id: localCompositeEntry.id,
      })
    } finally {
      await repository.destroy()
    }
  })
})
