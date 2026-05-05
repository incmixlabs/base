'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { normalizeEnumPropValue } from '@/theme/props/prop-def'
import { aspectRatioByRatio, aspectRatioCustom } from './AspectRatio.css'
import { aspectRatioPropDefs } from './aspect-ratio.props'

type Ratio = (typeof aspectRatioPropDefs.ratio.values)[number]

export interface AspectRatioProps extends React.ComponentPropsWithoutRef<'div'> {
  /** Predefined aspect ratio */
  ratio?: Ratio
  /** Custom aspect ratio as number (width/height) */
  customRatio?: number
}

const AspectRatio = React.forwardRef<HTMLDivElement, AspectRatioProps>(
  ({ ratio = '16/9', customRatio, className, children, style, ...props }, ref) => {
    const hasCustomRatio = customRatio !== undefined
    const safeRatio = (normalizeEnumPropValue(aspectRatioPropDefs.ratio, ratio) ??
      aspectRatioPropDefs.ratio.default ??
      '16/9') as Ratio
    const isPositiveFiniteCustomRatio =
      typeof customRatio === 'number' && Number.isFinite(customRatio) && customRatio > 0
    const resolvedStyle = hasCustomRatio
      ? {
          ...style,
          ...(isPositiveFiniteCustomRatio ? { aspectRatio: `${customRatio} / 1` } : {}),
        }
      : style

    return (
      <div
        ref={ref}
        className={cn(
          'relative overflow-hidden',
          hasCustomRatio ? aspectRatioCustom : aspectRatioByRatio[safeRatio],
          className,
        )}
        style={resolvedStyle}
        {...props}
      >
        {children}
      </div>
    )
  },
)

AspectRatio.displayName = 'AspectRatio'

export { AspectRatio }
