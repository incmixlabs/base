import { gridPropDefs } from '@/layouts/grid/grid.props'
import { asChildPropDef } from '@/theme/props/as-child.prop'
import { colorPropDef } from '@/theme/props/color.prop'
import { highContrastPropDef } from '@/theme/props/high-contrast.prop'
import type { PropDef } from '@/theme/props/prop-def'
import { formSizes } from './form-size'

const radioCardsSizes = formSizes
const radioCardsVariants = ['surface', 'classic'] as const

const radioCardsRootPropDefs = {
  ...asChildPropDef,
  size: { type: 'enum', values: radioCardsSizes, default: 'sm', responsive: true },
  variant: { type: 'enum', values: radioCardsVariants, default: 'surface' },
  ...colorPropDef,
  ...highContrastPropDef,
  columns: { ...gridPropDefs.columns, default: 'repeat(auto-fit, minmax(160px, 1fr))' },
  gap: { ...gridPropDefs.gap, default: '4' },
} satisfies {
  size: PropDef<(typeof radioCardsSizes)[number]>
  variant: PropDef<(typeof radioCardsVariants)[number]>
  columns: PropDef<(typeof gridPropDefs.columns.values)[number]>
  gap: PropDef<(typeof gridPropDefs.gap.values)[number]>
}

export { radioCardsRootPropDefs, radioCardsSizes, radioCardsVariants }
