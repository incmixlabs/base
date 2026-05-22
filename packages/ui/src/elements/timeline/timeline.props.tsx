import { colorPropDef } from '@/theme/props/color.prop'
import type { PropDef } from '@/theme/props/prop-def'
import { sizesXsToLg } from '@/theme/props/scales'

const timelineOrientations = ['horizontal', 'vertical'] as const
const timelineSizes = sizesXsToLg
const timelineVariants = ['solid', 'outline'] as const
type TimelineColor = (typeof colorPropDef.color.values)[number]

const timelinePropDefs = {
  color: { ...colorPropDef.color, default: 'primary' as TimelineColor },
  orientation: { type: 'enum', values: timelineOrientations, default: 'vertical' },
  size: { type: 'enum', values: timelineSizes, default: 'md', responsive: true },
  variant: { type: 'enum', values: timelineVariants, default: 'solid' },
} satisfies {
  color: PropDef<TimelineColor>
  orientation: PropDef<(typeof timelineOrientations)[number]>
  size: PropDef<(typeof timelineSizes)[number]>
  variant: PropDef<(typeof timelineVariants)[number]>
}

export { timelineOrientations, timelinePropDefs, timelineSizes, timelineVariants }
