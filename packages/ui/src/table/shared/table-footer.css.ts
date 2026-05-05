import { style } from '@vanilla-extract/css'

export const tableFooterRootClass = style({
  flexShrink: 0,
  borderTop: '1px solid var(--color-neutral-border)',
  fontSize: 'var(--font-size-xs)',
  lineHeight: 'var(--line-height-xs)',
  color: 'color-mix(in oklch, var(--color-neutral-text) 68%, transparent)',
})

export const tableFooterTableClass = style({
  width: '100%',
  borderCollapse: 'separate',
  borderSpacing: 0,
  tableLayout: 'fixed',
})

export const tableFooterCellClass = style({
  color: 'inherit',
  textAlign: 'left',
  verticalAlign: 'middle',
})
