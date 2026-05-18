import { style } from '@vanilla-extract/css'

export const dashboardItemFallback = style({
  display: 'flex',
  minHeight: '5rem',
  height: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '1rem',
  color: 'color-mix(in oklch, var(--color-neutral-text) 68%, transparent)',
  fontSize: '0.875rem',
  fontWeight: 500,
  textAlign: 'center',
})

export const presetPicker = style({
  display: 'grid',
  gap: '0.75rem',
  '@media': {
    '(min-width: 640px)': {
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    },
    '(min-width: 1024px)': {
      gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
    },
  },
})

export const presetButton = style({
  display: 'grid',
  minWidth: 0,
  gap: '0.5rem',
  padding: '0.5rem',
  border: '1px solid var(--border)',
  borderRadius: '0.375rem',
  backgroundColor: 'var(--card)',
  color: 'var(--foreground)',
  textAlign: 'left',
  outline: 'none',
  transition: 'background-color 150ms ease, border-color 150ms ease, box-shadow 150ms ease',
  selectors: {
    '&:hover': {
      borderColor: 'var(--ring)',
    },
    '&:focus-visible': {
      boxShadow: '0 0 0 2px var(--ring)',
    },
  },
})

export const presetButtonSelected = style({
  borderColor: 'var(--ring)',
  backgroundColor: 'color-mix(in oklch, var(--color-accent-soft) 40%, transparent)',
})

export const presetName = style({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  fontSize: '0.875rem',
  fontWeight: 500,
})

export const presetPreview = style({
  display: 'grid',
  overflow: 'hidden',
  padding: '0.25rem',
  borderRadius: '0.25rem',
  backgroundColor: 'color-mix(in oklch, var(--color-neutral-soft) 50%, transparent)',
})

export const presetPreviewCell = style({
  borderRadius: '0.125rem',
  backgroundColor: 'color-mix(in oklch, var(--color-neutral-text) 13.6%, transparent)',
  boxShadow: '0 0 0 1px var(--background)',
})

export const modeControl = style({
  display: 'inline-grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: '0.25rem',
  padding: '0.25rem',
  border: '1px solid var(--border)',
  borderRadius: '0.375rem',
  backgroundColor: 'var(--color-neutral-soft)',
})

export const modeButton = style({
  padding: '0.375rem 0.75rem',
  border: 0,
  borderRadius: '0.25rem',
  backgroundColor: 'transparent',
  color: 'color-mix(in oklch, var(--color-neutral-text) 68%, transparent)',
  fontSize: '0.875rem',
  fontWeight: 500,
  textTransform: 'capitalize',
  outline: 'none',
  transition: 'background-color 150ms ease, color 150ms ease, box-shadow 150ms ease',
  selectors: {
    '&:hover': {
      color: 'var(--foreground)',
    },
    '&:focus-visible': {
      boxShadow: '0 0 0 2px var(--ring)',
    },
  },
})

export const modeButtonSelected = style({
  backgroundColor: 'var(--background)',
  color: 'var(--foreground)',
  boxShadow: 'var(--shadow-sm)',
})
