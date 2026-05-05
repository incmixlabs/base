import { type Breakpoint, breakpoints as tokenBreakpoints } from './tokens'

export type ThemeBreakpoint = Breakpoint
export type ThemeBreakpoints = Record<ThemeBreakpoint, number>
export type ThemeBreakpointConfig = Partial<Record<ThemeBreakpoint, number | string>>

export const themeBreakpointKeys = Object.keys(tokenBreakpoints) as ThemeBreakpoint[]

function normalizeThemeBreakpointValue(value: number | string | undefined, fallback: number) {
  if (typeof value === 'number') return Number.isFinite(value) ? Math.max(0, Math.round(value)) : fallback
  if (typeof value === 'string') {
    const parsed = Number.parseFloat(value)
    return Number.isFinite(parsed) ? Math.max(0, Math.round(parsed)) : fallback
  }

  return fallback
}

export const DEFAULT_THEME_BREAKPOINTS = themeBreakpointKeys.reduce<ThemeBreakpoints>((resolved, breakpoint) => {
  resolved[breakpoint] = normalizeThemeBreakpointValue(tokenBreakpoints[breakpoint], 0)
  return resolved
}, {} as ThemeBreakpoints)

export function normalizeThemeBreakpoints(breakpoints?: ThemeBreakpointConfig): ThemeBreakpoints {
  return themeBreakpointKeys.reduce<ThemeBreakpoints>((resolved, breakpoint) => {
    resolved[breakpoint] = normalizeThemeBreakpointValue(
      breakpoints?.[breakpoint],
      DEFAULT_THEME_BREAKPOINTS[breakpoint],
    )
    return resolved
  }, {} as ThemeBreakpoints)
}
