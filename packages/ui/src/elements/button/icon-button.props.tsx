import type { PropDef } from '@/theme/props/prop-def'
import { variantsSolidSoftOutlineGhost } from '@/theme/props/scales'
import { buttonPropDefs } from './button.props'

const variants = variantsSolidSoftOutlineGhost

const iconButtonPropDefs = {
  size: buttonPropDefs.size,
  variant: { type: 'enum', values: variants, default: 'soft' },
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
  color: typeof buttonPropDefs.color
  highContrast: typeof buttonPropDefs.highContrast
  radius: typeof buttonPropDefs.radius
  loading: typeof buttonPropDefs.loading
  title: PropDef<string>
  icon: PropDef<string>
  fill: PropDef<boolean>
}

export { iconButtonPropDefs }
