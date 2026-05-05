import { style } from '@vanilla-extract/css'
import { semanticColorVar } from '@/theme/props/color.prop'

export const compactHorizontalChartRootClass = style({
  border: `1px solid ${semanticColorVar('neutral', 'border')}`,
  backgroundColor: semanticColorVar('neutral', 'surface'),
  boxShadow: 'var(--shadow-sm)',
})

export const compactHorizontalChartTextClass = style({
  color: semanticColorVar('neutral', 'text'),
})

export const compactHorizontalChartMutedTextClass = style({
  color: `color-mix(in oklch, ${semanticColorVar('neutral', 'text')} 68%, transparent)`,
})

export const compactHorizontalChartTrackClass = style({
  backgroundColor: semanticColorVar('neutral', 'border'),
})

export const compactHorizontalChartEmptyClass = style({
  border: `1px dashed ${semanticColorVar('neutral', 'border')}`,
  backgroundColor: semanticColorVar('neutral', 'soft'),
  color: `color-mix(in oklch, ${semanticColorVar('neutral', 'text')} 68%, transparent)`,
})
