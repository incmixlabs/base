import { gridPropDefs } from '@/layouts/grid/grid.props'
import { asChildPropDef } from '@/theme/props/as-child.prop'
import { colorPropDef } from '@/theme/props/color.prop'
import { highContrastPropDef } from '@/theme/props/high-contrast.prop'
import type { PropDef } from '@/theme/props/prop-def'
import { formSizes } from './form-size'

const checkboxCardsSizes = formSizes
const checkboxCardsVariants = ['surface', 'outline'] as const

const checkboxCardsRootPropDefs = {
  ...asChildPropDef,
  size: { type: 'enum', values: checkboxCardsSizes, default: 'sm', responsive: true },
  variant: { type: 'enum', values: checkboxCardsVariants, default: 'surface' },
  ...colorPropDef,
  ...highContrastPropDef,
  columns: { ...gridPropDefs.columns, default: 'repeat(auto-fit, minmax(200px, 1fr))' },
  gap: { ...gridPropDefs.gap, default: '4' },
} satisfies {
  size: PropDef<(typeof checkboxCardsSizes)[number]>
  variant: PropDef<(typeof checkboxCardsVariants)[number]>
  columns: PropDef<(typeof gridPropDefs.columns.values)[number]>
  gap: PropDef<(typeof gridPropDefs.gap.values)[number]>
}

export { checkboxCardsRootPropDefs, checkboxCardsSizes, checkboxCardsVariants }
