import { style, styleVariants } from '@vanilla-extract/css'
import { checkboxGroupVar } from '@/theme/runtime/component-vars'
import { type FormSize, formSizes } from './form-size'

export const checkboxGroupRootBase = style({
  display: 'flex',
})

export const checkboxGroupRootOrientation = styleVariants({
  vertical: {
    flexDirection: 'column',
    gap: checkboxGroupVar('gap', '0.5rem'),
  },
  horizontal: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: checkboxGroupVar('inlineGap', '1rem'),
  },
})

export const checkboxGroupItemBase = style({
  display: 'flex',
  alignItems: 'flex-start',
})

export const checkboxGroupItemGap = styleVariants(
  Object.fromEntries(
    formSizes.map(size => [
      size,
      {
        gap: checkboxGroupVar('itemGap', '0.5rem'),
      },
    ]),
  ) as Record<FormSize, { gap: string }>,
)
