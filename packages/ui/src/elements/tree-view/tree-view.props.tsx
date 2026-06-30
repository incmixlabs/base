import type { PropDef } from '@/theme/props/prop-def'
import { treeViewSizes } from './tree-view.constants'

export const treeViewRootPropDefs = {
  size: { type: 'enum', values: treeViewSizes, default: 'md' },
  expandAll: { type: 'boolean', default: false },
} satisfies {
  size: PropDef<(typeof treeViewSizes)[number]>
  expandAll: PropDef<boolean>
}
