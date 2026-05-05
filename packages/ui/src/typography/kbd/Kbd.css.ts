import { style, styleVariants } from '@vanilla-extract/css'
import { buildContainerResponsiveVariants, typographyBreakpointKeys } from '../responsive'
import { typographyTokens } from '../tokens'
import { kbdPropDefs } from './kbd.props'

const sizes = kbdPropDefs.size.values

type KbdSize = (typeof kbdPropDefs.size.values)[number]
type KbdVariant = (typeof kbdPropDefs.variant.values)[number]

export const kbdBaseCls =
  'relative inline-flex items-center justify-center select-none whitespace-nowrap box-border align-text-top h-fit'

export const kbdBase = style({
  top: '-0.03em',
  minWidth: '1.75em',
  lineHeight: '1.7em',
  paddingInline: '0.5em',
  paddingBottom: '0.05em',
  borderRadius: 'calc(var(--radius-factor) * 0.35em)',
  wordSpacing: '-0.1em',
  color: 'var(--gray-12)',
  fontFamily: 'var(--default-font-family)',
  fontWeight: 'var(--font-weight-regular)',
})

const kbdSizeStyles = Object.fromEntries(
  sizes.map(size => {
    const token = typographyTokens.size[size]
    return [
      size,
      {
        fontSize: `calc(${token.fontSize} * 0.8 * var(--theme-typography-ui-scale, 1))`,
        letterSpacing: token.letterSpacing,
      },
    ]
  }),
) as Record<
  KbdSize,
  {
    fontSize: string
    letterSpacing: string
  }
>

export const kbdBySize = styleVariants(kbdSizeStyles)

export const kbdSizeResponsive = Object.fromEntries(
  typographyBreakpointKeys.map(bp => [bp, styleVariants(buildContainerResponsiveVariants(kbdSizeStyles, bp))]),
) as Record<(typeof typographyBreakpointKeys)[number], Record<KbdSize, string>>

export const kbdByVariant = styleVariants({
  classic: {
    backgroundColor: 'var(--gray-1)',
    boxShadow:
      'inset 0 -0.05em 0.5em var(--gray-a2), inset 0 0.05em var(--white-a12), inset 0 0.25em 0.5em var(--gray-a2), inset 0 -0.05em var(--gray-a6), 0 0 0 0.05em var(--gray-a5), 0 0.08em 0.17em var(--gray-a7)',
  },
  soft: {
    backgroundColor: 'var(--gray-a3)',
  },
} satisfies Record<KbdVariant, Record<string, string>>)
