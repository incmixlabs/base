import type { PropDef } from '@/theme/props/prop-def'
import { sizesXsTo2x } from '@/theme/props/scales'

const sizes = sizesXsTo2x
const triggerIconPositions = ['left', 'right'] as const

export const accordionRootPropDefs = {
  size: { type: 'enum', values: sizes, default: 'md' },
  border: { type: 'boolean', default: true },
  triggerPadding: { type: 'boolean', default: true },
  contentPadding: { type: 'boolean', default: true },
  multiple: { type: 'boolean', default: false },
  triggerIconPosition: { type: 'enum', values: triggerIconPositions, default: 'right' },
} satisfies {
  size: PropDef<(typeof sizes)[number]>
  border: PropDef<boolean>
  triggerPadding: PropDef<boolean>
  contentPadding: PropDef<boolean>
  multiple: PropDef<boolean>
  triggerIconPosition: PropDef<(typeof triggerIconPositions)[number]>
}
