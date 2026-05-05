import { createVar, fallbackVar, style } from '@vanilla-extract/css'

export const editableCellMinHeightVar = createVar()

export const editableCellWrapper = style({
  transition: 'box-shadow 120ms ease',
  selectors: {
    '&:hover': {
      boxShadow: 'inset 0 0 0 1px color-mix(in oklch, var(--color-info-primary) 28%, transparent)',
    },
    '&:focus-within': {
      boxShadow: 'inset 0 0 0 2px var(--color-info-primary)',
    },
  },
})

export const editableCellReadView = style({
  display: 'block',
  width: '100%',
  minHeight: fallbackVar(editableCellMinHeightVar, '1.5rem'),
  minWidth: 0,
  border: 0,
  color: 'inherit',
  font: 'inherit',
  lineHeight: 'inherit',
  padding: 0,
  textAlign: 'inherit',
  cursor: 'text',
  borderRadius: 'var(--radius-2)',
  background: 'transparent',
  boxShadow: 'inset 0 0 0 1px transparent',
  transition: 'background-color 120ms ease, box-shadow 120ms ease',
  selectors: {
    '&:focus-visible': {
      outline: 'none',
    },
  },
})

export const editableCellControl = style({
  width: '100%',
  minHeight: fallbackVar(editableCellMinHeightVar, '1.5rem'),
  minWidth: 0,
  border: 0,
  borderRadius: 0,
  background: 'transparent',
  color: 'inherit',
  font: 'inherit',
  lineHeight: 'inherit',
  padding: 0,
  textAlign: 'inherit',
  outline: 'none',
  selectors: {
    '&[aria-invalid="true"]': {
      boxShadow: 'inset 0 0 0 2px var(--color-error-primary)',
    },
  },
})

export const editableCellCheckbox = style({
  width: '1rem',
  height: '1rem',
  margin: 0,
  accentColor: 'var(--color-accent-solid)',
})

export const editableCellEditContainer = style({
  display: 'inline-flex',
  width: '100%',
  minWidth: 0,
  alignItems: 'center',
  overflow: 'hidden',
})

export const editableCellError = style({
  marginTop: 'var(--space-1)',
  color: 'var(--color-error-text)',
  fontSize: 'var(--font-size-xs)',
  lineHeight: 'var(--line-height-xs)',
})
