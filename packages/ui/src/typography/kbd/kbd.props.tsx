import { asChildPropDef } from '@/theme/props/as-child.prop'

import type { PropDef } from '@/theme/props/prop-def'
import { createTypographySizePropDef, type typographySizeValues } from '@/theme/props/typography-size.prop'

const variants = ['classic', 'soft'] as const

const kbdPropDefs = {
  ...asChildPropDef,
  size: createTypographySizePropDef(),
  variant: {
    type: 'enum',
    values: variants,
    default: 'classic',
  },
} satisfies {
  size: PropDef<(typeof typographySizeValues)[number]>
  variant: PropDef<(typeof variants)[number]>
}

export { kbdPropDefs }
