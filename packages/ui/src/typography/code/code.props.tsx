import { colorPropDef } from '@/theme/props/color.prop'
import { highContrastPropDef } from '@/theme/props/high-contrast.prop'
import type { PropDef } from '@/theme/props/prop-def'
import { createTypographySizePropDef, type typographySizeValues } from '@/theme/props/typography-size.prop'

const variants = ['solid', 'soft', 'outline', 'ghost'] as const

const codePropDefs = {
  size: createTypographySizePropDef(),
  variant: { type: 'enum', values: variants, default: 'soft' },
  ...colorPropDef,
  ...highContrastPropDef,
} satisfies {
  size: PropDef<(typeof typographySizeValues)[number]>
  variant: PropDef<(typeof variants)[number]>
}

export { codePropDefs }
