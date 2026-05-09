import { colorPropDef } from '@/theme/props/color.prop'
import type { PropDef } from '@/theme/props/prop-def'

const dividerOrientations = ['horizontal', 'vertical'] as const
const dividerSizes = ['xs', 'sm', 'md', 'lg'] as const
const dividerAlignments = ['start', 'center', 'end'] as const

const dividerPropDefs = {
  orientation: {
    type: 'enum',
    values: dividerOrientations,
    default: 'horizontal',
  },
  size: { type: 'enum', values: dividerSizes, default: 'sm' },
  align: { type: 'enum', values: dividerAlignments, default: 'center' },
  color: { ...colorPropDef.color, default: undefined },
} satisfies {
  orientation: PropDef<(typeof dividerOrientations)[number]>
  size: PropDef<(typeof dividerSizes)[number]>
  align: PropDef<(typeof dividerAlignments)[number]>
  color: typeof colorPropDef.color
}

export { dividerAlignments, dividerOrientations, dividerPropDefs, dividerSizes }
