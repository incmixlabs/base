import { asChildPropDef } from '@/theme/props/as-child.prop'
import { surfaceColorPropDef, surfaceTonePropDef } from '@/theme/props/color.prop'
import { highContrastPropDef } from '@/theme/props/high-contrast.prop'
import { hoverPropDefTrue } from '@/theme/props/hover.prop'
import type { PropDef } from '@/theme/props/prop-def'
import { radiusPropDef } from '@/theme/props/radius.prop'

const surfaceVariants = ['classic', 'solid', 'soft', 'surface', 'outline', 'ghost'] as const
const surfaceShapes = ['rect', 'square', 'ellipse', 'circle', 'hexagon', 'pill'] as const

const surfacePropDefs = {
  ...asChildPropDef,
  variant: { type: 'enum', values: surfaceVariants, default: 'surface' },
  ...surfaceTonePropDef,
  ...surfaceColorPropDef,
  ...highContrastPropDef,
  ...hoverPropDefTrue,
  ...radiusPropDef,
  shape: {
    type: 'enum',
    values: surfaceShapes,
    default: 'rect',
  },
  square: {
    type: 'boolean',
    default: false,
  },
} satisfies {
  variant: PropDef<(typeof surfaceVariants)[number]>
  hover: PropDef<boolean>
  shape: PropDef<(typeof surfaceShapes)[number]>
  square: PropDef<boolean>
}

type SurfaceVariant = (typeof surfaceVariants)[number]
type SurfaceShape = (typeof surfaceShapes)[number]

export type { SurfaceShape, SurfaceVariant }
export { surfacePropDefs, surfaceShapes, surfaceVariants }
