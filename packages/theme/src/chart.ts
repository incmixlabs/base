import { createConcreteThemeResolver, type ThemeResolver, type ThemeTokenMap, type ThemeTokenPath } from './resolver.js'

export const CHART_PALETTE_MODES = ['spectrum', 'monochrome'] as const
export type ChartPaletteMode = (typeof CHART_PALETTE_MODES)[number]

export const CHART_COLOR_KEYS = ['chart1', 'chart2', 'chart3', 'chart4', 'chart5'] as const
export type ChartColorKey = (typeof CHART_COLOR_KEYS)[number]
export type ChartColorToken = ChartColorKey

export const CHART_COLOR_ALIASES = ['chart-1', 'chart-2', 'chart-3', 'chart-4', 'chart-5'] as const
export type ChartColorAlias = (typeof CHART_COLOR_ALIASES)[number]

export const CHART_SEMANTIC_LANES = [
  'slate',
  'primary',
  'secondary',
  'accent',
  'neutral',
  'info',
  'success',
  'warning',
  'error',
  'inverse',
  'light',
  'dark',
] as const
export type ChartSemanticLane = (typeof CHART_SEMANTIC_LANES)[number]

export type ChartColorInput = ChartColorKey | ChartColorAlias | ChartSemanticLane

export const CHART_ROLES = ['track', 'fillSoft', 'fill', 'fillStrong', 'muted', 'text', 'contrast', 'border'] as const
export type ChartRole = (typeof CHART_ROLES)[number]

export type ChartTokenAppearance = 'light' | 'dark'
export type ChartSemanticToken = 'border' | 'surface' | 'soft' | 'primary' | 'text' | 'contrast'
export type ChartHueTokenStep = '4' | '6' | '7' | '9' | '11' | 'contrast'

export type ChartColorLane = {
  hue: string
  light: ChartHueTokenStep
  dark: ChartHueTokenStep
  contrast: ChartHueTokenStep
}

export const CHART_COLOR_LANES = {
  chart1: { hue: 'orange', light: '9', dark: '11', contrast: 'contrast' },
  chart2: { hue: 'cyan', light: '9', dark: '11', contrast: 'contrast' },
  chart3: { hue: 'indigo', light: '11', dark: '11', contrast: 'contrast' },
  chart4: { hue: 'green', light: '9', dark: '11', contrast: 'contrast' },
  chart5: { hue: 'amber', light: '9', dark: '11', contrast: 'contrast' },
} as const satisfies Record<ChartColorKey, ChartColorLane>

export const CHART_ROLE_SEMANTIC_TOKENS = {
  track: 'surface',
  fillSoft: 'soft',
  fill: 'primary',
  fillStrong: 'text',
  muted: 'soft',
  text: 'text',
  contrast: 'contrast',
  border: 'border',
} as const satisfies Record<ChartRole, ChartSemanticToken>

export const CHART_ROLE_HUE_STEPS = {
  track: '4',
  fillSoft: '6',
  fill: '9',
  fillStrong: '11',
  muted: '4',
  text: '11',
  contrast: 'contrast',
  border: '7',
} as const satisfies Record<ChartRole, ChartHueTokenStep>

const chartColorKeySet = new Set<string>(CHART_COLOR_KEYS)
const chartColorAliasSet = new Set<string>(CHART_COLOR_ALIASES)
const chartSemanticLaneSet = new Set<string>(CHART_SEMANTIC_LANES)

export function isChartColorKey(value: string): value is ChartColorKey {
  return chartColorKeySet.has(value)
}

export function isChartColorAlias(value: string): value is ChartColorAlias {
  return chartColorAliasSet.has(value)
}

export function normalizeChartColor(value: string): ChartColorKey | undefined {
  if (isChartColorKey(value)) return value
  if (isChartColorAlias(value)) return `chart${value.slice('chart-'.length)}` as ChartColorKey
  return undefined
}

export function isChartSemanticLane(value: string): value is ChartSemanticLane {
  return chartSemanticLaneSet.has(value)
}

export function normalizeChartSemanticLane(value: string): ChartSemanticLane | undefined {
  return isChartSemanticLane(value) ? value : undefined
}

export function getChartSeriesColorKey(index: number): ChartColorKey {
  const normalizedIndex = ((index % CHART_COLOR_KEYS.length) + CHART_COLOR_KEYS.length) % CHART_COLOR_KEYS.length
  const color = CHART_COLOR_KEYS[normalizedIndex]
  if (!color) throw new Error(`Unable to resolve chart color for index: ${index}`)

  return color
}

export function getChartColorAlias(value: ChartColorKey): ChartColorAlias {
  return `chart-${value.slice('chart'.length)}` as ChartColorAlias
}

function normalizeChartPaletteInput(value: ChartColorInput) {
  return normalizeChartColor(value) ?? normalizeChartSemanticLane(value) ?? value
}

export function getChartPaletteSignature({
  mode,
  color,
  colors,
}: {
  mode: ChartPaletteMode
  color: ChartColorInput
  colors?: readonly ChartColorInput[]
}) {
  return JSON.stringify({
    mode,
    color: normalizeChartPaletteInput(color),
    colors: (colors ?? []).map(normalizeChartPaletteInput),
  })
}

export function getChartLaneHueTokenPath(color: ChartColorKey, step: ChartHueTokenStep): ThemeTokenPath {
  const lane = CHART_COLOR_LANES[color]
  return `global.color.hue.${lane.hue}.${step}`
}

export function getChartLaneColorTokenPath(
  color: ChartColorKey,
  appearance: ChartTokenAppearance = 'light',
): ThemeTokenPath {
  const lane = CHART_COLOR_LANES[color]
  return getChartLaneHueTokenPath(color, lane[appearance])
}

export function getChartLaneContrastTokenPath(color: ChartColorKey): ThemeTokenPath {
  return getChartLaneHueTokenPath(color, CHART_COLOR_LANES[color].contrast)
}

export function getSemanticChartRoleTokenPath(color: ChartSemanticLane, role: ChartRole): ThemeTokenPath {
  const semanticLane = normalizeChartSemanticLane(color)
  if (!semanticLane) throw new Error(`Unsupported chart color: ${color}`)

  return `semantic.color.${semanticLane}.${CHART_ROLE_SEMANTIC_TOKENS[role]}`
}

export function getChartLaneRoleTokenPath(color: ChartColorKey, role: ChartRole): ThemeTokenPath {
  return getChartLaneHueTokenPath(color, CHART_ROLE_HUE_STEPS[role])
}

export function getChartRoleTokenPath(color: ChartColorInput, role: ChartRole): ThemeTokenPath {
  const chartColor = normalizeChartColor(color)
  if (chartColor) return getChartLaneRoleTokenPath(chartColor, role)
  if (isChartSemanticLane(color)) return getSemanticChartRoleTokenPath(color, role)

  throw new Error(`Unsupported chart color: ${color}`)
}

export function resolveChartRoleToken({
  color,
  role,
  resolver,
}: {
  color: ChartColorInput
  role: ChartRole
  resolver: ThemeResolver
}) {
  return resolver(getChartRoleTokenPath(color, role))
}

const defaultConcreteThemeResolver = createConcreteThemeResolver()

export function resolveConcreteChartRoleColor({
  color,
  role,
  resolver,
  tokens,
}: {
  color: ChartColorInput
  role: ChartRole
  resolver?: ThemeResolver
  tokens?: ThemeTokenMap
}) {
  const concreteResolver = resolver ?? (tokens ? createConcreteThemeResolver(tokens) : defaultConcreteThemeResolver)
  return concreteResolver(getChartRoleTokenPath(color, role))
}
