import { semanticColorVar } from '@incmix/ui/theme'
import { style } from '@vanilla-extract/css'

const diffMutedTextColor = `color-mix(in oklch, ${semanticColorVar('neutral', 'text')} 68%, transparent)`

export const jsonDiffViewRoot = style({
  border: `1px solid ${semanticColorVar('neutral', 'border')}`,
  borderRadius: 'var(--radius-md)',
  background: semanticColorVar('neutral', 'surface'),
  padding: '0.25rem',
  minWidth: 0,
})

export const jsonDiffViewEmpty = style({
  color: diffMutedTextColor,
  fontSize: '0.75rem',
  padding: '0.5rem',
})

export const jsonDiffViewRow = style({
  display: 'grid',
  gridTemplateColumns: 'minmax(120px, 220px) minmax(0, 1fr)',
  alignItems: 'center',
  gap: '0.5rem',
  minWidth: 0,
})

export const jsonDiffViewKey = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.5rem',
  minWidth: 0,
  overflow: 'hidden',
})

export const jsonDiffViewKeyText = style({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  fontFamily: 'var(--font-mono, monospace)',
  fontSize: '0.75rem',
})

export const jsonDiffViewValue = style({
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '0.375rem',
  minWidth: 0,
})

export const jsonDiffViewSummary = style({
  color: diffMutedTextColor,
  fontSize: '0.75rem',
  minWidth: 0,
  overflowWrap: 'anywhere',
  whiteSpace: 'normal',
})

export const jsonDiffViewRowAdded = style({
  background: `color-mix(in oklch, ${semanticColorVar('info', 'primary')} 10%, transparent)`,
})

export const jsonDiffViewRowRemoved = style({
  background: `color-mix(in oklch, ${semanticColorVar('error', 'primary')} 10%, transparent)`,
})

export const jsonDiffViewRowModified = style({
  background: `color-mix(in oklch, ${semanticColorVar('warning', 'primary')} 12%, transparent)`,
})
