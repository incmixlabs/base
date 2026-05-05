import { describe, expect, it } from 'vitest'
import {
  COMPONENT_REGISTRY_ENTRY_KIND,
  COMPONENT_REGISTRY_SCHEMA_VERSION,
  isComponentRegistryEntry,
  validateComponentRegistryEntry,
} from './component-registry'

function createEntry() {
  return {
    schemaVersion: COMPONENT_REGISTRY_SCHEMA_VERSION,
    kind: COMPONENT_REGISTRY_ENTRY_KIND,
    id: 'ui.button',
    slug: 'button',
    title: 'Button',
    description: 'Primary actions, variations, and loading states.',
    runtime: {
      kind: 'known-renderer' as const,
      rendererId: 'ui.element',
      componentName: 'Button',
    },
    discovery: {
      summary: 'Action trigger component',
      group: 'Actions',
      hierarchy: ['elements', 'actions'],
      tags: ['action', 'button'],
      keywords: ['cta', 'submit'],
    },
    ownership: {
      scope: 'public' as const,
      ownerKind: 'system' as const,
      ownerId: 'packages/ui',
    },
    persistence: {
      source: 'code' as const,
      mutable: false,
      scope: 'repository' as const,
      notes: 'Catalog seed entry backed by source code.',
    },
  }
}

describe('component registry contract', () => {
  it('accepts a valid registry entry', () => {
    const result = validateComponentRegistryEntry(createEntry())

    expect(result.errors).toEqual([])
    expect(result.entry?.runtime.componentName).toBe('Button')
    expect(isComponentRegistryEntry(createEntry())).toBe(true)
  })

  it('rejects invalid runtime and discovery metadata', () => {
    const result = validateComponentRegistryEntry({
      ...createEntry(),
      runtime: {
        kind: 'dynamic-renderer',
        rendererId: '',
        componentName: '',
      },
      discovery: {
        group: '',
        tags: ['action', ''],
      },
    })

    expect(result.errors.join(' ')).toContain('runtime.kind')
    expect(result.errors.join(' ')).toContain('runtime.rendererId')
    expect(result.errors.join(' ')).toContain('runtime.componentName')
    expect(result.errors.join(' ')).toContain('discovery.group')
    expect(result.errors.join(' ')).toContain('discovery.tags')
  })

  it('rejects invalid ownership and persistence semantics', () => {
    const invalidEntry = {
      ...createEntry(),
      ownership: {
        scope: 'team',
      },
      persistence: {
        source: 'database',
        mutable: 'yes',
        scope: 'local',
      },
    }
    const result = validateComponentRegistryEntry(invalidEntry)

    expect(result.errors.join(' ')).toContain('ownership.scope')
    expect(result.errors.join(' ')).toContain('persistence.source')
    expect(result.errors.join(' ')).toContain('persistence.mutable')
    expect(result.errors.join(' ')).toContain('persistence.scope')
    expect(isComponentRegistryEntry(invalidEntry)).toBe(false)
  })
})
