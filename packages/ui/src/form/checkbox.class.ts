import { semanticColorKeys } from '../theme/props/color.prop'
import type { Color } from '../theme/tokens'
import type { CheckboxSize, CheckboxVariant } from './checkbox.props'
import {
  checkboxControlBoxBase,
  checkboxControlIconSizeVariants,
  checkboxControlRadiusVariants,
  checkboxControlSizeVariants,
} from './radio-checkbox.shared.class'

const checkboxClassVariants = ['solid', 'soft', 'outline'] as const satisfies readonly CheckboxVariant[]

export const checkboxBase = `${checkboxControlBoxBase} inline-flex shrink-0 items-center justify-center outline-none transition-colors duration-150 ease-in-out`

export const checkboxBaseCls = 'peer'

export const checkboxIndicator = 'flex shrink-0 items-center justify-center text-inherit'

const joinClass = (...parts: string[]) => parts.join('')
const colorVar = (color: string, token: string) => joinClass('var(--color-', color, '-', token, ')')

const focusRingClassName = (color: string) =>
  joinClass(
    'focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:[outline-color:',
    colorVar(color, 'solid-alpha'),
    ']',
  )

const checkedSolidStateClassName = (color: string) =>
  [
    joinClass('data-[checked]:bg-', color, '-solid'),
    joinClass('data-[checked]:[border-color:', colorVar(color, 'solid'), ']'),
    joinClass('data-[checked]:text-', color, '-contrast'),
    joinClass('data-[indeterminate]:bg-', color, '-solid'),
    joinClass('data-[indeterminate]:[border-color:', colorVar(color, 'solid'), ']'),
    joinClass('data-[indeterminate]:text-', color, '-contrast'),
  ].join(' ')

const checkedSoftStateClassName = (color: string) =>
  [
    joinClass('data-[checked]:[background-color:', colorVar(color, 'soft-hover'), ']'),
    joinClass('data-[checked]:text-', color),
    joinClass('data-[indeterminate]:[background-color:', colorVar(color, 'soft-hover'), ']'),
    joinClass('data-[indeterminate]:text-', color),
  ].join(' ')

const checkedOutlineStateClassName = (color: string) =>
  [
    joinClass('data-[checked]:[border-color:', colorVar(color, 'solid'), ']'),
    joinClass('data-[checked]:text-', color),
    joinClass('data-[indeterminate]:[border-color:', colorVar(color, 'solid'), ']'),
    joinClass('data-[indeterminate]:text-', color),
  ].join(' ')

const createCheckboxColorVariantClasses = (color: Color): Record<CheckboxVariant, string> => ({
  solid: [
    'border border-solid',
    joinClass('border-', color),
    'bg-[var(--color-neutral-background)]',
    joinClass('text-', color, '-contrast'),
    focusRingClassName(color),
    joinClass('hover:[border-color:', colorVar(color, 'text'), ']'),
    checkedSolidStateClassName(color),
  ].join(' '),
  soft: [
    'border-0',
    joinClass('bg-', color, '-soft'),
    joinClass('text-', color),
    focusRingClassName(color),
    checkedSoftStateClassName(color),
  ].join(' '),
  outline: [
    'border border-solid',
    joinClass('border-', color),
    'bg-transparent',
    joinClass('text-', color),
    focusRingClassName(color),
    joinClass('hover:[border-color:', colorVar(color, 'text'), ']'),
    checkedOutlineStateClassName(color),
  ].join(' '),
})

export const checkboxColorVariants = Object.fromEntries(
  semanticColorKeys.map(color => [color, createCheckboxColorVariantClasses(color)]),
) as Record<Color, Record<CheckboxVariant, string>>

export const checkboxHighContrastByVariant: Record<CheckboxVariant, string> = {
  solid: 'saturate-[1.1] brightness-[0.95]',
  soft: 'saturate-[1.2]',
  outline: 'font-semibold',
}

export const checkboxSizeVariants = {
  xs: `${checkboxControlSizeVariants.xs} ${checkboxControlRadiusVariants.xs}`,
  sm: `${checkboxControlSizeVariants.sm} ${checkboxControlRadiusVariants.sm}`,
  md: `${checkboxControlSizeVariants.md} ${checkboxControlRadiusVariants.md}`,
  lg: `${checkboxControlSizeVariants.lg} ${checkboxControlRadiusVariants.lg}`,
} as const satisfies Record<CheckboxSize, string>

export const checkboxIndicatorSizeVariants = {
  ...checkboxControlIconSizeVariants,
} as const satisfies Record<CheckboxSize, string>

export const checkboxClassNames = [
  checkboxBase,
  checkboxBaseCls,
  checkboxIndicator,
  ...checkboxClassVariants.flatMap(variant => semanticColorKeys.map(color => checkboxColorVariants[color][variant])),
  ...Object.values(checkboxHighContrastByVariant),
  ...Object.values(checkboxSizeVariants),
  ...Object.values(checkboxIndicatorSizeVariants),
]
