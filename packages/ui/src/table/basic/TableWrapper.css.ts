import { globalStyle, style } from '@vanilla-extract/css'

export const tableWrapperEditableGrid = style({})

globalStyle(`${tableWrapperEditableGrid}`, {
  border: '1px solid var(--color-neutral-border)',
})

globalStyle(`${tableWrapperEditableGrid} th`, {
  borderBlockEnd: '1px solid var(--color-neutral-border)',
  boxShadow: 'inset -1px 0 0 var(--color-neutral-border)',
})

globalStyle(`${tableWrapperEditableGrid} td`, {
  boxShadow: 'inset -1px 0 0 var(--color-neutral-border)',
})

globalStyle(`${tableWrapperEditableGrid} tbody tr:last-child > th`, {
  borderBlockEnd: 0,
})

globalStyle(`${tableWrapperEditableGrid} tbody tr:last-child > td`, {
  borderBlockEnd: 0,
})
