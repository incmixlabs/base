import { typographyBreakpointKeys } from '../theme/tokens'
import type { TypographySize, Weight } from './tokens'

type TypographyBreakpoint = (typeof typographyBreakpointKeys)[number]

const typographySizeValues = [
  'xs',
  'sm',
  'md',
  'lg',
  'xl',
  '2x',
  '3x',
  '4x',
  '5x',
] as const satisfies readonly TypographySize[]
const headingLineHeightRem = {
  xs: '1rem',
  sm: '1.125rem',
  md: '1.375rem',
  lg: '1.5rem',
  xl: '1.625rem',
  '2x': '1.875rem',
  '3x': '2.25rem',
  '4x': '2.5rem',
  '5x': '3.5rem',
} as const satisfies Record<TypographySize, string>
const weightClassNames = {
  light: 'font-light',
  regular: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
} as const satisfies Record<Weight, string>

const responsiveClassName = (breakpoint: TypographyBreakpoint, className: string) =>
  className
    .split(/\s+/)
    .filter(Boolean)
    .map(token => `cq-${breakpoint}:${token}`)
    .join(' ')

const textSizeClassName = (size: TypographySize) =>
  [
    `[font-size:calc(var(--font-size-${size})*var(--theme-typography-text-scale,1))]`,
    `[line-height:calc(var(--line-height-${size})*var(--theme-typography-text-leading,1))]`,
    `[letter-spacing:var(--letter-spacing-${size})]`,
    `[--line-height:calc(var(--line-height-${size})*var(--theme-typography-text-leading,1))]`,
    `[--letter-spacing:var(--letter-spacing-${size})]`,
  ].join(' ')

const headingSizeClassName = (size: TypographySize) =>
  [
    `[font-size:calc(var(--font-size-${size})*var(--heading-font-size-adjust,1)*var(--theme-typography-heading-scale,1))]`,
    `[line-height:calc(${headingLineHeightRem[size]}*var(--theme-typography-heading-leading,1))]`,
    `[letter-spacing:calc(var(--letter-spacing-${size})+var(--heading-letter-spacing,0em))]`,
    `[--letter-spacing:calc(var(--letter-spacing-${size})+var(--heading-letter-spacing,0em))]`,
  ].join(' ')

export const textBase = '[font-family:var(--default-font-family)] [font-style:var(--default-font-style)] m-0'

export const headingBase = '[font-family:var(--heading-font-family)] [font-style:var(--heading-font-style)] m-0'

export const textBySize = Object.fromEntries(
  typographySizeValues.map(size => [size, textSizeClassName(size)]),
) as Record<TypographySize, string>

export const headingBySize = Object.fromEntries(
  typographySizeValues.map(size => [size, headingSizeClassName(size)]),
) as Record<TypographySize, string>

export const textSizeResponsive = Object.fromEntries(
  typographyBreakpointKeys.map(breakpoint => [
    breakpoint,
    Object.fromEntries(typographySizeValues.map(size => [size, responsiveClassName(breakpoint, textBySize[size])])),
  ]),
) as Record<TypographyBreakpoint, Record<TypographySize, string>>

export const headingSizeResponsive = Object.fromEntries(
  typographyBreakpointKeys.map(breakpoint => [
    breakpoint,
    Object.fromEntries(typographySizeValues.map(size => [size, responsiveClassName(breakpoint, headingBySize[size])])),
  ]),
) as Record<TypographyBreakpoint, Record<TypographySize, string>>

export const textByWeight = weightClassNames

export const headingByWeight = weightClassNames
