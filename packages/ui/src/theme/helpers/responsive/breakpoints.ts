import { type Breakpoint, breakpoints as tokenBreakpoints } from '@/theme/tokens'

function toPx(value: string): number {
  const parsed = Number.parseInt(value, 10)
  if (!Number.isFinite(parsed)) {
    throw new Error(`Invalid breakpoint value: ${value}`)
  }
  return parsed
}

export const breakpointMedia = {
  up: (breakpoint: Breakpoint) => `screen and (min-width: ${tokenBreakpoints[breakpoint]})`,
  down: (breakpoint: Breakpoint) => `screen and (max-width: ${toPx(tokenBreakpoints[breakpoint]) - 1}px)`,
} as const

export const responsiveBreakpointsArray = ['initial', ...Object.keys(tokenBreakpoints)] as const
export type ResponsiveBreakpoint = (typeof responsiveBreakpointsArray)[number]
export const responsiveBreakpointSet: ReadonlySet<ResponsiveBreakpoint> = new Set(responsiveBreakpointsArray)
