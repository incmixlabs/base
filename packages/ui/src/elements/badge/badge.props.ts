import { hoverPropDefFalse } from '@/theme/props/hover.prop'
import type { PropDef } from '@/theme/props/prop-def'
import { buttonPropDefs } from '../button/button.props'

type ButtonSize = (typeof buttonPropDefs.size.values)[number]
type ButtonVariant = (typeof buttonPropDefs.variant.values)[number]
type BadgeSize = Extract<ButtonSize, 'xs' | 'sm' | 'md'>
type BadgeVariant = Extract<ButtonVariant, 'solid' | 'soft' | 'surface' | 'outline'>

const sizes = buttonPropDefs.size.values.filter(
  (size): size is BadgeSize => size === 'xs' || size === 'sm' || size === 'md',
)
const variants = buttonPropDefs.variant.values.filter(
  (variant): variant is BadgeVariant =>
    variant === 'solid' || variant === 'soft' || variant === 'surface' || variant === 'outline',
)

const badgePropDefs = {
  asChild: buttonPropDefs.asChild,
  size: { ...buttonPropDefs.size, values: sizes, default: 'xs' },
  variant: { ...buttonPropDefs.variant, values: variants, default: 'soft' },
  ...hoverPropDefFalse,
  color: { ...buttonPropDefs.color, default: 'slate' },
  highContrast: buttonPropDefs.highContrast,
  radius: { ...buttonPropDefs.radius, default: 'full' },
  icon: { type: 'string', required: false },
} satisfies {
  asChild: typeof buttonPropDefs.asChild
  size: PropDef<(typeof sizes)[number]>
  variant: PropDef<(typeof variants)[number]>
  hover: PropDef<boolean>
  color: PropDef<(typeof buttonPropDefs.color.values)[number]>
  highContrast: typeof buttonPropDefs.highContrast
  radius: PropDef<(typeof buttonPropDefs.radius.values)[number]>
  icon: PropDef<string>
}

export type { BadgeVariant }
export { badgePropDefs }
