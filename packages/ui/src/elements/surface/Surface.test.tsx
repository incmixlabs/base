import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { Theme } from '@/theme'
import { radiusClassByToken } from '@/theme/helpers'
import { designTokens } from '@/theme/tokens'
import { Surface } from './Surface'
import {
  floatingArrowBase,
  surfaceUnoColorVariants,
  surfaceUnoFocusColorVariants,
  surfaceUnoHighContrastColorVariants,
  surfaceUnoHoverColorVariants,
  surfaceUnoSelectedColorVariants,
} from './surface.class'

afterEach(() => {
  cleanup()
})

describe('Surface', () => {
  it('supports physical and logical floating arrow sides', () => {
    const classTokens = new Set(floatingArrowBase.split(/\s+/).filter(Boolean))

    expect(classTokens).toContain('data-[side=right]:left-0')
    expect(classTokens).toContain('data-[side=left]:right-0')
    expect(classTokens).toContain('ltr:data-[side=inline-end]:left-0')
    expect(classTokens).toContain('rtl:data-[side=inline-end]:right-0')
    expect(classTokens).toContain('ltr:data-[side=inline-start]:right-0')
    expect(classTokens).toContain('rtl:data-[side=inline-start]:left-0')
  })

  it('supports semantic surface tones', () => {
    render(
      <Surface data-testid="surface" color="primary" variant="surface">
        Surface
      </Surface>,
    )

    const surface = screen.getByTestId('surface')

    expect(surface.className).toContain(surfaceUnoColorVariants.primary.surface)
    expect(surface.className).toContain('bg-primary-surface')
    expect(surface.className).toContain('border-primary')
    expect(surface.className).toContain('text-primary')
    expect(surface.className).not.toContain('surface-color-primary')
    expect(surface.className.split(' ')).not.toContain('surface-variant-surface')
  })

  it('uses shared shadow token for the surface variant', () => {
    render(
      <Surface data-testid="surface" variant="surface">
        Surface
      </Surface>,
    )

    const surface = screen.getByTestId('surface')

    expect(surface.className).toContain('[box-shadow:var(--shadow-xs)]')
    expect(surface.className).not.toContain('--af-surface-variant-surface-box-shadow')
  })

  it('maps geometric shapes to shared radius utilities', () => {
    const { rerender } = render(
      <Surface data-testid="surface" shape="pill">
        Surface
      </Surface>,
    )

    const surface = screen.getByTestId('surface')

    expect(surface.className.split(/\s+/)).toContain('rounded-full')
    expect(surface.className).not.toContain('--af-surface-shape-pill-radius')

    rerender(
      <Surface data-testid="surface" shape="circle">
        Surface
      </Surface>,
    )

    expect(surface.className.split(/\s+/)).toContain('aspect-square')
    expect(surface.className.split(/\s+/)).toContain('rounded-full')
    expect(surface.className).not.toContain('--af-surface-shape-circle-radius')

    rerender(
      <Surface data-testid="surface" shape="ellipse">
        Surface
      </Surface>,
    )

    expect(surface.className.split(/\s+/)).toContain('rounded-full')
    expect(surface.className).not.toContain('--af-surface-shape-ellipse-radius')
  })

  it.each(['chart1', 'chart-1'] as const)('supports chart surface tone %s', color => {
    render(
      <Surface data-testid="surface" color={color} variant="soft">
        Surface
      </Surface>,
    )

    const surface = screen.getByTestId('surface')

    expect(surface.className).toContain(surfaceUnoColorVariants[color].soft)
  })

  it.each(['chart1', 'chart-1'] as const)('supports chart surface tone %s via tone prop', tone => {
    render(
      <Surface data-testid="surface" tone={tone} variant="soft">
        Surface
      </Surface>,
    )

    const surface = screen.getByTestId('surface')

    expect(surface.className).toContain(surfaceUnoColorVariants[tone].soft)
  })

  it('prefers tone over color when both are provided', () => {
    render(
      <Surface data-testid="surface" tone="chart1" color="primary" variant="soft">
        Surface
      </Surface>,
    )

    const surface = screen.getByTestId('surface')

    expect(surface.className).toContain(surfaceUnoColorVariants.chart1.soft)
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
      expect(surface.className).toContain(surfaceUnoHoverColorVariants.neutral.surface)
    } else {
      expect(surface.className).not.toContain(surfaceUnoHoverColorVariants.neutral.surface)
    }
  })

  it('uses interaction state color for chromatic hover and selected states', () => {
    render(
      <Surface data-testid="surface" color="primary" hover selected>
        Surface
      </Surface>,
    )

    const surface = screen.getByTestId('surface')

    expect(surface.className).toContain(surfaceUnoHoverColorVariants.primary.surface)
    expect(surface.className).toContain('hover:bg-primary-highlight')
    expect(surface.className).toContain(surfaceUnoSelectedColorVariants.primary)
    expect(surface.className).toContain('data-[selected]:bg-primary-highlight')
    expect(surface).toHaveAttribute('data-selected')
  })

  it('uses internal interaction color for structural hover and selected states', () => {
    render(
      <Surface data-testid="surface" color="neutral" variant="soft" hover selected>
        Surface
      </Surface>,
    )

    const surface = screen.getByTestId('surface')

    expect(surface.className).toContain(surfaceUnoHoverColorVariants.neutral.soft)
    expect(surface.className).toContain('hover:bg-[var(--color-neutral-soft-hover)]')
    expect(surface.className).toContain(surfaceUnoSelectedColorVariants.neutral)
    expect(surface.className).toContain('data-[selected]:bg-[var(--color-neutral-soft-hover)]')
    expect(surface.className).not.toContain('hover:bg-neutral-soft')
    expect(surface.className).not.toContain('data-[selected]:bg-neutral-soft')
    expect(surface.className).not.toContain('bg-neutral-highlight')
  })

  it('uses internal surface-hover color for structural surface hover states', () => {
    render(
      <Surface data-testid="surface" color="neutral" variant="surface" hover>
        Surface
      </Surface>,
    )

    const surface = screen.getByTestId('surface')

    expect(surface.className).toContain(surfaceUnoHoverColorVariants.neutral.surface)
    expect(surface.className).toContain('hover:bg-[var(--color-neutral-surface-hover)]')
  })

  it('uses internal interaction color for chart hover states', () => {
    render(
      <Surface data-testid="surface" color="chart1" variant="soft" hover>
        Surface
      </Surface>,
    )

    const surface = screen.getByTestId('surface')

    expect(surface.className).toContain(surfaceUnoHoverColorVariants.chart1.soft)
    expect(surface.className).toContain('hover:bg-[color-mix(in_oklch,var(--chart-1)_36%,var(--color-light-surface))]')
    expect(surface.className).not.toContain('hover:bg-chart1-soft')
  })

  it('adds color-aware focus styling when enabled', () => {
    render(
      <Surface data-testid="surface" color="primary" focus>
        Surface
      </Surface>,
    )

    const surface = screen.getByTestId('surface')

    expect(surface.className).toContain(surfaceUnoFocusColorVariants.primary)
    expect(surface.className).toContain('focus-visible:outline-solid')
    expect(surface.className).toContain('focus-visible:outline-primary-highlight')
  })

  it('adds Uno color overrides for high-contrast states', () => {
    render(
      <Surface data-testid="surface" color="primary" variant="surface" highContrast>
        Surface
      </Surface>,
    )

    const surface = screen.getByTestId('surface')

    expect(surface.className).toContain('af-high-contrast')
    expect(surface.className).toContain(surfaceUnoHighContrastColorVariants.primary.surface)
    expect(surface.className).toContain('border-[var(--color-primary-text)]')
    expect(surface.className.split(' ')).not.toContain('surface-variant-surface')
  })

  it('replaces normal fill and border classes for solid high-contrast states', () => {
    render(
      <Surface data-testid="surface" color="primary" variant="solid" highContrast>
        Surface
      </Surface>,
    )

    const surface = screen.getByTestId('surface')

    expect(surface.className).toContain(surfaceUnoHighContrastColorVariants.primary.solid)
    expect(surface.className).toContain('bg-[var(--color-primary-text)]')
    expect(surface.className).toContain('border-[var(--color-primary-text)]')
    expect(surface.className).not.toContain('bg-primary-solid')
    expect(surface.className).not.toContain('border-primary')
  })

  it('replaces normal fill classes for structural soft high-contrast states', () => {
    render(
      <Surface data-testid="surface" color="neutral" variant="soft" highContrast>
        Surface
      </Surface>,
    )

    const surface = screen.getByTestId('surface')

    expect(surface.className).toContain(surfaceUnoHighContrastColorVariants.neutral.soft)
    expect(surface.className).toContain('bg-[var(--color-neutral-soft-hover)]')
    expect(surface.className).not.toContain('bg-neutral-soft')
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

  it('uses shared token classes for an explicit radius prop', () => {
    render(
      <Surface data-testid="surface" radius="full">
        Surface
      </Surface>,
    )

    const surface = screen.getByTestId('surface')

    expect(surface.className).toContain(radiusClassByToken.full)
    expect(surface).toHaveStyle({ '--element-border-radius': designTokens.radius.full })
  })
})
