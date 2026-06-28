import { semanticColorKeys } from '../../theme/props/color.prop'
import { type Color, typographyBreakpointKeys } from '../../theme/tokens'
import type { TypographySize } from '../tokens'

type LinkSize = TypographySize
type LinkUnderline = 'auto' | 'always' | 'hover' | 'none'
type TypographyBreakpoint = (typeof typographyBreakpointKeys)[number]

const linkSizeValues = ['xs', 'sm', 'md', 'lg', 'xl', '2x', '3x', '4x', '5x'] as const satisfies readonly LinkSize[]

const linkSizeClassName = (size: LinkSize) =>
  [
    `[font-size:calc(var(--font-size-${size})*var(--theme-typography-text-scale,1))]`,
    `[line-height:calc(var(--line-height-${size})*var(--theme-typography-text-leading,1))]`,
    `[letter-spacing:var(--letter-spacing-${size})]`,
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
  auto: 'hover:underline',
  always: 'underline',
  hover: 'hover:underline',
  none: 'no-underline',
} as const satisfies Record<LinkUnderline, string>

const linkColorClassName = (color: Color) =>
  [
    `text-${color}`,
    `[text-decoration-color:var(--color-${color}-border)]`,
    `hover:text-[var(--color-${color}-primary)]`,
    `hover:[text-decoration-color:var(--color-${color}-primary)]`,
  ].join(' ')

export const linkByColor = Object.fromEntries(
  semanticColorKeys.map(color => [color, linkColorClassName(color as Color)]),
) as Record<Color, string>

export const linkHighContrast = 'font-medium underline'
