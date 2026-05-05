import { keyframes, style, styleVariants } from '@vanilla-extract/css'
import { semanticColorKeys, semanticColorVar } from '@/theme/props/color.prop'
import { radiusStyleVariants } from '@/theme/radius.css'
import { progressMotionVar, progressSizeVar, progressVariantVar } from '@/theme/runtime/component-vars'
import type { Color } from '@/theme/tokens'

const indeterminateSlide = keyframes({
  '0%': { transform: 'translateX(-60%)' },
  '100%': { transform: 'translateX(140%)' },
})

export const progressRootBase = style({
  position: 'relative',
  width: '100%',
  overflow: 'hidden',
  pointerEvents: 'none',
  boxSizing: 'border-box',
})

export const progressIndicatorBase = style({
  position: 'relative',
  height: '100%',
  transition: progressMotionVar(
    'indicatorTransition',
    'width 150ms var(--af-ease-standard), background-color var(--af-motion-fast) var(--af-ease-standard)',
  ),
})

export const progressSizeVariants = styleVariants({
  xs: { height: progressSizeVar('xs', 'height', '0.25rem') },
  sm: { height: progressSizeVar('sm', 'height', '0.375rem') },
  md: { height: progressSizeVar('md', 'height', '0.5rem') },
  lg: { height: progressSizeVar('lg', 'height', '0.75rem') },
})

export const progressRadiusVariants = radiusStyleVariants

export const progressTrackVariantStyles = styleVariants({
  surface: {
    backgroundColor: semanticColorVar('neutral', 'soft'),
    border: `1px solid ${semanticColorVar('neutral', 'border')}`,
  },
  classic: {
    backgroundColor: semanticColorVar('neutral', 'soft'),
    border: `1px solid ${semanticColorVar('neutral', 'border')}`,
    boxShadow: progressVariantVar('classic', 'boxShadow', 'var(--shadow-xs)'),
  },
  soft: {
    backgroundColor: semanticColorVar('neutral', 'soft'),
  },
})

export const progressIndicatorColorStyles: Record<Color, string> = Object.fromEntries(
  semanticColorKeys.map(color => [
    color,
    style({
      backgroundColor: semanticColorVar(color, 'primary'),
    }),
  ]),
) as Record<Color, string>

export const progressSoftIndicatorColorStyles: Record<Color, string> = Object.fromEntries(
  semanticColorKeys.map(color => [
    color,
    style({
      backgroundColor: semanticColorVar(color, 'soft-hover'),
    }),
  ]),
) as Record<Color, string>

export const progressTrackHighContrast = style({
  borderColor: semanticColorVar('neutral', 'text'),
})

export const progressIndicatorHighContrast = style({
  filter: 'saturate(1.15) contrast(1.05)',
})

export const progressIndicatorIndeterminate = style({
  width: progressMotionVar('indeterminateWidth', '40%'),
  animationName: indeterminateSlide,
  animationTimingFunction: 'var(--af-ease-standard)',
  animationIterationCount: 'infinite',
  animationDuration: progressMotionVar('indeterminateDuration', 'var(--progress-indeterminate-duration, 1s)'),
})
