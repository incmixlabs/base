import { asChildPropDef } from '@/theme/props/as-child.prop'
import { colorPropDef } from '@/theme/props/color.prop'
import { highContrastPropDef } from '@/theme/props/high-contrast.prop'
import { leadingTrimPropDef } from '@/theme/props/leading-trim.prop'
import type { PropDef } from '@/theme/props/prop-def'
import { textWrapPropDef } from '@/theme/props/text-wrap.prop'
import { truncatePropDef } from '@/theme/props/truncate.prop'
import { createTypographySizePropDef, type typographySizeValues } from '@/theme/props/typography-size.prop'
import { weightPropDef } from '@/theme/props/weight.prop'

const underline = ['auto', 'always', 'hover', 'none'] as const

const linkPropDefs = {
  ...asChildPropDef,
  size: createTypographySizePropDef(),
  ...weightPropDef,
  ...leadingTrimPropDef,
  ...truncatePropDef,
  ...textWrapPropDef,
  underline: { type: 'enum', values: underline, default: 'auto' },
  ...colorPropDef,
  ...highContrastPropDef,
} satisfies {
  size: PropDef<(typeof typographySizeValues)[number]>
  underline: PropDef<(typeof underline)[number]>
}

export { linkPropDefs }
