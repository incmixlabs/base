import { asChildPropDef } from '@/theme/props/as-child.prop'
import { surfaceColorPropDef, surfaceTonePropDef } from '@/theme/props/color.prop'
import { heightPropDefs } from '@/theme/props/height.props'
import { highContrastPropDef } from '@/theme/props/high-contrast.prop'
import {
  type LayoutCompositionMode,
  layoutCompositionModes,
  layoutCompositionPropDefs,
} from '@/theme/props/layout-composition.props'

import type { PropDef } from '@/theme/props/prop-def'
import { radiusPropDef } from '@/theme/props/radius.prop'
import { widthPropDefs } from '@/theme/props/width.props'
import { surfacePropDefs } from '../surface/surface.props'

const cardSizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const
const cardVariants = ['classic', 'solid', 'soft', 'surface', 'outline', 'ghost'] as const
const cardShapes = surfacePropDefs.shape.values
const cardLayoutModes = layoutCompositionModes

const cardPropDefs = {
  ...asChildPropDef,
  size: { type: 'enum', values: cardSizes, default: 'xs', responsive: true },
  variant: { type: 'enum', values: cardVariants, default: 'surface' },
  ...layoutCompositionPropDefs,
  ...widthPropDefs,
  ...heightPropDefs,
  ...surfaceTonePropDef,
  ...surfaceColorPropDef,
  ...highContrastPropDef,
  ...radiusPropDef,
  shape: {
    ...surfacePropDefs.shape,
    values: cardShapes,
    default: 'rect',
  },
  square: surfacePropDefs.square,
} satisfies {
  size: PropDef<(typeof cardSizes)[number]>
  variant: PropDef<(typeof cardVariants)[number]>
  layout: PropDef<LayoutCompositionMode>
  shape: PropDef<(typeof cardShapes)[number]>
  square: PropDef<boolean>
}

type CardSize = (typeof cardSizes)[number]
type CardVariant = (typeof cardVariants)[number]
type CardLayout = LayoutCompositionMode

export type { CardLayout, CardSize, CardVariant }
export { cardLayoutModes, cardPropDefs, cardSizes, cardVariants }
