import type { ComponentRegistryEntry } from './component-registry'
import {
  createDeclarativeAppSyncService,
  type DeclarativeAppSyncDocumentKind,
  type DeclarativeAppSyncDocumentRecord,
  type DeclarativeAppSyncMetadata,
  type DeclarativeAppSyncResult,
} from './declarative-app-sync-service'
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
import type { DeclarativeSyncAdapter } from './declarative-sync-boundary'
import { createHttpDeclarativeSyncAdapter, DEFAULT_DECLARATIVE_SYNC_TIMEOUT_MS } from './declarative-sync-http'
import type { AppDocument } from './declarative-ui'
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

export type DeclarativeAppSyncRepositoryStorageMode = DeclarativeRepositoryStorageMode

export type DeclarativeAppSyncRepositoryInitializationNotice = {
  kind: 'recovered-storage' | 'reset-incompatible-storage'
  message: string
}

export type DeclarativeAppSyncEnvironment = {
  VITE_DECLARATIVE_PERSISTENCE_MODE?: string
  VITE_DECLARATIVE_SYNC_BASE_URL?: string
  VITE_DECLARATIVE_SYNC_RECORD_LOAD_BATCH_SIZE?: string
  VITE_DECLARATIVE_SYNC_TENANT_ID?: string
  VITE_DECLARATIVE_SYNC_ACTOR_ID?: string
}

export type DeclarativeAppSyncTransportOptions = {
  baseUrl: string
  headers: HeadersInit
  timeoutMs: number
}

export type InitializeDeclarativeAppSyncRepositoryOptions = {
  persistence?: DeclarativeRepositoryPersistencePolicy
  storageNamespace?: string
  syncEnvironment?: DeclarativeAppSyncEnvironment
  syncAdapter?: DeclarativeSyncAdapter
  syncRecordLoadBatchSize?: number
  syncTransport?: Partial<DeclarativeAppSyncTransportOptions>
}

type DeclarativeAppStorageMetadata = {
  schemaVersion: number
  sync?: DeclarativeAppSyncMetadata
}

export type DeclarativeAppSyncRepository = {
  storageMode: DeclarativeAppSyncRepositoryStorageMode
  persistenceMode?: DeclarativeRepositoryPersistenceMode
  schemaVersion: number
  initializationNotice: DeclarativeAppSyncRepositoryInitializationNotice | null
  record: DeclarativeRepositoryDocumentRecord
  loadDocument(id: string): Promise<DeclarativeRepositoryDocumentRecord>
  listDocuments(): Promise<DeclarativeRepositoryDocumentSummary[]>
  loadComponentRegistryEntry(id: string): Promise<DeclarativeRepositoryDocumentRecord>
  listComponentRegistryEntries(): Promise<DeclarativeRepositoryDocumentSummary[]>
  saveComponentRegistryEntry(
    entry: ComponentRegistryEntry,
    expectedRevision?: string,
  ): Promise<DeclarativeRepositoryDocumentRecord>
  deleteComponentRegistryEntry(
    id: string,
    expectedRevision?: string,
  ): Promise<DeclarativeRepositoryDeleteDocumentResult>
  syncApps(): Promise<DeclarativeAppSyncResult>
  watchDocument(
    id: string,
    listener: (event: DeclarativeRepositoryWatchEvent<DeclarativeRepositoryGetDocumentResult>) => void,
  ): Promise<() => void>
  watchApps(
    listener: (event: DeclarativeRepositoryWatchEvent<DeclarativeRepositoryListDocumentsResult>) => void,
  ): Promise<() => void>
  watchComponentRegistryEntries(
    listener: (event: DeclarativeRepositoryWatchEvent<DeclarativeRepositoryListDocumentsResult>) => void,
  ): Promise<() => void>
  destroy(): Promise<void>
}

export class DeclarativeAppSyncRepositoryNotFoundError extends Error {
  id: string

  constructor(id: string) {
    super(`App document "${id}" was not found`)
    this.name = 'DeclarativeAppSyncRepositoryNotFoundError'
    this.id = id
  }
}

export class DeclarativeAppSyncRepositoryComponentRegistryEntryNotFoundError extends Error {
  id: string

  constructor(id: string) {
    super(`Component registry entry "${id}" was not found`)
    this.name = 'DeclarativeAppSyncRepositoryComponentRegistryEntryNotFoundError'
    this.id = id
  }
}

const DECLARATIVE_APP_STORAGE_SCHEMA_VERSION = 1
const DEFAULT_SYNC_BASE_URL = 'http://127.0.0.1:8080/api/v1/declarative/sync'
const DEFAULT_SYNC_TENANT_ID = 'tenant_demo'
const DEFAULT_SYNC_ACTOR_ID = 'user_demo'
const DEFAULT_SYNC_TIMEOUT_MS = DEFAULT_DECLARATIVE_SYNC_TIMEOUT_MS
const DEFAULT_SYNC_RECORD_LOAD_BATCH_SIZE = 50
const MAX_SYNC_RECORD_LOAD_BATCH_SIZE = 500
const DECLARATIVE_APP_SYNC_DOCUMENT_KINDS = [
  'app',
  'component-registry-entry',
] as const satisfies readonly DeclarativeAppSyncDocumentKind[]

function buildStorageConfig(namespace: string) {
  return {
    crossTabChannel: `${namespace}.broadcast`,
    metadataFile: `${namespace}.meta.json`,
    storageFile: `${namespace}.tinybase.json`,
  }
}

function normalizeSyncRecordLoadBatchSize(value: unknown): number | undefined {
  const parsed =
    typeof value === 'number'
      ? value
      : typeof value === 'string' && value.trim() !== ''
        ? Number(value.trim())
        : undefined

  if (parsed == null || !Number.isFinite(parsed)) {
    return undefined
  }

  const normalized = Math.trunc(parsed)
  if (normalized < 1) {
    return undefined
  }

  return Math.min(normalized, MAX_SYNC_RECORD_LOAD_BATCH_SIZE)
}

export function resolveDeclarativeAppSyncRecordLoadBatchSize(
  options: InitializeDeclarativeAppSyncRepositoryOptions = {},
): number {
  return (
    normalizeSyncRecordLoadBatchSize(options.syncRecordLoadBatchSize) ??
    normalizeSyncRecordLoadBatchSize(options.syncEnvironment?.VITE_DECLARATIVE_SYNC_RECORD_LOAD_BATCH_SIZE) ??
    DEFAULT_SYNC_RECORD_LOAD_BATCH_SIZE
  )
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

export function resolveDeclarativeAppSyncTransportOptions(
  options: InitializeDeclarativeAppSyncRepositoryOptions = {},
): DeclarativeAppSyncTransportOptions {
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

async function resolveRepositoryStorage(
  storageFile: string,
  mode: DeclarativeRepositoryPersistenceMode,
): Promise<
  | {
      kind: 'memory'
      storageMode: DeclarativeAppSyncRepositoryStorageMode
    }
  | {
      kind: 'opfs'
      root: FileSystemDirectoryHandle
      fileHandle: FileSystemFileHandle
      storageMode: DeclarativeAppSyncRepositoryStorageMode
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
    const fileHandle = await root.getFileHandle(storageFile, {
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

function sanitizeSyncMetadata(value: unknown): DeclarativeAppSyncMetadata | undefined {
  if (!isRecord(value)) {
    return undefined
  }

  const sync: DeclarativeAppSyncMetadata = {}
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

async function writeStorageMetadata(
  root: FileSystemDirectoryHandle,
  metadataFile: string,
  sync?: DeclarativeAppSyncMetadata,
): Promise<void> {
  const metadataHandle = await root.getFileHandle(metadataFile, {
    create: true,
  })

  await writeJsonFile(metadataHandle, {
    schemaVersion: DECLARATIVE_APP_STORAGE_SCHEMA_VERSION,
    ...(sync != null ? { sync } : {}),
  } satisfies DeclarativeAppStorageMetadata)
}

async function readStorageMetadata(
  root: FileSystemDirectoryHandle,
  metadataFile: string,
): Promise<DeclarativeAppStorageMetadata | null | 'invalid'> {
  try {
    const handle = await root.getFileHandle(metadataFile)
    const raw = await (await handle.getFile()).text()
    const value = JSON.parse(raw) as Partial<DeclarativeAppStorageMetadata>
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

async function resetPersistedStorage(root: FileSystemDirectoryHandle, storageFile: string): Promise<void> {
  try {
    await root.removeEntry(storageFile)
  } catch (error) {
    if (!(error instanceof DOMException) || error.name !== 'NotFoundError') {
      throw error
    }
  }
}

async function preparePersistedStorage(
  root: FileSystemDirectoryHandle,
  storageFile: string,
  metadataFile: string,
): Promise<{
  initializationNotice: DeclarativeAppSyncRepositoryInitializationNotice | null
  syncMetadata: DeclarativeAppSyncMetadata | undefined
}> {
  const metadata = await readStorageMetadata(root, metadataFile)

  if (metadata === 'invalid') {
    await resetPersistedStorage(root, storageFile)
    await writeStorageMetadata(root, metadataFile)
    return {
      initializationNotice: {
        kind: 'recovered-storage',
        message: 'Unreadable persisted app metadata was reset before loading the repository.',
      },
      syncMetadata: undefined,
    }
  }

  if (metadata == null) {
    await writeStorageMetadata(root, metadataFile)
    return {
      initializationNotice: null,
      syncMetadata: undefined,
    }
  }

  if (metadata.schemaVersion !== DECLARATIVE_APP_STORAGE_SCHEMA_VERSION) {
    await resetPersistedStorage(root, storageFile)
    await writeStorageMetadata(root, metadataFile)
    return {
      initializationNotice: {
        kind: 'reset-incompatible-storage',
        message: `Persisted app data from schema v${metadata.schemaVersion} was reset for schema v${DECLARATIVE_APP_STORAGE_SCHEMA_VERSION}.`,
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

async function loadAppDocument(
  repository: DeclarativeRepository,
  id: string,
): Promise<DeclarativeRepositoryDocumentRecord | undefined> {
  const result = await repository.query({
    type: 'get-document',
    documentKind: 'app',
    id,
  })

  if (result.type !== 'get-document') {
    throw new Error(`Failed to load app document "${id}"`)
  }

  if (!result.found) {
    return undefined
  }

  if (result.record == null) {
    throw new Error(`Repository returned an empty app document result for "${id}"`)
  }

  if (result.record.documentKind !== 'app') {
    throw new Error(`Expected app document for "${id}"`)
  }

  return result.record
}

async function loadComponentRegistryEntry(
  repository: DeclarativeRepository,
  id: string,
): Promise<DeclarativeRepositoryDocumentRecord | undefined> {
  const result = await repository.query({
    type: 'get-document',
    documentKind: 'component-registry-entry',
    id,
  })

  if (result.type !== 'get-document') {
    throw new Error(`Failed to load component registry entry "${id}"`)
  }

  if (!result.found) {
    return undefined
  }

  if (result.record == null) {
    throw new Error(`Repository returned an empty component registry entry result for "${id}"`)
  }

  if (result.record.documentKind !== 'component-registry-entry') {
    throw new Error(`Expected component registry entry for "${id}"`)
  }

  return result.record
}

async function ensureInitialAppDocument(
  repository: DeclarativeRepository,
  app: AppDocument,
): Promise<DeclarativeRepositoryDocumentRecord> {
  const id = app.id ?? 'app.root'
  const existing = await loadAppDocument(repository, id)
  if (existing != null) {
    return existing
  }

  const result = await repository.mutate({
    type: 'put-document',
    documentKind: 'app',
    id,
    document: app,
  })

  if (result.type !== 'put-document' || result.record.documentKind !== 'app') {
    throw new Error(`Failed to seed app document "${id}"`)
  }

  return result.record
}

function buildAppSyncDocumentKey(documentKind: DeclarativeAppSyncDocumentKind, id: string): string {
  return `${documentKind}:${id}`
}

function toAppSyncDocumentRecord(record: DeclarativeRepositoryDocumentRecord): DeclarativeAppSyncDocumentRecord {
  if (record.documentKind === 'app') {
    const cloned = structuredClone(record)
    return {
      ...cloned,
      documentKind: 'app',
    }
  }

  if (record.documentKind === 'component-registry-entry') {
    const cloned = structuredClone(record)
    return {
      ...cloned,
      documentKind: 'component-registry-entry',
    }
  }

  throw new Error(`Expected app sync record, received "${record.documentKind}"`)
}

async function loadAppSyncDocument(
  repository: DeclarativeRepository,
  documentKind: DeclarativeAppSyncDocumentKind,
  id: string,
): Promise<DeclarativeAppSyncDocumentRecord | undefined> {
  const loaded =
    documentKind === 'app' ? await loadAppDocument(repository, id) : await loadComponentRegistryEntry(repository, id)

  return loaded != null ? toAppSyncDocumentRecord(loaded) : undefined
}

export async function initializeDeclarativeAppSyncRepository(
  app: AppDocument,
  options: InitializeDeclarativeAppSyncRepositoryOptions = {},
): Promise<DeclarativeAppSyncRepository> {
  const persistenceMode = resolveDeclarativeRepositoryPersistenceMode(
    options.persistence,
    options.syncEnvironment?.VITE_DECLARATIVE_PERSISTENCE_MODE,
  )
  const syncRecordLoadBatchSize = resolveDeclarativeAppSyncRecordLoadBatchSize(options)
  const syncAdapter =
    options.syncAdapter ?? createHttpDeclarativeSyncAdapter(resolveDeclarativeAppSyncTransportOptions(options))

  if (persistenceMode === 'remote-only') {
    const remoteRepository = createRemoteDeclarativeRepository({ syncAdapter })

    try {
      const record = await ensureInitialAppDocument(remoteRepository, app)

      return {
        storageMode: 'remote-only',
        persistenceMode,
        schemaVersion: DECLARATIVE_APP_STORAGE_SCHEMA_VERSION,
        initializationNotice: null,
        record,
        async loadDocument(id) {
          const loaded = await loadAppDocument(remoteRepository, id)
          if (loaded == null) {
            throw new DeclarativeAppSyncRepositoryNotFoundError(id)
          }

          return loaded
        },
        async listDocuments() {
          const result = await remoteRepository.query({
            type: 'list-documents',
            documentKind: 'app',
          })
          if (result.type !== 'list-documents') {
            throw new Error('Failed to list app documents')
          }
          return result.items.filter(item => item.documentKind === 'app')
        },
        async loadComponentRegistryEntry(id) {
          const loaded = await loadComponentRegistryEntry(remoteRepository, id)
          if (loaded == null) {
            throw new DeclarativeAppSyncRepositoryComponentRegistryEntryNotFoundError(id)
          }

          return loaded
        },
        async listComponentRegistryEntries() {
          const result = await remoteRepository.query({
            type: 'list-documents',
            documentKind: 'component-registry-entry',
          })
          if (result.type !== 'list-documents') {
            throw new Error('Failed to list component registry entries')
          }
          return result.items.filter(item => item.documentKind === 'component-registry-entry')
        },
        async saveComponentRegistryEntry(entry) {
          const result = await remoteRepository.mutate({
            type: 'put-document',
            documentKind: 'component-registry-entry',
            id: entry.id,
            document: entry,
          })

          if (result.type !== 'put-document' || result.record.documentKind !== 'component-registry-entry') {
            throw new Error(`Failed to save component registry entry "${entry.id}"`)
          }

          return result.record
        },
        async deleteComponentRegistryEntry(id, expectedRevision) {
          const result = await remoteRepository.mutate({
            type: 'delete-document',
            documentKind: 'component-registry-entry',
            id,
            expectedRevision,
          })

          if (result.type !== 'delete-document') {
            throw new Error(`Failed to delete component registry entry "${id}"`)
          }

          return result
        },
        async syncApps() {
          const result = await remoteRepository.refresh({ publish: true })
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
              documentKind: 'app',
              id,
            },
            listener,
          )
        },
        watchApps(listener) {
          return watchDeclarativeRepositoryListDocuments(
            remoteRepository,
            {
              type: 'list-documents',
              documentKind: 'app',
            },
            listener,
          )
        },
        watchComponentRegistryEntries(listener) {
          return watchDeclarativeRepositoryListDocuments(
            remoteRepository,
            {
              type: 'list-documents',
              documentKind: 'component-registry-entry',
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

  const namespace = options.storageNamespace ?? 'declarative-app-sync'
  const storageConfig = buildStorageConfig(namespace)
  const storage = await resolveRepositoryStorage(storageConfig.storageFile, persistenceMode)
  const preparedStorage =
    storage.kind === 'opfs'
      ? await preparePersistedStorage(storage.root, storageConfig.storageFile, storageConfig.metadataFile)
      : {
          initializationNotice: null,
          syncMetadata: undefined,
        }
  let initializationNotice = preparedStorage.initializationNotice
  let initialSyncMetadata = preparedStorage.syncMetadata

  async function initializeRepositoryStorage(): Promise<InitializedTinyBaseDeclarativeRepository> {
    if (storage.kind === 'opfs') {
      const fileHandle = await storage.root.getFileHandle(storageConfig.storageFile, {
        create: true,
      })

      return initializeTinyBaseDeclarativeRepository({
        storage: { kind: 'opfs', fileHandle },
        crossTab:
          typeof BroadcastChannel !== 'undefined'
            ? {
                kind: 'broadcast-channel',
                channelName: storageConfig.crossTabChannel,
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

    await resetPersistedStorage(storage.root, storageConfig.storageFile)
    await writeStorageMetadata(storage.root, storageConfig.metadataFile)
    initializationNotice = {
      kind: 'recovered-storage',
      message: 'Unreadable persisted app data was reset and the repository was reinitialized.',
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
    const syncRepository = repository
    const record = await ensureInitialAppDocument(syncRepository, app)

    async function persistSyncMetadata(syncMetadata: DeclarativeAppSyncMetadata | undefined): Promise<void> {
      if (storage.kind !== 'opfs') {
        return
      }

      await writeStorageMetadata(storage.root, storageConfig.metadataFile, syncMetadata)
    }

    async function collectLocalAppSyncRecords(): Promise<Map<string, DeclarativeAppSyncDocumentRecord>> {
      const records = new Map<string, DeclarativeAppSyncDocumentRecord>()

      for (const documentKind of DECLARATIVE_APP_SYNC_DOCUMENT_KINDS) {
        const result = await syncRepository.query({
          type: 'list-documents',
          documentKind,
        })
        if (result.type !== 'list-documents') {
          throw new Error(`Failed to list ${documentKind} documents for sync`)
        }

        const items = result.items.filter(item => item.documentKind === documentKind)
        for (let startIndex = 0; startIndex < items.length; startIndex += syncRecordLoadBatchSize) {
          await Promise.all(
            items.slice(startIndex, startIndex + syncRecordLoadBatchSize).map(async summary => {
              const loaded = await loadAppSyncDocument(syncRepository, documentKind, summary.id)
              if (loaded != null) {
                records.set(buildAppSyncDocumentKey(documentKind, summary.id), loaded)
              }
            }),
          )
        }
      }

      return records
    }

    const appSyncService = createDeclarativeAppSyncService({
      repository: syncRepository,
      syncAdapter,
      initialMetadata: initialSyncMetadata,
      persistSyncMetadata,
      async loadSyncDocument(documentKind, id) {
        return loadAppSyncDocument(syncRepository, documentKind, id)
      },
      async listSyncRecords() {
        return collectLocalAppSyncRecords()
      },
    })

    return {
      storageMode: storage.storageMode,
      persistenceMode,
      schemaVersion: DECLARATIVE_APP_STORAGE_SCHEMA_VERSION,
      initializationNotice,
      record,
      async loadDocument(id) {
        const loaded = await loadAppDocument(syncRepository, id)
        if (loaded == null) {
          throw new DeclarativeAppSyncRepositoryNotFoundError(id)
        }

        return loaded
      },
      async listDocuments() {
        const result = await syncRepository.query({
          type: 'list-documents',
          documentKind: 'app',
        })
        if (result.type !== 'list-documents') {
          throw new Error('Failed to list app documents')
        }
        return result.items.filter(item => item.documentKind === 'app')
      },
      async loadComponentRegistryEntry(id) {
        const loaded = await loadComponentRegistryEntry(syncRepository, id)
        if (loaded == null) {
          throw new DeclarativeAppSyncRepositoryComponentRegistryEntryNotFoundError(id)
        }

        return loaded
      },
      async listComponentRegistryEntries() {
        const result = await syncRepository.query({
          type: 'list-documents',
          documentKind: 'component-registry-entry',
        })
        if (result.type !== 'list-documents') {
          throw new Error('Failed to list component registry entries')
        }
        return result.items.filter(item => item.documentKind === 'component-registry-entry')
      },
      async saveComponentRegistryEntry(entry, expectedRevision) {
        const result = await syncRepository.mutate({
          type: 'put-document',
          documentKind: 'component-registry-entry',
          id: entry.id,
          document: entry,
          expectedRevision,
        })

        if (result.type !== 'put-document' || result.record.documentKind !== 'component-registry-entry') {
          throw new Error(`Failed to save component registry entry "${entry.id}"`)
        }

        await appSyncService.clearPendingDocumentDelete('component-registry-entry', entry.id)
        return result.record
      },
      async deleteComponentRegistryEntry(id, expectedRevision) {
        const result = await syncRepository.mutate({
          type: 'delete-document',
          documentKind: 'component-registry-entry',
          id,
          expectedRevision,
        })

        if (result.type !== 'delete-document') {
          throw new Error(`Failed to delete component registry entry "${id}"`)
        }

        if (result.deleted) {
          await appSyncService.markDocumentDeleted('component-registry-entry', id)
        }

        return result
      },
      async syncApps() {
        return appSyncService.syncApps()
      },
      watchDocument(id, listener) {
        return watchDeclarativeRepositoryDocument(
          syncRepository,
          {
            type: 'document',
            documentKind: 'app',
            id,
          },
          listener,
        )
      },
      watchApps(listener) {
        return watchDeclarativeRepositoryListDocuments(
          syncRepository,
          {
            type: 'list-documents',
            documentKind: 'app',
          },
          listener,
        )
      },
      watchComponentRegistryEntries(listener) {
        return watchDeclarativeRepositoryListDocuments(
          syncRepository,
          {
            type: 'list-documents',
            documentKind: 'component-registry-entry',
          },
          listener,
        )
      },
      async destroy() {
        syncRepository.destroy()
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
