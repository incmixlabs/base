import { semanticColorKeys } from '../theme/props/color.prop'
import type { Color } from '../theme/tokens'
import type { FormSize } from './form-size'
import {
  radioCardGapVariants,
  radioCardPaddingVariants,
  radioCheckboxCardTextVariants,
} from './radio-checkbox.shared.class'

export {
  radioCardGapVariants,
  radioCardPaddingVariants,
  radioCheckboxCardTextVariants,
} from './radio-checkbox.shared.class'

export type RadioCardSize = FormSize

const joinClass = (...parts: string[]) => parts.join('')
const colorVar = (color: string, token: string) => joinClass('var(--color-', color, '-', token, ')')

const selectedRadioCardColor = (color: Color): Color => (color === 'neutral' ? 'primary' : color)
const createRadioCardColorVariants = (getClassName: (color: Color, selectedColor: Color) => string) =>
  Object.fromEntries(
    semanticColorKeys.map(color => [color, getClassName(color, selectedRadioCardColor(color))]),
  ) as Record<Color, string>

export const radioCardRootBase =
  'group relative flex box-border cursor-pointer rounded-lg border border-solid text-left outline-none transition-all'

export const radioCardIndicatorBase =
  'mt-1 inline-flex box-border shrink-0 items-center justify-center rounded-full border-2 border-solid transition-all duration-150'

export const radioCardIndicatorInner = 'rounded-full'

export const radioCardContentBase = 'flex-1'

export const radioCardIndicatorSizeVariants = {
  xs: '[height:0.75rem] [width:0.75rem]',
  sm: '[height:1rem] [width:1rem]',
  md: '[height:1.25rem] [width:1.25rem]',
  lg: '[height:1.5rem] [width:1.5rem]',
} as const satisfies Record<RadioCardSize, string>

export const radioCardIndicatorInnerSizeVariants = {
  xs: '[height:0.375rem] [width:0.375rem]',
  sm: '[height:0.5rem] [width:0.5rem]',
  md: '[height:0.625rem] [width:0.625rem]',
  lg: '[height:0.75rem] [width:0.75rem]',
} as const satisfies Record<RadioCardSize, string>

export const radioCardIndicatorInnerColorVariants = createRadioCardColorVariants((_color, selectedColor) =>
  joinClass('bg-', selectedColor, '-solid'),
)

export const radioCardIndicatorColorVariants = createRadioCardColorVariants((color, selectedColor) =>
  [joinClass('border-', color), joinClass('bg-', color, '-surface'), joinClass('text-', selectedColor)].join(' '),
)

export const radioCardRootColorVariants = createRadioCardColorVariants((_color, selectedColor) =>
  [
    joinClass(
      'focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:[outline-color:',
      colorVar(selectedColor, 'solid-alpha'),
      ']',
    ),
    joinClass('data-[checked]:[border-color:', colorVar(selectedColor, 'solid'), ']'),
    joinClass('data-[checked]:[background-color:', colorVar(selectedColor, 'soft'), ']'),
    joinClass(
      'data-[checked]:[box-shadow:inset_0_0_0_1px_',
      colorVar(selectedColor, 'solid'),
      ',0_0_0_2px_',
      colorVar(selectedColor, 'solid-alpha'),
      ']',
    ),
    joinClass('data-[checked]:hover:[background-color:', colorVar(selectedColor, 'soft-hover'), ']'),
  ].join(' '),
)

export const radioCardsClassNames = [
  radioCardRootBase,
  radioCardIndicatorBase,
  radioCardIndicatorInner,
  radioCardContentBase,
  ...Object.values(radioCheckboxCardTextVariants),
  ...Object.values(radioCardPaddingVariants),
  ...Object.values(radioCardGapVariants),
  ...Object.values(radioCardIndicatorSizeVariants),
  ...Object.values(radioCardIndicatorInnerSizeVariants),
  ...Object.values(radioCardIndicatorColorVariants),
  ...Object.values(radioCardIndicatorInnerColorVariants),
  ...Object.values(radioCardRootColorVariants),
]
