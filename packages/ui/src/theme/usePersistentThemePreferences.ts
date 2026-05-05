'use client'

import { useLocalStorage } from '@/hooks/useLocalStorage'
import {
  defaultThemeUserPreferences,
  resolveThemeUserPreferences,
  type ThemeUserPreferences,
} from './theme-persistence'

export const DEFAULT_THEME_USER_PREFERENCES_STORAGE_KEY = 'af:theme:user-preferences'

export interface UsePersistentThemePreferencesOptions {
  key?: string
  defaultValue?: ThemeUserPreferences
  initializeWithStorage?: boolean
}

export function usePersistentThemePreferences(options: UsePersistentThemePreferencesOptions = {}) {
  const key = options.key ?? DEFAULT_THEME_USER_PREFERENCES_STORAGE_KEY
  const defaultValue = options.defaultValue ?? defaultThemeUserPreferences

  return useLocalStorage<ThemeUserPreferences>(key, defaultValue, {
    initializeWithStorage: options.initializeWithStorage,
    deserialize: value => resolveThemeUserPreferences(JSON.parse(value), defaultValue),
  })
}
