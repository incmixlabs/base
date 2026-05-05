import { asChildPropDef } from '@/theme/props/as-child.prop'
import { colorPropDef } from '@/theme/props/color.prop'
import { highContrastPropDef } from '@/theme/props/high-contrast.prop'
import type { PropDef } from '@/theme/props/prop-def'
import { textWrapPropDef } from '@/theme/props/text-wrap.prop'
import { truncatePropDef } from '@/theme/props/truncate.prop'
import { createTypographySizePropDef, type typographySizeValues } from '@/theme/props/typography-size.prop'
import { weightPropDef } from '@/theme/props/weight.prop'

const variants = ['solid', 'soft', 'outline', 'ghost'] as const

const codePropDefs = {
  ...asChildPropDef,
  size: createTypographySizePropDef(),
  variant: { type: 'enum', values: variants, default: 'soft' },
  ...weightPropDef,
  ...colorPropDef,
  ...highContrastPropDef,
  ...truncatePropDef,
  ...textWrapPropDef,
} satisfies {
  size: PropDef<(typeof typographySizeValues)[number]>
  variant: PropDef<(typeof variants)[number]>
}

export { codePropDefs }
