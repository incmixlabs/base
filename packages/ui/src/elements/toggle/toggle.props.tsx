import type { PropDef } from '@/theme/props/prop-def'
import { buttonPropDefs } from '../button/button.props'

const toggleVariants = ['soft', 'solid'] as const

const togglePropDefs = {
  size: buttonPropDefs.size,
  variant: { type: 'enum', values: toggleVariants, default: 'soft' },
  color: buttonPropDefs.color,
  highContrast: buttonPropDefs.highContrast,
  radius: buttonPropDefs.radius,
  flush: { type: 'boolean', className: 'flush', default: true },
  disabled: { type: 'boolean', className: 'disabled', default: false },
} satisfies {
  size: typeof buttonPropDefs.size
  variant: PropDef<(typeof toggleVariants)[number]>
  color: typeof buttonPropDefs.color
  highContrast: typeof buttonPropDefs.highContrast
  radius: typeof buttonPropDefs.radius
  flush: PropDef<boolean>
  disabled: PropDef<boolean>
}

export { togglePropDefs, toggleVariants }
