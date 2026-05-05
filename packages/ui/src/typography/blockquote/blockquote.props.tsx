import { asChildPropDef } from '@/theme/props/as-child.prop'
import { colorPropDef } from '@/theme/props/color.prop'
import { highContrastPropDef } from '@/theme/props/high-contrast.prop'
import type { PropDef } from '@/theme/props/prop-def'
import { textWrapPropDef } from '@/theme/props/text-wrap.prop'
import { truncatePropDef } from '@/theme/props/truncate.prop'
import { createTypographySizePropDef, type typographySizeValues } from '@/theme/props/typography-size.prop'
import { weightPropDef } from '@/theme/props/weight.prop'

const blockquotePropDefs = {
  ...asChildPropDef,
  size: createTypographySizePropDef(),
  ...weightPropDef,
  ...colorPropDef,
  ...highContrastPropDef,
  ...truncatePropDef,
  ...textWrapPropDef,
} satisfies {
  size: PropDef<(typeof typographySizeValues)[number]>
}

export { blockquotePropDefs }
