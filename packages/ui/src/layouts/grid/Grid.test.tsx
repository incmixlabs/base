import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { gridTemplateColumnsCustomResponsive, gridTemplateRowsCustomResponsive } from './Grid.classes'
import { Grid } from './Grid'

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

describe('Grid', () => {
  it('normalizes token-like grid props and maps token gaps to utilities', () => {
    render(
      <Grid data-testid="grid" columns={' 12 ' as any} gap={' 5 ' as any}>
        <span>One</span>
      </Grid>,
    )

    const grid = screen.getByTestId('grid')

    expect(grid.style.gridTemplateColumns).toBe('repeat(12, minmax(0, 1fr))')
    expect(grid).toHaveClass('gap-5')
    expect(grid.style.gap).toBe('')
  })

  it('preserves trimmed custom CSS grid strings and ignores arbitrary gap strings', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    render(
      <Grid data-testid="grid" columns={' minmax(0, 1fr) auto ' as any} gap={' 2rem ' as any}>
        <span>One</span>
      </Grid>,
    )

    const grid = screen.getByTestId('grid')

    expect(grid.style.gridTemplateColumns).toBe('minmax(0, 1fr) auto')
    expect(grid.className).not.toContain('2rem')
    expect(grid.style.gap).toBe('')
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('[Grid] Ignored unsupported gap value(s): 2rem'))
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

  it('maps responsive token gaps and skips unsupported breakpoint values', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    render(
      <Grid
        data-testid="grid"
        gap={{ initial: '2', md: '20px' as any }}
        gapX={{ sm: '1.5rem' as any }}
        gapY={{ initial: '3', lg: '24px' as any }}
      >
        <span>One</span>
      </Grid>,
    )

    const grid = screen.getByTestId('grid')

    expect(grid).toHaveClass('gap-2', 'gap-y-3')
    expect(grid.className).not.toContain('20px')
    expect(grid.className).not.toContain('1.5rem')
    expect(grid.className).not.toContain('24px')
    expect(grid.style.gap).toBe('')
    expect(grid.style.columnGap).toBe('')
    expect(grid.style.rowGap).toBe('')
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('[Grid] Ignored unsupported gap value(s): md:20px'))
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('[Grid] Ignored unsupported gapX value(s): sm:1.5rem'))
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('[Grid] Ignored unsupported gapY value(s): lg:24px'))
  })
})
