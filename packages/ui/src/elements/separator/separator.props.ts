import { colorPropDef } from '@/theme/props/color.prop'
import type { PropDef } from '@/theme/props/prop-def'

const separatorOrientations = ['horizontal', 'vertical'] as const
const separatorSizes = ['xs', 'sm', 'md', 'lg'] as const
const separatorAlignments = ['start', 'center', 'end'] as const

const separatorPropDefs = {
  orientation: {
    type: 'enum',
    values: separatorOrientations,
    default: 'horizontal',
  },
  size: { type: 'enum', values: separatorSizes, default: 'sm' },
  align: { type: 'enum', values: separatorAlignments, default: 'center' },
  color: { ...colorPropDef.color, default: undefined },
} satisfies {
  orientation: PropDef<(typeof separatorOrientations)[number]>
  size: PropDef<(typeof separatorSizes)[number]>
  align: PropDef<(typeof separatorAlignments)[number]>
  color: typeof colorPropDef.color
}

export { separatorAlignments, separatorOrientations, separatorPropDefs, separatorSizes }

export type SeparatorAlign = (typeof separatorPropDefs.align.values)[number]
export type SeparatorOrientation = (typeof separatorPropDefs.orientation.values)[number]
export type SeparatorSize = (typeof separatorPropDefs.size.values)[number]
