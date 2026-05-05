import { describe, expect, it, vi } from 'vitest'
import { declarativeUiTabbedSupportPage } from './declarative-ui.examples'
import {
  createDeclarativePageSyncService,
  DeclarativeSyncAdapterError,
  type DeclarativePageSyncMetadata,
  type DeclarativeSyncAdapter,
  type DeclarativeSyncChangeEnvelope,
  type DeclarativeSyncPageRecord,
  type WorkerBackedDeclarativeRepository,
} from './index'

function createPageRecord(id: string, revision: string): DeclarativeSyncPageRecord {
  return {
    documentKind: 'page',
    id,
    revision,
    title: declarativeUiTabbedSupportPage.title,
    updatedAt: '2026-04-11T09:00:00.000Z',
    document: {
      ...structuredClone(declarativeUiTabbedSupportPage),
      id,
      title: declarativeUiTabbedSupportPage.title,
    },
  }
}

function createDeferred<T>() {
  let resolve!: (value: T | PromiseLike<T>) => void
  let reject!: (reason?: unknown) => void
  const promise = new Promise<T>((nextResolve, nextReject) => {
    resolve = nextResolve
    reject = nextReject
  })

  return {
    promise,
    reject,
    resolve,
  }
}

function createFakeRepository(initialRecords: DeclarativeSyncPageRecord[] = []) {
  const records = new Map(initialRecords.map(record => [record.id, structuredClone(record)]))
  const mutations: DeclarativeSyncChangeEnvelope[] = []
  const failNextPutIds = new Set<string>()
  let revisionCounter = 0

  const repository = {
    async mutate(mutation: Parameters<WorkerBackedDeclarativeRepository['mutate']>[0]) {
      if (mutation.type === 'put-document') {
        if (mutation.documentKind !== 'page' || mutation.document.kind !== 'page') {
          throw new Error(`Unexpected put-document in test fake: ${mutation.documentKind}`)
        }
        if (failNextPutIds.has(mutation.id)) {
          failNextPutIds.delete(mutation.id)
          throw new Error(`Failed to apply pulled page "${mutation.id}"`)
        }

        const nextRecord = createPageRecord(mutation.id, `rev_local_${revisionCounter++}`)
        nextRecord.document = structuredClone(mutation.document)
        nextRecord.title = mutation.document.title
        records.set(mutation.id, nextRecord)
        mutations.push({
          operation: 'upsert',
          record: structuredClone(nextRecord),
        })
        return {
          type: 'put-document',
          record: nextRecord,
        }
      }

      if (mutation.type !== 'delete-document' || mutation.documentKind !== 'page') {
        throw new Error(`Unexpected mutation in test fake: ${mutation.type}`)
      }

      const deletedRecord = records.get(mutation.id)
      records.delete(mutation.id)
      mutations.push({
        operation: 'delete',
        document: {
          documentKind: 'page',
          id: mutation.id,
          revision: deletedRecord?.revision ?? 'missing',
        },
      })
      return {
        type: 'delete-document',
        deleted: deletedRecord != null,
        deletedRevision: deletedRecord?.revision,
      }
    },
    destroy() {},
    getNotificationChannel() {
      throw new Error('not implemented in tests')
    },
    query: vi.fn(),
  } as unknown as WorkerBackedDeclarativeRepository

  return {
    failNextPutIds,
    listPageRecords: async () =>
      new Map(Array.from(records.entries(), ([id, record]) => [id, structuredClone(record)])),
    loadPageDocument: async (id: string) => {
      const record = records.get(id)
      return record != null ? structuredClone(record) : undefined
    },
    mutations,
    records,
    repository,
  }
}

describe('declarative page sync service', () => {
  it('recovers from an invalid persisted cursor and persists the reset state before retrying', async () => {
    const local = createFakeRepository()
    const persistCalls: Array<DeclarativePageSyncMetadata | undefined> = []
    const events: string[] = []
    const pullChanges = vi
      .fn<DeclarativeSyncAdapter['pullChanges']>()
      .mockImplementationOnce(async () => {
        events.push('pull:stale')
        throw new DeclarativeSyncAdapterError({
          code: 'invalid-cursor',
          message: 'cursor expired',
        })
      })
      .mockImplementationOnce(async () => {
        events.push('pull:reset')
        return {
          changes: [],
          hasMore: false,
          nextCursor: 'cursor:page:1',
        }
      })

    const service = createDeclarativePageSyncService({
      repository: local.repository,
      syncAdapter: {
        pullChanges,
        pushChanges: vi.fn().mockResolvedValue({
          acceptedCursor: 'cursor:page:0',
          applied: [],
          conflicts: [],
        }),
      },
      initialMetadata: {
        cursor: 'cursor:stale',
      },
      persistSyncMetadata: async syncMetadata => {
        events.push(`persist:${syncMetadata?.cursor ?? 'undefined'}`)
        persistCalls.push(structuredClone(syncMetadata))
      },
      loadPageDocument: local.loadPageDocument,
      listPageRecords: local.listPageRecords,
    })

    await expect(service.syncPages()).resolves.toMatchObject({
      pulled: 0,
      pushed: 0,
      hasMore: false,
    })

    expect(pullChanges).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        sinceCursor: 'cursor:stale',
      }),
    )
    expect(persistCalls).toContainEqual(undefined)
    expect(persistCalls.at(-1)).toEqual({
      cursor: 'cursor:page:1',
    })
    expect(pullChanges).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        sinceCursor: undefined,
      }),
    )
    expect(events).toEqual([
      'persist:cursor:stale',
      'pull:stale',
      'persist:undefined',
      'pull:reset',
      'persist:cursor:page:1',
    ])
  })

  it('restores the saved remote revision when canceling a pending delete', async () => {
    const localRecord = createPageRecord('support.dashboard', 'rev_local_1')
    const local = createFakeRepository([localRecord])
    const pushChanges = vi.fn<DeclarativeSyncAdapter['pushChanges']>().mockResolvedValue({
      acceptedCursor: 'cursor:page:1',
      applied: [],
      conflicts: [
        {
          reason: 'revision-mismatch',
          document: {
            documentKind: 'page',
            id: localRecord.id,
            revision: localRecord.revision,
          },
          serverRecord: createPageRecord(localRecord.id, 'rev_remote_2'),
        },
      ],
    })

    const service = createDeclarativePageSyncService({
      repository: local.repository,
      syncAdapter: {
        pullChanges: vi.fn().mockResolvedValue({
          changes: [],
          hasMore: false,
          nextCursor: 'cursor:page:1',
        }),
        pushChanges,
      },
      initialMetadata: {
        remoteRevisions: {
          [localRecord.id]: 'rev_remote_1',
        },
      },
      persistSyncMetadata: async () => {},
      loadPageDocument: local.loadPageDocument,
      listPageRecords: local.listPageRecords,
    })

    await service.markDeleted(localRecord.id)
    await service.clearPendingDelete(localRecord.id)
    await service.syncPages()

    expect(pushChanges).toHaveBeenCalledWith({
      changes: [
        expect.objectContaining({
          operation: 'upsert',
          baseRevision: 'rev_remote_1',
        }),
      ],
    })
  })

  it('deduplicates overlapping syncPages calls', async () => {
    const localRecord = createPageRecord('support.dashboard', 'rev_local_1')
    const local = createFakeRepository([localRecord])
    const deferredPush = createDeferred<Awaited<ReturnType<DeclarativeSyncAdapter['pushChanges']>>>()
    const pushChanges = vi.fn<DeclarativeSyncAdapter['pushChanges']>().mockReturnValue(deferredPush.promise)

    const service = createDeclarativePageSyncService({
      repository: local.repository,
      syncAdapter: {
        pullChanges: vi.fn().mockResolvedValue({
          changes: [],
          hasMore: false,
          nextCursor: 'cursor:page:1',
        }),
        pushChanges,
      },
      persistSyncMetadata: async () => {},
      loadPageDocument: local.loadPageDocument,
      listPageRecords: local.listPageRecords,
    })

    const firstSync = service.syncPages()
    const secondSync = service.syncPages()

    deferredPush.resolve({
      acceptedCursor: 'cursor:page:1',
      applied: [
        {
          documentKind: 'page',
          id: localRecord.id,
          revision: 'rev_remote_1',
        },
      ],
      conflicts: [],
    })

    await expect(firstSync).resolves.toEqual(await secondSync)
    expect(pushChanges).toHaveBeenCalledTimes(1)
  })

  it('serializes markDeleted behind an in-flight sync and preserves the pending remote delete state', async () => {
    const localRecord = createPageRecord('support.dashboard', 'rev_local_1')
    const local = createFakeRepository([localRecord])
    const persistCalls: Array<DeclarativePageSyncMetadata | undefined> = []
    const deferredPush = createDeferred<Awaited<ReturnType<DeclarativeSyncAdapter['pushChanges']>>>()
    const pushStarted = createDeferred<void>()
    const pushChanges = vi.fn<DeclarativeSyncAdapter['pushChanges']>().mockImplementationOnce(async () => {
      pushStarted.resolve()
      return deferredPush.promise
    })

    const service = createDeclarativePageSyncService({
      repository: local.repository,
      syncAdapter: {
        pullChanges: vi.fn().mockResolvedValue({
          changes: [],
          hasMore: false,
          nextCursor: 'cursor:page:1',
        }),
        pushChanges,
      },
      initialMetadata: {
        remoteRevisions: {
          [localRecord.id]: 'rev_remote_0',
        },
      },
      persistSyncMetadata: async syncMetadata => {
        persistCalls.push(structuredClone(syncMetadata))
      },
      loadPageDocument: local.loadPageDocument,
      listPageRecords: local.listPageRecords,
    })

    const firstSync = service.syncPages()
    await pushStarted.promise
    local.records.delete(localRecord.id)
    const markDeleted = service.markDeleted(localRecord.id)
    const markDeletedSettled = vi.fn()
    void markDeleted.then(markDeletedSettled)

    await Promise.resolve()
    await Promise.resolve()
    expect(markDeletedSettled).not.toHaveBeenCalled()

    deferredPush.resolve({
      acceptedCursor: 'cursor:page:1',
      applied: [
        {
          documentKind: 'page',
          id: localRecord.id,
          revision: 'rev_remote_1',
        },
      ],
      conflicts: [],
    })

    await firstSync
    await markDeleted

    expect(markDeletedSettled).toHaveBeenCalledTimes(1)
    expect(pushChanges).toHaveBeenCalledTimes(1)
    expect(persistCalls.at(-1)).toEqual({
      cursor: 'cursor:page:1',
      lastSyncedLocalRevisions: {
        [localRecord.id]: localRecord.revision,
      },
      pendingDeleteBaseRevisions: {
        [localRecord.id]: 'rev_remote_1',
      },
    })
  })

  it('does not advance the cursor when applying pulled changes fails', async () => {
    const local = createFakeRepository()
    local.failNextPutIds.add('support.remote')
    const pullChanges = vi.fn<DeclarativeSyncAdapter['pullChanges']>().mockResolvedValue({
      changes: [
        {
          operation: 'upsert',
          record: createPageRecord('support.remote', 'rev_remote_1'),
        },
      ],
      hasMore: false,
      nextCursor: 'cursor:page:1',
    })

    const service = createDeclarativePageSyncService({
      repository: local.repository,
      syncAdapter: {
        pullChanges,
        pushChanges: vi.fn().mockResolvedValue({
          acceptedCursor: undefined,
          applied: [],
          conflicts: [],
        }),
      },
      persistSyncMetadata: async () => {},
      loadPageDocument: local.loadPageDocument,
      listPageRecords: local.listPageRecords,
    })

    await expect(service.syncPages()).rejects.toThrow('Failed to apply pulled page "support.remote"')
    await service.syncPages()

    expect(pullChanges).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        sinceCursor: undefined,
      }),
    )
    expect(pullChanges).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        sinceCursor: undefined,
      }),
    )
  })
})
