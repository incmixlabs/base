import type { Color } from '@/theme/tokens'
import { createControlSurfaceClassMaps } from '../surface/control-surface.class'
import type { BadgeVariant } from './badge.props'

export const badgeBaseCls =
  'inline-flex items-center justify-center font-medium whitespace-nowrap shrink-0 leading-none h-fit'

export const badgeBase = 'border-solid'
export const badgeIconBase = 'inline-flex items-center justify-center shrink-0 leading-none'
export const badgeDeleteButtonBase =
  'inline-flex items-center justify-center shrink-0 p-0 border-0 bg-transparent text-inherit leading-none cursor-pointer'
export const badgeAvatarBase = 'shrink-0'

export const badgeSizeVariants = {
  xs: 'text-xs leading-4 px-2 py-1 gap-1',
  sm: 'text-sm leading-5 px-2.5 py-1 gap-1.5',
  md: 'text-base leading-6 px-3 py-1 gap-2',
} as const

export const badgeDeleteButtonSizeVariants = {
  xs: 'h-3 w-3 ms-0.5 [&_svg]:h-full [&_svg]:w-full',
  sm: 'h-3.5 w-3.5 ms-0.5 [&_svg]:h-full [&_svg]:w-full',
  md: 'h-4 w-4 ms-0.5 [&_svg]:h-full [&_svg]:w-full',
} as const

export const badgeIconSizeVariants = {
  xs: 'h-3 w-3 text-xs [&_svg]:h-3 [&_svg]:w-3',
  sm: 'h-3.5 w-3.5 text-sm [&_svg]:h-3.5 [&_svg]:w-3.5',
  md: 'h-4 w-4 text-base [&_svg]:h-4 [&_svg]:w-4',
} as const

export const badgeAvatarSizeVariants = {
  xs: '-ms-1 h-5 w-5 text-[0.5625rem] leading-5',
  sm: '-ms-1 h-6 w-6 text-[0.65625rem] leading-6',
  md: '-ms-1 h-7 w-7 text-xs leading-7',
} as const

const badgeVariants = ['solid', 'soft', 'surface', 'outline'] as const satisfies readonly BadgeVariant[]

const badgeSurfaceClassMaps = createControlSurfaceClassMaps(badgeVariants)

export const badgeColorVariants = badgeSurfaceClassMaps.color as Record<Color, Record<BadgeVariant, string>>

export const badgeHoverColorVariants = badgeSurfaceClassMaps.hover as Record<Color, Record<BadgeVariant, string>>

export const badgeHighContrastHoverColorVariants = badgeSurfaceClassMaps.highContrastHover as Record<
  Color,
  Record<BadgeVariant, string>
>

export const badgeHighContrastColorVariants = badgeSurfaceClassMaps.highContrast as Record<
  Color,
  Record<BadgeVariant, string>
>

export const badgeVariantBorderWidth = {
  solid: 'border-0',
  soft: 'border-0',
  outline: 'border-1',
  surface: 'border-1',
} as const
