import { colorPropDef } from '@/theme/props/color.prop'
import type { PropDef } from '@/theme/props/prop-def'
import { radiusPropDef } from '@/theme/props/radius.prop'
import { calloutRootPropDefs } from '../callout/callout.props'

const dismissableValues = ['none', 'top', 'center'] as const
const sideValues = ['top', 'bottom'] as const

const toastRootPropDefs = {
  size: calloutRootPropDefs.size,
  variant: calloutRootPropDefs.variant,
  ...colorPropDef,
  highContrast: calloutRootPropDefs.highContrast,
  inverse: calloutRootPropDefs.inverse,
  ...radiusPropDef,
  dismissable: {
    type: 'enum',
    values: dismissableValues,
    default: 'top',
  },
} satisfies {
  size: typeof calloutRootPropDefs.size
  variant: typeof calloutRootPropDefs.variant
  color: typeof colorPropDef.color
  highContrast: typeof calloutRootPropDefs.highContrast
  inverse: typeof calloutRootPropDefs.inverse
  radius: typeof radiusPropDef.radius
  dismissable: PropDef<(typeof dismissableValues)[number]>
}

const toastViewportPropDefs = {
  side: {
    type: 'enum',
    values: sideValues,
    default: 'bottom',
  },
} satisfies {
  side: PropDef<(typeof sideValues)[number]>
}

type ToastDismissable = (typeof dismissableValues)[number]
type ToastViewportSide = (typeof sideValues)[number]

export type { ToastDismissable, ToastViewportSide }
export { dismissableValues, sideValues, toastRootPropDefs, toastViewportPropDefs }
