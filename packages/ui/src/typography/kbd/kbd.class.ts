import { typographyBreakpointKeys } from '../../theme/tokens'
import { arbitraryDeclaration, cssVar } from '../class-utils'
import type { TypographySize } from '../tokens'

type KbdSize = TypographySize
type KbdVariant = 'classic' | 'soft'
type TypographyBreakpoint = (typeof typographyBreakpointKeys)[number]

const kbdSizeValues = ['xs', 'sm', 'md', 'lg', 'xl', '2x', '3x', '4x', '5x'] as const satisfies readonly KbdSize[]

const sizeTokenVar = (token: 'font-size' | 'letter-spacing', size: KbdSize) => cssVar(`${token}-${size}`)

const kbdSizeClassName = (size: KbdSize) =>
  [
    arbitraryDeclaration(
      'font-size',
      `calc(${sizeTokenVar('font-size', size)}*0.8*var(--theme-typography-ui-scale,1))`,
    ),
    arbitraryDeclaration('letter-spacing', sizeTokenVar('letter-spacing', size)),
  ].join(' ')

const responsiveClassName = (breakpoint: TypographyBreakpoint, className: string) =>
  className
    .split(/\s+/)
    .filter(Boolean)
    .map(token => `cq-${breakpoint}:${token}`)
    .join(' ')

export const kbdBaseCls =
  'relative inline-flex items-center justify-center select-none whitespace-nowrap box-border align-text-top h-fit'

export const kbdBase =
  'top-[-0.03em] min-w-[1.75em] leading-[1.7em] px-[0.5em] pb-[0.05em] rounded-[calc(var(--radius-factor)_*_0.35em)] [word-spacing:-0.1em] text-[var(--gray-12)] [font-family:var(--default-font-family)] [font-weight:var(--font-weight-regular)]'

export const kbdBySize = Object.fromEntries(kbdSizeValues.map(size => [size, kbdSizeClassName(size)])) as Record<
  KbdSize,
  string
>

export const kbdSizeResponsive = Object.fromEntries(
  typographyBreakpointKeys.map(breakpoint => [
    breakpoint,
    Object.fromEntries(kbdSizeValues.map(size => [size, responsiveClassName(breakpoint, kbdSizeClassName(size))])),
  ]),
) as Record<TypographyBreakpoint, Record<KbdSize, string>>

export const kbdByVariant = {
  classic:
    'bg-[var(--gray-1)] [box-shadow:inset_0_-0.05em_0.5em_var(--gray-a2),inset_0_0.05em_var(--white-a12),inset_0_0.25em_0.5em_var(--gray-a2),inset_0_-0.05em_var(--gray-a6),0_0_0_0.05em_var(--gray-a5),0_0.08em_0.17em_var(--gray-a7)]',
  soft: 'bg-[var(--gray-a3)]',
} as const satisfies Record<KbdVariant, string>
