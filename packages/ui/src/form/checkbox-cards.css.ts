import { styleVariants } from '@vanilla-extract/css'
import { getControlSizeValues } from '@/elements/control-size'
import { checkboxCardsSizeVar } from '@/theme/runtime/component-vars'
import { type FormSize, formSizes } from './form-size'

export type CheckboxCardSize = FormSize

// Card-specific tokens (padding, checkbox size, gap) — not from control-size
const cardTokens: Record<FormSize, { padding: string; cbSize: string; gap: string }> = {
  xs: { padding: '0.75rem', cbSize: '0.875rem', gap: '0.5rem' },
  sm: { padding: '0.75rem', cbSize: '1rem', gap: '0.5rem' },
  md: { padding: '1rem', cbSize: '1.25rem', gap: '0.75rem' },
  lg: { padding: '1.25rem', cbSize: '1.5rem', gap: '0.75rem' },
  // xl: { padding: '1.5rem', cbSize: '1.75rem', gap: '1rem' },
}

export const checkboxCardSizeVariants: Record<CheckboxCardSize, string> = styleVariants(
  Object.fromEntries(
    formSizes.map(size => {
      const ct = cardTokens[size]
      const st = getControlSizeValues(size)
      return [
        size,
        {
          vars: {
            '--cbc-padding': checkboxCardsSizeVar(size, 'padding', ct.padding),
            '--cbc-cb-size': checkboxCardsSizeVar(size, 'boxSize', ct.cbSize),
            '--cbc-icon-size': checkboxCardsSizeVar(size, 'iconSize', st.iconSize),
            '--cbc-font-size': checkboxCardsSizeVar(size, 'fontSize', st.fontSize),
            '--cbc-gap': checkboxCardsSizeVar(size, 'gap', ct.gap),
          },
        },
      ]
    }),
  ),
)
