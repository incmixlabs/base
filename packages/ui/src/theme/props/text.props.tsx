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

const as = ['span', 'div', 'label', 'p'] as const

const textPropDefs = {
  as: { type: 'enum', values: as, default: 'span' },
  ...asChildPropDef,
  size: createTypographySizePropDef(),
  ...weightPropDef,
  ...textAlignPropDef,
  ...leadingTrimPropDef,
  ...truncatePropDef,
  ...textWrapPropDef,
  ...colorPropDef,
  ...highContrastPropDef,
} satisfies {
  as: PropDef<(typeof as)[number]>
  size: PropDef<(typeof typographySizeValues)[number]>
}

export { textPropDefs }
