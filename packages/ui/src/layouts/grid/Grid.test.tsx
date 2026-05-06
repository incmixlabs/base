import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { gapResponsiveClasses, gapResponsiveVars } from '@/theme/helpers/gap-responsive.css'
import { gridTemplateColumnsCustomResponsive, gridTemplateRowsCustomResponsive } from './Grid.css'
import { Grid } from './Grid'

afterEach(() => {
  cleanup()
})

function customPropertyName(value: string): string {
  const match = /^var\((--[^)]+)\)$/.exec(value)
  return match?.[1] ?? value
}

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

  it('preserves responsive custom grid template values', () => {
    render(
      <Grid
        data-testid="grid"
        columns={{ initial: '1fr 2fr', md: '3', lg: 'minmax(0, 1fr) auto' }}
        rows={{ initial: '2', sm: 'auto 1fr' }}
      >
        <span>One</span>
      </Grid>,
    )

    const grid = screen.getByTestId('grid')

    expect(grid.style.gridTemplateColumns).toBe('1fr 2fr')
    expect(grid.className).toContain(gridTemplateColumnsCustomResponsive.lg)
    expect(grid.className).toContain(gridTemplateRowsCustomResponsive.sm)
    expect(grid.style.getPropertyValue('--grid-template-columns-lg')).toBe('minmax(0, 1fr) auto')
    expect(grid.style.getPropertyValue('--grid-template-rows-sm')).toBe('auto 1fr')
  })

  it('preserves responsive custom gap values', () => {
    render(
      <Grid
        data-testid="grid"
        gap={{ initial: '2', md: '20px' }}
        gapX={{ sm: '1.5rem' }}
        gapY={{ initial: '3', lg: '24px' }}
      >
        <span>One</span>
      </Grid>,
    )

    const grid = screen.getByTestId('grid')

    expect(grid.className).toContain(gapResponsiveClasses.gap)
    expect(grid.className).toContain(gapResponsiveClasses.gapX)
    expect(grid.className).toContain(gapResponsiveClasses.gapY)
    expect(grid.style.getPropertyValue(customPropertyName(gapResponsiveVars.gap.initial))).toBe('8px')
    expect(grid.style.getPropertyValue(customPropertyName(gapResponsiveVars.gap.md))).toBe('20px')
    expect(grid.style.getPropertyValue(customPropertyName(gapResponsiveVars.gapX.sm))).toBe('1.5rem')
    expect(grid.style.getPropertyValue(customPropertyName(gapResponsiveVars.gapY.initial))).toBe('12px')
    expect(grid.style.getPropertyValue(customPropertyName(gapResponsiveVars.gapY.lg))).toBe('24px')
  })
})
