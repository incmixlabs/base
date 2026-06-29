import { semanticColorKeys } from '../theme/props/color.prop'
import type { Color } from '../theme/tokens'
import type { RadioGroupOrientation, RadioSize, RadioVariant } from './radio-group.props'

const radioClassVariants = ['classic', 'surface', 'soft'] as const satisfies readonly RadioVariant[]

export const radioBaseCls =
  'peer inline-flex box-border items-center justify-center rounded-full border-2 border-solid transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-50'

export const radioIndicatorCls =
  'box-border rounded-full [background-color:var(--color-light-primary)] w-[var(--radio-indicator-size)] h-[var(--radio-indicator-size)]'

const joinClass = (...parts: string[]) => parts.join('')
const colorVar = (color: string, token: string) => joinClass('var(--color-', color, '-', token, ')')

const radioFocusClassName = (color: string) =>
  joinClass(
    'focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:[outline-color:',
    colorVar(color, 'primary-alpha'),
    ']',
  )

const radioSharedStateClassName = (color: string) =>
  [
    radioFocusClassName(color),
    joinClass('hover:[border-color:', colorVar(color, 'text'), ']'),
    joinClass('data-[checked]:[border-color:', colorVar(color, 'primary'), ']'),
    joinClass('data-[checked]:bg-', color, '-solid'),
    'data-[checked]:[background-image:none]',
  ].join(' ')

const radioClassicGradientClassName = (color: string) =>
  joinClass(
    '[background-image:linear-gradient(to_bottom,color-mix(in_oklch,',
    colorVar(color, 'primary'),
    '_88%,white),',
    colorVar(color, 'primary'),
    ')]',
  )

const createRadioColorVariantClasses = (color: Color): Record<RadioVariant, string> => ({
  classic: [
    joinClass('[border-color:', colorVar(color, 'primary'), ']'),
    radioClassicGradientClassName(color),
    joinClass('text-', color, '-contrast'),
    radioSharedStateClassName(color),
  ].join(' '),
  surface: [
    joinClass('border-', color),
    joinClass('bg-', color, '-surface'),
    joinClass('text-', color),
    radioSharedStateClassName(color),
  ].join(' '),
  soft: [
    joinClass('border-', color),
    joinClass('bg-', color, '-soft'),
    joinClass('text-', color),
    radioFocusClassName(color),
    joinClass('hover:[border-color:', colorVar(color, 'text'), ']'),
    joinClass('data-[checked]:[border-color:', colorVar(color, 'primary'), ']'),
    joinClass('data-[checked]:bg-[', colorVar(color, 'soft-hover'), ']'),
    'data-[checked]:[background-image:none]',
  ].join(' '),
})

export const radioColorVariants = Object.fromEntries(
  semanticColorKeys.map(color => [color, createRadioColorVariantClasses(color)]),
) as Record<Color, Record<RadioVariant, string>>

export const radioHighContrastByVariant: Record<RadioVariant, string> = {
  classic: 'saturate-[1.1] brightness-[0.95]',
  surface: 'saturate-[1.05] font-semibold',
  soft: 'saturate-[1.2]',
}

export const radioSizeVariants = {
  xs: 'w-[var(--af-radio-size-xs-radio-size,0.75rem)] h-[var(--af-radio-size-xs-radio-size,0.75rem)] [--radio-indicator-size:var(--af-radio-size-xs-indicator-size,calc(0.75rem/2))]',
  sm: 'w-[var(--af-radio-size-sm-radio-size,1rem)] h-[var(--af-radio-size-sm-radio-size,1rem)] [--radio-indicator-size:var(--af-radio-size-sm-indicator-size,calc(1rem/2))]',
  md: 'w-[var(--af-radio-size-md-radio-size,1.25rem)] h-[var(--af-radio-size-md-radio-size,1.25rem)] [--radio-indicator-size:var(--af-radio-size-md-indicator-size,calc(1.25rem/2))]',
  lg: 'w-[var(--af-radio-size-lg-radio-size,1.5rem)] h-[var(--af-radio-size-lg-radio-size,1.5rem)] [--radio-indicator-size:var(--af-radio-size-lg-indicator-size,calc(1.5rem/2))]',
} as const satisfies Record<RadioSize, string>

export const radioGapVariants = {
  xs: '[--radio-gap:var(--af-radio-size-xs-gap,0.25rem)]',
  sm: '[--radio-gap:var(--af-radio-size-sm-gap,0.375rem)]',
  md: '[--radio-gap:var(--af-radio-size-md-gap,0.5rem)]',
  lg: '[--radio-gap:var(--af-radio-size-lg-gap,0.625rem)]',
} as const satisfies Record<RadioSize, string>

export const radioGroupRootOrientation = {
  vertical: 'flex-col gap-[var(--af-radio-group-gap,0.5rem)]',
  horizontal: 'flex-row gap-[var(--af-radio-group-inline-gap,1rem)]',
} as const satisfies Record<RadioGroupOrientation, string>

export const radioGroupClassNames = [
  radioBaseCls,
  radioIndicatorCls,
  ...radioClassVariants.flatMap(variant => semanticColorKeys.map(color => radioColorVariants[color][variant])),
  ...Object.values(radioHighContrastByVariant),
  ...Object.values(radioSizeVariants),
  ...Object.values(radioGapVariants),
  ...Object.values(radioGroupRootOrientation),
]
