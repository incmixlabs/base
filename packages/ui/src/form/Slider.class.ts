import { type SemanticColorKey, semanticColorKeys } from '../theme/props/color.prop'
import type { Radius } from '../theme/tokens'
import type { FormSize } from './form-size'

type SliderVariant = 'classic' | 'solid' | 'surface' | 'soft'

const joinClass = (...parts: string[]) => parts.join('')
const colorVar = (color: string, token: string) => joinClass('var(--color-', color, '-', token, ')')

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

export const sliderTrackHeightVariants = {
  xs: 'h-1',
  sm: 'h-1.5',
  md: 'h-2',
  lg: 'h-3',
} as const satisfies Record<FormSize, string>

export const sliderTrackWidthVariants = {
  xs: 'w-1',
  sm: 'w-1.5',
  md: 'w-2',
  lg: 'w-3',
} as const satisfies Record<FormSize, string>

export const sliderThumbSizeVariants = {
  xs: 'h-3 w-3',
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
} as const satisfies Record<FormSize, string>

export const sliderTrackVariantStyles = {
  solid: 'border-0',
  surface: 'bg-neutral-surface border border-solid border-neutral',
  classic: 'bg-neutral-surface border border-solid border-neutral [box-shadow:var(--shadow-xs)]',
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
  ...Object.values(sliderTrackHeightVariants),
  ...Object.values(sliderTrackWidthVariants),
  ...Object.values(sliderThumbSizeVariants),
  ...Object.values(sliderTrackVariantStyles),
  ...Object.values(sliderSolidTrackColorStyles),
  ...Object.values(sliderIndicatorColorStyles),
  ...Object.values(sliderSoftIndicatorColorStyles),
  ...Object.values(sliderThumbColorStyles),
  sliderTrackHighContrast,
  sliderIndicatorHighContrast,
]
