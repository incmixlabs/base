import { semanticColorKeys } from '../theme/props/color.prop'
import type { Color } from '../theme/tokens'
import type { FormSize } from './form-size'
import { radioCardGapVariants, radioCardPaddingVariants } from './radio-checkbox.shared.class'

export { radioCardGapVariants, radioCardPaddingVariants } from './radio-checkbox.shared.class'

export type RadioCardSize = FormSize

const joinClass = (...parts: string[]) => parts.join('')
const colorVar = (color: string, token: string) => joinClass('var(--color-', color, '-', token, ')')

const selectedRadioCardColor = (color: Color): Color => (color === 'neutral' ? 'primary' : color)

export const radioCardRootBase =
  'group relative flex box-border cursor-pointer rounded-lg border border-solid text-left outline-none transition-all'

export const radioCardIndicatorBase =
  'mt-1 inline-flex box-border shrink-0 items-center justify-center rounded-full border-2 border-solid transition-all duration-150'

export const radioCardIndicatorInner = 'rounded-full [background-color:var(--color-light-primary)]'

export const radioCardContentBase = 'flex-1 text-base leading-6'

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

export const radioCardIndicatorColorVariants = Object.fromEntries(
  semanticColorKeys.map(color => {
    const selectedColor = selectedRadioCardColor(color)

    return [
      color,
      [
        joinClass('border-', color),
        joinClass('bg-', color, '-surface'),
        joinClass('text-', selectedColor),
        joinClass('group-data-[checked]:[border-color:', colorVar(selectedColor, 'primary'), ']'),
        joinClass('group-data-[checked]:bg-', selectedColor, '-solid'),
      ].join(' '),
    ]
  }),
) as Record<Color, string>

export const radioCardRootColorVariants = Object.fromEntries(
  semanticColorKeys.map(color => {
    const selectedColor = selectedRadioCardColor(color)

    return [
      color,
      [
        joinClass(
          'focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:[outline-color:',
          colorVar(selectedColor, 'primary-alpha'),
          ']',
        ),
        joinClass('data-[checked]:[border-color:', colorVar(selectedColor, 'primary'), ']'),
        joinClass('data-[checked]:bg-', selectedColor, '-soft'),
        joinClass('data-[checked]:[box-shadow:0_0_0_2px_', colorVar(selectedColor, 'primary-alpha'), ']'),
        joinClass('data-[checked]:hover:bg-', selectedColor, '-soft-hover'),
      ].join(' '),
    ]
  }),
) as Record<Color, string>

export const radioCardsClassNames = [
  radioCardRootBase,
  radioCardIndicatorBase,
  radioCardIndicatorInner,
  radioCardContentBase,
  ...Object.values(radioCardPaddingVariants),
  ...Object.values(radioCardGapVariants),
  ...Object.values(radioCardIndicatorSizeVariants),
  ...Object.values(radioCardIndicatorInnerSizeVariants),
  ...Object.values(radioCardIndicatorColorVariants),
  ...Object.values(radioCardRootColorVariants),
]
