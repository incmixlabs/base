import type { WorkerBackedDeclarativeRepository } from './declarative-repository-worker'
import {
  type DeclarativeSyncAdapter,
  DeclarativeSyncAdapterError,
  type DeclarativeSyncChangeEnvelope,
  type DeclarativeSyncConflict,
  type DeclarativeSyncPageRecord,
  type DeclarativeSyncPullResponse,
} from './declarative-sync-boundary'

export type DeclarativePageSyncMetadata = {
  cursor?: string
  remoteRevisions?: Record<string, string>
  lastSyncedLocalRevisions?: Record<string, string>
  pendingDeleteBaseRevisions?: Record<string, string | null>
}

export type DeclarativePageSyncResult = {
  pulled: number
  pushed: number
  conflicts: DeclarativeSyncConflict[]
  hasMore: boolean
}

type PersistSyncMetadata = (syncMetadata: DeclarativePageSyncMetadata | undefined) => Promise<void>

type CreateDeclarativePageSyncServiceOptions = {
  repository: WorkerBackedDeclarativeRepository
  syncAdapter: DeclarativeSyncAdapter
  initialMetadata?: DeclarativePageSyncMetadata
  persistSyncMetadata: PersistSyncMetadata
  loadPageDocument: (id: string) => Promise<DeclarativeSyncPageRecord | undefined>
  listPageRecords: () => Promise<Map<string, DeclarativeSyncPageRecord>>
}

export type DeclarativePageSyncService = {
  clearPendingDelete(id: string): Promise<void>
  markDeleted(id: string): Promise<void>
  syncPages(): Promise<DeclarativePageSyncResult>
}

function toPersistedSyncMetadata(state: {
  syncCursor: string | undefined
  remoteRevisions: Map<string, string>
  lastSyncedLocalRevisions: Map<string, string>
  pendingDeleteBaseRevisions: Map<string, string | undefined>
}): DeclarativePageSyncMetadata | undefined {
  const { lastSyncedLocalRevisions, pendingDeleteBaseRevisions, remoteRevisions, syncCursor } = state

  return syncCursor != null ||
    remoteRevisions.size > 0 ||
    lastSyncedLocalRevisions.size > 0 ||
    pendingDeleteBaseRevisions.size > 0
    ? {
        ...(syncCursor != null ? { cursor: syncCursor } : {}),
        ...(remoteRevisions.size > 0 ? { remoteRevisions: Object.fromEntries(remoteRevisions.entries()) } : {}),
        ...(lastSyncedLocalRevisions.size > 0
          ? { lastSyncedLocalRevisions: Object.fromEntries(lastSyncedLocalRevisions.entries()) }
          : {}),
        ...(pendingDeleteBaseRevisions.size > 0
          ? {
              pendingDeleteBaseRevisions: Object.fromEntries(
                Array.from(pendingDeleteBaseRevisions.entries(), ([id, revision]) => [id, revision ?? null]),
              ),
            }
          : {}),
      }
    : undefined
}

export function createDeclarativePageSyncService({
  repository,
  syncAdapter,
  initialMetadata,
  persistSyncMetadata,
  loadPageDocument,
  listPageRecords,
}: CreateDeclarativePageSyncServiceOptions): DeclarativePageSyncService {
  const remoteRevisions = new Map<string, string>(Object.entries(initialMetadata?.remoteRevisions ?? {}))
  const lastSyncedLocalRevisions = new Map<string, string>(
    Object.entries(initialMetadata?.lastSyncedLocalRevisions ?? {}),
  )
  const pendingDeleteBaseRevisions = new Map<string, string | undefined>(
    Object.entries(initialMetadata?.pendingDeleteBaseRevisions ?? {}).map(([id, revision]) => [
      id,
      revision ?? undefined,
    ]),
  )
  let syncCursor: string | undefined = initialMetadata?.cursor
  let syncInFlight: Promise<DeclarativePageSyncResult> | null = null
  let operationQueue: Promise<void> = Promise.resolve()

  async function persistState(): Promise<void> {
    await persistSyncMetadata(
      toPersistedSyncMetadata({
        syncCursor,
        remoteRevisions,
        lastSyncedLocalRevisions,
        pendingDeleteBaseRevisions,
      }),
    )
  }

  function runExclusive<T>(operation: () => Promise<T>): Promise<T> {
    const result = operationQueue.then(operation, operation)
    operationQueue = result.then(
      () => undefined,
      () => undefined,
    )
    return result
  }

  async function applyPulledChanges(
    changes: DeclarativeSyncChangeEnvelope[],
    conflictedIds: Set<string>,
  ): Promise<number> {
    let appliedCount = 0

    for (const change of changes) {
      if (change.operation === 'upsert') {
        if (change.record.documentKind !== 'page') {
          throw new Error(`Page sync service cannot apply pulled ${change.record.documentKind} "${change.record.id}"`)
        }
        if (conflictedIds.has(change.record.id)) {
          continue
        }

        const result = await repository.mutate({
          type: 'put-document',
          documentKind: 'page',
          id: change.record.id,
          document: change.record.document,
        })
        if (result.type !== 'put-document' || result.record.documentKind !== 'page') {
          throw new Error(`Failed to apply pulled page "${change.record.id}"`)
        }

        remoteRevisions.set(change.record.id, change.record.revision)
        lastSyncedLocalRevisions.set(change.record.id, result.record.revision)
        pendingDeleteBaseRevisions.delete(change.record.id)
        appliedCount += 1
        continue
      }

      if (change.document.documentKind !== 'page') {
        throw new Error(`Page sync service cannot apply pulled ${change.document.documentKind} "${change.document.id}"`)
      }
      if (conflictedIds.has(change.document.id)) {
        continue
      }

      const result = await repository.mutate({
        type: 'delete-document',
        documentKind: 'page',
        id: change.document.id,
      })
      if (result.type !== 'delete-document') {
        throw new Error(`Failed to apply pulled delete for page "${change.document.id}"`)
      }

      remoteRevisions.delete(change.document.id)
      lastSyncedLocalRevisions.delete(change.document.id)
      pendingDeleteBaseRevisions.delete(change.document.id)
      appliedCount += 1
    }

    return appliedCount
  }

  return {
    async clearPendingDelete(id) {
      return runExclusive(async () => {
        const baseRevision = pendingDeleteBaseRevisions.get(id)
        pendingDeleteBaseRevisions.delete(id)
        if (baseRevision != null) {
          remoteRevisions.set(id, baseRevision)
        }
        await persistState()
      })
    },
    async markDeleted(id) {
      return runExclusive(async () => {
        const localRecord = await loadPageDocument(id)
        pendingDeleteBaseRevisions.set(id, remoteRevisions.get(id))
        if (localRecord != null) {
          lastSyncedLocalRevisions.delete(id)
        }
        remoteRevisions.delete(id)
        await persistState()
      })
    },
    async syncPages() {
      if (syncInFlight != null) {
        return syncInFlight
      }

      syncInFlight = runExclusive(async () => {
        const localRecordsBeforePush = await listPageRecords()
        const pushChanges: DeclarativeSyncChangeEnvelope[] = []

        for (const [id, baseRevision] of pendingDeleteBaseRevisions) {
          pushChanges.push({
            operation: 'delete',
            document: {
              documentKind: 'page',
              id,
              revision: baseRevision ?? 'deleted-locally',
            },
            baseRevision,
            source: 'same-tab',
          })
        }

        for (const record of localRecordsBeforePush.values()) {
          if (pendingDeleteBaseRevisions.has(record.id)) {
            continue
          }
          if (lastSyncedLocalRevisions.get(record.id) === record.revision) {
            continue
          }
          pushChanges.push({
            operation: 'upsert',
            record,
            baseRevision: remoteRevisions.get(record.id),
            source: 'same-tab',
          })
        }

        const pushResult =
          pushChanges.length === 0
            ? { applied: [], conflicts: [], acceptedCursor: syncCursor }
            : await syncAdapter.pushChanges({ changes: pushChanges })

        if (pushResult.acceptedCursor != null) {
          syncCursor = pushResult.acceptedCursor
        }

        const conflictedIds = new Set(pushResult.conflicts.map(conflict => conflict.document.id))
        for (const conflict of pushResult.conflicts) {
          if (conflict.reason === 'revision-mismatch') {
            if (pendingDeleteBaseRevisions.has(conflict.document.id)) {
              pendingDeleteBaseRevisions.set(conflict.document.id, conflict.serverRecord.revision)
            } else {
              remoteRevisions.set(conflict.document.id, conflict.serverRecord.revision)
            }
          }
        }

        for (const applied of pushResult.applied) {
          if (pendingDeleteBaseRevisions.has(applied.id)) {
            pendingDeleteBaseRevisions.delete(applied.id)
            lastSyncedLocalRevisions.delete(applied.id)
            remoteRevisions.delete(applied.id)
            continue
          }

          const localRecord = localRecordsBeforePush.get(applied.id)
          if (localRecord != null) {
            lastSyncedLocalRevisions.set(applied.id, localRecord.revision)
          }
          remoteRevisions.set(applied.id, applied.revision)
        }

        await persistState()

        let pullResult: DeclarativeSyncPullResponse
        try {
          pullResult = await syncAdapter.pullChanges({
            documentKind: 'page',
            sinceCursor: syncCursor,
            limit: 50,
          })
        } catch (error) {
          if (!(error instanceof DeclarativeSyncAdapterError) || error.code !== 'invalid-cursor') {
            throw error
          }

          syncCursor = undefined
          await persistState()
          pullResult = await syncAdapter.pullChanges({
            documentKind: 'page',
            sinceCursor: undefined,
            limit: 50,
          })
        }

        const pulled = await applyPulledChanges(pullResult.changes, conflictedIds)
        syncCursor = pullResult.nextCursor
        await persistState()

        return {
          pulled,
          pushed: pushResult.applied.length,
          conflicts: pushResult.conflicts,
          hasMore: pullResult.hasMore,
        }
      })

      try {
        return await syncInFlight
      } finally {
        syncInFlight = null
      }
    },
  }
}
