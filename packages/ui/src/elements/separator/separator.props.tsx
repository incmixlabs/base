import { colorPropDef } from '@/theme/props/color.prop'

import type { PropDef } from '@/theme/props/prop-def'
import { sizesXsToLg } from '@/theme/props/scales'

const orientationValues = ['horizontal', 'vertical'] as const
const sizes = sizesXsToLg

const separatorPropDefs = {
  orientation: {
    type: 'enum',
    values: orientationValues,
    default: 'horizontal',
    responsive: true,
  },
  size: { type: 'enum', values: sizes, default: 'xs', responsive: true },
  color: { ...colorPropDef.color, default: 'slate' },
  decorative: { type: 'boolean', default: true },
} satisfies {
  orientation: PropDef<(typeof orientationValues)[number]>
  size: PropDef<(typeof sizes)[number]>
  color: typeof colorPropDef.color
  decorative: PropDef<boolean>
}

export { separatorPropDefs }
