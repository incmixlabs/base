'use client'

import './typography-tokens.css'
import './chart-tokens.css'

export {
  createConcreteThemeResolver,
  createEmailThemeResolver,
  createThemeResolver,
  defaultEmailThemeTokens,
  defaultThemeFallbackTokens,
  type EmailInlineStyle,
  type EmailSafeStyleProperty,
  emailSafeStyleProperties,
  resolveConcreteThemeToken,
  resolveThemeToken,
  type ThemeResolver,
  type ThemeResolverOptions,
  type ThemeTokenMap,
  type ThemeTokenPath,
  type TokenStyleDefinition,
  type TokenStyleValue,
  transposeTokenStyle,
} from '@incmix/theme'

export { chartDarkTokenColorMap, chartLightTokenColorMap, chartTokenColorMap } from './chart-token-map'
export * from './contract/theme-contract'
export * from './font-sources'
export * from './form-factors'
export { resolveColorDerivationDeltas } from './helpers/color-derivation'
export { pickContrastText, shiftLightness, toCssHsl } from './helpers/color-utils'
export * from './helpers/responsive/breakpoints'
export * from './profile-vars'
export {
  SemanticColor,
  type SemanticColorKey,
  semanticColorKeys,
  semanticColors,
  semanticColorVar,
} from './props/color.prop'
export * from './runtime/theme-compiler'

export {
  ThemeProvider,
  ThemeProvider as Theme,
  type ThemeProviderProps,
} from './ThemeProvider'

export {
  DEFAULT_THEME_BREAKPOINTS,
  normalizeThemeBreakpoints,
  type ThemeBreakpoint,
  type ThemeBreakpointConfig,
  type ThemeBreakpoints,
} from './theme-breakpoints'
export {
  DEFAULT_THEME_DASHBOARD,
  DEFAULT_THEME_DASHBOARD_COLUMNS,
  normalizeThemeDashboardColumns,
  normalizeThemeDashboardGap,
  type ThemeDashboard,
  type ThemeDashboardColumnConfig,
} from './theme-dashboard'
export {
  defaultThemePersistenceConfig,
  defaultThemeUserPreferences,
  resolveThemePersistenceConfig,
  resolveThemeUserPreferences,
  resolveThemeVarsTokens,
  THEME_CONFIG_SCHEMA_VERSION,
  type ThemeConfigSchemaVersion,
  type ThemePersistenceConfig,
  type ThemeUserPreferences,
} from './theme-persistence'
export {
  useOptionalThemeContext,
  useOptionalThemeProviderContext,
  useRootThemePortalContainer,
  useThemeContext,
  useThemePortalContainer,
  useThemeProviderContext,
} from './theme-provider.context'
export {
  TYPOGRAPHY_RESPONSIVE_PROFILE_DEFAULT,
  TYPOGRAPHY_RESPONSIVE_PROFILES,
  type TypographyResponsiveProfile,
} from './token-constants'
export {
  type AccentColor,
  type Appearance,
  CHART_COLOR_ALIASES,
  CHART_COLOR_KEYS,
  type ChartColorAlias,
  type ChartColorToken,
  type Color,
  type ContainerBreakpoint,
  containerBreakpointKeys,
  containerBreakpoints,
  type GrayColor,
  type GridColumns,
  HUE_NAMES,
  type HueName,
  possibleSizes,
  type Radius,
  resolveThemeColorToken,
  type Scaling,
  type Size,
  type Spacing,
  SURFACE_COLOR_KEYS,
  type SurfaceColorKey,
  type TextFieldVariant,
  type ThemeColorToken,
  textFieldTokens,
} from './tokens'
