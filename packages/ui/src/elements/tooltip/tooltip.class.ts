import { floatingSurfaceMaxWidthVariants, floatingSurfaceSizeVariants } from '../popover/popover.class'

export {
  floatingSurfaceMaxWidthVariants as tooltipContentMaxWidth,
  floatingSurfaceSizeVariants as tooltipContentBySize,
}

export const tooltipContentBase =
  'relative box-border overflow-visible rounded-[var(--element-border-radius)] outline-none duration-200 ease-out data-[starting-style]:animate-in data-[starting-style]:fade-in-0 data-[starting-style]:zoom-in-50 data-[ending-style]:animate-out data-[ending-style]:fade-out-0 data-[ending-style]:zoom-out-50 [min-width:var(--anchor-width)] [transform-origin:var(--transform-origin)]'

export const tooltipPositionerBase = 'z-[1000]'
