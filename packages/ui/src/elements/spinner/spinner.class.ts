import { type SemanticColorKey, semanticColorKeys } from '../../theme/props/color.prop'

export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg'

const joinClass = (...parts: string[]) => parts.join('')
const colorVar = (color: string, token: string) => joinClass('var(--color-', color, '-', token, ')')

export const spinnerRoot = 'inline-flex items-center justify-center'

export const spinnerSrOnly = 'sr-only'

export const spinnerColorVariants = Object.fromEntries(
  semanticColorKeys.map(color => [
    color,
    joinClass('text-[', colorVar(color, color === 'light' ? 'contrast' : 'solid'), ']'),
  ]),
) as Record<SemanticColorKey, string>

export const spinnerVisual =
  'block box-border rounded-full border-2 border-solid border-current border-r-transparent animate-[af-spinner-rotate_800ms_linear_infinite] motion-reduce:animate-[af-spinner-rotate_2.4s_linear_infinite]'

export const spinnerSizeVariants = {
  xs: 'h-6 w-6',
  sm: 'h-8 w-8',
  md: 'h-12 w-12',
  lg: 'h-16 w-16',
} as const satisfies Record<SpinnerSize, string>

export const codeSpinnerBase =
  'inline-flex items-center justify-center leading-none font-mono font-bold text-current opacity-80'

export const codeSpinnerSizeVariants = {
  xs: 'h-6 w-6 gap-[0.0625rem] text-sm',
  sm: 'h-8 w-8 gap-[0.0625rem] text-lg',
  md: 'h-12 w-12 gap-[0.09375rem] text-[length:1.625rem]',
  lg: 'h-16 w-16 gap-[0.125rem] text-4xl',
} as const satisfies Record<SpinnerSize, string>

export const codeSpinnerBrace =
  'inline-block origin-center animate-[af-spinner-brace-pulse_400ms_ease-in-out_infinite_alternate] motion-reduce:animate-[af-spinner-brace-pulse_1.2s_ease-in-out_infinite_alternate]'

export const codeSpinnerBraceFirst = '[animation-delay:0ms]'

export const codeSpinnerBraceLast = '[animation-delay:300ms]'

export const sparkleSpinnerBase = 'relative inline-flex items-center justify-center isolate [transform:translateZ(0)]'

export const sparkleSpinnerSizeVariants = spinnerSizeVariants

export const sparkleSpinnerHalo =
  'absolute inset-[-10%] rounded-full [background:radial-gradient(circle,color-mix(in_oklch,currentColor_28%,transparent)_0%,transparent_68%)] blur-[6px] animate-[af-spinner-sparkle-halo-pulse_1.8s_ease-in-out_infinite] motion-reduce:animate-none motion-reduce:opacity-25'

export const sparkleGlyphBase =
  'absolute block fill-current [animation-timing-function:ease-in-out] [animation-iteration-count:infinite] will-change-[transform,opacity] motion-reduce:animate-none motion-reduce:opacity-70'

export const sparkleGlyphBig = 'h-[82%] w-[82%] animate-[af-spinner-sparkle-rotate_3s_ease-in-out_infinite]'

export const sparkleGlyphSmallTop =
  'left-[8%] top-[3%] h-[32%] w-[32%] animate-[af-spinner-sparkle-pulse_2s_ease-in-out_infinite] [animation-delay:0s]'

export const sparkleGlyphSmallBottom =
  'right-[6%] top-[60%] h-[25%] w-[25%] animate-[af-spinner-sparkle-pulse_2s_ease-in-out_infinite] [animation-delay:700ms]'

export const spinnerClassNames = [
  spinnerRoot,
  spinnerSrOnly,
  ...Object.values(spinnerColorVariants),
  spinnerVisual,
  ...Object.values(spinnerSizeVariants),
  codeSpinnerBase,
  ...Object.values(codeSpinnerSizeVariants),
  codeSpinnerBrace,
  codeSpinnerBraceFirst,
  codeSpinnerBraceLast,
  sparkleSpinnerBase,
  ...Object.values(sparkleSpinnerSizeVariants),
  sparkleSpinnerHalo,
  sparkleGlyphBase,
  sparkleGlyphBig,
  sparkleGlyphSmallTop,
  sparkleGlyphSmallBottom,
]
