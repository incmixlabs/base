'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface SparklineProps extends React.SVGAttributes<SVGSVGElement> {
  data: number[]
  width?: number
  height?: number
  strokeWidth?: number
  color?: string
}

function getPoints(data: number[], width: number, height: number, strokeWidth: number) {
  if (!data.length) return ''

  const inset = strokeWidth / 2
  const safeWidth = Math.max(width - strokeWidth, 1)
  const safeHeight = Math.max(height - strokeWidth, 1)
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1

  return data
    .map((value, index) => {
      const x = inset + (index / Math.max(data.length - 1, 1)) * safeWidth
      const y = inset + safeHeight - ((value - min) / range) * safeHeight
      return `${x},${y}`
    })
    .join(' ')
}

export const Sparkline = React.forwardRef<SVGSVGElement, SparklineProps>(
  ({ data, width = 96, height = 28, strokeWidth = 2, color = 'currentColor', className, ...props }, ref) => {
    const points = React.useMemo(() => getPoints(data, width, height, strokeWidth), [data, height, strokeWidth, width])

    return (
      <svg
        ref={ref}
        viewBox={`0 0 ${width} ${height}`}
        width={width}
        height={height}
        fill="none"
        className={cn('overflow-visible', className)}
        role="img"
        aria-label="Sparkline"
        {...props}
      >
        <polyline
          points={points}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  },
)

Sparkline.displayName = 'Sparkline'
