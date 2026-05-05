import { colorPropDef } from '@/theme/props/color.prop'
import { highContrastPropDef } from '@/theme/props/high-contrast.prop'
import type { PropDef } from '@/theme/props/prop-def'
import { radiusPropDef } from '@/theme/props/radius.prop'
import { sizesXsToLg, variantsClassicSolidSurfaceSoft } from '@/theme/props/scales'

const sizes = sizesXsToLg
const variants = variantsClassicSolidSurfaceSoft

const sliderPropDefs = {
  size: { type: 'enum', values: sizes, default: 'sm', responsive: true },
  variant: { type: 'enum', values: variants, default: 'surface' },
  ...colorPropDef,
  ...highContrastPropDef,
  ...radiusPropDef,
} satisfies {
  size: PropDef<(typeof sizes)[number]>
  variant: PropDef<(typeof variants)[number]>
}

export { sliderPropDefs }
