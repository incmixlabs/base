import type { Transition, Variants } from 'motion/react'
import { floatingSurfaceMaxWidthVariants, floatingSurfaceSizeVariants } from '../popover/popover.class'

export {
  floatingSurfaceMaxWidthVariants as tooltipContentMaxWidth,
  floatingSurfaceSizeVariants as tooltipContentBySize,
}

export const tooltipContentBase =
  'relative box-border overflow-visible rounded-[var(--element-border-radius)] outline-none [min-width:var(--anchor-width)] [transform-origin:var(--transform-origin)]'

export const tooltipPositionerBase = 'z-[1000]'

export const tooltipPanelVariants: Variants = {
  initial: { opacity: 0, scale: 0.5 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.5 },
}

export const tooltipPanelTransition: Transition = {
  type: 'spring',
  stiffness: 400,
  damping: 25,
}
