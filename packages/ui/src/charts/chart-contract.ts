import type * as React from 'react'
import type { ChartPaletteColor } from './chart-colors'

export const autoformChartTypes = {
  area: 'area',
  bar: 'bar',
  column: 'column',
  compactHorizontal: 'compact-horizontal',
  horizontal: 'horizontal',
  line: 'line',
  pie: 'pie',
  scatter: 'scatter',
  treemap: 'treemap',
} as const

export type AutoformKnownChartType = (typeof autoformChartTypes)[keyof typeof autoformChartTypes]
export type AutoformChartType = AutoformKnownChartType | (string & {})

export type AutoformChartDataSource<TRow = unknown> =
  | {
      kind: 'rows'
      tableId?: string
    }
  | {
      kind: 'sheet-range'
      range: unknown
      tableId?: string
    }
  | {
      kind: 'query'
      queryId: string
    }
  | {
      kind: 'inline'
      rows: readonly TRow[]
    }

export type AutoformChartEncodings = {
  color?: string
  label?: string
  series?: string
  size?: string
  x?: string
  y?: string
}

export type AutoformChartAggregateKind = 'sum' | 'count' | 'avg' | 'min' | 'max'
export type AutoformChartAggregateFunction = (rows: readonly unknown[], valueField: string | undefined) => unknown
export type AutoformChartAggregate = AutoformChartAggregateKind | AutoformChartAggregateFunction

export type AutoformChartTheme = {
  color?: ChartPaletteColor
  secondaryColor?: ChartPaletteColor
  palette?: readonly ChartPaletteColor[]
}

export type AutoformChartInteractions = {
  drilldown?: boolean
  legend?: boolean
  selectable?: boolean
  tooltip?: boolean
}

export type AutoformChartDef<TRow = unknown, TMeta extends Record<string, unknown> = Record<string, unknown>> = {
  id: string
  type: AutoformChartType
  dataSource: AutoformChartDataSource<TRow>
  encodings?: AutoformChartEncodings
  aggregate?: AutoformChartAggregate
  title?: string
  subtitle?: string
  description?: string
  theme?: AutoformChartTheme
  interactions?: AutoformChartInteractions
  meta?: TMeta
}

export type AutoformChartRenderTheme = AutoformChartTheme | object | undefined

export type AutoformChartRendererProps<
  TRow = unknown,
  TChart extends AutoformChartDef<TRow> = AutoformChartDef<TRow>,
> = {
  chart: TChart
  data: readonly TRow[]
  width: number
  height: number
  theme: AutoformChartRenderTheme
  isSelected?: boolean
  readonly?: boolean
}

export type AutoformChartRenderer<TRow = unknown, TChart extends AutoformChartDef<TRow> = AutoformChartDef<TRow>> = (
  props: AutoformChartRendererProps<TRow, TChart>,
) => React.ReactElement | null

export type AutoformChartRendererMap<
  TRow = unknown,
  TChart extends AutoformChartDef<TRow> = AutoformChartDef<TRow>,
> = Partial<Record<AutoformChartType, AutoformChartRenderer<TRow, TChart>>>
