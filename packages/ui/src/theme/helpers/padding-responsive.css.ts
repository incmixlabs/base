import { createVar, style } from '@vanilla-extract/css'
import { breakpointMedia } from './responsive/breakpoints'

const paddingBreakpoints = ['initial', 'xs', 'sm', 'md', 'lg', 'xl'] as const

type PaddingBreakpoint = (typeof paddingBreakpoints)[number]

function createBreakpointVars() {
  return Object.fromEntries(paddingBreakpoints.map(breakpoint => [breakpoint, createVar()])) as Record<
    PaddingBreakpoint,
    string
  >
}

function createResponsiveStyle(
  cssProperty: 'padding' | 'paddingTop' | 'paddingRight' | 'paddingBottom' | 'paddingLeft',
  vars: Record<PaddingBreakpoint, string>,
) {
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

function createPairedAxisResponsiveStyle(
  firstProperty: 'paddingLeft' | 'paddingTop',
  secondProperty: 'paddingRight' | 'paddingBottom',
  vars: Record<PaddingBreakpoint, string>,
) {
  return style({
    [firstProperty]: vars.initial,
    [secondProperty]: vars.initial,
    '@media': {
      [breakpointMedia.up('xs')]: {
        [firstProperty]: vars.xs,
        [secondProperty]: vars.xs,
      },
      [breakpointMedia.up('sm')]: {
        [firstProperty]: vars.sm,
        [secondProperty]: vars.sm,
      },
      [breakpointMedia.up('md')]: {
        [firstProperty]: vars.md,
        [secondProperty]: vars.md,
      },
      [breakpointMedia.up('lg')]: {
        [firstProperty]: vars.lg,
        [secondProperty]: vars.lg,
      },
      [breakpointMedia.up('xl')]: {
        [firstProperty]: vars.xl,
        [secondProperty]: vars.xl,
      },
    },
  })
}

export const paddingResponsiveVars = {
  p: createBreakpointVars(),
  px: createBreakpointVars(),
  py: createBreakpointVars(),
  pt: createBreakpointVars(),
  pr: createBreakpointVars(),
  pb: createBreakpointVars(),
  pl: createBreakpointVars(),
}

export const paddingResponsiveClasses = {
  p: createResponsiveStyle('padding', paddingResponsiveVars.p),
  px: createPairedAxisResponsiveStyle('paddingLeft', 'paddingRight', paddingResponsiveVars.px),
  py: createPairedAxisResponsiveStyle('paddingTop', 'paddingBottom', paddingResponsiveVars.py),
  pt: createResponsiveStyle('paddingTop', paddingResponsiveVars.pt),
  pr: createResponsiveStyle('paddingRight', paddingResponsiveVars.pr),
  pb: createResponsiveStyle('paddingBottom', paddingResponsiveVars.pb),
  pl: createResponsiveStyle('paddingLeft', paddingResponsiveVars.pl),
}
