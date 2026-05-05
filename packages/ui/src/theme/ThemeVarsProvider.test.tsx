import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ThemeProvider } from './ThemeProvider'
import { ThemeVarsProvider, useThemeVarsContext } from './ThemeVarsProvider'
import { useThemeContext } from './theme-provider.context'

afterEach(() => {
  cleanup()
})

function SemanticLaneProbe() {
  const theme = useThemeContext()

  return (
    <div>
      <span data-testid="info-hue">{theme.semanticColors.info}</span>
      <button type="button" onClick={() => theme.onSemanticColorChange('info', 'green')}>
        set-info-green
      </button>
    </div>
  )
}

function BackToBackTokenProbe() {
  const themeVars = useThemeVarsContext()

  return (
    <button
      type="button"
      onClick={() => {
        themeVars.onSemanticColorChange('info', 'green')
        themeVars.onColorVariantStepChange('surface', 3)
      }}
    >
      update-tokens
    </button>
  )
}

describe('ThemeVarsProvider', () => {
  it('stores runtime token state on its own boundary', () => {
    const { container } = render(
      <ThemeVarsProvider
        tokens={{
          colors: {
            semantic: { info: 'red' },
            variants: { surfaceHover: 6 },
          },
        }}
      >
        <div>content</div>
      </ThemeVarsProvider>,
    )

    const root = container.firstElementChild as HTMLDivElement | null

    expect(root?.dataset.themeVarsTheme).toBe('radix')
    expect(root?.style.getPropertyValue('--color-info-primary')).toBe('')
    expect(root?.style.getPropertyValue('--color-info-surface-hover')).toBe('')
  })

  it('lets ThemeProvider delegate semantic lane state through the vars provider', async () => {
    const user = userEvent.setup()
    render(
      <ThemeVarsProvider tokens={{ colors: { semantic: { info: 'blue' } } }}>
        <ThemeProvider>
          <SemanticLaneProbe />
        </ThemeProvider>
      </ThemeVarsProvider>,
    )

    expect(screen.getByTestId('info-hue')).toHaveTextContent('blue')

    await user.click(screen.getByRole('button', { name: 'set-info-green' }))

    expect(screen.getByTestId('info-hue')).toHaveTextContent('green')
    const root = screen.getByTestId('info-hue').closest('[style]') as HTMLDivElement | null
    expect(root?.style.getPropertyValue('--color-info-primary')).toBe('var(--green-9)')
  })

  it('emits cumulative token snapshots for back-to-back updates', async () => {
    const user = userEvent.setup()
    const onTokensChange = vi.fn()

    render(
      <ThemeVarsProvider onTokensChange={onTokensChange}>
        <BackToBackTokenProbe />
      </ThemeVarsProvider>,
    )

    await user.click(screen.getByRole('button', { name: 'update-tokens' }))

    expect(onTokensChange).toHaveBeenCalledTimes(2)
    expect(onTokensChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        colors: expect.objectContaining({
          semantic: expect.objectContaining({ info: 'green' }),
          variants: expect.objectContaining({ surface: 3 }),
        }),
      }),
    )
  })
})
