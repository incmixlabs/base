import { colorPropDef } from '@/theme/props/color.prop'
import { highContrastPropDef } from '@/theme/props/high-contrast.prop'
import { hoverPropDefTrue } from '@/theme/props/hover.prop'
import type { PropDef } from '@/theme/props/prop-def'
import { radiusPropDef } from '@/theme/props/radius.prop'
import { controlButtonSizes } from '../control-button-props'

const sizes = controlButtonSizes
const variants = ['surface', 'underline'] as const

const segmentedControlSharedRootPropDefs = {
  ...hoverPropDefTrue,
  animated: { type: 'boolean', default: false },
  size: { type: 'enum', values: sizes, default: 'md', responsive: true },
  ...colorPropDef,
  ...highContrastPropDef,
} satisfies {
  hover: PropDef<boolean>
  animated: PropDef<boolean>
  size: PropDef<(typeof sizes)[number]>
}

const segmentedControlRootPropDefs = {
  ...segmentedControlSharedRootPropDefs,
  disabled: { type: 'boolean', className: 'disabled', default: false },
  variant: { type: 'enum', values: variants, default: 'surface' },
  ...radiusPropDef,
} satisfies {
  hover: PropDef<boolean>
  animated: PropDef<boolean>
  disabled?: PropDef<boolean>
  size: PropDef<(typeof sizes)[number]>
  variant: PropDef<(typeof variants)[number]>
}

export { segmentedControlRootPropDefs, segmentedControlSharedRootPropDefs }
