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
      fontWeight: { light: '300', regular: '400', medium: '500', bold: '700' },
      borderRadius: { none: '0', sm: '4px', md: '6px', lg: '8px', full: '9999px' },
      spacing: { '0': '0px', '1': '4px' },
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
      accordion: { size: { md: { triggerPaddingInline: '1.25rem' } } },
      fieldGroup: { section: { separatorMarginBlock: '1.5rem' } },
      pickerPopup: { size: { md: { viewportMaxHeight: '16rem' } } },
      fileUpload: { size: { md: { iconSize: '1.5rem' } } },
      mentionTextarea: { previewMinHeight: '96px' },
      dateNext: { size: { md: { calendarDaySize: '2.75rem' } } },
      textField: { size: { sm: { paddingInline: '0.75rem' } } },
      checkbox: { size: { sm: { boxSize: '1rem' } } },
      checkboxGroup: { gap: '0.5rem', inlineGap: '1rem', itemGap: '0.5rem' },
      checkboxCards: { size: { md: { padding: '1rem' } } },
      radio: { size: { md: { radioSize: '1.25rem' } }, group: { gap: '0.5rem', inlineGap: '1rem' } },
      radioCards: { size: { md: { indicatorInnerSize: '0.625rem' } } },
      switch: { size: { sm: { rootWidth: '2.25rem' } }, group: { gap: '0.5rem', inlineGap: '1rem' } },
      iconButton: { size: { sm: { iconSize: '1rem' } } },
      toggle: { size: { sm: { iconSize: '1rem' } }, group: { gap: '0.25rem' } },
      badge: { size: { sm: { paddingInline: '0.75rem', deleteButtonMarginStart: '0.2rem' } } },
      callout: { size: { lg: { padding: '1rem' } } },
      card: { size: { md: { padding: '1rem' } } },
      popover: { maxWidth: { md: { maxWidth: '30rem' } } },
      tooltip: { size: { sm: { fontSize: '0.875rem' } }, maxWidth: { md: { maxWidth: '20rem' } } },
      progress: { size: { sm: { height: '0.4rem' } } },
      dialog: { size: { md: { maxWidth: '28rem' } } },
      slider: { size: { md: { thumbSize: '1.3rem' } } },
      stepper: { size: { md: { indicatorSize: '1.75rem' } } },
      surface: { variant: { surface: { boxShadow: '0 0 0 1px red' } } },
      timeline: { size: { md: { itemOffset: '2.25rem' } } },
      rating: { size: { md: { iconSize: '1.25rem' } } },
      appShell: {
        content: { paddingInline: '1rem', paddingInlineDesktop: '1.5rem' },
        layout: { bodyWithSecondaryRightGridTemplateColumns: 'auto minmax(0, 1fr) 20rem' },
      },
      scrollArea: { size: { sm: { thickness: '0.375rem' } }, shape: { circle: { radius: '9999px' } } },
      treeView: { size: { md: { itemPaddingInline: '0.875rem' } } },
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
    ;(theme.global as unknown as Record<string, unknown>).spacing = new Date() as unknown as Record<string, string>
    ;(theme.semantic as unknown as Record<string, unknown>).color = new Map() as unknown as Record<
      string,
      Record<string, string>
    >

    const result = validateThemeContract(theme)

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.errors.join(' ')).toContain('global.spacing must be an object')
      expect(result.errors.join(' ')).toContain('semantic.color must be an object')
    }
  })

  it('accepts null-prototype objects for token maps', () => {
    const theme = createValidTheme()
    const spacing = Object.create(null) as { '0': string; '1': string }
    spacing['0'] = '0px'
    spacing['1'] = '4px'
    theme.global.spacing = spacing

    const result = validateThemeContract(theme)

    expect(result.ok).toBe(true)
  })

  it('fills missing component branches with empty objects during validation', () => {
    const theme = createValidTheme()
    delete (theme.component as Record<string, unknown>).accordion
    delete (theme.component as Record<string, unknown>).badge
    delete (theme.component as Record<string, unknown>).callout
    delete (theme.component as Record<string, unknown>).card
    delete (theme.component as Record<string, unknown>).checkbox
    delete (theme.component as Record<string, unknown>).checkboxCards
    delete (theme.component as Record<string, unknown>).fileUpload
    delete (theme.component as Record<string, unknown>).fieldGroup
    delete (theme.component as Record<string, unknown>).iconButton
    delete (theme.component as Record<string, unknown>).mentionTextarea
    delete (theme.component as Record<string, unknown>).dateNext
    delete (theme.component as Record<string, unknown>).pickerPopup
    delete (theme.component as Record<string, unknown>).popover
    delete (theme.component as Record<string, unknown>).tooltip
    delete (theme.component as Record<string, unknown>).progress
    delete (theme.component as Record<string, unknown>).dialog
    delete (theme.component as Record<string, unknown>).checkboxGroup
    delete (theme.component as Record<string, unknown>).radio
    delete (theme.component as Record<string, unknown>).radioCards
    delete (theme.component as Record<string, unknown>).slider
    delete (theme.component as Record<string, unknown>).stepper
    delete (theme.component as Record<string, unknown>).switch
    delete (theme.component as Record<string, unknown>).toggle
    delete (theme.component as Record<string, unknown>).appShell
    delete (theme.component as Record<string, unknown>).timeline
    delete (theme.component as Record<string, unknown>).rating
    delete (theme.component as Record<string, unknown>).scrollArea
    delete (theme.component as Record<string, unknown>).treeView

    const result = validateThemeContract(theme)

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.value.component.accordion).toEqual({})
      expect(result.value.component.badge).toEqual({})
      expect(result.value.component.callout).toEqual({})
      expect(result.value.component.card).toEqual({})
      expect(result.value.component.checkbox).toEqual({})
      expect(result.value.component.checkboxCards).toEqual({})
      expect(result.value.component.fileUpload).toEqual({})
      expect(result.value.component.fieldGroup).toEqual({})
      expect(result.value.component.iconButton).toEqual({})
      expect(result.value.component.mentionTextarea).toEqual({})
      expect(result.value.component.dateNext).toEqual({})
      expect(result.value.component.pickerPopup).toEqual({})
      expect(result.value.component.popover).toEqual({})
      expect(result.value.component.tooltip).toEqual({})
      expect(result.value.component.progress).toEqual({})
      expect(result.value.component.dialog).toEqual({})
      expect(result.value.component.checkboxGroup).toEqual({})
      expect(result.value.component.radio).toEqual({})
      expect(result.value.component.radioCards).toEqual({})
      expect(result.value.component.slider).toEqual({})
      expect(result.value.component.stepper).toEqual({})
      expect(result.value.component.switch).toEqual({})
      expect(result.value.component.toggle).toEqual({})
      expect(result.value.component.appShell).toEqual({})
      expect(result.value.component.timeline).toEqual({})
      expect(result.value.component.rating).toEqual({})
      expect(result.value.component.scrollArea).toEqual({})
      expect(result.value.component.treeView).toEqual({})
    }
  })

  it('parses a valid contract and throws on invalid payloads', () => {
    const theme = createValidTheme()

    expect(parseThemeContract(theme).metadata.themeId).toBe('theme-default')
    expect(() => parseThemeContract({})).toThrow('Invalid theme contract')
  })
})
