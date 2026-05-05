import { describe, expect, it } from 'vitest'
import { resolveChartThemeRoleColor } from '@incmix/theme'
import { chartColorContrastVar, chartColorVar } from '@/theme/props/color.prop'
import {
  createChartStyleThemeResolver,
  createChartStyleThemeTokenOutput,
  getChartProviderStyle,
  getChartSeriesColor,
  resolveChartColorValue,
} from './chart-colors'

describe('chart color helpers', () => {
  it('resolves chart aliases and semantic tones to css variables', () => {
    expect(resolveChartColorValue('chart-2')).toBe('var(--chart-2)')
    expect(resolveChartColorValue('chart2')).toBe('var(--chart-2)')
    expect(resolveChartColorValue('accent')).toBe('var(--color-accent-primary)')
    expect(resolveChartColorValue(undefined, getChartSeriesColor(3))).toBe('var(--chart-4)')
  })

  it('fails loudly for unsupported chart variable tokens', () => {
    expect(chartColorVar('chart-2')).toBe('var(--chart-2)')
    expect(chartColorContrastVar('chart2')).toBe('var(--chart-2-contrast)')
    expect(() => chartColorVar('default' as never)).toThrow('Unsupported chart color: default')
  })

  it('creates monochrome chart variables from existing semantic tone tokens', () => {
    const style = getChartProviderStyle({ mode: 'monochrome', color: 'accent' })

    expect(style['--chart-1' as keyof typeof style]).toBe('var(--color-accent-text)')
    expect(style['--chart-2' as keyof typeof style]).toBe('var(--color-accent-primary)')
    expect(style['--chart-5' as keyof typeof style]).toBe('var(--color-accent-surface)')
    expect(style['--chart-5-contrast' as keyof typeof style]).toBe('var(--color-accent-contrast)')
  })

  it('creates monochrome chart variables from existing hue tone tokens', () => {
    const style = getChartProviderStyle({ mode: 'monochrome', color: 'chart1' })

    expect(style['--chart-1' as keyof typeof style]).toBe('var(--orange-11)')
    expect(style['--chart-2' as keyof typeof style]).toBe('var(--orange-9)')
    expect(style['--chart-5' as keyof typeof style]).toBe('var(--orange-4)')
    expect(style['--chart-5-contrast' as keyof typeof style]).toBe('var(--orange-contrast)')
  })

  it('creates spectrum overrides from supplied tones', () => {
    const style = getChartProviderStyle({ mode: 'spectrum', color: 'primary', colors: ['chart1', 'secondary'] })

    expect(style['--chart-1' as keyof typeof style]).toBe('var(--chart-1)')
    expect(style['--chart-2' as keyof typeof style]).toBe('var(--color-secondary-primary)')
    expect(style['--chart-4' as keyof typeof style]).toBe('var(--color-secondary-primary)')
  })

  it('creates chart theme output from computed css variables for canvas renderers', () => {
    const host = document.createElement('div')

    try {
      host.style.setProperty('--chart-1', '#123456')
      host.style.setProperty('--chart-1-contrast', '#ffffff')
      host.style.setProperty('--color-primary-primary', '#0055aa')
      host.style.setProperty('--color-neutral-text', '#111111')
      host.style.setProperty('--color-slate-text', '#444444')
      host.style.setProperty('--color-slate-soft', '#dddddd')
      host.style.setProperty('--color-neutral-surface', '#fafafa')
      host.style.setProperty('--color-neutral-border', '#cccccc')
      host.style.setProperty('--color-dark-contrast', '#ffffff')
      document.body.appendChild(host)

      const styles = window.getComputedStyle(host)
      const resolver = createChartStyleThemeResolver(styles)
      const theme = createChartStyleThemeTokenOutput(styles)

      expect(resolver('semantic.color.primary.primary')).toBe('#0055aa')
      expect(theme.base).toMatchObject({ foreground: '#111111', muted: '#444444', border: '#dddddd' })
      expect(resolveChartThemeRoleColor({ theme, color: 'chart1', role: 'fill' })).toBe('#123456')
      expect(resolveChartThemeRoleColor({ theme, color: 'primary', role: 'fill' })).toBe('#0055aa')
    } finally {
      host.remove()
    }
  })
})
