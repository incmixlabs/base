'use client'

import type { ElementDocsEntry } from './element-docs-types'

const typographyDocsLoaders = {
  text: () => import('./typography-docs-entries').then(module => module.typographyEntries.text),
  heading: () => import('./typography-docs-entries').then(module => module.typographyEntries.heading),
  link: () => import('./typography-docs-entries').then(module => module.typographyEntries.link),
  kbd: () => import('./typography-docs-entries').then(module => module.typographyEntries.kbd),
} as const satisfies Record<string, () => Promise<ElementDocsEntry>>

export type TypographyDocsSlug = keyof typeof typographyDocsLoaders

export async function loadTypographyDocsEntry(slug: string): Promise<ElementDocsEntry | null> {
  const loader = typographyDocsLoaders[slug as TypographyDocsSlug]
  return loader ? loader() : null
}
