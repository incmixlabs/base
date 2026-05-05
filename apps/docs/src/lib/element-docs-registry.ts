'use client'

import type { ElementDocsEntry } from './element-docs-types'

function requireEntry(slug: string, entry: ElementDocsEntry | undefined): ElementDocsEntry {
  if (!entry) throw new Error(`Missing element docs entry for slug "${slug}"`)
  return entry
}

const pickRequiredEntry =
  <TModule>(slug: string, pick: (module: TModule) => ElementDocsEntry | undefined) =>
  (module: TModule) =>
    requireEntry(slug, pick(module))

const elementDocsLoaders = {
  accordion: () => import('./element-docs-entry-groups/controls').then(module => module.controlEntries.accordion),
  'alert-dialog': () =>
    import('./element-docs-entry-groups/extended').then(module => module.extendedEntries['alert-dialog']),
  avatar: () => import('./element-docs-entry-groups/avatars').then(module => module.avatarEntries.avatar),
  'avatar-group': () =>
    import('./element-docs-entry-groups/avatars').then(module => module.avatarEntries['avatar-group']),
  'avatar-pie': () => import('./element-docs-entry-groups/avatars').then(module => module.avatarEntries['avatar-pie']),
  badge: () => import('./element-docs-entry-groups/feedback').then(module => module.feedbackEntries.badge),
  button: () => import('./element-docs-entry-groups/actions').then(module => module.actionEntries.button),
  callout: () => import('./element-docs-entry-groups/feedback').then(module => module.feedbackEntries.callout),
  card: () =>
    import('./element-docs-entry-groups/surfaces').then(
      pickRequiredEntry('card', module => module.surfaceEntries.card),
    ),
  'data-list': () =>
    import('./element-docs-entry-groups/surfaces').then(
      pickRequiredEntry('data-list', module => module.surfaceEntries['data-list']),
    ),
  'context-menu': () =>
    import('./element-docs-entry-groups/extended').then(module => module.extendedEntries['context-menu']),
  dialog: () => import('./element-docs-entry-groups/extended').then(module => module.extendedEntries.dialog),
  'dropdown-menu': () =>
    import('./element-docs-entry-groups/extended').then(module => module.extendedEntries['dropdown-menu']),
  image: () => import('./element-docs-entry-groups/media').then(module => module.mediaEntries.image),
  'icon-button': () =>
    import('./element-docs-entry-groups/actions').then(module => module.actionEntries['icon-button']),
  popover: () => import('./element-docs-entry-groups/actions').then(module => module.actionEntries.popover),
  'scroll-area': () =>
    import('./element-docs-entry-groups/extended').then(module => module.extendedEntries['scroll-area']),
  'segmented-control': () =>
    import('./element-docs-entry-groups/controls').then(module => module.controlEntries['segmented-control']),
  slider: () => import('./element-docs-entry-groups/controls').then(module => module.controlEntries.slider),
  spinner: () => import('./element-docs-entry-groups/feedback').then(module => module.feedbackEntries.spinner),
  table: () => import('./element-docs-entry-groups/extended').then(module => module.extendedEntries.table),
  tabs: () => import('./element-docs-entry-groups/controls').then(module => module.controlEntries.tabs),
  timeline: () => import('./element-docs-entry-groups/extended').then(module => module.extendedEntries.timeline),
  toast: () => import('./element-docs-entry-groups/feedback').then(module => module.feedbackEntries.toast),
} as const satisfies Record<string, () => Promise<ElementDocsEntry>>

export type ElementDocsSlug = keyof typeof elementDocsLoaders

export async function loadElementDocsEntry(slug: string): Promise<ElementDocsEntry | null> {
  const loader = elementDocsLoaders[slug as ElementDocsSlug]
  return loader ? loader() : null
}
