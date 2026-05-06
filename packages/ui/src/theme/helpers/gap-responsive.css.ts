import { createVar, fallbackVar, style } from '@vanilla-extract/css'
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
  const initialValue = vars.initial
  const xsValue = fallbackVar(vars.xs, initialValue)
  const smValue = fallbackVar(vars.sm, xsValue)
  const mdValue = fallbackVar(vars.md, smValue)
  const lgValue = fallbackVar(vars.lg, mdValue)
  const xlValue = fallbackVar(vars.xl, lgValue)

  return style({
    [cssProperty]: initialValue,
    '@media': {
      [breakpointMedia.up('xs')]: { [cssProperty]: xsValue },
      [breakpointMedia.up('sm')]: { [cssProperty]: smValue },
      [breakpointMedia.up('md')]: { [cssProperty]: mdValue },
      [breakpointMedia.up('lg')]: { [cssProperty]: lgValue },
      [breakpointMedia.up('xl')]: { [cssProperty]: xlValue },
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
