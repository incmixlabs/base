import {
  CHART_COLOR_ALIASES,
  CHART_COLOR_KEYS,
  type ChartColorAlias,
  type ChartColorToken,
  themeSizeTokens,
} from '@incmix/theme'
import type { accentColors, grayColors } from './props/color.prop'

/** designTokens export. */
export const designTokens = {
  // Element sizes: t-shirt scale (xs-2x). Components expose a slice of this scale.
  size: themeSizeTokens,

  // Font weights
  weight: {
    light: '300',
    regular: '400',
    medium: '500',
    bold: '700',
  },

  radius: {
    none: '0',
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    full: '9999px',
  },

  variant: {
    solid: {
      background: 'var(--color-accent-9)',
      color: 'var(--color-accent-contrast)',
      hoverBackground: 'var(--color-accent-10)',
      activeBackground: 'var(--color-accent-10)',
    },
    soft: {
      background: 'var(--color-accent-a3)',
      color: 'var(--color-accent-11)',
      hoverBackground: 'var(--color-accent-a4)',
      activeBackground: 'var(--color-accent-a5)',
    },
    outline: {
      border: '1px solid',
      borderColor: 'var(--color-accent-a8)',
      background: 'transparent',
      color: 'var(--color-accent-11)',
      hoverBackground: 'var(--color-accent-a2)',
      activeBackground: 'var(--color-accent-a3)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--color-accent-11)',
      hoverBackground: 'var(--color-accent-a3)',
      activeBackground: 'var(--color-accent-a4)',
    },
    classic: {
      background: 'var(--color-surface)',
      color: 'var(--color-accent-12)',
      border: '1px solid',
      borderColor: 'var(--color-accent-a6)',
      hoverBackground: 'var(--color-accent-a2)',
      activeBackground: 'var(--color-accent-a3)',
    },
    surface: {
      background: 'var(--color-accent-a2)',
      color: 'var(--color-accent-11)',
      border: '1px solid',
      borderColor: 'var(--color-accent-a6)',
      hoverBackground: 'var(--color-accent-a3)',
      activeBackground: 'var(--color-accent-a4)',
    },
  },

  color: {
    // Explicit gray/slate lane. Surface-like components should usually prefer neutral.
    slate: {
      border: 'var(--color-slate-border)',
      borderSubtle: 'var(--color-slate-border-subtle)',
      surface: 'var(--color-slate-surface)',
      surfaceHover: 'var(--color-slate-surface-hover)',
      softBackground: 'var(--color-slate-soft)',
      softBackgroundHover: 'var(--color-slate-soft-hover)',
      primary: 'var(--color-slate-primary)',
      primaryAlpha: 'var(--color-slate-primary-alpha)',
      text: 'var(--color-slate-text)',
      contrast: 'var(--color-slate-contrast)',
      background: 'var(--color-slate-background)',
    },
    primary: {
      border: 'var(--color-primary-border)',
      borderSubtle: 'var(--color-primary-border-subtle)',
      surface: 'var(--color-primary-surface)',
      surfaceHover: 'var(--color-primary-surface-hover)',
      softBackground: 'var(--color-primary-soft)',
      softBackgroundHover: 'var(--color-primary-soft-hover)',
      primary: 'var(--color-primary-primary)',
      primaryAlpha: 'var(--color-primary-primary-alpha)',
      text: 'var(--color-primary-text)',
      contrast: 'var(--color-primary-contrast)',
      background: 'var(--color-primary-background)',
    },
    secondary: {
      border: 'var(--color-secondary-border)',
      borderSubtle: 'var(--color-secondary-border-subtle)',
      surface: 'var(--color-secondary-surface)',
      surfaceHover: 'var(--color-secondary-surface-hover)',
      softBackground: 'var(--color-secondary-soft)',
      softBackgroundHover: 'var(--color-secondary-soft-hover)',
      primary: 'var(--color-secondary-primary)',
      primaryAlpha: 'var(--color-secondary-primary-alpha)',
      text: 'var(--color-secondary-text)',
      contrast: 'var(--color-secondary-contrast)',
      background: 'var(--color-secondary-background)',
    },
    accent: {
      border: 'var(--color-accent-border)',
      borderSubtle: 'var(--color-accent-border-subtle)',
      surface: 'var(--color-accent-surface)',
      surfaceHover: 'var(--color-accent-surface-hover)',
      softBackground: 'var(--color-accent-soft)',
      softBackgroundHover: 'var(--color-accent-soft-hover)',
      primary: 'var(--color-accent-primary)',
      primaryAlpha: 'var(--color-accent-primary-alpha)',
      text: 'var(--color-accent-text)',
      contrast: 'var(--color-accent-contrast)',
      background: 'var(--color-accent-background)',
    },
    // Adaptive theme-surface lane used by cards, panels, and floating surfaces.
    neutral: {
      border: 'var(--color-neutral-border)',
      borderSubtle: 'var(--color-neutral-border-subtle)',
      surface: 'var(--color-neutral-surface)',
      surfaceHover: 'var(--color-neutral-surface-hover)',
      softBackground: 'var(--color-neutral-soft)',
      softBackgroundHover: 'var(--color-neutral-soft-hover)',
      primary: 'var(--color-neutral-primary)',
      primaryAlpha: 'var(--color-neutral-primary-alpha)',
      text: 'var(--color-neutral-text)',
      contrast: 'var(--color-neutral-contrast)',
      background: 'var(--color-neutral-background)',
    },
    info: {
      border: 'var(--color-info-border)',
      borderSubtle: 'var(--color-info-border-subtle)',
      surface: 'var(--color-info-surface)',
      surfaceHover: 'var(--color-info-surface-hover)',
      softBackground: 'var(--color-info-soft)',
      softBackgroundHover: 'var(--color-info-soft-hover)',
      primary: 'var(--color-info-primary)',
      primaryAlpha: 'var(--color-info-primary-alpha)',
      text: 'var(--color-info-text)',
      contrast: 'var(--color-info-contrast)',
      background: 'var(--color-info-background)',
    },
    success: {
      border: 'var(--color-success-border)',
      borderSubtle: 'var(--color-success-border-subtle)',
      surface: 'var(--color-success-surface)',
      surfaceHover: 'var(--color-success-surface-hover)',
      softBackground: 'var(--color-success-soft)',
      softBackgroundHover: 'var(--color-success-soft-hover)',
      primary: 'var(--color-success-primary)',
      primaryAlpha: 'var(--color-success-primary-alpha)',
      text: 'var(--color-success-text)',
      contrast: 'var(--color-success-contrast)',
      background: 'var(--color-success-background)',
    },
    warning: {
      border: 'var(--color-warning-border)',
      borderSubtle: 'var(--color-warning-border-subtle)',
      surface: 'var(--color-warning-surface)',
      surfaceHover: 'var(--color-warning-surface-hover)',
      softBackground: 'var(--color-warning-soft)',
      softBackgroundHover: 'var(--color-warning-soft-hover)',
      primary: 'var(--color-warning-primary)',
      primaryAlpha: 'var(--color-warning-primary-alpha)',
      text: 'var(--color-warning-text)',
      contrast: 'var(--color-warning-contrast)',
      background: 'var(--color-warning-background)',
    },
    error: {
      border: 'var(--color-error-border)',
      borderSubtle: 'var(--color-error-border-subtle)',
      surface: 'var(--color-error-surface)',
      surfaceHover: 'var(--color-error-surface-hover)',
      softBackground: 'var(--color-error-soft)',
      softBackgroundHover: 'var(--color-error-soft-hover)',
      primary: 'var(--color-error-primary)',
      primaryAlpha: 'var(--color-error-primary-alpha)',
      text: 'var(--color-error-text)',
      contrast: 'var(--color-error-contrast)',
      background: 'var(--color-error-background)',
    },
    inverse: {
      border: 'var(--color-inverse-border)',
      borderSubtle: 'var(--color-inverse-border-subtle)',
      surface: 'var(--color-inverse-surface)',
      surfaceHover: 'var(--color-inverse-surface-hover)',
      softBackground: 'var(--color-inverse-soft)',
      softBackgroundHover: 'var(--color-inverse-soft-hover)',
      primary: 'var(--color-inverse-primary)',
      primaryAlpha: 'var(--color-inverse-primary-alpha)',
      text: 'var(--color-inverse-text)',
      contrast: 'var(--color-inverse-contrast)',
      background: 'var(--color-inverse-background)',
    },
    light: {
      border: 'var(--color-light-border)',
      borderSubtle: 'var(--color-light-border-subtle)',
      surface: 'var(--color-light-surface)',
      surfaceHover: 'var(--color-light-surface-hover)',
      softBackground: 'var(--color-light-soft)',
      softBackgroundHover: 'var(--color-light-soft-hover)',
      primary: 'var(--color-light-primary)',
      primaryAlpha: 'var(--color-light-primary-alpha)',
      text: 'var(--color-light-text)',
      contrast: 'var(--color-light-contrast)',
      background: 'var(--color-light-background)',
    },
    dark: {
      border: 'var(--color-dark-border)',
      borderSubtle: 'var(--color-dark-border-subtle)',
      surface: 'var(--color-dark-surface)',
      surfaceHover: 'var(--color-dark-surface-hover)',
      softBackground: 'var(--color-dark-soft)',
      softBackgroundHover: 'var(--color-dark-soft-hover)',
      primary: 'var(--color-dark-primary)',
      primaryAlpha: 'var(--color-dark-primary-alpha)',
      text: 'var(--color-dark-text)',
      contrast: 'var(--color-dark-contrast)',
      background: 'var(--color-dark-background)',
    },
  },
} as const

// Unified size scale (t-shirt + extended)
export const possibleSizes = {
  xs: 'xs',
  sm: 'sm',
  md: 'md',
  lg: 'lg',
  xl: 'xl',
  '2x': '2x',
  '3x': '3x',
  '4x': '4x',
  '5x': '5x',
} as const
export const sizeScale = Object.values(possibleSizes)
export type Size = (typeof sizeScale)[number]

// Font weight
export type Weight = 'light' | 'regular' | 'medium' | 'bold'

// Variants (derived from designTokens.variant keys)
export type Variant = keyof typeof designTokens.variant

export type Radius = 'none' | 'sm' | 'md' | 'lg' | 'full'

export type Color = keyof typeof designTokens.color
export const semanticColorScale = Object.keys(designTokens.color) as readonly Color[]
export const SEMANTIC_COLOR_VAR_TOKENS = [
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
export type SemanticColorVarToken = (typeof SEMANTIC_COLOR_VAR_TOKENS)[number]

export const HUE_NAMES = [
  'orange',
  'tomato',
  'red',
  'crimson',
  'pink',
  'plum',
  'purple',
  'violet',
  'indigo',
  'blue',
  'sky',
  'cyan',
  'teal',
  'green',
  'lime',
  'mint',
  'yellow',
  'amber',
  'brown',
  'gray',
] as const

export type HueName = (typeof HUE_NAMES)[number]
export const HUE_STEPS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', 'contrast'] as const
export type HueStep = (typeof HUE_STEPS)[number]
export type PaletteColorToken = `${HueName}-${HueStep}`
export type SemanticColorToken = `${Color}-${SemanticColorVarToken}`
export { CHART_COLOR_ALIASES, CHART_COLOR_KEYS, type ChartColorAlias, type ChartColorToken }
export const SURFACE_COLOR_KEYS = [...semanticColorScale, ...CHART_COLOR_KEYS, ...CHART_COLOR_ALIASES] as const
export type SurfaceColorKey = (typeof SURFACE_COLOR_KEYS)[number]
export type ThemeColorToken = PaletteColorToken | SemanticColorToken | ChartColorToken
export const BLACK = 'var(--color-dark-primary)'
export const WHITE = 'var(--color-light-primary)'

const semanticColorTokenSet = new Set<string>(SEMANTIC_COLOR_VAR_TOKENS)
const chartColorTokenSet = new Set<string>(CHART_COLOR_KEYS)

export function resolveThemeColorToken(token: ThemeColorToken): string {
  if (chartColorTokenSet.has(token)) {
    return `var(--chart-${token.slice('chart'.length)})`
  }

  for (const color of semanticColorScale) {
    const prefix = `${color}-`
    if (!token.startsWith(prefix)) continue

    const tokenSuffix = token.slice(prefix.length)
    if (!semanticColorTokenSet.has(tokenSuffix)) break

    return `var(--color-${color}-${tokenSuffix})`
  }

  return `var(--${token})`
}

export type Appearance = 'inherit' | 'light' | 'dark'
export type Scaling = '90%' | '95%' | '100%' | '105%' | '110%'
export type AccentColor = (typeof accentColors)[number]
export type GrayColor = (typeof grayColors)[number]

export type SemanticLane =
  | 'slate'
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'neutral'
  | 'info'
  | 'success'
  | 'warning'
  | 'error'
  | 'inverse'
  | 'light'
  | 'dark'

export type SemanticHue = HueName | 'slate' | 'neutral' | 'inverse' | 'black' | 'white'

export const SEMANTIC_COLOR_DEFAULTS: Record<SemanticLane, SemanticHue> = {
  slate: 'gray',
  primary: 'teal',
  secondary: 'blue',
  accent: 'purple',
  neutral: 'neutral',
  info: 'blue',
  success: 'green',
  warning: 'amber',
  error: 'red',
  inverse: 'inverse',
  light: 'white',
  dark: 'black',
} as const

const semanticHueLabels: Record<SemanticHue, string> = {
  slate: 'Slate',
  neutral: 'Neutral',
  inverse: 'Inverse',
  black: 'Black',
  white: 'White',
  orange: 'Orange',
  tomato: 'Tomato',
  red: 'Red',
  crimson: 'Crimson',
  pink: 'Pink',
  plum: 'Plum',
  purple: 'Purple',
  violet: 'Violet',
  indigo: 'Indigo',
  blue: 'Blue',
  sky: 'Sky',
  cyan: 'Cyan',
  teal: 'Teal',
  green: 'Green',
  lime: 'Lime',
  mint: 'Mint',
  yellow: 'Yellow',
  amber: 'Amber',
  brown: 'Brown',
  gray: 'Gray',
}

export const SEMANTIC_HUE_OPTIONS = [
  {
    value: 'slate' as const,
    label: semanticHueLabels.slate,
    swatchColor: 'var(--color-slate-primary)',
  },
  {
    value: 'neutral' as const,
    label: semanticHueLabels.neutral,
    swatchColor: 'var(--color-neutral-primary)',
  },
  {
    value: 'inverse' as const,
    label: semanticHueLabels.inverse,
    swatchColor: 'var(--color-inverse-primary)',
  },
  {
    value: 'white' as const,
    label: semanticHueLabels.white,
    swatchColor: WHITE,
  },
  {
    value: 'black' as const,
    label: semanticHueLabels.black,
    swatchColor: BLACK,
  },
  ...HUE_NAMES.map(hue => ({
    value: hue,
    label: semanticHueLabels[hue],
    swatchColor: `var(--${hue}-9)`,
  })),
] as const

export type HueNumberStep = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12

export interface ThemeColorVariantSteps {
  soft: HueNumberStep
  softHover: HueNumberStep
  surface: HueNumberStep
  surfaceHover: HueNumberStep
  solid: HueNumberStep
  solidHover: HueNumberStep
  border: HueNumberStep
  borderSubtle: HueNumberStep
  text: HueNumberStep
  lightText: HueNumberStep
  darkText: HueNumberStep
}

export interface ThemeVarsTokens {
  colors: {
    semantic: Record<SemanticLane, SemanticHue>
    variants: ThemeColorVariantSteps
  }
}

export const THEME_COLOR_VARIANT_DEFAULTS: ThemeColorVariantSteps = {
  soft: 6,
  softHover: 7,
  surface: 4,
  surfaceHover: 5,
  solid: 9,
  solidHover: 10,
  border: 7,
  borderSubtle: 6,
  text: 11,
  lightText: 12,
  darkText: 11,
} as const

export const THEME_VARS_TOKEN_DEFAULTS: ThemeVarsTokens = {
  colors: {
    semantic: { ...SEMANTIC_COLOR_DEFAULTS },
    variants: { ...THEME_COLOR_VARIANT_DEFAULTS },
  },
} as const

export type ResponsiveSize = Responsive<Size>

export const breakpoints = {
  xs: '520px',
  sm: '768px',
  md: '1024px',
  lg: '1280px',
  xl: '1640px',
} as const

export type Breakpoint = keyof typeof breakpoints

export const containerBreakpoints = {
  xs: '400px',
  sm: '560px',
  md: '840px',
  lg: '1120px',
  xl: '1360px',
} as const

export type ContainerBreakpoint = keyof typeof containerBreakpoints
export const containerBreakpointKeys = Object.keys(containerBreakpoints) as ContainerBreakpoint[]

export const typographyBreakpoints = {
  xs: '400px',
  sm: '560px',
  md: '840px',
  lg: '1120px',
  xl: '1360px',
} as const

export type TypographyBreakpoint = keyof typeof typographyBreakpoints
export const typographyBreakpointKeys = Object.keys(typographyBreakpoints) as TypographyBreakpoint[]

// Layout tokens for Box and layout components
/** layoutTokens export. */
export const layoutTokens = {
  display: [
    'none',
    'inline',
    'inline-block',
    'block',
    'flex',
    'inline-flex',
    'grid',
    'inline-grid',
    'contents',
  ] as const,

  position: ['static', 'relative', 'absolute', 'fixed', 'sticky'] as const,

  overflow: ['visible', 'hidden', 'clip', 'scroll', 'auto'] as const,

  flexDirection: ['row', 'row-reverse', 'column', 'column-reverse'] as const,

  flexWrap: ['nowrap', 'wrap', 'wrap-reverse'] as const,

  alignItems: ['start', 'center', 'end', 'baseline', 'stretch'] as const,

  alignContent: ['start', 'center', 'end', 'between', 'around', 'evenly', 'stretch'] as const,

  justifyContent: ['start', 'center', 'end', 'between', 'around', 'evenly'] as const,

  justifyItems: ['start', 'center', 'end', 'stretch'] as const,

  alignSelf: ['auto', 'start', 'center', 'end', 'baseline', 'stretch'] as const,

  justifySelf: ['auto', 'start', 'center', 'end', 'stretch'] as const,

  // Spacing scale (0-9)
  spacing: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'] as const,
} as const

export type Display = (typeof layoutTokens.display)[number]
export type Position = (typeof layoutTokens.position)[number]
export type Overflow = (typeof layoutTokens.overflow)[number]
export type FlexDirection = (typeof layoutTokens.flexDirection)[number]
export type FlexWrap = (typeof layoutTokens.flexWrap)[number]
export type AlignItems = (typeof layoutTokens.alignItems)[number]
export type AlignContent = (typeof layoutTokens.alignContent)[number]
export type JustifyContent = (typeof layoutTokens.justifyContent)[number]
export type JustifyItems = (typeof layoutTokens.justifyItems)[number]
export type AlignSelf = (typeof layoutTokens.alignSelf)[number]
export type JustifySelf = (typeof layoutTokens.justifySelf)[number]
export type Spacing = (typeof layoutTokens.spacing)[number]

// FieldGroup layout tokens
/** fieldGroupTokens export. */
export const fieldGroupTokens = {
  // Form layout modes
  layout: ['stacked', 'inline', 'grid', 'side-labels', 'sectioned'] as const,

  // Grid column presets
  gridColumns: ['1', '2', '3', '4', '6', '12'] as const,
} as const

export type FieldGroupLayout = (typeof fieldGroupTokens.layout)[number]
export type GridColumns = (typeof fieldGroupTokens.gridColumns)[number]

// TextField variant tokens
/** textFieldTokens export. */
export const textFieldTokens = {
  baseVariant: ['classic', 'solid', 'soft', 'surface', 'outline', 'ghost'] as const,
  floatingVariant: ['floating-filled', 'floating-standard', 'floating-outlined'] as const,
  get variant() {
    return [...this.baseVariant, ...this.floatingVariant] as const
  },
} as const

export type BaseTextFieldVariant = (typeof textFieldTokens.baseVariant)[number]
export type FloatingTextFieldVariant = (typeof textFieldTokens.floatingVariant)[number]
export type TextFieldVariant = BaseTextFieldVariant | FloatingTextFieldVariant

// Responsive prop type helper
export type Responsive<T> =
  | T
  | {
      initial?: T
      xs?: T
      sm?: T
      md?: T
      lg?: T
      xl?: T
    }

export type ThemeColorVars = {
  primary: string
  softBg: string
  surface: string
  text: string
  background: string
}

export const panelTokens = {
  solid: designTokens.color.neutral.background,
  translucent: 'color-mix(in oklch, var(--color-neutral-background) 86%, transparent)',
  surface: designTokens.color.neutral.surface,
} as const

export function getThemeColorVars(color: Color): ThemeColorVars {
  const tokens = designTokens.color[color]
  return {
    primary: tokens.primary,
    softBg: tokens.softBackground,
    surface: tokens.surface,
    text: tokens.text,
    background: tokens.background,
  }
}

export const SurfaceVariants = {
  surface: 'surface',
  underline: 'underline',
} as const

export type SurfaceVariant = (typeof SurfaceVariants)[keyof typeof SurfaceVariants]

export const surfaceRadiusClasses: Record<Radius, string> = {
  none: 'rounded-none',
  sm: 'rounded-[2px]',
  md: 'rounded-[4px]',
  lg: 'rounded-[6px]',
  full: 'rounded-full',
}

export type SurfaceStyles = {
  indicatorBg: string
  activeText: string
  activeUnderline: string
}

export type SurfaceColor = Color

export type ResolveSurfaceStylesOptions = {
  color: SurfaceColor
  variant: SurfaceVariant
  highContrast?: boolean
}

export type InteractiveElementBaseOptions = {
  ringOffset?: '1' | '2'
  transition?: 'colors' | 'all'
}

export function getInteractiveElementBaseClasses({
  ringOffset = '2',
  transition = 'colors',
}: InteractiveElementBaseOptions = {}): string {
  return [
    'inline-flex items-center justify-center whitespace-nowrap font-medium',
    transition === 'all' ? 'transition-all duration-150 ease-in-out' : 'transition-colors duration-150 ease-in-out',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
    ringOffset === '1' ? 'focus-visible:ring-offset-1' : 'focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
  ].join(' ')
}

export function resolveSurfaceStyles({
  color,
  variant,
  highContrast = false,
}: ResolveSurfaceStylesOptions): SurfaceStyles {
  const tokens = designTokens.color[color]

  if (variant === SurfaceVariants.underline) {
    return {
      indicatorBg: tokens.primaryAlpha,
      activeText: tokens.primary,
      activeUnderline: tokens.primary,
    }
  }

  return {
    indicatorBg: tokens.softBackground,
    activeText: highContrast ? tokens.primary : tokens.text,
    activeUnderline: tokens.primary,
  }
}

export function createKeyedStateMap<K extends string, V>(keys: readonly K[], create: (key: K) => V): Record<K, V> {
  return keys.reduce(
    (acc, key) => {
      acc[key] = create(key)
      return acc
    },
    {} as Record<K, V>,
  )
}
