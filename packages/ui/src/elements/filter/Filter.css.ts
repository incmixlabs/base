import { style } from '@vanilla-extract/css'

export const filterHeaderClass = style({
  paddingInline: '0.75rem',
  paddingBlock: '0.5rem',
  borderBottom: '1px solid var(--color-neutral-border)',
  fontSize: 'var(--font-size-xs)',
  lineHeight: 'var(--line-height-xs)',
  fontWeight: 600,
  color: 'var(--color-neutral-text)',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
})

export const filterSliderValueRowClass = style({
  fontSize: 'var(--font-size-xs)',
  lineHeight: 'var(--line-height-xs)',
  color: 'var(--color-neutral-text)',
  opacity: 0.72,
})
