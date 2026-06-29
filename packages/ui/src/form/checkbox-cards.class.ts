import { semanticColorKeys } from '../theme/props/color.prop'
import type { Color } from '../theme/tokens'
import type { FormSize } from './form-size'
import { createRadioCheckboxCardSizeVariants } from './radio-checkbox.shared.class'

export type CheckboxCardSize = FormSize

export const checkboxCardSizeVariants = createRadioCheckboxCardSizeVariants('checkbox-cards')

export const checkboxCardControlSizeVariants = {
  xs: '[--af-checkbox-card-box-size:var(--af-checkbox-cards-size-xs-box-size,0.875rem)] [--af-checkbox-card-icon-size:var(--af-checkbox-cards-size-xs-icon-size,0.75rem)]',
  sm: '[--af-checkbox-card-box-size:var(--af-checkbox-cards-size-sm-box-size,1rem)] [--af-checkbox-card-icon-size:var(--af-checkbox-cards-size-sm-icon-size,0.875rem)]',
  md: '[--af-checkbox-card-box-size:var(--af-checkbox-cards-size-md-box-size,1.25rem)] [--af-checkbox-card-icon-size:var(--af-checkbox-cards-size-md-icon-size,1rem)]',
  lg: '[--af-checkbox-card-box-size:var(--af-checkbox-cards-size-lg-box-size,1.5rem)] [--af-checkbox-card-icon-size:var(--af-checkbox-cards-size-lg-icon-size,1.25rem)]',
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
  ...Object.values(checkboxCardSelectionColorVariants),
]
