import * as React from 'react'
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
}

import { ThemeRadiusProvider } from '../elements/utils'
import { RootThemePortalContainerContext, ThemeContext, ThemePortalContainerContext } from './theme-provider.context'
import { designTokens } from './tokens'

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
  const style = resolvedRadius
    ? ({
        '--element-border-radius': resolvedRadius,
      } as React.CSSProperties)
    : undefined

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

  const contextValue = React.useMemo(
    () => ({
      appearance,
      accentColor,
      grayColor,
      radius,
      scaling,
      breakpoints: normalizedBreakpoints,
      dashboard: normalizedDashboard,
    }),
    [appearance, accentColor, grayColor, radius, scaling, normalizedBreakpoints, normalizedDashboard],
  )

  return (
    <ThemeContext.Provider value={contextValue}>
      <ThemePortalContainerContext.Provider value={undefined as any}>
        <RootThemePortalContainerContext.Provider value={undefined as any}>
          <ThemeRadiusProvider value={radius as any}>
            <div {...props} style={{ ...style, ...props.style }}>
              {children}
            </div>
          </ThemeRadiusProvider>
        </RootThemePortalContainerContext.Provider>
      </ThemePortalContainerContext.Provider>
    </ThemeContext.Provider>
  )
}

export const Theme = ThemeProvider
