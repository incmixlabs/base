import { style, styleVariants } from '@vanilla-extract/css'
import { semanticColorKeys, semanticColorVar } from '@/theme/props/color.prop'
import type { Color } from '@/theme/tokens'
import { buildContainerResponsiveVariants, typographyBreakpointKeys } from '../responsive'
import { typographyTokens } from '../tokens'
import { linkPropDefs } from './link.props'

const sizes = linkPropDefs.size.values

type LinkSize = (typeof linkPropDefs.size.values)[number]
type LinkUnderline = (typeof linkPropDefs.underline.values)[number]

export const linkBaseCls =
  'inline outline-none enabled:cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 focus-visible:rounded-sm'

export const linkBase = style({
  textDecorationThickness: 'min(2px, max(1px, 0.05em))',
  textUnderlineOffset: 'calc(0.025em + 2px)',
  textDecorationLine: 'none',
  textDecorationColor: 'var(--gray-a6)',
  selectors: {
    '&:focus-visible': {
      outline: '2px solid var(--focus-8)',
      outlineOffset: '2px',
    },
  },
})

const linkSizeStyles = Object.fromEntries(
  sizes.map(size => {
    const token = typographyTokens.size[size]
    return [
      size,
      {
        fontSize: `calc(${token.fontSize} * var(--theme-typography-text-scale, 1))`,
        lineHeight: `calc(${token.lineHeight} * var(--theme-typography-text-leading, 1))`,
        letterSpacing: token.letterSpacing,
      },
    ]
  }),
) as Record<
  LinkSize,
  {
    fontSize: string
    lineHeight: string
    letterSpacing: string
  }
>

export const linkBySize = styleVariants(linkSizeStyles)

export const linkSizeResponsive = Object.fromEntries(
  typographyBreakpointKeys.map(bp => [bp, styleVariants(buildContainerResponsiveVariants(linkSizeStyles, bp))]),
) as Record<(typeof typographyBreakpointKeys)[number], Record<LinkSize, string>>

export const linkByUnderline = styleVariants({
  auto: {
    '@media': {
      '(hover: hover)': {
        selectors: {
          '&:hover': {
            textDecorationLine: 'underline',
          },
        },
      },
    },
  },
  always: {
    textDecorationLine: 'underline',
  },
  hover: {
    '@media': {
      '(hover: hover)': {
        selectors: {
          '&:hover': {
            textDecorationLine: 'underline',
          },
        },
      },
    },
  },
  none: {
    textDecorationLine: 'none',
  },
} satisfies Record<LinkUnderline, Record<string, unknown>>)

const createLinkColorStyles = (color: Color) =>
  style({
    color: semanticColorVar(color, 'text'),
    textDecorationColor: semanticColorVar(color, 'border'),
    selectors: {
      '&:hover:not(:disabled)': {
        color: semanticColorVar(color, 'primary'),
        textDecorationColor: semanticColorVar(color, 'primary'),
      },
    },
  })

export const linkByColor: Record<Color, string> = Object.fromEntries(
  semanticColorKeys.map(color => [color, createLinkColorStyles(color)]),
) as Record<Color, string>

export const linkHighContrast = style({
  fontWeight: 'var(--font-weight-medium)',
  textDecorationLine: 'underline',
})
