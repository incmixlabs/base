import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { GradientBackground } from './GradientBackground'

afterEach(() => {
  cleanup()
})

describe('GradientBackground', () => {
  it('applies layout composition to the native gradient root', () => {
    render(
      <GradientBackground data-testid="gradient" duration={0} layout="grid" layoutProps={{ columns: '2', gap: '4' }}>
        <span>One</span>
        <span>Two</span>
      </GradientBackground>,
    )

    const root = screen.getByTestId('gradient')

    expect(root).toHaveClass('grid')
    expect(root.getAttribute('style')).toContain('grid-template-columns:')
    expect(root.getAttribute('style')).toContain('gap:')
  })

  it('keeps render target props separate from layout props', () => {
    render(
      <GradientBackground
        as="Card"
        data-testid="gradient-card"
        duration={0}
        size="sm"
        layout="column"
        layoutProps={{ align: 'center', gap: '2' }}
      >
        <span>Card content</span>
      </GradientBackground>,
    )

    const root = screen.getByTestId('gradient-card')

    expect(root).toHaveClass('flex', 'flex-col', 'items-center')
    expect(root.getAttribute('style')).toContain('gap:')
  })

  it('forwards layout composition to the inner container target', () => {
    render(
      <GradientBackground
        as="Container"
        data-testid="gradient-container"
        duration={0}
        layout="grid"
        layoutProps={{ columns: '2', gap: '3' }}
      >
        <span>One</span>
        <span>Two</span>
      </GradientBackground>,
    )

    const root = screen.getByTestId('gradient-container')
    const inner = screen.getByText('One').closest('div')

    expect(root).not.toHaveClass('grid')
    expect(inner).toHaveClass('grid')
    expect(inner?.getAttribute('style')).toContain('grid-template-columns:')
    expect(inner?.getAttribute('style')).toContain('gap:')
  })
})
