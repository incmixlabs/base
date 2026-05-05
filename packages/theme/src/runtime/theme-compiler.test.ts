import { describe, expect, it } from 'vitest'
import { THEME_CONTRACT_SCHEMA_VERSION, type ThemeContract } from '../contract/theme-contract.js'
import { compileThemeTokens, mergeThemeContracts } from './theme-compiler.js'

function createTheme(): ThemeContract {
  return {
    metadata: {
      schemaVersion: THEME_CONTRACT_SCHEMA_VERSION,
      themeId: 'base',
      version: '1.0.0',
      lifecycle: 'draft',
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
        primary: { text: 'oklch(0.2 0 0)', background: 'oklch(1 0 0)' },
      },
    },
    component: {
      button: { size: { sm: { paddingInline: '0.75rem' } } },
      accordion: { size: { md: { triggerPaddingInline: '1.25rem' } } },
      fieldGroup: { row: { columnGap: '2rem' } },
      pickerPopup: { size: { md: { viewportMaxHeight: '16rem' } } },
      fileUpload: { size: { md: { iconSize: '1.5rem' } } },
      mentionTextarea: { previewMinHeight: '96px' },
      dateNext: { size: { md: { calendarDaySize: '2.75rem' } } },
      textField: { size: { sm: { paddingInline: '0.75rem' } } },
      checkbox: { size: { sm: { boxSize: '1rem' } } },
      checkboxGroup: { gap: '0.5rem', inlineGap: '1rem', itemGap: '0.5rem' },
      checkboxCards: { size: { md: { padding: '1rem' } } },
      radio: { size: { md: { radioSize: '1.25rem' } } },
      radioCards: { size: { md: { indicatorInnerSize: '0.625rem' } } },
      switch: { size: { sm: { rootWidth: '2.25rem' } } },
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

describe('theme-compiler', () => {
  it('merges layer overrides with last-write-wins precedence', () => {
    const base = createTheme()
    const brand = { global: { spacing: { '1': '6px' } } }
    const tenant = {
      global: { spacing: { '1': '8px' } },
      component: { badge: { size: { sm: { paddingInline: '1rem' } } } },
    }
    const user = { global: { spacing: { '1': '10px' } } }

    const merged = mergeThemeContracts(base, brand, tenant, user)

    expect(merged.global.spacing['1']).toBe('10px')
    expect((merged.component.badge as { size: { sm: { paddingInline: string } } }).size.sm.paddingInline).toBe('1rem')
  })

  it('ignores prototype pollution keys while merging token overrides', () => {
    const base = createTheme()
    const polluted = JSON.parse('{"global":{"spacing":{"__proto__":{"polluted":"yes"},"1":"8px"}}}')

    const merged = mergeThemeContracts(base, polluted)

    expect(merged.global.spacing['1']).toBe('8px')
    expect(({} as Record<string, unknown>).polluted).toBeUndefined()
    expect(Object.prototype).not.toHaveProperty('polluted')
  })

  it('compiles token leaves to css vars without trailing hyphens for branch-level paths', () => {
    const theme = createTheme()
    const compiled = compileThemeTokens(theme)

    expect(compiled.cssVars['--font-weight-bold']).toBe('700')
    expect(compiled.cssVars['--component-app-shell-layout-body-with-secondary-right-grid-template-columns']).toBe(
      'auto minmax(0, 1fr) 20rem',
    )
    expect(compiled.cssVars['--font-weight-']).toBeUndefined()
  })

  it('throws when two token paths compile to the same css variable name', () => {
    const theme = createTheme()
    theme.global.typography.fontSans = 'system-ui'
    ;(theme.global.typography as Record<string, string>).font_sans = 'Arial'

    expect(() => compileThemeTokens(theme)).toThrow(
      'Token collision: "global.typography.font_sans" and "global.typography.fontSans" both compile to "--font-sans"',
    )
  })
})
