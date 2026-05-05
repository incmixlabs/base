import type { DialogWrapperSchemaProperty } from '@incmix/ui/elements'

export const dialogWrapperAdapterWidgets = {
  text: 'text',
  textarea: 'textarea',
  email: 'email',
  password: 'password',
  url: 'url',
  numberInput: 'number-input',
} as const

export type DialogWrapperAdapterWidget = (typeof dialogWrapperAdapterWidgets)[keyof typeof dialogWrapperAdapterWidgets]

export const dialogWrapperAdapterFormats = {
  textarea: 'textarea',
  email: 'email',
  password: 'password',
  url: 'url',
} satisfies Record<string, DialogWrapperSchemaProperty['format']>
