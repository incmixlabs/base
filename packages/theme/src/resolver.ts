import { defaultThemeFallbackTokens } from './default-theme-fallback-tokens.js'

export { defaultThemeFallbackTokens } from './default-theme-fallback-tokens.js'

export type ThemeTokenPath =
  | `semantic.color.${string}.${string}`
  | `global.color.hue.${string}.${string}`
  | `global.size.${string}.${string}`
  | `global.fontWeight.${string}`
  | `global.typography.${string}`
  | `global.spacing.${string}`
  | `global.borderRadius.${string}`
  | `component.${string}.${string}`
  | (string & {})

export type ThemeTokenMap = Record<ThemeTokenPath, string>

export type ThemeResolver = (path: ThemeTokenPath) => string | undefined

export type ThemeResolverOptions = {
  tokens?: ThemeTokenMap
  fallbackTokens?: ThemeTokenMap
}

export const defaultEmailThemeTokens = defaultThemeFallbackTokens

export function createThemeResolver({
  tokens = {},
  fallbackTokens = defaultThemeFallbackTokens,
}: ThemeResolverOptions = {}): ThemeResolver {
  return path => tokens[path] ?? fallbackTokens[path]
}

export function createConcreteThemeResolver(themeEditorTokens?: ThemeTokenMap): ThemeResolver {
  return createThemeResolver({
    tokens: themeEditorTokens,
    fallbackTokens: defaultThemeFallbackTokens,
  })
}

export function createEmailThemeResolver(themeEditorTokens?: ThemeTokenMap): ThemeResolver {
  return createThemeResolver({
    tokens: themeEditorTokens,
    fallbackTokens: defaultEmailThemeTokens,
  })
}

/**
 * Convenience helper for single-token lookup.
 * For batch operations, prefer `createThemeResolver()` to avoid repeated resolver instantiation.
 */
export function resolveThemeToken(path: ThemeTokenPath, options?: ThemeResolverOptions): string | undefined {
  return createThemeResolver(options)(path)
}

export function resolveConcreteThemeToken(
  path: ThemeTokenPath,
  options?: Pick<ThemeResolverOptions, 'tokens'>,
): string | undefined {
  return createConcreteThemeResolver(options?.tokens)(path)
}
