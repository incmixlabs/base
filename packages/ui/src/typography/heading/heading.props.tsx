import { asChildPropDef } from '@/theme/props/as-child.prop'
import { colorPropDef } from '@/theme/props/color.prop'
import { highContrastPropDef } from '@/theme/props/high-contrast.prop'
import { leadingTrimPropDef } from '@/theme/props/leading-trim.prop'
import type { PropDef } from '@/theme/props/prop-def'
import { textAlignPropDef } from '@/theme/props/text-align.prop'
import { textWrapPropDef } from '@/theme/props/text-wrap.prop'
import { truncatePropDef } from '@/theme/props/truncate.prop'
import { createTypographySizePropDef, type typographySizeValues } from '@/theme/props/typography-size.prop'
import { weightPropDef } from '@/theme/props/weight.prop'

const as = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const
const variants = ['solid', 'soft', 'muted'] as const

const headingPropDefs = {
  as: { type: 'enum', values: as, default: 'h1' },
  ...asChildPropDef,
  size: createTypographySizePropDef('2x'),
  ...weightPropDef,
  variant: {
    type: 'enum',
    values: variants,
    default: 'solid',
  },
  ...textAlignPropDef,
  ...leadingTrimPropDef,
  ...truncatePropDef,
  ...textWrapPropDef,
  ...colorPropDef,
  ...highContrastPropDef,
} satisfies {
  as: PropDef<(typeof as)[number]>
  size: PropDef<(typeof typographySizeValues)[number]>
  variant: PropDef<(typeof variants)[number]>
}

export { headingPropDefs }
