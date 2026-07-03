import {
  floatingSurfaceColorVariants,
  floatingSurfaceHighContrastColorVariants,
  floatingSurfaceHighContrastEffectByVariant,
} from '../surface/surface.class'
import type { PopoverContentMaxWidth, PopoverContentSize } from './popover.props'

export const floatingSurfaceSizeVariants: Record<PopoverContentSize, string> = {
  xs: 'px-2 py-1 text-xs leading-4',
  sm: 'px-2.5 py-1 text-sm leading-5',
  md: 'px-3 py-1 text-base leading-6',
  lg: 'px-3.5 py-[0.4375rem] text-lg leading-[1.625rem]',
}

export const floatingSurfaceMaxWidthVariants: Record<PopoverContentMaxWidth, string> = {
  xs: 'max-w-[20rem]',
  sm: 'max-w-[24rem]',
  md: 'max-w-[28rem]',
  lg: 'max-w-[32rem]',
  xl: 'max-w-[36rem]',
  none: 'max-w-none',
}

export {
  floatingSurfaceColorVariants,
  floatingSurfaceHighContrastColorVariants,
  floatingSurfaceHighContrastEffectByVariant,
}

export const popoverContentBase =
  'relative box-border overflow-visible rounded-[var(--element-border-radius)] outline-none duration-200 ease-out data-[starting-style]:animate-in data-[starting-style]:fade-in-0 data-[starting-style]:zoom-in-50 data-[ending-style]:animate-out data-[ending-style]:fade-out-0 data-[ending-style]:zoom-out-50 [min-width:var(--popover-trigger-width,var(--radix-popover-trigger-width))] [transform-origin:var(--transform-origin,var(--radix-popover-content-transform-origin))]'
