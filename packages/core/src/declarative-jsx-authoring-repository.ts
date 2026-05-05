import { createRemoteDeclarativeRepository } from './declarative-remote-repository'
import {
  type InitializedTinyBaseDeclarativeRepository,
  initializeTinyBaseDeclarativeRepository,
  watchDeclarativeRepositoryDocument,
  watchDeclarativeRepositoryListDocuments,
} from './declarative-repository'
import {
  type DeclarativeRepositoryPersistenceMode,
  type DeclarativeRepositoryPersistencePolicy,
  type DeclarativeRepositoryStorageMode,
  resolveDeclarativeRepositoryPersistenceMode,
} from './declarative-repository-policy'
import {
  createDeclarativeRepositoryWorkerHost,
  createWorkerBackedDeclarativeRepository,
  type DeclarativeRepositoryWorkerEndpoint,
  type WorkerBackedDeclarativeRepository,
} from './declarative-repository-worker'
import type { DeclarativeSyncAdapter, DeclarativeSyncPageRecord } from './declarative-sync-boundary'
import { createHttpDeclarativeSyncAdapter, DEFAULT_DECLARATIVE_SYNC_TIMEOUT_MS } from './declarative-sync-http'
import {
  createDeclarativePageSyncService,
  type DeclarativePageSyncMetadata,
  type DeclarativePageSyncResult,
} from './declarative-sync-service'
import type { PageDocument } from './declarative-ui'
import type {
  DeclarativeRepository,
  DeclarativeRepositoryDeleteDocumentResult,
  DeclarativeRepositoryDocumentRecord,
  DeclarativeRepositoryDocumentSummary,
  DeclarativeRepositoryGetDocumentResult,
  DeclarativeRepositoryListDocumentsResult,
  DeclarativeRepositoryWatchEvent,
} from './worker-repository-boundary'

type MessageEventLike = {
  data: unknown
}

export type JsxAuthoringWorkbenchRepositoryStorageMode = DeclarativeRepositoryStorageMode

export type JsxAuthoringWorkbenchInitializationNotice = {
  kind: 'recovered-storage' | 'reset-incompatible-storage'
  message: string
}

export type JsxAuthoringWorkbenchSyncMetadata = DeclarativePageSyncMetadata

export type JsxAuthoringWorkbenchSyncResult = DeclarativePageSyncResult

type JsxAuthoringStorageMetadata = {
  schemaVersion: number
  sync?: JsxAuthoringWorkbenchSyncMetadata
}

export type JsxAuthoringWorkbenchRepository = {
  storageMode: JsxAuthoringWorkbenchRepositoryStorageMode
  persistenceMode?: DeclarativeRepositoryPersistenceMode
  schemaVersion: number
  initializationNotice: JsxAuthoringWorkbenchInitializationNotice | null
  record: DeclarativeRepositoryDocumentRecord
  loadDocument(id: string): Promise<DeclarativeRepositoryDocumentRecord>
  listDocuments(): Promise<DeclarativeRepositoryDocumentSummary[]>
  createDocument(page: PageDocument): Promise<DeclarativeRepositoryDocumentRecord>
  saveDocument(id: string, page: PageDocument, expectedRevision?: string): Promise<DeclarativeRepositoryDocumentRecord>
  deleteDocument(id: string, expectedRevision?: string): Promise<DeclarativeRepositoryDeleteDocumentResult>
  syncPages(): Promise<JsxAuthoringWorkbenchSyncResult>
  watchDocument(
    id: string,
    listener: (event: DeclarativeRepositoryWatchEvent<DeclarativeRepositoryGetDocumentResult>) => void,
  ): Promise<() => void>
  watchPages(
    listener: (event: DeclarativeRepositoryWatchEvent<DeclarativeRepositoryListDocumentsResult>) => void,
  ): Promise<() => void>
  destroy(): Promise<void>
}

export type JsxAuthoringWorkbenchSyncEnvironment = {
  VITE_DECLARATIVE_PERSISTENCE_MODE?: string
  VITE_DECLARATIVE_SYNC_BASE_URL?: string
  VITE_DECLARATIVE_SYNC_TENANT_ID?: string
  VITE_DECLARATIVE_SYNC_ACTOR_ID?: string
}

export type JsxAuthoringWorkbenchSyncTransportOptions = {
  baseUrl: string
  headers: HeadersInit
  timeoutMs: number
}

export type InitializeJsxAuthoringWorkbenchRepositoryOptions = {
  persistence?: DeclarativeRepositoryPersistencePolicy
  syncEnvironment?: JsxAuthoringWorkbenchSyncEnvironment
  syncAdapter?: DeclarativeSyncAdapter
  syncTransport?: Partial<JsxAuthoringWorkbenchSyncTransportOptions>
}

const JSX_AUTHORING_CROSS_TAB_CHANNEL = 'docs.declarative-jsx-authoring'
const JSX_AUTHORING_STORAGE_FILE = 'declarative-jsx-authoring.tinybase.json'
const JSX_AUTHORING_STORAGE_METADATA_FILE = 'declarative-jsx-authoring.meta.json'
const JSX_AUTHORING_STORAGE_SCHEMA_VERSION = 1
const DEFAULT_SYNC_BASE_URL = 'http://127.0.0.1:8080/api/v1/declarative/sync'
const DEFAULT_SYNC_TENANT_ID = 'tenant_demo'
const DEFAULT_SYNC_ACTOR_ID = 'user_demo'
const DEFAULT_SYNC_TIMEOUT_MS = DEFAULT_DECLARATIVE_SYNC_TIMEOUT_MS

export class JsxAuthoringWorkbenchPageNotFoundError extends Error {
  id: string

  constructor(id: string) {
    super(`Page document "${id}" was not found`)
    this.name = 'JsxAuthoringWorkbenchPageNotFoundError'
    this.id = id
  }
}

function createLocalWorkerEndpointPair(): {
  mainThread: DeclarativeRepositoryWorkerEndpoint
  workerThread: DeclarativeRepositoryWorkerEndpoint
} {
  const mainListeners = new Set<(event: MessageEventLike) => void>()
  const workerListeners = new Set<(event: MessageEventLike) => void>()

  return {
    mainThread: {
      postMessage(message) {
        const event = { data: structuredClone(message) }
        for (const listener of workerListeners) {
          listener(event)
        }
      },
      addEventListener(_type, listener) {
        mainListeners.add(listener)
      },
      removeEventListener(_type, listener) {
        mainListeners.delete(listener)
      },
    },
    workerThread: {
      postMessage(message) {
        const event = { data: structuredClone(message) }
        for (const listener of mainListeners) {
          listener(event)
        }
      },
      addEventListener(_type, listener) {
        workerListeners.add(listener)
      },
      removeEventListener(_type, listener) {
        workerListeners.delete(listener)
      },
    },
  }
}

export function resolveJsxAuthoringWorkbenchSyncTransportOptions(
  options: InitializeJsxAuthoringWorkbenchRepositoryOptions = {},
): JsxAuthoringWorkbenchSyncTransportOptions {
  const environment = options.syncEnvironment
  const explicitHeaders = options.syncTransport?.headers

  return {
    baseUrl:
      options.syncTransport?.baseUrl ??
      (typeof environment?.VITE_DECLARATIVE_SYNC_BASE_URL === 'string' &&
      environment.VITE_DECLARATIVE_SYNC_BASE_URL.trim() !== ''
        ? environment.VITE_DECLARATIVE_SYNC_BASE_URL.trim()
        : DEFAULT_SYNC_BASE_URL),
    headers: explicitHeaders ?? {
      'X-Autoform-Tenant-Id': environment?.VITE_DECLARATIVE_SYNC_TENANT_ID || DEFAULT_SYNC_TENANT_ID,
      'X-Autoform-Actor-Id': environment?.VITE_DECLARATIVE_SYNC_ACTOR_ID || DEFAULT_SYNC_ACTOR_ID,
    },
    timeoutMs: options.syncTransport?.timeoutMs ?? DEFAULT_SYNC_TIMEOUT_MS,
  }
}

async function resolveRepositoryStorage(mode: DeclarativeRepositoryPersistenceMode): Promise<
  | {
      kind: 'memory'
      storageMode: JsxAuthoringWorkbenchRepositoryStorageMode
    }
  | {
      kind: 'opfs'
      root: FileSystemDirectoryHandle
      fileHandle: FileSystemFileHandle
      storageMode: JsxAuthoringWorkbenchRepositoryStorageMode
    }
> {
  if (mode === 'memory-local') {
    return {
      kind: 'memory',
      storageMode: 'memory',
    }
  }

  if (
    typeof navigator === 'undefined' ||
    navigator.storage == null ||
    typeof navigator.storage.getDirectory !== 'function'
  ) {
    return {
      kind: 'memory',
      storageMode: 'memory',
    }
  }

  try {
    const root = await navigator.storage.getDirectory()
    const fileHandle = await root.getFileHandle(JSX_AUTHORING_STORAGE_FILE, {
      create: true,
    })

    return {
      kind: 'opfs',
      root,
      fileHandle,
      storageMode: 'opfs',
    }
  } catch {
    return {
      kind: 'memory',
      storageMode: 'memory',
    }
  }
}

async function writeJsonFile(handle: FileSystemFileHandle, value: unknown): Promise<void> {
  const writable = await handle.createWritable()
  try {
    await writable.write(JSON.stringify(value))
  } finally {
    await writable.close()
  }
}

async function writeStorageMetadata(root: FileSystemDirectoryHandle): Promise<void> {
  const metadataHandle = await root.getFileHandle(JSX_AUTHORING_STORAGE_METADATA_FILE, {
    create: true,
  })

  await writeJsonFile(metadataHandle, {
    schemaVersion: JSX_AUTHORING_STORAGE_SCHEMA_VERSION,
  } satisfies JsxAuthoringStorageMetadata)
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value != null && !Array.isArray(value)
}

function sanitizeStringRecord(value: unknown): Record<string, string> | undefined {
  if (!isRecord(value)) {
    return undefined
  }

  const entries = Object.entries(value).filter((entry): entry is [string, string] => typeof entry[1] === 'string')
  return entries.length > 0 ? Object.fromEntries(entries) : undefined
}

function sanitizeNullableStringRecord(value: unknown): Record<string, string | null> | undefined {
  if (!isRecord(value)) {
    return undefined
  }

  const entries = Object.entries(value).filter(
    (entry): entry is [string, string | null] => typeof entry[1] === 'string' || entry[1] === null,
  )
  return entries.length > 0 ? Object.fromEntries(entries) : undefined
}

function sanitizeSyncMetadata(value: unknown): JsxAuthoringWorkbenchSyncMetadata | undefined {
  if (!isRecord(value)) {
    return undefined
  }

  const sync: JsxAuthoringWorkbenchSyncMetadata = {}
  if (typeof value.cursor === 'string') {
    sync.cursor = value.cursor
  }

  const remoteRevisions = sanitizeStringRecord(value.remoteRevisions)
  if (remoteRevisions != null) {
    sync.remoteRevisions = remoteRevisions
  }

  const lastSyncedLocalRevisions = sanitizeStringRecord(value.lastSyncedLocalRevisions)
  if (lastSyncedLocalRevisions != null) {
    sync.lastSyncedLocalRevisions = lastSyncedLocalRevisions
  }

  const pendingDeleteBaseRevisions = sanitizeNullableStringRecord(value.pendingDeleteBaseRevisions)
  if (pendingDeleteBaseRevisions != null) {
    sync.pendingDeleteBaseRevisions = pendingDeleteBaseRevisions
  }

  return Object.keys(sync).length > 0 ? sync : undefined
}

async function writeStorageMetadataWithSync(
  root: FileSystemDirectoryHandle,
  sync: JsxAuthoringWorkbenchSyncMetadata | undefined,
): Promise<void> {
  const metadataHandle = await root.getFileHandle(JSX_AUTHORING_STORAGE_METADATA_FILE, {
    create: true,
  })

  await writeJsonFile(metadataHandle, {
    schemaVersion: JSX_AUTHORING_STORAGE_SCHEMA_VERSION,
    ...(sync != null ? { sync } : {}),
  } satisfies JsxAuthoringStorageMetadata)
}

async function readStorageMetadata(
  root: FileSystemDirectoryHandle,
): Promise<JsxAuthoringStorageMetadata | null | 'invalid'> {
  try {
    const handle = await root.getFileHandle(JSX_AUTHORING_STORAGE_METADATA_FILE)
    const raw = await (await handle.getFile()).text()
    const value = JSON.parse(raw) as Partial<JsxAuthoringStorageMetadata>
    return typeof value.schemaVersion === 'number'
      ? {
          schemaVersion: value.schemaVersion,
          sync: sanitizeSyncMetadata(value.sync),
        }
      : 'invalid'
  } catch (error) {
    if (error instanceof DOMException && error.name === 'NotFoundError') {
      return null
    }

    return 'invalid'
  }
}

async function resetPersistedStorage(root: FileSystemDirectoryHandle): Promise<void> {
  try {
    await root.removeEntry(JSX_AUTHORING_STORAGE_FILE)
  } catch (error) {
    if (!(error instanceof DOMException) || error.name !== 'NotFoundError') {
      throw error
    }
  }
}

async function preparePersistedStorage(root: FileSystemDirectoryHandle): Promise<{
  initializationNotice: JsxAuthoringWorkbenchInitializationNotice | null
  syncMetadata: JsxAuthoringWorkbenchSyncMetadata | undefined
}> {
  const metadata = await readStorageMetadata(root)

  if (metadata === 'invalid') {
    await resetPersistedStorage(root)
    await writeStorageMetadata(root)
    return {
      initializationNotice: {
        kind: 'recovered-storage',
        message: 'Unreadable persisted authoring metadata was reset before loading the repository.',
      },
      syncMetadata: undefined,
    }
  }

  if (metadata == null) {
    await writeStorageMetadata(root)
    return {
      initializationNotice: null,
      syncMetadata: undefined,
    }
  }

  if (metadata.schemaVersion !== JSX_AUTHORING_STORAGE_SCHEMA_VERSION) {
    await resetPersistedStorage(root)
    await writeStorageMetadata(root)
    return {
      initializationNotice: {
        kind: 'reset-incompatible-storage',
        message: `Persisted authoring data from schema v${metadata.schemaVersion} was reset for schema v${JSX_AUTHORING_STORAGE_SCHEMA_VERSION}.`,
      },
      syncMetadata: undefined,
    }
  }

  return {
    initializationNotice: null,
    syncMetadata: metadata.sync,
  }
}

function isRecoverablePersistenceError(error: unknown): boolean {
  return (
    error instanceof SyntaxError ||
    (error instanceof DOMException && (error.name === 'NotReadableError' || error.name === 'DataError'))
  )
}

async function loadPageDocument(
  repository: DeclarativeRepository,
  id: string,
): Promise<DeclarativeRepositoryDocumentRecord | undefined> {
  const result = await repository.query({
    type: 'get-document',
    documentKind: 'page',
    id,
  })

  if (result.type !== 'get-document') {
    throw new Error(`Failed to load page document "${id}"`)
  }

  if (!result.found) {
    return undefined
  }

  if (result.record == null) {
    throw new Error(`Repository returned an empty page document result for "${id}"`)
  }

  if (result.record.documentKind !== 'page') {
    throw new Error(`Expected page document for "${id}"`)
  }

  return result.record
}

async function ensureInitialPageDocument(
  repository: DeclarativeRepository,
  page: PageDocument,
): Promise<DeclarativeRepositoryDocumentRecord> {
  const existing = await loadPageDocument(repository, page.id)
  if (existing != null) {
    return existing
  }

  const result = await repository.mutate({
    type: 'put-document',
    documentKind: 'page',
    id: page.id,
    document: page,
  })

  if (result.type !== 'put-document' || result.record.documentKind !== 'page') {
    throw new Error(`Failed to seed page document "${page.id}"`)
  }

  return result.record
}

function toSyncPageRecord(record: DeclarativeRepositoryDocumentRecord): DeclarativeSyncPageRecord {
  if (record.documentKind !== 'page') {
    throw new Error(`Expected page record for sync, received "${record.documentKind}"`)
  }

  const cloned = structuredClone(record)
  return {
    ...cloned,
    documentKind: 'page',
  }
}

export async function initializeJsxAuthoringWorkbenchRepository(
  page: PageDocument,
  options: InitializeJsxAuthoringWorkbenchRepositoryOptions = {},
): Promise<JsxAuthoringWorkbenchRepository> {
  const persistenceMode = resolveDeclarativeRepositoryPersistenceMode(
    options.persistence,
    options.syncEnvironment?.VITE_DECLARATIVE_PERSISTENCE_MODE,
  )
  const syncAdapter =
    options.syncAdapter ?? createHttpDeclarativeSyncAdapter(resolveJsxAuthoringWorkbenchSyncTransportOptions(options))

  if (persistenceMode === 'remote-only') {
    const remoteRepository = createRemoteDeclarativeRepository({ syncAdapter })

    try {
      const record = await ensureInitialPageDocument(remoteRepository, page)

      return {
        storageMode: 'remote-only',
        persistenceMode,
        schemaVersion: JSX_AUTHORING_STORAGE_SCHEMA_VERSION,
        initializationNotice: null,
        record,
        async loadDocument(id) {
          const loaded = await loadPageDocument(remoteRepository, id)
          if (loaded == null) {
            throw new JsxAuthoringWorkbenchPageNotFoundError(id)
          }

          return loaded
        },
        async listDocuments() {
          const result = await remoteRepository.query({
            type: 'list-documents',
            documentKind: 'page',
          })
          if (result.type !== 'list-documents') {
            throw new Error('Failed to list page documents')
          }
          return result.items.filter(item => item.documentKind === 'page')
        },
        async createDocument(nextPage) {
          const result = await remoteRepository.mutate({
            type: 'put-document',
            documentKind: 'page',
            id: nextPage.id,
            document: nextPage,
          })

          if (result.type !== 'put-document' || result.record.documentKind !== 'page') {
            throw new Error(`Failed to create page document "${nextPage.id}"`)
          }

          return result.record
        },
        async saveDocument(id, nextPage, expectedRevision) {
          if (nextPage.id !== id) {
            throw new Error(`Refusing to save page "${nextPage.id}" over active page "${id}"`)
          }

          const result = await remoteRepository.mutate({
            type: 'put-document',
            documentKind: 'page',
            id,
            document: nextPage,
            expectedRevision,
          })

          if (result.type !== 'put-document' || result.record.documentKind !== 'page') {
            throw new Error(`Failed to save page document "${nextPage.id}"`)
          }

          return result.record
        },
        async deleteDocument(id, expectedRevision) {
          const result = await remoteRepository.mutate({
            type: 'delete-document',
            documentKind: 'page',
            id,
            expectedRevision,
          })

          if (result.type !== 'delete-document') {
            throw new Error(`Failed to delete page document "${id}"`)
          }

          return result
        },
        async syncPages() {
          const result = await remoteRepository.refresh({ documentKind: 'page', publish: true })
          return {
            pulled: result.pulled,
            pushed: 0,
            conflicts: [],
            hasMore: result.hasMore,
          }
        },
        watchDocument(id, listener) {
          return watchDeclarativeRepositoryDocument(
            remoteRepository,
            {
              type: 'document',
              documentKind: 'page',
              id,
            },
            listener,
          )
        },
        watchPages(listener) {
          return watchDeclarativeRepositoryListDocuments(
            remoteRepository,
            {
              type: 'list-documents',
              documentKind: 'page',
            },
            listener,
          )
        },
        async destroy() {
          await remoteRepository.destroy()
        },
      }
    } catch (error) {
      await remoteRepository.destroy().catch(() => undefined)
      throw error
    }
  }

  const storage = await resolveRepositoryStorage(persistenceMode)
  const preparedStorage =
    storage.kind === 'opfs'
      ? await preparePersistedStorage(storage.root)
      : {
          initializationNotice: null,
          syncMetadata: undefined,
        }
  let initializationNotice = preparedStorage.initializationNotice
  let initialSyncMetadata = preparedStorage.syncMetadata

  async function initializeRepositoryStorage(): Promise<InitializedTinyBaseDeclarativeRepository> {
    if (storage.kind === 'opfs') {
      const fileHandle = await storage.root.getFileHandle(JSX_AUTHORING_STORAGE_FILE, {
        create: true,
      })

      return initializeTinyBaseDeclarativeRepository({
        storage: { kind: 'opfs', fileHandle },
        crossTab:
          typeof BroadcastChannel !== 'undefined'
            ? {
                kind: 'broadcast-channel',
                channelName: JSX_AUTHORING_CROSS_TAB_CHANNEL,
              }
            : undefined,
      })
    }

    return initializeTinyBaseDeclarativeRepository({
      storage: { kind: 'memory' },
      crossTab: undefined,
    })
  }

  let initializedRepository: InitializedTinyBaseDeclarativeRepository

  try {
    initializedRepository = await initializeRepositoryStorage()
  } catch (error) {
    if (storage.kind !== 'opfs' || !isRecoverablePersistenceError(error)) {
      throw error
    }

    await resetPersistedStorage(storage.root)
    await writeStorageMetadata(storage.root)
    initializationNotice = {
      kind: 'recovered-storage',
      message: 'Unreadable persisted authoring data was reset and the repository was reinitialized.',
    }
    initialSyncMetadata = undefined
    initializedRepository = await initializeRepositoryStorage()
  }

  let host: ReturnType<typeof createDeclarativeRepositoryWorkerHost> | null = null
  let repository: WorkerBackedDeclarativeRepository | null = null

  try {
    const pair = createLocalWorkerEndpointPair()
    host = createDeclarativeRepositoryWorkerHost({
      endpoint: pair.workerThread,
      repository: initializedRepository,
      notificationChannel: initializedRepository.getNotificationChannel(),
    })
    repository = createWorkerBackedDeclarativeRepository({
      endpoint: pair.mainThread,
    })
    const workbenchRepository = repository
    const record = await ensureInitialPageDocument(workbenchRepository, page)
    async function persistSyncMetadata(syncMetadata: JsxAuthoringWorkbenchSyncMetadata | undefined): Promise<void> {
      if (storage.kind !== 'opfs') {
        return
      }

      await writeStorageMetadataWithSync(storage.root, syncMetadata)
    }

    async function collectLocalPageRecords(): Promise<Map<string, DeclarativeRepositoryDocumentRecord>> {
      const summaries = await (async () => {
        const result = await workbenchRepository.query({
          type: 'list-documents',
          documentKind: 'page',
        })
        if (result.type !== 'list-documents') {
          throw new Error('Failed to list page documents for sync')
        }
        return result.items.filter(item => item.documentKind === 'page')
      })()

      const records = new Map<string, DeclarativeRepositoryDocumentRecord>()
      await Promise.all(
        summaries.map(async summary => {
          const loaded = await loadPageDocument(workbenchRepository, summary.id)
          if (loaded != null) {
            records.set(summary.id, loaded)
          }
        }),
      )
      return records
    }

    const pageSyncService = createDeclarativePageSyncService({
      repository: workbenchRepository,
      syncAdapter,
      initialMetadata: initialSyncMetadata,
      persistSyncMetadata,
      async loadPageDocument(id) {
        const loaded = await loadPageDocument(workbenchRepository, id)
        return loaded != null ? toSyncPageRecord(loaded) : undefined
      },
      async listPageRecords() {
        const records = await collectLocalPageRecords()
        return new Map(Array.from(records.entries(), ([id, localRecord]) => [id, toSyncPageRecord(localRecord)]))
      },
    })

    return {
      storageMode: storage.storageMode,
      persistenceMode,
      schemaVersion: JSX_AUTHORING_STORAGE_SCHEMA_VERSION,
      initializationNotice,
      record,
      async loadDocument(id) {
        const loaded = await loadPageDocument(workbenchRepository, id)
        if (loaded == null) {
          throw new JsxAuthoringWorkbenchPageNotFoundError(id)
        }

        return loaded
      },
      async listDocuments() {
        const result = await workbenchRepository.query({
          type: 'list-documents',
          documentKind: 'page',
        })
        if (result.type !== 'list-documents') {
          throw new Error('Failed to list page documents')
        }
        return result.items.filter(item => item.documentKind === 'page')
      },
      async createDocument(nextPage) {
        const result = await workbenchRepository.mutate({
          type: 'put-document',
          documentKind: 'page',
          id: nextPage.id,
          document: nextPage,
        })

        if (result.type !== 'put-document' || result.record.documentKind !== 'page') {
          throw new Error(`Failed to create page document "${nextPage.id}"`)
        }

        await pageSyncService.clearPendingDelete(nextPage.id)
        return result.record
      },
      async saveDocument(id, nextPage, expectedRevision) {
        if (nextPage.id !== id) {
          throw new Error(`Refusing to save page "${nextPage.id}" over active page "${id}"`)
        }

        const result = await workbenchRepository.mutate({
          type: 'put-document',
          documentKind: 'page',
          id,
          document: nextPage,
          expectedRevision,
        })

        if (result.type !== 'put-document' || result.record.documentKind !== 'page') {
          throw new Error(`Failed to save page document "${nextPage.id}"`)
        }

        await pageSyncService.clearPendingDelete(id)
        return result.record
      },
      async deleteDocument(id, expectedRevision) {
        const result = await workbenchRepository.mutate({
          type: 'delete-document',
          documentKind: 'page',
          id,
          expectedRevision,
        })

        if (result.type !== 'delete-document') {
          throw new Error(`Failed to delete page document "${id}"`)
        }

        if (result.deleted) {
          await pageSyncService.markDeleted(id)
        }

        return result
      },
      async syncPages() {
        return pageSyncService.syncPages()
      },
      watchDocument(id, listener) {
        return watchDeclarativeRepositoryDocument(
          workbenchRepository,
          {
            type: 'document',
            documentKind: 'page',
            id,
          },
          listener,
        )
      },
      watchPages(listener) {
        return watchDeclarativeRepositoryListDocuments(
          workbenchRepository,
          {
            type: 'list-documents',
            documentKind: 'page',
          },
          listener,
        )
      },
      async destroy() {
        workbenchRepository.destroy()
        host?.destroy()
        await initializedRepository.destroy()
      },
    }
  } catch (error) {
    repository?.destroy()
    host?.destroy()
    await initializedRepository.destroy().catch(() => undefined)
    throw error
  }
}
