import { style } from '@vanilla-extract/css'

export const tableHeaderSurfaceClass = style({
  backgroundColor: 'var(--color-neutral-soft)',
})

export const tableHeaderCellClass = style({
  color: 'var(--color-neutral-text)',
  fontWeight: 600,
  textAlign: 'left',
  borderBottom: '1px solid var(--color-neutral-border)',
})

export const tableSortButtonClass = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.25rem',
  cursor: 'pointer',
  userSelect: 'none',
  background: 'none',
  border: 'none',
  padding: 0,
  font: 'inherit',
  color: 'inherit',
  selectors: {
    '&:focus-visible': {
      outline: '2px solid var(--color-primary-primary)',
      outlineOffset: '2px',
      borderRadius: '2px',
    },
  },
})

export const tableSortIconClass = style({
  width: '0.875rem',
  height: '0.875rem',
  flexShrink: 0,
  opacity: 0.5,
  transition: 'opacity 120ms ease',
})

export const tableSortIconActiveClass = style({
  color: 'var(--color-primary-primary)',
  opacity: 1,
})
