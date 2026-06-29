import { type SurfaceVariant, surfaceVariants } from '@/elements/surface/surface.props'
import type { Color, Variant } from '@/theme/tokens'
import { createControlSurfaceClassMaps } from '../surface/control-surface.class'

export const buttonBaseCls =
  'relative inline-flex items-center justify-center select-none border border-solid outline-none box-border'

export const buttonLoadingContentCls = 'opacity-0 inline-flex items-center justify-center gap-[inherit]'

export const buttonLoadingOverlayCls = 'absolute inset-0 flex items-center justify-center'

export const buttonSizeVariants = {
  xs: 'h-5 px-1.5 py-1 text-xs leading-4 gap-1',
  sm: 'h-6 px-2 py-1 text-sm leading-5 gap-1.5',
  md: 'h-8 px-3 py-1.25 text-base leading-6 gap-2',
  lg: 'h-10 px-3.5 py-[0.4375rem] text-lg leading-[1.625rem] gap-2.5',
  xl: 'h-11 px-3.5 py-2 text-xl leading-7 gap-[0.6875rem]',
} as const

export const buttonMotion =
  'transition-[background-color,color,border-color,box-shadow,filter] duration-[var(--af-motion-fast)] ease-[var(--af-ease-standard)]'

export const buttonLoading = 'cursor-wait'

const buttonSurfaceClassMaps = createControlSurfaceClassMaps(surfaceVariants satisfies readonly SurfaceVariant[])

export const buttonColorVariants = buttonSurfaceClassMaps.color as Record<Color, Record<Variant, string>>

export const buttonHoverColorVariants = buttonSurfaceClassMaps.hover as Record<Color, Record<Variant, string>>

export const buttonHighContrastHoverColorVariants = buttonSurfaceClassMaps.highContrastHover as Record<
  Color,
  Record<Variant, string>
>

export const buttonHighContrastColorVariants = buttonSurfaceClassMaps.highContrast as Record<
  Color,
  Record<Variant, string>
>
