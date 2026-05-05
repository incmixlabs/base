import { createStore, type Store } from 'tinybase'
import type { ComponentRegistryEntry, ComponentRegistryScope } from './component-registry'
import {
  composeDeclarativeDocumentNotificationChannels,
  createBroadcastChannelNotificationChannel,
  createLocalNotificationChannel,
  type DeclarativeBroadcastChannelFactory,
  type ManagedDeclarativeDocumentNotificationChannel,
} from './declarative-notification-channel'
import type { AppDocument, PageDocument } from './declarative-ui'
import type {
  DeclarativeDocumentNotification,
  DeclarativeDocumentNotificationChannel,
  DeclarativeRepository,
  DeclarativeRepositoryDeleteDocumentMutation,
  DeclarativeRepositoryDeleteDocumentResult,
  DeclarativeRepositoryDocumentKind,
  DeclarativeRepositoryDocumentRecord,
  DeclarativeRepositoryDocumentSummary,
  DeclarativeRepositoryDocumentWatchTarget,
  DeclarativeRepositoryErrorCode,
  DeclarativeRepositoryGetDocumentResult,
  DeclarativeRepositoryListDocumentsQuery,
  DeclarativeRepositoryListDocumentsResult,
  DeclarativeRepositoryListDocumentsWatchTarget,
  DeclarativeRepositoryMutation,
  DeclarativeRepositoryMutationResult,
  DeclarativeRepositoryPutDocumentMutation,
  DeclarativeRepositoryPutDocumentResult,
  DeclarativeRepositoryQuery,
  DeclarativeRepositoryQueryResult,
  DeclarativeRepositoryStoredDocument,
  DeclarativeRepositoryWatchEvent,
  DeclarativeRepositoryWatchReason,
  WatchableDeclarativeRepository,
} from './worker-repository-boundary'

const DOCUMENTS_TABLE = 'documents'
const DOCUMENT_KIND_CELL = 'documentKind'
const REVISION_CELL = 'revision'
const TITLE_CELL = 'title'
const SLUG_CELL = 'slug'
const SCOPE_CELL = 'scope'
const TAGS_CELL = 'tagsJson'
const SEARCH_TEXT_CELL = 'searchText'
const UPDATED_AT_CELL = 'updatedAt'
const DOCUMENT_CELL = 'documentJson'

type RepositoryRow = {
  documentKind: DeclarativeRepositoryDocumentKind
  revision: string
  title?: string
  slug?: string
  scope?: ComponentRegistryScope
  tags?: string[]
  searchText: string
  updatedAt: string
  document: DeclarativeRepositoryStoredDocument['document']
}

export class DeclarativeRepositoryError extends Error {
  code: DeclarativeRepositoryErrorCode
  retryable?: boolean

  constructor(code: DeclarativeRepositoryErrorCode, message: string, retryable?: boolean) {
    super(message)
    this.name = 'DeclarativeRepositoryError'
    this.code = code
    this.retryable = retryable
  }
}

export type CreateTinyBaseDeclarativeRepositoryOptions = {
  store?: Store
  now?: () => string
  generateRevision?: (context: {
    documentKind: DeclarativeRepositoryDocumentKind
    id: string
    previousRevision?: string
  }) => string
  notificationChannel?: DeclarativeDocumentNotificationChannel
}

export type TinyBaseDeclarativeRepository = DeclarativeRepository & {
  getStore(): Store
}

export type TinyBaseDeclarativeRepositoryStorage =
  | {
      kind: 'memory'
    }
  | {
      kind: 'opfs'
      fileHandle: unknown
      autoLoad?: boolean
      autoSave?: boolean
      onIgnoredError?: (error: any) => void
    }

type TinyBasePersister = {
  load(): Promise<unknown>
  startAutoLoad(): Promise<unknown>
  startAutoSave(): Promise<unknown>
  destroy(): Promise<unknown>
}

export type InitializeTinyBaseDeclarativeRepositoryOptions = Omit<
  CreateTinyBaseDeclarativeRepositoryOptions,
  'store'
> & {
  storage: TinyBaseDeclarativeRepositoryStorage
  crossTab?:
    | {
        kind: 'broadcast-channel'
        channelName: string
        broadcastChannelFactory?: DeclarativeBroadcastChannelFactory
      }
    | undefined
  persisterFactory?: (
    store: Store,
    storage: Extract<TinyBaseDeclarativeRepositoryStorage, { kind: 'opfs' }>,
  ) => Promise<TinyBasePersister> | TinyBasePersister
}

export type InitializedTinyBaseDeclarativeRepository = TinyBaseDeclarativeRepository & {
  destroy(): Promise<void>
  getPersister(): TinyBasePersister | undefined
  getStorage(): TinyBaseDeclarativeRepositoryStorage
  getNotificationChannel(): DeclarativeDocumentNotificationChannel | undefined
}

function buildRowId(documentKind: DeclarativeRepositoryDocumentKind, id: string): string {
  return `${documentKind}:${id}`
}

function readStringCell(store: Store, rowId: string, cellId: string): string | undefined {
  const value = store.getCell(DOCUMENTS_TABLE, rowId, cellId)
  return typeof value === 'string' && value.length > 0 ? value : undefined
}

function parseJsonCell<T>(store: Store, rowId: string, cellId: string): T | undefined {
  const raw = readStringCell(store, rowId, cellId)
  if (raw == null) {
    return undefined
  }

  return JSON.parse(raw) as T
}

function cloneStoredDocument(document: DeclarativeRepositoryStoredDocument): DeclarativeRepositoryStoredDocument {
  if (document.documentKind === 'app') {
    return {
      documentKind: 'app',
      document: structuredClone(document.document),
    }
  }
  if (document.documentKind === 'page') {
    return {
      documentKind: 'page',
      document: structuredClone(document.document),
    }
  }

  return {
    documentKind: 'component-registry-entry',
    document: structuredClone(document.document),
  }
}

function coerceStoredDocumentIdentity(
  mutation: DeclarativeRepositoryPutDocumentMutation,
): DeclarativeRepositoryStoredDocument {
  if (mutation.documentKind === 'app') {
    const document: AppDocument = {
      ...structuredClone(mutation.document),
      kind: 'app',
      id: mutation.id,
    }
    return { documentKind: 'app', document }
  }

  if (mutation.documentKind === 'page') {
    const document: PageDocument = {
      ...structuredClone(mutation.document),
      kind: 'page',
      id: mutation.id,
    }
    return { documentKind: 'page', document }
  }

  const document: ComponentRegistryEntry = {
    ...structuredClone(mutation.document),
    id: mutation.id,
  }
  return { documentKind: 'component-registry-entry', document }
}

function getSummaryFields(document: DeclarativeRepositoryStoredDocument['document']): {
  title?: string
  slug?: string
  scope?: ComponentRegistryScope
  tags?: string[]
  searchText: string
} {
  if ('runtime' in document && 'discovery' in document && 'ownership' in document) {
    const searchParts = [
      document.id,
      document.slug,
      document.title,
      document.description,
      document.discovery.summary,
      document.discovery.group,
      ...(document.discovery.hierarchy ?? []),
      ...(document.discovery.tags ?? []),
      ...(document.discovery.keywords ?? []),
    ]
    return {
      title: document.title,
      slug: document.slug,
      scope: document.ownership.scope,
      tags: document.discovery.tags,
      searchText: searchParts
        .filter((value): value is string => typeof value === 'string' && value.length > 0)
        .join(' '),
    }
  }

  return {
    title: 'title' in document ? document.title : undefined,
    searchText: [document.id, 'title' in document ? document.title : undefined]
      .filter((value): value is string => typeof value === 'string' && value.length > 0)
      .join(' '),
  }
}

function buildRow(
  mutation: DeclarativeRepositoryPutDocumentMutation,
  revision: string,
  updatedAt: string,
): RepositoryRow {
  const storedDocument = coerceStoredDocumentIdentity(mutation)
  const summary = getSummaryFields(storedDocument.document)

  return {
    documentKind: storedDocument.documentKind,
    revision,
    title: summary.title,
    slug: summary.slug,
    scope: summary.scope,
    tags: summary.tags,
    searchText: summary.searchText,
    updatedAt,
    document: storedDocument.document,
  }
}

function writeRow(store: Store, rowId: string, row: RepositoryRow): void {
  store.setRow(DOCUMENTS_TABLE, rowId, {
    [DOCUMENT_KIND_CELL]: row.documentKind,
    [REVISION_CELL]: row.revision,
    [TITLE_CELL]: row.title ?? '',
    [SLUG_CELL]: row.slug ?? '',
    [SCOPE_CELL]: row.scope ?? '',
    [TAGS_CELL]: JSON.stringify(row.tags ?? []),
    [SEARCH_TEXT_CELL]: row.searchText,
    [UPDATED_AT_CELL]: row.updatedAt,
    [DOCUMENT_CELL]: JSON.stringify(row.document),
  })
}

function readRow(store: Store, rowId: string): RepositoryRow | undefined {
  const documentKind = readStringCell(store, rowId, DOCUMENT_KIND_CELL)
  const revision = readStringCell(store, rowId, REVISION_CELL)
  const updatedAt = readStringCell(store, rowId, UPDATED_AT_CELL)
  const document = parseJsonCell<DeclarativeRepositoryStoredDocument['document']>(store, rowId, DOCUMENT_CELL)

  if (
    (documentKind !== 'app' && documentKind !== 'page' && documentKind !== 'component-registry-entry') ||
    revision == null ||
    updatedAt == null ||
    document == null
  ) {
    return undefined
  }

  const tags = parseJsonCell<string[]>(store, rowId, TAGS_CELL) ?? []

  return {
    documentKind,
    revision,
    title: readStringCell(store, rowId, TITLE_CELL),
    slug: readStringCell(store, rowId, SLUG_CELL),
    scope: readStringCell(store, rowId, SCOPE_CELL) as ComponentRegistryScope | undefined,
    tags: tags.length > 0 ? tags : undefined,
    searchText: readStringCell(store, rowId, SEARCH_TEXT_CELL) ?? '',
    updatedAt,
    document,
  }
}

function buildRecord(id: string, row: RepositoryRow): DeclarativeRepositoryDocumentRecord {
  const storedDocument =
    row.documentKind === 'app'
      ? cloneStoredDocument({
          documentKind: 'app',
          document: row.document as AppDocument,
        })
      : row.documentKind === 'page'
        ? cloneStoredDocument({
            documentKind: 'page',
            document: row.document as PageDocument,
          })
        : cloneStoredDocument({
            documentKind: 'component-registry-entry',
            document: row.document as ComponentRegistryEntry,
          })

  return {
    id,
    revision: row.revision,
    title: row.title,
    slug: row.slug,
    scope: row.scope,
    tags: row.tags,
    updatedAt: row.updatedAt,
    ...storedDocument,
  }
}

function buildSummary(id: string, row: RepositoryRow): DeclarativeRepositoryDocumentSummary {
  return {
    id,
    documentKind: row.documentKind,
    revision: row.revision,
    title: row.title,
    slug: row.slug,
    scope: row.scope,
    tags: row.tags,
    updatedAt: row.updatedAt,
  }
}

function matchesListQuery(
  summary: DeclarativeRepositoryDocumentSummary,
  searchText: string,
  query: DeclarativeRepositoryListDocumentsQuery,
): boolean {
  if (query.documentKind != null && summary.documentKind !== query.documentKind) {
    return false
  }

  if (query.scope != null && summary.scope !== query.scope) {
    return false
  }

  if (query.tags?.some(tag => !summary.tags?.includes(tag))) {
    return false
  }

  if (query.searchText != null && query.searchText.trim().length > 0) {
    if (!searchText.toLowerCase().includes(query.searchText.trim().toLowerCase())) {
      return false
    }
  }

  return true
}

function compareSummaries(
  left: DeclarativeRepositoryDocumentSummary,
  right: DeclarativeRepositoryDocumentSummary,
): number {
  const updatedComparison = right.updatedAt?.localeCompare(left.updatedAt ?? '') ?? 0
  if (updatedComparison !== 0) {
    return updatedComparison
  }

  const kindComparison = left.documentKind.localeCompare(right.documentKind)
  if (kindComparison !== 0) {
    return kindComparison
  }

  return left.id.localeCompare(right.id)
}

function listSummaries(
  store: Store,
  query: DeclarativeRepositoryListDocumentsQuery,
): DeclarativeRepositoryDocumentSummary[] {
  const rowIds = store.getRowIds(DOCUMENTS_TABLE)

  const items = rowIds
    .map(rowId => {
      const row = readRow(store, rowId)
      if (row == null) {
        return undefined
      }

      const id = rowId.slice(row.documentKind.length + 1)
      return {
        summary: buildSummary(id, row),
        searchText: row.searchText,
      }
    })
    .filter((item): item is { summary: DeclarativeRepositoryDocumentSummary; searchText: string } => item != null)
    .filter(item => matchesListQuery(item.summary, item.searchText, query))
    .map(item => item.summary)
    .sort(compareSummaries)

  if (query.cursor == null) {
    return items
  }

  const cursorIndex = items.findIndex(item => buildRowId(item.documentKind, item.id) === query.cursor)
  return cursorIndex >= 0 ? items.slice(cursorIndex + 1) : items
}

async function publishNotification(
  notificationChannel: DeclarativeDocumentNotificationChannel | undefined,
  event: DeclarativeDocumentNotification,
): Promise<void> {
  if (notificationChannel == null) {
    return
  }

  await notificationChannel.publish(event)
}

function getWatchReason(notification: DeclarativeDocumentNotification | null): DeclarativeRepositoryWatchReason {
  if (notification == null) {
    return 'initial'
  }

  if (notification.type === 'document.deleted') {
    return 'deleted'
  }

  if (notification.type === 'document.invalidated') {
    return 'invalidated'
  }

  return 'changed'
}

function toListDocumentsQuery(
  target: DeclarativeRepositoryListDocumentsWatchTarget,
): DeclarativeRepositoryListDocumentsQuery {
  return {
    type: 'list-documents',
    documentKind: target.documentKind,
    scope: target.scope,
    searchText: target.searchText,
    tags: target.tags,
    cursor: target.cursor,
    limit: target.limit,
  }
}

function matchesDocumentWatchTarget(
  target: DeclarativeRepositoryDocumentWatchTarget,
  notification: DeclarativeDocumentNotification,
): boolean {
  if (notification.type === 'document.invalidated') {
    if (notification.documentKind == null && notification.id == null) {
      return false
    }
    if (notification.documentKind != null && notification.documentKind !== target.documentKind) {
      return false
    }
    if (notification.id != null && notification.id !== target.id) {
      return false
    }

    return true
  }

  return notification.documentKind === target.documentKind && notification.id === target.id
}

function matchesListDocumentsWatchTarget(
  target: DeclarativeRepositoryListDocumentsWatchTarget,
  notification: DeclarativeDocumentNotification,
): boolean {
  if (target.documentKind != null) {
    if (notification.documentKind != null && notification.documentKind !== target.documentKind) {
      return false
    }

    if (notification.type !== 'document.invalidated' && notification.documentKind !== target.documentKind) {
      return false
    }
  }

  return true
}

async function watchDeclarativeRepositoryQuery<TResult extends DeclarativeRepositoryQueryResult>(
  repository: WatchableDeclarativeRepository,
  query: DeclarativeRepositoryQuery,
  shouldRefresh: (notification: DeclarativeDocumentNotification) => boolean,
  listener: (event: DeclarativeRepositoryWatchEvent<TResult>) => void,
): Promise<() => void> {
  let active = true
  let refreshQueue = Promise.resolve()

  const runRefresh = (notification: DeclarativeDocumentNotification | null) => {
    const nextRefresh = refreshQueue
      .catch(() => undefined)
      .then(async () => {
        if (!active) {
          return
        }

        const result = (await repository.query(query)) as TResult
        if (!active) {
          return
        }

        listener({
          reason: getWatchReason(notification),
          source: notification?.source ?? 'unknown',
          result,
        })
      })

    refreshQueue = nextRefresh.catch(() => undefined)

    return nextRefresh
  }

  const unsubscribe =
    repository.getNotificationChannel()?.subscribe(notification => {
      if (!shouldRefresh(notification)) {
        return
      }

      void runRefresh(notification).catch(() => undefined)
    }) ?? (() => {})

  try {
    await runRefresh(null)
  } catch (error) {
    unsubscribe()
    throw error
  }

  return () => {
    active = false
    unsubscribe()
  }
}

export async function watchDeclarativeRepositoryDocument(
  repository: WatchableDeclarativeRepository,
  target: DeclarativeRepositoryDocumentWatchTarget,
  listener: (event: DeclarativeRepositoryWatchEvent<DeclarativeRepositoryGetDocumentResult>) => void,
): Promise<() => void> {
  return watchDeclarativeRepositoryQuery(
    repository,
    {
      type: 'get-document',
      documentKind: target.documentKind,
      id: target.id,
    },
    notification => matchesDocumentWatchTarget(target, notification),
    listener,
  )
}

export async function watchDeclarativeRepositoryListDocuments(
  repository: WatchableDeclarativeRepository,
  target: DeclarativeRepositoryListDocumentsWatchTarget,
  listener: (event: DeclarativeRepositoryWatchEvent<DeclarativeRepositoryListDocumentsResult>) => void,
): Promise<() => void> {
  return watchDeclarativeRepositoryQuery(
    repository,
    toListDocumentsQuery(target),
    notification => matchesListDocumentsWatchTarget(target, notification),
    listener,
  )
}

export function createTinyBaseDeclarativeRepository(
  options: CreateTinyBaseDeclarativeRepositoryOptions = {},
): TinyBaseDeclarativeRepository {
  const store = options.store ?? createStore()
  const now = options.now ?? (() => new Date().toISOString())
  const generateRevision =
    options.generateRevision ??
    ((context: { documentKind: DeclarativeRepositoryDocumentKind; id: string; previousRevision?: string }) => {
      const suffix =
        context.previousRevision == null ? 1 : Number.parseInt(context.previousRevision.split('-').at(-1) ?? '', 10) + 1
      return `${context.documentKind}-${context.id}-${Number.isFinite(suffix) ? suffix : Date.now()}`
    })

  async function query(query: DeclarativeRepositoryQuery): Promise<DeclarativeRepositoryQueryResult> {
    if (query.type === 'get-document') {
      const row = readRow(store, buildRowId(query.documentKind, query.id))
      const result: DeclarativeRepositoryGetDocumentResult =
        row == null
          ? { type: 'get-document', found: false }
          : { type: 'get-document', found: true, record: buildRecord(query.id, row) }

      return result
    }

    const items = listSummaries(store, query)
    const limit = query.limit ?? items.length
    const pageItems = items.slice(0, limit)
    const lastItem = pageItems.at(-1)
    const nextCursor =
      items.length > limit && lastItem != null ? buildRowId(lastItem.documentKind, lastItem.id) : undefined

    const result: DeclarativeRepositoryListDocumentsResult = {
      type: 'list-documents',
      items: pageItems,
      nextCursor,
    }

    return result
  }

  async function mutate(mutation: DeclarativeRepositoryMutation): Promise<DeclarativeRepositoryMutationResult> {
    if (mutation.type === 'put-document') {
      const rowId = buildRowId(mutation.documentKind, mutation.id)
      const existing = readRow(store, rowId)

      if (mutation.expectedRevision !== undefined && mutation.expectedRevision !== existing?.revision) {
        throw new DeclarativeRepositoryError(
          'conflict',
          `put-document conflict for ${mutation.documentKind}:${mutation.id}; expected ${mutation.expectedRevision} but found ${existing?.revision ?? 'none'}`,
        )
      }

      const revision = generateRevision({
        documentKind: mutation.documentKind,
        id: mutation.id,
        previousRevision: existing?.revision,
      })
      const row = buildRow(mutation, revision, now())
      writeRow(store, rowId, row)

      const record = buildRecord(mutation.id, row)
      await publishNotification(options.notificationChannel, {
        type: 'document.changed',
        documentKind: mutation.documentKind,
        id: mutation.id,
        revision,
        source: 'same-tab',
      })

      const result: DeclarativeRepositoryPutDocumentResult = {
        type: 'put-document',
        record,
      }

      return result
    }

    return deleteDocument(store, mutation, options.notificationChannel)
  }

  return {
    getStore: () => store,
    query,
    mutate,
  }
}

async function createTinyBasePersister(
  store: Store,
  storage: Extract<TinyBaseDeclarativeRepositoryStorage, { kind: 'opfs' }>,
): Promise<TinyBasePersister> {
  const { createOpfsPersister } = await import('tinybase/persisters/persister-browser')
  return createOpfsPersister(
    store,
    storage.fileHandle as Parameters<typeof createOpfsPersister>[1],
    storage.onIgnoredError,
  )
}

export async function initializeTinyBaseDeclarativeRepository(
  options: InitializeTinyBaseDeclarativeRepositoryOptions,
): Promise<InitializedTinyBaseDeclarativeRepository> {
  const notificationChannels: ManagedDeclarativeDocumentNotificationChannel[] = []

  if (options.notificationChannel != null) {
    notificationChannels.push(options.notificationChannel)
  } else if (options.crossTab?.kind !== 'broadcast-channel') {
    notificationChannels.push(createLocalNotificationChannel())
  }

  if (options.crossTab?.kind === 'broadcast-channel') {
    notificationChannels.push(
      createBroadcastChannelNotificationChannel({
        channelName: options.crossTab.channelName,
        broadcastChannelFactory: options.crossTab.broadcastChannelFactory,
      }),
    )
  }

  const managedNotificationChannel =
    notificationChannels.length === 0
      ? undefined
      : notificationChannels.length === 1
        ? notificationChannels[0]
        : composeDeclarativeDocumentNotificationChannels(notificationChannels)

  const repository = createTinyBaseDeclarativeRepository({
    ...options,
    notificationChannel: managedNotificationChannel,
  })
  const storage = options.storage

  if (storage.kind === 'memory') {
    return {
      ...repository,
      destroy: async () => {
        await managedNotificationChannel?.destroy?.()
      },
      getPersister: () => undefined,
      getStorage: () => storage,
      getNotificationChannel: () => managedNotificationChannel,
    }
  }

  const persister = await (options.persisterFactory ?? createTinyBasePersister)(repository.getStore(), storage)

  try {
    if (storage.autoLoad) {
      await persister.startAutoLoad()
    } else {
      await persister.load()
    }

    if (storage.autoSave !== false) {
      await persister.startAutoSave()
    }
  } catch (error) {
    try {
      await persister.destroy()
    } catch {
      // Preserve the original initialization failure.
    }

    throw error
  }

  return {
    ...repository,
    destroy: async () => {
      await persister.destroy()
      await managedNotificationChannel?.destroy?.()
    },
    getPersister: () => persister,
    getStorage: () => storage,
    getNotificationChannel: () => managedNotificationChannel,
  }
}

async function deleteDocument(
  store: Store,
  mutation: DeclarativeRepositoryDeleteDocumentMutation,
  notificationChannel?: DeclarativeDocumentNotificationChannel,
): Promise<DeclarativeRepositoryDeleteDocumentResult> {
  const rowId = buildRowId(mutation.documentKind, mutation.id)
  const existing = readRow(store, rowId)

  if (mutation.expectedRevision !== undefined && mutation.expectedRevision !== existing?.revision) {
    throw new DeclarativeRepositoryError(
      'conflict',
      `delete-document conflict for ${mutation.documentKind}:${mutation.id}; expected ${mutation.expectedRevision} but found ${existing?.revision ?? 'none'}`,
    )
  }

  store.delRow(DOCUMENTS_TABLE, rowId)

  if (existing != null) {
    await publishNotification(notificationChannel, {
      type: 'document.deleted',
      documentKind: mutation.documentKind,
      id: mutation.id,
      revision: existing.revision,
      source: 'same-tab',
    })
  }

  return {
    type: 'delete-document',
    deleted: existing != null,
    documentKind: mutation.documentKind,
    id: mutation.id,
    revision: existing?.revision,
  }
}
