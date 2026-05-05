import type { BarChartSpecColors } from './bar-chart-spec.js'
import {
  CHART_COLOR_KEYS,
  CHART_ROLES,
  CHART_SEMANTIC_LANES,
  type ChartColorInput,
  type ChartColorKey,
  type ChartRole,
  type ChartSemanticLane,
  isChartSemanticLane,
  normalizeChartColor,
  resolveConcreteChartRoleColor,
} from './chart.js'
import type { MapChartModelColors } from './map-chart-model.js'
import { createConcreteThemeResolver, type ThemeResolver, type ThemeTokenMap, type ThemeTokenPath } from './resolver.js'
import type { SummaryBarChartSpecColors } from './summary-bar-chart-spec.js'

export type ChartThemeBaseColors = {
  foreground: string
  muted: string
  border: string
}

export type ChartThemeRoleColors = Record<ChartRole, string>

export type ChartThemeTokenOutput = {
  base: ChartThemeBaseColors
  chart: Record<ChartColorKey, ChartThemeRoleColors>
  semantic: Record<ChartSemanticLane, ChartThemeRoleColors>
  map: MapChartModelColors
}

export type ChartThemeRoleColorResolverInput = {
  color: ChartColorInput
  role: ChartRole
  fallback: string
}

export type ChartThemeRoleColorResolver = (input: ChartThemeRoleColorResolverInput) => string | undefined

export type CreateChartThemeTokenOutputOptions = {
  resolver?: ThemeResolver
  tokens?: ThemeTokenMap
  resolveRoleColor?: ChartThemeRoleColorResolver
}

const CHART_THEME_TOKEN_PATHS = {
  foreground: 'semantic.color.neutral.text',
  muted: 'semantic.color.slate.text',
  border: 'semantic.color.slate.soft',
  mapBaseFill: 'semantic.color.slate.soft',
  mapBaseStroke: 'semantic.color.neutral.surface',
  mapActiveStroke: 'semantic.color.neutral.border',
  mapActiveTextFill: 'semantic.color.dark.contrast',
} as const satisfies Record<string, ThemeTokenPath>

function resolveRequiredToken(resolver: ThemeResolver, path: ThemeTokenPath) {
  const value = resolver(path)
  if (!value) throw new Error(`Unable to resolve chart theme token: ${path}`)
  return value
}

function createRoleColors({
  color,
  resolver,
  resolveRoleColor,
}: {
  color: ChartColorInput
  resolver: ThemeResolver
  resolveRoleColor?: ChartThemeRoleColorResolver
}) {
  return Object.fromEntries(
    CHART_ROLES.map(role => {
      const fallback = resolveConcreteChartRoleColor({ color, role, resolver })
      if (!fallback) throw new Error(`Unable to resolve chart color "${color}" role "${role}"`)

      return [role, resolveRoleColor?.({ color, role, fallback }) ?? fallback]
    }),
  ) as ChartThemeRoleColors
}

export function isChartThemeColorInput(color: string): color is ChartColorInput {
  return normalizeChartColor(color) !== undefined || isChartSemanticLane(color)
}

export function createChartThemeTokenOutput({
  resolver,
  tokens,
  resolveRoleColor,
}: CreateChartThemeTokenOutputOptions = {}): ChartThemeTokenOutput {
  const themeResolver = resolver ?? createConcreteThemeResolver(tokens)
  const base: ChartThemeBaseColors = {
    foreground: resolveRequiredToken(themeResolver, CHART_THEME_TOKEN_PATHS.foreground),
    muted: resolveRequiredToken(themeResolver, CHART_THEME_TOKEN_PATHS.muted),
    border: resolveRequiredToken(themeResolver, CHART_THEME_TOKEN_PATHS.border),
  }

  return {
    base,
    chart: Object.fromEntries(
      CHART_COLOR_KEYS.map(color => [color, createRoleColors({ color, resolver: themeResolver, resolveRoleColor })]),
    ) as Record<ChartColorKey, ChartThemeRoleColors>,
    semantic: Object.fromEntries(
      CHART_SEMANTIC_LANES.map(color => [
        color,
        createRoleColors({ color, resolver: themeResolver, resolveRoleColor }),
      ]),
    ) as Record<ChartSemanticLane, ChartThemeRoleColors>,
    map: {
      baseFill: resolveRequiredToken(themeResolver, CHART_THEME_TOKEN_PATHS.mapBaseFill),
      baseStroke: resolveRequiredToken(themeResolver, CHART_THEME_TOKEN_PATHS.mapBaseStroke),
      activeStroke: resolveRequiredToken(themeResolver, CHART_THEME_TOKEN_PATHS.mapActiveStroke),
      activeTextFill: resolveRequiredToken(themeResolver, CHART_THEME_TOKEN_PATHS.mapActiveTextFill),
      mutedText: base.muted,
    },
  }
}

export function resolveChartThemeRoleColor({
  theme,
  color,
  role,
}: {
  theme: ChartThemeTokenOutput
  color: ChartColorInput
  role: ChartRole
}) {
  const chartColor = normalizeChartColor(color)
  if (chartColor) return theme.chart[chartColor][role]
  if (isChartSemanticLane(color)) return theme.semantic[color][role]

  throw new Error(`Unsupported chart color: ${color}`)
}

export function resolveChartThemeColor({
  theme,
  color,
  fallbackColor,
  role,
}: {
  theme: ChartThemeTokenOutput
  color?: string
  fallbackColor: ChartColorInput
  role: ChartRole
}) {
  if (color === undefined) return resolveChartThemeRoleColor({ theme, color: fallbackColor, role })
  if (isChartThemeColorInput(color)) return resolveChartThemeRoleColor({ theme, color, role })
  return color
}

export function createBarChartSpecColors({
  theme,
  color,
}: {
  theme: ChartThemeTokenOutput
  color: ChartColorInput
}): BarChartSpecColors {
  return {
    foreground: theme.base.foreground,
    muted: theme.base.muted,
    border: theme.base.border,
    fill: resolveChartThemeRoleColor({ theme, color, role: 'fill' }),
    fillSoft: resolveChartThemeRoleColor({ theme, color, role: 'fillSoft' }),
  }
}

export function createSummaryBarChartSpecColors({
  theme,
  color,
  secondaryColor,
}: {
  theme: ChartThemeTokenOutput
  color: ChartColorInput
  secondaryColor: ChartColorInput
}): SummaryBarChartSpecColors {
  return {
    foreground: theme.base.foreground,
    muted: theme.base.muted,
    border: theme.base.border,
    primaryFill: resolveChartThemeRoleColor({ theme, color, role: 'fill' }),
    secondaryFill: resolveChartThemeRoleColor({ theme, color: secondaryColor, role: 'fill' }),
  }
}

export function createMapChartModelColors(theme: ChartThemeTokenOutput): MapChartModelColors {
  return { ...theme.map }
}
