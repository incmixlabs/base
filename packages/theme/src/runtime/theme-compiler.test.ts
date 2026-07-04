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
      textField: { size: { sm: { paddingInline: '0.75rem' } } },
      appShell: {
        content: { paddingInline: '1rem', paddingInlineDesktop: '1.5rem' },
        layout: { bodyWithSecondaryRightGridTemplateColumns: 'auto minmax(0, 1fr) 20rem' },
      },
    },
  }
}

describe('theme-compiler', () => {
  it('merges layer overrides with last-write-wins precedence', () => {
    const base = createTheme()
    const brand = { global: { borderRadius: { sm: '6px' } } }
    const tenant = {
      global: { borderRadius: { sm: '8px' } },
      component: { appShell: { content: { paddingInline: '2rem' } } },
    }
    const user = { global: { borderRadius: { sm: '10px' } } }

    const merged = mergeThemeContracts(base, brand, tenant, user)

    expect(merged.global.borderRadius.sm).toBe('10px')
    expect(merged.component.appShell.content?.paddingInline).toBe('2rem')
  })

  it('ignores prototype pollution keys while merging token overrides', () => {
    const base = createTheme()
    const polluted = JSON.parse('{"global":{"borderRadius":{"__proto__":{"polluted":"yes"},"sm":"8px"}}}')

    const merged = mergeThemeContracts(base, polluted)

    expect(merged.global.borderRadius.sm).toBe('8px')
    expect(({} as Record<string, unknown>).polluted).toBeUndefined()
    expect(Object.prototype).not.toHaveProperty('polluted')
  })

  it('compiles token leaves to css vars without trailing hyphens for branch-level paths', () => {
    const theme = createTheme()
    const compiled = compileThemeTokens(theme)

    expect(compiled.cssVars['--font-weight-bold']).toBe('700')
    expect(compiled.cssVars['--af-app-shell-layout-body-with-secondary-right-grid-template-columns']).toBe(
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

  it('rejects retired component token branches before compiling css vars', () => {
    const theme = createTheme()
    ;(theme.component as Record<string, unknown>).button = { size: { sm: { paddingInline: '0.75rem' } } }
    ;(theme.component as Record<string, unknown>).card = { size: { md: { padding: '1rem' } } }
    ;(theme.component as Record<string, unknown>).fieldGroup = { row: { columnGap: '2rem' } }
    ;(theme.component as Record<string, unknown>).fileUpload = { size: { md: { iconSize: '1.5rem' } } }
    ;(theme.component as Record<string, unknown>).rating = { size: { md: { iconSize: '1.25rem' } } }
    ;(theme.component as Record<string, unknown>).slider = { size: { md: { thumbSize: '1.3rem' } } }
    ;(theme.component as Record<string, unknown>).switch = { size: { sm: { rootWidth: '2.25rem' } } }
    ;(theme.component as Record<string, unknown>).mentionTextarea = { previewMinHeight: '96px' }
    ;(theme.component as Record<string, unknown>).pickerPopup = { size: { md: { viewportMaxHeight: '16rem' } } }
    ;(theme.component as Record<string, unknown>).progress = { size: { sm: { height: '0.4rem' } } }
    ;(theme.component as Record<string, unknown>).scrollArea = { size: { sm: { thickness: '0.375rem' } } }

    expect(() => compileThemeTokens(theme)).toThrow(
      /component\.button is retired.*component\.card is retired.*component\.fieldGroup is retired.*component\.fileUpload is retired.*component\.rating is retired.*component\.slider is retired.*component\.switch is retired.*component\.mentionTextarea is retired.*component\.pickerPopup is retired.*component\.progress is retired.*component\.scrollArea is retired/s,
    )
  })

  it('strips legacy component token branches before compiling css vars', () => {
    const theme = createTheme()
    const component = theme.component as Record<string, unknown>
    component.dateNext = { cell: { borderRadius: 'var(--radius-md)' } }
    component.stepper = { size: { md: { indicatorSize: '1.75rem' } } }
    component.timeline = { size: { md: { itemOffset: '2.25rem' } } }
    component.surface = { variant: { surface: { boxShadow: '0 0 0 1px red' } } }

    const compiled = compileThemeTokens(theme)

    expect(compiled.tokenMap['component.dateNext.cell.borderRadius']).toBeUndefined()
    expect(compiled.tokenMap['component.stepper.size.md.indicatorSize']).toBeUndefined()
    expect(compiled.tokenMap['component.timeline.size.md.itemOffset']).toBeUndefined()
    expect(compiled.tokenMap['component.surface.variant.surface.boxShadow']).toBeUndefined()
    expect(component.dateNext).toEqual({ cell: { borderRadius: 'var(--radius-md)' } })
  })
})
