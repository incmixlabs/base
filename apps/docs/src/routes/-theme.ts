import {
  createThemeAppearanceBootstrapScript,
  DEFAULT_THEME_APPEARANCE_COOKIE_NAME,
  type ThemeAppearanceCookieOptions,
  type UsePersistentThemeConfigOptions,
  type UsePersistentThemePreferencesOptions,
  type UsePersistentThemeVarsTokensOptions,
} from '@bwalkt/ui/theme'

export const DOCS_APPEARANCE_COOKIE_APP_KEY = 'docs'
export const DOCS_THEME_STORAGE_PREFIX = 'af:docs:theme'

export const docsThemePreferencesStorage = {
  key: `${DOCS_THEME_STORAGE_PREFIX}:user-preferences`,
  initializeWithStorage: false,
} satisfies UsePersistentThemePreferencesOptions

export const docsThemeConfigStorage = {
  key: `${DOCS_THEME_STORAGE_PREFIX}:config`,
  initializeWithStorage: false,
} satisfies UsePersistentThemeConfigOptions

export const docsThemeVarsTokensStorage = {
  key: `${DOCS_THEME_STORAGE_PREFIX}:vars-tokens`,
  initializeWithStorage: false,
} satisfies UsePersistentThemeVarsTokensOptions

export const docsAppearanceCookie = {
  name: DEFAULT_THEME_APPEARANCE_COOKIE_NAME,
  appKey: DOCS_APPEARANCE_COOKIE_APP_KEY,
} satisfies ThemeAppearanceCookieOptions

export const docsAppearanceBootstrapScript = createThemeAppearanceBootstrapScript({
  storageKey: docsThemePreferencesStorage.key,
  cookieName: docsAppearanceCookie.name,
  cookieAppKey: docsAppearanceCookie.appKey,
})
