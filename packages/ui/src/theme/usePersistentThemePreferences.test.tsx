import '@testing-library/jest-dom/vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import {
  DEFAULT_THEME_USER_PREFERENCES_STORAGE_KEY,
  usePersistentThemePreferences,
} from './usePersistentThemePreferences'

afterEach(() => {
  cleanup()
  window.localStorage.clear()
})

const customThemePreferencesDefault = {
  appearance: 'dark',
  locale: 'fr-FR',
  timezone: 'Europe/Paris',
} as const

function ThemePreferencesProbe() {
  const [preferences, setPreferences, removePreferences] = usePersistentThemePreferences()

  return (
    <div>
      <span data-testid="appearance">{preferences.appearance}</span>
      <span data-testid="locale">{preferences.locale ?? 'none'}</span>
      <span data-testid="timezone">{preferences.timezone ?? 'none'}</span>
      <button type="button" onClick={() => setPreferences({ appearance: 'dark', locale: 'en-US' })}>
        Set dark
      </button>
      <button type="button" onClick={() => setPreferences(previous => ({ ...previous, timezone: 'America/New_York' }))}>
        Set timezone
      </button>
      <button type="button" onClick={removePreferences}>
        Remove
      </button>
    </div>
  )
}

function CustomThemePreferencesProbe() {
  const [preferences] = usePersistentThemePreferences({ defaultValue: customThemePreferencesDefault })

  return (
    <div>
      <span data-testid="custom-appearance">{preferences.appearance}</span>
      <span data-testid="custom-locale">{preferences.locale ?? 'none'}</span>
      <span data-testid="custom-timezone">{preferences.timezone ?? 'none'}</span>
    </div>
  )
}

describe('usePersistentThemePreferences', () => {
  it('defaults appearance to inherit', () => {
    render(<ThemePreferencesProbe />)

    expect(screen.getByTestId('appearance')).toHaveTextContent('inherit')
  })

  it('hydrates valid stored preferences from localStorage', () => {
    window.localStorage.setItem(
      DEFAULT_THEME_USER_PREFERENCES_STORAGE_KEY,
      JSON.stringify({ appearance: 'dark', locale: 'en-US', timezone: 'America/Los_Angeles' }),
    )

    render(<ThemePreferencesProbe />)

    expect(screen.getByTestId('appearance')).toHaveTextContent('dark')
    expect(screen.getByTestId('locale')).toHaveTextContent('en-US')
    expect(screen.getByTestId('timezone')).toHaveTextContent('America/Los_Angeles')
  })

  it('falls back to inherit for invalid stored appearance values', () => {
    window.localStorage.setItem(
      DEFAULT_THEME_USER_PREFERENCES_STORAGE_KEY,
      JSON.stringify({ appearance: 'system-dark', locale: 'en-US' }),
    )

    render(<ThemePreferencesProbe />)

    expect(screen.getByTestId('appearance')).toHaveTextContent('inherit')
    expect(screen.getByTestId('locale')).toHaveTextContent('en-US')
  })

  it('uses caller defaults when hydrating partial invalid stored preferences', () => {
    window.localStorage.setItem(
      DEFAULT_THEME_USER_PREFERENCES_STORAGE_KEY,
      JSON.stringify({ appearance: 'system-dark' }),
    )

    render(<CustomThemePreferencesProbe />)

    expect(screen.getByTestId('custom-appearance')).toHaveTextContent('dark')
    expect(screen.getByTestId('custom-locale')).toHaveTextContent('fr-FR')
    expect(screen.getByTestId('custom-timezone')).toHaveTextContent('Europe/Paris')
  })

  it('writes updates through to localStorage', () => {
    render(<ThemePreferencesProbe />)

    fireEvent.click(screen.getByRole('button', { name: 'Set dark' }))

    expect(screen.getByTestId('appearance')).toHaveTextContent('dark')
    expect(window.localStorage.getItem(DEFAULT_THEME_USER_PREFERENCES_STORAGE_KEY)).toBe(
      JSON.stringify({ appearance: 'dark', locale: 'en-US' }),
    )
  })

  it('supports updater functions', () => {
    render(<ThemePreferencesProbe />)

    fireEvent.click(screen.getByRole('button', { name: 'Set timezone' }))

    expect(screen.getByTestId('timezone')).toHaveTextContent('America/New_York')
  })

  it('removes stored preferences and resets to defaults', () => {
    window.localStorage.setItem(DEFAULT_THEME_USER_PREFERENCES_STORAGE_KEY, JSON.stringify({ appearance: 'dark' }))

    render(<ThemePreferencesProbe />)
    fireEvent.click(screen.getByRole('button', { name: 'Remove' }))

    expect(screen.getByTestId('appearance')).toHaveTextContent('inherit')
    expect(window.localStorage.getItem(DEFAULT_THEME_USER_PREFERENCES_STORAGE_KEY)).toBeNull()
  })
})
