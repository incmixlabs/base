import { style, styleVariants } from '@vanilla-extract/css'
import { semanticColorKeys, semanticColorVar } from '@/theme/props/color.prop'
import { ratingSizeVar } from '@/theme/runtime/component-vars'
import { controlSizeTokens } from '@/theme/token-maps'
import type { Color } from '@/theme/tokens'
import { ratingPropDefs } from './rating.props'

export const ratingBase = style({
  display: 'flex',
  outline: 'none',
})

export const ratingColorVariants: Record<Color, string> = Object.fromEntries(
  semanticColorKeys.map(color => [color, style({ color: semanticColorVar(color, 'text') })]),
) as Record<Color, string>

export const ratingItemBase = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  border: 0,
  backgroundColor: 'transparent',
  padding: 0,
  borderRadius: '2px',
  color: 'inherit',
  transition: 'color 150ms',
  ':focus': { outline: 'none' },
  ':disabled': {
    pointerEvents: 'none',
    opacity: 0.5,
  },
})

const ratingSizes = ratingPropDefs.size.values
type RatingSize = (typeof ratingSizes)[number]

export const ratingItemSizeVariants: Record<RatingSize, string> = styleVariants(
  Object.fromEntries(
    ratingSizes.map(size => {
      const token = controlSizeTokens[size]
      return [
        size,
        {
          width: ratingSizeVar(size, 'iconSize', token.iconSize),
          height: ratingSizeVar(size, 'iconSize', token.iconSize),
        },
      ]
    }),
  ),
)

export const ratingGapVariants: Record<RatingSize, string> = styleVariants(
  Object.fromEntries(
    ratingSizes.map(size => {
      const token = controlSizeTokens[size]
      return [size, { gap: ratingSizeVar(size, 'gap', token.gap) }]
    }),
  ),
)
