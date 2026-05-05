import { style, styleVariants } from '@vanilla-extract/css'
import { semanticColorKeys, semanticColorVar } from '@/theme/props/color.prop'
import { fontSizeRem, letterSpacingRem, lineHeightRem } from '@/theme/token-maps'
import type { Color } from '@/theme/tokens'
import { buildContainerResponsiveVariants, typographyBreakpointKeys } from './responsive'
import { typographyTokens } from './tokens'

const sizeKeys = Object.keys(fontSizeRem) as Array<keyof typeof fontSizeRem>

export const strongBase = style({
  fontFamily: 'var(--strong-font-family)',
  fontSize: 'calc(var(--strong-font-size-adjust) * 1em)',
  fontStyle: 'var(--strong-font-style)',
  fontWeight: 'var(--strong-font-weight)',
  letterSpacing: 'calc(var(--strong-letter-spacing) + var(--letter-spacing, var(--default-letter-spacing)))',
})

export const emBase = style({
  boxSizing: 'border-box',
  fontFamily: 'var(--em-font-family)',
  fontSize: 'calc(var(--em-font-size-adjust) * 1em)',
  fontStyle: 'var(--em-font-style)',
  fontWeight: 'var(--em-font-weight)',
  lineHeight: '1.25',
  letterSpacing: 'calc(var(--em-letter-spacing) + var(--letter-spacing, var(--default-letter-spacing)))',
  color: 'inherit',
})

export const quoteBase = style({
  boxSizing: 'border-box',
  fontFamily: 'var(--quote-font-family)',
  fontSize: 'calc(var(--quote-font-size-adjust) * 1em)',
  fontStyle: 'var(--quote-font-style)',
  fontWeight: 'var(--quote-font-weight)',
  lineHeight: '1.25',
  letterSpacing: 'calc(var(--quote-letter-spacing) + var(--letter-spacing, var(--default-letter-spacing)))',
  color: 'inherit',
})

export const codeBase = style({
  display: 'inline-flex',
  alignItems: 'center',
  boxSizing: 'border-box',
  height: 'fit-content',
  fontFamily: 'var(--code-font-family, var(--font-mono, var(--font-geist-mono, ui-monospace, monospace)))',
  fontStyle: 'var(--code-font-style)',
  fontWeight: 'var(--code-font-weight)',
  letterSpacing: 'var(--code-letter-spacing)',
  borderRadius: 'calc((0.5px + 0.2em) * var(--radius-factor, 1))',
  borderWidth: '1px',
  borderStyle: 'solid',
  paddingTop: 'var(--code-padding-top)',
  paddingBottom: 'var(--code-padding-bottom)',
  paddingLeft: 'var(--code-padding-left)',
  paddingRight: 'var(--code-padding-right)',
})

const codeSizeStyles = Object.fromEntries(
  sizeKeys.map(size => [
    size,
    {
      fontSize: `calc(${fontSizeRem[size]} * 0.95 * var(--theme-typography-ui-scale, 1))`,
      lineHeight: `calc(${lineHeightRem[size]} * var(--theme-typography-ui-leading, 1))`,
      letterSpacing: `calc(var(--code-letter-spacing) + ${letterSpacingRem[size]})`,
    },
  ]),
) as Record<(typeof sizeKeys)[number], { fontSize: string; lineHeight: string; letterSpacing: string }>

export const codeBySize = styleVariants(codeSizeStyles)

export const codeSizeResponsive = Object.fromEntries(
  typographyBreakpointKeys.map(bp => [bp, styleVariants(buildContainerResponsiveVariants(codeSizeStyles, bp))]),
) as Record<(typeof typographyBreakpointKeys)[number], Record<(typeof sizeKeys)[number], string>>

const createCodeColorStyles = (color: Color) => ({
  solid: style({
    backgroundColor: semanticColorVar(color, 'primary'),
    borderColor: semanticColorVar(color, 'primary'),
    color: semanticColorVar(color, 'contrast'),
  }),
  soft: style({
    backgroundColor: semanticColorVar(color, 'soft'),
    borderColor: semanticColorVar(color, 'border'),
    color: semanticColorVar(color, 'text'),
  }),
  outline: style({
    backgroundColor: 'transparent',
    borderColor: semanticColorVar(color, 'border'),
    color: semanticColorVar(color, 'text'),
  }),
  ghost: style({
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    color: semanticColorVar(color, 'text'),
    paddingTop: '0',
    paddingBottom: '0',
    paddingLeft: '0',
    paddingRight: '0',
    borderRadius: '0',
  }),
})

export const codeByColor: Record<Color, Record<'solid' | 'soft' | 'outline' | 'ghost', string>> = Object.fromEntries(
  semanticColorKeys.map(color => [color, createCodeColorStyles(color)]),
) as Record<Color, Record<'solid' | 'soft' | 'outline' | 'ghost', string>>

export const codeHighContrast = style({
  fontWeight: typographyTokens.weight.medium,
})
