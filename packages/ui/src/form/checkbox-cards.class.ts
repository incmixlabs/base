import { semanticColorKeys } from '../theme/props/color.prop'
import type { Color } from '../theme/tokens'
import type { FormSize } from './form-size'
import {
  checkboxCardGapVariants,
  checkboxCardPaddingVariants,
  checkboxControlIconSizeVariants,
  checkboxControlSizeVariants,
  radioCheckboxCardSizes,
  radioCheckboxCardTextVariants,
} from './radio-checkbox.shared.class'

export type CheckboxCardSize = FormSize

export const checkboxCardSizeVariants = Object.fromEntries(
  radioCheckboxCardSizes.map(size => [
    size,
    [checkboxCardPaddingVariants[size], checkboxCardGapVariants[size], radioCheckboxCardTextVariants[size]].join(' '),
  ]),
) as Record<CheckboxCardSize, string>

export const checkboxCardControlSizeVariants = {
  ...checkboxControlSizeVariants,
} as const satisfies Record<CheckboxCardSize, string>

export const checkboxCardIconSizeVariants = {
  ...checkboxControlIconSizeVariants,
} as const satisfies Record<CheckboxCardSize, string>

const joinClass = (...parts: string[]) => parts.join('')
const colorVar = (color: string, token: string) => joinClass('var(--color-', color, '-', token, ')')

export const checkboxCardSelectionColorVariants = Object.fromEntries(
  semanticColorKeys.map(color => [
    color,
    [
      joinClass('peer-data-[checked]:[box-shadow:0_0_0_2px_', colorVar(color, 'primary-alpha'), ']'),
      joinClass('peer-focus-visible:[box-shadow:0_0_0_2px_', colorVar(color, 'primary-alpha'), ']'),
    ].join(' '),
  ]),
) as Record<Color, string>

export const checkboxCardsClassNames = [
  ...Object.values(checkboxCardSizeVariants),
  ...Object.values(checkboxCardControlSizeVariants),
  ...Object.values(checkboxCardIconSizeVariants),
  ...Object.values(checkboxCardSelectionColorVariants),
]
