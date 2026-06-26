import type { Color } from '@/theme/tokens'
import { buttonSizeVariants } from '../button/button.class'
import { iconSizeVariants } from '../button/icon-button.class'
import { createControlSurfaceClassMaps } from '../surface/control-surface.class'
import type { BadgeVariant } from './badge.props'

export const badgeBaseCls =
  'inline-flex items-center justify-center box-border font-medium whitespace-nowrap shrink-0 leading-none'

export const badgeBase = 'border-solid'
export const badgeIconBase = 'inline-flex items-center justify-center shrink-0 leading-none'
export const badgeDeleteButtonBase =
  'inline-flex items-center justify-center shrink-0 p-0 border-0 bg-transparent text-inherit leading-none cursor-pointer'
export const badgeAvatarBase = 'shrink-0'

const badgeSizeNames = ['xs', 'sm', 'md'] as const

export const badgeSizeVariants = Object.fromEntries(
  badgeSizeNames.map(size => [size, buttonSizeVariants[size]]),
) as Pick<typeof buttonSizeVariants, (typeof badgeSizeNames)[number]>

export const badgeDeleteButtonSizeVariants = {
  xs: 'h-1 w-1 ms-0.5 [&_svg]:h-full [&_svg]:w-full',
  sm: 'h-2 w-2 ms-0.5 [&_svg]:h-full [&_svg]:w-full',
  md: 'h-3 w-3 ms-0.5 [&_svg]:h-full [&_svg]:w-full',
} as const

export const badgeIconSizeVariants = Object.fromEntries(
  badgeSizeNames.map(size => [size, iconSizeVariants[size]]),
) as Pick<typeof iconSizeVariants, (typeof badgeSizeNames)[number]>

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
