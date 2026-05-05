import { validateComponentRegistryEntry } from '@incmix/core'
import { beforeAll, describe, expect, it } from 'vitest'
import { catalog, getCatalogEntryRuntimeScopeLoader, loadCatalogEntryRuntimeScope } from './catalog'

function getReferencedComponentNames(code: string) {
  return [...code.matchAll(/<\s*([A-Z][A-Za-z0-9]*)[\s./>]/g)].map(match => match[1]).filter(Boolean)
}

describe('catalog registry contract', () => {
  const runtimeScopesBySlug = new Map<string, Record<string, unknown>>()

  beforeAll(async () => {
    const preloadBatchSize = 4
    for (let index = 0; index < catalog.length; index += preloadBatchSize) {
      const scopes = await Promise.all(
        catalog.slice(index, index + preloadBatchSize).map(async entry => {
          return [entry.slug, await loadCatalogEntryRuntimeScope(entry)] as const
        }),
      )
      for (const [slug, scope] of scopes) {
        runtimeScopesBySlug.set(slug, scope)
      }
    }
  }, 30_000)

  it('keeps all seed entries valid against the component registry contract', () => {
    for (const entry of catalog) {
      const result = validateComponentRegistryEntry(entry)
      expect(result.errors).toEqual([])
    }
  })

  it('keeps runtime bindings aligned with local component bindings', async () => {
    for (const entry of catalog) {
      expect(entry.runtime.kind).toBe('known-renderer')
      const runtimeScope = runtimeScopesBySlug.get(entry.slug)
      expect(runtimeScope?.[entry.runtime.componentName]).toBeDefined()
    }
  })

  it('returns code-accepting runtime scope loaders for catalog entries', async () => {
    const buttonEntry = catalog.find(entry => entry.slug === 'button')
    expect(buttonEntry).toBeDefined()

    const scopeLoader = getCatalogEntryRuntimeScopeLoader(buttonEntry!)
    expect(scopeLoader).toBeDefined()

    const runtimeScope = await scopeLoader!('<Button>Save</Button>')
    expect(runtimeScope.Button).toBeDefined()
  })

  it('returns undefined runtime scope loaders for unknown slugs', () => {
    expect(getCatalogEntryRuntimeScopeLoader({ slug: 'missing-component' })).toBeUndefined()
  })

  it('exposes every component referenced by each overview snippet', async () => {
    for (const entry of catalog) {
      const runtimeScope = runtimeScopesBySlug.get(entry.slug)
      const referencedComponentNames = new Set(getReferencedComponentNames(entry.overviewCode))

      for (const componentName of referencedComponentNames) {
        expect(
          runtimeScope?.[componentName],
          `${entry.slug} overview references ${componentName}, but its runtime scope does not expose it`,
        ).toBeDefined()
      }
    }
  })

  it('provides discovery metadata suitable for catalog search', () => {
    for (const entry of catalog) {
      expect(entry.discovery.summary ?? entry.description).toBeTruthy()
      expect(entry.discovery.group).toBeTruthy()
      expect(entry.discovery.hierarchy?.length).toBeGreaterThan(0)
      expect(entry.discovery.tags?.length).toBeGreaterThan(0)
      expect(entry.discovery.keywords?.length).toBeGreaterThan(0)
    }
  })

  it('keeps composite templates searchable and previewable', () => {
    const composites = catalog.filter(entry => entry.family === 'composites')
    expect(composites.length).toBeGreaterThan(0)

    for (const entry of composites) {
      expect(entry.discovery.summary).toEqual(expect.any(String))
      expect(entry.discovery.tags?.length).toBeGreaterThan(0)
      expect(entry.discovery.keywords?.length).toBeGreaterThan(0)
      expect(entry.propDefs.map(prop => prop.name)).toEqual(expect.arrayContaining(['name', 'data']))
      expect(entry.meta?.previewImage).toEqual(expect.any(String))
      expect(entry.meta?.dependencies).toEqual(expect.arrayContaining([expect.any(String)]))
    }
  })
})
