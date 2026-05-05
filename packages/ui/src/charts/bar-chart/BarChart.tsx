'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { normalizeEnumPropValue } from '@/theme/props/prop-def'
import { Text } from '@/typography/text/Text'
import type { ChartPaletteColor } from '../chart-colors'
import { useChartPaletteSignature } from '../chart-palette-context'
import { barChartPropDefs } from './props'

export type BarChartDatum = {
  label: string
  value: number
}

type BarChartColor = ChartPaletteColor

export interface BarChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: BarChartDatum[]
  title?: string
  description?: string
  height?: number
  color?: BarChartColor
  showValueLabels?: boolean
  valueLabelOffset?: number
}

const BarChartCanvas = React.lazy(() => import('./BarChartCanvas').then(module => ({ default: module.BarChartCanvas })))

function assignForwardedRef<T>(ref: React.ForwardedRef<T>, value: T | null) {
  if (typeof ref === 'function') {
    ref(value)
    return
  }

  if (ref) {
    ref.current = value
  }
}

export const BarChart = React.forwardRef<HTMLDivElement, BarChartProps>(
  (
    {
      data,
      title,
      description,
      height = barChartPropDefs.height.default,
      color = barChartPropDefs.color.default,
      showValueLabels = barChartPropDefs.showValueLabels.default,
      valueLabelOffset = barChartPropDefs.valueLabelOffset.default,
      className,
      ...props
    },
    ref,
  ) => {
    const chartRootRef = React.useRef<HTMLDivElement | null>(null)
    const paletteSignature = useChartPaletteSignature()
    const safeColor = (normalizeEnumPropValue(barChartPropDefs.color, color) ??
      barChartPropDefs.color.default) as BarChartColor
    const safeHeight = Math.max(height, 180)

    return (
      <div
        ref={node => {
          chartRootRef.current = node
          assignForwardedRef(ref, node)
        }}
        className={cn('rounded-3xl border border-border/70 bg-background p-5 shadow-sm', className)}
        {...props}
      >
        {title || description ? (
          <div className="space-y-1">
            {title ? (
              <Text size="lg" weight="bold" className="block">
                {title}
              </Text>
            ) : null}
            {description ? (
              <Text size="sm" className="block text-muted-foreground">
                {description}
              </Text>
            ) : null}
          </div>
        ) : null}
        {data.length > 0 ? (
          <React.Suspense
            fallback={
              <div
                className={cn('rounded-2xl bg-muted/20', title || description ? 'mt-5' : undefined)}
                style={{ height: safeHeight }}
              />
            }
          >
            <BarChartCanvas
              data={data}
              height={safeHeight}
              color={safeColor}
              showValueLabels={showValueLabels}
              valueLabelOffset={Math.max(valueLabelOffset, 0)}
              className={cn('block w-full text-foreground', title || description ? 'mt-5' : undefined)}
              label={`${title ?? 'Bar chart'}: ${data.map(item => `${item.label} ${item.value}`).join(', ')}`}
              paletteSignature={paletteSignature}
            />
          </React.Suspense>
        ) : (
          <div
            className={cn(
              'flex items-center justify-center rounded-2xl border border-dashed border-border/70 bg-muted/20 text-sm text-muted-foreground',
              title || description ? 'mt-5' : undefined,
            )}
            style={{ height: safeHeight }}
          >
            Add at least one data point to render the chart.
          </div>
        )}
      </div>
    )
  },
)

BarChart.displayName = 'BarChart'
