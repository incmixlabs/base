import { createVar, style } from '@vanilla-extract/css'
import { breakpointMedia } from './responsive/breakpoints'

const gapBreakpoints = ['initial', 'xs', 'sm', 'md', 'lg', 'xl'] as const

type GapBreakpoint = (typeof gapBreakpoints)[number]

function createBreakpointVars() {
  return Object.fromEntries(gapBreakpoints.map(breakpoint => [breakpoint, createVar()])) as Record<
    GapBreakpoint,
    string
  >
}

function createResponsiveStyle(cssProperty: 'gap' | 'columnGap' | 'rowGap', vars: Record<GapBreakpoint, string>) {
  return style({
    [cssProperty]: vars.initial,
    '@media': {
      [breakpointMedia.up('xs')]: { [cssProperty]: vars.xs },
      [breakpointMedia.up('sm')]: { [cssProperty]: vars.sm },
      [breakpointMedia.up('md')]: { [cssProperty]: vars.md },
      [breakpointMedia.up('lg')]: { [cssProperty]: vars.lg },
      [breakpointMedia.up('xl')]: { [cssProperty]: vars.xl },
    },
  })
}

export const gapResponsiveVars = {
  gap: createBreakpointVars(),
  gapX: createBreakpointVars(),
  gapY: createBreakpointVars(),
}

export const gapResponsiveClasses = {
  gap: createResponsiveStyle('gap', gapResponsiveVars.gap),
  gapX: createResponsiveStyle('columnGap', gapResponsiveVars.gapX),
  gapY: createResponsiveStyle('rowGap', gapResponsiveVars.gapY),
}
