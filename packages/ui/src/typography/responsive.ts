import type { Responsive } from '@/layouts/layout-utils'
import {
  type TypographyBreakpoint,
  typographyBreakpointKeys as themeTypographyBreakpointKeys,
  typographyBreakpoints,
} from '@/theme/tokens'

export const typographyBreakpointKeys = themeTypographyBreakpointKeys

export function buildContainerResponsiveVariants<T extends Record<string, Record<string, string>>>(
  styles: T,
  breakpoint: keyof typeof typographyBreakpoints,
): { [K in keyof T]: { '@container': { [query: string]: T[K] } } } {
  return Object.fromEntries(
    Object.entries(styles).map(([key, value]) => [
      key,
      {
        '@container': {
          [`(min-width: ${typographyBreakpoints[breakpoint]})`]: value,
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
