import { describe, expect, it } from 'vitest'
import {
  createBarChartSpecColors,
  createChartThemeTokenOutput,
  createMapChartModelColors,
  createSummaryBarChartSpecColors,
  resolveChartThemeColor,
  resolveChartThemeRoleColor,
} from './chart-theme.js'

describe('chart theme token output', () => {
  it('creates concrete chart output for backend, email, and image renderers', () => {
    const theme = createChartThemeTokenOutput()

    expect(theme.base).toEqual({
      foreground: '#3c2a16',
      muted: '#334155',
      border: '#e5e7eb',
    })
    expect(theme.chart.chart1.fill).toBe('#f97316')
    expect(theme.chart.chart1.fillSoft).toBe('#fed7aa')
    expect(theme.semantic.primary.fill).toBe('#0d9488')
    expect(theme.map).toEqual({
      baseFill: '#e5e7eb',
      baseStroke: '#fffaf1',
      activeStroke: '#d7c7aa',
      activeTextFill: '#ffffff',
      mutedText: '#334155',
    })
  })

  it('lets caller tokens and role overrides drive the same output shape', () => {
    const theme = createChartThemeTokenOutput({
      tokens: {
        'semantic.color.primary.primary': '#1976d2',
        'global.color.hue.orange.9': '#ff6600',
      },
      resolveRoleColor: ({ color, role, fallback }) =>
        color === 'chart1' && role === 'fill' ? `override(${fallback})` : undefined,
    })

    expect(resolveChartThemeRoleColor({ theme, color: 'primary', role: 'fill' })).toBe('#1976d2')
    expect(resolveChartThemeRoleColor({ theme, color: 'chart1', role: 'fill' })).toBe('override(#ff6600)')
  })

  it('derives spec-specific color payloads from the shared output', () => {
    const theme = createChartThemeTokenOutput()

    expect(createBarChartSpecColors({ theme, color: 'chart1' })).toMatchObject({
      fill: '#f97316',
      fillSoft: '#fed7aa',
    })
    expect(createSummaryBarChartSpecColors({ theme, color: 'primary', secondaryColor: 'error' })).toMatchObject({
      primaryFill: '#0d9488',
      secondaryFill: '#dc2626',
    })
    const mapColors = createMapChartModelColors(theme)
    expect(mapColors).toStrictEqual(theme.map)
    expect(mapColors).not.toBe(theme.map)
    expect(resolveChartThemeColor({ theme, color: undefined, fallbackColor: 'chart2', role: 'fill' })).toBe('#06b6d4')
    expect(resolveChartThemeColor({ theme, color: '', fallbackColor: 'chart2', role: 'fill' })).toBe('')
    expect(resolveChartThemeColor({ theme, color: '#123456', fallbackColor: 'chart2', role: 'fill' })).toBe('#123456')
  })
})
