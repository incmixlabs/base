'use client'

import * as React from 'react'
import type { ChartPaletteColor } from './chart-colors'
import {
  type AutoformChartDef,
  type AutoformChartRenderer,
  type AutoformChartRendererMap,
  autoformChartTypes,
} from './chart-contract'
import { createAutoformChartSeriesData } from './chart-data'

const LazyBarChart = React.lazy(() => import('./bar-chart/BarChart').then(module => ({ default: module.BarChart })))
const LazyCompactHorizontalChart = React.lazy(() =>
  import('./compact-horizontal-chart/CompactHorizontalChart').then(module => ({
    default: module.CompactHorizontalChart,
  })),
)

function getChartDescription(chart: AutoformChartDef) {
  return chart.subtitle ?? chart.description
}

function getChartColor(chart: AutoformChartDef): ChartPaletteColor | undefined {
  return chart.theme?.color
}

const renderG2BarChart: AutoformChartRenderer = ({ chart, data, height }) => (
  <LazyBarChart
    data={createAutoformChartSeriesData(chart, data)}
    title={chart.title}
    description={getChartDescription(chart)}
    height={height}
    color={getChartColor(chart)}
  />
)

const renderCompactHorizontalChart: AutoformChartRenderer = ({ chart, data }) => (
  <LazyCompactHorizontalChart
    data={createAutoformChartSeriesData(chart, data)}
    title={chart.title}
    description={getChartDescription(chart)}
    color={getChartColor(chart)}
  />
)

export const g2AutoformChartRenderers: AutoformChartRendererMap = {
  [autoformChartTypes.bar]: renderG2BarChart,
  [autoformChartTypes.column]: renderG2BarChart,
}

export const lightweightAutoformChartRenderers: AutoformChartRendererMap = {
  [autoformChartTypes.compactHorizontal]: renderCompactHorizontalChart,
  [autoformChartTypes.horizontal]: renderCompactHorizontalChart,
}

export const defaultAutoformChartRenderers: AutoformChartRendererMap = {
  ...g2AutoformChartRenderers,
  ...lightweightAutoformChartRenderers,
}
