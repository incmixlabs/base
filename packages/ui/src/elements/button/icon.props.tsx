import type { PropDef } from '@/theme/props/prop-def'
import { iconButtonPropDefs } from './icon-button.props'

const iconPropDefs = {
  size: iconButtonPropDefs.size,
  color: {
    type: 'enum | string',
    values: iconButtonPropDefs.color.values,
    default: 'primary',
  },
  title: {
    type: 'string',
  },
  icon: {
    type: 'string',
  },
} satisfies {
  size: typeof iconButtonPropDefs.size
  color: PropDef<string>
  title: PropDef<string>
  icon: PropDef<string>
}

export { iconPropDefs }
