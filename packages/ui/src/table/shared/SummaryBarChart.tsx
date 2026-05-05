'use client'

import { createSummaryBarChartModel, type SummaryBarChartDatum, type SummaryBarChartModelBin } from '@incmix/theme'
import { useMemo } from 'react'
import { cn } from '@/lib/utils'
import type { Color } from '@/theme/tokens'
import { SummaryBarChartCanvas } from './SummaryBarChartCanvas'

export type SummaryBarChartBin = SummaryBarChartDatum

export interface SummaryBarChartProps {
  /** Data bins to render as vertical bars */
  data: SummaryBarChartBin[]
  /** Chart height in px (default: 60) */
  height?: number
  /** Primary bar color (default: 'primary') */
  color?: Color
  /** Secondary bar color — used for stacked bars (default: 'error') */
  secondaryColor?: Color
  /** Tooltip label for the primary bar segment */
  primaryLabel?: string
  /** Tooltip label for the secondary bar segment */
  secondaryLabel?: string
  /** Custom class for the container */
  className?: string
}

const SUMMARY_BAR_CHART_MIN_HEIGHT = 48

function getChartLabel(bins: readonly SummaryBarChartModelBin[]) {
  const visibleBins = bins.slice(0, 10)
  const binSummary = visibleBins.map(bin => `${bin.label} ${bin.value}`).join(', ')
  const hiddenCount = bins.length - visibleBins.length
  const hiddenSummary = hiddenCount > 0 ? `, and ${hiddenCount} more` : ''

  return binSummary ? `Summary bar chart: ${binSummary}${hiddenSummary}` : 'Summary bar chart'
}

export function SummaryBarChart({
  data,
  height = 60,
  color = 'primary',
  secondaryColor = 'error',
  primaryLabel = 'Value',
  secondaryLabel = 'Secondary',
  className,
}: SummaryBarChartProps) {
  const model = useMemo(() => (data.length === 0 ? null : createSummaryBarChartModel(data)), [data])
  const safeHeight = Math.max(height, SUMMARY_BAR_CHART_MIN_HEIGHT)

  if (model == null) return null

  return (
    <SummaryBarChartCanvas
      model={model}
      height={safeHeight}
      color={color}
      secondaryColor={secondaryColor}
      primaryLabel={primaryLabel}
      secondaryLabel={secondaryLabel}
      className={cn('block w-full text-foreground', className)}
      label={getChartLabel(model.bins)}
    />
  )
}

SummaryBarChart.displayName = 'SummaryBarChart'
