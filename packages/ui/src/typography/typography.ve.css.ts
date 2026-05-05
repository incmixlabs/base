import { globalStyle, style, styleVariants } from '@vanilla-extract/css'
import { fontSizeRem, headingLineHeightRem, letterSpacingRem, lineHeightRem } from '@/theme/token-maps'
import { buildContainerResponsiveVariants, typographyBreakpointKeys } from './responsive'

const sizeKeys = Object.keys(fontSizeRem) as Array<keyof typeof fontSizeRem>
const weightValues = {
  light: '300',
  regular: '400',
  medium: '500',
  bold: '700',
} as const

export const textBase = style({
  fontFamily: 'var(--default-font-family)',
  fontStyle: 'var(--default-font-style)',
  margin: 0,
})

export const headingBase = style({
  fontFamily: 'var(--heading-font-family)',
  fontStyle: 'var(--heading-font-style)',
  margin: 0,
})

const textSizeStyles = Object.fromEntries(
  sizeKeys.map(size => [
    size,
    {
      fontSize: `calc(${fontSizeRem[size]} * var(--theme-typography-text-scale, 1))`,
      lineHeight: `calc(${lineHeightRem[size]} * var(--theme-typography-text-leading, 1))`,
      letterSpacing: letterSpacingRem[size],
    },
  ]),
) as Record<(typeof sizeKeys)[number], { fontSize: string; lineHeight: string; letterSpacing: string }>

const headingSizeStyles = Object.fromEntries(
  sizeKeys.map(size => [
    size,
    {
      fontSize: `calc(${fontSizeRem[size]} * var(--heading-font-size-adjust, 1) * var(--theme-typography-heading-scale, 1))`,
      lineHeight: `calc(${headingLineHeightRem[size]} * var(--theme-typography-heading-leading, 1))`,
      letterSpacing: `calc(${letterSpacingRem[size]} + var(--heading-letter-spacing, 0em))`,
    },
  ]),
) as Record<(typeof sizeKeys)[number], { fontSize: string; lineHeight: string; letterSpacing: string }>

export const textBySize = styleVariants(textSizeStyles)

export const headingBySize = styleVariants(headingSizeStyles)

export const textSizeResponsive = Object.fromEntries(
  typographyBreakpointKeys.map(bp => [bp, styleVariants(buildContainerResponsiveVariants(textSizeStyles, bp))]),
) as Record<(typeof typographyBreakpointKeys)[number], Record<(typeof sizeKeys)[number], string>>

export const headingSizeResponsive = Object.fromEntries(
  typographyBreakpointKeys.map(bp => [bp, styleVariants(buildContainerResponsiveVariants(headingSizeStyles, bp))]),
) as Record<(typeof typographyBreakpointKeys)[number], Record<(typeof sizeKeys)[number], string>>

export const textByWeight = styleVariants(
  Object.fromEntries(Object.entries(weightValues).map(([key, value]) => [key, { fontWeight: value }])) as Record<
    keyof typeof weightValues,
    { fontWeight: string }
  >,
)

export const headingByWeight = styleVariants(
  Object.fromEntries(Object.entries(weightValues).map(([key, value]) => [key, { fontWeight: value }])) as Record<
    keyof typeof weightValues,
    { fontWeight: string }
  >,
)

for (const size of sizeKeys) {
  globalStyle(`.${textBase}.af-size-${size}`, {
    ...textSizeStyles[size],
    vars: {
      '--line-height': `calc(${lineHeightRem[size]} * var(--theme-typography-text-leading, 1))`,
      '--letter-spacing': letterSpacingRem[size],
    } as Record<string, string>,
  })

  globalStyle(`.${headingBase}.af-size-${size}`, {
    ...headingSizeStyles[size],
  })
}
