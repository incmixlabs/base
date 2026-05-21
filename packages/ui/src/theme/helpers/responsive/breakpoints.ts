import {
  type Breakpoint,
  type ContainerBreakpoint,
  type TypographyBreakpoint,
  breakpoints as tokenBreakpoints,
  containerBreakpoints as tokenContainerBreakpoints,
  typographyBreakpoints as tokenTypographyBreakpoints,
} from '@/theme/tokens'

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
  between: (min: Breakpoint, max: Breakpoint) =>
    `screen and (min-width: ${tokenBreakpoints[min]}) and (max-width: ${toPx(tokenBreakpoints[max]) - 1}px)`,
} as const

export const containerBreakpointQuery = {
  up: (breakpoint: ContainerBreakpoint) => `(min-width: ${tokenContainerBreakpoints[breakpoint]})`,
  down: (breakpoint: ContainerBreakpoint) => `(max-width: ${toPx(tokenContainerBreakpoints[breakpoint]) - 1}px)`,
  between: (min: ContainerBreakpoint, max: ContainerBreakpoint) =>
    `(min-width: ${tokenContainerBreakpoints[min]}) and (max-width: ${toPx(tokenContainerBreakpoints[max]) - 1}px)`,
} as const

export const typographyBreakpointQuery = {
  up: (breakpoint: TypographyBreakpoint) => `(min-width: ${tokenTypographyBreakpoints[breakpoint]})`,
  down: (breakpoint: TypographyBreakpoint) => `(max-width: ${toPx(tokenTypographyBreakpoints[breakpoint]) - 1}px)`,
  between: (min: TypographyBreakpoint, max: TypographyBreakpoint) =>
    `(min-width: ${tokenTypographyBreakpoints[min]}) and (max-width: ${toPx(tokenTypographyBreakpoints[max]) - 1}px)`,
} as const

export const responsiveBreakpointsArray = ['initial', ...Object.keys(tokenBreakpoints)] as const
export type ResponsiveBreakpoint = (typeof responsiveBreakpointsArray)[number]
export const responsiveBreakpointSet: ReadonlySet<ResponsiveBreakpoint> = new Set(responsiveBreakpointsArray)
