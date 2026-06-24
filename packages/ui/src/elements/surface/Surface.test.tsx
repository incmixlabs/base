import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { Theme } from '@/theme'
import { radiusClassByToken } from '@/theme/helpers'
import { designTokens } from '@/theme/tokens'
import { Surface } from './Surface'
import { surfaceColorVariants, surfaceHoverEnabledClass } from './surface.css'

afterEach(() => {
  cleanup()
})

describe('Surface', () => {
  it.each(['chart1', 'chart-1'] as const)('supports chart surface tone %s', color => {
    render(
      <Surface data-testid="surface" color={color} variant="soft">
        Surface
      </Surface>,
    )

    const surface = screen.getByTestId('surface')

    expect(surface.className).toContain(surfaceColorVariants[color].soft)
  })

  it.each(['chart1', 'chart-1'] as const)('supports chart surface tone %s via tone prop', tone => {
    render(
      <Surface data-testid="surface" tone={tone} variant="soft">
        Surface
      </Surface>,
    )

    const surface = screen.getByTestId('surface')

    expect(surface.className).toContain(surfaceColorVariants[tone].soft)
  })

  it('prefers tone over color when both are provided', () => {
    render(
      <Surface data-testid="surface" tone="chart1" color="primary" variant="soft">
        Surface
      </Surface>,
    )

    const surface = screen.getByTestId('surface')

    expect(surface.className).toContain(surfaceColorVariants.chart1.soft)
  })

  it.each([
    { highContrast: 'false', hover: 'true', hasHighContrast: false, hasHover: true },
    { highContrast: 'TrUe', hover: 'FaLsE', hasHighContrast: true, hasHover: false },
    { highContrast: '', hover: '', hasHighContrast: false, hasHover: true },
    { highContrast: null, hover: null, hasHighContrast: false, hasHover: true },
    { highContrast: undefined, hover: undefined, hasHighContrast: false, hasHover: true },
  ])('normalizes boolean-like visual props %#', ({ highContrast, hover, hasHighContrast, hasHover }) => {
    render(
      <Surface data-testid="surface" highContrast={highContrast as any} hover={hover as any}>
        Surface
      </Surface>,
    )

    const surface = screen.getByTestId('surface')

    if (hasHighContrast) {
      expect(surface.className).toContain('af-high-contrast')
    } else {
      expect(surface.className).not.toContain('af-high-contrast')
    }

    if (hasHover) {
      expect(surface.className).toContain(surfaceHoverEnabledClass)
    } else {
      expect(surface.className).not.toContain(surfaceHoverEnabledClass)
    }
  })

  it('uses shared token classes for the resolved theme radius', () => {
    render(
      <Theme radius="lg">
        <Surface data-testid="surface">Surface</Surface>
      </Theme>,
    )

    const surface = screen.getByTestId('surface')

    expect(surface.className).toContain(radiusClassByToken.lg)
    expect(surface.className).not.toContain('rounded-[var(--element-border-radius)]')
    expect(surface).toHaveStyle({ '--element-border-radius': designTokens.radius.lg })
  })
})
