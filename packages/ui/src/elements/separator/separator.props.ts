import { colorPropDef } from '@/theme/props/color.prop'
import type { PropDef } from '@/theme/props/prop-def'

const separatorSizes = ['xs', 'sm', 'md', 'lg'] as const

const separatorPropDefs = {
  size: { type: 'enum', values: separatorSizes, default: 'xs', responsive: true },
  ...colorPropDef,
} satisfies {
  size: PropDef<(typeof separatorSizes)[number]>
}

export { separatorPropDefs, separatorSizes }
