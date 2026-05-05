import { style } from '@vanilla-extract/css'

export const headerRoot = style({
  zIndex: 30,
  width: '100%',
  minWidth: 0,
  flexShrink: 0,
  borderBottom: '1px solid color-mix(in oklch, var(--border) 70%, transparent)',
  backgroundColor: 'var(--background)',
})

export const headerSticky = style({
  position: 'sticky',
  top: 0,
})
