import { style } from '@vanilla-extract/css'

const panelBorder = 'color-mix(in oklch, var(--border) 60%, transparent)'

export const liveCodeBlockRoot = style({
  display: 'flex',
  flexDirection: 'column',
  minHeight: 0,
  marginTop: '1.5rem',
  overflow: 'hidden',
  border: `1px solid ${panelBorder}`,
  borderRadius: '1rem',
  backgroundColor: 'var(--background)',
})

export const liveCodeBlockFallbackRoot = style({
  marginTop: '1.5rem',
  overflow: 'hidden',
  border: `1px solid ${panelBorder}`,
  borderRadius: '1rem',
  backgroundColor: 'var(--background)',
})

export const liveCodeBlockToolbar = style({
  flexShrink: 0,
  borderBottom: `1px solid ${panelBorder}`,
  padding: '0.75rem 1rem',
})

export const liveCodeBlockExtraTabPanel = style({
  minHeight: 0,
  flex: 1,
  overflow: 'hidden',
})
