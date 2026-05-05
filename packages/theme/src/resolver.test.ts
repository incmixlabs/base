import { describe, expect, it } from 'vitest'
import { resolveConcreteChartRoleColor } from './chart.js'
import type { ThemeContract } from './contract/theme-contract.js'
import {
  createConcreteThemeResolver,
  createEmailThemeResolver,
  defaultEmailThemeTokens,
  defaultThemeFallbackTokens,
  resolveConcreteThemeToken,
} from './resolver.js'
import { compileThemeTokens } from './runtime/theme-compiler.js'

describe('theme concrete resolver', () => {
  it('keeps email defaults on the shared concrete fallback map', () => {
    expect(defaultEmailThemeTokens).toBe(defaultThemeFallbackTokens)
    expect(Object.isFrozen(defaultThemeFallbackTokens)).toBe(true)
    expect(createEmailThemeResolver()('semantic.color.neutral.surface')).toBe('#fffaf1')
    expect(createEmailThemeResolver()('global.size.xl.height')).toBe('2.75rem')
  })

  it('resolves semantic and chart hue tokens without browser CSS variables', () => {
    const resolver = createConcreteThemeResolver()

    expect(resolver('semantic.color.slate.soft')).toBe('#e5e7eb')
    expect(resolver('global.color.hue.orange.9')).toBe('#f97316')
  })

  it('lets caller tokens override concrete fallback values', () => {
    expect(
      resolveConcreteThemeToken('global.color.hue.orange.9', {
        tokens: { 'global.color.hue.orange.9': '#ff6600' },
      }),
    ).toBe('#ff6600')
  })

  it('uses compiled palette tokens before concrete fallbacks', () => {
    const { tokenMap } = compileThemeTokens({
      metadata: {
        schemaVersion: '1.0.0',
        themeId: 'material-like',
        version: '1.0.0',
        lifecycle: 'draft',
      },
      global: {
        color: { hue: { blue: { '9': '#1976d2' } } },
        size: {},
        fontWeight: {},
        borderRadius: {},
        spacing: {},
        breakpoint: {},
        typography: {},
      },
      semantic: {
        color: {
          primary: {
            surface: '#e3f2fd',
            soft: '#bbdefb',
            primary: '#1976d2',
            text: '#0d47a1',
            contrast: '#ffffff',
            border: '#90caf9',
          },
        },
      },
      component: {},
    } as unknown as ThemeContract)
    const resolver = createConcreteThemeResolver(tokenMap)

    expect(resolver('semantic.color.primary.primary')).toBe('#1976d2')
    expect(resolveConcreteChartRoleColor({ color: 'primary', role: 'fill', resolver })).toBe('#1976d2')
    expect(resolveConcreteChartRoleColor({ color: 'chart1', role: 'fill', resolver })).toBe('#f97316')
  })
})
