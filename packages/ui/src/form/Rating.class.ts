import { type SemanticColorKey, semanticColorKeys } from '../theme/props/color.prop'
import type { RatingSize } from './rating.props'

const joinClass = (...parts: string[]) => parts.join('')
const colorVar = (color: string, token: string) => joinClass('var(--color-', color, '-', token, ')')

const ratingFocusClassName = (color: string) =>
  joinClass(
    'focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:[outline-color:',
    colorVar(color, 'solid-alpha'),
    ']',
  )

export const ratingBase = 'flex outline-none'

export const ratingItemBase =
  'inline-flex cursor-pointer appearance-none items-center justify-center rounded-sm border-0 bg-transparent p-0 text-inherit transition-colors duration-150 focus:outline-none disabled:pointer-events-none disabled:opacity-50'

export const ratingColorVariants = Object.fromEntries(
  semanticColorKeys.map(color => [color, joinClass('text-', color)]),
) as Record<SemanticColorKey, string>

export const ratingItemFocusColorVariants = Object.fromEntries(
  semanticColorKeys.map(color => [color, ratingFocusClassName(color)]),
) as Record<SemanticColorKey, string>

export const ratingItemSizeVariants = {
  xs: 'h-3 w-3',
  sm: 'h-3.5 w-3.5',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
  xl: 'h-6 w-6',
  '2x': 'h-7 w-7',
} as const satisfies Record<RatingSize, string>

export const ratingGapVariants = {
  xs: 'gap-1',
  sm: 'gap-1.5',
  md: 'gap-2',
  lg: 'gap-2.5',
  xl: 'gap-[0.6875rem]',
  '2x': 'gap-3.5',
} as const satisfies Record<RatingSize, string>

export const ratingClassNames = [
  ratingBase,
  ratingItemBase,
  ...Object.values(ratingColorVariants),
  ...Object.values(ratingItemFocusColorVariants),
  ...Object.values(ratingItemSizeVariants),
  ...Object.values(ratingGapVariants),
]
