import { describe, expect, it } from 'vitest'
import { createThemeResolver } from './resolver.js'
import {
  CHART_COLOR_KEYS,
  CHART_ROLES,
  CHART_SEMANTIC_LANES,
  getChartLaneColorTokenPath,
  getChartLaneContrastTokenPath,
  getChartPaletteSignature,
  getChartRoleTokenPath,
  getChartSeriesColorKey,
  getSemanticChartRoleTokenPath,
  isChartSemanticLane,
  normalizeChartColor,
  normalizeChartSemanticLane,
  resolveChartRoleToken,
  resolveConcreteChartRoleColor,
} from './chart.js'

describe('chart theme semantics', () => {
  it('normalizes chart aliases and selects series lanes', () => {
    expect(normalizeChartColor('chart1')).toBe('chart1')
    expect(normalizeChartColor('chart-2')).toBe('chart2')
    expect(normalizeChartColor('accent')).toBeUndefined()
    expect(getChartSeriesColorKey(0)).toBe('chart1')
    expect(getChartSeriesColorKey(6)).toBe('chart2')
    expect(getChartSeriesColorKey(-1)).toBe('chart5')
  })

  it('maps chart lanes to existing theme token paths', () => {
    expect(getChartLaneColorTokenPath('chart1')).toBe('global.color.hue.orange.9')
    expect(getChartLaneColorTokenPath('chart1', 'dark')).toBe('global.color.hue.orange.11')
    expect(getChartLaneContrastTokenPath('chart2')).toBe('global.color.hue.cyan.contrast')
  })

  it('maps chart roles to existing token paths without defining new tones', () => {
    expect(getChartRoleTokenPath('chart1', 'track')).toBe('global.color.hue.orange.4')
    expect(getChartRoleTokenPath('chart1', 'fill')).toBe('global.color.hue.orange.9')
    expect(getSemanticChartRoleTokenPath('accent', 'track')).toBe('semantic.color.accent.surface')
    expect(getSemanticChartRoleTokenPath('accent', 'fill')).toBe('semantic.color.accent.primary')
    expect(() => getChartRoleTokenPath('tomato' as never, 'fill')).toThrow('Unsupported chart color: tomato')
  })

  it('recognizes semantic chart lanes', () => {
    expect(isChartSemanticLane('accent')).toBe(true)
    expect(isChartSemanticLane('tomato')).toBe(false)
    expect(isChartSemanticLane('default')).toBe(false)
    expect(normalizeChartSemanticLane('slate')).toBe('slate')
    expect(normalizeChartSemanticLane('accent')).toBe('accent')
    expect(normalizeChartSemanticLane('default')).toBeUndefined()
  })

  it('resolves chart roles through a backend-safe theme resolver', () => {
    const resolver = createThemeResolver({
      tokens: {
        'global.color.hue.orange.9': '#f97316',
        'semantic.color.accent.surface': '#f3e8ff',
      },
      fallbackTokens: {},
    })

    expect(resolveChartRoleToken({ color: 'chart1', role: 'fill', resolver })).toBe('#f97316')
    expect(resolveChartRoleToken({ color: 'accent', role: 'track', resolver })).toBe('#f3e8ff')
  })

  it('resolves chart roles through concrete fallback tokens', () => {
    expect(resolveConcreteChartRoleColor({ color: 'chart1', role: 'fill' })).toBe('#f97316')
    expect(resolveConcreteChartRoleColor({ color: 'chart2', role: 'contrast' })).toBe('#ffffff')
    expect(resolveConcreteChartRoleColor({ color: 'accent', role: 'track' })).toBe('#faf5ff')
  })

  it('resolves every semantic chart lane and role through concrete fallback tokens', () => {
    for (const color of CHART_SEMANTIC_LANES) {
      for (const role of CHART_ROLES) {
        expect(resolveConcreteChartRoleColor({ color, role })).toEqual(expect.any(String))
      }
    }
  })

  it('resolves every chart color lane and role through concrete fallback tokens', () => {
    for (const color of CHART_COLOR_KEYS) {
      for (const role of CHART_ROLES) {
        expect(resolveConcreteChartRoleColor({ color, role })).toEqual(expect.any(String))
      }
    }
  })

  it('creates stable palette signatures', () => {
    expect(
      getChartPaletteSignature({
        mode: 'spectrum',
        color: 'primary',
        colors: ['chart1', 'secondary'],
      }),
    ).toBe('{"mode":"spectrum","color":"primary","colors":["chart1","secondary"]}')
    expect(
      getChartPaletteSignature({
        mode: 'spectrum',
        color: 'chart-1',
        colors: ['chart-2', 'slate'],
      }),
    ).toBe('{"mode":"spectrum","color":"chart1","colors":["chart2","slate"]}')
  })
})
