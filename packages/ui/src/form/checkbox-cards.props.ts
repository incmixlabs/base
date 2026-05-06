import { asChildPropDef } from '@/theme/props/as-child.prop'
import { colorPropDef } from '@/theme/props/color.prop'
import { highContrastPropDef } from '@/theme/props/high-contrast.prop'
import type { PropDef } from '@/theme/props/prop-def'
import { formSizes } from './form-size'

const checkboxCardsSizes = formSizes
const checkboxCardsVariants = ['surface', 'outline'] as const
const checkboxCardsColumnValues = ['1', '2', '3', '4', 'auto'] as const
const checkboxCardsGapValues = ['1', '2', '3', '4', '5', '6'] as const

const checkboxCardsRootPropDefs = {
  ...asChildPropDef,
  size: { type: 'enum', values: checkboxCardsSizes, default: 'sm', responsive: true },
  variant: { type: 'enum', values: checkboxCardsVariants, default: 'surface' },
  ...colorPropDef,
  ...highContrastPropDef,
  columns: { type: 'enum', values: checkboxCardsColumnValues, default: 'auto' },
  gap: { type: 'enum', values: checkboxCardsGapValues, default: '4' },
} satisfies {
  size: PropDef<(typeof checkboxCardsSizes)[number]>
  variant: PropDef<(typeof checkboxCardsVariants)[number]>
  columns: PropDef<(typeof checkboxCardsColumnValues)[number]>
  gap: PropDef<(typeof checkboxCardsGapValues)[number]>
}

export {
  checkboxCardsColumnValues,
  checkboxCardsGapValues,
  checkboxCardsRootPropDefs,
  checkboxCardsSizes,
  checkboxCardsVariants,
}
