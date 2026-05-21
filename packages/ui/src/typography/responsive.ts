import type { Responsive } from '@/layouts/layout-utils'
import { typographyBreakpointQuery } from '@/theme/helpers/responsive/breakpoints'
import { type TypographyBreakpoint, typographyBreakpointKeys as themeTypographyBreakpointKeys } from '@/theme/tokens'

export const typographyBreakpointKeys = themeTypographyBreakpointKeys

export function buildContainerResponsiveVariants<T extends Record<string, Record<string, string>>>(
  styles: T,
  breakpoint: TypographyBreakpoint,
): { [K in keyof T]: { '@container': { [query: string]: T[K] } } } {
  return Object.fromEntries(
    Object.entries(styles).map(([key, value]) => [
      key,
      {
        '@container': {
          [typographyBreakpointQuery.up(breakpoint)]: value,
        },
      },
    ]),
  ) as { [K in keyof T]: { '@container': { [query: string]: T[K] } } }
}

export function getResponsiveVariantClasses<TSize extends string, TBreakpoint extends TypographyBreakpoint>(
  value: Responsive<TSize> | undefined,
  baseMap: Record<TSize, string>,
  responsiveMap: Record<TBreakpoint, Record<TSize, string>>,
  fallback: TSize,
  breakpointKeys: readonly TBreakpoint[],
): string {
  if (!value) return baseMap[fallback]
  if (typeof value === 'string') return baseMap[value]

  const responsiveValue = value as Partial<Record<TBreakpoint, TSize>> & { initial?: TSize }
  const classes = [baseMap[value.initial ?? fallback]]

  for (const breakpoint of breakpointKeys) {
    const nextValue = responsiveValue[breakpoint]
    if (nextValue) classes.push(responsiveMap[breakpoint][nextValue])
  }

  return classes.join(' ')
}
