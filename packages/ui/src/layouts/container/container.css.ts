import { style, styleVariants } from '@vanilla-extract/css'
import { type ContainerBreakpoint, containerBreakpointKeys, containerBreakpoints } from '@/theme/tokens'
import type { ContainerAlign, ContainerSize } from '../layout-utils'
import type { ContainerDisplay } from './container.props'

export const containerBase = style({
  containerType: 'inline-size',
})

export const containerInnerMaxWidth = style({
  maxWidth: 'var(--container-max-width, 71rem)',
})

export const containerSizeMaxWidth = {
  '1': '28rem',
  '2': '43rem',
  '3': '55rem',
  '4': '71rem',
} as const satisfies Record<ContainerSize, string>

const containerMaxWidthVar = '--container-max-width' as const
const containerMaxWidthVars = (size: ContainerSize) => ({
  vars: { [containerMaxWidthVar]: containerSizeMaxWidth[size] },
})

export const containerBySize = styleVariants({
  '1': containerMaxWidthVars('1'),
  '2': containerMaxWidthVars('2'),
  '3': containerMaxWidthVars('3'),
  '4': containerMaxWidthVars('4'),
})

const breakpointKeys = containerBreakpointKeys

export const containerDisplayResponsive = Object.fromEntries(
  breakpointKeys.map(bp => [
    bp,
    styleVariants({
      none: {
        '@container': {
          [`(min-width: ${containerBreakpoints[bp]})`]: { display: 'none' },
        },
      },
      initial: {
        '@container': {
          [`(min-width: ${containerBreakpoints[bp]})`]: { display: 'flex' },
        },
      },
    }),
  ]),
) as Record<ContainerBreakpoint, Record<ContainerDisplay, string>>

export const containerAlignResponsive = Object.fromEntries(
  breakpointKeys.map(bp => [
    bp,
    styleVariants({
      left: {
        '@container': {
          [`(min-width: ${containerBreakpoints[bp]})`]: { alignItems: 'flex-start' },
        },
      },
      center: {
        '@container': {
          [`(min-width: ${containerBreakpoints[bp]})`]: { alignItems: 'center' },
        },
      },
      right: {
        '@container': {
          [`(min-width: ${containerBreakpoints[bp]})`]: { alignItems: 'flex-end' },
        },
      },
    }),
  ]),
) as Record<ContainerBreakpoint, Record<ContainerAlign, string>>

export const containerSizeResponsive = Object.fromEntries(
  breakpointKeys.map(bp => [
    bp,
    styleVariants({
      '1': {
        '@container': {
          [`(min-width: ${containerBreakpoints[bp]})`]: containerMaxWidthVars('1'),
        },
      },
      '2': {
        '@container': {
          [`(min-width: ${containerBreakpoints[bp]})`]: containerMaxWidthVars('2'),
        },
      },
      '3': {
        '@container': {
          [`(min-width: ${containerBreakpoints[bp]})`]: containerMaxWidthVars('3'),
        },
      },
      '4': {
        '@container': {
          [`(min-width: ${containerBreakpoints[bp]})`]: containerMaxWidthVars('4'),
        },
      },
    }),
  ]),
) as Record<ContainerBreakpoint, Record<ContainerSize, string>>
