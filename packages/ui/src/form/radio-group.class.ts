import { semanticColorKeys } from '../theme/props/color.prop'
import type { Color } from '../theme/tokens'
import {
  radioControlIndicatorSizeVariants,
  radioControlLabelGapVariants,
  radioControlSizeVariants,
} from './radio-checkbox.shared.class'
import type { RadioGroupOrientation, RadioSize, RadioVariant } from './radio-group.props'

const radioClassVariants = ['classic', 'surface', 'soft'] as const satisfies readonly RadioVariant[]

export const radioBaseCls =
  'peer inline-flex box-border items-center justify-center rounded-full border-2 border-solid transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-50'

export const radioIndicatorCls = 'box-border rounded-full [background-color:var(--color-light-solid)]'

const joinClass = (...parts: string[]) => parts.join('')
const colorVar = (color: string, token: string) => joinClass('var(--color-', color, '-', token, ')')

const radioFocusClassName = (color: string) =>
  joinClass(
    'focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:[outline-color:',
    colorVar(color, 'solid-alpha'),
    ']',
  )

const radioSharedStateClassName = (color: string) =>
  [
    radioFocusClassName(color),
    joinClass('hover:[border-color:', colorVar(color, 'text'), ']'),
    joinClass('data-[checked]:[border-color:', colorVar(color, 'solid'), ']'),
    joinClass('data-[checked]:bg-', color, '-solid'),
    'data-[checked]:[background-image:none]',
  ].join(' ')

const radioClassicGradientClassName = (color: string) =>
  joinClass(
    '[background-image:linear-gradient(to_bottom,color-mix(in_oklch,',
    colorVar(color, 'solid'),
    '_88%,white),',
    colorVar(color, 'solid'),
    ')]',
  )

const createRadioColorVariantClasses = (color: Color): Record<RadioVariant, string> => ({
  classic: [
    joinClass('[border-color:', colorVar(color, 'solid'), ']'),
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
    joinClass('data-[checked]:[border-color:', colorVar(color, 'solid'), ']'),
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
  ...radioControlSizeVariants,
} as const satisfies Record<RadioSize, string>

export const radioIndicatorSizeVariants = {
  ...radioControlIndicatorSizeVariants,
} as const satisfies Record<RadioSize, string>

export const radioGapVariants = {
  ...radioControlLabelGapVariants,
} as const satisfies Record<RadioSize, string>

export const radioGroupRootOrientation = {
  vertical: 'flex-col gap-2',
  horizontal: 'flex-row gap-4',
} as const satisfies Record<RadioGroupOrientation, string>

export const radioGroupClassNames = [
  radioBaseCls,
  radioIndicatorCls,
  ...radioClassVariants.flatMap(variant => semanticColorKeys.map(color => radioColorVariants[color][variant])),
  ...Object.values(radioHighContrastByVariant),
  ...Object.values(radioSizeVariants),
  ...Object.values(radioIndicatorSizeVariants),
  ...Object.values(radioGapVariants),
  ...Object.values(radioGroupRootOrientation),
]
