import type * as React from 'react'
import { asChildPropDef } from '@/theme/props/as-child.prop'
import { hoverPropDefFalse } from '@/theme/props/hover.prop'
import type { PropDef } from '@/theme/props/prop-def'
import { sizesSmTo2x } from '@/theme/props/scales'
import { buttonPropDefs } from '../button/button.props'

const sizes = sizesSmTo2x
const variants = ['soft', 'surface', 'solid', 'outline', 'split'] as const

const calloutRootPropDefs = {
  ...asChildPropDef,
  size: { type: 'enum', values: sizes, default: 'xl', responsive: true },
  variant: { type: 'enum', values: variants, default: 'surface' },
  ...hoverPropDefFalse,
  color: buttonPropDefs.color,
  highContrast: buttonPropDefs.highContrast,
  inverse: { type: 'boolean', default: false },
  radius: buttonPropDefs.radius,
  icon: { type: 'string', required: false },
  text: { type: 'ReactNode', required: false },
} satisfies {
  size: PropDef<(typeof sizes)[number]>
  variant: PropDef<(typeof variants)[number]>
  hover: PropDef<boolean>
  color: typeof buttonPropDefs.color
  highContrast: typeof buttonPropDefs.highContrast
  inverse: PropDef<boolean>
  radius: typeof buttonPropDefs.radius
  icon: PropDef<string>
  text: PropDef<React.ReactNode>
}

const calloutIconPropDefs = {
  name: { type: 'string', required: false },
} satisfies {
  name: PropDef<string>
}

export { calloutIconPropDefs, calloutRootPropDefs }
