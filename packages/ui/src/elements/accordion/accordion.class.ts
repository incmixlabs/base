import type { Transition, Variants } from 'motion/react'

export type AccordionSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2x'

export const accordionRootBase = 'af-accordion-root-base'
export const accordionRootBorderless = 'af-accordion-root-borderless'

export const accordionItemBase = 'af-accordion-item-base'
export const accordionItemBorderless = 'af-accordion-item-borderless'

export const accordionHeaderBase = 'af-accordion-header-base'
export const accordionTriggerPaddingless = 'af-padding-less'
export const accordionTriggerBase = 'af-accordion-trigger-base'

export const accordionChevron = 'af-accordion-chevron'

export const accordionContentBase = 'af-accordion-content-base'
export const accordionContentInner = 'af-accordion-content-inner'
export const accordionContentPaddingless = 'af-accordion-content-paddingless'

export const accordionSizeVars = {
  xs: 'af-accordion-size-xs',
  sm: 'af-accordion-size-sm',
  md: 'af-accordion-size-md',
  lg: 'af-accordion-size-lg',
  xl: 'af-accordion-size-xl',
  '2x': 'af-accordion-size-2x',
} as const

// Motion variants
export const accordionPanelVariants: Variants = {
  initial: { height: 0, opacity: 0 },
  animate: { height: 'auto', opacity: 1 },
  exit: { height: 0, opacity: 0 },
}

export const accordionPanelTransition: Transition = { duration: 0.35, ease: 'easeInOut' }
