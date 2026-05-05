import type {
  DeclarativeSyncAdapter,
  DeclarativeSyncChangeEnvelope,
  DeclarativeSyncConflict,
  DeclarativeSyncDocumentRecord,
  DeclarativeSyncPullRequest,
  DeclarativeSyncPullResponse,
  DeclarativeSyncPushRequest,
  DeclarativeSyncPushResponse,
} from './declarative-sync-boundary'
import { DeclarativeSyncAdapterError, isDeclarativeSyncSupportedDocumentKind } from './declarative-sync-boundary'

type SyncLogEntry = {
  sequence: number
  change: DeclarativeSyncChangeEnvelope
}

export type CreateFixtureDeclarativeSyncAdapterOptions = {
  bootstrapChanges?: DeclarativeSyncChangeEnvelope[]
  now?: () => string
}

function buildCursor(sequence: number): string {
  return `cursor:sync:${sequence}`
}

function parseCursor(cursor: string | undefined): number {
  if (cursor == null) {
    return 0
  }

  const match = /^cursor:(?:page|sync):(\d+)$/.exec(cursor)
  if (match == null) {
    throw new DeclarativeSyncAdapterError({
      code: 'invalid-cursor',
      message: `Invalid sync cursor "${cursor}"`,
    })
  }

  return Number(match[1])
}

function normalizeLimit(limit: number | undefined, fallback: number): number {
  if (limit == null) {
    return fallback
  }

  if (!Number.isInteger(limit) || limit <= 0) {
    throw new DeclarativeSyncAdapterError({
      code: 'invalid-request',
      message: `Invalid sync pull limit "${limit}"`,
    })
  }

  return limit
}

function buildDocumentKey(documentKind: DeclarativeSyncDocumentRecord['documentKind'], id: string): string {
  return `${documentKind}:${id}`
}

function cloneDocumentRecord(record: DeclarativeSyncDocumentRecord): DeclarativeSyncDocumentRecord {
  return structuredClone(record)
}

export function createFixtureDeclarativeSyncAdapter(
  options: CreateFixtureDeclarativeSyncAdapterOptions = {},
): DeclarativeSyncAdapter {
  const now = options.now ?? (() => new Date().toISOString())
  const documents = new Map<string, DeclarativeSyncDocumentRecord>()
  const log: SyncLogEntry[] = []
  let sequence = 0
  let bootstrapApplied = false

  function appendChange(change: DeclarativeSyncChangeEnvelope) {
    sequence += 1
    log.push({
      sequence,
      change: structuredClone(change),
    })
  }

  function applyBootstrapChanges() {
    if (bootstrapApplied) {
      return
    }

    bootstrapApplied = true
    for (const change of options.bootstrapChanges ?? []) {
      if (change.operation === 'upsert') {
        documents.set(
          buildDocumentKey(change.record.documentKind, change.record.id),
          cloneDocumentRecord(change.record),
        )
      } else {
        documents.delete(buildDocumentKey(change.document.documentKind, change.document.id))
      }
      appendChange(change)
    }
  }

  return {
    async pullChanges(request: DeclarativeSyncPullRequest): Promise<DeclarativeSyncPullResponse> {
      applyBootstrapChanges()

      const sinceSequence = parseCursor(request.sinceCursor)
      const pending = log.filter(entry => {
        if (entry.sequence <= sinceSequence) {
          return false
        }
        if (request.documentKind == null) {
          return true
        }
        if (entry.change.operation === 'upsert') {
          return entry.change.record.documentKind === request.documentKind
        }
        return entry.change.document.documentKind === request.documentKind
      })
      const limit = normalizeLimit(request.limit, pending.length)
      const visible = pending.slice(0, limit)

      return {
        changes: visible.map(entry => structuredClone(entry.change)),
        nextCursor: buildCursor(visible.at(-1)?.sequence ?? sequence),
        hasMore: pending.length > visible.length,
      }
    },

    async pushChanges(request: DeclarativeSyncPushRequest): Promise<DeclarativeSyncPushResponse> {
      for (const change of request.changes) {
        const kind = change.operation === 'upsert' ? change.record.documentKind : change.document.documentKind
        if (!isDeclarativeSyncSupportedDocumentKind(kind)) {
          throw new DeclarativeSyncAdapterError({
            code: 'invalid-request',
            message: `Unsupported document kind "${kind}" for fixture adapter.`,
          })
        }
      }

      const applied: DeclarativeSyncPushResponse['applied'] = []
      const conflicts: DeclarativeSyncConflict[] = []

      for (const change of request.changes) {
        if (change.operation === 'upsert') {
          const existing = documents.get(buildDocumentKey(change.record.documentKind, change.record.id))

          if (change.baseRevision !== undefined && existing == null) {
            conflicts.push({
              reason: 'deleted-remotely',
              document: {
                documentKind: change.record.documentKind,
                id: change.record.id,
                revision: change.baseRevision,
              },
              message: `Remote ${change.record.documentKind} "${change.record.id}" no longer exists.`,
            })
            continue
          }

          if (change.baseRevision !== undefined && existing != null && existing.revision !== change.baseRevision) {
            conflicts.push({
              reason: 'revision-mismatch',
              document: {
                documentKind: change.record.documentKind,
                id: change.record.id,
                revision: change.record.revision,
              },
              serverRecord: cloneDocumentRecord(existing),
              message: `Remote ${change.record.documentKind} "${change.record.id}" has advanced beyond revision ${change.baseRevision}.`,
            })
            continue
          }

          const acceptedRecord: DeclarativeSyncDocumentRecord = {
            ...cloneDocumentRecord(change.record),
            revision: `rev_remote_${sequence + 1}`,
            updatedAt: now(),
          }
          documents.set(buildDocumentKey(acceptedRecord.documentKind, acceptedRecord.id), acceptedRecord)
          appendChange({
            operation: 'upsert',
            record: acceptedRecord,
            baseRevision: change.baseRevision,
            source: 'worker',
          })
          applied.push({
            documentKind: acceptedRecord.documentKind,
            id: acceptedRecord.id,
            revision: acceptedRecord.revision,
          })
          continue
        }

        const existing = documents.get(buildDocumentKey(change.document.documentKind, change.document.id))

        if (change.baseRevision !== undefined && existing == null) {
          conflicts.push({
            reason: 'deleted-remotely',
            document: {
              documentKind: change.document.documentKind,
              id: change.document.id,
              revision: change.baseRevision,
            },
            message: `Remote ${change.document.documentKind} "${change.document.id}" was already deleted.`,
          })
          continue
        }

        if (change.baseRevision !== undefined && existing != null && existing.revision !== change.baseRevision) {
          conflicts.push({
            reason: 'revision-mismatch',
            document: {
              documentKind: change.document.documentKind,
              id: change.document.id,
              revision: change.document.revision,
            },
            serverRecord: cloneDocumentRecord(existing),
            message: `Remote ${change.document.documentKind} "${change.document.id}" has advanced beyond revision ${change.baseRevision}.`,
          })
          continue
        }

        documents.delete(buildDocumentKey(change.document.documentKind, change.document.id))
        appendChange({
          operation: 'delete',
          document: {
            documentKind: change.document.documentKind,
            id: change.document.id,
            revision: existing?.revision ?? change.document.revision,
          },
          baseRevision: change.baseRevision,
          source: 'worker',
        })
        applied.push({
          documentKind: change.document.documentKind,
          id: change.document.id,
          revision: existing?.revision ?? change.document.revision,
        })
      }

      return {
        applied,
        conflicts,
        acceptedCursor: buildCursor(sequence),
      }
    },
  }
}
