import * as React from 'react'
import { buildRuntimePaletteVars } from './runtime-palette-vars'
import { buildSemanticLaneVars } from './semantic-lane-vars'
import { normalizeThemeBreakpoints, type ThemeBreakpointConfig, type ThemeBreakpoints } from './theme-breakpoints'
import { normalizeThemeDashboardColumns, normalizeThemeDashboardGap, type ThemeDashboard } from './theme-dashboard'

export interface ThemeProviderProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
  radius?: 'none' | 'small' | 'medium' | 'large' | 'full' | string
  appearance?: 'light' | 'dark'
  accentColor?: string
  grayColor?: string
  scaling?: string
  onAppearanceChange?: (appearance: 'light' | 'dark') => void
  breakpoints?: ThemeBreakpointConfig
  dashboard?: Partial<ThemeDashboard>
}

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

import { ThemeRadiusProvider } from '../elements/utils'
import { RootThemePortalContainerContext, ThemeContext, ThemePortalContainerContext } from './theme-provider.context'
import { designTokens, SEMANTIC_COLOR_DEFAULTS, THEME_COLOR_VARIANT_DEFAULTS } from './tokens'

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  radius,
  appearance,
  accentColor,
  grayColor,
  scaling,
  onAppearanceChange,
  breakpoints,
  dashboard,
  ...props
}) => {
  const resolvedRadius =
    radius && radius in designTokens.radius ? designTokens.radius[radius as keyof typeof designTokens.radius] : radius
  const resolvedAppearance = appearance === 'dark' ? 'dark' : 'light'
  const style = {
    ...buildRuntimePaletteVars(resolvedAppearance),
    ...buildSemanticLaneVars(SEMANTIC_COLOR_DEFAULTS, THEME_COLOR_VARIANT_DEFAULTS),
    ...(resolvedRadius ? { '--element-border-radius': resolvedRadius } : {}),
    ...(scaling ? { '--scaling': scaling } : {}),
  } as React.CSSProperties

  const normalizedBreakpoints = React.useMemo(() => {
    if (!breakpoints) return undefined
    return normalizeThemeBreakpoints(breakpoints)
  }, [breakpoints])

  const normalizedDashboard = React.useMemo(() => {
    if (!dashboard) return undefined
    return {
      gap: normalizeThemeDashboardGap(dashboard.gap),
      columns: normalizeThemeDashboardColumns(dashboard.columns),
    }
  }, [dashboard])

  const themeClassName = [
    'af-themes',
    appearance === 'light' && 'light',
    appearance === 'dark' && 'dark',
    props.className,
  ]
    .filter(Boolean)
    .join(' ')

  const coreThemeClassName = ['af-themes', appearance === 'light' && 'light', appearance === 'dark' && 'dark']
    .filter(Boolean)
    .join(' ')

  const themeDataAttributes = {
    ...(appearance !== undefined ? { 'data-appearance': appearance } : {}),
    ...(radius !== undefined ? { 'data-radius': radius } : {}),
    ...(accentColor !== undefined ? { 'data-accent-color': accentColor } : {}),
    ...(grayColor !== undefined ? { 'data-gray-color': grayColor } : {}),
    ...(scaling !== undefined ? { 'data-scaling': scaling } : {}),
  }

  const contextValue = React.useMemo<ThemeProviderContextValue>(
    () => ({
      appearance,
      accentColor,
      grayColor,
      radius,
      scaling,
      breakpoints: normalizedBreakpoints,
      dashboard: normalizedDashboard,
      themeClassName: coreThemeClassName,
      themeStyles: style,
    }),
    [
      appearance,
      accentColor,
      grayColor,
      radius,
      scaling,
      normalizedBreakpoints,
      normalizedDashboard,
      coreThemeClassName,
      style,
    ],
  )

  return (
    <ThemeContext.Provider value={contextValue}>
      <ThemePortalContainerContext.Provider value={undefined as any}>
        <RootThemePortalContainerContext.Provider value={undefined as any}>
          <ThemeRadiusProvider value={radius as any}>
            <div {...props} className={themeClassName} style={{ ...style, ...props.style }} {...themeDataAttributes}>
              {children}
            </div>
          </ThemeRadiusProvider>
        </RootThemePortalContainerContext.Provider>
      </ThemePortalContainerContext.Provider>
    </ThemeContext.Provider>
  )
}

export const Theme = ThemeProvider
