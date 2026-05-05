import { createVar, style } from '@vanilla-extract/css'
import type { Breakpoint } from '@/theme/tokens'
import { breakpointMedia, type ResponsiveBreakpoint, responsiveBreakpointsArray } from './responsive/breakpoints'

const dimensionBreakpoints: readonly ResponsiveBreakpoint[] = responsiveBreakpointsArray
const cssBreakpoints = dimensionBreakpoints.filter((breakpoint): breakpoint is Breakpoint => breakpoint !== 'initial')

function createBreakpointVars() {
  return Object.fromEntries(dimensionBreakpoints.map(breakpoint => [breakpoint, createVar()])) as Record<
    ResponsiveBreakpoint,
    string
  >
}

function createResponsiveStyle<TProperty extends string>(
  cssProperty: TProperty,
  vars: Record<ResponsiveBreakpoint, string>,
) {
  return style({
    [cssProperty]: vars.initial,
    '@media': Object.fromEntries(
      cssBreakpoints.map(breakpoint => [breakpointMedia.up(breakpoint), { [cssProperty]: vars[breakpoint] }]),
    ),
  })
}

export function createResponsiveDimensionMap<TProperty extends string>(properties: readonly TProperty[]) {
  const vars = Object.fromEntries(properties.map(property => [property, createBreakpointVars()])) as Record<
    TProperty,
    Record<ResponsiveBreakpoint, string>
  >
  const classes = Object.fromEntries(
    properties.map(property => [property, createResponsiveStyle(property, vars[property])]),
  ) as Record<TProperty, string>

  return { vars, classes }
}
