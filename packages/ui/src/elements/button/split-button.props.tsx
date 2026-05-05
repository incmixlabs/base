import { surfaceVariants } from '@/elements/surface/surface.props'
import type { PropDef } from '@/theme/props/prop-def'
import { buttonPropDefs } from './button.props'

const splitButtonPropDefs = {
  size: buttonPropDefs.size,
  variant: { type: 'enum', values: surfaceVariants, default: 'soft' },
  color: { ...buttonPropDefs.color, default: 'primary' },
  highContrast: buttonPropDefs.highContrast,
  radius: buttonPropDefs.radius,
  loading: buttonPropDefs.loading,
  inverse: { type: 'boolean', default: false },
  iconStart: { type: 'string', default: '' },
  iconEnd: { type: 'string', default: '' },
  menuSize: {
    type: 'enum',
    values: ['sm', 'md', 'lg', 'xl'] as const,
    default: 'md',
  },
  menuAlign: {
    type: 'enum',
    values: ['start', 'center', 'end'] as const,
    default: 'end',
  },
} satisfies {
  size: typeof buttonPropDefs.size
  variant: PropDef<(typeof surfaceVariants)[number]>
  color: typeof buttonPropDefs.color
  highContrast: typeof buttonPropDefs.highContrast
  radius: typeof buttonPropDefs.radius
  loading: typeof buttonPropDefs.loading
  inverse: PropDef<boolean>
  iconStart: PropDef<string>
  iconEnd: PropDef<string>
  menuSize: PropDef<'sm' | 'md' | 'lg' | 'xl'>
  menuAlign: PropDef<'start' | 'center' | 'end'>
}

export { splitButtonPropDefs }
