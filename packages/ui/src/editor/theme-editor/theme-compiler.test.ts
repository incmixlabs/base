import { describe, expect, it } from 'vitest'
import type { ThemeContract } from '@/theme/contract/theme-contract'
import { THEME_CONTRACT_SCHEMA_VERSION } from '@/theme/contract/theme-contract'
import { compileThemeTokens, mergeThemeContracts } from '../index'

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

  it('keeps base metadata stable while merging token branches', () => {
    const base = createTheme()
    const tenant = {
      metadata: { themeId: 'tenant-theme', version: '9.9.9', lifecycle: 'published' as const },
      global: { spacing: { '1': '12px' } },
    }

    const merged = mergeThemeContracts(base, tenant)

    expect(merged.metadata.themeId).toBe('base')
    expect(merged.metadata.version).toBe('1.0.0')
    expect(merged.metadata.lifecycle).toBe('draft')
    expect(merged.global.spacing['1']).toBe('12px')
  })

  it('compiles global, semantic, and component token leaves to css vars', () => {
    const theme = createTheme()
    const compiled = compileThemeTokens(theme)

    expect(compiled.cssVars['--color-teal-9']).toBe('oklch(0.6 0.12 180)')
    expect(compiled.cssVars['--font-weight-bold']).toBe('700')
    expect(compiled.cssVars['--radius-md']).toBe('6px')
    expect(compiled.cssVars['--space-1']).toBe('4px')
    expect(compiled.cssVars['--breakpoint-md']).toBe('1024px')
    expect(compiled.cssVars['--font-sans']).toBe('system-ui')
    expect(compiled.cssVars['--color-primary-text']).toBe('oklch(0.2 0 0)')
    expect(compiled.cssVars['--component-accordion-size-md-trigger-padding-inline']).toBe('1.25rem')
    expect(compiled.cssVars['--component-button-size-sm-padding-inline']).toBe('0.75rem')
    expect(compiled.cssVars['--component-file-upload-size-md-icon-size']).toBe('1.5rem')
    expect(compiled.cssVars['--component-date-next-size-md-calendar-day-size']).toBe('2.75rem')
    expect(compiled.cssVars['--component-field-group-row-column-gap']).toBe('2rem')
    expect(compiled.cssVars['--component-mention-textarea-preview-min-height']).toBe('96px')
    expect(compiled.cssVars['--component-picker-popup-size-md-viewport-max-height']).toBe('16rem')
    expect(compiled.cssVars['--component-text-field-size-sm-padding-inline']).toBe('0.75rem')
    expect(compiled.cssVars['--component-checkbox-size-sm-box-size']).toBe('1rem')
    expect(compiled.cssVars['--component-checkbox-group-gap']).toBe('0.5rem')
    expect(compiled.cssVars['--component-checkbox-cards-size-md-padding']).toBe('1rem')
    expect(compiled.cssVars['--component-icon-button-size-sm-icon-size']).toBe('1rem')
    expect(compiled.cssVars['--component-badge-size-sm-delete-button-margin-start']).toBe('0.2rem')
    expect(compiled.cssVars['--component-callout-size-lg-padding']).toBe('1rem')
    expect(compiled.cssVars['--component-card-size-md-padding']).toBe('1rem')
    expect(compiled.cssVars['--component-popover-max-width-md-max-width']).toBe('30rem')
    expect(compiled.cssVars['--component-tooltip-size-sm-font-size']).toBe('0.875rem')
    expect(compiled.cssVars['--component-tooltip-max-width-md-max-width']).toBe('20rem')
    expect(compiled.cssVars['--component-progress-size-sm-height']).toBe('0.4rem')
    expect(compiled.cssVars['--component-dialog-size-md-max-width']).toBe('28rem')
    expect(compiled.cssVars['--component-radio-size-md-radio-size']).toBe('1.25rem')
    expect(compiled.cssVars['--component-radio-cards-size-md-indicator-inner-size']).toBe('0.625rem')
    expect(compiled.cssVars['--component-slider-size-md-thumb-size']).toBe('1.3rem')
    expect(compiled.cssVars['--component-stepper-size-md-indicator-size']).toBe('1.75rem')
    expect(compiled.cssVars['--component-surface-variant-surface-box-shadow']).toBe('0 0 0 1px red')
    expect(compiled.cssVars['--component-switch-size-sm-root-width']).toBe('2.25rem')
    expect(compiled.cssVars['--component-timeline-size-md-item-offset']).toBe('2.25rem')
    expect(compiled.cssVars['--component-toggle-size-sm-icon-size']).toBe('1rem')
    expect(compiled.cssVars['--component-toggle-group-gap']).toBe('0.25rem')
    expect(compiled.cssVars['--component-rating-size-md-icon-size']).toBe('1.25rem')
    expect(compiled.cssVars['--component-app-shell-content-padding-inline']).toBe('1rem')
    expect(compiled.cssVars['--component-app-shell-layout-body-with-secondary-right-grid-template-columns']).toBe(
      'auto minmax(0, 1fr) 20rem',
    )
    expect(compiled.cssVars['--component-scroll-area-size-sm-thickness']).toBe('0.375rem')
    expect(compiled.cssVars['--component-scroll-area-shape-circle-radius']).toBe('9999px')
    expect(compiled.cssVars['--component-tree-view-size-md-item-padding-inline']).toBe('0.875rem')
  })

  it('exposes a deterministic dot-path token map', () => {
    const theme = createTheme()
    const compiled = compileThemeTokens(theme)

    expect(compiled.tokenMap['global.spacing.1']).toBe('4px')
    expect(compiled.tokenMap['semantic.color.primary.text']).toBe('oklch(0.2 0 0)')
    expect(compiled.tokenMap['component.checkbox.size.sm.boxSize']).toBe('1rem')
    expect(compiled.tokenMap['component.checkboxCards.size.md.padding']).toBe('1rem')
    expect(compiled.tokenMap['component.iconButton.size.sm.iconSize']).toBe('1rem')
    expect(compiled.tokenMap['component.fileUpload.size.md.iconSize']).toBe('1.5rem')
    expect(compiled.tokenMap['component.dateNext.size.md.calendarDaySize']).toBe('2.75rem')
    expect(compiled.tokenMap['component.fieldGroup.row.columnGap']).toBe('2rem')
    expect(compiled.tokenMap['component.mentionTextarea.previewMinHeight']).toBe('96px')
    expect(compiled.tokenMap['component.pickerPopup.size.md.viewportMaxHeight']).toBe('16rem')
    expect(compiled.tokenMap['component.radio.size.md.radioSize']).toBe('1.25rem')
    expect(compiled.tokenMap['component.radioCards.size.md.indicatorInnerSize']).toBe('0.625rem')
    expect(compiled.tokenMap['component.switch.size.sm.rootWidth']).toBe('2.25rem')
    expect(compiled.tokenMap['component.toggle.size.sm.iconSize']).toBe('1rem')
    expect(compiled.tokenMap['component.toggle.group.gap']).toBe('0.25rem')
    expect(compiled.tokenMap['component.appShell.layout.bodyWithSecondaryRightGridTemplateColumns']).toBe(
      'auto minmax(0, 1fr) 20rem',
    )
    expect(compiled.tokenMap['component.textField.size.sm.paddingInline']).toBe('0.75rem')
    expect(compiled.tokenMap['component.popover.maxWidth.md.maxWidth']).toBe('30rem')
    expect(compiled.tokenMap['component.tooltip.size.sm.fontSize']).toBe('0.875rem')
    expect(compiled.tokenMap['component.tooltip.maxWidth.md.maxWidth']).toBe('20rem')
    expect(compiled.tokenMap['component.checkboxGroup.gap']).toBe('0.5rem')
    expect(compiled.tokenMap['component.dialog.size.md.maxWidth']).toBe('28rem')
    expect(compiled.tokenMap['component.stepper.size.md.indicatorSize']).toBe('1.75rem')
    expect(compiled.tokenMap['component.surface.variant.surface.boxShadow']).toBe('0 0 0 1px red')
    expect(compiled.tokenMap['component.timeline.size.md.itemOffset']).toBe('2.25rem')
    expect(compiled.tokenMap['component.rating.size.md.iconSize']).toBe('1.25rem')
    expect(compiled.tokenMap['component.appShell.content.paddingInlineDesktop']).toBe('1.5rem')
    expect(compiled.tokenMap['component.scrollArea.size.sm.thickness']).toBe('0.375rem')
    expect(compiled.tokenMap['component.scrollArea.shape.circle.radius']).toBe('9999px')
    expect(compiled.tokenMap['component.treeView.size.md.itemPaddingInline']).toBe('0.875rem')
  })
})
