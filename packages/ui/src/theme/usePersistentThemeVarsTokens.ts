'use client'

import { useLocalStorage } from '@/hooks/useLocalStorage'
import { resolveThemeVarsTokens } from './theme-persistence'
import { THEME_VARS_TOKEN_DEFAULTS, type ThemeVarsTokens } from './tokens'

export const DEFAULT_THEME_VARS_TOKENS_STORAGE_KEY = 'af:theme:vars-tokens'

export interface UsePersistentThemeVarsTokensOptions {
  key?: string
  defaultValue?: ThemeVarsTokens
  initializeWithStorage?: boolean
}

export function usePersistentThemeVarsTokens(options: UsePersistentThemeVarsTokensOptions = {}) {
  const key = options.key ?? DEFAULT_THEME_VARS_TOKENS_STORAGE_KEY
  const defaultValue = options.defaultValue ?? THEME_VARS_TOKEN_DEFAULTS

  return useLocalStorage<ThemeVarsTokens>(key, defaultValue, {
    initializeWithStorage: options.initializeWithStorage,
    deserialize: value => resolveThemeVarsTokens(JSON.parse(value), defaultValue),
  })
}
