import { asChildPropDef } from '@/theme/props/as-child.prop'
import { hoverPropDefFalse } from '@/theme/props/hover.prop'
import type { PropDef } from '@/theme/props/prop-def'
import { sizesXsToMd, variantsSolidSoftSurfaceOutline } from '@/theme/props/scales'
import { buttonPropDefs } from '../button/button.props'

const sizes = sizesXsToMd
const variants = variantsSolidSoftSurfaceOutline

const badgePropDefs = {
  ...asChildPropDef,
  size: { type: 'enum', values: sizes, default: 'xs', responsive: true },
  variant: { type: 'enum', values: variants, default: 'soft' },
  ...hoverPropDefFalse,
  color: { ...buttonPropDefs.color, default: 'slate' },
  highContrast: buttonPropDefs.highContrast,
  radius: buttonPropDefs.radius,
  icon: { type: 'string', required: false },
} satisfies {
  size: PropDef<(typeof sizes)[number]>
  variant: PropDef<(typeof variants)[number]>
  hover: PropDef<boolean>
  color: PropDef<(typeof buttonPropDefs.color.values)[number]>
  highContrast: typeof buttonPropDefs.highContrast
  radius: typeof buttonPropDefs.radius
  icon: PropDef<string>
}

type BadgeVariant = (typeof variants)[number]

export { badgePropDefs }
export type { BadgeVariant }
