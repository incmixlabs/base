import { type ContainerBreakpoint, containerBreakpointKeys } from '../../theme/tokens'
import type { ContainerAlign, ContainerDisplay, ContainerSize } from './container.props'

export const containerBase = '[container-type:inline-size]'

export const containerSizeMaxWidth = {
  '1': '28rem',
  '2': '43rem',
  '3': '55rem',
  '4': '71rem',
} as const satisfies Record<ContainerSize, string>

export const containerBySize = {
  '1': `max-w-[${containerSizeMaxWidth['1']}]`,
  '2': `max-w-[${containerSizeMaxWidth['2']}]`,
  '3': `max-w-[${containerSizeMaxWidth['3']}]`,
  '4': `max-w-[${containerSizeMaxWidth['4']}]`,
} as const satisfies Record<ContainerSize, string>

const breakpointKeys = containerBreakpointKeys

export const containerDisplayResponsive = Object.fromEntries(
  breakpointKeys.map(bp => [
    bp,
    {
      none: `cq-${bp}:hidden`,
      initial: `cq-${bp}:flex`,
    },
  ]),
) as Record<ContainerBreakpoint, Record<ContainerDisplay, string>>

export const containerAlignResponsive = Object.fromEntries(
  breakpointKeys.map(bp => [
    bp,
    {
      left: `cq-${bp}:items-start`,
      center: `cq-${bp}:items-center`,
      right: `cq-${bp}:items-end`,
    },
  ]),
) as Record<ContainerBreakpoint, Record<ContainerAlign, string>>

export const containerSizeResponsive = Object.fromEntries(
  breakpointKeys.map(bp => [
    bp,
    {
      '1': `cq-${bp}:${containerBySize['1']}`,
      '2': `cq-${bp}:${containerBySize['2']}`,
      '3': `cq-${bp}:${containerBySize['3']}`,
      '4': `cq-${bp}:${containerBySize['4']}`,
    },
  ]),
) as Record<ContainerBreakpoint, Record<ContainerSize, string>>
