import { semanticColorKeys } from '../theme/props/color.prop'
import type { Color } from '../theme/tokens'
import type { FormSize } from './form-size'
import { createRadioCheckboxCardSizeVariants } from './radio-checkbox.shared.class'

export type RadioCardSize = FormSize

const radioCardSizes = ['xs', 'sm', 'md', 'lg'] as const satisfies readonly FormSize[]

const indicatorSizeBySize: Record<FormSize, string> = {
  xs: '0.875rem',
  sm: '1rem',
  md: '1.25rem',
  lg: '1.5rem',
}

const joinClass = (...parts: string[]) => parts.join('')
const colorVar = (color: string, token: string) => joinClass('var(--color-', color, '-', token, ')')
const radioCardsSizeVar = (size: string, slot: string, fallback: string) =>
  joinClass('var(--af-radio-cards-size-', size, '-', slot, ',', fallback, ')')

const selectedRadioCardColor = (color: Color): Color => (color === 'neutral' ? 'primary' : color)

export const radioCardRootBase =
  'group relative flex cursor-pointer rounded-lg border border-solid text-left outline-none transition-all'

export const radioCardIndicatorBase =
  'mt-0.5 inline-flex shrink-0 items-center justify-center rounded-full border-2 border-solid transition-all duration-150 w-[var(--af-radio-card-indicator-size)] h-[var(--af-radio-card-indicator-size)]'

export const radioCardIndicatorInner =
  'rounded-full bg-white w-[var(--af-radio-card-indicator-inner-size)] h-[var(--af-radio-card-indicator-inner-size)]'

export const radioCardSizeVariants = createRadioCheckboxCardSizeVariants('radio-cards')

export const radioCardIndicatorSizeVariants = Object.fromEntries(
  radioCardSizes.map(size => {
    const indicatorSize = indicatorSizeBySize[size]
    return [
      size,
      [
        joinClass('[--af-radio-card-indicator-size:', radioCardsSizeVar(size, 'indicator-size', indicatorSize), ']'),
        joinClass(
          '[--af-radio-card-indicator-inner-size:',
          radioCardsSizeVar(size, 'indicator-inner-size', `calc(${indicatorSize}/2)`),
          ']',
        ),
      ].join(' '),
    ]
  }),
) as Record<RadioCardSize, string>

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
  ...Object.values(radioCardSizeVariants),
  ...Object.values(radioCardIndicatorSizeVariants),
  ...Object.values(radioCardIndicatorColorVariants),
  ...Object.values(radioCardRootColorVariants),
]
