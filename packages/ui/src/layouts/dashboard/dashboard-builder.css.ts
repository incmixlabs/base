import { style } from '@vanilla-extract/css'

export const builderRoot = style({
  display: 'grid',
  gap: '1rem',
  minWidth: 0,
  color: 'var(--foreground)',
})

export const builderStatus = style({
  display: 'inline-flex',
  minHeight: '1.5rem',
  alignItems: 'center',
  border: '1px solid var(--border)',
  borderRadius: '0.375rem',
  paddingInline: '0.5rem',
  backgroundColor: 'var(--color-neutral-soft)',
  color: 'color-mix(in oklch, var(--color-neutral-text) 68%, transparent)',
  fontFamily: 'var(--font-mono)',
  fontSize: '0.6875rem',
  fontWeight: 500,
})

export const builderBody = style({
  display: 'grid',
  gap: '1rem',
  alignItems: 'start',
  minWidth: 0,
  '@media': {
    '(min-width: 1280px)': {
      gridTemplateColumns: 'minmax(0, 1fr) minmax(20rem, 24rem)',
    },
  },
})

export const builderCanvas = style({
  minWidth: 0,
})

export const builderLayout = style({
  maxWidth: '72rem',
})

export const builderPanel = style({
  display: 'grid',
  gap: '0.625rem',
  minWidth: 0,
  padding: '0.625rem',
  border: '1px solid var(--border)',
  borderRadius: '0.5rem',
  backgroundColor: 'var(--card)',
  boxShadow: 'var(--shadow-sm)',
})

export const builderPresetGrid = style({
  display: 'grid',
  gap: '0.625rem',
})

export const builderJsonTextarea = style({
  width: '100%',
  minHeight: '28rem',
  resize: 'vertical',
  border: '1px solid var(--border)',
  borderRadius: '0.375rem',
  padding: '0.75rem',
  backgroundColor: 'var(--color-neutral-soft)',
  color: 'var(--foreground)',
  fontFamily: 'var(--font-mono)',
  fontSize: '0.75rem',
  lineHeight: 1.5,
  outline: 'none',
  selectors: {
    '&:focus-visible': {
      boxShadow: '0 0 0 2px var(--ring)',
    },
  },
})

export const builderError = style({
  border: '1px solid var(--color-error-primary)',
  borderRadius: '0.375rem',
  padding: '0.5rem',
  color: 'var(--color-error-primary)',
  fontSize: '0.8125rem',
  lineHeight: 1.4,
})
