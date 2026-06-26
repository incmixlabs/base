import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { surfaceUnoColorVariants } from '@/elements/surface/surface.class'
import { radiusClassByToken } from '@/theme/helpers'
import {
  gridTemplateAreasCustomResponsive,
  gridTemplateColumnsCustomResponsive,
  gridTemplateRowsCustomResponsive,
} from '@/layouts/grid/Grid.css'
import { Theme } from '@/theme/ThemeProvider'
import { designTokens } from '@/theme/tokens'
import { Card } from './Card'

const cardRootSizeClassForTest = 'af-card-size'

afterEach(() => {
  cleanup()
})

describe('Card', () => {
  it('applies root and responsive padding classes on the card surface', () => {
    render(
      <Card.Root data-testid="card" size={{ initial: 'xs', md: 'lg' }}>
        <Card.Content>Content</Card.Content>
      </Card.Root>,
    )

    const content = screen.getByText('Content')
    const cardSurface = screen.getByTestId('card')
    const cardPaddingWrapper = content.closest(`.${cardRootSizeClassForTest}`) as HTMLElement | null

    expect(cardSurface).toBeInTheDocument()
    expect(cardSurface.className).toContain('[container-type:inline-size]')
    expect(cardSurface).not.toHaveClass('af-card-size')
    expect(cardPaddingWrapper).toBeInTheDocument()
    expect(cardPaddingWrapper?.style.getPropertyValue('--af-card-padding-initial')).toContain(
      '--theme-rhythm-card-padding-xs',
    )
    expect(cardPaddingWrapper?.style.getPropertyValue('--af-card-padding-md')).toContain(
      '--theme-rhythm-card-padding-lg',
    )
  })

  it('defaults radius to the ThemeProvider radius', () => {
    render(
      <Theme radius="lg">
        <Card.Root data-testid="card">
          <Card.Content>Content</Card.Content>
        </Card.Root>
      </Theme>,
    )

    const cardSurface = screen.getByTestId('card')

    expect(cardSurface).toBeInTheDocument()
    expect(cardSurface?.className).toContain(radiusClassByToken.lg)
    expect(cardSurface).toHaveStyle({ '--element-border-radius': designTokens.radius.lg })
    expect(cardSurface).toHaveStyle({ '--inset-border-radius': designTokens.radius.lg })
    expect(cardSurface?.style.getPropertyValue('--inset-border-radius')).not.toBe('var(--element-border-radius)')
  })

  it('uses shared token classes for an explicit radius prop', () => {
    render(
      <Card.Root data-testid="card" radius="full">
        <Card.Content>Content</Card.Content>
      </Card.Root>,
    )

    const cardSurface = screen.getByTestId('card')

    expect(cardSurface).toBeInTheDocument()
    expect(cardSurface?.className).toContain(radiusClassByToken.full)
    expect(cardSurface).toHaveStyle({ '--inset-border-radius': designTokens.radius.full })
  })

  it('applies padding props on the card surface root', () => {
    render(
      <Card.Root data-testid="card" p={{ initial: '2', md: '4' }}>
        <Card.Content>Content</Card.Content>
      </Card.Root>,
    )

    const root = screen.getByTestId('card')

    expect(root).toHaveClass('p-2', 'md:p-4')
  })

  it('does not apply size padding classes when explicit padding props are provided', () => {
    render(
      <Card.Root data-testid="card" size={{ initial: 'xs', md: 'lg' }} p={{ initial: '2', md: '4' }}>
        <Card.Content>Content</Card.Content>
      </Card.Root>,
    )

    const root = screen.getByTestId('card')

    expect(root).toHaveClass('p-2', 'md:p-4')
    expect(root).not.toHaveClass('af-card-size')
    expect(root.style.getPropertyValue('--af-card-padding-initial')).toBe('')
    expect(root.style.getPropertyValue('--af-card-padding-md')).toBe('')
  })

  it('keeps asChild cards wrapperless while applying static size padding', () => {
    const { container } = render(
      <Card.Root asChild size={{ initial: 'xs', md: 'lg' }}>
        <button data-testid="card-child" type="button">
          Action
        </button>
      </Card.Root>,
    )

    const child = screen.getByTestId('card-child')

    expect(container.firstElementChild).toBe(child)
    expect(child).not.toHaveClass('af-card-size')
    expect(child.style.padding).toBe('var(--af-card-padding-initial)')
    expect(child.style.getPropertyValue('--af-card-padding-initial')).toContain('--theme-rhythm-card-padding-xs')
  })

  it.each(['chart1', 'chart-1'] as const)('supports chart surface tone %s on Card.Root', color => {
    render(
      <Card.Root data-testid="card" color={color} variant="soft">
        <Card.Content>Content</Card.Content>
      </Card.Root>,
    )

    const root = screen.getByTestId('card')

    expect(root.className).toContain(surfaceUnoColorVariants[color].soft)
  })

  it.each(['chart1', 'chart-1'] as const)('supports chart surface tone %s on Card.Root via tone prop', tone => {
    render(
      <Card.Root data-testid="card" tone={tone} variant="soft">
        <Card.Content>Content</Card.Content>
      </Card.Root>,
    )

    const root = screen.getByTestId('card')

    expect(root.className).toContain(surfaceUnoColorVariants[tone].soft)
  })

  it('supports flex layout composition on Card.Root', () => {
    render(
      <Card.Root data-testid="card" layout="row" align="center" justify="between" gap="2">
        <span>Left</span>
        <span>Right</span>
      </Card.Root>,
    )

    const root = screen.getByTestId('card')

    expect(root).toHaveClass('flex', 'flex-row', 'items-center', 'justify-between')
    expect(root.getAttribute('style')).toContain('gap:')
  })

  it('supports grid layout composition on Card.Root', () => {
    render(
      <Card.Root data-testid="card" layout="grid" columns="2" gap="4">
        <span>One</span>
        <span>Two</span>
      </Card.Root>,
    )

    const root = screen.getByTestId('card')

    expect(root).toHaveClass('grid')
    expect(root.getAttribute('style')).toContain('grid-template-columns:')
    expect(root.getAttribute('style')).toContain('gap:')
  })

  it('supports responsive custom grid templates on Card.Root layout composition', () => {
    render(
      <Card.Root
        data-testid="card"
        layout="grid"
        areas={{ md: '"media content"' }}
        columns={{ initial: '1', md: 'minmax(0, 1fr) auto' }}
        rows={{ md: 'auto 1fr' }}
      >
        <span>Media</span>
        <span>Content</span>
      </Card.Root>,
    )

    const root = screen.getByTestId('card')

    expect(root.className).toContain(gridTemplateAreasCustomResponsive.md)
    expect(root.className).toContain(gridTemplateColumnsCustomResponsive.md)
    expect(root.className).toContain(gridTemplateRowsCustomResponsive.md)
    expect(root.style.gridTemplateColumns).toBe('repeat(1, minmax(0, 1fr))')
    expect(root.style.getPropertyValue('--grid-template-areas-md')).toBe('"media content"')
    expect(root.style.getPropertyValue('--grid-template-columns-md')).toBe('minmax(0, 1fr) auto')
    expect(root.style.getPropertyValue('--grid-template-rows-md')).toBe('auto 1fr')
  })
})
