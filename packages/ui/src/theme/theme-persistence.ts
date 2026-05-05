import type { AvatarVariant } from '@/elements/avatar/Avatar'
import type { SidebarVariant } from '@/layouts/sidebar/sidebar.props'
import {
  THEME_FONT_DISPLAY_VALUES,
  THEME_FONT_FILE_FORMATS,
  THEME_TYPOGRAPHY_SLOTS,
  type ThemeFileUrlFontSource,
  type ThemeFontDisplay,
  type ThemeFontFileFormat,
  type ThemeFontSource,
  type ThemeTypographySlot,
} from './font-sources'
import type { ThemeTypography } from './theme-config'
import { defaultThemeConfig } from './theme-config'
import { TYPOGRAPHY_RESPONSIVE_PROFILES, type TypographyResponsiveProfile } from './token-constants'
import {
  type AccentColor,
  type Appearance,
  type Color,
  type GrayColor,
  type Radius,
  type Scaling,
  SEMANTIC_COLOR_DEFAULTS,
  SEMANTIC_HUE_OPTIONS,
  type SemanticHue,
  type SemanticLane,
  semanticColorScale,
  THEME_VARS_TOKEN_DEFAULTS,
  type ThemeColorVariantSteps,
  type ThemeVarsTokens,
} from './tokens'

export const THEME_CONFIG_SCHEMA_VERSION = 1

export type ThemeConfigSchemaVersion = typeof THEME_CONFIG_SCHEMA_VERSION

export interface ThemeUserPreferences {
  appearance: Appearance
  locale?: string
  timezone?: string
}

export interface ThemePersistenceConfig {
  version: ThemeConfigSchemaVersion
  accentColor: AccentColor
  grayColor: GrayColor
  radius: Radius
  panelBackground: 'solid' | 'translucent'
  avatarVariant: AvatarVariant
  avatarRadius: Radius
  sidebarColor: Color
  sidebarVariant: SidebarVariant
  contentBodyColor: Color
  contentBodyVariant: SidebarVariant
  semanticColors: Record<SemanticLane, SemanticHue>
  typography: ThemeTypography
  scaling: Scaling
}

export const defaultThemeUserPreferences: ThemeUserPreferences = {
  appearance: 'inherit',
}

export const defaultThemePersistenceConfig: ThemePersistenceConfig = {
  version: THEME_CONFIG_SCHEMA_VERSION,
  accentColor: 'indigo',
  grayColor: 'auto',
  radius: defaultThemeConfig.layout.radius,
  panelBackground: 'translucent',
  avatarVariant: defaultThemeConfig.layout.avatarVariant,
  avatarRadius: defaultThemeConfig.layout.avatarRadius,
  sidebarColor: 'slate',
  sidebarVariant: 'soft',
  contentBodyColor: 'info',
  contentBodyVariant: 'surface',
  semanticColors: { ...SEMANTIC_COLOR_DEFAULTS },
  typography: defaultThemeConfig.typography,
  scaling: '100%',
}

const appearances = new Set<Appearance>(['inherit', 'light', 'dark'])
const semanticHues = new Set<SemanticHue>(SEMANTIC_HUE_OPTIONS.map(option => option.value))
const colors = new Set<Color>(semanticColorScale)
const accentColors = new Set<AccentColor>([
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
])
const grayColors = new Set<GrayColor>(['auto', 'gray', 'mauve', 'slate', 'sage', 'olive', 'sand'])
const radii = new Set<Radius>(['none', 'sm', 'md', 'lg', 'full'])
const scalings = new Set<Scaling>(['90%', '95%', '100%', '105%', '110%'])
const panelBackgrounds = new Set<ThemePersistenceConfig['panelBackground']>(['solid', 'translucent'])
const avatarVariants = new Set<AvatarVariant>(['soft', 'solid'])
const sidebarVariants = new Set<SidebarVariant>(['surface', 'solid', 'soft'])
const responsiveProfiles = new Set<TypographyResponsiveProfile>(TYPOGRAPHY_RESPONSIVE_PROFILES)
const fontFileFormats = new Set<ThemeFontFileFormat>(THEME_FONT_FILE_FORMATS)
const fontDisplayValues = new Set<ThemeFontDisplay>(THEME_FONT_DISPLAY_VALUES)
const hueStepKeys = Object.keys(THEME_VARS_TOKEN_DEFAULTS.colors.variants) as Array<keyof ThemeColorVariantSteps>

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function resolveAppearance(value: unknown, fallback: Appearance): Appearance {
  return typeof value === 'string' && appearances.has(value as Appearance) ? (value as Appearance) : fallback
}

function resolveOptionalString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim().length > 0 ? value : undefined
}

function resolveColor(value: unknown, fallback: Color): Color {
  return typeof value === 'string' && colors.has(value as Color) ? (value as Color) : fallback
}

function resolveAccentColor(value: unknown, fallback: AccentColor): AccentColor {
  return typeof value === 'string' && accentColors.has(value as AccentColor) ? (value as AccentColor) : fallback
}

function resolveGrayColor(value: unknown, fallback: GrayColor): GrayColor {
  return typeof value === 'string' && grayColors.has(value as GrayColor) ? (value as GrayColor) : fallback
}

function resolveRadius(value: unknown, fallback: Radius): Radius {
  return typeof value === 'string' && radii.has(value as Radius) ? (value as Radius) : fallback
}

function resolveScaling(value: unknown, fallback: Scaling): Scaling {
  return typeof value === 'string' && scalings.has(value as Scaling) ? (value as Scaling) : fallback
}

function resolveAvatarVariant(value: unknown, fallback: AvatarVariant): AvatarVariant {
  return typeof value === 'string' && avatarVariants.has(value as AvatarVariant) ? (value as AvatarVariant) : fallback
}

function resolvePanelBackground(
  value: unknown,
  fallback: ThemePersistenceConfig['panelBackground'],
): ThemePersistenceConfig['panelBackground'] {
  return typeof value === 'string' && panelBackgrounds.has(value as ThemePersistenceConfig['panelBackground'])
    ? (value as ThemePersistenceConfig['panelBackground'])
    : fallback
}

function resolveSidebarVariant(value: unknown, fallback: SidebarVariant): SidebarVariant {
  return typeof value === 'string' && sidebarVariants.has(value as SidebarVariant)
    ? (value as SidebarVariant)
    : fallback
}

function resolveFontSource(value: unknown): ThemeFontSource | undefined {
  if (!isRecord(value)) return undefined
  if (typeof value.url !== 'string') return undefined

  if (value.kind === 'css-url') {
    return {
      kind: 'css-url',
      url: value.url,
    }
  }

  if (value.kind !== 'file-url') return undefined

  const source: ThemeFileUrlFontSource = {
    kind: 'file-url',
    url: value.url,
  }

  if (typeof value.format === 'string' && fontFileFormats.has(value.format as ThemeFontFileFormat)) {
    source.format = value.format as ThemeFontFileFormat
  }
  if (typeof value.weight === 'string') source.weight = value.weight
  if (value.style === 'normal' || value.style === 'italic') source.style = value.style
  if (typeof value.display === 'string' && fontDisplayValues.has(value.display as ThemeFontDisplay)) {
    source.display = value.display as ThemeFontDisplay
  }

  return source
}

function resolveFontSources(value: unknown, fallback: ThemeTypography['fontSources']): ThemeTypography['fontSources'] {
  if (!isRecord(value)) return fallback

  const resolved: ThemeTypography['fontSources'] = { ...fallback }

  for (const slot of THEME_TYPOGRAPHY_SLOTS) {
    const source = resolveFontSource(value[slot])
    if (source) resolved[slot as ThemeTypographySlot] = source
  }

  return resolved
}

function resolveThemeTypography(value: unknown, fallback: ThemeTypography): ThemeTypography {
  if (!isRecord(value)) return fallback

  return {
    fontSans: typeof value.fontSans === 'string' && value.fontSans.trim() ? value.fontSans : fallback.fontSans,
    fontSerif: typeof value.fontSerif === 'string' && value.fontSerif.trim() ? value.fontSerif : fallback.fontSerif,
    fontMono: typeof value.fontMono === 'string' && value.fontMono.trim() ? value.fontMono : fallback.fontMono,
    letterSpacing: typeof value.letterSpacing === 'string' ? value.letterSpacing : fallback.letterSpacing,
    responsiveProfile:
      typeof value.responsiveProfile === 'string' &&
      responsiveProfiles.has(value.responsiveProfile as TypographyResponsiveProfile)
        ? (value.responsiveProfile as TypographyResponsiveProfile)
        : fallback.responsiveProfile,
    fontSources: resolveFontSources(value.fontSources, fallback.fontSources),
  }
}

export function resolveThemeUserPreferences(
  value: unknown,
  fallback: ThemeUserPreferences = defaultThemeUserPreferences,
): ThemeUserPreferences {
  if (!isRecord(value)) return fallback

  return {
    appearance: resolveAppearance(value.appearance, fallback.appearance),
    locale: resolveOptionalString(value.locale) ?? fallback.locale,
    timezone: resolveOptionalString(value.timezone) ?? fallback.timezone,
  }
}

export function resolveThemePersistenceConfig(
  value: unknown,
  fallback: ThemePersistenceConfig = defaultThemePersistenceConfig,
): ThemePersistenceConfig {
  if (!isRecord(value)) return fallback

  return {
    version: THEME_CONFIG_SCHEMA_VERSION,
    accentColor: resolveAccentColor(value.accentColor, fallback.accentColor),
    grayColor: resolveGrayColor(value.grayColor, fallback.grayColor),
    radius: resolveRadius(value.radius, fallback.radius),
    panelBackground: resolvePanelBackground(value.panelBackground, fallback.panelBackground),
    avatarVariant: resolveAvatarVariant(value.avatarVariant, fallback.avatarVariant),
    avatarRadius: resolveRadius(value.avatarRadius, fallback.avatarRadius),
    sidebarColor: resolveColor(value.sidebarColor, fallback.sidebarColor),
    sidebarVariant: resolveSidebarVariant(value.sidebarVariant, fallback.sidebarVariant),
    contentBodyColor: resolveColor(value.contentBodyColor, fallback.contentBodyColor),
    contentBodyVariant: resolveSidebarVariant(value.contentBodyVariant, fallback.contentBodyVariant),
    semanticColors: resolveSemanticColors(value.semanticColors, fallback.semanticColors),
    typography: resolveThemeTypography(value.typography, fallback.typography),
    scaling: resolveScaling(value.scaling, fallback.scaling),
  }
}

function resolveSemanticColors(
  value: unknown,
  fallback: Record<SemanticLane, SemanticHue> = THEME_VARS_TOKEN_DEFAULTS.colors.semantic,
): Record<SemanticLane, SemanticHue> {
  const resolved = { ...fallback }
  if (!isRecord(value)) return resolved

  for (const lane of Object.keys(resolved) as SemanticLane[]) {
    const hue = value[lane]
    if (typeof hue === 'string' && semanticHues.has(hue as SemanticHue)) {
      resolved[lane] = hue as SemanticHue
    }
  }

  return resolved
}

function resolveHueStep(value: unknown, fallback: ThemeColorVariantSteps[keyof ThemeColorVariantSteps]) {
  if (typeof value !== 'number' || !Number.isInteger(value) || value < 1 || value > 12) return fallback
  return value as ThemeColorVariantSteps[keyof ThemeColorVariantSteps]
}

function resolveColorVariantSteps(
  value: unknown,
  fallback: ThemeColorVariantSteps = THEME_VARS_TOKEN_DEFAULTS.colors.variants,
): ThemeColorVariantSteps {
  const resolved = { ...fallback }
  if (!isRecord(value)) return resolved

  for (const key of hueStepKeys) {
    resolved[key] = resolveHueStep(value[key], resolved[key])
  }

  return resolved
}

export function resolveThemeVarsTokens(
  value: unknown,
  fallback: ThemeVarsTokens = THEME_VARS_TOKEN_DEFAULTS,
): ThemeVarsTokens {
  if (!isRecord(value)) return fallback

  const colors = isRecord(value.colors) ? value.colors : undefined

  return {
    colors: {
      semantic: resolveSemanticColors(colors?.semantic, fallback.colors.semantic),
      variants: resolveColorVariantSteps(colors?.variants, fallback.colors.variants),
    },
  }
}
