import type { Color } from '@/theme/tokens'
import { type ControlSurfaceVariant, createControlSurfaceClassMaps } from '../surface/control-surface.class'
import { iconButtonPropDefs } from './icon-button.props'

type IconButtonVariant = (typeof iconButtonPropDefs.variant.values)[number]
type IconButtonSize = (typeof iconButtonPropDefs.size.values)[number]
const iconButtonVariants = iconButtonPropDefs.variant.values satisfies readonly ControlSurfaceVariant[]
const iconButtonSizes = iconButtonPropDefs.size.values

export const iconButtonBase = 'border-0 border-solid'

const iconButtonSurfaceClassMaps = createControlSurfaceClassMaps(iconButtonVariants)

export const iconButtonColorVariants = iconButtonSurfaceClassMaps.color as Record<
  Color,
  Record<IconButtonVariant, string>
>

export const iconButtonHoverColorVariants = iconButtonSurfaceClassMaps.hover as Record<
  Color,
  Record<IconButtonVariant, string>
>

export const iconButtonHighContrastHoverColorVariants = iconButtonSurfaceClassMaps.highContrastHover as Record<
  Color,
  Record<IconButtonVariant, string>
>

export const iconButtonHighContrastColorVariants = iconButtonSurfaceClassMaps.highContrast as Record<
  Color,
  Record<IconButtonVariant, string>
>

const iconControlSizeVariants = {
  xs: {
    button: 'h-[1.5rem] w-[1.5rem] text-xs',
    icon: 'h-[0.75rem] w-[0.75rem] text-xs',
    svg: 'h-[0.75rem] w-[0.75rem]',
  },
  sm: {
    button: 'h-[1.75rem] w-[1.75rem] text-sm',
    icon: 'h-[0.875rem] w-[0.875rem] text-sm',
    svg: 'h-[0.875rem] w-[0.875rem]',
  },
  md: {
    button: 'h-[2rem] w-[2rem] text-base',
    icon: 'h-[1rem] w-[1rem] text-base',
    svg: 'h-[1rem] w-[1rem]',
  },
  lg: {
    button: 'h-[2.5rem] w-[2.5rem] text-lg',
    icon: 'h-[1.25rem] w-[1.25rem] text-lg',
    svg: 'h-[1.25rem] w-[1.25rem]',
  },
  xl: {
    button: 'h-[2.75rem] w-[2.75rem] text-xl',
    icon: 'h-[1.5rem] w-[1.5rem] text-xl',
    svg: 'h-[1.5rem] w-[1.5rem]',
  },
} as const satisfies Record<IconButtonSize, { button: string; icon: string; svg: string }>

export const iconButtonSizeVariants = Object.fromEntries(
  iconButtonSizes.map(size => [size, iconControlSizeVariants[size].button]),
) as Record<IconButtonSize, string>

export const iconSizeVariants = Object.fromEntries(
  iconButtonSizes.map(size => [size, iconControlSizeVariants[size].icon]),
) as Record<IconButtonSize, string>

export const iconSvgSizeVariants = Object.fromEntries(
  iconButtonSizes.map(size => [size, iconControlSizeVariants[size].svg]),
) as Record<IconButtonSize, string>
