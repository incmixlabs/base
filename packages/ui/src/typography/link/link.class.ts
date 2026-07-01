import { semanticColorKeys } from '../../theme/props/color.prop'
import { type Color, typographyBreakpointKeys } from '../../theme/tokens'
import { arbitraryDeclaration, arbitraryUtility, arbitraryVariant, cssVar } from '../class-utils'
import type { TypographySize } from '../tokens'

type LinkSize = TypographySize
type LinkUnderline = 'auto' | 'always' | 'hover' | 'none'
type TypographyBreakpoint = (typeof typographyBreakpointKeys)[number]

const linkSizeValues = ['xs', 'sm', 'md', 'lg', 'xl', '2x', '3x', '4x', '5x'] as const satisfies readonly LinkSize[]

const sizeTokenVar = (token: 'font-size' | 'letter-spacing' | 'line-height', size: LinkSize) =>
  cssVar(`${token}-${size}`)
const semanticColorVar = (color: Color, token: string) => cssVar(`color-${color}-${token}`)
const hoverNotDisabled = (className: string) => arbitraryVariant('&:hover:not(:disabled)', className)

const linkSizeClassName = (size: LinkSize) =>
  [
    arbitraryDeclaration('font-size', `calc(${sizeTokenVar('font-size', size)}*var(--theme-typography-text-scale,1))`),
    arbitraryDeclaration(
      'line-height',
      `calc(${sizeTokenVar('line-height', size)}*var(--theme-typography-text-leading,1))`,
    ),
    arbitraryDeclaration('letter-spacing', sizeTokenVar('letter-spacing', size)),
  ].join(' ')

const responsiveClassName = (breakpoint: TypographyBreakpoint, className: string) =>
  className
    .split(/\s+/)
    .filter(Boolean)
    .map(token => `cq-${breakpoint}:${token}`)
    .join(' ')

export const linkBaseCls =
  'inline outline-none enabled:cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 focus-visible:rounded-sm'

export const linkBase =
  '[text-decoration-thickness:min(2px,max(1px,0.05em))] [text-underline-offset:calc(0.025em_+_2px)] no-underline focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-8)]'

export const linkBySize = Object.fromEntries(linkSizeValues.map(size => [size, linkSizeClassName(size)])) as Record<
  LinkSize,
  string
>

export const linkSizeResponsive = Object.fromEntries(
  typographyBreakpointKeys.map(breakpoint => [
    breakpoint,
    Object.fromEntries(linkSizeValues.map(size => [size, responsiveClassName(breakpoint, linkSizeClassName(size))])),
  ]),
) as Record<TypographyBreakpoint, Record<LinkSize, string>>

export const linkByUnderline = {
  auto: '[@media_(hover:_hover)]:hover:underline',
  always: 'underline',
  hover: '[@media_(hover:_hover)]:hover:underline',
  none: 'no-underline',
} as const satisfies Record<LinkUnderline, string>

const linkColorClassName = (color: Color) =>
  [
    `text-${color}`,
    arbitraryDeclaration('text-decoration-color', semanticColorVar(color, 'border')),
    hoverNotDisabled(arbitraryUtility('text', semanticColorVar(color, 'solid'))),
    hoverNotDisabled(arbitraryDeclaration('text-decoration-color', semanticColorVar(color, 'solid'))),
  ].join(' ')

export const linkByColor = Object.fromEntries(
  semanticColorKeys.map(color => [color, linkColorClassName(color as Color)]),
) as Record<Color, string>

export const linkHighContrast = 'font-medium underline'
