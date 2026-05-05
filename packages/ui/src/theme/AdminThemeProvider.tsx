'use client'

import * as React from 'react'
import { type BrowserCookieOptions, readCookie, writeCookie } from '@/hooks/useCookie'
import { ThemeProvider, type ThemeProviderConfigPatch, type ThemeProviderProps } from './ThemeProvider'
import { ThemeVarsProvider } from './ThemeVarsProvider'
import type { ThemePersistenceConfig, ThemeUserPreferences } from './theme-persistence'
import { type UsePersistentThemeConfigOptions, usePersistentThemeConfig } from './usePersistentThemeConfig'
import {
  DEFAULT_THEME_USER_PREFERENCES_STORAGE_KEY,
  type UsePersistentThemePreferencesOptions,
  usePersistentThemePreferences,
} from './usePersistentThemePreferences'
import { type UsePersistentThemeVarsTokensOptions, usePersistentThemeVarsTokens } from './usePersistentThemeVarsTokens'

export const DEFAULT_THEME_APPEARANCE_COOKIE_NAME = 'appearance'
export const DEFAULT_THEME_APPEARANCE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365

export interface ThemeAppearanceCookieOptions extends BrowserCookieOptions {
  name?: string
  appKey?: string
}

export interface CreateThemeAppearanceBootstrapScriptOptions {
  storageKey?: string
  cookieName?: string
  cookieAppKey?: string
}

type AdminThemeProviderControlledProps =
  | keyof ThemePersistenceConfig
  | 'appearance'
  | 'children'
  | 'onAppearanceChange'
  | 'onThemeConfigChange'

export interface AdminThemeProviderProps extends Omit<ThemeProviderProps, AdminThemeProviderControlledProps> {
  children: React.ReactNode
  appearanceCookie?: ThemeAppearanceCookieOptions
  configStorage?: UsePersistentThemeConfigOptions
  preferencesStorage?: UsePersistentThemePreferencesOptions
  varsTokensStorage?: UsePersistentThemeVarsTokensOptions
}

function isThemeAppearance(value: unknown): value is ThemeUserPreferences['appearance'] {
  return value === 'light' || value === 'dark' || value === 'inherit'
}

function getAppearanceCookieOptions(options: ThemeAppearanceCookieOptions = {}) {
  return {
    name: options.name ?? DEFAULT_THEME_APPEARANCE_COOKIE_NAME,
    appKey: options.appKey,
    path: options.path ?? '/',
    maxAge: options.maxAge ?? DEFAULT_THEME_APPEARANCE_COOKIE_MAX_AGE,
    sameSite: options.sameSite ?? 'lax',
    secure: options.secure,
  } satisfies Required<Pick<ThemeAppearanceCookieOptions, 'name' | 'path' | 'maxAge' | 'sameSite'>> &
    Pick<ThemeAppearanceCookieOptions, 'appKey' | 'secure'>
}

function readThemeAppearanceCookie(
  options: ThemeAppearanceCookieOptions = {},
): ThemeUserPreferences['appearance'] | null {
  const { name, appKey } = getAppearanceCookieOptions(options)
  const value = readCookie(name)
  if (!value) return null

  if (!appKey) return isThemeAppearance(value) ? value : null

  try {
    const appearances = JSON.parse(value)
    const appearance = appearances?.[appKey]
    return isThemeAppearance(appearance) ? appearance : null
  } catch {
    return isThemeAppearance(value) ? value : null
  }
}

function writeThemeAppearanceCookie(
  appearance: ThemeUserPreferences['appearance'],
  options: ThemeAppearanceCookieOptions = {},
) {
  const { name, appKey, ...cookieOptions } = getAppearanceCookieOptions(options)

  if (!appKey) {
    writeCookie(name, appearance, cookieOptions)
    return
  }

  const currentValue = readCookie(name)
  let appearances: Record<string, unknown> = {}

  if (currentValue) {
    try {
      const parsed = JSON.parse(currentValue)
      appearances = parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {}
    } catch {
      appearances = {}
    }
  }

  writeCookie(name, JSON.stringify({ ...appearances, [appKey]: appearance }), cookieOptions)
}

export function createThemeAppearanceBootstrapScript(options: CreateThemeAppearanceBootstrapScriptOptions = {}) {
  const storageKey = options.storageKey ?? DEFAULT_THEME_USER_PREFERENCES_STORAGE_KEY
  const cookieName = options.cookieName ?? DEFAULT_THEME_APPEARANCE_COOKIE_NAME
  const cookieAppKey = options.cookieAppKey ?? null

  return `(() => {
  try {
    const storageKey = ${JSON.stringify(storageKey)};
    const cookieName = ${JSON.stringify(cookieName)};
    const appKey = ${JSON.stringify(cookieAppKey)};
    const encodedCookiePrefix = encodeURIComponent(cookieName) + '=';
    const cookieValue = document.cookie
      .split(';')
      .map(part => part.trim())
      .find(part => part.startsWith(encodedCookiePrefix))
      ?.slice(encodedCookiePrefix.length);
    const decodedCookieValue = cookieValue ? decodeURIComponent(cookieValue) : null;
    let appearance = null;

    if (decodedCookieValue) {
      if (appKey) {
        try {
          const appearances = JSON.parse(decodedCookieValue);
          appearance = typeof appearances?.[appKey] === 'string' ? appearances[appKey] : null;
        } catch {
          appearance = decodedCookieValue;
        }
      } else {
        appearance = decodedCookieValue;
      }
    }

    if (!appearance) {
      try {
        const rawPreferences = window.localStorage.getItem(storageKey);
        if (rawPreferences) {
          const preferences = JSON.parse(rawPreferences);
          appearance = typeof preferences?.appearance === 'string' ? preferences.appearance : null;
        }
      } catch {
        appearance = null;
      }
    }

    if (appearance !== 'light' && appearance !== 'dark' && appearance !== 'inherit') {
      appearance = 'inherit';
    }

    const resolved = appearance === 'dark' || (appearance === 'inherit' && window.matchMedia?.('(prefers-color-scheme: dark)')?.matches)
      ? 'dark'
      : 'light';

    document.documentElement.classList.toggle('dark', resolved === 'dark');
    document.documentElement.style.colorScheme = resolved;
  } catch {}
})();`
}

/**
 * Root/admin theme provider for applications that expose theme editing.
 *
 * It owns persisted theme vars and app-level theme config. Use nested ThemeProvider
 * instances for local contextual overrides such as radius or scaling.
 */
export function AdminThemeProvider({
  appearanceCookie,
  configStorage,
  preferencesStorage,
  varsTokensStorage,
  children,
  ...themeProviderProps
}: AdminThemeProviderProps) {
  const cookieAppearance = React.useMemo(() => readThemeAppearanceCookie(appearanceCookie), [appearanceCookie])
  const [cookieAppearanceOverride, setCookieAppearanceOverride] = React.useState(cookieAppearance)
  const defaultPreferences = React.useMemo<ThemeUserPreferences>(
    () => ({ appearance: readThemeAppearanceCookie(appearanceCookie) ?? 'inherit' }),
    [appearanceCookie],
  )
  const [preferences, setPreferences] = usePersistentThemePreferences({
    ...preferencesStorage,
    defaultValue: preferencesStorage?.defaultValue ?? defaultPreferences,
    initializeWithStorage: preferencesStorage?.initializeWithStorage,
  })
  const [themeConfig, setThemeConfig] = usePersistentThemeConfig({
    ...configStorage,
    initializeWithStorage: configStorage?.initializeWithStorage,
  })
  const [themeVarsTokens, setThemeVarsTokens] = usePersistentThemeVarsTokens({
    ...varsTokensStorage,
    initializeWithStorage: varsTokensStorage?.initializeWithStorage,
  })
  const effectivePreferences = React.useMemo(
    () => (cookieAppearanceOverride ? { ...preferences, appearance: cookieAppearanceOverride } : preferences),
    [cookieAppearanceOverride, preferences],
  )

  React.useEffect(() => {
    if (!cookieAppearanceOverride) return
    setPreferences(previous =>
      previous.appearance === cookieAppearanceOverride
        ? previous
        : { ...previous, appearance: cookieAppearanceOverride },
    )
  }, [cookieAppearanceOverride, setPreferences])

  React.useEffect(() => {
    if (cookieAppearanceOverride) {
      if (preferences.appearance !== cookieAppearanceOverride) return
      setCookieAppearanceOverride(null)
      return
    }

    writeThemeAppearanceCookie(preferences.appearance, appearanceCookie)
  }, [appearanceCookie, cookieAppearanceOverride, preferences.appearance])

  const handleAppearanceChange = React.useCallback(
    (appearance: ThemeUserPreferences['appearance']) => {
      setCookieAppearanceOverride(null)
      writeThemeAppearanceCookie(appearance, appearanceCookie)
      setPreferences(previous => ({ ...previous, appearance }))
    },
    [appearanceCookie, setPreferences],
  )

  const patchThemeConfig = React.useCallback(
    (patch: ThemeProviderConfigPatch) => {
      setThemeConfig(previous => ({ ...previous, ...patch }))
    },
    [setThemeConfig],
  )

  return (
    <ThemeVarsProvider tokens={themeVarsTokens} onTokensChange={setThemeVarsTokens}>
      <ThemeProvider
        {...themeProviderProps}
        appearance={effectivePreferences.appearance}
        accentColor={themeConfig.accentColor}
        grayColor={themeConfig.grayColor}
        radius={themeConfig.radius}
        scaling={themeConfig.scaling}
        panelBackground={themeConfig.panelBackground}
        avatarVariant={themeConfig.avatarVariant}
        avatarRadius={themeConfig.avatarRadius}
        sidebarColor={themeConfig.sidebarColor}
        sidebarVariant={themeConfig.sidebarVariant}
        contentBodyColor={themeConfig.contentBodyColor}
        contentBodyVariant={themeConfig.contentBodyVariant}
        typography={themeConfig.typography}
        onAppearanceChange={handleAppearanceChange}
        onThemeConfigChange={patchThemeConfig}
      >
        {children}
      </ThemeProvider>
    </ThemeVarsProvider>
  )
}
