import { style } from '@vanilla-extract/css'

export const filterHeaderClass = style({
  paddingBlockEnd: '0.75rem',
  borderBottom: '1px solid var(--color-neutral-border)',
})

export const filterBodyClass = style({
  minHeight: 0,
  overflowX: 'hidden',
  overflowY: 'auto',
  paddingBlock: '0.25rem',
})

export const filterAppliedClass = style({
  borderBottom: '1px solid var(--color-neutral-border)',
  paddingBlock: '0.75rem',
})

export const filterFooterClass = style({
  background: 'var(--color-neutral-surface)',
  borderTop: '1px solid var(--color-neutral-border)',
  marginBlockStart: 'auto',
  paddingBlockStart: '0.75rem',
})

export const filterSliderValueRowClass = style({
  fontSize: 'var(--font-size-xs)',
  lineHeight: 'var(--line-height-xs)',
  color: 'var(--color-neutral-text)',
  opacity: 0.72,
})
