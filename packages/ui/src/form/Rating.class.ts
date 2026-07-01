import { type SemanticColorKey, semanticColorKeys } from '../theme/props/color.prop'
import { controlSizeTokens } from '../theme/token-maps'
import { type RatingSize, ratingSizes } from './rating.props'

const joinClass = (...parts: string[]) => parts.join('')
const colorVar = (color: string, token: string) => joinClass('var(--color-', color, '-', token, ')')
const ratingSizeVar = (size: string, slot: string, fallback: string) =>
  joinClass('var(--af-rating-size-', size, '-', slot, ',', fallback, ')')

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

export const ratingItemSizeVariants = Object.fromEntries(
  ratingSizes.map(size => {
    const token = controlSizeTokens[size]
    const iconSize = ratingSizeVar(size, 'icon-size', token.iconSize)
    return [size, joinClass('h-[', iconSize, '] w-[', iconSize, ']')]
  }),
) as Record<RatingSize, string>

export const ratingGapVariants = Object.fromEntries(
  ratingSizes.map(size => {
    const token = controlSizeTokens[size]
    return [size, joinClass('gap-[', ratingSizeVar(size, 'gap', token.gap), ']')]
  }),
) as Record<RatingSize, string>

export const ratingClassNames = [
  ratingBase,
  ratingItemBase,
  ...Object.values(ratingColorVariants),
  ...Object.values(ratingItemFocusColorVariants),
  ...Object.values(ratingItemSizeVariants),
  ...Object.values(ratingGapVariants),
]
