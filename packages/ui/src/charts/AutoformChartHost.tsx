'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { useOptionalThemeProviderContext } from '@/theme/theme-provider.context'
import { autoformChartPropDefs } from './autoform-chart.props'
import type {
  AutoformChartDef,
  AutoformChartRenderer,
  AutoformChartRendererMap,
  AutoformChartRenderTheme,
} from './chart-contract'
import { getAutoformChartRows } from './chart-data'
import { resolveAutoformChartRenderer } from './chart-renderer-resolution'

export interface AutoformChartHostProps<TRow = unknown, TChart extends AutoformChartDef<TRow> = AutoformChartDef<TRow>>
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children' | 'data'> {
  chart: TChart
  data?: readonly TRow[]
  width?: number
  height?: number
  theme?: AutoformChartRenderTheme
  isSelected?: boolean
  readonly?: boolean
  renderers?: AutoformChartRendererMap<TRow, TChart>
  defaultRenderers?: AutoformChartRendererMap<TRow, TChart>
  getChartComponent?: AutoformChartRenderer<TRow, TChart>
  loadingFallback?: React.ReactNode
  unsupportedFallback?: React.ReactNode
}

function DefaultChartFallback({ height }: { height: number }) {
  return <div className="rounded-lg bg-muted/20" style={{ minHeight: height }} />
}

function UnsupportedChartFallback<TRow>({ chart, height }: { chart: AutoformChartDef<TRow>; height: number }) {
  return (
    <div
      className="flex items-center justify-center rounded-lg border border-dashed border-border/70 bg-muted/20 p-4 text-muted-foreground text-sm"
      role="status"
      style={{ minHeight: height }}
    >
      No chart renderer registered for {chart.type}.
    </div>
  )
}

export function AutoformChartHost<TRow = unknown, TChart extends AutoformChartDef<TRow> = AutoformChartDef<TRow>>({
  chart,
  data,
  width = autoformChartPropDefs.width.default,
  height = autoformChartPropDefs.height.default,
  theme,
  isSelected,
  readonly,
  renderers,
  defaultRenderers,
  getChartComponent,
  loadingFallback,
  unsupportedFallback,
  className,
  style,
  ...props
}: AutoformChartHostProps<TRow, TChart>) {
  const providerTheme = useOptionalThemeProviderContext()
  const rows = React.useMemo(() => getAutoformChartRows(chart, data), [chart, data])
  const renderer = React.useMemo(
    () => resolveAutoformChartRenderer({ chart, getChartComponent, renderers, defaultRenderers }),
    [chart, defaultRenderers, getChartComponent, renderers],
  )
  const safeHeight = Number.isFinite(height) ? Math.max(height, 48) : 48
  const safeWidth = Number.isFinite(width) && width > 0 ? width : autoformChartPropDefs.width.default
  const renderedChart = renderer
    ? renderer({
        chart,
        data: rows,
        width: safeWidth,
        height: safeHeight,
        theme: theme ?? providerTheme ?? chart.theme,
        isSelected,
        readonly,
      })
    : (unsupportedFallback ?? <UnsupportedChartFallback chart={chart} height={safeHeight} />)

  return (
    <div
      className={cn('min-w-0', className)}
      data-chart-id={chart.id}
      data-chart-type={chart.type}
      style={{
        width: safeWidth > 0 ? safeWidth : undefined,
        minHeight: safeHeight,
        ...style,
      }}
      {...props}
    >
      <React.Suspense fallback={loadingFallback ?? <DefaultChartFallback height={safeHeight} />}>
        {renderedChart}
      </React.Suspense>
    </div>
  )
}

AutoformChartHost.displayName = 'AutoformChartHost'
