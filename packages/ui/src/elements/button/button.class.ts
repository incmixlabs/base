import { surfaceColorVariants, surfaceHighContrastByVariant } from '@/elements/surface/surface.class'
import { semanticColorKeys } from '@/theme/props/color.prop'
import type { Color, Variant } from '@/theme/tokens'

export const buttonBaseCls =
  'relative inline-flex items-center justify-center select-none border outline-none box-border'

export const buttonLoadingContentCls = 'af-button-loading-content inline-flex items-center justify-center gap-[inherit]'

export const buttonLoadingOverlayCls = 'af-button-loading-overlay absolute inset-0 flex items-center justify-center'

export const buttonSizeIconScope = 'af-button-icon-scope'

export const buttonSizeVariants = {
  xs: 'af-button-size-xs',
  sm: 'af-button-size-sm',
  md: 'af-button-size-md',
  lg: 'af-button-size-lg',
  xl: 'af-button-size-xl',
} as const

export const buttonMotion = 'af-button-motion'

export const buttonLoading = 'af-button-loading'

export const buttonColorVariants = surfaceColorVariants as Record<Color, Record<Variant, string>>

export const buttonInverseVariants = Object.fromEntries(
  semanticColorKeys.map(color => [
    color,
    {
      classic: 'af-button-inverse-unused',
      solid: 'af-button-inverse-solid',
      soft: 'af-button-inverse-soft',
      surface: 'af-button-inverse-unused',
      outline: 'af-button-inverse-unused',
      ghost: 'af-button-inverse-unused',
    },
  ]),
) as Record<Color, Record<Variant, string>>

export const highContrastByVariant = surfaceHighContrastByVariant
