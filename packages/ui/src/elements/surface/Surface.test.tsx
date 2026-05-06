import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
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

  it('normalizes boolean-like visual props', () => {
    render(
      <Surface data-testid="surface" highContrast={'false' as any} hover={'true' as any}>
        Surface
      </Surface>,
    )

    const surface = screen.getByTestId('surface')

    expect(surface.className).not.toContain('af-high-contrast')
    expect(surface.className).toContain(surfaceHoverEnabledClass)
  })
})
