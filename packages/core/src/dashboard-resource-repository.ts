import { createStore, type Store } from 'tinybase'
import type { ComponentRegistryEntry } from './component-registry'
import type {
  DeclarativeRepositoryPersistencePolicy,
  DeclarativeRepositoryStorageMode,
} from './declarative-repository-policy'
import { resolveDeclarativeRepositoryPersistenceMode } from './declarative-repository-policy'
import { cloneJsonValue, isJsonObject, isJsonValue } from './json-value'
import type { JsonObject, JsonValue } from './schema-ast'
import type { DeclarativeRepositoryDocumentRecord } from './worker-repository-boundary'

export type DashboardResourceVisibility = 'private' | 'workspace' | 'system'
export type DashboardResourceStatus = 'active' | 'archived'
export type CompositeWidgetStatus = 'draft' | 'published' | 'archived'
export type DashboardResourceRecordKind = 'dashboard-template' | 'composite-widget'

export type DashboardResourceEnvironment = {
  VITE_DECLARATIVE_PERSISTENCE_MODE?: string
}

export type DashboardResourceRepositoryInitializationNotice = {
  kind: 'memory-fallback' | 'recovered-storage' | 'reset-incompatible-storage'
  message: string
}

export type DashboardTemplateRecord = {
  kind: 'dashboard-template'
  id: string
  tenantId?: string
  ownerId?: string
  name: string
  description?: string
  slug: string
  visibility: DashboardResourceVisibility
  status: DashboardResourceStatus
  schemaVersion: number
  mode: 'grid' | 'masonry'
  columns: JsonObject
  breakpoints: JsonObject
  layouts: JsonObject
  items: JsonValue[]
  metadata: JsonObject
  createdAt: string
  updatedAt: string
}

export type CompositeWidgetRecord = {
  kind: 'composite-widget'
  id: string
  tenantId?: string
  ownerId?: string
  name: string
  description?: string
  slug: string
  visibility: DashboardResourceVisibility
  status: CompositeWidgetStatus
  schemaVersion: number
  definition: JsonObject
  propsSchema: JsonObject
  dataBindings: JsonValue[]
  dependencies: JsonValue[]
  metadata: JsonObject
  createdAt: string
  updatedAt: string
}

export type DashboardResourceRecord = DashboardTemplateRecord | CompositeWidgetRecord

export type DashboardResourceSummary = Pick<
  DashboardResourceRecord,
  | 'kind'
  | 'id'
  | 'name'
  | 'description'
  | 'slug'
  | 'visibility'
  | 'status'
  | 'schemaVersion'
  | 'createdAt'
  | 'updatedAt'
> & {
  ownerId?: string
  tenantId?: string
}

export type DashboardResourceListOptions = {
  kind?: DashboardResourceRecordKind
  status?: DashboardResourceRecord['status']
  visibility?: DashboardResourceVisibility
}

export type DashboardResourceRepositoryStorageMode = DeclarativeRepositoryStorageMode

export type DashboardResourceRepository = {
  storageMode: DashboardResourceRepositoryStorageMode
  initializationNotice: DashboardResourceRepositoryInitializationNotice | null
  listResources(options?: DashboardResourceListOptions): Promise<DashboardResourceSummary[]>
  loadResource(id: string): Promise<DashboardResourceRecord | null>
  saveDashboardTemplate(input: DashboardTemplateRecord | CreateDashboardTemplateInput): Promise<DashboardTemplateRecord>
  saveCompositeWidget(input: CompositeWidgetRecord | CreateCompositeWidgetInput): Promise<CompositeWidgetRecord>
  archiveResource(id: string): Promise<DashboardResourceRecord | null>
  deleteResource(id: string): Promise<boolean>
  destroy(): Promise<void>
}

export type CreateDashboardTemplateInput = Partial<Omit<DashboardTemplateRecord, 'kind' | 'createdAt' | 'updatedAt'>> &
  Pick<DashboardTemplateRecord, 'id' | 'name' | 'mode' | 'columns' | 'breakpoints' | 'layouts' | 'items'>

export type CreateCompositeWidgetInput = Partial<Omit<CompositeWidgetRecord, 'kind' | 'createdAt' | 'updatedAt'>> &
  Pick<CompositeWidgetRecord, 'id' | 'name' | 'definition'>

export type ProjectedCompositeWidgetInput = Omit<CompositeWidgetRecord, 'kind' | 'createdAt' | 'updatedAt'>

export type ComponentRegistryCompositeWidgetProjectionOptions = {
  tenantId?: string
  ownerId?: string
  visibility?: DashboardResourceVisibility
  status?: CompositeWidgetStatus
  now?: string
}

export type ComponentRegistryEntryRecord = DeclarativeRepositoryDocumentRecord & {
  documentKind: 'component-registry-entry'
  createdAt?: string
  document: ComponentRegistryEntry
}

export type InitializeDashboardResourceRepositoryOptions = {
  persistence?: DeclarativeRepositoryPersistencePolicy
  storageNamespace?: string
  environment?: DashboardResourceEnvironment
  now?: () => string
  persisterFactory?: (
    store: Store,
    fileHandle: FileSystemFileHandle,
  ) => Promise<DashboardResourcePersister> | DashboardResourcePersister
}

const RESOURCES_TABLE = 'dashboardResources'
const KIND_CELL = 'kind'
const NAME_CELL = 'name'
const DESCRIPTION_CELL = 'description'
const SLUG_CELL = 'slug'
const TENANT_ID_CELL = 'tenantId'
const OWNER_ID_CELL = 'ownerId'
const VISIBILITY_CELL = 'visibility'
const STATUS_CELL = 'status'
const SCHEMA_VERSION_CELL = 'schemaVersion'
const CREATED_AT_CELL = 'createdAt'
const UPDATED_AT_CELL = 'updatedAt'
const DOCUMENT_CELL = 'documentJson'

export const DASHBOARD_RESOURCE_SCHEMA_VERSION = 1

function slugify(value: string) {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return slug || 'untitled'
}

function readText(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : undefined
}

function readVisibility(value: unknown): DashboardResourceVisibility {
  return value === 'workspace' || value === 'system' || value === 'private' ? value : 'private'
}

function readDashboardStatus(value: unknown): DashboardResourceStatus {
  return value === 'archived' ? 'archived' : 'active'
}

function readCompositeStatus(value: unknown): CompositeWidgetStatus {
  return value === 'published' || value === 'archived' || value === 'draft' ? value : 'draft'
}

function readSchemaVersion(value: unknown): number {
  return typeof value === 'number' && Number.isInteger(value) && value > 0 ? value : DASHBOARD_RESOURCE_SCHEMA_VERSION
}

function cloneJsonObject(value: unknown): JsonObject {
  return isJsonObject(value) && isJsonValue(value) ? (cloneJsonValue(value) as JsonObject) : {}
}

function cloneJsonArray(value: unknown): JsonValue[] {
  return Array.isArray(value) && value.every(isJsonValue) ? value.map(item => cloneJsonValue(item)) : []
}

function readStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value
        .filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
        .map(item => item.trim())
    : []
}

function normalizeDashboardMode(value: unknown): DashboardTemplateRecord['mode'] {
  return value === 'masonry' ? 'masonry' : 'grid'
}

function assertRequiredText(value: unknown, fieldName: string) {
  const text = readText(value)
  if (text == null) {
    throw new Error(`${fieldName} is required`)
  }
  return text
}

export function normalizeDashboardTemplateRecord(
  input: DashboardTemplateRecord | CreateDashboardTemplateInput,
  options: { existing?: DashboardTemplateRecord; now?: string } = {},
): DashboardTemplateRecord {
  const id = assertRequiredText(input.id, 'dashboard template id')
  const name = assertRequiredText(input.name, 'dashboard template name')
  const inputUpdatedAt = 'updatedAt' in input ? input.updatedAt : undefined
  const inputCreatedAt = 'createdAt' in input ? input.createdAt : undefined
  const updatedAt = readText(options.now) ?? readText(inputUpdatedAt) ?? new Date().toISOString()
  const existing = options.existing

  return {
    kind: 'dashboard-template',
    id,
    tenantId: readText(input.tenantId ?? existing?.tenantId),
    ownerId: readText(input.ownerId ?? existing?.ownerId),
    name,
    description: readText(input.description),
    slug: readText(input.slug) ?? slugify(name),
    visibility: readVisibility(input.visibility ?? existing?.visibility),
    status: readDashboardStatus(input.status ?? existing?.status),
    schemaVersion: readSchemaVersion(input.schemaVersion ?? existing?.schemaVersion),
    mode: normalizeDashboardMode(input.mode),
    columns: cloneJsonObject(input.columns),
    breakpoints: cloneJsonObject(input.breakpoints),
    layouts: cloneJsonObject(input.layouts),
    items: cloneJsonArray(input.items),
    metadata: cloneJsonObject(input.metadata),
    createdAt: existing?.createdAt ?? readText(inputCreatedAt) ?? updatedAt,
    updatedAt,
  }
}

export function normalizeCompositeWidgetRecord(
  input: CompositeWidgetRecord | CreateCompositeWidgetInput,
  options: { existing?: CompositeWidgetRecord; now?: string } = {},
): CompositeWidgetRecord {
  const id = assertRequiredText(input.id, 'composite widget id')
  const name = assertRequiredText(input.name, 'composite widget name')
  const definition = cloneJsonObject(input.definition)
  if (Object.keys(definition).length === 0) {
    throw new Error('composite widget definition is required')
  }
  const inputUpdatedAt = 'updatedAt' in input ? input.updatedAt : undefined
  const inputCreatedAt = 'createdAt' in input ? input.createdAt : undefined
  const updatedAt = readText(options.now) ?? readText(inputUpdatedAt) ?? new Date().toISOString()
  const existing = options.existing

  return {
    kind: 'composite-widget',
    id,
    tenantId: readText(input.tenantId ?? existing?.tenantId),
    ownerId: readText(input.ownerId ?? existing?.ownerId),
    name,
    description: readText(input.description),
    slug: readText(input.slug) ?? slugify(name),
    visibility: readVisibility(input.visibility ?? existing?.visibility),
    status: readCompositeStatus(input.status ?? existing?.status),
    schemaVersion: readSchemaVersion(input.schemaVersion ?? existing?.schemaVersion),
    definition,
    propsSchema: cloneJsonObject(input.propsSchema),
    dataBindings: cloneJsonArray(input.dataBindings),
    dependencies: cloneJsonArray(input.dependencies),
    metadata: cloneJsonObject(input.metadata),
    createdAt: existing?.createdAt ?? readText(inputCreatedAt) ?? updatedAt,
    updatedAt,
  }
}

function getComponentRegistryVisibility(
  entry: ComponentRegistryEntry,
  override: DashboardResourceVisibility | undefined,
): DashboardResourceVisibility {
  if (override != null) return override
  if (entry.ownership.scope === 'private') return 'private'
  if (entry.ownership.ownerKind === 'system' || entry.persistence.source === 'code') return 'system'
  return 'workspace'
}

function getComponentRegistryStatus(
  entry: ComponentRegistryEntry,
  override: CompositeWidgetStatus | undefined,
): CompositeWidgetStatus {
  return override ?? (entry.persistence.mutable ? 'draft' : 'published')
}

function getComponentRegistryCompositeDefinition(entry: ComponentRegistryEntry): JsonObject {
  return cloneJsonObject(isJsonObject(entry.meta) ? entry.meta.compositeDefinition : undefined)
}

function getComponentRegistryCompositeDependencies(entry: ComponentRegistryEntry): JsonValue[] {
  const references = readStringArray(isJsonObject(entry.meta) ? entry.meta.compositeReferences : undefined)
  return [
    {
      kind: 'renderer',
      id: entry.runtime.rendererId,
      componentName: entry.runtime.componentName,
    },
    ...references.map(reference => ({
      kind: 'composite-reference',
      name: reference,
    })),
  ]
}

function getComponentRegistryCompositeMetadata(entry: ComponentRegistryEntry): JsonObject {
  const meta = isJsonObject(entry.meta) ? entry.meta : {}
  const templateKind = readText(meta.templateKind)
  const sourceKind = readText(meta.sourceKind)
  return {
    source: 'component-registry-entry',
    componentRegistryEntryId: entry.id,
    componentRegistrySchemaVersion: entry.schemaVersion,
    ...(templateKind != null ? { templateKind } : {}),
    ...(sourceKind != null ? { sourceKind } : {}),
    discovery: cloneJsonObject(entry.discovery),
    runtime: cloneJsonObject(entry.runtime),
    persistence: cloneJsonObject(entry.persistence),
  }
}

export function createCompositeWidgetInputFromComponentRegistryEntry(
  entry: ComponentRegistryEntry,
  options: ComponentRegistryCompositeWidgetProjectionOptions = {},
): ProjectedCompositeWidgetInput {
  const definition = getComponentRegistryCompositeDefinition(entry)
  const fallbackDefinition: JsonObject = {
    source: 'component-registry-entry',
    componentRegistryEntryId: entry.id,
    rendererId: entry.runtime.rendererId,
    componentName: entry.runtime.componentName,
  }

  return {
    id: entry.id,
    tenantId: readText(options.tenantId),
    ownerId: readText(options.ownerId ?? entry.ownership.ownerId),
    name: entry.title,
    description: readText(entry.description) ?? readText(entry.discovery.summary),
    slug: entry.slug,
    visibility: getComponentRegistryVisibility(entry, options.visibility),
    status: getComponentRegistryStatus(entry, options.status),
    schemaVersion: DASHBOARD_RESOURCE_SCHEMA_VERSION,
    definition: Object.keys(definition).length > 0 ? definition : fallbackDefinition,
    propsSchema: cloneJsonObject(definition.propsSchema),
    dataBindings: cloneJsonArray(isJsonObject(entry.meta) ? entry.meta.dataBindings : undefined),
    dependencies: getComponentRegistryCompositeDependencies(entry),
    metadata: getComponentRegistryCompositeMetadata(entry),
  }
}

export function createCompositeWidgetRecordFromComponentRegistryRecord(
  record: ComponentRegistryEntryRecord,
  options: ComponentRegistryCompositeWidgetProjectionOptions = {},
): CompositeWidgetRecord {
  const updatedAt = readText(record.updatedAt) ?? readText(options.now) ?? new Date().toISOString()
  const createdAt = readText(record.createdAt) ?? updatedAt
  const input = createCompositeWidgetInputFromComponentRegistryEntry(record.document, options)
  return normalizeCompositeWidgetRecord(
    {
      ...input,
      kind: 'composite-widget' as const,
      createdAt,
      updatedAt,
    },
    { now: updatedAt },
  )
}

function getSummary(record: DashboardResourceRecord): DashboardResourceSummary {
  return {
    kind: record.kind,
    id: record.id,
    tenantId: record.tenantId,
    ownerId: record.ownerId,
    name: record.name,
    description: record.description,
    slug: record.slug,
    visibility: record.visibility,
    status: record.status,
    schemaVersion: record.schemaVersion,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  }
}

function readStringCell(store: Store, rowId: string, cellId: string): string | undefined {
  const value = store.getCell(RESOURCES_TABLE, rowId, cellId)
  return typeof value === 'string' && value.length > 0 ? value : undefined
}

function readResourceRow(store: Store, id: string): DashboardResourceRecord | null {
  const raw = readStringCell(store, id, DOCUMENT_CELL)
  if (raw == null) return null

  try {
    const parsed = JSON.parse(raw) as unknown
    if (!isJsonObject(parsed)) return null
    if (parsed.kind === 'dashboard-template') return normalizeDashboardTemplateRecord(parsed as DashboardTemplateRecord)
    if (parsed.kind === 'composite-widget') return normalizeCompositeWidgetRecord(parsed as CompositeWidgetRecord)
    return null
  } catch {
    return null
  }
}

function writeResourceRow(store: Store, record: DashboardResourceRecord) {
  store.setRow(RESOURCES_TABLE, record.id, {
    [KIND_CELL]: record.kind,
    [NAME_CELL]: record.name,
    [DESCRIPTION_CELL]: record.description ?? '',
    [SLUG_CELL]: record.slug,
    [TENANT_ID_CELL]: record.tenantId ?? '',
    [OWNER_ID_CELL]: record.ownerId ?? '',
    [VISIBILITY_CELL]: record.visibility,
    [STATUS_CELL]: record.status,
    [SCHEMA_VERSION_CELL]: record.schemaVersion,
    [CREATED_AT_CELL]: record.createdAt,
    [UPDATED_AT_CELL]: record.updatedAt,
    [DOCUMENT_CELL]: JSON.stringify(record),
  })
}

function listResourceSummaries(store: Store, options: DashboardResourceListOptions = {}) {
  return store
    .getRowIds(RESOURCES_TABLE)
    .map(id => readResourceRow(store, id))
    .filter((record): record is DashboardResourceRecord => record != null)
    .filter(record => options.kind == null || record.kind === options.kind)
    .filter(record => options.status == null || record.status === options.status)
    .filter(record => options.visibility == null || record.visibility === options.visibility)
    .map(getSummary)
    .sort((left, right) => {
      const updatedComparison = right.updatedAt.localeCompare(left.updatedAt)
      if (updatedComparison !== 0) return updatedComparison
      return left.name.localeCompare(right.name)
    })
}

type DashboardResourceRepositoryStorage =
  | {
      kind: 'memory'
      initializationNotice?: DashboardResourceRepositoryInitializationNotice | null
    }
  | {
      kind: 'opfs'
      root: FileSystemDirectoryHandle
      fileHandle: FileSystemFileHandle
    }

export type DashboardResourcePersister = {
  load(): Promise<unknown>
  startAutoSave(): Promise<unknown>
  destroy(): Promise<unknown>
}

async function createTinyBasePersister(
  store: Store,
  fileHandle: FileSystemFileHandle,
): Promise<DashboardResourcePersister> {
  const { createOpfsPersister } = await import('tinybase/persisters/persister-browser')
  return createOpfsPersister(store, fileHandle)
}

function buildStorageConfig(namespace: string) {
  return {
    storageFile: `${namespace}.tinybase.json`,
  }
}

async function resolveDashboardResourceStorage(
  storageFile: string,
  mode: ReturnType<typeof resolveDeclarativeRepositoryPersistenceMode>,
): Promise<DashboardResourceRepositoryStorage> {
  if (mode === 'memory-local') {
    return { kind: 'memory' }
  }

  if (
    typeof navigator === 'undefined' ||
    navigator.storage == null ||
    typeof navigator.storage.getDirectory !== 'function'
  ) {
    return {
      kind: 'memory',
      initializationNotice: {
        kind: 'memory-fallback',
        message: 'OPFS is unavailable, so dashboard resources are stored in volatile memory for this session.',
      },
    }
  }

  try {
    const root = await navigator.storage.getDirectory()
    const fileHandle = await root.getFileHandle(storageFile, { create: true })
    return { kind: 'opfs', root, fileHandle }
  } catch {
    return {
      kind: 'memory',
      initializationNotice: {
        kind: 'memory-fallback',
        message: 'OPFS could not be opened, so dashboard resources are stored in volatile memory for this session.',
      },
    }
  }
}

function createLocalDashboardResourceRepository({
  store,
  storageMode,
  now,
  initializationNotice = null,
  destroy = async () => {},
}: {
  store: Store
  storageMode: DashboardResourceRepositoryStorageMode
  now: () => string
  initializationNotice?: DashboardResourceRepositoryInitializationNotice | null
  destroy?: () => Promise<void>
}): DashboardResourceRepository {
  async function loadResource(id: string) {
    return readResourceRow(store, id)
  }

  return {
    storageMode,
    initializationNotice,
    async listResources(options) {
      return listResourceSummaries(store, options)
    },
    loadResource,
    async saveDashboardTemplate(input) {
      const existing = await loadResource(input.id)
      if (existing != null && existing.kind !== 'dashboard-template') {
        throw new Error(`Resource "${input.id}" is not a dashboard template`)
      }
      const record = normalizeDashboardTemplateRecord(input, {
        existing: existing ?? undefined,
        now: now(),
      })
      writeResourceRow(store, record)
      return record
    },
    async saveCompositeWidget(input) {
      const existing = await loadResource(input.id)
      if (existing != null && existing.kind !== 'composite-widget') {
        throw new Error(`Resource "${input.id}" is not a composite widget`)
      }
      const record = normalizeCompositeWidgetRecord(input, {
        existing: existing ?? undefined,
        now: now(),
      })
      writeResourceRow(store, record)
      return record
    },
    async archiveResource(id) {
      const existing = await loadResource(id)
      if (existing == null) return null
      const record =
        existing.kind === 'dashboard-template'
          ? normalizeDashboardTemplateRecord({ ...existing, status: 'archived' }, { existing, now: now() })
          : normalizeCompositeWidgetRecord({ ...existing, status: 'archived' }, { existing, now: now() })
      writeResourceRow(store, record)
      return record
    },
    async deleteResource(id) {
      const existing = await loadResource(id)
      store.delRow(RESOURCES_TABLE, id)
      return existing != null
    },
    destroy,
  }
}

function createRemoteOnlyDashboardResourceRepository(): DashboardResourceRepository {
  const unsupported = (): never => {
    throw new Error('Dashboard resource persistence is not available in remote-only mode yet')
  }

  return {
    storageMode: 'remote-only',
    initializationNotice: null,
    async listResources() {
      return []
    },
    async loadResource() {
      return null
    },
    async saveDashboardTemplate() {
      return unsupported()
    },
    async saveCompositeWidget() {
      return unsupported()
    },
    async archiveResource() {
      return unsupported()
    },
    async deleteResource() {
      return unsupported()
    },
    async destroy() {},
  }
}

export async function initializeDashboardResourceRepository(
  options: InitializeDashboardResourceRepositoryOptions = {},
): Promise<DashboardResourceRepository> {
  const persistenceMode = resolveDeclarativeRepositoryPersistenceMode(
    options.persistence,
    options.environment?.VITE_DECLARATIVE_PERSISTENCE_MODE,
  )
  if (persistenceMode === 'remote-only') {
    return createRemoteOnlyDashboardResourceRepository()
  }

  const namespace = options.storageNamespace ?? 'dashboard-resources'
  const storageConfig = buildStorageConfig(namespace)
  const storage = await resolveDashboardResourceStorage(storageConfig.storageFile, persistenceMode)
  const store = createStore()
  const now = options.now ?? (() => new Date().toISOString())

  if (storage.kind === 'memory') {
    return createLocalDashboardResourceRepository({
      store,
      storageMode: 'memory',
      initializationNotice: storage.initializationNotice,
      now,
    })
  }

  const persister = await (options.persisterFactory ?? createTinyBasePersister)(store, storage.fileHandle)

  try {
    await persister.load()
    await persister.startAutoSave()
  } catch (error) {
    try {
      await persister.destroy()
    } catch {
      // Preserve the original initialization failure.
    }
    throw error
  }

  return createLocalDashboardResourceRepository({
    store,
    storageMode: 'opfs',
    now,
    destroy: async () => {
      await persister.destroy()
    },
  })
}
