import defaultThemeFallbackTokensJson from './default-theme-fallback-tokens.json' with { type: 'json' }
import type { ThemeTokenMap } from './resolver.js'
import { createThemeSizeTokenMap } from './size.js'

export const defaultThemeFallbackTokens = Object.freeze({
  ...defaultThemeFallbackTokensJson,
  ...createThemeSizeTokenMap(),
}) as ThemeTokenMap
