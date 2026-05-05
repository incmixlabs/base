import {
  CHART_COLOR_KEYS,
  CHART_COLOR_LANES,
  CHART_ROLE_HUE_STEPS,
  CHART_ROLE_SEMANTIC_TOKENS,
  type ChartColorToken,
  type ChartPaletteMode,
  type ChartRole,
  createChartThemeTokenOutput,
  createConcreteThemeResolver,
  getChartSeriesColorKey,
  normalizeChartColor,
  type ThemeResolver,
  type ThemeTokenPath,
} from '@incmix/theme'
import type * as React from 'react'
import type { SemanticColorKey, SemanticColorToken } from '@/theme/props/color.prop'
import { chartColorContrastVar, chartColorVar, semanticColorKeys, semanticColorVar } from '@/theme/props/color.prop'
import {
  type PaletteColorToken,
  resolveThemeColorToken,
  SURFACE_COLOR_KEYS,
  type SurfaceColorKey,
} from '@/theme/tokens'

export type ChartPaletteColor = SurfaceColorKey
export type { ChartPaletteMode } from '@incmix/theme'

export const chartPaletteColors = SURFACE_COLOR_KEYS
export const chartSeriesColors = CHART_COLOR_KEYS

const monochromeSeriesRoles: ChartRole[] = ['fillStrong', 'fill', 'border', 'fillSoft', 'track']

function isSemanticColor(value: string): value is SemanticColorKey {
  return (semanticColorKeys as readonly string[]).includes(value)
}

export function getChartSeriesColor(index: number) {
  return chartColorVar(getChartSeriesColorKey(index))
}

export function resolveChartColorValue(color: string | undefined, fallback = getChartSeriesColor(0)) {
  if (!color) return fallback

  const chartColor = normalizeChartColor(color)
  if (chartColor) return chartColorVar(chartColor)
  if (isSemanticColor(color)) return semanticColorVar(color, 'primary')

  return color
}

function resolveChartContrastValue(color: string | undefined, fallback = chartColorContrastVar('chart1')) {
  if (!color) return fallback

  const chartColor = normalizeChartColor(color)
  if (chartColor) return chartColorContrastVar(chartColor)
  if (isSemanticColor(color)) return semanticColorVar(color, 'contrast')

  return fallback
}

function resolveChartLaneRoleColorValue(color: ChartColorToken, role: ChartRole) {
  const lane = CHART_COLOR_LANES[color]
  return resolveThemeColorToken(`${lane.hue}-${CHART_ROLE_HUE_STEPS[role]}` as PaletteColorToken)
}

function getSemanticChartRoleToken(role: ChartRole) {
  return CHART_ROLE_SEMANTIC_TOKENS[role] as SemanticColorToken
}

function resolveChartRoleColorValue(color: ChartPaletteColor, role: ChartRole) {
  const chartColor = normalizeChartColor(color)
  if (chartColor) return resolveChartLaneRoleColorValue(chartColor, role)
  if (isSemanticColor(color)) return semanticColorVar(color, getSemanticChartRoleToken(role))

  return resolveChartColorValue(color)
}

function resolveChartRoleContrastValue(color: ChartPaletteColor) {
  const chartColor = normalizeChartColor(color)
  if (chartColor) return resolveChartLaneRoleColorValue(chartColor, 'contrast')
  if (isSemanticColor(color)) return semanticColorVar(color, 'contrast')

  return resolveChartContrastValue(color)
}

export function resolveChartStyleColor(styles: CSSStyleDeclaration, value: string, fallback: string) {
  const variableMatch = value.match(/^var\((--[^,\s)]+)(?:,\s*([^)]+))?\)$/)
  if (!variableMatch) return value || fallback

  const resolved = styles.getPropertyValue(variableMatch[1]).trim()
  return resolved || variableMatch[2]?.trim() || fallback
}

function getThemeTokenCssValue(path: ThemeTokenPath) {
  const semanticMatch = path.match(/^semantic\.color\.([^.]+)\.([^.]+)$/)
  if (semanticMatch) {
    const [, color, token] = semanticMatch
    return semanticColorVar(color as SemanticColorKey, token as SemanticColorToken)
  }

  const hueMatch = path.match(/^global\.color\.hue\.([^.]+)\.([^.]+)$/)
  if (hueMatch) {
    const [, hue, step] = hueMatch
    return resolveThemeColorToken(`${hue}-${step}` as PaletteColorToken)
  }

  return undefined
}

export function createChartStyleThemeResolver(styles: CSSStyleDeclaration): ThemeResolver {
  const fallbackResolver = createConcreteThemeResolver()

  return path => {
    const fallback = fallbackResolver(path)
    const cssValue = getThemeTokenCssValue(path)
    return cssValue ? resolveChartStyleColor(styles, cssValue, fallback ?? '') : fallback
  }
}

export function createChartStyleThemeTokenOutput(styles: CSSStyleDeclaration) {
  return createChartThemeTokenOutput({
    resolver: createChartStyleThemeResolver(styles),
    resolveRoleColor: ({ color, role, fallback }) => {
      const chartColor = normalizeChartColor(color)
      if (!chartColor) return undefined
      if (role === 'fill') return resolveChartStyleColor(styles, chartColorVar(chartColor), fallback)
      if (role === 'contrast') return resolveChartStyleColor(styles, chartColorContrastVar(chartColor), fallback)
      return undefined
    },
  })
}

function getChartVariableName(index: number) {
  return `--chart-${index + 1}`
}

function getChartContrastVariableName(index: number) {
  return `--chart-${index + 1}-contrast`
}

function getSpectrumVars(colors: ChartPaletteColor[] | undefined) {
  if (!colors?.length) return {}

  return Object.fromEntries(
    chartSeriesColors.map((_, index) => {
      const color = colors[index % colors.length]
      return [getChartVariableName(index), resolveChartColorValue(color, getChartSeriesColor(index))]
    }),
  )
}

function getSpectrumContrastVars(colors: ChartPaletteColor[] | undefined) {
  if (!colors?.length) return {}

  return Object.fromEntries(
    chartSeriesColors.map((_, index) => {
      const color = colors[index % colors.length]
      return [getChartContrastVariableName(index), resolveChartContrastValue(color)]
    }),
  )
}

function getMonochromeVars(color: ChartPaletteColor) {
  const contrast = resolveChartRoleContrastValue(color)

  return Object.fromEntries(
    chartSeriesColors.flatMap((_, index) => {
      const role = monochromeSeriesRoles[index] ?? monochromeSeriesRoles[monochromeSeriesRoles.length - 1]
      const fill = resolveChartRoleColorValue(color, role)

      return [
        [getChartVariableName(index), fill],
        [getChartContrastVariableName(index), contrast],
      ]
    }),
  )
}

export function getChartProviderStyle({
  mode,
  color,
  colors,
}: {
  mode: ChartPaletteMode
  color: ChartPaletteColor
  colors?: ChartPaletteColor[]
}) {
  if (mode === 'monochrome') {
    return getMonochromeVars(color) as React.CSSProperties
  }

  return {
    ...getSpectrumVars(colors),
    ...getSpectrumContrastVars(colors),
  } as React.CSSProperties
}
