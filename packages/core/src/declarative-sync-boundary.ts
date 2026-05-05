import type {
  DeclarativeRepositoryDocumentRecord,
  DeclarativeRepositoryDocumentSummary,
  DeclarativeRepositoryNotificationSource,
} from './worker-repository-boundary'

export type DeclarativeSyncErrorCode =
  | 'conflict'
  | 'invalid-cursor'
  | 'invalid-request'
  | 'auth'
  | 'rate-limited'
  | 'transient'
  | 'fatal'

export type DeclarativeSyncConflictReason = 'revision-mismatch' | 'deleted-remotely' | 'incompatible-document'

export type DeclarativeSyncChangeOperation = 'upsert' | 'delete'

export type DeclarativeSyncCursor = string

export const DECLARATIVE_SYNC_SUPPORTED_DOCUMENT_KINDS = ['app', 'page', 'component-registry-entry'] as const

export type DeclarativeSyncSupportedDocumentKind = (typeof DECLARATIVE_SYNC_SUPPORTED_DOCUMENT_KINDS)[number]

export function isDeclarativeSyncSupportedDocumentKind(
  documentKind: string,
): documentKind is DeclarativeSyncSupportedDocumentKind {
  return (DECLARATIVE_SYNC_SUPPORTED_DOCUMENT_KINDS as readonly string[]).includes(documentKind)
}

export type DeclarativeSyncDocumentRecord = Extract<
  DeclarativeRepositoryDocumentRecord,
  { documentKind: DeclarativeSyncSupportedDocumentKind }
>
export type DeclarativeSyncAppRecord = Extract<DeclarativeSyncDocumentRecord, { documentKind: 'app' }>
export type DeclarativeSyncPageRecord = Extract<DeclarativeSyncDocumentRecord, { documentKind: 'page' }>

export type DeclarativeSyncDocumentDescriptor = Pick<
  DeclarativeRepositoryDocumentSummary,
  'documentKind' | 'id' | 'revision'
> & { documentKind: DeclarativeSyncSupportedDocumentKind }

export type DeclarativeSyncChangeEnvelope =
  | {
      operation: Extract<DeclarativeSyncChangeOperation, 'upsert'>
      record: DeclarativeSyncDocumentRecord
      baseRevision?: string
      source?: DeclarativeRepositoryNotificationSource
    }
  | {
      operation: Extract<DeclarativeSyncChangeOperation, 'delete'>
      document: DeclarativeSyncDocumentDescriptor
      baseRevision?: string
      source?: DeclarativeRepositoryNotificationSource
    }

export type DeclarativeSyncPullRequest = {
  documentKind?: DeclarativeSyncSupportedDocumentKind
  sinceCursor?: DeclarativeSyncCursor
  limit?: number
}

export type DeclarativeSyncPullResponse = {
  changes: DeclarativeSyncChangeEnvelope[]
  nextCursor: DeclarativeSyncCursor
  hasMore: boolean
}

export type DeclarativeSyncConflict =
  | {
      reason: 'revision-mismatch'
      document: DeclarativeSyncDocumentDescriptor
      serverRecord: DeclarativeRepositoryDocumentRecord
      message?: string
    }
  | {
      reason: Exclude<DeclarativeSyncConflictReason, 'revision-mismatch'>
      document: DeclarativeSyncDocumentDescriptor
      serverRecord?: DeclarativeRepositoryDocumentRecord
      message?: string
    }

export type DeclarativeSyncPushRequest = {
  changes: DeclarativeSyncChangeEnvelope[]
}

export type DeclarativeSyncPushResponse = {
  applied: DeclarativeSyncDocumentDescriptor[]
  conflicts: DeclarativeSyncConflict[]
  acceptedCursor?: DeclarativeSyncCursor
}

export type DeclarativeSyncError = {
  code: DeclarativeSyncErrorCode
  message: string
  retryable?: boolean
  retryAfterMs?: number
}

export class DeclarativeSyncAdapterError extends Error implements DeclarativeSyncError {
  code: DeclarativeSyncErrorCode
  retryable?: boolean
  retryAfterMs?: number

  constructor(error: DeclarativeSyncError) {
    super(error.message)
    this.name = 'DeclarativeSyncAdapterError'
    this.code = error.code
    this.retryable = error.retryable
    this.retryAfterMs = error.retryAfterMs
  }
}

export interface DeclarativeSyncAdapter {
  pullChanges(request: DeclarativeSyncPullRequest): Promise<DeclarativeSyncPullResponse>
  pushChanges(request: DeclarativeSyncPushRequest): Promise<DeclarativeSyncPushResponse>
}
