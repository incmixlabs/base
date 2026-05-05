import { surfaceVariants } from '@/elements/surface/surface.props'
import type { PropDef } from '@/theme/props/prop-def'
import { type controlButtonSizes, createControlButtonPropDefs } from '../control-button-props'

const variants = surfaceVariants

const baseButtonPropDefs = createControlButtonPropDefs({
  variants,
  defaultVariant: 'solid',
  includeAsChild: true,
}) satisfies {
  size: PropDef<(typeof controlButtonSizes)[number]>
  variant: PropDef<(typeof variants)[number]>
  loading: PropDef<boolean>
}

const buttonPropDefs = baseButtonPropDefs
const buttonPropDefsWithInverse = {
  ...buttonPropDefs,
  color: { ...buttonPropDefs.color, default: 'primary' },
  inverse: { type: 'boolean', default: false },
  iconStart: { type: 'string', default: '' },
  iconEnd: { type: 'string', default: '' },
} satisfies typeof buttonPropDefs & {
  color: PropDef<(typeof buttonPropDefs.color.values)[number]>
  inverse: PropDef<boolean>
  iconStart: PropDef<string>
  iconEnd: PropDef<string>
}

export { baseButtonPropDefs, buttonPropDefsWithInverse as buttonPropDefs }
