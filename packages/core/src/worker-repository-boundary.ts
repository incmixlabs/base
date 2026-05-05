import {
  type ComponentRegistryEntry,
  type ComponentRegistryScope,
  validateComponentRegistryEntry,
} from './component-registry'
import { type AppDocument, normalizeAppDocument, normalizePageDocument, type PageDocument } from './declarative-ui'

export const DECLARATIVE_REPOSITORY_QUERY_KIND = 'repository.query' as const
export const DECLARATIVE_REPOSITORY_MUTATION_KIND = 'repository.mutation' as const

export type DeclarativeRepositoryDocumentKind = 'app' | 'page' | 'component-registry-entry'
export type DeclarativeRepositoryQueryType = 'get-document' | 'list-documents'
export type DeclarativeRepositoryMutationType = 'put-document' | 'delete-document'
export type DeclarativeRepositoryErrorCode = 'conflict' | 'invalid-request' | 'not-found' | 'unknown'
export type DeclarativeRepositoryNotificationType = 'document.changed' | 'document.deleted' | 'document.invalidated'
export type DeclarativeRepositoryNotificationSource = 'same-tab' | 'external-tab' | 'worker' | 'unknown'

export type DeclarativeRepositoryStoredDocument =
  | {
      documentKind: 'app'
      document: AppDocument
    }
  | {
      documentKind: 'page'
      document: PageDocument
    }
  | {
      documentKind: 'component-registry-entry'
      document: ComponentRegistryEntry
    }

export type DeclarativeRepositoryDocumentSummary = {
  documentKind: DeclarativeRepositoryDocumentKind
  id: string
  revision: string
  title?: string
  slug?: string
  scope?: ComponentRegistryScope
  tags?: string[]
  updatedAt?: string
}

export type DeclarativeRepositoryDocumentRecord = DeclarativeRepositoryDocumentSummary &
  DeclarativeRepositoryStoredDocument

export type DeclarativeRepositoryGetDocumentQuery = {
  type: 'get-document'
  documentKind: DeclarativeRepositoryDocumentKind
  id: string
}

export type DeclarativeRepositoryListDocumentsQuery = {
  type: 'list-documents'
  documentKind?: DeclarativeRepositoryDocumentKind
  scope?: ComponentRegistryScope
  searchText?: string
  tags?: string[]
  cursor?: string
  limit?: number
}

export type DeclarativeRepositoryQuery = DeclarativeRepositoryGetDocumentQuery | DeclarativeRepositoryListDocumentsQuery

export type DeclarativeRepositoryDocumentWatchTarget = {
  type: 'document'
  documentKind: DeclarativeRepositoryDocumentKind
  id: string
}

export type DeclarativeRepositoryListDocumentsWatchTarget = {
  type: 'list-documents'
  documentKind?: DeclarativeRepositoryDocumentKind
  scope?: ComponentRegistryScope
  searchText?: string
  tags?: string[]
  cursor?: string
  limit?: number
}

export type DeclarativeRepositoryWatchTarget =
  | DeclarativeRepositoryDocumentWatchTarget
  | DeclarativeRepositoryListDocumentsWatchTarget

export type DeclarativeRepositoryPutDocumentMutation = DeclarativeRepositoryStoredDocument & {
  type: 'put-document'
  id: string
  expectedRevision?: string
}

export type DeclarativeRepositoryDeleteDocumentMutation = {
  type: 'delete-document'
  documentKind: DeclarativeRepositoryDocumentKind
  id: string
  expectedRevision?: string
}

export type DeclarativeRepositoryMutation =
  | DeclarativeRepositoryPutDocumentMutation
  | DeclarativeRepositoryDeleteDocumentMutation

export type DeclarativeRepositoryGetDocumentResult = {
  type: 'get-document'
  found: boolean
  record?: DeclarativeRepositoryDocumentRecord
}

export type DeclarativeRepositoryListDocumentsResult = {
  type: 'list-documents'
  items: DeclarativeRepositoryDocumentSummary[]
  nextCursor?: string
}

export type DeclarativeRepositoryQueryResult =
  | DeclarativeRepositoryGetDocumentResult
  | DeclarativeRepositoryListDocumentsResult

export type DeclarativeRepositoryWatchReason = 'initial' | 'changed' | 'deleted' | 'invalidated'

export type DeclarativeRepositoryWatchEvent<TResult extends DeclarativeRepositoryQueryResult> = {
  reason: DeclarativeRepositoryWatchReason
  source: DeclarativeRepositoryNotificationSource
  result: TResult
}

export type DeclarativeRepositoryPutDocumentResult = {
  type: 'put-document'
  record: DeclarativeRepositoryDocumentRecord
}

export type DeclarativeRepositoryDeleteDocumentResult = {
  type: 'delete-document'
  deleted: boolean
  documentKind: DeclarativeRepositoryDocumentKind
  id: string
  revision?: string
}

export type DeclarativeRepositoryMutationResult =
  | DeclarativeRepositoryPutDocumentResult
  | DeclarativeRepositoryDeleteDocumentResult

export type DeclarativeRepositoryWorkerQueryRequest = {
  requestId: string
  kind: typeof DECLARATIVE_REPOSITORY_QUERY_KIND
  query: DeclarativeRepositoryQuery
}

export type DeclarativeRepositoryWorkerMutationRequest = {
  requestId: string
  kind: typeof DECLARATIVE_REPOSITORY_MUTATION_KIND
  mutation: DeclarativeRepositoryMutation
}

export type DeclarativeRepositoryWorkerRequest =
  | DeclarativeRepositoryWorkerQueryRequest
  | DeclarativeRepositoryWorkerMutationRequest

export type DeclarativeRepositoryWorkerQueryResponse = {
  requestId: string
  kind: 'repository.query.result'
  result: DeclarativeRepositoryQueryResult
}

export type DeclarativeRepositoryWorkerMutationResponse = {
  requestId: string
  kind: 'repository.mutation.result'
  result: DeclarativeRepositoryMutationResult
}

export type DeclarativeRepositoryWorkerErrorResponse = {
  requestId: string
  kind: 'repository.error'
  error: {
    code: DeclarativeRepositoryErrorCode
    message: string
    retryable?: boolean
  }
}

export type DeclarativeRepositoryWorkerNotificationResponse = {
  kind: 'repository.notification'
  notification: DeclarativeDocumentNotification
}

export type DeclarativeRepositoryWorkerResponse =
  | DeclarativeRepositoryWorkerQueryResponse
  | DeclarativeRepositoryWorkerMutationResponse
  | DeclarativeRepositoryWorkerErrorResponse
  | DeclarativeRepositoryWorkerNotificationResponse

export type DeclarativeDocumentChangedNotification = {
  type: 'document.changed'
  documentKind: DeclarativeRepositoryDocumentKind
  id: string
  revision?: string
  source: DeclarativeRepositoryNotificationSource
}

export type DeclarativeDocumentDeletedNotification = {
  type: 'document.deleted'
  documentKind: DeclarativeRepositoryDocumentKind
  id: string
  revision?: string
  source: DeclarativeRepositoryNotificationSource
}

export type DeclarativeDocumentInvalidatedNotification = {
  type: 'document.invalidated'
  documentKind?: DeclarativeRepositoryDocumentKind
  id?: string
  revision?: string
  source: DeclarativeRepositoryNotificationSource
}

export type DeclarativeDocumentNotification =
  | DeclarativeDocumentChangedNotification
  | DeclarativeDocumentDeletedNotification
  | DeclarativeDocumentInvalidatedNotification

export interface DeclarativeRepository {
  query(query: DeclarativeRepositoryQuery): Promise<DeclarativeRepositoryQueryResult>
  mutate(mutation: DeclarativeRepositoryMutation): Promise<DeclarativeRepositoryMutationResult>
}

export interface DeclarativeRepositoryQueryAdapter {
  execute(query: DeclarativeRepositoryQuery): Promise<DeclarativeRepositoryQueryResult>
}

export interface DeclarativeRepositoryMutationAdapter {
  execute(mutation: DeclarativeRepositoryMutation): Promise<DeclarativeRepositoryMutationResult>
}

export interface DeclarativeDocumentNotificationChannel {
  publish(event: DeclarativeDocumentNotification): Promise<void> | void
  subscribe(listener: (event: DeclarativeDocumentNotification) => void): () => void
}

export interface WatchableDeclarativeRepository extends DeclarativeRepository {
  getNotificationChannel(): DeclarativeDocumentNotificationChannel | undefined
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value != null && typeof value === 'object' && !Array.isArray(value)
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(isNonEmptyString)
}

function isDocumentKind(value: unknown): value is DeclarativeRepositoryDocumentKind {
  return value === 'app' || value === 'page' || value === 'component-registry-entry'
}

function isScope(value: unknown): value is ComponentRegistryScope {
  return value === 'public' || value === 'organization' || value === 'workspace' || value === 'private'
}

function prefixValidationErrors(prefix: string, errors: string[]): string[] {
  return errors.map(error => {
    const normalized = error.startsWith(`${prefix}.`) ? error.slice(prefix.length + 1) : error
    return `${prefix}.${normalized}`
  })
}

function validateStoredDocument(value: unknown, errors: string[], path: string): boolean {
  if (!isRecord(value)) {
    errors.push(`${path} must be an object`)
    return false
  }

  if (!isDocumentKind(value.documentKind)) {
    errors.push(`${path}.documentKind must be one of app|page|component-registry-entry`)
  }
  if (!('document' in value) || !isRecord(value.document)) {
    errors.push(`${path}.document must be an object`)
    return false
  }

  if (value.documentKind === 'component-registry-entry') {
    const result = validateComponentRegistryEntry(value.document)
    errors.push(...result.errors.map(error => `${path}.document.${error}`))
  } else if (value.documentKind === 'page') {
    if (value.document.kind !== 'page') {
      errors.push(`${path}.document.kind must equal page`)
    }
    if (!isNonEmptyString(value.document.id)) {
      errors.push(`${path}.document.id must be a non-empty string`)
    }

    if (errors.length > 0) {
      return false
    }

    try {
      normalizePageDocument(value.document as PageDocument)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'invalid page document'
      errors.push(`${path}.document ${message}`)
    }
  } else if (value.documentKind === 'app') {
    if (value.document.kind !== 'app') {
      errors.push(`${path}.document.kind must equal app`)
      return false
    }

    try {
      normalizeAppDocument(value.document as AppDocument)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'invalid app document'
      errors.push(`${path}.document ${message}`)
    }
  }

  return errors.length === 0
}

export function validateDeclarativeRepositoryQuery(value: unknown): {
  query?: DeclarativeRepositoryQuery
  errors: string[]
} {
  const errors: string[] = []

  if (!isRecord(value)) {
    return {
      errors: ['repository query must be an object'],
    }
  }

  if (value.type === 'get-document') {
    if (!isDocumentKind(value.documentKind)) {
      errors.push('documentKind must be one of app|page|component-registry-entry')
    }
    if (!isNonEmptyString(value.id)) {
      errors.push('id must be a non-empty string')
    }
  } else if (value.type === 'list-documents') {
    if ('documentKind' in value && value.documentKind !== undefined && !isDocumentKind(value.documentKind)) {
      errors.push('documentKind must be one of app|page|component-registry-entry when provided')
    }
    if ('scope' in value && value.scope !== undefined && !isScope(value.scope)) {
      errors.push('scope must be one of public|organization|workspace|private when provided')
    }
    if ('searchText' in value && value.searchText !== undefined && !isNonEmptyString(value.searchText)) {
      errors.push('searchText must be a non-empty string when provided')
    }
    if ('tags' in value && value.tags !== undefined && !isStringArray(value.tags)) {
      errors.push('tags must be a string array when provided')
    }
    if ('cursor' in value && value.cursor !== undefined && !isNonEmptyString(value.cursor)) {
      errors.push('cursor must be a non-empty string when provided')
    }
    if (
      'limit' in value &&
      value.limit !== undefined &&
      (!Number.isInteger(value.limit) || (value.limit as number) <= 0)
    ) {
      errors.push('limit must be a positive integer when provided')
    }
  } else {
    errors.push('type must equal get-document or list-documents')
  }

  return {
    query: errors.length === 0 ? (value as DeclarativeRepositoryQuery) : undefined,
    errors,
  }
}

export function validateDeclarativeRepositoryMutation(value: unknown): {
  mutation?: DeclarativeRepositoryMutation
  errors: string[]
} {
  const errors: string[] = []

  if (!isRecord(value)) {
    return {
      errors: ['repository mutation must be an object'],
    }
  }

  if (value.type === 'put-document') {
    if (!isNonEmptyString(value.id)) {
      errors.push('id must be a non-empty string')
    }
    validateStoredDocument(value, errors, 'mutation')
    if (
      'expectedRevision' in value &&
      value.expectedRevision !== undefined &&
      !isNonEmptyString(value.expectedRevision)
    ) {
      errors.push('expectedRevision must be a non-empty string when provided')
    }
  } else if (value.type === 'delete-document') {
    if (!isDocumentKind(value.documentKind)) {
      errors.push('documentKind must be one of app|page|component-registry-entry')
    }
    if (!isNonEmptyString(value.id)) {
      errors.push('id must be a non-empty string')
    }
    if (
      'expectedRevision' in value &&
      value.expectedRevision !== undefined &&
      !isNonEmptyString(value.expectedRevision)
    ) {
      errors.push('expectedRevision must be a non-empty string when provided')
    }
  } else {
    errors.push('type must equal put-document or delete-document')
  }

  return {
    mutation: errors.length === 0 ? (value as DeclarativeRepositoryMutation) : undefined,
    errors,
  }
}

export function validateDeclarativeRepositoryWorkerRequest(value: unknown): {
  request?: DeclarativeRepositoryWorkerRequest
  errors: string[]
} {
  const errors: string[] = []

  if (!isRecord(value)) {
    return {
      errors: ['repository worker request must be an object'],
    }
  }

  if (!isNonEmptyString(value.requestId)) {
    errors.push('requestId must be a non-empty string')
  }

  if (value.kind === DECLARATIVE_REPOSITORY_QUERY_KIND) {
    const queryResult = validateDeclarativeRepositoryQuery(value.query)
    errors.push(...prefixValidationErrors('query', queryResult.errors))
  } else if (value.kind === DECLARATIVE_REPOSITORY_MUTATION_KIND) {
    const mutationResult = validateDeclarativeRepositoryMutation(value.mutation)
    errors.push(...prefixValidationErrors('mutation', mutationResult.errors))
  } else {
    errors.push(`kind must equal ${DECLARATIVE_REPOSITORY_QUERY_KIND} or ${DECLARATIVE_REPOSITORY_MUTATION_KIND}`)
  }

  return {
    request: errors.length === 0 ? (value as DeclarativeRepositoryWorkerRequest) : undefined,
    errors,
  }
}

export function validateDeclarativeDocumentNotification(value: unknown): {
  notification?: DeclarativeDocumentNotification
  errors: string[]
} {
  const errors: string[] = []

  if (!isRecord(value)) {
    return {
      errors: ['document notification must be an object'],
    }
  }

  if (value.type !== 'document.changed' && value.type !== 'document.deleted' && value.type !== 'document.invalidated') {
    errors.push('type must be one of document.changed|document.deleted|document.invalidated')
  }

  if (
    value.source !== 'same-tab' &&
    value.source !== 'external-tab' &&
    value.source !== 'worker' &&
    value.source !== 'unknown'
  ) {
    errors.push('source must be one of same-tab|external-tab|worker|unknown')
  }

  if (value.type === 'document.changed' || value.type === 'document.deleted') {
    if (!isDocumentKind(value.documentKind)) {
      errors.push('documentKind is required for document.changed|document.deleted')
    }
    if (!isNonEmptyString(value.id)) {
      errors.push('id is required for document.changed|document.deleted')
    }
  }

  if ('documentKind' in value && value.documentKind !== undefined && !isDocumentKind(value.documentKind)) {
    errors.push('documentKind must be one of app|page|component-registry-entry when provided')
  }
  if ('id' in value && value.id !== undefined && !isNonEmptyString(value.id)) {
    errors.push('id must be a non-empty string when provided')
  }
  if ('revision' in value && value.revision !== undefined && !isNonEmptyString(value.revision)) {
    errors.push('revision must be a non-empty string when provided')
  }

  return {
    notification: errors.length === 0 ? (value as DeclarativeDocumentNotification) : undefined,
    errors,
  }
}

export function validateDeclarativeRepositoryWorkerResponse(value: unknown): {
  response?: DeclarativeRepositoryWorkerResponse
  errors: string[]
} {
  const errors: string[] = []

  if (!isRecord(value)) {
    return {
      errors: ['repository worker response must be an object'],
    }
  }

  if (value.kind === 'repository.query.result') {
    if (!isNonEmptyString(value.requestId)) {
      errors.push('requestId must be a non-empty string')
    }
    if (!isRecord(value.result)) {
      errors.push('result must be an object')
    }
  } else if (value.kind === 'repository.mutation.result') {
    if (!isNonEmptyString(value.requestId)) {
      errors.push('requestId must be a non-empty string')
    }
    if (!isRecord(value.result)) {
      errors.push('result must be an object')
    }
  } else if (value.kind === 'repository.error') {
    if (!isNonEmptyString(value.requestId)) {
      errors.push('requestId must be a non-empty string')
    }
    if (!isRecord(value.error)) {
      errors.push('error must be an object')
    } else {
      if (
        value.error.code !== 'conflict' &&
        value.error.code !== 'invalid-request' &&
        value.error.code !== 'not-found' &&
        value.error.code !== 'unknown'
      ) {
        errors.push('error.code must be one of conflict|invalid-request|not-found|unknown')
      }
      if (!isNonEmptyString(value.error.message)) {
        errors.push('error.message must be a non-empty string')
      }
      if (
        'retryable' in value.error &&
        value.error.retryable !== undefined &&
        typeof value.error.retryable !== 'boolean'
      ) {
        errors.push('error.retryable must be a boolean when provided')
      }
    }
  } else if (value.kind === 'repository.notification') {
    const notificationResult = validateDeclarativeDocumentNotification(value.notification)
    errors.push(...prefixValidationErrors('notification', notificationResult.errors))
  } else {
    errors.push(
      'kind must equal repository.query.result|repository.mutation.result|repository.error|repository.notification',
    )
  }

  return {
    response: errors.length === 0 ? (value as DeclarativeRepositoryWorkerResponse) : undefined,
    errors,
  }
}

export function isDeclarativeRepositoryWorkerRequest(value: unknown): value is DeclarativeRepositoryWorkerRequest {
  return validateDeclarativeRepositoryWorkerRequest(value).errors.length === 0
}

export function isDeclarativeDocumentNotification(value: unknown): value is DeclarativeDocumentNotification {
  return validateDeclarativeDocumentNotification(value).errors.length === 0
}

export function isDeclarativeRepositoryWorkerResponse(value: unknown): value is DeclarativeRepositoryWorkerResponse {
  return validateDeclarativeRepositoryWorkerResponse(value).errors.length === 0
}
