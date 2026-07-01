import type { accordionRootPropDefs } from './accordion.props'

export type AccordionSize = (typeof accordionRootPropDefs.size.values)[number]

export const accordionRootBase =
  'overflow-hidden rounded-[var(--element-border-radius)] border border-neutral bg-neutral-surface'
export const accordionRootBorderless = 'border-0'

export const accordionItemBase = 'border-t border-neutral first:border-t-0'
export const accordionItemBorderless = 'border-t-0'

export const accordionHeaderBase = 'm-0 min-w-0 w-full'
export const accordionTriggerPaddingless = 'p-0'
export const accordionTriggerBase =
  'group flex w-full cursor-pointer items-center justify-between border-0 bg-transparent text-left text-neutral transition-colors duration-[var(--af-motion-fast)] ease-[var(--af-ease-standard)] data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-solid focus-visible:outline-[var(--color-primary-solid)] [&:hover:not([data-disabled])]:bg-neutral-soft'

export const accordionChevron =
  'shrink-0 transition-transform duration-[var(--af-motion-fast)] ease-[var(--af-ease-standard)]'

export const accordionContentBase =
  'overflow-hidden [color:color-mix(in_oklch,var(--color-neutral-text)_68%,transparent)]'
export const accordionContentAnimated =
  '[height:var(--accordion-panel-height)] opacity-100 transition-[height,opacity] duration-[350ms] ease-in-out motion-reduce:transition-none motion-reduce:duration-0 data-[starting-style]:[height:0] data-[starting-style]:opacity-0 data-[ending-style]:[height:0] data-[ending-style]:opacity-0'
export const accordionContentInner = 'px-4'
export const accordionContentPaddingless = 'p-0'

export const accordionTextSizeVariants = {
  xs: 'text-xs leading-4',
  sm: 'text-sm leading-5',
  md: 'text-base leading-6',
  lg: 'text-lg leading-[1.625rem]',
  xl: 'text-xl leading-7',
  '2x': 'text-2xl leading-[1.875rem]',
} as const satisfies Record<AccordionSize, string>

export const accordionTriggerSizeVariants = {
  xs: 'gap-1 px-4 py-1',
  sm: 'gap-1.5 px-4 py-1',
  md: 'gap-2 px-4 py-1',
  lg: 'gap-2.5 px-4 py-[0.4375rem]',
  xl: 'gap-[0.6875rem] px-4 py-2',
  '2x': 'gap-[0.875rem] px-4 py-[1.5625rem]',
} as const satisfies Record<AccordionSize, string>

export const accordionContentSizeVariants = {
  xs: 'py-1',
  sm: 'py-1',
  md: 'py-1',
  lg: 'py-[0.4375rem]',
  xl: 'py-2',
  '2x': 'py-[1.5625rem]',
} as const satisfies Record<AccordionSize, string>

export const accordionChevronSizeVariants = {
  xs: 'h-[0.75rem] w-[0.75rem]',
  sm: 'h-[0.875rem] w-[0.875rem]',
  md: 'h-[1rem] w-[1rem]',
  lg: 'h-[1.25rem] w-[1.25rem]',
  xl: 'h-[1.5rem] w-[1.5rem]',
  '2x': 'h-[1.75rem] w-[1.75rem]',
} as const satisfies Record<AccordionSize, string>

export const accordionClassNames = [
  accordionRootBase,
  accordionRootBorderless,
  accordionItemBase,
  accordionItemBorderless,
  accordionHeaderBase,
  accordionTriggerPaddingless,
  accordionTriggerBase,
  accordionChevron,
  accordionContentBase,
  accordionContentAnimated,
  accordionContentInner,
  accordionContentPaddingless,
  ...Object.values(accordionTextSizeVariants),
  ...Object.values(accordionTriggerSizeVariants),
  ...Object.values(accordionContentSizeVariants),
  ...Object.values(accordionChevronSizeVariants),
]
