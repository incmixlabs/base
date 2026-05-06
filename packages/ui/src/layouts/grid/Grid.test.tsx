import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { Grid } from './Grid'

afterEach(() => {
  cleanup()
})

describe('Grid', () => {
  it('normalizes token-like grid props using prop-def values', () => {
    render(
      <Grid data-testid="grid" columns={' 12 ' as any} gap={' 5 ' as any}>
        <span>One</span>
      </Grid>,
    )

    const grid = screen.getByTestId('grid')

    expect(grid.style.gridTemplateColumns).toBe('repeat(12, minmax(0, 1fr))')
    expect(grid.style.gap).toBe('24px')
  })

  it('preserves trimmed custom CSS grid and gap strings', () => {
    render(
      <Grid data-testid="grid" columns={' minmax(0, 1fr) auto ' as any} gap={' 2rem ' as any}>
        <span>One</span>
      </Grid>,
    )

    const grid = screen.getByTestId('grid')

    expect(grid.style.gridTemplateColumns).toBe('minmax(0, 1fr) auto')
    expect(grid.style.gap).toBe('2rem')
  })
})
