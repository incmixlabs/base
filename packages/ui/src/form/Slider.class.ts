import { type SemanticColorKey, semanticColorKeys } from '../theme/props/color.prop'
import type { Radius } from '../theme/tokens'
import { type FormSize, formSizes } from './form-size'

type SliderVariant = 'classic' | 'solid' | 'surface' | 'soft'

const sliderSizeTokens: Record<FormSize, { trackHeight: string; thumbSize: string }> = {
  xs: { trackHeight: '0.25rem', thumbSize: '0.75rem' },
  sm: { trackHeight: '0.375rem', thumbSize: '1rem' },
  md: { trackHeight: '0.5rem', thumbSize: '1.25rem' },
  lg: { trackHeight: '0.75rem', thumbSize: '1.5rem' },
}

const joinClass = (...parts: string[]) => parts.join('')
const colorVar = (color: string, token: string) => joinClass('var(--color-', color, '-', token, ')')
const sliderSizeVar = (size: string, slot: string, fallback: string) =>
  joinClass('var(--af-slider-size-', size, '-', slot, ',', fallback, ')')

const sliderFocusClassName = (color: string) =>
  joinClass(
    'focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:[outline-color:',
    colorVar(color, 'solid-alpha'),
    ']',
  )

export const sliderRootBase = 'relative flex touch-none select-none items-center'

export const sliderControlBase = 'relative grow'

export const sliderTrackBase = 'relative overflow-hidden'

export const sliderIndicatorBase = 'absolute'

export const sliderThumbBase =
  'block border-2 border-solid bg-light-surface shadow-sm transition-colors disabled:pointer-events-none disabled:opacity-50'

export const sliderRadiusVariants = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  full: 'rounded-full',
} as const satisfies Record<Radius, string>

export const sliderSizeVariants = Object.fromEntries(
  formSizes.map(size => {
    const token = sliderSizeTokens[size]
    return [
      size,
      [
        joinClass('[--af-slider-track-height:', sliderSizeVar(size, 'track-height', token.trackHeight), ']'),
        joinClass('[--af-slider-thumb-size:', sliderSizeVar(size, 'thumb-size', token.thumbSize), ']'),
      ].join(' '),
    ]
  }),
) as Record<FormSize, string>

export const sliderTrackVariantStyles = {
  solid: 'border-0',
  surface: 'bg-neutral-surface border border-solid border-neutral',
  classic:
    'bg-neutral-surface border border-solid border-neutral [box-shadow:var(--af-slider-variant-classic-box-shadow,var(--shadow-xs))]',
  soft: 'bg-neutral-soft border-0',
} as const satisfies Record<SliderVariant, string>

export const sliderSolidTrackColorStyles = Object.fromEntries(
  semanticColorKeys.map(color => [color, joinClass('bg-[', colorVar(color, 'solid-alpha'), ']')]),
) as Record<SemanticColorKey, string>

export const sliderIndicatorColorStyles = Object.fromEntries(
  semanticColorKeys.map(color => [color, joinClass('bg-', color, '-solid')]),
) as Record<SemanticColorKey, string>

export const sliderSoftIndicatorColorStyles = Object.fromEntries(
  semanticColorKeys.map(color => [color, joinClass('bg-[', colorVar(color, 'soft-hover'), ']')]),
) as Record<SemanticColorKey, string>

export const sliderThumbColorStyles = Object.fromEntries(
  semanticColorKeys.map(color => [
    color,
    [joinClass('[border-color:', colorVar(color, 'solid'), ']'), sliderFocusClassName(color)].join(' '),
  ]),
) as Record<SemanticColorKey, string>

export const sliderTrackHighContrast = '[border-color:var(--color-neutral-text)]'

export const sliderIndicatorHighContrast = 'saturate-[1.15] contrast-[1.05]'

export const sliderClassNames = [
  sliderRootBase,
  sliderControlBase,
  sliderTrackBase,
  sliderIndicatorBase,
  sliderThumbBase,
  ...Object.values(sliderRadiusVariants),
  ...Object.values(sliderSizeVariants),
  ...Object.values(sliderTrackVariantStyles),
  ...Object.values(sliderSolidTrackColorStyles),
  ...Object.values(sliderIndicatorColorStyles),
  ...Object.values(sliderSoftIndicatorColorStyles),
  ...Object.values(sliderThumbColorStyles),
  sliderTrackHighContrast,
  sliderIndicatorHighContrast,
]
