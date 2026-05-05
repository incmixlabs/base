import { describe, expect, it, vi } from 'vitest'
import {
  COMPONENT_REGISTRY_ENTRY_KIND,
  COMPONENT_REGISTRY_SCHEMA_VERSION,
  type ComponentRegistryEntry,
} from './component-registry'
import {
  createCompositeWidgetInputFromComponentRegistryEntry,
  createCompositeWidgetRecordFromComponentRegistryRecord,
  initializeDashboardResourceRepository,
  normalizeCompositeWidgetRecord,
  normalizeDashboardTemplateRecord,
} from './dashboard-resource-repository'

const componentRegistryEntry: ComponentRegistryEntry = {
  schemaVersion: COMPONENT_REGISTRY_SCHEMA_VERSION,
  kind: COMPONENT_REGISTRY_ENTRY_KIND,
  id: 'ui.composite.revenue-card',
  slug: 'RevenueCard',
  title: 'Revenue Card',
  description: 'Reusable revenue card composite.',
  runtime: {
    kind: 'known-renderer',
    rendererId: 'ui.composite',
    componentName: 'Composite',
  },
  discovery: {
    summary: 'Shows revenue summary data.',
    group: 'Data display',
    hierarchy: ['composites', 'data-display'],
    tags: ['local', 'composite'],
  },
  ownership: {
    scope: 'private',
    ownerKind: 'user',
    ownerId: 'user_demo',
  },
  persistence: {
    source: 'registry',
    mutable: true,
    scope: 'repository',
  },
  meta: {
    templateKind: 'composite',
    sourceKind: 'local',
    compositeReferences: ['MetricCard'],
    compositeDefinition: {
      name: 'RevenueCard',
      sampleData: { label: 'Revenue' },
      jsonSchema: {
        type: 'object',
      },
      propsSchema: {
        type: 'object',
        properties: {
          currency: { type: 'string' },
        },
      },
      jsx: 'export default function RevenueCard() { return <Text>Revenue</Text> }',
    },
  },
}

describe('dashboard resource record normalization', () => {
  it('normalizes dashboard template defaults and preserves json-safe payloads', () => {
    const record = normalizeDashboardTemplateRecord(
      {
        id: 'template.support-grid',
        name: 'Support Grid',
        mode: 'grid',
        visibility: 'workspace',
        columns: { initial: 1, md: 8 },
        breakpoints: { md: 768 },
        layouts: {
          md: [{ id: 'revenue', x: 0, y: 0, w: 4, h: 2 }],
        },
        items: [{ id: 'revenue', x: 0, y: 0, w: 4, h: 2 }],
      },
      { now: '2026-04-11T12:00:00.000Z' },
    )

    expect(record).toMatchObject({
      kind: 'dashboard-template',
      id: 'template.support-grid',
      name: 'Support Grid',
      slug: 'support-grid',
      visibility: 'workspace',
      status: 'active',
      schemaVersion: 1,
      createdAt: '2026-04-11T12:00:00.000Z',
      updatedAt: '2026-04-11T12:00:00.000Z',
    })
    expect(record.layouts).toEqual({
      md: [{ id: 'revenue', x: 0, y: 0, w: 4, h: 2 }],
    })
  })

  it('normalizes composite widget defaults for the future backend contract', () => {
    const record = normalizeCompositeWidgetRecord(
      {
        id: 'composite.support-badge',
        name: 'Support Badge',
        definition: {
          name: 'SupportBadge',
          renderDefinition: { component: 'Text' },
        },
        dependencies: ['Text'],
      },
      { now: '2026-04-11T12:00:00.000Z' },
    )

    expect(record).toMatchObject({
      kind: 'composite-widget',
      id: 'composite.support-badge',
      name: 'Support Badge',
      slug: 'support-badge',
      visibility: 'private',
      status: 'draft',
      definition: {
        name: 'SupportBadge',
      },
      dependencies: ['Text'],
    })
  })

  it('rejects malformed required payloads', () => {
    expect(() =>
      normalizeDashboardTemplateRecord({
        id: '',
        name: 'Missing Id',
        mode: 'grid',
        columns: {},
        breakpoints: {},
        layouts: {},
        items: [],
      }),
    ).toThrow('dashboard template id is required')

    expect(() =>
      normalizeCompositeWidgetRecord({
        id: 'composite.empty',
        name: 'Empty Composite',
        definition: {},
      }),
    ).toThrow('composite widget definition is required')
  })

  it('projects existing component registry entries to composite widget records', () => {
    const input = createCompositeWidgetInputFromComponentRegistryEntry(componentRegistryEntry, {
      tenantId: 'tenant_demo',
    })
    const inputWithBlankDescription = createCompositeWidgetInputFromComponentRegistryEntry({
      ...componentRegistryEntry,
      description: '   ',
    })
    const inputWithoutOptionalMeta = createCompositeWidgetInputFromComponentRegistryEntry({
      ...componentRegistryEntry,
      meta: {
        compositeDefinition: componentRegistryEntry.meta?.compositeDefinition,
      },
    })

    expect(input).toMatchObject({
      id: 'ui.composite.revenue-card',
      tenantId: 'tenant_demo',
      ownerId: 'user_demo',
      name: 'Revenue Card',
      description: 'Reusable revenue card composite.',
      slug: 'RevenueCard',
      visibility: 'private',
      status: 'draft',
      definition: {
        name: 'RevenueCard',
      },
      propsSchema: {
        type: 'object',
      },
      metadata: {
        source: 'component-registry-entry',
        componentRegistryEntryId: 'ui.composite.revenue-card',
        templateKind: 'composite',
        sourceKind: 'local',
      },
    })
    expect(input.dependencies).toEqual([
      {
        kind: 'renderer',
        id: 'ui.composite',
        componentName: 'Composite',
      },
      {
        kind: 'composite-reference',
        name: 'MetricCard',
      },
    ])
    expect(inputWithBlankDescription.description).toBe('Shows revenue summary data.')
    expect(inputWithoutOptionalMeta.metadata).toMatchObject({
      source: 'component-registry-entry',
      componentRegistryEntryId: 'ui.composite.revenue-card',
    })
    expect(inputWithoutOptionalMeta.metadata).not.toHaveProperty('templateKind')
    expect(inputWithoutOptionalMeta.metadata).not.toHaveProperty('sourceKind')

    const record = createCompositeWidgetRecordFromComponentRegistryRecord({
      documentKind: 'component-registry-entry',
      id: componentRegistryEntry.id,
      revision: 'rev_1',
      title: componentRegistryEntry.title,
      slug: componentRegistryEntry.slug,
      scope: componentRegistryEntry.ownership.scope,
      tags: componentRegistryEntry.discovery.tags,
      createdAt: '2026-04-11T11:00:00.000Z',
      updatedAt: '2026-04-11T12:00:00.000Z',
      document: componentRegistryEntry,
    })

    expect(record).toMatchObject({
      kind: 'composite-widget',
      id: componentRegistryEntry.id,
      createdAt: '2026-04-11T11:00:00.000Z',
      updatedAt: '2026-04-11T12:00:00.000Z',
    })
  })

  it('normalizes blank now overrides before writing timestamps', () => {
    const record = normalizeCompositeWidgetRecord(
      {
        id: 'composite.blank-now',
        name: 'Blank Now',
        definition: {
          component: 'BlankNow',
        },
        createdAt: '2026-04-11T11:00:00.000Z',
        updatedAt: '2026-04-11T12:00:00.000Z',
      },
      {
        now: '   ',
      },
    )

    expect(record).toMatchObject({
      createdAt: '2026-04-11T11:00:00.000Z',
      updatedAt: '2026-04-11T12:00:00.000Z',
    })
  })
})

describe('initializeDashboardResourceRepository', () => {
  it('persists records in memory-local mode without touching OPFS', async () => {
    const getDirectory = vi.fn(() => {
      throw new Error('OPFS should not be initialized in memory-local mode')
    })
    vi.stubGlobal('navigator', {
      storage: {
        getDirectory,
      },
    })
    const repository = await initializeDashboardResourceRepository({
      persistence: { mode: 'memory-local' },
      now: () => '2026-04-11T12:00:00.000Z',
    })

    try {
      expect(repository.storageMode).toBe('memory')
      expect(getDirectory).not.toHaveBeenCalled()

      const saved = await repository.saveDashboardTemplate({
        id: 'template.support-grid',
        name: 'Support Grid',
        mode: 'grid',
        columns: { initial: 1, md: 8 },
        breakpoints: { md: 768 },
        layouts: {},
        items: [],
      })

      await expect(repository.loadResource(saved.id)).resolves.toMatchObject({
        kind: 'dashboard-template',
        id: saved.id,
      })
      await expect(repository.listResources({ kind: 'dashboard-template' })).resolves.toEqual([
        expect.objectContaining({
          kind: 'dashboard-template',
          id: saved.id,
        }),
      ])
    } finally {
      await repository.destroy()
      vi.unstubAllGlobals()
    }
  })

  it('supports composite widget archive and delete operations in memory-local mode', async () => {
    const repository = await initializeDashboardResourceRepository({
      persistence: { mode: 'memory-local' },
      now: () => '2026-04-11T12:00:00.000Z',
    })

    try {
      const saved = await repository.saveCompositeWidget({
        id: 'composite.revenue-card',
        name: 'Revenue Card',
        definition: {
          component: 'RevenueCard',
        },
        propsSchema: {
          type: 'object',
        },
        dataBindings: [{ id: 'revenue', bindTo: 'data.revenue' }],
        dependencies: ['MetricCard'],
      })

      await expect(repository.loadResource(saved.id)).resolves.toMatchObject({
        kind: 'composite-widget',
        id: saved.id,
        status: 'draft',
      })
      await expect(repository.listResources({ kind: 'composite-widget' })).resolves.toEqual([
        expect.objectContaining({
          kind: 'composite-widget',
          id: saved.id,
        }),
      ])

      await expect(repository.archiveResource(saved.id)).resolves.toMatchObject({
        kind: 'composite-widget',
        status: 'archived',
      })
      await expect(repository.deleteResource(saved.id)).resolves.toBe(true)
      await expect(repository.loadResource(saved.id)).resolves.toBeNull()
    } finally {
      await repository.destroy()
    }
  })

  it('marks local-first memory fallback as non-durable when OPFS is unavailable', async () => {
    vi.stubGlobal('navigator', {
      storage: undefined,
    })

    const repository = await initializeDashboardResourceRepository({
      persistence: { mode: 'local-first' },
    })

    try {
      expect(repository.storageMode).toBe('memory')
      expect(repository.initializationNotice).toMatchObject({
        kind: 'memory-fallback',
      })
      expect(repository.initializationNotice?.message).toContain('volatile memory')
    } finally {
      await repository.destroy()
      vi.unstubAllGlobals()
    }
  })

  it('initializes OPFS local-first mode with a TinyBase persister', async () => {
    const fileHandle = {} as FileSystemFileHandle
    const getFileHandle = vi.fn(async () => fileHandle)
    const getDirectory = vi.fn(async () => ({
      getFileHandle,
    }))
    const calls = {
      load: 0,
      startAutoSave: 0,
      destroy: 0,
    }
    vi.stubGlobal('navigator', {
      storage: {
        getDirectory,
      },
    })

    const repository = await initializeDashboardResourceRepository({
      persistence: { mode: 'local-first' },
      storageNamespace: 'test.dashboard-resources',
      persisterFactory: (_store, receivedFileHandle) => {
        expect(receivedFileHandle).toBe(fileHandle)
        return {
          async load() {
            calls.load += 1
          },
          async startAutoSave() {
            calls.startAutoSave += 1
          },
          async destroy() {
            calls.destroy += 1
          },
        }
      },
    })

    try {
      expect(repository.storageMode).toBe('opfs')
      expect(getDirectory).toHaveBeenCalledTimes(1)
      expect(getFileHandle).toHaveBeenCalledWith('test.dashboard-resources.tinybase.json', { create: true })
      expect(calls.load).toBe(1)
      expect(calls.startAutoSave).toBe(1)
    } finally {
      await repository.destroy()
      vi.unstubAllGlobals()
    }

    expect(calls.destroy).toBe(1)
  })

  it('rehydrates dashboard templates and composite widgets from OPFS-backed TinyBase state', async () => {
    const fileHandle = {} as FileSystemFileHandle
    const getDirectory = vi.fn(async () => ({
      getFileHandle: vi.fn(async () => fileHandle),
    }))
    let snapshot: unknown
    let captureSnapshot: (() => void) | null = null
    let now = '2026-04-11T12:00:00.000Z'

    vi.stubGlobal('navigator', {
      storage: {
        getDirectory,
      },
    })

    async function createRepository() {
      return initializeDashboardResourceRepository({
        persistence: { mode: 'local-first' },
        storageNamespace: 'test.dashboard-resources.reload',
        now: () => now,
        persisterFactory: store => {
          captureSnapshot = () => {
            snapshot = store.getTables()
          }
          return {
            async load() {
              if (snapshot != null) {
                store.setTables(snapshot as Parameters<typeof store.setTables>[0])
              }
            },
            async startAutoSave() {},
            async destroy() {},
          }
        },
      })
    }

    const repository = await createRepository()

    try {
      const savedTemplate = await repository.saveDashboardTemplate({
        id: 'template.support-grid',
        name: 'Support Grid',
        mode: 'grid',
        columns: { initial: 12 },
        breakpoints: { md: 768 },
        layouts: { initial: [] },
        items: [],
      })
      const savedWidget = await repository.saveCompositeWidget({
        id: 'composite.revenue-card',
        name: 'Revenue Card',
        definition: {
          component: 'RevenueCard',
        },
      })

      now = '2026-04-11T12:01:00.000Z'
      await expect(
        repository.saveDashboardTemplate({
          ...savedTemplate,
          name: 'Support Grid Updated',
        }),
      ).resolves.toMatchObject({
        createdAt: '2026-04-11T12:00:00.000Z',
        updatedAt: '2026-04-11T12:01:00.000Z',
      })

      captureSnapshot?.()
      await repository.destroy()

      const reloadedRepository = await createRepository()
      try {
        await expect(reloadedRepository.loadResource(savedTemplate.id)).resolves.toMatchObject({
          kind: 'dashboard-template',
          id: savedTemplate.id,
          name: 'Support Grid Updated',
          createdAt: '2026-04-11T12:00:00.000Z',
          updatedAt: '2026-04-11T12:01:00.000Z',
        })
        await expect(reloadedRepository.loadResource(savedWidget.id)).resolves.toMatchObject({
          kind: 'composite-widget',
          id: savedWidget.id,
          name: 'Revenue Card',
        })
      } finally {
        await reloadedRepository.destroy()
      }
    } finally {
      vi.unstubAllGlobals()
    }
  })

  it('does not initialize TinyBase or OPFS in remote-only mode', async () => {
    const getDirectory = vi.fn(() => {
      throw new Error('OPFS should not be initialized in remote-only mode')
    })
    vi.stubGlobal('navigator', {
      storage: {
        getDirectory,
      },
    })
    const repository = await initializeDashboardResourceRepository({
      persistence: { mode: 'remote-only' },
    })

    try {
      expect(repository.storageMode).toBe('remote-only')
      expect(getDirectory).not.toHaveBeenCalled()
      await expect(repository.listResources()).resolves.toEqual([])
      await expect(
        repository.saveDashboardTemplate({
          id: 'template.remote',
          name: 'Remote Template',
          mode: 'grid',
          columns: {},
          breakpoints: {},
          layouts: {},
          items: [],
        }),
      ).rejects.toThrow('Dashboard resource persistence is not available in remote-only mode yet')
    } finally {
      await repository.destroy()
      vi.unstubAllGlobals()
    }
  })
})
