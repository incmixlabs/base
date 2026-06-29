import { semanticColorKeys } from '../theme/props/color.prop'
import type { Color } from '../theme/tokens'
import type { CheckboxSize, CheckboxVariant } from './checkbox.props'

const checkboxClassVariants = ['solid', 'soft', 'outline'] as const satisfies readonly CheckboxVariant[]

export const checkboxBase =
  'inline-flex shrink-0 items-center justify-center outline-none transition-colors duration-150 ease-in-out'

export const checkboxBaseCls = 'peer'

export const checkboxIndicator =
  'flex shrink-0 items-center justify-center text-inherit w-[var(--cb-icon-size)] h-[var(--cb-icon-size)]'

const joinClass = (...parts: string[]) => parts.join('')
const colorVar = (color: string, token: string) => joinClass('var(--color-', color, '-', token, ')')

const focusRingClassName = (color: string) =>
  joinClass(
    'focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:[outline-color:',
    colorVar(color, 'primary-alpha'),
    ']',
  )

const checkedSolidStateClassName = (color: string) =>
  [
    joinClass('data-[checked]:bg-', color, '-solid'),
    joinClass('data-[checked]:[border-color:', colorVar(color, 'primary'), ']'),
    joinClass('data-[checked]:text-', color, '-contrast'),
    joinClass('data-[indeterminate]:bg-', color, '-solid'),
    joinClass('data-[indeterminate]:[border-color:', colorVar(color, 'primary'), ']'),
    joinClass('data-[indeterminate]:text-', color, '-contrast'),
  ].join(' ')

const checkedSoftStateClassName = (color: string) =>
  [
    joinClass('data-[checked]:bg-[', colorVar(color, 'soft-hover'), ']'),
    joinClass('data-[checked]:text-', color),
    joinClass('data-[indeterminate]:bg-[', colorVar(color, 'soft-hover'), ']'),
    joinClass('data-[indeterminate]:text-', color),
  ].join(' ')

const checkedOutlineStateClassName = (color: string) =>
  [
    joinClass('data-[checked]:[border-color:', colorVar(color, 'primary'), ']'),
    joinClass('data-[checked]:text-', color),
    joinClass('data-[indeterminate]:[border-color:', colorVar(color, 'primary'), ']'),
    joinClass('data-[indeterminate]:text-', color),
  ].join(' ')

const createCheckboxColorVariantClasses = (color: Color): Record<CheckboxVariant, string> => ({
  solid: [
    'border border-solid',
    joinClass('border-', color),
    'bg-[var(--background)]',
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
  xs: 'w-[var(--component-checkbox-size-xs-box-size,0.875rem)] h-[var(--component-checkbox-size-xs-box-size,0.875rem)] rounded-[var(--component-checkbox-size-xs-border-radius,0.125rem)] [--cb-icon-size:var(--component-checkbox-size-xs-icon-size,0.75rem)]',
  sm: 'w-[var(--component-checkbox-size-sm-box-size,1rem)] h-[var(--component-checkbox-size-sm-box-size,1rem)] rounded-[var(--component-checkbox-size-sm-border-radius,0.125rem)] [--cb-icon-size:var(--component-checkbox-size-sm-icon-size,0.875rem)]',
  md: 'w-[var(--component-checkbox-size-md-box-size,1.25rem)] h-[var(--component-checkbox-size-md-box-size,1.25rem)] rounded-[var(--component-checkbox-size-md-border-radius,0.25rem)] [--cb-icon-size:var(--component-checkbox-size-md-icon-size,1rem)]',
  lg: 'w-[var(--component-checkbox-size-lg-box-size,1.5rem)] h-[var(--component-checkbox-size-lg-box-size,1.5rem)] rounded-[var(--component-checkbox-size-lg-border-radius,0.25rem)] [--cb-icon-size:var(--component-checkbox-size-lg-icon-size,1.25rem)]',
} as const satisfies Record<CheckboxSize, string>

export const checkboxClassNames = [
  checkboxBase,
  checkboxBaseCls,
  checkboxIndicator,
  ...checkboxClassVariants.flatMap(variant => semanticColorKeys.map(color => checkboxColorVariants[color][variant])),
  ...Object.values(checkboxHighContrastByVariant),
  ...Object.values(checkboxSizeVariants),
]
