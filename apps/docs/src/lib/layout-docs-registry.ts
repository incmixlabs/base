'use client'

import type { ElementDocsEntry } from './element-docs-types'

async function loadLayoutDocsEntryByKey(key: string): Promise<ElementDocsEntry> {
  const module = await import('./layout-docs-entries')
  const entry = module.layoutDocsEntries[key]
  if (entry == null) {
    throw new Error(`Missing layout docs entry for "${key}"`)
  }

  return entry
}

const layoutDocsLoaders = {
  masonry: () => loadLayoutDocsEntryByKey('masonry'),
  'aspect-ratio': () => loadLayoutDocsEntryByKey('aspect-ratio'),
  box: () => loadLayoutDocsEntryByKey('box'),
  container: () => loadLayoutDocsEntryByKey('container'),
  flex: () => loadLayoutDocsEntryByKey('flex'),
  grid: () => loadLayoutDocsEntryByKey('grid'),
  section: () => loadLayoutDocsEntryByKey('section'),
  sidebar: () => loadLayoutDocsEntryByKey('sidebar'),
} as const satisfies Record<string, () => Promise<ElementDocsEntry>>

export type LayoutDocsSlug = keyof typeof layoutDocsLoaders

export async function loadLayoutDocsEntry(slug: string): Promise<ElementDocsEntry | null> {
  const loader = layoutDocsLoaders[slug as LayoutDocsSlug]
  return loader ? loader() : null
}
