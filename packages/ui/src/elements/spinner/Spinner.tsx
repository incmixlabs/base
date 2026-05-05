'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { SemanticColor } from '@/theme/props/color.prop'
import { normalizeEnumPropValue } from '@/theme/props/prop-def'
import type { Color } from '@/theme/tokens'
import {
  codeSpinnerBase,
  codeSpinnerBrace,
  codeSpinnerSizeVariants,
  sparkleGlyphBig,
  sparkleGlyphSmallBottom,
  sparkleGlyphSmallTop,
  sparkleSpinnerBase,
  sparkleSpinnerHalo,
  sparkleSpinnerSizeVariants,
  spinnerColorVariants,
  spinnerRoot,
  spinnerSizeVariants,
  spinnerSrOnly,
  spinnerVisual,
} from './Spinner.css'
import { spinnerPropDefs } from './spinner.props'

export type SpinnerSize = (typeof spinnerPropDefs.size.values)[number]
export type SpinnerVariant = (typeof spinnerPropDefs.variant.values)[number]

function resolveSpinnerSize(size: unknown): SpinnerSize {
  if (size === 'xl' || size === '2x' || size === '3x' || size === '4x' || size === '5x') return 'lg'
  if (size === 'xs') return size
  const normalized = normalizeEnumPropValue(spinnerPropDefs.size, typeof size === 'string' ? size : undefined)
  if (normalized === 'sm' || normalized === 'md' || normalized === 'lg') return normalized
  return 'md'
}

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Size of the spinner */
  size?: SpinnerSize
  /** Visual loading style */
  variant?: SpinnerVariant
  /** Whether to show loading state */
  loading?: boolean
  /** Semantic color */
  color?: Color
}

const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  (
    {
      size = 'md',
      variant = spinnerPropDefs.variant.default,
      loading = true,
      color = SemanticColor.primary,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const spinnerSize = resolveSpinnerSize(size)
    const safeVariant = (normalizeEnumPropValue(spinnerPropDefs.variant, variant) ??
      spinnerPropDefs.variant.default) as SpinnerVariant
    const safeColor = (normalizeEnumPropValue(spinnerPropDefs.color, color) ?? SemanticColor.primary) as Color

    if (!loading) {
      return <>{children}</>
    }

    if (safeVariant === 'code') {
      return (
        <div ref={ref} role="status" aria-label="Loading" className={cn(spinnerRoot, className)} {...props}>
          <span
            className={cn(spinnerColorVariants[safeColor], codeSpinnerBase, codeSpinnerSizeVariants[spinnerSize])}
            aria-hidden
          >
            <span className={codeSpinnerBrace}>{'{'}</span>
            <span className={codeSpinnerBrace}>{'}'}</span>
          </span>
          <span className={spinnerSrOnly}>Loading...</span>
        </div>
      )
    }

    if (safeVariant === 'ai') {
      return (
        <div ref={ref} role="status" aria-label="Loading" className={cn(spinnerRoot, className)} {...props}>
          <span
            className={cn(spinnerColorVariants[safeColor], sparkleSpinnerBase, sparkleSpinnerSizeVariants[spinnerSize])}
            aria-hidden
          >
            <span className={sparkleSpinnerHalo} />
            <svg viewBox="0 0 24 24" className={sparkleGlyphBig}>
              <path d="M12 0.9 14.6 9.4 23.1 12l-8.5 2.6L12 23.1l-2.6-8.5L0.9 12l8.5-2.6z" />
            </svg>
            <svg viewBox="0 0 24 24" className={sparkleGlyphSmallTop}>
              <path d="M12 2.4 13.8 10.2 21.6 12l-7.8 1.8L12 21.6l-1.8-7.8L2.4 12l7.8-1.8z" />
            </svg>
            <svg viewBox="0 0 24 24" className={sparkleGlyphSmallBottom}>
              <path d="M12 3.2 13.5 10.5 20.8 12l-7.3 1.5L12 20.8l-1.5-7.3L3.2 12l7.3-1.5z" />
            </svg>
          </span>
          <span className={spinnerSrOnly}>Loading...</span>
        </div>
      )
    }

    return (
      <div ref={ref} role="status" aria-label="Loading" className={cn(spinnerRoot, className)} {...props}>
        <span
          className={cn(spinnerColorVariants[safeColor], spinnerVisual, spinnerSizeVariants[spinnerSize])}
          aria-hidden
        />
        <span className={spinnerSrOnly}>Loading...</span>
      </div>
    )
  },
)

Spinner.displayName = 'Spinner'

export { Spinner }
