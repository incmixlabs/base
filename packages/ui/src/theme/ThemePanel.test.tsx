import '@testing-library/jest-dom/vitest'
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { AdminThemeProvider } from './AdminThemeProvider'
import { ThemePanel } from './ThemePanel'
import { DEFAULT_THEME_CONFIG_STORAGE_KEY } from './usePersistentThemeConfig'
import { useThemeContext } from './theme-provider.context'

afterEach(() => {
  cleanup()
  window.localStorage.clear()
})

function ThemePanelProbe() {
  const theme = useThemeContext()

  return (
    <div>
      <span data-testid="accent-color">{theme.accentColor}</span>
      <ThemePanel />
    </div>
  )
}

describe('ThemePanel', () => {
  it('updates and persists accentColor through the theme config', async () => {
    render(
      <AdminThemeProvider>
        <ThemePanelProbe />
      </AdminThemeProvider>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Choose hue for Accent color' }))
    fireEvent.click(
      within(screen.getByRole('listbox', { name: 'Accent color options' })).getByRole('option', { name: 'Teal' }),
    )

    await waitFor(() => {
      expect(screen.getByTestId('accent-color')).toHaveTextContent('teal')
      expect(window.localStorage.getItem(DEFAULT_THEME_CONFIG_STORAGE_KEY)).toContain('"accentColor":"teal"')
    })
  })
})
