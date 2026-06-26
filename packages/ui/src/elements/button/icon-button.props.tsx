import type { PropDef } from '@/theme/props/prop-def'
import { buttonPropDefs } from './button.props'

type ButtonVariant = (typeof buttonPropDefs.variant.values)[number]
type IconButtonVariant = Extract<ButtonVariant, 'solid' | 'soft' | 'outline' | 'ghost'>

const variants = buttonPropDefs.variant.values.filter(
  (variant): variant is IconButtonVariant =>
    variant === 'solid' || variant === 'soft' || variant === 'outline' || variant === 'ghost',
)

const iconButtonPropDefs = {
  size: buttonPropDefs.size,
  variant: { ...buttonPropDefs.variant, values: variants, default: 'soft' },
  color: { ...buttonPropDefs.color, default: 'primary' },
  highContrast: buttonPropDefs.highContrast,
  radius: buttonPropDefs.radius,
  loading: buttonPropDefs.loading,
  title: { type: 'string' },
  icon: { type: 'string', default: '' },
  fill: { type: 'boolean', default: false },
} satisfies {
  size: typeof buttonPropDefs.size
  variant: PropDef<(typeof variants)[number]>
  color: PropDef<(typeof buttonPropDefs.color.values)[number]>
  highContrast: typeof buttonPropDefs.highContrast
  radius: typeof buttonPropDefs.radius
  loading: typeof buttonPropDefs.loading
  title: PropDef<string>
  icon: PropDef<string>
  fill: PropDef<boolean>
}

export { iconButtonPropDefs }
