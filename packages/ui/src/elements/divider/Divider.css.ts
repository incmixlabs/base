import { type ComplexStyleRule, createVar, style, styleVariants } from '@vanilla-extract/css'
import { type SemanticColorKey, semanticColors, semanticColorVar } from '@/theme/props/color.prop'
import type { dividerPropDefs } from './divider.props'

export type DividerAlign = (typeof dividerPropDefs.align.values)[number]
export type DividerOrientation = (typeof dividerPropDefs.orientation.values)[number]
export type DividerSize = (typeof dividerPropDefs.size.values)[number]

const dividerColorVar = createVar()
const dividerThicknessVar = createVar()

const dividerRule = {
  content: '""',
  flexGrow: 1,
  backgroundColor: dividerColorVar,
} as const

export const dividerBase = style({
  vars: {
    [dividerColorVar]: 'color-mix(in oklch, currentColor 12%, transparent)',
    [dividerThicknessVar]: '0.125rem',
  },
  display: 'flex',
  alignItems: 'center',
  alignSelf: 'stretch',
  gap: 0,
  whiteSpace: 'nowrap',
  color: 'inherit',
  border: 0,
  '::before': dividerRule,
  '::after': dividerRule,
})

export const dividerWithContent = style({
  gap: '1rem',
})

export const dividerHorizontal = style({
  flexDirection: 'row',
  width: 'auto',
  height: '1rem',
  margin: '1rem 0',
  '::before': {
    width: '100%',
    height: dividerThicknessVar,
  },
  '::after': {
    width: '100%',
    height: dividerThicknessVar,
  },
})

export const dividerVertical = style({
  flexDirection: 'column',
  width: '1rem',
  height: 'auto',
  margin: '0 1rem',
  '::before': {
    width: dividerThicknessVar,
    height: '100%',
  },
  '::after': {
    width: dividerThicknessVar,
    height: '100%',
  },
})

export const dividerAlignStart = style({
  '::before': { display: 'none' },
})

export const dividerAlignEnd = style({
  '::after': { display: 'none' },
})

export const dividerSizeVariants: Record<DividerSize, string> = styleVariants({
  xs: { vars: { [dividerThicknessVar]: '1px' } },
  sm: { vars: { [dividerThicknessVar]: '0.125rem' } },
  md: { vars: { [dividerThicknessVar]: '0.25rem' } },
  lg: { vars: { [dividerThicknessVar]: '0.5rem' } },
})

const dividerColorVariantStyles = semanticColors.reduce(
  (acc, color) => {
    acc[color] = {
      vars: {
        [dividerColorVar]: semanticColorVar(color, 'primary'),
      },
    }

    return acc
  },
  {} as Record<SemanticColorKey, ComplexStyleRule>,
)

export const dividerColorVariants: Record<SemanticColorKey, string> = styleVariants(dividerColorVariantStyles)
