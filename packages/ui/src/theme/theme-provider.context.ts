'use client'

import * as React from 'react'
import type { ThemeProviderContextValue } from './ThemeProvider'

export const ThemeContext = React.createContext<ThemeProviderContextValue | undefined>(undefined)

export const ThemePortalContainerContext = React.createContext<HTMLElement | null>(null)
export const RootThemePortalContainerContext = React.createContext<HTMLElement | null>(null)

export function useThemePortalContainer(): HTMLElement | null | undefined {
  const hasProvider = React.useContext(ThemeContext) !== undefined
  const container = React.useContext(ThemePortalContainerContext)
  if (!hasProvider) return undefined
  return container
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
