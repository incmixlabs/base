import { style, styleVariants } from '@vanilla-extract/css'
import { type ContainerBreakpoint, containerBreakpointKeys, containerBreakpoints } from '@/theme/tokens'

export const sectionBaseCls = 'box-border'

export const sectionBase = style({
  containerType: 'inline-size',
  flexShrink: 0,
})

const sectionDisplayStyles = {
  none: { display: 'none' },
  initial: { display: 'block' },
} as const

const sectionSizeStyles = {
  '1': {
    paddingTop: 'var(--theme-rhythm-section-space-1, 1.5rem)',
    paddingBottom: 'var(--theme-rhythm-section-space-1, 1.5rem)',
  },
  '2': {
    paddingTop: 'var(--theme-rhythm-section-space-2, 2.5rem)',
    paddingBottom: 'var(--theme-rhythm-section-space-2, 2.5rem)',
  },
  '3': {
    paddingTop: 'var(--theme-rhythm-section-space-3, 4rem)',
    paddingBottom: 'var(--theme-rhythm-section-space-3, 4rem)',
  },
  '4': {
    paddingTop: 'var(--theme-rhythm-section-space-4, 6rem)',
    paddingBottom: 'var(--theme-rhythm-section-space-4, 6rem)',
  },
} as const

export const sectionByDisplay = styleVariants(sectionDisplayStyles)

export const sectionBySize = styleVariants(sectionSizeStyles)

const breakpointKeys = containerBreakpointKeys
type SectionBreakpoint = ContainerBreakpoint
export type SectionDisplay = keyof typeof sectionDisplayStyles
export type SectionVariantSize = keyof typeof sectionSizeStyles

function buildResponsiveVariants<T extends Record<string, Record<string, string>>>(
  styles: T,
  breakpoint: SectionBreakpoint,
): { [K in keyof T]: { '@container': { [query: string]: T[K] } } } {
  return Object.fromEntries(
    Object.entries(styles).map(([key, value]) => [
      key,
      {
        '@container': {
          [`(min-width: ${containerBreakpoints[breakpoint]})`]: value,
        },
      },
    ]),
  ) as { [K in keyof T]: { '@container': { [query: string]: T[K] } } }
}

export const sectionDisplayResponsive = Object.fromEntries(
  breakpointKeys.map(bp => [bp, styleVariants(buildResponsiveVariants(sectionDisplayStyles, bp))]),
) as Record<SectionBreakpoint, Record<SectionDisplay, string>>

export const sectionSizeResponsive = Object.fromEntries(
  breakpointKeys.map(bp => [bp, styleVariants(buildResponsiveVariants(sectionSizeStyles, bp))]),
) as Record<SectionBreakpoint, Record<SectionVariantSize, string>>
