import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { surfaceColorVariants } from '@/elements/surface/surface.css'
import {
  gridTemplateAreasCustomResponsive,
  gridTemplateColumnsCustomResponsive,
  gridTemplateRowsCustomResponsive,
} from '@/layouts/grid/Grid.css'
import { paddingResponsiveClasses } from '@/theme/helpers/padding-responsive.css'
import { Theme } from '@/theme/ThemeProvider'
import { designTokens } from '@/theme/tokens'
import { Card } from './Card'
import { cardRootBase, cardRootSizeResponsiveVariants, cardSurfaceBase } from './Card.css'

afterEach(() => {
  cleanup()
})

describe('Card', () => {
  it('applies root and responsive padding classes on the card surface', () => {
    render(
      <Card.Root size={{ initial: 'xs', md: 'lg' }}>
        <Card.Content>Content</Card.Content>
      </Card.Root>,
    )

    const content = screen.getByText('Content')
    const cardSurface = content.closest('div')?.parentElement

    expect(cardSurface).toBeInTheDocument()
    expect(cardSurface?.className).toContain(cardRootBase)
    expect(cardSurface?.className).toContain(cardSurfaceBase)
    expect(cardSurface?.className).toContain(cardRootSizeResponsiveVariants.md.lg)
  })

  it('defaults radius to the ThemeProvider radius', () => {
    render(
      <Theme radius="lg">
        <Card.Root>
          <Card.Content>Content</Card.Content>
        </Card.Root>
      </Theme>,
    )

    const content = screen.getByText('Content')
    const cardSurface = content.closest('div')?.parentElement

    expect(cardSurface).toBeInTheDocument()
    expect(cardSurface).toHaveStyle({ '--element-border-radius': designTokens.radius.lg })
  })

  it('applies padding props on the card surface root', () => {
    render(
      <Card.Root data-testid="card" p={{ initial: '2', md: '4' }}>
        <Card.Content>Content</Card.Content>
      </Card.Root>,
    )

    const root = screen.getByTestId('card')

    expect(root.className).toContain(paddingResponsiveClasses.p)
    expect(root.getAttribute('style')).toContain('--')
  })

  it('does not apply size padding classes when explicit padding props are provided', () => {
    render(
      <Card.Root data-testid="card" size={{ initial: 'xs', md: 'lg' }} p={{ initial: '2', md: '4' }}>
        <Card.Content>Content</Card.Content>
      </Card.Root>,
    )

    const root = screen.getByTestId('card')

    expect(root.className).toContain(paddingResponsiveClasses.p)
    expect(root.className).not.toContain(cardRootSizeResponsiveVariants.md.lg)
  })

  it.each(['chart1', 'chart-1'] as const)('supports chart surface tone %s on Card.Root', color => {
    render(
      <Card.Root data-testid="card" color={color} variant="soft">
        <Card.Content>Content</Card.Content>
      </Card.Root>,
    )

    const root = screen.getByTestId('card')

    expect(root.className).toContain(surfaceColorVariants[color].soft)
  })

  it.each(['chart1', 'chart-1'] as const)('supports chart surface tone %s on Card.Root via tone prop', tone => {
    render(
      <Card.Root data-testid="card" tone={tone} variant="soft">
        <Card.Content>Content</Card.Content>
      </Card.Root>,
    )

    const root = screen.getByTestId('card')

    expect(root.className).toContain(surfaceColorVariants[tone].soft)
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
