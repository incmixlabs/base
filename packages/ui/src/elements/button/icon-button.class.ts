import { surfaceColorVariants } from '@/elements/surface/surface.class'

export const iconButtonSizeIconScope = 'af-icon-button-icon-scope'

export const iconButtonBase = 'af-icon-button-base'

export const iconButtonColorVariants = surfaceColorVariants

export const iconButtonHighContrastByVariant = {
  solid: 'surface-high-contrast-solid af-icon-button-hc-solid',
  soft: 'surface-high-contrast-soft',
  outline: 'surface-high-contrast-outline af-icon-button-hc-outline',
  ghost: 'surface-high-contrast-ghost af-icon-button-hc-ghost',
} as const

export const iconButtonSizeVariants = {
  xs: 'af-icon-button-size-xs',
  sm: 'af-icon-button-size-sm',
  md: 'af-icon-button-size-md',
  lg: 'af-icon-button-size-lg',
  xl: 'af-icon-button-size-xl',
} as const

export const iconSizeVariants = {
  xs: 'af-icon-size-xs',
  sm: 'af-icon-size-sm',
  md: 'af-icon-size-md',
  lg: 'af-icon-size-lg',
  xl: 'af-icon-size-xl',
} as const
