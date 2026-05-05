import { normalizeChartColor as normalizeSharedChartColor } from '@incmix/theme'
import {
  type ChartColorAlias,
  type ChartColorToken,
  type Color,
  SURFACE_COLOR_KEYS,
  type SurfaceColorKey,
} from '@/theme/tokens'
import type { PropDef } from './prop-def'

export const SemanticColor = {
  // Explicit gray/slate lane. This is not the adaptive theme-surface lane.
  slate: 'slate',
  primary: 'primary',
  secondary: 'secondary',
  accent: 'accent',
  // Adaptive theme-surface lane: light in light mode, dark in dark mode.
  neutral: 'neutral',
  info: 'info',
  success: 'success',
  warning: 'warning',
  error: 'error',
  inverse: 'inverse',
  light: 'light',
  dark: 'dark',
} as const

export type SemanticColorKey = (typeof SemanticColor)[keyof typeof SemanticColor]

// Semantic colors used by components (designTokens.color)
const semanticColors = [...new Set(Object.values(SemanticColor))] as SemanticColorKey[]

// Extended semantic palette for surface/indicator components
const semanticColorKeys = semanticColors

export type SemanticColorToken =
  | 'border'
  | 'surface'
  | 'surface-hover'
  | 'soft'
  | 'soft-hover'
  | 'primary'
  | 'primary-alpha'
  | 'text'
  | 'contrast'

const semanticColorOverrides: Partial<Record<SemanticColorKey, Color>> = {
  slate: 'slate',
}
const interactiveFillColorAliases: Partial<Record<SemanticColorKey, SemanticColorKey>> = {
  neutral: SemanticColor.inverse,
}
const interactiveReadableColorAliases: Partial<Record<SemanticColorKey, SemanticColorKey>> = {
  light: SemanticColor.neutral,
  dark: SemanticColor.neutral,
}

const semanticColorAliasByKey = semanticColorKeys.reduce(
  (acc, key) => {
    const base = key as Color
    acc[key] = semanticColorOverrides[key] ?? base
    return acc
  },
  {} as Record<SemanticColorKey, Color>,
)

type SemanticColorInput = Color | SemanticColorKey

export function normalizeChartColor(color: string): ChartColorToken | undefined {
  return normalizeSharedChartColor(color)
}

function requireChartColor(color: ChartColorToken | ChartColorAlias): ChartColorToken {
  const chartColor = normalizeChartColor(color)
  if (!chartColor) throw new Error(`Unsupported chart color: ${color}`)

  return chartColor
}

function requireSemanticColor(color: SemanticColorInput): SemanticColorKey {
  if (!Object.hasOwn(semanticColorAliasByKey, color)) {
    throw new Error(`Unsupported semantic color: ${color}`)
  }

  return color
}

export function chartColorVar(color: ChartColorToken | ChartColorAlias): string {
  const chartColor = requireChartColor(color)
  return `var(--chart-${chartColor.slice('chart'.length)})`
}

export function chartColorContrastVar(color: ChartColorToken | ChartColorAlias): string {
  const chartColor = requireChartColor(color)
  return `var(--chart-${chartColor.slice('chart'.length)}-contrast)`
}

export function semanticColorVar(color: SemanticColorInput, token: SemanticColorToken): string {
  const resolved = semanticColorAliasByKey[requireSemanticColor(color)]
  return `var(--color-${resolved}-${token})`
}

export function resolveInteractiveFillColor(color: SemanticColorInput): SemanticColorKey {
  const semanticColor = requireSemanticColor(color)
  return interactiveFillColorAliases[semanticColor] ?? semanticColor
}

export function resolveSurfaceToneColor(color: SemanticColorInput): SemanticColorKey {
  return requireSemanticColor(color)
}

export function resolveInteractiveUnfilledColor(color: SemanticColorInput): SemanticColorKey {
  const semanticColor = requireSemanticColor(color)
  return interactiveReadableColorAliases[semanticColor] ?? semanticColor
}

export function resolveInteractiveForegroundToken(color: SemanticColorInput): SemanticColorToken {
  return requireSemanticColor(color) === SemanticColor.inverse ? 'primary' : 'text'
}

// prettier-ignore
const accentColors = [
  'gray',
  'gold',
  'bronze',
  'brown',
  'yellow',
  'amber',
  'orange',
  'tomato',
  'red',
  'ruby',
  'crimson',
  'pink',
  'plum',
  'purple',
  'violet',
  'iris',
  'indigo',
  'blue',
  'cyan',
  'teal',
  'green',
  'lime',
  'mint',
  'sky',
] as const

const grayColors = ['auto', 'gray', 'mauve', 'slate', 'sage', 'olive', 'sand'] as const

const colorPropDef = {
  color: {
    type: 'enum',
    values: semanticColors,
    default: undefined as (typeof semanticColors)[number] | undefined,
  },
} satisfies {
  color: PropDef<(typeof semanticColors)[number]>
}

const semanticColorPropDef = {
  color: {
    type: 'enum',
    values: semanticColorKeys,
    default: undefined as (typeof semanticColorKeys)[number] | undefined,
  },
} satisfies {
  color: PropDef<(typeof semanticColorKeys)[number]>
}

const surfaceColorPropDef = {
  color: {
    type: 'enum',
    values: SURFACE_COLOR_KEYS,
    default: undefined as (typeof SURFACE_COLOR_KEYS)[number] | undefined,
  },
} satisfies {
  color: PropDef<SurfaceColorKey>
}

const surfaceTonePropDef = {
  tone: {
    type: 'enum',
    values: SURFACE_COLOR_KEYS,
    default: undefined as (typeof SURFACE_COLOR_KEYS)[number] | undefined,
  },
} satisfies {
  tone: PropDef<SurfaceColorKey>
}

// 1. When used on components that compose Text, sets the color of the text to the current accent.
// 2. Defines accent color for descendant text components with `highContrast={true}`.
const accentColorPropDef = {
  color: {
    type: 'enum',
    values: accentColors,
    default: '' as (typeof accentColors)[number],
  },
} satisfies {
  color: PropDef<(typeof accentColors)[number]>
}

export {
  accentColorPropDef,
  surfaceColorPropDef,
  surfaceTonePropDef,
  colorPropDef,
  semanticColorPropDef,
  //
  accentColors,
  semanticColors,
  semanticColorKeys,
  grayColors,
}
