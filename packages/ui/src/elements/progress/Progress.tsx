'use client'

import { Progress as ProgressPrimitive } from '@base-ui/react/progress'
import * as React from 'react'
import { cn } from '@/lib/utils'
import { getMarginProps } from '@/theme/helpers/get-margin-styles'
import { SemanticColor } from '@/theme/props/color.prop'
import type { MarginProps } from '@/theme/props/margin.props'
import { normalizeBooleanPropValue, normalizeEnumPropValue } from '@/theme/props/prop-def'
import type { Color, Radius } from '@/theme/tokens'
import { getRadiusStyles, useThemeRadius } from '../utils'
import {
  progressIndicatorBase,
  progressIndicatorColorStyles,
  progressIndicatorHighContrast,
  progressIndicatorIndeterminate,
  progressRadiusVariants,
  progressRootBase,
  progressSizeVariants,
  progressSoftIndicatorColorStyles,
  progressTrackHighContrast,
  progressTrackVariantStyles,
} from './Progress.css'
import { progressPropDefs } from './progress.props'

export type ProgressSize = (typeof progressPropDefs.size.values)[number]
type ProgressVariant = (typeof progressPropDefs.variant.values)[number]

function resolveProgressSize(size: unknown): ProgressSize {
  if (size === 'xl' || size === '2x' || size === '3x' || size === '4x' || size === '5x') {
    return 'lg'
  }
  const normalized = normalizeEnumPropValue(progressPropDefs.size, typeof size === 'string' ? size : undefined)
  return (normalized as ProgressSize | undefined) ?? progressPropDefs.size.default
}

export interface ProgressProps extends MarginProps {
  /** Current value (0-100 or max) */
  value?: number
  /** Maximum value */
  max?: number
  /** Size of the progress bar */
  size?: ProgressSize
  /** Visual variant */
  variant?: ProgressVariant
  /** Color of the indicator */
  color?: Color
  /** High-contrast mode */
  highContrast?: boolean
  /** Border radius */
  radius?: Radius
  /** Animation duration for indeterminate state */
  duration?: string
  /** Additional class names */
  className?: string
  /** Inline styles */
  style?: React.CSSProperties
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      value,
      max = 100,
      size = 'sm',
      variant = 'surface',
      color = SemanticColor.primary,
      highContrast = progressPropDefs.highContrast.default,
      radius = 'full',
      duration = '1s',
      className,
      style,
      m,
      mx,
      my,
      mt,
      mr,
      mb,
      ml,
      ...props
    },
    ref,
  ) => {
    'use no memo'
    const isIndeterminate = value === undefined
    const progressValue = isIndeterminate ? null : value
    const progressSize = resolveProgressSize(size)
    const safeVariant = (normalizeEnumPropValue(progressPropDefs.variant, variant) ??
      progressPropDefs.variant.default) as ProgressVariant
    const safeColor = (normalizeEnumPropValue(progressPropDefs.color, color) ?? SemanticColor.primary) as Color
    const safeRadius = (normalizeEnumPropValue(progressPropDefs.radius, radius) ??
      progressPropDefs.radius.default) as Radius
    const safeHighContrast = normalizeBooleanPropValue(progressPropDefs.highContrast, highContrast) ?? false
    const resolvedRadius = useThemeRadius(safeRadius)
    const marginProps = getMarginProps({ m, mx, my, mt, mr, mb, ml })
    const boundedMax = Number.isFinite(max) && max > 0 ? max : 100
    const boundedValue =
      Number.isFinite(value) && typeof value === 'number' ? Math.min(Math.max(value, 0), boundedMax) : 0

    return (
      <ProgressPrimitive.Root
        ref={ref}
        value={progressValue}
        max={boundedMax}
        className={cn(
          progressRootBase,
          progressSizeVariants[progressSize],
          progressRadiusVariants[resolvedRadius],
          progressTrackVariantStyles[safeVariant],
          safeHighContrast && progressTrackHighContrast,
          marginProps.className,
          className,
        )}
        style={{ ...marginProps.style, ...getRadiusStyles(resolvedRadius), ...style }}
        {...props}
      >
        <ProgressPrimitive.Indicator
          className={cn(
            progressIndicatorBase,
            progressRadiusVariants[resolvedRadius],
            safeVariant === 'soft'
              ? progressSoftIndicatorColorStyles[safeColor]
              : progressIndicatorColorStyles[safeColor],
            safeHighContrast && progressIndicatorHighContrast,
            isIndeterminate && progressIndicatorIndeterminate,
          )}
          style={
            isIndeterminate
              ? {
                  ['--progress-indeterminate-duration' as string]: duration,
                }
              : {
                  width: `${(boundedValue / boundedMax) * 100}%`,
                }
          }
        />
      </ProgressPrimitive.Root>
    )
  },
)

Progress.displayName = 'Progress'

export { Progress }
