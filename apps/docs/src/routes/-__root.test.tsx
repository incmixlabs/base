import { deleteCookie, readCookie, writeCookie } from '@incmix/ui/hooks'
import {
  AdminThemeProvider,
  DEFAULT_THEME_CONFIG_STORAGE_KEY,
  DEFAULT_THEME_USER_PREFERENCES_STORAGE_KEY,
  DEFAULT_THEME_VARS_TOKENS_STORAGE_KEY,
  useThemeContext,
  useThemeVarsContext,
} from '@incmix/ui/theme'
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { hydrateRoot } from 'react-dom/client'
import { renderToString } from 'react-dom/server'
import { afterEach, describe, expect, it } from 'vitest'
import {
  docsAppearanceBootstrapScript,
  docsAppearanceCookie,
  docsThemeConfigStorage,
  docsThemePreferencesStorage,
  docsThemeVarsTokensStorage,
} from './-theme'

afterEach(() => {
  cleanup()
  window.localStorage.clear()
  deleteCookie(docsAppearanceCookie.name, { path: '/' })
  document.documentElement.classList.remove('dark')
  document.documentElement.style.colorScheme = ''
})

function DocsThemeProbe() {
  const theme = useThemeContext()
  const themeVars = useThemeVarsContext()

  return (
    <div>
      <span data-testid="appearance">{theme.appearance}</span>
      <span data-testid="content-body-color">{theme.contentBodyColor}</span>
      <span data-testid="surface-step">{themeVars.tokens.colors.variants.surface}</span>
      <button type="button" onClick={() => theme.onAppearanceChange('dark')}>
        Set dark
      </button>
      <button type="button" onClick={() => themeVars.onColorVariantStepChange('surface', 3)}>
        Set surface step
      </button>
      <button type="button" onClick={() => theme.onContentBodyColorChange('success')}>
        Set content body color
      </button>
    </div>
  )
}

function writeDocsAppearanceCookie(appearance: string) {
  writeCookie(docsAppearanceCookie.name, JSON.stringify({ [docsAppearanceCookie.appKey]: appearance }), {
    path: '/',
    sameSite: 'lax',
  })
}

function expectDocsAppearanceCookie(appearance: string) {
  const appearances = JSON.parse(readCookie(docsAppearanceCookie.name) ?? '{}')
  expect(appearances?.[docsAppearanceCookie.appKey]).toBe(appearance)
}

function createAdminThemeProviderElement(children: React.ReactNode) {
  return (
    <AdminThemeProvider
      appearanceCookie={docsAppearanceCookie}
      configStorage={docsThemeConfigStorage}
      preferencesStorage={docsThemePreferencesStorage}
      varsTokensStorage={docsThemeVarsTokensStorage}
    >
      {children}
    </AdminThemeProvider>
  )
}

function renderAdminThemeProvider(children: React.ReactNode) {
  return render(createAdminThemeProviderElement(children))
}

describe('AdminThemeProvider docs wiring', () => {
  it('applies inherited first-paint appearance when matchMedia is unavailable', () => {
    writeDocsAppearanceCookie('inherit')

    Function(docsAppearanceBootstrapScript)()

    expect(document.documentElement.classList.contains('dark')).toBe(false)
    expect(document.documentElement.style.colorScheme).toBe('light')
  })

  it('applies default first-paint appearance when persisted localStorage preferences are malformed', () => {
    window.localStorage.setItem(docsThemePreferencesStorage.key, '{')

    Function(docsAppearanceBootstrapScript)()

    expect(document.documentElement.classList.contains('dark')).toBe(false)
    expect(document.documentElement.style.colorScheme).toBe('light')
  })

  it('hydrates appearance from the first-paint cookie when localStorage is empty', () => {
    writeDocsAppearanceCookie('dark')

    Function(docsAppearanceBootstrapScript)()

    expect(window.localStorage.getItem(docsThemePreferencesStorage.key)).toBeNull()
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(document.documentElement.style.colorScheme).toBe('dark')

    renderAdminThemeProvider(<DocsThemeProbe />)

    expect(screen.getByTestId('appearance')).toHaveTextContent('dark')
  })

  it('hydrates appearance from persisted localStorage preferences', async () => {
    window.localStorage.setItem(docsThemePreferencesStorage.key, JSON.stringify({ appearance: 'dark' }))

    renderAdminThemeProvider(<DocsThemeProbe />)

    await waitFor(() => {
      expect(screen.getByTestId('appearance')).toHaveTextContent('dark')
    })
  })

  it('keeps the first-paint cookie appearance ahead of stale localStorage preferences', async () => {
    writeDocsAppearanceCookie('dark')
    window.localStorage.setItem(docsThemePreferencesStorage.key, JSON.stringify({ appearance: 'light' }))

    Function(docsAppearanceBootstrapScript)()

    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(document.documentElement.style.colorScheme).toBe('dark')

    renderAdminThemeProvider(<DocsThemeProbe />)

    expect(screen.getByTestId('appearance')).toHaveTextContent('dark')

    await waitFor(() => {
      expect(window.localStorage.getItem(docsThemePreferencesStorage.key)).toBe(JSON.stringify({ appearance: 'dark' }))
      expectDocsAppearanceCookie('dark')
    })
  })

  it('persists appearance changes to localStorage and the first-paint cookie', async () => {
    renderAdminThemeProvider(<DocsThemeProbe />)

    fireEvent.click(screen.getByRole('button', { name: 'Set dark' }))

    await waitFor(() => {
      expect(window.localStorage.getItem(docsThemePreferencesStorage.key)).toBe(JSON.stringify({ appearance: 'dark' }))
      expect(window.localStorage.getItem(DEFAULT_THEME_USER_PREFERENCES_STORAGE_KEY)).toBeNull()
      expectDocsAppearanceCookie('dark')
    })
  })

  it('preserves other app appearances in the shared first-paint cookie', async () => {
    writeCookie(docsAppearanceCookie.name, JSON.stringify({ example: 'light' }), { path: '/', sameSite: 'lax' })

    renderAdminThemeProvider(<DocsThemeProbe />)

    fireEvent.click(screen.getByRole('button', { name: 'Set dark' }))

    await waitFor(() => {
      const appearances = JSON.parse(readCookie(docsAppearanceCookie.name) ?? '{}')
      expect(appearances?.example).toBe('light')
      expect(appearances?.[docsAppearanceCookie.appKey]).toBe('dark')
    })
  })

  it('persists theme variant step changes to localStorage', async () => {
    renderAdminThemeProvider(<DocsThemeProbe />)

    fireEvent.click(screen.getByRole('button', { name: 'Set surface step' }))

    await waitFor(() => {
      expect(screen.getByTestId('surface-step')).toHaveTextContent('3')
      const storedTokens = JSON.parse(window.localStorage.getItem(docsThemeVarsTokensStorage.key) ?? '{}')
      expect(storedTokens?.colors?.variants?.surface).toBe(3)
      expect(window.localStorage.getItem(DEFAULT_THEME_VARS_TOKENS_STORAGE_KEY)).toBeNull()
    })
  })

  it('persists content body color changes to theme config localStorage', async () => {
    renderAdminThemeProvider(<DocsThemeProbe />)

    fireEvent.click(screen.getByRole('button', { name: 'Set content body color' }))

    await waitFor(() => {
      expect(screen.getByTestId('content-body-color')).toHaveTextContent('success')
      const storedConfig = JSON.parse(window.localStorage.getItem(docsThemeConfigStorage.key) ?? '{}')
      expect(storedConfig?.contentBodyColor).toBe('success')
      expect(window.localStorage.getItem(DEFAULT_THEME_CONFIG_STORAGE_KEY)).toBeNull()
    })
  })

  it('patches SSR default shell colors with persisted docs localStorage after hydration', async () => {
    const serverHtml = renderToString(createAdminThemeProviderElement(<DocsThemeProbe />))
    const container = document.createElement('div')
    document.body.appendChild(container)
    container.innerHTML = serverHtml

    window.localStorage.setItem(
      docsThemeConfigStorage.key,
      JSON.stringify({
        sidebarColor: 'success',
        sidebarVariant: 'solid',
        contentBodyColor: 'warning',
        contentBodyVariant: 'soft',
      }),
    )

    const root = hydrateRoot(container, createAdminThemeProviderElement(<DocsThemeProbe />))

    try {
      await waitFor(() => {
        const theme = container.querySelector('.af-themes')
        expect(theme).toHaveAttribute('data-sidebar-color', 'success')
        expect(theme).toHaveAttribute('data-sidebar-variant', 'solid')
        expect(theme).toHaveAttribute('data-content-body-color', 'warning')
        expect(theme).toHaveAttribute('data-content-body-variant', 'soft')
      })
    } finally {
      root.unmount()
      container.remove()
    }
  })
})
