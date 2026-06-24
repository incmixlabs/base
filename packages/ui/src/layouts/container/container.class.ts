import { type ContainerBreakpoint, containerBreakpointKeys } from '@/theme/tokens'
import type { ContainerAlign, ContainerDisplay, ContainerSize } from './container.props'

export const containerBase = '[container-type:inline-size]'
export const containerInnerMaxWidth = 'af-container-inner-max-width'

export const containerSizeMaxWidth = {
  '1': '28rem',
  '2': '43rem',
  '3': '55rem',
  '4': '71rem',
} as const satisfies Record<ContainerSize, string>

export const containerBySize = {
  '1': 'af-container-size-1',
  '2': 'af-container-size-2',
  '3': 'af-container-size-3',
  '4': 'af-container-size-4',
} as const satisfies Record<ContainerSize, string>

const breakpointKeys = containerBreakpointKeys

export const containerDisplayResponsive = Object.fromEntries(
  breakpointKeys.map(bp => [
    bp,
    {
      none: `af-container-${bp}-display-none`,
      initial: `af-container-${bp}-display-initial`,
    },
  ]),
) as Record<ContainerBreakpoint, Record<ContainerDisplay, string>>

export const containerAlignResponsive = Object.fromEntries(
  breakpointKeys.map(bp => [
    bp,
    {
      left: `af-container-${bp}-align-left`,
      center: `af-container-${bp}-align-center`,
      right: `af-container-${bp}-align-right`,
    },
  ]),
) as Record<ContainerBreakpoint, Record<ContainerAlign, string>>

export const containerSizeResponsive = Object.fromEntries(
  breakpointKeys.map(bp => [
    bp,
    {
      '1': `af-container-${bp}-size-1`,
      '2': `af-container-${bp}-size-2`,
      '3': `af-container-${bp}-size-3`,
      '4': `af-container-${bp}-size-4`,
    },
  ]),
) as Record<ContainerBreakpoint, Record<ContainerSize, string>>
