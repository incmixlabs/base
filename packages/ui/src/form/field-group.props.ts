import { gridPropDefs } from '../layouts/grid/grid.props'
import type { PropDef } from '../theme/props/prop-def'
import { sizesSmTo2x } from '../theme/props/scales'
import type { AlignItems, FieldGroupLayout, Spacing, TextFieldVariant } from '../theme/tokens'

const fieldGroupSizes = sizesSmTo2x
const fieldGroupVariants = [
  'soft',
  'surface',
  'outline',
  'ghost',
  'floating-filled',
  'floating-standard',
  'floating-outlined',
] as const satisfies readonly TextFieldVariant[]
const fieldGroupGaps = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'] as const satisfies readonly Spacing[]
const fieldGroupLayouts = [
  'stacked',
  'inline',
  'grid',
  'side-labels',
  'sectioned',
] as const satisfies readonly FieldGroupLayout[]
const fieldGroupAlignments = ['start', 'center', 'end', 'baseline', 'stretch'] as const satisfies readonly AlignItems[]

const fieldGroupPropDefs = {
  size: { type: 'enum', values: fieldGroupSizes, default: 'md' },
  variant: { type: 'enum', values: fieldGroupVariants, default: 'outline' },
  gap: { type: 'enum', values: fieldGroupGaps, default: '4' },
  layout: { type: 'enum', values: fieldGroupLayouts, default: 'stacked' },
  columns: { ...gridPropDefs.columns, default: '2' },
  align: { type: 'enum', values: fieldGroupAlignments, default: 'end' },
  disabled: { type: 'boolean', default: false },
} satisfies {
  size: PropDef<(typeof fieldGroupSizes)[number]>
  variant: PropDef<(typeof fieldGroupVariants)[number]>
  gap: PropDef<Spacing>
  layout: PropDef<FieldGroupLayout>
  columns: PropDef<(typeof gridPropDefs.columns.values)[number]>
  align: PropDef<AlignItems>
  disabled: PropDef<boolean>
}

export {
  fieldGroupAlignments,
  fieldGroupGaps,
  fieldGroupLayouts,
  fieldGroupPropDefs,
  fieldGroupSizes,
  fieldGroupVariants,
}
