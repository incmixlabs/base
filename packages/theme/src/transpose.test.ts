import { describe, expect, it } from 'vitest'
import { createEmailThemeResolver, createThemeResolver } from './resolver.js'
import { transposeTokenStyle } from './transpose.js'

describe('transposeTokenStyle', () => {
  it('resolves email-safe token-backed style definitions to inline values', () => {
    const style = transposeTokenStyle({
      color: { token: 'semantic.color.success.text' },
      fontFamily: { token: 'global.typography.fontSerif' },
      fontWeight: { token: 'global.fontWeight.bold' },
      margin: '0 0 12px',
    })

    expect(style).toEqual({
      color: '#166534',
      fontFamily: '"Newsreader Variable", "Newsreader", ui-serif, Georgia, "Times New Roman", serif',
      fontWeight: '700',
      margin: '0 0 12px',
    })
  })

  it('lets callers override tokens while retaining email defaults', () => {
    const resolver = createThemeResolver({
      tokens: {
        'semantic.color.primary.text': '#0055aa',
      },
    })

    expect(
      transposeTokenStyle(
        {
          color: { token: 'semantic.color.primary.text' },
          backgroundColor: { token: 'semantic.color.neutral.surface' },
        },
        { resolver },
      ),
    ).toEqual({
      color: '#0055aa',
      backgroundColor: '#fffaf1',
    })
  })

  it('creates an email resolver from theme editor token output', () => {
    const resolver = createEmailThemeResolver({
      'semantic.color.neutral.surface': '#eef6ff',
      'semantic.color.primary.text': '#0055aa',
      'global.spacing.8': '40px',
    })

    expect(
      transposeTokenStyle(
        {
          backgroundColor: { token: 'semantic.color.neutral.surface' },
          color: { token: 'semantic.color.primary.text' },
          fontWeight: { token: 'global.fontWeight.bold' },
          padding: { tokens: ['global.spacing.8', 'global.spacing.0'] },
        },
        { resolver },
      ),
    ).toEqual({
      backgroundColor: '#eef6ff',
      color: '#0055aa',
      fontWeight: '700',
      padding: '40px 0px',
    })
  })

  it('rejects browser-only style properties by default', () => {
    expect(() =>
      transposeTokenStyle({
        display: 'grid',
      } as never),
    ).toThrow('Unsupported email inline style property: display')
  })

  it('rejects unresolved tokens by default', () => {
    expect(() =>
      transposeTokenStyle({
        color: { token: 'semantic.color.brand.missing' },
      }),
    ).toThrow('Unresolved theme token: semantic.color.brand.missing')
  })

  it('rejects malformed token style objects by default', () => {
    expect(() =>
      transposeTokenStyle({
        color: { value: 'semantic.color.primary.text' },
      } as never),
    ).toThrow("Invalid token style value: expected exactly one of 'token' or 'tokens'")
  })

  it('rejects ambiguous token style objects by default', () => {
    expect(() =>
      transposeTokenStyle({
        padding: {
          token: 'global.spacing.8',
          tokens: ['global.spacing.8', 'global.spacing.0'],
        },
      } as never),
    ).toThrow("Invalid token style value: expected exactly one of 'token' or 'tokens'")
  })

  it('rejects empty token arrays by default', () => {
    expect(() =>
      transposeTokenStyle({
        padding: { tokens: [] },
      }),
    ).toThrow("Invalid token style value: 'tokens' must be a non-empty array")
  })
})
