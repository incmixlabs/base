import { style } from '@vanilla-extract/css'

export const tableShellRootClass = style({
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  border: '1px solid var(--color-neutral-border)',
  borderRadius: '0.5rem',
  background: 'var(--color-neutral-surface)',
})

export const tableShellBodyClass = style({
  minWidth: 0,
})

export const tableShellFooterClass = style({
  flexShrink: 0,
  borderTop: '1px solid var(--color-neutral-border)',
})
