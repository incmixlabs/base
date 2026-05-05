import type { PropDef } from '@/theme/props/prop-def'
import { sizesXsToLg } from '@/theme/props/scales'

const timelineOrientations = ['horizontal', 'vertical'] as const
const timelineSizes = sizesXsToLg

const timelinePropDefs = {
  orientation: { type: 'enum', values: timelineOrientations, default: 'vertical' },
  size: { type: 'enum', values: timelineSizes, default: 'md', responsive: true },
} satisfies {
  orientation: PropDef<(typeof timelineOrientations)[number]>
  size: PropDef<(typeof timelineSizes)[number]>
}

export { timelineOrientations, timelinePropDefs, timelineSizes }
