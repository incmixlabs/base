import type { ComponentRegistryEntry } from './component-registry'
import type { WorkerBackedDeclarativeRepository } from './declarative-repository-worker'
import {
  type DeclarativeSyncAdapter,
  DeclarativeSyncAdapterError,
  type DeclarativeSyncChangeEnvelope,
  type DeclarativeSyncConflict,
  type DeclarativeSyncDocumentRecord,
  type DeclarativeSyncPullResponse,
  type DeclarativeSyncSupportedDocumentKind,
} from './declarative-sync-boundary'
import type { AppDocument } from './declarative-ui'

const DECLARATIVE_APP_SYNC_DOCUMENT_KINDS = [
  'app',
  'component-registry-entry',
] as const satisfies readonly DeclarativeSyncSupportedDocumentKind[]

export type DeclarativeAppSyncDocumentKind = (typeof DECLARATIVE_APP_SYNC_DOCUMENT_KINDS)[number]
export type DeclarativeAppSyncDocumentRecord =
  | Extract<DeclarativeSyncDocumentRecord, { documentKind: 'app' }>
  | Extract<DeclarativeSyncDocumentRecord, { documentKind: 'component-registry-entry' }>

export type DeclarativeAppSyncMetadata = {
  cursor?: string
  remoteRevisions?: Record<string, string>
  lastSyncedLocalRevisions?: Record<string, string>
  pendingDeleteBaseRevisions?: Record<string, string | null>
}

export type DeclarativeAppSyncResult = {
  pulled: number
  pushed: number
  conflicts: DeclarativeSyncConflict[]
  hasMore: boolean
}

type PersistSyncMetadata = (syncMetadata: DeclarativeAppSyncMetadata | undefined) => Promise<void>

type CreateDeclarativeAppSyncServiceOptions = {
  repository: WorkerBackedDeclarativeRepository
  syncAdapter: DeclarativeSyncAdapter
  initialMetadata?: DeclarativeAppSyncMetadata
  persistSyncMetadata: PersistSyncMetadata
  loadSyncDocument: (
    documentKind: DeclarativeAppSyncDocumentKind,
    id: string,
  ) => Promise<DeclarativeAppSyncDocumentRecord | undefined>
  listSyncRecords: () => Promise<Map<string, DeclarativeAppSyncDocumentRecord>>
}

export type DeclarativeAppSyncService = {
  clearPendingDelete(id: string): Promise<void>
  clearPendingDocumentDelete(documentKind: DeclarativeAppSyncDocumentKind, id: string): Promise<void>
  markDeleted(id: string): Promise<void>
  markDocumentDeleted(documentKind: DeclarativeAppSyncDocumentKind, id: string): Promise<void>
  syncApps(): Promise<DeclarativeAppSyncResult>
}

function isAppSyncDocumentKind(documentKind: string): documentKind is DeclarativeAppSyncDocumentKind {
  return (DECLARATIVE_APP_SYNC_DOCUMENT_KINDS as readonly string[]).includes(documentKind)
}

function getSyncDocumentKey(documentKind: DeclarativeAppSyncDocumentKind, id: string): string {
  return `${documentKind}:${id}`
}

function parseSyncDocumentKey(key: string): {
  documentKind: DeclarativeAppSyncDocumentKind
  id: string
} {
  const separatorIndex = key.indexOf(':')
  if (separatorIndex > 0) {
    const documentKind = key.slice(0, separatorIndex)
    const id = key.slice(separatorIndex + 1)
    if (id.length > 0 && isAppSyncDocumentKind(documentKind)) {
      return { documentKind, id }
    }
  }

  return { documentKind: 'app', id: key }
}

function normalizeSyncDocumentKey(key: string): string {
  const { documentKind, id } = parseSyncDocumentKey(key)
  return getSyncDocumentKey(documentKind, id)
}

function createStringRevisionMap(record: Record<string, string> | undefined): Map<string, string> {
  return new Map(Object.entries(record ?? {}).map(([key, revision]) => [normalizeSyncDocumentKey(key), revision]))
}

function createPendingDeleteRevisionMap(
  record: Record<string, string | null> | undefined,
): Map<string, string | undefined> {
  return new Map(
    Object.entries(record ?? {}).map(([key, revision]) => [normalizeSyncDocumentKey(key), revision ?? undefined]),
  )
}

function toPersistedSyncMetadata(state: {
  syncCursor: string | undefined
  remoteRevisions: Map<string, string>
  lastSyncedLocalRevisions: Map<string, string>
  pendingDeleteBaseRevisions: Map<string, string | undefined>
}): DeclarativeAppSyncMetadata | undefined {
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

export function createDeclarativeAppSyncService({
  repository,
  syncAdapter,
  initialMetadata,
  persistSyncMetadata,
  loadSyncDocument,
  listSyncRecords,
}: CreateDeclarativeAppSyncServiceOptions): DeclarativeAppSyncService {
  const remoteRevisions = createStringRevisionMap(initialMetadata?.remoteRevisions)
  const lastSyncedLocalRevisions = createStringRevisionMap(initialMetadata?.lastSyncedLocalRevisions)
  const pendingDeleteBaseRevisions = createPendingDeleteRevisionMap(initialMetadata?.pendingDeleteBaseRevisions)
  let syncCursor: string | undefined = initialMetadata?.cursor
  let syncInFlight: Promise<DeclarativeAppSyncResult> | null = null
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
    conflictedDocumentKeys: Set<string>,
  ): Promise<number> {
    let appliedCount = 0

    for (const change of changes) {
      if (change.operation === 'upsert') {
        if (!isAppSyncDocumentKind(change.record.documentKind)) {
          continue
        }
        const documentKey = getSyncDocumentKey(change.record.documentKind, change.record.id)
        if (conflictedDocumentKeys.has(documentKey)) {
          continue
        }

        const result =
          change.record.documentKind === 'app'
            ? await repository.mutate({
                type: 'put-document',
                documentKind: 'app',
                id: change.record.id,
                document: change.record.document as AppDocument,
              })
            : await repository.mutate({
                type: 'put-document',
                documentKind: 'component-registry-entry',
                id: change.record.id,
                document: change.record.document as ComponentRegistryEntry,
              })
        if (result.type !== 'put-document' || result.record.documentKind !== change.record.documentKind) {
          throw new Error(`Failed to apply pulled ${change.record.documentKind} "${change.record.id}"`)
        }

        remoteRevisions.set(documentKey, change.record.revision)
        lastSyncedLocalRevisions.set(documentKey, result.record.revision)
        pendingDeleteBaseRevisions.delete(documentKey)
        appliedCount += 1
        continue
      }

      if (!isAppSyncDocumentKind(change.document.documentKind)) {
        continue
      }
      const documentKey = getSyncDocumentKey(change.document.documentKind, change.document.id)
      if (conflictedDocumentKeys.has(documentKey)) {
        continue
      }

      const result = await repository.mutate({
        type: 'delete-document',
        documentKind: change.document.documentKind,
        id: change.document.id,
      })
      if (result.type !== 'delete-document') {
        throw new Error(`Failed to apply pulled delete for ${change.document.documentKind} "${change.document.id}"`)
      }

      remoteRevisions.delete(documentKey)
      lastSyncedLocalRevisions.delete(documentKey)
      pendingDeleteBaseRevisions.delete(documentKey)
      appliedCount += 1
    }

    return appliedCount
  }

  async function clearPendingDocumentDelete(documentKind: DeclarativeAppSyncDocumentKind, id: string): Promise<void> {
    return runExclusive(async () => {
      const documentKey = getSyncDocumentKey(documentKind, id)
      const baseRevision = pendingDeleteBaseRevisions.get(documentKey)
      pendingDeleteBaseRevisions.delete(documentKey)
      if (baseRevision != null) {
        remoteRevisions.set(documentKey, baseRevision)
      }
      await persistState()
    })
  }

  async function markDocumentDeleted(documentKind: DeclarativeAppSyncDocumentKind, id: string): Promise<void> {
    return runExclusive(async () => {
      const documentKey = getSyncDocumentKey(documentKind, id)
      const localRecord = await loadSyncDocument(documentKind, id)
      pendingDeleteBaseRevisions.set(documentKey, remoteRevisions.get(documentKey))
      if (localRecord != null) {
        lastSyncedLocalRevisions.delete(documentKey)
      }
      remoteRevisions.delete(documentKey)
      await persistState()
    })
  }

  return {
    async clearPendingDelete(id) {
      return clearPendingDocumentDelete('app', id)
    },
    async clearPendingDocumentDelete(documentKind, id) {
      return clearPendingDocumentDelete(documentKind, id)
    },
    async markDeleted(id) {
      return markDocumentDeleted('app', id)
    },
    async markDocumentDeleted(documentKind, id) {
      return markDocumentDeleted(documentKind, id)
    },
    async syncApps() {
      if (syncInFlight != null) {
        return syncInFlight
      }

      syncInFlight = runExclusive(async () => {
        const localRecordsBeforePush = await listSyncRecords()
        const pushChanges: DeclarativeSyncChangeEnvelope[] = []

        for (const [documentKey, baseRevision] of pendingDeleteBaseRevisions) {
          const { documentKind, id } = parseSyncDocumentKey(documentKey)
          pushChanges.push({
            operation: 'delete',
            document: {
              documentKind,
              id,
              revision: baseRevision ?? 'deleted-locally',
            },
            baseRevision,
            source: 'same-tab',
          })
        }

        for (const record of localRecordsBeforePush.values()) {
          const documentKey = getSyncDocumentKey(record.documentKind, record.id)
          if (pendingDeleteBaseRevisions.has(documentKey)) {
            continue
          }
          if (lastSyncedLocalRevisions.get(documentKey) === record.revision) {
            continue
          }
          pushChanges.push({
            operation: 'upsert',
            record,
            baseRevision: remoteRevisions.get(documentKey),
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

        const conflictedDocumentKeys = new Set<string>()
        for (const conflict of pushResult.conflicts) {
          if (isAppSyncDocumentKind(conflict.document.documentKind)) {
            conflictedDocumentKeys.add(getSyncDocumentKey(conflict.document.documentKind, conflict.document.id))
          }
        }
        for (const conflict of pushResult.conflicts) {
          if (!isAppSyncDocumentKind(conflict.document.documentKind)) {
            continue
          }
          const documentKey = getSyncDocumentKey(conflict.document.documentKind, conflict.document.id)
          if (conflict.reason === 'revision-mismatch') {
            if (pendingDeleteBaseRevisions.has(documentKey)) {
              pendingDeleteBaseRevisions.set(documentKey, conflict.serverRecord.revision)
            } else {
              remoteRevisions.set(documentKey, conflict.serverRecord.revision)
            }
          }
        }

        for (const applied of pushResult.applied) {
          if (!isAppSyncDocumentKind(applied.documentKind)) {
            continue
          }
          const documentKey = getSyncDocumentKey(applied.documentKind, applied.id)
          if (pendingDeleteBaseRevisions.has(documentKey)) {
            pendingDeleteBaseRevisions.delete(documentKey)
            lastSyncedLocalRevisions.delete(documentKey)
            remoteRevisions.delete(documentKey)
            continue
          }

          const localRecord = localRecordsBeforePush.get(documentKey)
          if (localRecord != null) {
            lastSyncedLocalRevisions.set(documentKey, localRecord.revision)
          }
          remoteRevisions.set(documentKey, applied.revision)
        }

        await persistState()

        let pullResult: DeclarativeSyncPullResponse
        try {
          pullResult = await syncAdapter.pullChanges({
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
            sinceCursor: undefined,
            limit: 50,
          })
        }

        const pulled = await applyPulledChanges(pullResult.changes, conflictedDocumentKeys)
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
