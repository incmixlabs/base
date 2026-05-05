import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { chartDarkTokenColorMap, chartLightTokenColorMap } from './chart-token-map'
import { THEME_PROFILE_VAR_NAMES } from './profile-vars'
import { buildRuntimePaletteVars } from './runtime-palette-vars'
import { ThemeProvider } from './ThemeProvider'
import { useThemeContext } from './theme-provider.context'

afterEach(() => {
  cleanup()
})

function ThemeProbe() {
  const theme = useThemeContext()

  return (
    <div data-testid="theme-probe">
      <span>{theme.typography.responsiveProfile}</span>
      <span data-testid="avatar-radius">{theme.avatarRadius}</span>
      <span data-testid="accent-color">{theme.accentColor}</span>
      <span data-testid="sidebar-color">{theme.sidebarColor}</span>
      <span data-testid="sidebar-variant">{theme.sidebarVariant}</span>
      <span data-testid="content-body-color">{theme.contentBodyColor}</span>
      <span data-testid="content-body-variant">{theme.contentBodyVariant}</span>
      <span data-testid="breakpoint-md">{theme.breakpoints.md}</span>
      <span data-testid="dashboard-gap">{theme.dashboard.gap}</span>
      <span data-testid="dashboard-columns-lg">
        {typeof theme.dashboard.columns === 'number' ? theme.dashboard.columns : theme.dashboard.columns.lg}
      </span>
      <span data-testid="locale">{theme.locale.locale}</span>
      <span data-testid="timezone">{theme.locale.timezone}</span>
      <button type="button" onClick={() => theme.onAccentColorChange('teal')}>
        Set accent
      </button>
      <button
        type="button"
        onClick={() => {
          theme.onLocaleChange({ locale: 'fr-FR' })
          theme.onLocaleChange({ timezone: 'Europe/Paris' })
        }}
      >
        Patch locale twice
      </button>
    </div>
  )
}

function ThemeUpdateProbe() {
  const theme = useThemeContext()

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          theme.onLocaleChange({ locale: 'fr-FR' })
          theme.onLocaleChange({ timezone: 'Europe/Paris' })
        }}
      >
        update-locale
      </button>
      <button
        type="button"
        onClick={() => {
          theme.onCalendarChange({ locale: 'fr-FR' })
          theme.onCalendarChange({ timezone: 'Europe/Paris' })
        }}
      >
        update-calendar
      </button>
      <button
        type="button"
        onClick={() => {
          theme.onTypographyChange({ fontSans: 'var(--font-geist)' })
          theme.onTypographyChange({
            fontSources: { sans: { kind: 'css-url', url: 'https://fonts.example/sans.css' } },
          })
          theme.onTypographyChange({ letterSpacing: '0.02em' })
        }}
      >
        update-typography
      </button>
      <span data-testid="locale-value">{theme.locale.locale}</span>
      <span data-testid="locale-timezone">{theme.locale.timezone}</span>
      <span data-testid="calendar-locale">{theme.calendar.locale}</span>
      <span data-testid="calendar-timezone">{theme.calendar.timezone}</span>
      <span data-testid="typography-font">{theme.typography.fontSans}</span>
      <span data-testid="typography-letter-spacing">{theme.typography.letterSpacing}</span>
      <span data-testid="typography-font-source">{theme.typography.fontSources.sans?.kind ?? 'none'}</span>
    </div>
  )
}

function ThemeConfigPatchProbe() {
  const theme = useThemeContext()

  return (
    <div>
      <button type="button" onClick={() => theme.onContentBodyColorChange('success')}>
        set-content-body-color
      </button>
      <button type="button" onClick={() => theme.onSidebarVariantChange('surface')}>
        set-sidebar-variant
      </button>
      <button type="button" onClick={() => theme.onTypographyChange({ fontSans: 'Inter, sans-serif' })}>
        set-typography
      </button>
    </div>
  )
}

describe('ThemeProvider', () => {
  it('exposes responsive typography profile through context and DOM attributes', () => {
    const { container } = render(
      <ThemeProvider>
        <ThemeProbe />
      </ThemeProvider>,
    )

    const root = container.firstElementChild as HTMLDivElement | null
    expect(root).toBeInstanceOf(HTMLDivElement)
    expect(root?.dataset.typographyResponsiveProfile).toBe('balanced')
    expect(root?.style.getPropertyValue(THEME_PROFILE_VAR_NAMES.responsiveProfile)).toBe('balanced')
    expect(root?.style.getPropertyValue(THEME_PROFILE_VAR_NAMES.cardPaddingMd)).toBe('0.875rem')
    expect(root?.style.getPropertyValue(THEME_PROFILE_VAR_NAMES.sectionSpace2)).toBe('2.5rem')
    expect(root?.style.getPropertyValue(THEME_PROFILE_VAR_NAMES.fieldGroupRowGap)).toBe('1rem')
    expect(screen.getByTestId('theme-probe')).toHaveTextContent('balanced')
  })

  it('normalizes invalid responsive profile values to balanced', () => {
    const { container } = render(
      <ThemeProvider typography={{ responsiveProfile: 'invalid' as never }}>
        <ThemeProbe />
      </ThemeProvider>,
    )

    const root = container.firstElementChild as HTMLDivElement | null
    expect(root?.dataset.typographyResponsiveProfile).toBe('balanced')
    expect(root?.style.getPropertyValue(THEME_PROFILE_VAR_NAMES.textScale)).toBe('1')
    expect(root?.style.getPropertyValue(THEME_PROFILE_VAR_NAMES.textLeading)).toBe('1')
    expect(root?.style.getPropertyValue(THEME_PROFILE_VAR_NAMES.headingScale)).toBe('1')
    expect(root?.style.getPropertyValue(THEME_PROFILE_VAR_NAMES.headingLeading)).toBe('1')
    expect(root?.style.getPropertyValue(THEME_PROFILE_VAR_NAMES.uiScale)).toBe('1')
    expect(root?.style.getPropertyValue(THEME_PROFILE_VAR_NAMES.uiLeading)).toBe('1')
    expect(root?.style.getPropertyValue(THEME_PROFILE_VAR_NAMES.cardPaddingMd)).toBe('0.875rem')
    expect(root?.style.getPropertyValue(THEME_PROFILE_VAR_NAMES.sectionSpace2)).toBe('2.5rem')
    expect(root?.style.getPropertyValue(THEME_PROFILE_VAR_NAMES.fieldGroupRowGap)).toBe('1rem')
  })

  it('emits profile-specific typography scale vars', () => {
    const { container } = render(
      <ThemeProvider typography={{ responsiveProfile: 'expressive' }}>
        <ThemeProbe />
      </ThemeProvider>,
    )

    const root = container.firstElementChild as HTMLDivElement | null
    expect(root?.dataset.typographyResponsiveProfile).toBe('expressive')
    expect(root?.style.getPropertyValue(THEME_PROFILE_VAR_NAMES.textScale)).toBe('1.16')
    expect(root?.style.getPropertyValue(THEME_PROFILE_VAR_NAMES.textLeading)).toBe('1.1')
    expect(root?.style.getPropertyValue(THEME_PROFILE_VAR_NAMES.headingScale)).toBe('1.32')
    expect(root?.style.getPropertyValue(THEME_PROFILE_VAR_NAMES.headingLeading)).toBe('1.16')
    expect(root?.style.getPropertyValue(THEME_PROFILE_VAR_NAMES.uiScale)).toBe('1.12')
    expect(root?.style.getPropertyValue(THEME_PROFILE_VAR_NAMES.uiLeading)).toBe('1.08')
    expect(root?.style.getPropertyValue(THEME_PROFILE_VAR_NAMES.cardPaddingMd)).toBe('1.25rem')
    expect(root?.style.getPropertyValue(THEME_PROFILE_VAR_NAMES.sectionSpace2)).toBe('3.5rem')
    expect(root?.style.getPropertyValue(THEME_PROFILE_VAR_NAMES.fieldGroupRowGap)).toBe('1.5rem')
  })

  it('keeps avatars on their own full-radius default when no avatarRadius prop is provided', () => {
    const { container } = render(
      <ThemeProvider>
        <ThemeProbe />
      </ThemeProvider>,
    )

    expect(within(container).getByTestId('avatar-radius')).toHaveTextContent('full')
  })

  it('exposes app shell surface defaults and content body vars', () => {
    const { container } = render(
      <ThemeProvider>
        <ThemeProbe />
      </ThemeProvider>,
    )

    const root = container.firstElementChild as HTMLDivElement | null
    expect(root?.dataset.sidebarColor).toBe('slate')
    expect(root?.dataset.sidebarVariant).toBe('soft')
    expect(root?.dataset.contentBodyColor).toBe('info')
    expect(root?.dataset.contentBodyVariant).toBe('surface')
    expect(root?.style.getPropertyValue('--component-content-body-background')).toBe('var(--color-info-surface)')
    expect(root?.style.getPropertyValue('--component-content-body-foreground')).toBe('var(--color-info-text)')
    expect(root?.style.getPropertyValue('--component-content-body-border-color')).toBe('var(--color-info-border)')
    expect(screen.getByTestId('sidebar-color')).toHaveTextContent('slate')
    expect(screen.getByTestId('sidebar-variant')).toHaveTextContent('soft')
    expect(screen.getByTestId('content-body-color')).toHaveTextContent('info')
    expect(screen.getByTestId('content-body-variant')).toHaveTextContent('surface')
  })

  it('exposes dashboard layout defaults through context', () => {
    const { rerender } = render(
      <ThemeProvider>
        <ThemeProbe />
      </ThemeProvider>,
    )

    expect(screen.getByTestId('breakpoint-md')).toHaveTextContent('1024')
    expect(screen.getByTestId('dashboard-gap')).toHaveTextContent('12')
    expect(screen.getByTestId('dashboard-columns-lg')).toHaveTextContent('12')

    rerender(
      <ThemeProvider breakpoints={{ md: 900 }} dashboard={{ gap: 20, columns: { lg: 10 } }}>
        <ThemeProbe />
      </ThemeProvider>,
    )

    expect(screen.getByTestId('breakpoint-md')).toHaveTextContent('900')
    expect(screen.getByTestId('dashboard-gap')).toHaveTextContent('20')
    expect(screen.getByTestId('dashboard-columns-lg')).toHaveTextContent('10')

    rerender(
      <ThemeProvider dashboard={{ gap: -4 }}>
        <ThemeProbe />
      </ThemeProvider>,
    )

    expect(screen.getByTestId('dashboard-gap')).toHaveTextContent('0')

    rerender(
      <ThemeProvider dashboard={{ gap: Number.NaN }}>
        <ThemeProbe />
      </ThemeProvider>,
    )

    expect(screen.getByTestId('dashboard-gap')).toHaveTextContent('12')
  })

  it('emits light raw palette vars onto the theme root', () => {
    const { container } = render(
      <ThemeProvider appearance="light">
        <ThemeProbe />
      </ThemeProvider>,
    )

    const root = container.firstElementChild as HTMLDivElement | null
    const lightPaletteVars = buildRuntimePaletteVars('light')

    expect(root?.style.getPropertyValue('--indigo-7')).toBe(lightPaletteVars['--indigo-7'])
    expect(root?.style.getPropertyValue('--teal-9')).toBe(lightPaletteVars['--teal-9'])
  })

  it('emits dark raw palette vars onto the theme root', () => {
    const { container } = render(
      <ThemeProvider appearance="dark">
        <ThemeProbe />
      </ThemeProvider>,
    )

    const root = container.firstElementChild as HTMLDivElement | null
    const darkPaletteVars = buildRuntimePaletteVars('dark')

    expect(root?.style.getPropertyValue('--indigo-7')).toBe(darkPaletteVars['--indigo-7'])
    expect(root?.style.getPropertyValue('--teal-9')).toBe(darkPaletteVars['--teal-9'])
  })

  it('defines distinct light and dark chart token maps', () => {
    expect(chartLightTokenColorMap.chart1).toBe('var(--orange-9)')
    expect(chartDarkTokenColorMap.chart1).toBe('var(--orange-11)')
    expect(chartLightTokenColorMap.chart2).toBe('var(--cyan-9)')
    expect(chartDarkTokenColorMap.chart2).toBe('var(--cyan-11)')
    expect(chartLightTokenColorMap.chart3).toBe(chartDarkTokenColorMap.chart3)
    expect(chartLightTokenColorMap.chart4).toBe('var(--green-9)')
    expect(chartDarkTokenColorMap.chart4).toBe('var(--green-11)')
    expect(chartLightTokenColorMap.chart5).toBe('var(--amber-9)')
    expect(chartDarkTokenColorMap.chart5).toBe('var(--amber-11)')
  })

  it('merges back-to-back partial locale, calendar, and typography updates', () => {
    render(
      <ThemeProvider>
        <ThemeUpdateProbe />
      </ThemeProvider>,
    )

    fireEvent.click(screen.getByText('update-locale'))
    fireEvent.click(screen.getByText('update-calendar'))
    fireEvent.click(screen.getByText('update-typography'))

    expect(screen.getByTestId('locale-value')).toHaveTextContent('fr-FR')
    expect(screen.getByTestId('locale-timezone')).toHaveTextContent('Europe/Paris')
    expect(screen.getByTestId('calendar-locale')).toHaveTextContent('fr-FR')
    expect(screen.getByTestId('calendar-timezone')).toHaveTextContent('Europe/Paris')
    expect(screen.getByTestId('typography-font')).toHaveTextContent('var(--font-geist)')
    expect(screen.getByTestId('typography-letter-spacing')).toHaveTextContent('0.02em')
    expect(screen.getByTestId('typography-font-source')).toHaveTextContent('css-url')
  })

  it('updates uncontrolled theme state through context handlers', async () => {
    const user = userEvent.setup()

    render(
      <ThemeProvider>
        <ThemeProbe />
      </ThemeProvider>,
    )

    expect(screen.getByTestId('accent-color')).toHaveTextContent('indigo')

    await user.click(screen.getByRole('button', { name: 'Set accent' }))

    expect(screen.getByTestId('accent-color')).toHaveTextContent('teal')
  })

  it('reports persisted theme config changes through a unified patch callback', async () => {
    const user = userEvent.setup()
    const onThemeConfigChange = vi.fn()

    render(
      <ThemeProvider onThemeConfigChange={onThemeConfigChange}>
        <ThemeConfigPatchProbe />
      </ThemeProvider>,
    )

    await user.click(screen.getByRole('button', { name: 'set-content-body-color' }))
    await user.click(screen.getByRole('button', { name: 'set-sidebar-variant' }))
    await user.click(screen.getByRole('button', { name: 'set-typography' }))

    expect(onThemeConfigChange).toHaveBeenCalledTimes(3)
    expect(onThemeConfigChange).toHaveBeenCalledWith({ contentBodyColor: 'success' })
    expect(onThemeConfigChange).toHaveBeenCalledWith({ sidebarVariant: 'surface' })
    expect(onThemeConfigChange).toHaveBeenCalledWith(
      expect.objectContaining({
        typography: expect.objectContaining({ fontSans: 'Inter, sans-serif' }),
      }),
    )
  })

  it('merges back-to-back uncontrolled locale patches against live store state', async () => {
    const user = userEvent.setup()

    render(
      <ThemeProvider>
        <ThemeProbe />
      </ThemeProvider>,
    )

    await user.click(screen.getByRole('button', { name: 'Patch locale twice' }))

    expect(screen.getByTestId('locale')).toHaveTextContent('fr-FR')
    expect(screen.getByTestId('timezone')).toHaveTextContent('Europe/Paris')
  })

  it('renders font source CSS for custom file-backed typography assets', () => {
    const { container } = render(
      <ThemeProvider
        typography={{
          fontSans: '"Brand Sans", ui-sans-serif, system-ui, sans-serif',
          fontSources: {
            sans: {
              kind: 'file-url',
              url: 'https://cdn.example.com/brand-sans.woff2',
              format: 'woff2',
              weight: '400 700',
              display: 'swap',
            },
          },
        }}
      >
        <ThemeProbe />
      </ThemeProvider>,
    )

    const style = container.querySelector('style[data-theme-font-sources]')
    expect(style?.textContent).toContain('@font-face')
    expect(style?.textContent).toContain('Brand Sans')
    expect(style?.textContent).toContain('https://cdn.example.com/brand-sans.woff2')
  })
})
