import {
  surfaceColorVariants,
  surfaceHighContrastByVariant,
  surfaceHoverEnabledClass,
} from '@/elements/surface/surface.class'
import type { Color } from '@/theme/tokens'
import type { BadgeVariant } from './badge.props'

export const badgeBaseCls =
  'inline-flex items-center justify-center font-medium whitespace-nowrap shrink-0 leading-none h-fit'

export const badgeBase = 'af-badge-base'
export const badgeIconBase = 'af-badge-icon-base'
export const badgeDeleteButtonBase = 'af-badge-delete-button-base'
export const badgeAvatarBase = 'af-badge-avatar-base'

export const badgeSizeVariants = {
  xs: 'af-badge-size-xs',
  sm: 'af-badge-size-sm',
  md: 'af-badge-size-md',
} as const

export const badgeDeleteButtonSizeVariants = {
  xs: 'af-badge-delete-button-size-xs',
  sm: 'af-badge-delete-button-size-sm',
  md: 'af-badge-delete-button-size-md',
} as const

export const badgeIconSizeVariants = {
  xs: 'af-badge-icon-size-xs',
  sm: 'af-badge-icon-size-sm',
  md: 'af-badge-icon-size-md',
} as const

export const badgeAvatarSizeVariants = {
  xs: 'af-badge-avatar-size-xs',
  sm: 'af-badge-avatar-size-sm',
  md: 'af-badge-avatar-size-md',
} as const

export const badgeColorVariants = surfaceColorVariants as Record<Color, Record<BadgeVariant, string>>

export const badgeHoverEnabledClass = surfaceHoverEnabledClass

export const badgeHighContrastByVariant = surfaceHighContrastByVariant as Record<BadgeVariant, string>

export const badgeVariantBorderWidth = {
  solid: 'border-0',
  soft: 'border-0',
  outline: 'border-1',
  surface: 'border-1',
} as const
