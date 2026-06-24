import { semanticColorKeys } from '@/theme/props/color.prop'
import type { Color } from '@/theme/tokens'

type CalloutVariant = 'soft' | 'surface' | 'solid' | 'outline' | 'split'

export const calloutRootBaseCls =
  'box-border grid border [grid-template-columns:auto_1fr] items-start justify-start text-left'

export const calloutRootBase = 'af-callout-root-base'

export const calloutIconBaseCls = 'flex items-center justify-center shrink-0'
export const calloutIconVars = 'af-callout-icon-vars'

export const calloutTextBase = 'af-callout-text-base'

export const calloutSizeVars = {
  xs: 'af-callout-size-xs',
  sm: 'af-callout-size-sm',
  md: 'af-callout-size-md',
  lg: 'af-callout-size-lg',
  xl: 'af-callout-size-xl',
  '2x': 'af-callout-size-2x',
} as const

export const calloutTextBySize = {
  xs: 'af-callout-text-size-xs',
  sm: 'af-callout-text-size-sm',
  md: 'af-callout-text-size-md',
  lg: 'af-callout-text-size-lg',
  xl: 'af-callout-text-size-xl',
  '2x': 'af-callout-text-size-2x',
} as const

export const calloutColorVariants = Object.fromEntries(
  semanticColorKeys.map(color => [
    color,
    {
      soft: `surface-color-${color} surface-variant-soft af-callout-soft`,
      surface: `surface-color-${color} surface-variant-surface af-callout-surface`,
      solid: `surface-color-${color} surface-variant-solid af-callout-solid`,
      outline: `surface-color-${color} surface-variant-outline af-callout-outline`,
      split: `surface-color-${color} af-callout-split`,
    },
  ]),
) as Record<Color, Record<CalloutVariant, string>>

export const calloutInverseByVariant = Object.fromEntries(
  semanticColorKeys.map(color => [
    color,
    {
      soft: 'af-callout-inverse-soft',
      surface: 'af-callout-inverse-unused',
      solid: 'af-callout-inverse-unused',
      outline: 'af-callout-inverse-unused',
      split: 'af-callout-inverse-unused',
    },
  ]),
) as Record<Color, Record<CalloutVariant, string>>

export const calloutHoverByVariant = {
  soft: 'surface-hover-enabled',
  surface: 'surface-hover-enabled',
  solid: 'surface-hover-enabled',
  outline: 'surface-hover-enabled',
  split: 'surface-hover-enabled',
} as const

export const calloutHighContrastByVariant = {
  soft: 'surface-high-contrast-soft',
  surface: 'surface-high-contrast-surface',
  solid: 'surface-high-contrast-solid',
  outline: 'surface-high-contrast-outline',
  split: 'af-callout-hc-split',
} as const
