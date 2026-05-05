'use client'

import { createStore, useSelector } from '@xstate/store-react'
import * as React from 'react'
import { cn } from '@/lib/utils'
import {
  type SemanticHue,
  type SemanticLane,
  THEME_VARS_TOKEN_DEFAULTS,
  type ThemeColorVariantSteps,
  type ThemeVarsTokens,
} from './tokens'

export type ThemeVarsTheme = 'radix' | 'material' | 'tailwind'

export interface ThemeVarsContextValue {
  theme: ThemeVarsTheme
  tokens: ThemeVarsTokens
  onThemeChange: (theme: ThemeVarsTheme) => void
  onSemanticColorChange: (lane: SemanticLane, color: SemanticHue) => void
  onColorVariantStepChange: <Key extends keyof ThemeColorVariantSteps>(
    key: Key,
    value: ThemeColorVariantSteps[Key],
  ) => void
}

const ThemeVarsContext = React.createContext<ThemeVarsContextValue | undefined>(undefined)

type ThemeVarsStoreContext = {
  theme: ThemeVarsTheme
  tokens: ThemeVarsTokens
}

function createThemeVarsStore(initialContext: ThemeVarsStoreContext) {
  return createStore({
    context: initialContext,
    on: {
      setTheme: (context, event: { value: ThemeVarsTheme }) => ({
        ...context,
        theme: event.value,
      }),
      setSemanticColor: (context, event: { lane: SemanticLane; color: SemanticHue }) => ({
        ...context,
        tokens: {
          ...context.tokens,
          colors: {
            ...context.tokens.colors,
            semantic: { ...context.tokens.colors.semantic, [event.lane]: event.color },
          },
        },
      }),
      setColorVariantStep: (
        context,
        event: { key: keyof ThemeColorVariantSteps; value: ThemeColorVariantSteps[keyof ThemeColorVariantSteps] },
      ) => ({
        ...context,
        tokens: {
          ...context.tokens,
          colors: {
            ...context.tokens.colors,
            variants: {
              ...context.tokens.colors.variants,
              [event.key]: event.value,
            },
          },
        },
      }),
    },
  })
}

const selectThemeVarsStoreTheme = (snapshot: { context: ThemeVarsStoreContext }) => snapshot.context.theme
const selectThemeVarsStoreTokens = (snapshot: { context: ThemeVarsStoreContext }) => snapshot.context.tokens

export interface ThemeVarsProviderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  theme?: ThemeVarsTheme
  tokens?: {
    colors?: {
      semantic?: Partial<Record<SemanticLane, SemanticHue>>
      variants?: Partial<ThemeColorVariantSteps>
    }
  }
  onTokensChange?: (tokens: ThemeVarsTokens) => void
}

export function useThemeVarsContext() {
  const context = React.useContext(ThemeVarsContext)
  if (!context) {
    throw new Error('useThemeVarsContext must be used within a ThemeVarsProvider component')
  }
  return context
}

export function useOptionalThemeVarsContext() {
  return React.useContext(ThemeVarsContext)
}

export const ThemeVarsProvider = React.forwardRef<HTMLDivElement, ThemeVarsProviderProps>(
  ({ children, className, style, theme = 'radix', tokens, onTokensChange, ...props }, ref) => {
    const themeStore = React.useState(() =>
      createThemeVarsStore({
        theme,
        tokens: {
          colors: {
            semantic: { ...THEME_VARS_TOKEN_DEFAULTS.colors.semantic, ...tokens?.colors?.semantic },
            variants: { ...THEME_VARS_TOKEN_DEFAULTS.colors.variants, ...tokens?.colors?.variants },
          },
        },
      }),
    )[0]

    const storeTheme = useSelector(themeStore, selectThemeVarsStoreTheme)
    const storeTokens = useSelector(themeStore, selectThemeVarsStoreTokens)

    React.useEffect(() => {
      themeStore.trigger.setTheme({ value: theme })
    }, [theme, themeStore])

    React.useEffect(() => {
      if (!tokens?.colors?.semantic) return
      for (const [lane, color] of Object.entries(tokens.colors.semantic) as Array<[SemanticLane, SemanticHue]>) {
        themeStore.trigger.setSemanticColor({ lane, color })
      }
    }, [themeStore, tokens?.colors?.semantic])

    React.useEffect(() => {
      if (!tokens?.colors?.variants) return
      for (const [key, value] of Object.entries(tokens.colors.variants) as Array<
        [keyof ThemeColorVariantSteps, ThemeColorVariantSteps[keyof ThemeColorVariantSteps]]
      >) {
        themeStore.trigger.setColorVariantStep({ key, value })
      }
    }, [themeStore, tokens?.colors?.variants])

    const handleThemeChange = React.useCallback(
      (nextTheme: ThemeVarsTheme) => {
        themeStore.trigger.setTheme({ value: nextTheme })
      },
      [themeStore],
    )

    const handleSemanticColorChange = React.useCallback(
      (lane: SemanticLane, color: SemanticHue) => {
        const currentTokens = themeStore.getSnapshot().context.tokens
        const nextTokens = {
          ...currentTokens,
          colors: {
            ...currentTokens.colors,
            semantic: { ...currentTokens.colors.semantic, [lane]: color },
          },
        }
        themeStore.trigger.setSemanticColor({ lane, color })
        onTokensChange?.(nextTokens)
      },
      [onTokensChange, themeStore],
    )

    const handleColorVariantStepChange = React.useCallback(
      <Key extends keyof ThemeColorVariantSteps>(key: Key, value: ThemeColorVariantSteps[Key]) => {
        const currentTokens = themeStore.getSnapshot().context.tokens
        const nextTokens = {
          ...currentTokens,
          colors: {
            ...currentTokens.colors,
            variants: {
              ...currentTokens.colors.variants,
              [key]: value,
            },
          },
        }
        themeStore.trigger.setColorVariantStep({ key, value })
        onTokensChange?.(nextTokens)
      },
      [onTokensChange, themeStore],
    )

    const contextValue = React.useMemo<ThemeVarsContextValue>(
      () => ({
        theme: storeTheme,
        tokens: storeTokens,
        onThemeChange: handleThemeChange,
        onSemanticColorChange: handleSemanticColorChange,
        onColorVariantStepChange: handleColorVariantStepChange,
      }),
      [handleColorVariantStepChange, handleSemanticColorChange, handleThemeChange, storeTheme, storeTokens],
    )

    return (
      <ThemeVarsContext.Provider value={contextValue}>
        <div {...props} ref={ref} className={cn(className)} data-theme-vars-theme={storeTheme} style={style}>
          {children}
        </div>
      </ThemeVarsContext.Provider>
    )
  },
)

ThemeVarsProvider.displayName = 'ThemeVarsProvider'
