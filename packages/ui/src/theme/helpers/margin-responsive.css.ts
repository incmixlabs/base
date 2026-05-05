import { createVar, style } from '@vanilla-extract/css'
import { breakpointMedia } from './responsive/breakpoints'

const marginBreakpoints = ['initial', 'xs', 'sm', 'md', 'lg', 'xl'] as const

type MarginBreakpoint = (typeof marginBreakpoints)[number]

function createBreakpointVars() {
  return Object.fromEntries(marginBreakpoints.map(breakpoint => [breakpoint, createVar()])) as Record<
    MarginBreakpoint,
    string
  >
}

function createResponsiveStyle(
  cssProperty: 'margin' | 'marginTop' | 'marginRight' | 'marginBottom' | 'marginLeft',
  vars: Record<MarginBreakpoint, string>,
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
  firstProperty: 'marginLeft' | 'marginTop',
  secondProperty: 'marginRight' | 'marginBottom',
  vars: Record<MarginBreakpoint, string>,
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

export const marginResponsiveVars = {
  m: createBreakpointVars(),
  mx: createBreakpointVars(),
  my: createBreakpointVars(),
  mt: createBreakpointVars(),
  mr: createBreakpointVars(),
  mb: createBreakpointVars(),
  ml: createBreakpointVars(),
}

export const marginResponsiveClasses = {
  m: createResponsiveStyle('margin', marginResponsiveVars.m),
  mx: createPairedAxisResponsiveStyle('marginLeft', 'marginRight', marginResponsiveVars.mx),
  my: createPairedAxisResponsiveStyle('marginTop', 'marginBottom', marginResponsiveVars.my),
  mt: createResponsiveStyle('marginTop', marginResponsiveVars.mt),
  mr: createResponsiveStyle('marginRight', marginResponsiveVars.mr),
  mb: createResponsiveStyle('marginBottom', marginResponsiveVars.mb),
  ml: createResponsiveStyle('marginLeft', marginResponsiveVars.ml),
}
