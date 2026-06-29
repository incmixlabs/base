import type { FormSize } from './form-size'

type RadioCheckboxCardComponent = 'checkbox-cards' | 'radio-cards'

export type RadioCheckboxCardSize = FormSize

const radioCheckboxCardSizes = ['xs', 'sm', 'md', 'lg'] as const satisfies readonly FormSize[]

const radioCheckboxCardTokens: Record<FormSize, { padding: string; gap: string; textSize: string }> = {
  xs: { padding: '0.75rem', gap: '0.5rem', textSize: 'text-xs' },
  sm: { padding: '0.75rem', gap: '0.5rem', textSize: 'text-sm' },
  md: { padding: '1rem', gap: '0.75rem', textSize: 'text-base' },
  lg: { padding: '1.25rem', gap: '0.75rem', textSize: 'text-lg' },
}

const joinClass = (...parts: string[]) => parts.join('')

const componentSizeVar = (component: RadioCheckboxCardComponent, size: string, slot: string, fallback: string) =>
  joinClass('var(--component-', component, '-size-', size, '-', slot, ',', fallback, ')')

export const radioCheckboxCardPaddingClass = 'p-[var(--af-radio-checkbox-card-padding)]'
export const radioCheckboxCardGapClass = 'gap-[var(--af-radio-checkbox-card-gap)]'

export function createRadioCheckboxCardSizeVariants(component: RadioCheckboxCardComponent) {
  return Object.fromEntries(
    radioCheckboxCardSizes.map(size => {
      const token = radioCheckboxCardTokens[size]

      return [
        size,
        [
          joinClass(
            '[--af-radio-checkbox-card-padding:',
            componentSizeVar(component, size, 'padding', token.padding),
            ']',
          ),
          joinClass('[--af-radio-checkbox-card-gap:', componentSizeVar(component, size, 'gap', token.gap), ']'),
          token.textSize,
        ].join(' '),
      ]
    }),
  ) as Record<FormSize, string>
}

export const radioCheckboxCardClassNames = [
  radioCheckboxCardPaddingClass,
  radioCheckboxCardGapClass,
  ...Object.values(createRadioCheckboxCardSizeVariants('checkbox-cards')),
  ...Object.values(createRadioCheckboxCardSizeVariants('radio-cards')),
]
