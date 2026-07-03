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
    component: {},
  }
}

describe('theme contract validation', () => {
  it('accepts a valid theme contract', () => {
    const result = validateThemeContract(createValidThemeContract())

    expect(result.ok).toBe(true)
  })

  it('rejects non-string component token leaves', () => {
    const theme = createValidThemeContract()
    ;(theme.component as Record<string, unknown>).appShell = { content: { paddingInline: 12 } }

    const result = validateThemeContract(theme)

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.errors.join(' ')).toContain('component.appShell.content.paddingInline')
    }
  })

  it('rejects retired component token branches', () => {
    const theme = createValidThemeContract()
    ;(theme.component as Record<string, unknown>).button = { size: { sm: { paddingInline: '0.75rem' } } }
    ;(theme.component as Record<string, unknown>).accordion = { size: { md: { triggerPaddingInline: '1.25rem' } } }
    ;(theme.component as Record<string, unknown>).card = { size: { md: { padding: '1rem' } } }
    ;(theme.component as Record<string, unknown>).checkboxGroup = { gap: '0.5rem' }
    ;(theme.component as Record<string, unknown>).date = { size: { md: { calendarDaySize: '2.75rem' } } }
    ;(theme.component as Record<string, unknown>).mentionTextarea = { previewMinHeight: '96px' }
    ;(theme.component as Record<string, unknown>).pickerPopup = { size: { md: { viewportMaxHeight: '16rem' } } }
    ;(theme.component as Record<string, unknown>).progress = { size: { sm: { height: '0.4rem' } } }
    ;(theme.component as Record<string, unknown>).scrollArea = { size: { sm: { thickness: '0.375rem' } } }
    ;(theme.component as Record<string, unknown>).textField = { size: { sm: { paddingInline: '0.75rem' } } }
    ;(theme.component as Record<string, unknown>).toggle = { size: { md: { iconSize: '1rem' } } }
    ;(theme.component as Record<string, unknown>).treeView = { size: { md: { itemPaddingInline: '0.875rem' } } }

    const result = validateThemeContract(theme)

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.errors.join(' ')).toContain('component.button is retired')
      expect(result.errors.join(' ')).toContain('component.accordion is retired')
      expect(result.errors.join(' ')).toContain('component.card is retired')
      expect(result.errors.join(' ')).toContain('component.checkboxGroup is retired')
      expect(result.errors.join(' ')).toContain('component.date is retired')
      expect(result.errors.join(' ')).toContain('component.mentionTextarea is retired')
      expect(result.errors.join(' ')).toContain('component.pickerPopup is retired')
      expect(result.errors.join(' ')).toContain('component.progress is retired')
      expect(result.errors.join(' ')).toContain('component.scrollArea is retired')
      expect(result.errors.join(' ')).toContain('component.textField is retired')
      expect(result.errors.join(' ')).toContain('component.toggle is retired')
      expect(result.errors.join(' ')).toContain('component.treeView is retired')
    }
  })

  it('rejects unknown component token branches and unsupported slots', () => {
    const theme = createValidThemeContract()
    ;(theme.component as Record<string, unknown>).unknown = { size: { md: { gap: '1rem' } } }
    ;(theme.component as Record<string, unknown>).appShell = { content: { previewMinHeight: '96px' } }

    const result = validateThemeContract(theme)

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.errors.join(' ')).toContain('component.unknown is not supported')
      expect(result.errors.join(' ')).toContain('component.appShell.content.previewMinHeight')
    }
  })

  it('strips legacy stepper component tokens', () => {
    const theme = createValidThemeContract()
    ;(theme.component as Record<string, unknown>).stepper = { size: { md: { indicatorSize: '1.75rem' } } }

    const result = validateThemeContract(theme)

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect((result.value.component as Record<string, unknown>).stepper).toBeUndefined()
    }
  })

  it('strips legacy timeline component tokens', () => {
    const theme = createValidThemeContract()
    ;(theme.component as Record<string, unknown>).timeline = { size: { md: { itemOffset: '2.25rem' } } }

    const result = validateThemeContract(theme)

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect((result.value.component as Record<string, unknown>).timeline).toBeUndefined()
    }
  })

  it('strips legacy surface component tokens', () => {
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

  it('strips legacy component.dateNext tokens', () => {
    const theme = createValidThemeContract()
    const dateTokens = { cell: { borderRadius: 'var(--radius-md)' } }
    ;(theme.component as Record<string, unknown>).dateNext = dateTokens

    const result = validateThemeContract(theme)

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect((result.value.component as Record<string, unknown>).date).toBeUndefined()
      expect((result.value.component as Record<string, unknown>).dateNext).toBeUndefined()
    }
  })

  it('rejects retired component.date after stripping legacy component.dateNext', () => {
    const theme = createValidThemeContract()
    const dateTokens = { size: { md: { calendarDaySize: '2.75rem' } } }
    ;(theme.component as Record<string, unknown>).date = dateTokens
    ;(theme.component as Record<string, unknown>).dateNext = { cell: { borderRadius: 'var(--radius-lg)' } }

    const result = validateThemeContract(theme)

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.errors.join(' ')).toContain('component.date is retired')
    }
  })
})
