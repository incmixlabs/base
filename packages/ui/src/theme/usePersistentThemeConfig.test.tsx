import '@testing-library/jest-dom/vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { defaultThemePersistenceConfig } from './theme-persistence'
import { DEFAULT_THEME_CONFIG_STORAGE_KEY, usePersistentThemeConfig } from './usePersistentThemeConfig'

afterEach(() => {
  cleanup()
  window.localStorage.clear()
})

const customThemeConfigDefault = {
  ...defaultThemePersistenceConfig,
  accentColor: 'teal',
  contentBodyColor: 'success',
  contentBodyVariant: 'soft',
} as const

function ThemeConfigProbe() {
  const [config, setConfig, removeConfig] = usePersistentThemeConfig()
  const serifSource = config.typography.fontSources.serif
  const monoSource = config.typography.fontSources.mono
  const serifFormat = serifSource?.kind === 'file-url' ? serifSource.format : undefined
  const monoStyle = monoSource?.kind === 'file-url' ? monoSource.style : undefined
  const monoDisplay = monoSource?.kind === 'file-url' ? monoSource.display : undefined

  return (
    <div>
      <span data-testid="content-body-color">{config.contentBodyColor}</span>
      <span data-testid="content-body-variant">{config.contentBodyVariant}</span>
      <span data-testid="accent-color">{config.accentColor}</span>
      <span data-testid="sans-source">{config.typography.fontSources.sans?.kind ?? 'none'}</span>
      <span data-testid="serif-source-format">{serifFormat ?? 'none'}</span>
      <span data-testid="mono-source-style">{monoStyle ?? 'none'}</span>
      <span data-testid="mono-source-display">{monoDisplay ?? 'none'}</span>
      <button type="button" onClick={() => setConfig(previous => ({ ...previous, contentBodyColor: 'success' }))}>
        Set content body color
      </button>
      <button type="button" onClick={() => setConfig(previous => ({ ...previous, accentColor: 'teal' }))}>
        Set accent
      </button>
      <button type="button" onClick={removeConfig}>
        Remove
      </button>
    </div>
  )
}

function CustomThemeConfigProbe() {
  const [config] = usePersistentThemeConfig({ defaultValue: customThemeConfigDefault })

  return (
    <div>
      <span data-testid="custom-content-body-color">{config.contentBodyColor}</span>
      <span data-testid="custom-content-body-variant">{config.contentBodyVariant}</span>
      <span data-testid="custom-accent-color">{config.accentColor}</span>
    </div>
  )
}

describe('usePersistentThemeConfig', () => {
  it('defaults app-shell theme config to docs defaults', () => {
    render(<ThemeConfigProbe />)

    expect(screen.getByTestId('content-body-color')).toHaveTextContent('info')
    expect(screen.getByTestId('content-body-variant')).toHaveTextContent('surface')
    expect(screen.getByTestId('accent-color')).toHaveTextContent('indigo')
  })

  it('hydrates valid stored theme config from localStorage', () => {
    window.localStorage.setItem(
      DEFAULT_THEME_CONFIG_STORAGE_KEY,
      JSON.stringify({ contentBodyColor: 'success', contentBodyVariant: 'soft', accentColor: 'teal' }),
    )

    render(<ThemeConfigProbe />)

    expect(screen.getByTestId('content-body-color')).toHaveTextContent('success')
    expect(screen.getByTestId('content-body-variant')).toHaveTextContent('soft')
    expect(screen.getByTestId('accent-color')).toHaveTextContent('teal')
  })

  it('falls back to defaults for invalid stored theme config values', () => {
    window.localStorage.setItem(
      DEFAULT_THEME_CONFIG_STORAGE_KEY,
      JSON.stringify({
        contentBodyColor: 'unknown',
        contentBodyVariant: 'ghost',
        accentColor: 'unknown',
        typography: {
          fontSources: {
            sans: { kind: 'css-url', url: 1 },
            serif: { kind: 'file-url', url: '/serif.woff2', format: 'invalid' },
            mono: { kind: 'file-url', url: '/mono.woff2', style: 'sideways', display: 'invalid' },
          },
        },
      }),
    )

    render(<ThemeConfigProbe />)

    expect(screen.getByTestId('content-body-color')).toHaveTextContent('info')
    expect(screen.getByTestId('content-body-variant')).toHaveTextContent('surface')
    expect(screen.getByTestId('accent-color')).toHaveTextContent('indigo')
    expect(screen.getByTestId('sans-source')).toHaveTextContent('none')
    expect(screen.getByTestId('serif-source-format')).toHaveTextContent('none')
    expect(screen.getByTestId('mono-source-style')).toHaveTextContent('none')
    expect(screen.getByTestId('mono-source-display')).toHaveTextContent('none')
  })

  it('uses caller defaults when hydrating partial invalid stored theme config', () => {
    window.localStorage.setItem(
      DEFAULT_THEME_CONFIG_STORAGE_KEY,
      JSON.stringify({ contentBodyColor: 'unknown', contentBodyVariant: 'ghost', accentColor: 'unknown' }),
    )

    render(<CustomThemeConfigProbe />)

    expect(screen.getByTestId('custom-content-body-color')).toHaveTextContent('success')
    expect(screen.getByTestId('custom-content-body-variant')).toHaveTextContent('soft')
    expect(screen.getByTestId('custom-accent-color')).toHaveTextContent('teal')
  })

  it('writes theme config updates through to localStorage', () => {
    render(<ThemeConfigProbe />)

    fireEvent.click(screen.getByRole('button', { name: 'Set content body color' }))
    fireEvent.click(screen.getByRole('button', { name: 'Set accent' }))

    expect(screen.getByTestId('content-body-color')).toHaveTextContent('success')
    expect(screen.getByTestId('accent-color')).toHaveTextContent('teal')
    expect(window.localStorage.getItem(DEFAULT_THEME_CONFIG_STORAGE_KEY)).toContain('"contentBodyColor":"success"')
    expect(window.localStorage.getItem(DEFAULT_THEME_CONFIG_STORAGE_KEY)).toContain('"accentColor":"teal"')
  })

  it('removes stored config and resets to defaults', () => {
    window.localStorage.setItem(DEFAULT_THEME_CONFIG_STORAGE_KEY, JSON.stringify({ contentBodyColor: 'success' }))

    render(<ThemeConfigProbe />)
    fireEvent.click(screen.getByRole('button', { name: 'Remove' }))

    expect(screen.getByTestId('content-body-color')).toHaveTextContent('info')
    expect(window.localStorage.getItem(DEFAULT_THEME_CONFIG_STORAGE_KEY)).toBeNull()
  })
})
