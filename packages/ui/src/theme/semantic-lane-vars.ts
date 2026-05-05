import {
  type SemanticHue,
  type SemanticLane,
  THEME_COLOR_VARIANT_DEFAULTS,
  type ThemeColorVariantSteps,
} from './tokens'

export const SEMANTIC_LANE_VAR_TOKENS = [
  'border',
  'border-subtle',
  'surface',
  'surface-hover',
  'soft',
  'soft-hover',
  'primary',
  'primary-alpha',
  'text',
  'contrast',
  'background',
] as const

type SemanticLaneToken = (typeof SEMANTIC_LANE_VAR_TOKENS)[number]

type SemanticCssMode = 'light' | 'dark'

type StaticLaneMap = Record<Exclude<SemanticLane, 'light' | 'dark'>, SemanticHue>

type SemanticCssCommentMode = 'root' | 'media-dark' | 'class-dark'

const STATIC_LANE_LABELS: Record<Exclude<SemanticLane, 'light' | 'dark'>, string> = {
  primary: 'Primary',
  slate: 'Slate',
  neutral: 'Neutral',
  inverse: 'Inverse',
  secondary: 'Secondary',
  accent: 'Accent',
  info: 'Info',
  success: 'Success',
  warning: 'Warning',
  error: 'Error',
}

const STATIC_LANE_DESCRIPTIONS: Record<Exclude<SemanticLane, 'light' | 'dark'>, string> = {
  primary: 'semantic teal lane, independent from theme accent',
  slate: 'gray',
  neutral: 'alias of theme surface lane',
  inverse: 'theme-flip',
  secondary: 'blue',
  accent: 'purple',
  info: 'blue',
  success: 'green',
  warning: 'amber',
  error: 'red',
}

function toSentenceCase(value: string): string {
  if (!value) return value
  return value.slice(0, 1).toUpperCase() + value.slice(1)
}

const STATIC_SURFACE_LANES: Record<'light' | 'dark', Record<SemanticLaneToken, string>> = {
  light: {
    border: 'color-mix(in oklch, black 12%, white)',
    'border-subtle': 'color-mix(in oklch, black 8%, white)',
    surface: 'oklch(1 0 0)',
    'surface-hover': 'oklch(0.975 0 0)',
    soft: 'oklch(0.975 0 0)',
    'soft-hover': 'oklch(0.95 0 0)',
    primary: 'oklch(1 0 0)',
    'primary-alpha': 'color-mix(in oklch, white 16%, transparent)',
    text: 'oklch(0.22 0 0)',
    contrast: 'oklch(0.18 0 0)',
    background: 'oklch(1 0 0)',
  },
  dark: {
    border: 'color-mix(in oklch, white 20%, black)',
    'border-subtle': 'color-mix(in oklch, white 14%, black)',
    surface: 'oklch(0.23 0 0)',
    'surface-hover': 'oklch(0.27 0 0)',
    soft: 'oklch(0.27 0 0)',
    'soft-hover': 'oklch(0.31 0 0)',
    primary: 'oklch(0.17 0 0)',
    'primary-alpha': 'color-mix(in oklch, black 24%, transparent)',
    text: 'oklch(0.95 0 0)',
    contrast: 'oklch(0.98 0 0)',
    background: 'oklch(0.14 0 0)',
  },
}

const STATIC_LIGHT_LANES: StaticLaneMap = {
  primary: 'teal',
  slate: 'gray',
  neutral: 'white',
  inverse: 'black',
  secondary: 'blue',
  accent: 'purple',
  info: 'blue',
  success: 'green',
  warning: 'amber',
  error: 'red',
}

const STATIC_DARK_LANES: StaticLaneMap = {
  primary: 'teal',
  slate: 'gray',
  neutral: 'black',
  inverse: 'white',
  secondary: 'blue',
  accent: 'purple',
  info: 'blue',
  success: 'green',
  warning: 'amber',
  error: 'red',
}

const STATIC_ROOT_ORDER: Array<Exclude<SemanticLane, 'light' | 'dark'>> = [
  'primary',
  'slate',
  'neutral',
  'inverse',
  'secondary',
  'accent',
  'info',
  'success',
  'warning',
  'error',
]

const STATIC_DARK_ORDER: Array<Exclude<SemanticLane, 'light' | 'dark'>> = [
  'primary',
  'slate',
  'neutral',
  'inverse',
  'secondary',
  'accent',
  'info',
  'success',
  'warning',
  'error',
]

function getAliasLane(hue: SemanticHue): SemanticLane | undefined {
  if (hue === 'slate') return 'slate'
  if (hue === 'neutral') return 'neutral'
  if (hue === 'inverse') return 'inverse'
  if (hue === 'black') return 'dark'
  if (hue === 'white') return 'light'
  return undefined
}

function getHueToken(hue: SemanticHue, shade: number | 'contrast') {
  return `var(--${hue}-${shade})`
}

export function buildSemanticLaneVars(
  semanticColors: Record<SemanticLane, SemanticHue>,
  variantSteps: ThemeColorVariantSteps = THEME_COLOR_VARIANT_DEFAULTS,
): Record<string, string> {
  const result: Record<string, string> = {}

  for (const [lane, hue] of Object.entries(semanticColors) as Array<[SemanticLane, SemanticHue]>) {
    const aliasLane = getAliasLane(hue)
    if (aliasLane) {
      if (aliasLane === lane) continue
      for (const token of SEMANTIC_LANE_VAR_TOKENS) {
        result[`--color-${lane}-${token}`] = `var(--color-${aliasLane}-${token})`
      }
      continue
    }

    const borderShade = lane === 'primary' ? variantSteps.solid : variantSteps.border
    const borderSubtleShade = lane === 'primary' ? variantSteps.border : variantSteps.borderSubtle
    result[`--color-${lane}-border`] = getHueToken(hue, borderShade)
    result[`--color-${lane}-border-subtle`] = getHueToken(hue, borderSubtleShade)
    result[`--color-${lane}-surface`] = getHueToken(hue, variantSteps.surface)
    result[`--color-${lane}-surface-hover`] = getHueToken(hue, variantSteps.surfaceHover)
    result[`--color-${lane}-soft`] = getHueToken(hue, variantSteps.soft)
    result[`--color-${lane}-soft-hover`] = getHueToken(hue, variantSteps.softHover)
    result[`--color-${lane}-primary`] = getHueToken(hue, variantSteps.solid)
    result[`--color-${lane}-primary-alpha`] =
      `color-mix(in oklch, ${getHueToken(hue, variantSteps.solid)} 12%, transparent)`
    result[`--color-${lane}-text`] = getHueToken(hue, variantSteps.text)
    result[`--color-${lane}-contrast`] = getHueToken(hue, 'contrast')
    result[`--color-${lane}-background`] = 'var(--background)'
  }

  return result
}

function renderVarBlock(vars: Record<string, string>, indent: string) {
  return Object.entries(vars)
    .map(([name, value]) => `${indent}${name}: ${value};`)
    .join('\n')
}

function getCommentText(
  lane: Exclude<SemanticLane, 'light' | 'dark'>,
  mode: SemanticCssMode,
  commentMode: SemanticCssCommentMode,
) {
  if (lane === 'primary') {
    return mode === 'light'
      ? 'Primary Colors (semantic teal lane, independent from theme accent)'
      : commentMode === 'class-dark'
        ? 'Primary Colors (semantic teal lane) — Dark'
        : 'Primary Colors (semantic teal lane) — Dark'
  }

  if (lane === 'slate') {
    if (mode === 'light') return 'Default (Gray) Colors'
    return 'Default (Gray) Colors — Dark'
  }

  if (lane === 'neutral') {
    if (mode === 'light') return 'Neutral (alias of Light surface lane)'
    return 'Neutral (alias of theme surface lane) — Dark'
  }

  if (lane === 'inverse') {
    if (mode === 'light') return 'Inverse lane: theme-flip (dark in light mode, light in dark mode)'
    return 'Inverse lane: theme-flip (light in dark mode)'
  }

  const label = STATIC_LANE_LABELS[lane]
  const description = STATIC_LANE_DESCRIPTIONS[lane]
  if (mode === 'light') {
    const readable = lane === 'warning' ? 'Orange/Yellow' : toSentenceCase(description)
    return `${label} (${readable}) Colors`
  }

  const readable = lane === 'warning' ? 'Orange' : toSentenceCase(description)
  return `${label} (${readable}) Colors — Dark`
}

function renderStaticLaneBlock(
  lane: Exclude<SemanticLane, 'light' | 'dark'>,
  hue: SemanticHue,
  mode: SemanticCssMode,
  commentMode: SemanticCssCommentMode,
  indent: string,
) {
  const aliasLane = getAliasLane(hue)
  const comment = `${indent}/* ${getCommentText(lane, mode, commentMode)} */`

  const vars = aliasLane
    ? Object.fromEntries(
        SEMANTIC_LANE_VAR_TOKENS.map(token => [`--color-${lane}-${token}`, `var(--color-${aliasLane}-${token})`]),
      )
    : buildSemanticLaneVars({ [lane]: hue } as Record<SemanticLane, SemanticHue>)

  return `${comment}\n${renderVarBlock(vars, indent)}`
}

function renderStaticSurfaceLaneBlock(lane: 'light' | 'dark', indent: string) {
  const label = lane === 'light' ? 'Static light surface lane' : 'Static dark surface lane'
  const vars = Object.fromEntries(
    SEMANTIC_LANE_VAR_TOKENS.map(token => [`--color-${lane}-${token}`, STATIC_SURFACE_LANES[lane][token]]),
  )
  return `${indent}/* ${label} */\n${renderVarBlock(vars, indent)}`
}

export function buildStaticSemanticLaneCss(mode: SemanticCssMode, commentMode: SemanticCssCommentMode): string {
  const lanes = mode === 'light' ? STATIC_LIGHT_LANES : STATIC_DARK_LANES
  const order = mode === 'light' ? STATIC_ROOT_ORDER : STATIC_DARK_ORDER
  const blocks: string[] = []
  const indent = mode === 'dark' && commentMode === 'media-dark' ? '    ' : '  '

  for (const lane of order) {
    if (lane === 'inverse' && mode === 'light') {
      blocks.push(renderStaticSurfaceLaneBlock('light', indent))
      blocks.push(renderStaticSurfaceLaneBlock('dark', indent))
    }
    blocks.push(renderStaticLaneBlock(lane, lanes[lane], mode, commentMode, indent))
  }

  let css = ''
  for (let index = 0; index < blocks.length; index++) {
    const current = blocks[index]
    if (!current) continue

    if (index > 0) {
      const previous = blocks[index - 1]
      const compactJoin = previous?.includes('/* Default (Gray) Colors') && current.includes('/* Neutral (alias of ')
      css += compactJoin ? '\n' : '\n\n'
    }
    css += current
  }

  return css
}
