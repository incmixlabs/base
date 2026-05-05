import type { PropDef } from '@/theme/props/prop-def'
import { sizesXsTo2x } from '@/theme/props/scales'

const sizes = sizesXsTo2x

export const treeViewRootPropDefs = {
  size: { type: 'enum', values: sizes, default: 'md' },
  expandAll: { type: 'boolean', default: false },
} satisfies {
  size: PropDef<(typeof sizes)[number]>
  expandAll: PropDef<boolean>
}
