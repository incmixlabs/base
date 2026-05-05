import type { ThemeBreakpoint } from './theme-breakpoints'

export type ThemeDashboardColumnBreakpoint = 'initial' | ThemeBreakpoint
export type ThemeDashboardColumnConfig = number | Partial<Record<ThemeDashboardColumnBreakpoint, number>>

export interface ThemeDashboard {
  gap: number
  columns: ThemeDashboardColumnConfig
}

export const DEFAULT_THEME_DASHBOARD_COLUMNS: Required<Record<ThemeDashboardColumnBreakpoint, number>> = {
  initial: 1,
  xs: 2,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 12,
}

export const DEFAULT_THEME_DASHBOARD: ThemeDashboard = {
  gap: 12,
  columns: DEFAULT_THEME_DASHBOARD_COLUMNS,
}

export function normalizeThemeDashboardGap(value: number | undefined): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) return DEFAULT_THEME_DASHBOARD.gap
  return Math.max(0, value)
}

function normalizeThemeDashboardColumnValue(value: number | undefined, fallback: number): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) return fallback
  return Math.max(1, Math.round(value))
}

export function normalizeThemeDashboardColumns(
  columns: ThemeDashboardColumnConfig | undefined,
): ThemeDashboardColumnConfig {
  if (typeof columns === 'number') {
    return normalizeThemeDashboardColumnValue(columns, DEFAULT_THEME_DASHBOARD_COLUMNS.initial)
  }

  return (Object.keys(DEFAULT_THEME_DASHBOARD_COLUMNS) as ThemeDashboardColumnBreakpoint[]).reduce<
    Required<Record<ThemeDashboardColumnBreakpoint, number>>
  >(
    (resolved, breakpoint) => {
      resolved[breakpoint] = normalizeThemeDashboardColumnValue(
        columns?.[breakpoint],
        DEFAULT_THEME_DASHBOARD_COLUMNS[breakpoint],
      )
      return resolved
    },
    { ...DEFAULT_THEME_DASHBOARD_COLUMNS },
  )
}
