'use client'

import * as React from 'react'
import type { ThemeBreakpoints } from './theme-breakpoints'
import type { ThemeDashboard } from './theme-dashboard'

export interface ThemeProviderContextValue {
  appearance?: 'light' | 'dark'
  accentColor?: string
  grayColor?: string
  radius?: string
  scaling?: string
  breakpoints?: ThemeBreakpoints
  dashboard?: ThemeDashboard
  themeClassName?: string
  themeStyles?: React.CSSProperties
}

export const ThemeContext = React.createContext<ThemeProviderContextValue | undefined>(undefined)

export const ThemePortalContainerContext = React.createContext<HTMLElement | null>(null)
export const RootThemePortalContainerContext = React.createContext<HTMLElement | null>(null)

export function useThemePortalContainer(): HTMLElement | null | undefined {
  const hasProvider = React.useContext(ThemeContext) !== undefined
  const container = React.useContext(ThemePortalContainerContext)
  if (!hasProvider) return undefined
  return container || undefined
}

export function useRootThemePortalContainer(): HTMLElement | null | undefined {
  const hasProvider = React.useContext(ThemeContext) !== undefined
  const container = React.useContext(RootThemePortalContainerContext)
  if (!hasProvider) return undefined
  return container
}

/** useThemeProviderContext export. */
export function useThemeProviderContext() {
  const context = React.useContext(ThemeContext)
  if (!context) {
    throw new Error('useThemeProviderContext must be used within a ThemeProvider component')
  }
  return context
}

/** useOptionalThemeProviderContext export. */
export function useOptionalThemeProviderContext() {
  return React.useContext(ThemeContext)
}

export type ThemeContextValue = ThemeProviderContextValue
export const useThemeContext = useThemeProviderContext
export const useOptionalThemeContext = useOptionalThemeProviderContext
