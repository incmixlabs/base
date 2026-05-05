'use client'

import type { ElementDocsEntry } from './element-docs-types'

const formDocsLoaders = {
  checkbox: () => import('./form-docs-entries').then(module => module.formEntries.checkbox),
  'checkbox-group': () => import('./form-docs-entries').then(module => module.formEntries['checkbox-group']),
  'radio-group': () => import('./form-docs-entries').then(module => module.formEntries['radio-group']),
  rating: () => import('./form-docs-entries').then(module => module.formEntries.rating),
  select: () => import('./form-docs-entries').then(module => module.formEntries.select),
  stepper: () => import('./form-docs-entries').then(module => module.formEntries.stepper),
  switch: () => import('./form-docs-entries').then(module => module.formEntries.switch),
  'switch-group': () => import('./form-docs-entries').then(module => module.formEntries['switch-group']),
  'text-field': () => import('./form-docs-entries').then(module => module.formEntries['text-field']),
  textarea: () => import('./form-docs-entries').then(module => module.formEntries.textarea),
} as const satisfies Record<string, () => Promise<ElementDocsEntry>>

export type FormDocsSlug = keyof typeof formDocsLoaders

export async function loadFormDocsEntry(slug: string): Promise<ElementDocsEntry | null> {
  const loader = formDocsLoaders[slug as FormDocsSlug]
  return loader ? loader() : null
}
