import { createVar, globalStyle, style, styleVariants } from '@vanilla-extract/css'
import { tableHeaderCellClass, tableHeaderSurfaceClass } from '@/table/shared/table-header.shared.css'
import { tableSizeTokens } from '@/table/table.tokens'
import type { TableSize } from './table.props'

const cellPaddingXVar = createVar()
const cellPaddingYVar = createVar()
const fontSizeVar = createVar()
const lineHeightVar = createVar()

export const tableRootBase = style({
  fontSize: fontSizeVar,
  lineHeight: lineHeightVar,
})

const tableSizeStyles = Object.fromEntries(
  (Object.keys(tableSizeTokens) as TableSize[]).map(size => {
    const t = tableSizeTokens[size]
    return [
      size,
      {
        vars: {
          [cellPaddingXVar]: t.paddingX,
          [cellPaddingYVar]: t.paddingY,
          [fontSizeVar]: t.fontSize,
          [lineHeightVar]: t.lineHeight,
        },
      },
    ]
  }),
) as Record<TableSize, { vars: Record<string, string> }>

export const tableSizeVariants = styleVariants(tableSizeStyles)

export const tableCompactRoot = style({
  vars: {
    [cellPaddingXVar]: '0px',
    [cellPaddingYVar]: '0px',
  },
})

export const tableVariantRoot = styleVariants({
  surface: {
    border: '1px solid var(--color-neutral-border)',
    borderRadius: 'var(--radius-4)',
    background: 'var(--color-neutral-surface)',
    boxShadow: 'var(--shadow-xs)',
  },
  ghost: {},
})

export const tableStripedRoot = style({})

globalStyle(`${tableStripedRoot} tbody tr:nth-child(even):not([data-state="selected"]) > th`, {
  backgroundColor: 'color-mix(in oklch, var(--color-neutral-text) 4%, var(--color-neutral-surface))',
})

globalStyle(`${tableStripedRoot} tbody tr:nth-child(even):not([data-state="selected"]) > td`, {
  backgroundColor: 'color-mix(in oklch, var(--color-neutral-text) 4%, var(--color-neutral-surface))',
})

export const tableHeaderVariant = styleVariants({
  surface: [tableHeaderSurfaceClass],
  ghost: {},
})

export const tableFooterBase = style({
  borderTop: '1px solid var(--color-neutral-border)',
  backgroundColor: 'var(--color-neutral-soft)',
  fontWeight: 600,
})

export const tableRowBase = style({
  borderBottom: '1px solid var(--color-neutral-border)',
  transition: 'background-color 120ms ease',
  selectors: {
    '&:last-child': {
      borderBottom: 0,
    },
  },
})

export const tableRowVariant = styleVariants({
  surface: {
    selectors: {
      '&[data-state="selected"]': { backgroundColor: 'var(--color-accent-soft)' },
      '&:hover:not([data-state="selected"])': { backgroundColor: 'var(--color-neutral-soft)' },
    },
  },
  ghost: {
    selectors: {
      '&[data-state="selected"]': { backgroundColor: 'var(--color-accent-soft)' },
      '&:hover': { backgroundColor: 'var(--color-neutral-soft)' },
    },
  },
})

export const tableHeadBase = style({
  color: 'color-mix(in oklch, var(--color-neutral-text) 68%, transparent)',
  fontWeight: 500,
  textAlign: 'left',
  paddingLeft: cellPaddingXVar,
  paddingRight: cellPaddingXVar,
  paddingTop: cellPaddingYVar,
  paddingBottom: cellPaddingYVar,
})

export const tableCellBase = style({
  color: 'var(--color-neutral-text)',
  paddingLeft: cellPaddingXVar,
  paddingRight: cellPaddingXVar,
  paddingTop: cellPaddingYVar,
  paddingBottom: cellPaddingYVar,
  verticalAlign: 'inherit',
})

export const tableCaptionBase = style({
  marginTop: 'var(--space-3)',
  color: 'color-mix(in oklch, var(--color-neutral-text) 68%, transparent)',
  fontSize: 'var(--font-size-sm)',
})

export const tableRowHeaderCellBase = style([
  tableCellBase,
  {
    textAlign: 'left',
    fontWeight: 500,
  },
])

export const tableColumnHeaderCellBase = style([tableHeadBase, tableHeaderCellClass])
