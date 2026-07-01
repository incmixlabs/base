import { semanticColorKeys } from '../theme/props/color.prop'
import { type Color, typographyBreakpointKeys } from '../theme/tokens'
import { arbitraryDeclaration, arbitraryUtility, cssVar } from './class-utils'
import type { TypographySize } from './tokens'

type CodeVariant = 'solid' | 'soft' | 'outline' | 'ghost'
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

const responsiveClassName = (breakpoint: TypographyBreakpoint, className: string) =>
  className
    .split(/\s+/)
    .filter(Boolean)
    .map(token => `cq-${breakpoint}:${token}`)
    .join(' ')

const sizeTokenVar = (token: 'font-size' | 'letter-spacing' | 'line-height', size: TypographySize) =>
  cssVar(`${token}-${size}`)
const semanticColorVar = (color: Color, token: string) => cssVar(`color-${color}-${token}`)

const codeSizeClassName = (size: TypographySize) =>
  [
    arbitraryDeclaration(
      'font-size',
      `calc(${sizeTokenVar('font-size', size)}*0.95*var(--theme-typography-ui-scale,1))`,
    ),
    arbitraryDeclaration(
      'line-height',
      `calc(${sizeTokenVar('line-height', size)}*var(--theme-typography-ui-leading,1))`,
    ),
    arbitraryDeclaration(
      'letter-spacing',
      `calc(var(--code-letter-spacing)_+_${sizeTokenVar('letter-spacing', size)})`,
    ),
  ].join(' ')

const createCodeColorClasses = (color: Color): Record<CodeVariant, string> => ({
  solid: `bg-${color}-solid ${arbitraryUtility('border', semanticColorVar(color, 'solid'))} text-${color}-contrast`,
  soft: `bg-${color}-soft border-${color} text-${color}`,
  outline: `bg-transparent border-${color} text-${color}`,
  ghost: `bg-transparent border-transparent text-${color} pt-0 pb-0 pl-0 pr-0 rounded-none`,
})

export const strongBase =
  '[font-family:var(--strong-font-family)] [font-size:calc(var(--strong-font-size-adjust)*1em)] [font-style:var(--strong-font-style)] [font-weight:var(--strong-font-weight)] [letter-spacing:calc(var(--strong-letter-spacing)_+_var(--letter-spacing,var(--default-letter-spacing)))]'

export const emBase =
  'box-border [font-family:var(--em-font-family)] [font-size:calc(var(--em-font-size-adjust)*1em)] [font-style:var(--em-font-style)] [font-weight:var(--em-font-weight)] leading-[1.25] [letter-spacing:calc(var(--em-letter-spacing)_+_var(--letter-spacing,var(--default-letter-spacing)))] [color:inherit]'

export const quoteBase =
  'box-border [font-family:var(--quote-font-family)] [font-size:calc(var(--quote-font-size-adjust)*1em)] [font-style:var(--quote-font-style)] [font-weight:var(--quote-font-weight)] leading-[1.25] [letter-spacing:calc(var(--quote-letter-spacing)_+_var(--letter-spacing,var(--default-letter-spacing)))] [color:inherit]'

export const codeBase =
  'inline-flex items-center box-border h-fit [font-family:var(--code-font-family,var(--font-mono,var(--font-geist-mono,ui-monospace,monospace)))] [font-style:var(--code-font-style)] [font-weight:var(--code-font-weight)] [letter-spacing:var(--code-letter-spacing)] rounded-[calc((0.5px_+_0.2em)_*_var(--radius-factor,1))] border border-solid pt-[var(--code-padding-top)] pb-[var(--code-padding-bottom)] pl-[var(--code-padding-left)] pr-[var(--code-padding-right)]'

export const codeBySize = Object.fromEntries(
  typographySizeValues.map(size => [size, codeSizeClassName(size)]),
) as Record<TypographySize, string>

export const codeSizeResponsive = Object.fromEntries(
  typographyBreakpointKeys.map(breakpoint => [
    breakpoint,
    Object.fromEntries(typographySizeValues.map(size => [size, responsiveClassName(breakpoint, codeBySize[size])])),
  ]),
) as Record<TypographyBreakpoint, Record<TypographySize, string>>

export const codeByColor = Object.fromEntries(
  semanticColorKeys.map(color => [color, createCodeColorClasses(color as Color)]),
) as Record<Color, Record<CodeVariant, string>>

export const codeHighContrast = 'font-medium'
