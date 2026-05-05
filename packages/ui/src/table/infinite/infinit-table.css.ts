import { globalStyle, style } from '@vanilla-extract/css'
import { tableHeaderCellClass, tableHeaderSurfaceClass } from '@/table/shared/table-header.shared.css'

export const filterPanelClass = style({
  width: '16rem',
  flexShrink: 0,
  borderRight: '1px solid var(--color-neutral-border)',
  overflow: 'auto',
})

export const theadClass = style([tableHeaderSurfaceClass])

export const theadCellClass = style([tableHeaderCellClass])

export const rowClass = style({
  display: 'flex',
  position: 'absolute',
  width: '100%',
  borderBottom: '1px solid var(--color-neutral-border)',
  transition: 'background-color 120ms ease',
  selectors: {
    '&:hover': {
      backgroundColor: 'var(--color-neutral-soft)',
    },
    '&[data-state="selected"]': {
      backgroundColor: 'var(--color-accent-soft)',
    },
    '&[data-state="active"]': {
      backgroundColor: 'var(--color-accent-soft)',
      fontWeight: 500,
    },
  },
})

export const cellClass = style({
  color: 'var(--color-neutral-text)',
})

export const resizeHandleClass = style({
  selectors: {
    '&:hover': {
      backgroundColor: 'var(--color-neutral-border)',
    },
    '&:focus-visible': {
      backgroundColor: 'var(--color-primary-primary)',
      outline: 'none',
    },
  },
})

export const resizeHandleActiveClass = style({
  backgroundColor: 'var(--color-primary-primary)',
  opacity: 1,
})

export const emptyStateClass = style({
  color: 'color-mix(in oklch, var(--color-neutral-text) 68%, transparent)',
  fontSize: 'var(--font-size-sm)',
  lineHeight: 'var(--line-height-sm)',
})

export const loadingRowClass = style({
  color: 'color-mix(in oklch, var(--color-neutral-text) 68%, transparent)',
  fontSize: 'var(--font-size-sm)',
  lineHeight: 'var(--line-height-sm)',
})

export const tfootRowClass = style({
  display: 'flex',
  borderTop: '1px solid var(--color-neutral-border)',
  backgroundColor: 'var(--color-neutral-surface)',
})

export const tfootCellClass = style({
  color: 'color-mix(in oklch, var(--color-neutral-text) 68%, transparent)',
})

globalStyle(`${filterPanelClass} > *:last-child`, {
  borderBottom: 'none',
})
