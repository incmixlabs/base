import type { GetPropDefTypes } from '@/theme/props/prop-def'
import { popoverContentPropDefs } from '../popover/popover.props'

const tooltipProviderPropDefs = {
  delayDuration: { type: 'number', default: 400 },
  closeDelay: { type: 'number', default: 0 },
} as const

const tooltipContentPropDefs = {
  variant: { ...popoverContentPropDefs.variant, default: 'solid' },
  color: { ...popoverContentPropDefs.color, default: 'inverse' },
  highContrast: { ...popoverContentPropDefs.highContrast, default: false },
  radius: popoverContentPropDefs.radius,
  size: { ...popoverContentPropDefs.size, default: 'sm' },
  maxWidthToken: { ...popoverContentPropDefs.maxWidthToken, default: 'sm' },
  width: popoverContentPropDefs.width,
  minWidth: popoverContentPropDefs.minWidth,
  maxWidth: popoverContentPropDefs.maxWidth,
} as const

type TooltipOwnProps = GetPropDefTypes<typeof tooltipContentPropDefs>

export { tooltipContentPropDefs, tooltipProviderPropDefs }
export type { TooltipOwnProps }
