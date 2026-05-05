import type { ComponentRegistryEntry, ComponentRegistryScope } from './component-registry'
import { createLocalNotificationChannel } from './declarative-notification-channel'
import { DeclarativeRepositoryError } from './declarative-repository'
import {
  DECLARATIVE_SYNC_SUPPORTED_DOCUMENT_KINDS,
  type DeclarativeSyncAdapter,
  type DeclarativeSyncChangeEnvelope,
  type DeclarativeSyncDocumentRecord,
  type DeclarativeSyncSupportedDocumentKind,
  isDeclarativeSyncSupportedDocumentKind,
} from './declarative-sync-boundary'
import type {
  DeclarativeDocumentNotification,
  DeclarativeDocumentNotificationChannel,
  DeclarativeRepositoryDeleteDocumentMutation,
  DeclarativeRepositoryDeleteDocumentResult,
  DeclarativeRepositoryDocumentKind,
  DeclarativeRepositoryDocumentRecord,
  DeclarativeRepositoryDocumentSummary,
  DeclarativeRepositoryGetDocumentResult,
  DeclarativeRepositoryListDocumentsQuery,
  DeclarativeRepositoryListDocumentsResult,
  DeclarativeRepositoryMutation,
  DeclarativeRepositoryMutationResult,
  DeclarativeRepositoryPutDocumentMutation,
  DeclarativeRepositoryPutDocumentResult,
  DeclarativeRepositoryQuery,
  DeclarativeRepositoryQueryResult,
  DeclarativeRepositoryStoredDocument,
  WatchableDeclarativeRepository,
} from './worker-repository-boundary'

export type RemoteDeclarativeRepository = WatchableDeclarativeRepository & {
  refresh(options?: RemoteDeclarativeRepositoryRefreshOptions): Promise<RemoteDeclarativeRepositoryRefreshResult>
  destroy(): Promise<void>
}

export type RemoteDeclarativeRepositoryRefreshOptions = {
  documentKind?: DeclarativeSyncSupportedDocumentKind
  publish?: boolean
}

export type RemoteDeclarativeRepositoryRefreshResult = {
  pulled: number
  hasMore: boolean
}

export type CreateRemoteDeclarativeRepositoryOptions = {
  syncAdapter: DeclarativeSyncAdapter
  notificationChannel?: DeclarativeDocumentNotificationChannel
  pullLimit?: number
}

const DEFAULT_REMOTE_PULL_LIMIT = 100

function buildRowId(documentKind: DeclarativeRepositoryDocumentKind, id: string): string {
  return `${documentKind}:${id}`
}

function isRemoteDocumentKind(
  documentKind: DeclarativeRepositoryDocumentKind,
): documentKind is DeclarativeSyncSupportedDocumentKind {
  return isDeclarativeSyncSupportedDocumentKind(documentKind)
}

function cloneRecord(record: DeclarativeRepositoryDocumentRecord): DeclarativeRepositoryDocumentRecord {
  return structuredClone(record)
}

function getDocumentSummaryFields(document: DeclarativeRepositoryStoredDocument['document']): {
  title?: string
  slug?: string
  scope?: ComponentRegistryScope
  tags?: string[]
} {
  if ('runtime' in document && 'discovery' in document && 'ownership' in document) {
    return {
      title: document.title,
      slug: document.slug,
      scope: document.ownership.scope,
      tags: document.discovery.tags,
    }
  }

  return {
    title: 'title' in document ? document.title : undefined,
  }
}

function normalizeRecordSummary(record: DeclarativeRepositoryDocumentRecord): DeclarativeRepositoryDocumentRecord {
  const summary = getDocumentSummaryFields(record.document)
  return {
    ...record,
    title: record.title ?? summary.title,
    slug: record.slug ?? summary.slug,
    scope: record.scope ?? summary.scope,
    tags: record.tags ?? summary.tags,
  }
}

function toDocumentSummary(record: DeclarativeRepositoryDocumentRecord): DeclarativeRepositoryDocumentSummary {
  return {
    documentKind: record.documentKind,
    id: record.id,
    revision: record.revision,
    title: record.title,
    slug: record.slug,
    scope: record.scope,
    tags: record.tags,
    updatedAt: record.updatedAt,
  }
}

function compareSummaries(
  left: DeclarativeRepositoryDocumentSummary,
  right: DeclarativeRepositoryDocumentSummary,
): number {
  const updatedComparison = right.updatedAt?.localeCompare(left.updatedAt ?? '') ?? 0
  if (updatedComparison !== 0) return updatedComparison

  const kindComparison = left.documentKind.localeCompare(right.documentKind)
  if (kindComparison !== 0) return kindComparison

  return left.id.localeCompare(right.id)
}

function matchesListQuery(
  summary: DeclarativeRepositoryDocumentSummary,
  query: DeclarativeRepositoryListDocumentsQuery,
) {
  if (query.documentKind != null && summary.documentKind !== query.documentKind) return false
  if (query.scope != null && summary.scope !== query.scope) return false
  if (query.tags?.some(tag => !summary.tags?.includes(tag))) return false

  if (query.searchText != null && query.searchText.trim().length > 0) {
    const searchText = [summary.id, summary.title, summary.slug, ...(summary.tags ?? [])]
      .filter((value): value is string => typeof value === 'string' && value.length > 0)
      .join(' ')
      .toLowerCase()
    return searchText.includes(query.searchText.trim().toLowerCase())
  }

  return true
}

function createPutRecord(
  mutation: DeclarativeRepositoryPutDocumentMutation & { documentKind: DeclarativeSyncSupportedDocumentKind },
  revision: string,
  updatedAt: string,
): DeclarativeSyncDocumentRecord {
  if (mutation.documentKind === 'app') {
    const document = {
      ...structuredClone(mutation.document),
      kind: 'app' as const,
      id: mutation.id,
    }
    return {
      documentKind: 'app',
      id: mutation.id,
      revision,
      title: document.title,
      updatedAt,
      document,
    }
  }

  if (mutation.documentKind === 'page') {
    const document = {
      ...structuredClone(mutation.document),
      kind: 'page' as const,
      id: mutation.id,
    }
    return {
      documentKind: 'page',
      id: mutation.id,
      revision,
      title: document.title,
      updatedAt,
      document,
    }
  }

  const document: ComponentRegistryEntry = {
    ...structuredClone(mutation.document),
    id: mutation.id,
  }
  const summary = getDocumentSummaryFields(document)
  return {
    documentKind: 'component-registry-entry',
    id: mutation.id,
    revision,
    title: summary.title,
    slug: summary.slug,
    scope: summary.scope,
    tags: summary.tags,
    updatedAt,
    document,
  }
}

function getConflictMessage(conflicts: { message?: string }[]) {
  return (
    conflicts.map(conflict => conflict.message).find((message): message is string => Boolean(message)) ??
    'remote repository conflict'
  )
}

function toDeletedResult(
  mutation: DeclarativeRepositoryDeleteDocumentMutation,
  existing: DeclarativeRepositoryDocumentRecord | undefined,
): DeclarativeRepositoryDeleteDocumentResult {
  return {
    type: 'delete-document',
    deleted: existing != null,
    documentKind: mutation.documentKind,
    id: mutation.id,
    revision: existing?.revision,
  }
}

export function createRemoteDeclarativeRepository(
  options: CreateRemoteDeclarativeRepositoryOptions,
): RemoteDeclarativeRepository {
  const records = new Map<string, DeclarativeRepositoryDocumentRecord>()
  const cursors = new Map<DeclarativeSyncSupportedDocumentKind, string | undefined>()
  const notificationChannel = options.notificationChannel ?? createLocalNotificationChannel()
  const pullLimit = options.pullLimit ?? DEFAULT_REMOTE_PULL_LIMIT
  if (!Number.isInteger(pullLimit) || pullLimit <= 0) {
    throw new DeclarativeRepositoryError('invalid-request', 'pullLimit must be a positive integer')
  }
  let refreshQueue = Promise.resolve()

  async function publish(notification: DeclarativeDocumentNotification) {
    await notificationChannel.publish(notification)
  }

  async function applyChange(change: DeclarativeSyncChangeEnvelope, publishChanges: boolean) {
    if (change.operation === 'upsert') {
      const record = normalizeRecordSummary(cloneRecord(change.record))
      records.set(buildRowId(record.documentKind, record.id), record)
      if (publishChanges) {
        await publish({
          type: 'document.changed',
          documentKind: record.documentKind,
          id: record.id,
          revision: record.revision,
          source: change.source ?? 'worker',
        })
      }
      return
    }

    records.delete(buildRowId(change.document.documentKind, change.document.id))
    if (publishChanges) {
      await publish({
        type: 'document.deleted',
        documentKind: change.document.documentKind,
        id: change.document.id,
        revision: change.document.revision,
        source: change.source ?? 'worker',
      })
    }
  }

  async function refreshKind(
    documentKind: DeclarativeSyncSupportedDocumentKind,
    publishChanges: boolean,
  ): Promise<RemoteDeclarativeRepositoryRefreshResult> {
    let pulled = 0
    let hasMore = false

    do {
      const previousCursor = cursors.get(documentKind)
      const response = await options.syncAdapter.pullChanges({
        documentKind,
        sinceCursor: previousCursor,
        limit: pullLimit,
      })
      if (response.hasMore && response.nextCursor === previousCursor) {
        throw new DeclarativeRepositoryError(
          'unknown',
          `remote pull for ${documentKind} did not advance cursor (${response.nextCursor})`,
          true,
        )
      }

      for (const change of response.changes) {
        await applyChange(change, publishChanges)
      }

      pulled += response.changes.length
      hasMore = response.hasMore
      cursors.set(documentKind, response.nextCursor)
    } while (hasMore)

    return { pulled, hasMore }
  }

  async function refresh(
    refreshOptions: RemoteDeclarativeRepositoryRefreshOptions = {},
  ): Promise<RemoteDeclarativeRepositoryRefreshResult> {
    const publishChanges = Boolean(refreshOptions.publish)
    const operation = async () => {
      if (refreshOptions.documentKind != null) {
        return refreshKind(refreshOptions.documentKind, publishChanges)
      }

      const results = []
      for (const documentKind of DECLARATIVE_SYNC_SUPPORTED_DOCUMENT_KINDS) {
        results.push(await refreshKind(documentKind, publishChanges))
      }
      return {
        pulled: results.reduce((total, result) => total + result.pulled, 0),
        hasMore: results.some(result => result.hasMore),
      }
    }

    const result = refreshQueue.then(operation, operation)
    refreshQueue = result.then(
      () => undefined,
      () => undefined,
    )
    return result
  }

  async function query(query: DeclarativeRepositoryQuery): Promise<DeclarativeRepositoryQueryResult> {
    if (query.type === 'get-document') {
      if (!isRemoteDocumentKind(query.documentKind)) {
        return { type: 'get-document', found: false }
      }

      await refresh({ documentKind: query.documentKind })
      const record = records.get(buildRowId(query.documentKind, query.id))
      const result: DeclarativeRepositoryGetDocumentResult =
        record == null
          ? { type: 'get-document', found: false }
          : { type: 'get-document', found: true, record: cloneRecord(record) }
      return result
    }

    if (query.limit != null && (!Number.isInteger(query.limit) || query.limit < 0)) {
      throw new DeclarativeRepositoryError('invalid-request', 'limit must be a non-negative integer')
    }

    if (query.documentKind == null) {
      await refresh()
    } else if (isRemoteDocumentKind(query.documentKind)) {
      await refresh({ documentKind: query.documentKind })
    }

    const matchedItems = Array.from(records.values())
      .map(toDocumentSummary)
      .filter(summary => matchesListQuery(summary, query))
      .sort(compareSummaries)
    const cursorIndex =
      query.cursor == null
        ? -1
        : matchedItems.findIndex(item => buildRowId(item.documentKind, item.id) === query.cursor)
    const items = cursorIndex >= 0 ? matchedItems.slice(cursorIndex + 1) : matchedItems

    const limit = query.limit ?? items.length
    const pageItems = items.slice(0, limit)
    const lastItem = pageItems.at(-1)
    const nextCursor =
      items.length > limit && lastItem != null ? buildRowId(lastItem.documentKind, lastItem.id) : undefined
    const result: DeclarativeRepositoryListDocumentsResult = {
      type: 'list-documents',
      items: pageItems.map(item => structuredClone(item)),
      nextCursor,
    }
    return result
  }

  async function putDocument(
    mutation: DeclarativeRepositoryPutDocumentMutation & { documentKind: DeclarativeSyncSupportedDocumentKind },
  ): Promise<DeclarativeRepositoryPutDocumentResult> {
    await refresh({ documentKind: mutation.documentKind })
    const rowId = buildRowId(mutation.documentKind, mutation.id)
    const existing = records.get(rowId)

    if (mutation.expectedRevision !== undefined && mutation.expectedRevision !== existing?.revision) {
      throw new DeclarativeRepositoryError(
        'conflict',
        `remote put-document conflict for ${mutation.documentKind}:${mutation.id}; expected ${mutation.expectedRevision} but found ${existing?.revision ?? 'none'}`,
      )
    }

    const localRecord = createPutRecord(
      mutation,
      existing?.revision ?? mutation.expectedRevision ?? 'remote-pending',
      new Date().toISOString(),
    )
    const pushResult = await options.syncAdapter.pushChanges({
      changes: [
        {
          operation: 'upsert',
          record: localRecord,
          baseRevision: existing?.revision,
          source: 'same-tab',
        },
      ],
    })

    if (pushResult.conflicts.length > 0) {
      throw new DeclarativeRepositoryError('conflict', getConflictMessage(pushResult.conflicts))
    }

    await refresh({ documentKind: mutation.documentKind, publish: true })
    const nextRecord = records.get(rowId)
    if (nextRecord == null) {
      throw new DeclarativeRepositoryError(
        'unknown',
        `remote repository did not return ${mutation.documentKind}:${mutation.id} after save`,
        true,
      )
    }

    return {
      type: 'put-document',
      record: cloneRecord(nextRecord),
    }
  }

  async function deleteDocument(mutation: DeclarativeRepositoryDeleteDocumentMutation) {
    if (!isRemoteDocumentKind(mutation.documentKind)) {
      throw new DeclarativeRepositoryError(
        'invalid-request',
        `remote repository does not support ${mutation.documentKind} documents`,
      )
    }

    await refresh({ documentKind: mutation.documentKind })
    const rowId = buildRowId(mutation.documentKind, mutation.id)
    const existing = records.get(rowId)

    if (mutation.expectedRevision !== undefined && mutation.expectedRevision !== existing?.revision) {
      throw new DeclarativeRepositoryError(
        'conflict',
        `remote delete-document conflict for ${mutation.documentKind}:${mutation.id}; expected ${mutation.expectedRevision} but found ${existing?.revision ?? 'none'}`,
      )
    }

    if (existing == null) {
      return toDeletedResult(mutation, existing)
    }

    const pushResult = await options.syncAdapter.pushChanges({
      changes: [
        {
          operation: 'delete',
          document: {
            documentKind: mutation.documentKind,
            id: mutation.id,
            revision: existing.revision,
          },
          baseRevision: existing.revision,
          source: 'same-tab',
        },
      ],
    })

    if (pushResult.conflicts.length > 0) {
      throw new DeclarativeRepositoryError('conflict', getConflictMessage(pushResult.conflicts))
    }

    await refresh({ documentKind: mutation.documentKind, publish: true })
    if (records.has(rowId)) {
      throw new DeclarativeRepositoryError(
        'unknown',
        `remote repository still returned ${mutation.documentKind}:${mutation.id} after delete`,
        true,
      )
    }
    return toDeletedResult(mutation, existing)
  }

  async function mutate(mutation: DeclarativeRepositoryMutation): Promise<DeclarativeRepositoryMutationResult> {
    if (mutation.type === 'put-document') {
      if (!isRemoteDocumentKind(mutation.documentKind)) {
        throw new DeclarativeRepositoryError(
          'invalid-request',
          `remote repository does not support ${mutation.documentKind} documents`,
        )
      }
      return putDocument(
        mutation as DeclarativeRepositoryPutDocumentMutation & { documentKind: DeclarativeSyncSupportedDocumentKind },
      )
    }

    return deleteDocument(mutation)
  }

  return {
    query,
    mutate,
    refresh,
    destroy: async () => {
      await (notificationChannel as { destroy?: () => void | Promise<void> }).destroy?.()
    },
    getNotificationChannel: () => notificationChannel,
  }
}
