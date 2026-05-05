import { CHART_COLOR_KEYS, CHART_COLOR_LANES, type ChartColorToken } from '@incmix/theme'
import { type PaletteColorToken, resolveThemeColorToken } from './tokens'

type ChartTokenColorMap = Record<ChartColorToken, string>

function resolveChartLaneToken(color: ChartColorToken, appearance: 'light' | 'dark') {
  const lane = CHART_COLOR_LANES[color]
  return resolveThemeColorToken(`${lane.hue}-${lane[appearance]}` as PaletteColorToken)
}

function resolveChartLaneContrastToken(color: ChartColorToken) {
  const lane = CHART_COLOR_LANES[color]
  return resolveThemeColorToken(`${lane.hue}-${lane.contrast}` as PaletteColorToken)
}

function createChartTokenColorMap(appearance: 'light' | 'dark'): ChartTokenColorMap {
  return Object.fromEntries(
    CHART_COLOR_KEYS.map(color => [color, resolveChartLaneToken(color, appearance)]),
  ) as ChartTokenColorMap
}

function createChartContrastTokenMap(): ChartTokenColorMap {
  return Object.fromEntries(
    CHART_COLOR_KEYS.map(color => [color, resolveChartLaneContrastToken(color)]),
  ) as ChartTokenColorMap
}

export const chartLightTokenColorMap = createChartTokenColorMap('light')

export const chartDarkTokenColorMap = createChartTokenColorMap('dark')

export const chartLightContrastTokenMap = createChartContrastTokenMap()

export const chartDarkContrastTokenMap = chartLightContrastTokenMap

export const chartContrastTokenMap = chartLightContrastTokenMap

export const chartTokenColorMap = chartLightTokenColorMap
