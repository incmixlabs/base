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

  it('rejects retired component token branches', () => {
    const theme = createValidThemeContract()
    ;(theme.component as Record<string, unknown>).checkboxGroup = { gap: '0.5rem' }
    ;(theme.component as Record<string, unknown>).toggle = { size: { md: { iconSize: '1rem' } } }
    ;(theme.component as Record<string, unknown>).treeView = { size: { md: { itemPaddingInline: '0.875rem' } } }

    const result = validateThemeContract(theme)

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.errors.join(' ')).toContain('component.checkboxGroup is retired')
      expect(result.errors.join(' ')).toContain('component.toggle is retired')
      expect(result.errors.join(' ')).toContain('component.treeView is retired')
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

  it('strips migrated retired timeline component tokens', () => {
    const theme = createValidThemeContract()
    ;(theme.component as Record<string, unknown>).timeline = { size: { md: { itemOffset: '2.25rem' } } }

    const result = validateThemeContract(theme)

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect((result.value.component as Record<string, unknown>).timeline).toBeUndefined()
    }
  })

  it('strips migrated retired surface component tokens', () => {
    const theme = createValidThemeContract()
    ;(theme.component as Record<string, unknown>).surface = {
      variant: { surface: { boxShadow: '0 0 0 1px red' } },
      shape: { pill: { radius: '9999px' } },
    }

    const result = validateThemeContract(theme)

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect((result.value.component as Record<string, unknown>).surface).toBeUndefined()
    }
  })

  it('strips migrated retired dateNext component tokens', () => {
    const theme = createValidThemeContract()
    const dateTokens = { cell: { borderRadius: 'var(--radius-md)' } }
    ;(theme.component as Record<string, unknown>).dateNext = dateTokens

    const result = validateThemeContract(theme)

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.value.component.date).toEqual({})
      expect((result.value.component as Record<string, unknown>).dateNext).toBeUndefined()
    }
  })
})
