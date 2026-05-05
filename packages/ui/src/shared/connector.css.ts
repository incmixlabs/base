import { style } from '@vanilla-extract/css'
import { semanticColorVar } from '@/theme/props/color.prop'

/**
 * Shared connector primitives used by Stepper and Timeline components.
 *
 * - connectorIndicatorBase: circle layout for step/timeline indicators
 * - connectorSeparatorColor: default line color (neutral border)
 * - connectorSeparatorCompleted: completed line color (primary)
 */

export const connectorIndicatorBase = style({
  alignItems: 'center',
  borderRadius: '999px',
  boxSizing: 'border-box',
  display: 'inline-flex',
  flexShrink: 0,
  justifyContent: 'center',
})

export const connectorSeparatorColor = style({
  backgroundColor: semanticColorVar('neutral', 'border'),
})

export const connectorSeparatorCompleted = style({
  backgroundColor: semanticColorVar('primary', 'primary'),
})
