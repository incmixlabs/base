import type { Rule } from 'unocss'
import type { cardPropDefs } from './card.props'

type CardSize = (typeof cardPropDefs.size.values)[number]
type CardContainerBreakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export const cardRootBase = '[container-type:inline-size] group relative'
export const cardRootSizeWrapperBase = 'box-border'
export const cardHeaderBase = 'flex flex-col gap-[0.375rem]'
export const cardTitleBase = 'text-lg font-semibold leading-none tracking-tight'
export const cardContentBase = 'pt-4 [&:has(>[data-slot=card-actions])]:pt-10'
export const cardFooterBase = 'flex items-center pt-4'
export const cardActionsBase = 'absolute end-0 top-0 z-10 flex items-center gap-1'
export const cardActionsRevealHoverFocus = [
  'pointer-events-none opacity-0',
  'transition-opacity duration-[var(--af-motion-fast)] ease-[var(--af-ease-standard)] motion-reduce:transition-none',
  'group-hover:!pointer-events-auto group-hover:opacity-100',
  'group-focus-within:!pointer-events-auto group-focus-within:opacity-100',
].join(' ')

export const cardSizeClass = 'af-card-size'

export const cardSizeContainerBreakpoints = {
  xs: '400px',
  sm: '560px',
  md: '840px',
  lg: '1120px',
  xl: '1360px',
} as const satisfies Record<CardContainerBreakpoint, string>

function cardPaddingFallback(...breakpoints: CardContainerBreakpoint[]) {
  return breakpoints.reduceRight(
    (fallback, breakpoint) => `var(--af-card-padding-${breakpoint}, ${fallback})`,
    'var(--af-card-padding-initial)',
  )
}

const cardSizeContainerFallbacks = {
  xs: cardPaddingFallback('xs'),
  sm: cardPaddingFallback('sm', 'xs'),
  md: cardPaddingFallback('md', 'sm', 'xs'),
  lg: cardPaddingFallback('lg', 'md', 'sm', 'xs'),
  xl: cardPaddingFallback('xl', 'lg', 'md', 'sm', 'xs'),
} as const satisfies Record<CardContainerBreakpoint, string>

export const cardSizeContainerClasses = Object.fromEntries(
  Object.keys(cardSizeContainerBreakpoints).map(key => [key, `cq-${key}:af-card-size-${key}`]),
) as Record<CardContainerBreakpoint, string>

export const cardSizeClasses = [cardSizeClass, ...Object.values(cardSizeContainerClasses)] as const

export const cardSizeRules: Rule[] = [
  [
    cardSizeClass,
    {
      '--af-card-padding-active': 'var(--af-card-padding-initial)',
      '--inset-border-width': '0px',
      '--inset-padding': 'var(--af-card-padding-active)',
      padding: 'var(--af-card-padding-active)',
    },
  ],
  ...Object.entries(cardSizeContainerFallbacks).map(
    ([key, value]) =>
      [
        `af-card-size-${key}`,
        {
          '--af-card-padding-active': value,
        },
      ] as Rule,
  ),
]

export const cardRootSizeClassName = cardSizeClasses.join(' ')

export const cardPaddingBySize = {
  xs: '0.5rem',
  sm: '0.625rem',
  md: '0.75rem',
  lg: '0.875rem',
  xl: '0.875rem',
} as const satisfies Record<CardSize, string>
