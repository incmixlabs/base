import { describe, expect, it } from 'vitest'
import { THEME_CONTRACT_SCHEMA_VERSION, validateThemeContract } from './theme-contract.js'

function createValidThemeContract() {
  return {
    metadata: {
      schemaVersion: THEME_CONTRACT_SCHEMA_VERSION,
      themeId: 'theme-default',
      version: '1.0.0',
      extends: null,
      lifecycle: 'draft',
    },
    global: {
      color: { hue: { teal: { '9': 'oklch(0.6 0.12 180)' } } },
      size: { sm: { height: '1.75rem' } },
      fontWeight: { light: '300', regular: '400', medium: '500', bold: '700' },
      borderRadius: { none: '0', sm: '4px', md: '6px', lg: '8px', full: '9999px' },
      breakpoint: { xs: '520px', sm: '768px', md: '1024px', lg: '1280px', xl: '1640px' },
      typography: {
        fontSans: 'system-ui',
        fontSerif: 'Georgia, serif',
        fontMono: 'ui-monospace',
        responsiveProfile: 'balanced',
      },
    },
    semantic: {
      color: {
        default: { text: 'oklch(0.2 0 0)', background: 'oklch(1 0 0)' },
      },
    },
    component: {
      button: { size: { sm: { paddingInline: '0.75rem' } } },
    },
  }
}

describe('theme contract validation', () => {
  it('accepts a valid theme contract', () => {
    const result = validateThemeContract(createValidThemeContract())

    expect(result.ok).toBe(true)
  })

  it('rejects non-string component token leaves', () => {
    const theme = createValidThemeContract()
    theme.component.button.size.sm.paddingInline = 12 as never

    const result = validateThemeContract(theme)

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.errors.join(' ')).toContain('component.button.size.sm.paddingInline')
    }
  })

  it('rejects retired checkbox/radio component token branches', () => {
    const theme = createValidThemeContract()
    ;(theme.component as Record<string, unknown>).checkboxGroup = { gap: '0.5rem' }

    const result = validateThemeContract(theme)

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.errors.join(' ')).toContain('component.checkboxGroup is retired')
    }
  })

  it('strips migrated retired stepper component tokens', () => {
    const theme = createValidThemeContract()
    ;(theme.component as Record<string, unknown>).stepper = { size: { md: { indicatorSize: '1.75rem' } } }

    const result = validateThemeContract(theme)

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect((result.value.component as Record<string, unknown>).stepper).toBeUndefined()
    }
  })

  it('aliases legacy component.dateNext to component.date', () => {
    const theme = createValidThemeContract()
    const dateTokens = { cell: { borderRadius: 'var(--radius-md)' } }
    ;(theme.component as Record<string, unknown>).dateNext = dateTokens

    const result = validateThemeContract(theme)

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.value.component.date).toEqual(dateTokens)
      expect((result.value.component as Record<string, unknown>).dateNext).toBeUndefined()
    }
  })

  it('rejects contracts that provide both component.date and component.dateNext', () => {
    const theme = createValidThemeContract()
    ;(theme.component as Record<string, unknown>).date = { cell: { borderRadius: 'var(--radius-md)' } }
    ;(theme.component as Record<string, unknown>).dateNext = { cell: { borderRadius: 'var(--radius-lg)' } }

    const result = validateThemeContract(theme)

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.errors).toContain(
        'Provide only one of component.date or component.dateNext (component.dateNext is deprecated)',
      )
    }
  })
})
