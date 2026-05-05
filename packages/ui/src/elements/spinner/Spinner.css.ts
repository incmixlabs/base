import { keyframes, style, styleVariants } from '@vanilla-extract/css'
import { semanticColorKeys, semanticColorVar } from '@/theme/props/color.prop'
import type { Color } from '@/theme/tokens'

/* ─── shared sizes (consistent across all variants) ─── */
const sizes = {
  xs: { width: '1.5rem', height: '1.5rem' },
  sm: { width: '2rem', height: '2rem' },
  md: { width: '3rem', height: '3rem' },
  lg: { width: '4rem', height: '4rem' },
} as const

/* ─── keyframes ─── */

const spinnerRotate = keyframes({
  from: { transform: 'rotate(0deg)' },
  to: { transform: 'rotate(360deg)' },
})

const codeBracePulse = keyframes({
  to: {
    transform: 'scale(0.8)',
    opacity: 0.5,
  },
})

const sparkleRotate = keyframes({
  from: { transform: 'rotate(0deg)' },
  to: { transform: 'rotate(360deg)' },
})

const sparklePulse = keyframes({
  '0%': {
    opacity: 0,
    transform: 'scale(0.3) rotate(0deg)',
  },
  '25%': {
    opacity: 1,
    transform: 'scale(1.1) rotate(90deg)',
  },
  '50%': {
    opacity: 0.4,
    transform: 'scale(0.6) rotate(180deg)',
  },
  '75%': {
    opacity: 1,
    transform: 'scale(1.05) rotate(270deg)',
  },
  '100%': {
    opacity: 0,
    transform: 'scale(0.3) rotate(360deg)',
  },
})

const sparkleHaloPulse = keyframes({
  '0%, 100%': {
    opacity: 0.1,
    transform: 'scale(0.85)',
  },
  '50%': {
    opacity: 0.45,
    transform: 'scale(1.15)',
  },
})

/* ─── shared ─── */

export const spinnerRoot = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
})

export const spinnerColorVariants: Record<Color, string> = Object.fromEntries(
  semanticColorKeys.map(color => [
    color,
    style({
      color: semanticColorVar(color, color === 'light' ? 'contrast' : 'primary'),
    }),
  ]),
) as Record<Color, string>

/* ─── default spinner ─── */

const reducedMotion = '(prefers-reduced-motion: reduce)' as const

export const spinnerVisual = style({
  display: 'block',
  boxSizing: 'border-box',
  borderRadius: '9999px',
  border: '2px solid currentColor',
  borderInlineEndColor: 'transparent',
  animation: `${spinnerRotate} 800ms linear infinite`,
  '@media': {
    [reducedMotion]: { animationDuration: '2.4s' },
  },
})

export const spinnerSizeVariants = styleVariants(sizes)

/* ─── code spinner ─── */

export const codeSpinnerBase = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  lineHeight: 1,
  fontFamily: 'var(--font-mono, ui-monospace, monospace)',
  fontWeight: 700,
  color: 'currentColor',
  opacity: 0.8,
})

export const codeSpinnerSizeVariants = styleVariants({
  xs: {
    ...sizes.xs,
    gap: '0.0625rem',
    fontSize: '0.875rem',
  },
  sm: {
    ...sizes.sm,
    gap: '0.0625rem',
    fontSize: '1.125rem',
  },
  md: {
    ...sizes.md,
    gap: '0.09375rem',
    fontSize: '1.625rem',
  },
  lg: {
    ...sizes.lg,
    gap: '0.125rem',
    fontSize: '2.25rem',
  },
})

export const codeSpinnerBrace = style({
  display: 'inline-block',
  transformOrigin: 'center center',
  animation: `${codeBracePulse} 400ms alternate infinite ease-in-out`,
  '@media': {
    [reducedMotion]: { animationDuration: '1.2s' },
  },
  selectors: {
    '&:first-child': {
      animationDelay: '0ms',
    },
    '&:last-child': {
      animationDelay: '300ms',
    },
  },
})

/* ─── sparkle spinner ─── */

export const sparkleSpinnerBase = style({
  position: 'relative',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  isolation: 'isolate',
  transform: 'translateZ(0)',
})

export const sparkleSpinnerSizeVariants = styleVariants(sizes)

export const sparkleSpinnerHalo = style({
  position: 'absolute',
  inset: '-10%',
  borderRadius: '9999px',
  background: 'radial-gradient(circle, color-mix(in oklch, currentColor 28%, transparent) 0%, transparent 68%)',
  filter: 'blur(6px)',
  animation: `${sparkleHaloPulse} 1.8s ease-in-out infinite`,
  '@media': {
    [reducedMotion]: { animation: 'none', opacity: 0.25 },
  },
})

export const sparkleGlyph = style({
  position: 'absolute',
  display: 'block',
  fill: 'currentColor',
  animationTimingFunction: 'ease-in-out',
  animationIterationCount: 'infinite',
  willChange: 'transform, opacity',
  '@media': {
    [reducedMotion]: { animation: 'none', opacity: 0.7 },
  },
})

export const sparkleGlyphBig = style([
  sparkleGlyph,
  {
    width: '82%',
    height: '82%',
    animationName: sparkleRotate,
    animationDuration: '3s',
  },
])

export const sparkleGlyphSmallTop = style([
  sparkleGlyph,
  {
    width: '32%',
    height: '32%',
    top: '3%',
    left: '8%',
    animationName: sparklePulse,
    animationDuration: '2s',
    animationDelay: '0s',
  },
])

export const sparkleGlyphSmallBottom = style([
  sparkleGlyph,
  {
    width: '25%',
    height: '25%',
    right: '6%',
    top: '60%',
    animationName: sparklePulse,
    animationDuration: '2s',
    animationDelay: '0.7s',
  },
])

/* ─── sr-only ─── */

export const spinnerSrOnly = style({
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0,
})
