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
export {
  AdminThemeProvider,
  type AdminThemeProviderProps,
  type CreateThemeAppearanceBootstrapScriptOptions,
  createThemeAppearanceBootstrapScript,
  DEFAULT_THEME_APPEARANCE_COOKIE_MAX_AGE,
  DEFAULT_THEME_APPEARANCE_COOKIE_NAME,
  type ThemeAppearanceCookieOptions,
} from './AdminThemeProvider'
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
export * from './sprinkles.css'
export {
  type PanelBackground,
  type ThemeCalendar,
  type ThemeLocale,
  ThemeProvider,
  ThemeProvider as Theme,
  type ThemeProviderConfigPatch,
  type ThemeProviderContextValue,
  type ThemeProviderContextValue as ThemeContextValue,
  type ThemeProviderProps,
  type ThemeProviderProps as ThemeProps,
} from './ThemeProvider'
export { ThemeToggle, type ThemeToggleProps } from './ThemeToggle'
export {
  type ThemeVarsContextValue,
  ThemeVarsProvider,
  type ThemeVarsProviderProps,
  type ThemeVarsTheme,
  useOptionalThemeVarsContext,
  useThemeVarsContext,
} from './ThemeVarsProvider'
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
  CHART_COLOR_ALIASES,
  CHART_COLOR_KEYS,
  type ChartColorAlias,
  type ChartColorToken,
  type Color,
  type ContainerBreakpoint,
  containerBreakpointKeys,
  containerBreakpoints,
  type GridColumns,
  possibleSizes,
  type Radius,
  resolveThemeColorToken,
  type Size,
  type Spacing,
  SURFACE_COLOR_KEYS,
  type SurfaceColorKey,
  type TextFieldVariant,
  type ThemeColorToken,
  textFieldTokens,
} from './tokens'
export {
  DEFAULT_THEME_CONFIG_STORAGE_KEY,
  type UsePersistentThemeConfigOptions,
  usePersistentThemeConfig,
} from './usePersistentThemeConfig'
export {
  DEFAULT_THEME_USER_PREFERENCES_STORAGE_KEY,
  type UsePersistentThemePreferencesOptions,
  usePersistentThemePreferences,
} from './usePersistentThemePreferences'
export {
  DEFAULT_THEME_VARS_TOKENS_STORAGE_KEY,
  type UsePersistentThemeVarsTokensOptions,
  usePersistentThemeVarsTokens,
} from './usePersistentThemeVarsTokens'
