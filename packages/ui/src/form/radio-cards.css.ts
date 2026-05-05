import { styleVariants } from '@vanilla-extract/css'
import { getControlSizeValues } from '@/elements/control-size'
import { radioCardsSizeVar } from '@/theme/runtime/component-vars'
import { type FormSize, formSizes } from './form-size'

export type RadioCardSize = FormSize

// Card-specific tokens (padding, gap, indicator) — not from control-size
const cardTokens: Record<FormSize, { padding: string; gap: string; indicatorSize: string }> = {
  xs: { padding: '0.5rem', gap: '0.5rem', indicatorSize: '0.75rem' },
  sm: { padding: '0.75rem', gap: '0.75rem', indicatorSize: '1rem' },
  md: { padding: '1rem', gap: '1rem', indicatorSize: '1.25rem' },
  lg: { padding: '1.25rem', gap: '1.25rem', indicatorSize: '1.5rem' },
  //xl: { padding: '1.5rem', gap: '1.5rem', indicatorSize: '1.75rem' },
}

export const radioCardSizeVariants: Record<RadioCardSize, string> = styleVariants(
  Object.fromEntries(
    formSizes.map(size => {
      const ct = cardTokens[size]
      const st = getControlSizeValues(size)
      return [
        size,
        {
          vars: {
            '--rc-padding': radioCardsSizeVar(size, 'padding', ct.padding),
            '--rc-gap': radioCardsSizeVar(size, 'gap', ct.gap),
            '--rc-indicator-size': radioCardsSizeVar(size, 'indicatorSize', ct.indicatorSize),
            '--rc-indicator-inner': radioCardsSizeVar(size, 'indicatorInnerSize', `calc(${ct.indicatorSize} * 0.5)`),
            '--rc-font-size': radioCardsSizeVar(size, 'fontSize', st.fontSize),
          },
        },
      ]
    }),
  ),
)
