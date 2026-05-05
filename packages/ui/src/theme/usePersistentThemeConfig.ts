'use client'

import { useLocalStorage } from '@/hooks/useLocalStorage'
import {
  defaultThemePersistenceConfig,
  resolveThemePersistenceConfig,
  type ThemePersistenceConfig,
} from './theme-persistence'

export const DEFAULT_THEME_CONFIG_STORAGE_KEY = 'af:theme:config'

export interface UsePersistentThemeConfigOptions {
  key?: string
  defaultValue?: ThemePersistenceConfig
  initializeWithStorage?: boolean
}

export function usePersistentThemeConfig(options: UsePersistentThemeConfigOptions = {}) {
  const key = options.key ?? DEFAULT_THEME_CONFIG_STORAGE_KEY
  const defaultValue = options.defaultValue ?? defaultThemePersistenceConfig

  return useLocalStorage<ThemePersistenceConfig>(key, defaultValue, {
    initializeWithStorage: options.initializeWithStorage,
    deserialize: value => resolveThemePersistenceConfig(JSON.parse(value), defaultValue),
  })
}
