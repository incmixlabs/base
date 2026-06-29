import { type SemanticColorKey, semanticColorKeys } from '../../theme/props/color.prop'

export const progressRootBase = 'relative w-full overflow-hidden pointer-events-none box-border'

export const progressIndicatorBase =
  'relative h-full [transition:var(--component-progress-motion-indicator-transition,width_150ms_var(--af-ease-standard),background-color_var(--af-motion-fast)_var(--af-ease-standard),filter_var(--af-motion-fast)_var(--af-ease-standard))]'

export const progressSizeVariants = {
  xs: 'h-[var(--component-progress-size-xs-height,0.25rem)]',
  sm: 'h-[var(--component-progress-size-sm-height,0.375rem)]',
  md: 'h-[var(--component-progress-size-md-height,0.5rem)]',
  lg: 'h-[var(--component-progress-size-lg-height,0.75rem)]',
} as const

export const progressRadiusVariants = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  full: 'rounded-full',
} as const

export const progressTrackVariantStyles = {
  surface: 'bg-neutral-soft border border-solid border-neutral',
  classic:
    'bg-neutral-soft border border-solid border-neutral [box-shadow:var(--component-progress-variant-classic-box-shadow,var(--shadow-xs))]',
  soft: 'bg-neutral-soft border-0',
} as const

export const progressIndicatorColorStyles = Object.fromEntries(
  semanticColorKeys.map(color => [color, `bg-${color}-solid`]),
) as Record<SemanticColorKey, string>

export const progressSoftIndicatorColorStyles = Object.fromEntries(
  semanticColorKeys.map(color => [color, `bg-[var(--color-${color}-soft-hover)]`]),
) as Record<SemanticColorKey, string>

export const progressTrackHighContrast = '[border-color:var(--color-neutral-text)]'

export const progressIndicatorHighContrast = 'saturate-[1.15] contrast-[1.05]'

export const progressIndicatorIndeterminate =
  'w-[var(--component-progress-motion-indeterminate-width,40%)] animate-[progress-indeterminate_var(--progress-indeterminate-duration,1s)_var(--af-ease-standard)_infinite]'

export const progressClassNames = [
  progressRootBase,
  progressIndicatorBase,
  ...Object.values(progressSizeVariants),
  ...Object.values(progressRadiusVariants),
  ...Object.values(progressTrackVariantStyles),
  ...Object.values(progressIndicatorColorStyles),
  ...Object.values(progressSoftIndicatorColorStyles),
  progressTrackHighContrast,
  progressIndicatorHighContrast,
  progressIndicatorIndeterminate,
]
