import { describe, expect, it } from 'vitest'
import { parseThemeContract, THEME_CONTRACT_SCHEMA_VERSION, validateThemeContract } from './index'

function createValidTheme() {
  return {
    metadata: {
      schemaVersion: THEME_CONTRACT_SCHEMA_VERSION,
      themeId: 'theme-default',
      tenantId: 'tenant-a',
      version: '1.0.0',
      extends: null,
      lifecycle: 'draft',
      fonts: {
        sans: { kind: 'css-url', url: 'https://fonts.example.com/sans.css' },
      },
    },
    global: {
      color: { hue: { teal: { '9': 'oklch(0.6 0.12 180)' } } },
      size: { sm: { height: '1.75rem' } },
      fontWeight: { light: '300', regular: '400', medium: '500', semibold: '600', bold: '700' },
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
      appShell: {
        content: { paddingInline: '1rem', paddingInlineDesktop: '1.5rem' },
        layout: { bodyWithSecondaryRightGridTemplateColumns: 'auto minmax(0, 1fr) 20rem' },
      },
    },
  }
}

describe('theme-contract', () => {
  it('validates a well-formed v1 contract', () => {
    const theme = createValidTheme()
    const result = validateThemeContract(theme)

    expect(result.ok).toBe(true)
  })

  it('fails validation for missing required top-level keys', () => {
    const result = validateThemeContract({ metadata: {} })

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.errors.join(' ')).toContain('global must be an object')
      expect(result.errors.join(' ')).toContain('semantic must be an object')
      expect(result.errors.join(' ')).toContain('component must be an object')
    }
  })

  it('fails validation for invalid schemaVersion and lifecycle', () => {
    const theme = createValidTheme()
    ;(theme.metadata as { schemaVersion: string }).schemaVersion = '2.0.0'
    theme.metadata.lifecycle = 'active' as never

    const result = validateThemeContract(theme)

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.errors.join(' ')).toContain('metadata.schemaVersion')
      expect(result.errors.join(' ')).toContain('metadata.lifecycle')
    }
  })

  it('fails validation for optional metadata fields when explicitly undefined', () => {
    const theme = createValidTheme() as Record<string, unknown>
    const metadata = theme.metadata as Record<string, unknown>
    metadata.tenantId = undefined
    metadata.extends = undefined

    const result = validateThemeContract(theme)

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.errors.join(' ')).toContain('metadata.tenantId')
      expect(result.errors.join(' ')).toContain('metadata.extends')
    }
  })

  it('fails validation for optional metadata fields when empty strings are provided', () => {
    const theme = createValidTheme() as Record<string, unknown>
    const metadata = theme.metadata as Record<string, unknown>
    metadata.tenantId = ''
    metadata.extends = ''

    const result = validateThemeContract(theme)

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.errors.join(' ')).toContain('metadata.tenantId')
      expect(result.errors.join(' ')).toContain('metadata.extends')
    }
  })

  it('fails validation for invalid metadata font source objects', () => {
    const theme = createValidTheme() as Record<string, unknown>
    const metadata = theme.metadata as Record<string, unknown>
    metadata.fonts = {
      sans: { kind: 'file-url', url: '' },
    }

    const result = validateThemeContract(theme)

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.errors.join(' ')).toContain('metadata.fonts')
    }
  })

  it('fails validation for array-valued object slots', () => {
    const theme = createValidTheme()
    ;(theme.global as unknown as Record<string, unknown>).size = [] as unknown as Record<string, string>

    const result = validateThemeContract(theme)

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.errors.join(' ')).toContain('global.size must be an object')
    }
  })

  it('fails validation for missing required nested leaf keys', () => {
    const theme = createValidTheme()
    delete (theme.global.fontWeight as Record<string, string>).bold
    delete (theme.global.breakpoint as Record<string, string>).xl
    delete (theme.global.typography as Record<string, string>).responsiveProfile

    const result = validateThemeContract(theme)

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.errors.join(' ')).toContain('global.fontWeight.bold')
      expect(result.errors.join(' ')).toContain('global.breakpoint.xl')
      expect(result.errors.join(' ')).toContain('global.typography.responsiveProfile')
    }
  })

  it('fails validation when global.color.hue is missing', () => {
    const theme = createValidTheme()
    delete (theme.global.color as Record<string, unknown>).hue

    const result = validateThemeContract(theme)

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.errors.join(' ')).toContain('global.color.hue')
    }
  })

  it('fails validation for unsupported responsiveProfile values', () => {
    const theme = createValidTheme()
    ;(theme.global.typography as Record<string, string>).responsiveProfile = 'ultra'

    const result = validateThemeContract(theme)

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.errors.join(' ')).toContain('global.typography.responsiveProfile')
      expect(result.errors.join(' ')).toContain('compact|balanced|expressive')
    }
  })

  it('fails validation for non-plain object slots like Date and Map', () => {
    const theme = createValidTheme()
    ;(theme.global as unknown as Record<string, unknown>).size = new Date() as unknown as Record<
      string,
      Record<string, string>
    >
    ;(theme.semantic as unknown as Record<string, unknown>).color = new Map() as unknown as Record<
      string,
      Record<string, string>
    >

    const result = validateThemeContract(theme)

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.errors.join(' ')).toContain('global.size must be an object')
      expect(result.errors.join(' ')).toContain('semantic.color must be an object')
    }
  })

  it('accepts null-prototype objects for token maps', () => {
    const theme = createValidTheme()
    const borderRadius = Object.create(null) as {
      none: string
      sm: string
      md: string
      lg: string
      full: string
    }
    borderRadius.none = '0'
    borderRadius.sm = '4px'
    borderRadius.md = '6px'
    borderRadius.lg = '8px'
    borderRadius.full = '9999px'
    theme.global.borderRadius = borderRadius

    const result = validateThemeContract(theme)

    expect(result.ok).toBe(true)
  })

  it('fills missing component branches with empty objects during validation', () => {
    const theme = createValidTheme()
    delete (theme.component as Record<string, unknown>).appShell

    const result = validateThemeContract(theme)

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.value.component.appShell).toEqual({})
    }
  })

  it('parses a valid contract and throws on invalid payloads', () => {
    const theme = createValidTheme()

    expect(parseThemeContract(theme).metadata.themeId).toBe('theme-default')
    expect(() => parseThemeContract({})).toThrow('Invalid theme contract')
  })

  it('rejects retired FieldGroup component token overrides', () => {
    const theme = createValidTheme()
    ;(theme.component as Record<string, unknown>).fieldGroup = { row: { rootGap: '1rem' } }

    const result = validateThemeContract(theme)

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.errors.join(' ')).toContain('component.fieldGroup is retired')
    }
  })

  it('rejects retired FileUpload component token overrides', () => {
    const theme = createValidTheme()
    ;(theme.component as Record<string, unknown>).fileUpload = { size: { md: { iconSize: '1.5rem' } } }

    const result = validateThemeContract(theme)

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.errors.join(' ')).toContain('component.fileUpload is retired')
    }
  })

  it('rejects retired Rating, Slider, Switch, PickerPopup, Progress, and ScrollArea component token overrides', () => {
    const theme = createValidTheme()
    ;(theme.component as Record<string, unknown>).rating = { size: { md: { iconSize: '1.25rem' } } }
    ;(theme.component as Record<string, unknown>).slider = { size: { md: { thumbSize: '1.3rem' } } }
    ;(theme.component as Record<string, unknown>).switch = {
      size: { sm: { rootWidth: '2.25rem' } },
      group: { gap: '0.5rem', inlineGap: '1rem' },
    }
    ;(theme.component as Record<string, unknown>).mentionTextarea = { previewMinHeight: '96px' }
    ;(theme.component as Record<string, unknown>).pickerPopup = { size: { md: { viewportMaxHeight: '16rem' } } }
    ;(theme.component as Record<string, unknown>).progress = { size: { sm: { height: '0.4rem' } } }
    ;(theme.component as Record<string, unknown>).scrollArea = { size: { sm: { thickness: '0.375rem' } } }
    ;(theme.component as Record<string, unknown>).textField = { size: { sm: { paddingInline: '0.75rem' } } }

    const result = validateThemeContract(theme)

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.errors.join(' ')).toContain('component.rating is retired')
      expect(result.errors.join(' ')).toContain('component.slider is retired')
      expect(result.errors.join(' ')).toContain('component.switch is retired')
      expect(result.errors.join(' ')).toContain('component.mentionTextarea is retired')
      expect(result.errors.join(' ')).toContain('component.pickerPopup is retired')
      expect(result.errors.join(' ')).toContain('component.progress is retired')
      expect(result.errors.join(' ')).toContain('component.scrollArea is retired')
      expect(result.errors.join(' ')).toContain('component.textField is retired')
    }
  })
})
