import '@testing-library/jest-dom/vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { THEME_VARS_TOKEN_DEFAULTS } from './tokens'
import { DEFAULT_THEME_VARS_TOKENS_STORAGE_KEY, usePersistentThemeVarsTokens } from './usePersistentThemeVarsTokens'

afterEach(() => {
  cleanup()
  window.localStorage.clear()
})

const customThemeVarsTokensDefault = {
  colors: {
    semantic: { ...THEME_VARS_TOKEN_DEFAULTS.colors.semantic, info: 'green' },
    variants: { ...THEME_VARS_TOKEN_DEFAULTS.colors.variants, surface: 3 },
  },
} as const

function ThemeVarsTokensProbe() {
  const [tokens, setTokens, removeTokens] = usePersistentThemeVarsTokens()

  return (
    <div>
      <span data-testid="surface-step">{tokens.colors.variants.surface}</span>
      <span data-testid="info-hue">{tokens.colors.semantic.info}</span>
      <button
        type="button"
        onClick={() =>
          setTokens(previous => ({
            ...previous,
            colors: {
              ...previous.colors,
              variants: { ...previous.colors.variants, surface: 3 },
            },
          }))
        }
      >
        Set surface step
      </button>
      <button
        type="button"
        onClick={() =>
          setTokens(previous => ({
            ...previous,
            colors: {
              ...previous.colors,
              semantic: { ...previous.colors.semantic, info: 'green' },
            },
          }))
        }
      >
        Set info hue
      </button>
      <button type="button" onClick={removeTokens}>
        Remove
      </button>
    </div>
  )
}

function CustomThemeVarsTokensProbe() {
  const [tokens] = usePersistentThemeVarsTokens({ defaultValue: customThemeVarsTokensDefault })

  return (
    <div>
      <span data-testid="custom-surface-step">{tokens.colors.variants.surface}</span>
      <span data-testid="custom-info-hue">{tokens.colors.semantic.info}</span>
    </div>
  )
}

describe('usePersistentThemeVarsTokens', () => {
  it('defaults variant steps to theme defaults', () => {
    render(<ThemeVarsTokensProbe />)

    expect(screen.getByTestId('surface-step')).toHaveTextContent('4')
  })

  it('hydrates valid stored variant steps from localStorage', () => {
    window.localStorage.setItem(
      DEFAULT_THEME_VARS_TOKENS_STORAGE_KEY,
      JSON.stringify({ colors: { variants: { surface: 3 }, semantic: { info: 'green' } } }),
    )

    render(<ThemeVarsTokensProbe />)

    expect(screen.getByTestId('surface-step')).toHaveTextContent('3')
    expect(screen.getByTestId('info-hue')).toHaveTextContent('green')
  })

  it('falls back to defaults for invalid stored variant steps', () => {
    window.localStorage.setItem(
      DEFAULT_THEME_VARS_TOKENS_STORAGE_KEY,
      JSON.stringify({ colors: { variants: { surface: 99 }, semantic: { info: 'unknown' } } }),
    )

    render(<ThemeVarsTokensProbe />)

    expect(screen.getByTestId('surface-step')).toHaveTextContent('4')
    expect(screen.getByTestId('info-hue')).toHaveTextContent('blue')
  })

  it('uses caller defaults when hydrating partial invalid stored tokens', () => {
    window.localStorage.setItem(
      DEFAULT_THEME_VARS_TOKENS_STORAGE_KEY,
      JSON.stringify({ colors: { variants: { surface: 99 }, semantic: { info: 'unknown' } } }),
    )

    render(<CustomThemeVarsTokensProbe />)

    expect(screen.getByTestId('custom-surface-step')).toHaveTextContent('3')
    expect(screen.getByTestId('custom-info-hue')).toHaveTextContent('green')
  })

  it('writes variant step updates through to localStorage', () => {
    render(<ThemeVarsTokensProbe />)

    fireEvent.click(screen.getByRole('button', { name: 'Set surface step' }))

    expect(screen.getByTestId('surface-step')).toHaveTextContent('3')
    expect(window.localStorage.getItem(DEFAULT_THEME_VARS_TOKENS_STORAGE_KEY)).toContain('"surface":3')
  })

  it('removes stored tokens and resets to defaults', () => {
    window.localStorage.setItem(
      DEFAULT_THEME_VARS_TOKENS_STORAGE_KEY,
      JSON.stringify({ colors: { variants: { surface: 3 } } }),
    )

    render(<ThemeVarsTokensProbe />)
    fireEvent.click(screen.getByRole('button', { name: 'Remove' }))

    expect(screen.getByTestId('surface-step')).toHaveTextContent('4')
    expect(window.localStorage.getItem(DEFAULT_THEME_VARS_TOKENS_STORAGE_KEY)).toBeNull()
  })
})
