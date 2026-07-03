import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { heightResponsiveClasses, heightResponsiveVars } from '@/theme/helpers/height-responsive'
import { widthResponsiveClasses, widthResponsiveVars } from '@/theme/helpers/width-responsive'
import { Theme } from '@/theme/ThemeProvider'
import { designTokens } from '@/theme/tokens'
import { Box } from './Box'
import { getBoxSurfaceClassName } from './box.class'

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

describe('Box', () => {
  it('defaults radius to the ThemeProvider radius', () => {
    render(
      <Theme radius="lg">
        <Box data-testid="box">Content</Box>
      </Theme>,
    )

    expect(screen.getByTestId('box').style.borderRadius).toBe(designTokens.radius.lg)
  })

  it('uses shared responsive helpers for layout spacing and sizing', () => {
    render(
      <Box
        data-testid="box"
        p={{ initial: '2', md: '4' }}
        mx={{ initial: '1', lg: '3' }}
        width={{ initial: '100%', lg: '50%' }}
        height={{ initial: '10rem', md: '20rem' }}
      >
        Content
      </Box>,
    )

    const box = screen.getByTestId('box')

    expect(box).toHaveClass('p-2', 'md:p-4', 'mx-1', 'lg:mx-3')
    expect(box).toHaveClass(
      'w-full',
      widthResponsiveClasses.width.lg,
      heightResponsiveClasses.height.initial,
      heightResponsiveClasses.height.md,
    )
    expect(box.style.getPropertyValue(widthResponsiveVars.width.lg)).toBe('50%')
    expect(box.style.getPropertyValue(heightResponsiveVars.height.initial)).toBe('10rem')
    expect(box.style.getPropertyValue(heightResponsiveVars.height.md)).toBe('20rem')
  })

  it('supports padding and margin aliases without forwarding them to the DOM', () => {
    render(
      <Box data-testid="box" padding={{ initial: '2', md: '4' }} margin={{ initial: '1', lg: '3' }}>
        Content
      </Box>,
    )

    const box = screen.getByTestId('box')

    expect(box).toHaveClass('p-2', 'md:p-4', 'm-1', 'lg:m-3')
    expect(box).not.toHaveAttribute('padding')
    expect(box).not.toHaveAttribute('margin')
  })

  it('keeps spacing props token-only', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    render(
      <Box
        data-testid="box"
        layout="row"
        p={'13px' as any}
        pt={'1' as any}
        m={'2rem' as any}
        mt={'-2' as any}
        gap={'-2' as any}
      >
        Content
      </Box>,
    )

    const box = screen.getByTestId('box')

    expect(box).toHaveClass('pt-1', '-mt-2')
    expect(box.className).not.toContain('13px')
    expect(box.className).not.toContain('2rem')
    expect(box).not.toHaveClass('-gap-2')
    expect(box.style.padding).toBe('')
    expect(box.style.margin).toBe('')
    expect(box.style.gap).toBe('')
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining('[LayoutComposition] Ignored unsupported gap value(s): -2'),
    )
  })

  it('maps width full alias to 100%', () => {
    render(
      <Box data-testid="box" width="full">
        Content
      </Box>,
    )

    const box = screen.getByTestId('box')

    expect(box).toHaveClass('w-full')
    expect(box.style.width).toBe('')
  })

  it('maps token-like width and height values to Uno utilities', () => {
    render(
      <Box data-testid="box" width="3" height="4" minWidth="0" minHeight="0">
        Content
      </Box>,
    )

    expect(screen.getByTestId('box')).toHaveClass('w-3', 'h-4', 'min-w-0', 'min-h-0')
  })

  it.each(['chart1', 'chart-1'] as const)('resolves chart color key %s', color => {
    render(
      <Box data-testid="box" color={color} variant="solid">
        Content
      </Box>,
    )

    const box = screen.getByTestId('box')

    expect(box.className).toContain(getBoxSurfaceClassName(color, 'solid'))
    expect(box.style.backgroundColor).toBe('')
    expect(box.style.color).toBe('')
  })

  it.each(['chart1', 'chart-1'] as const)('resolves chart tone key %s via tone prop', tone => {
    render(
      <Box data-testid="box" tone={tone} variant="solid">
        Content
      </Box>,
    )

    expect(screen.getByTestId('box').className).toContain(getBoxSurfaceClassName(tone, 'solid'))
  })

  it('maps explicit primary text to a token color utility', () => {
    render(
      <Box data-testid="box" color="success" variant="surface" text="primary">
        Content
      </Box>,
    )

    const box = screen.getByTestId('box')

    expect(box.className).toContain(getBoxSurfaceClassName('success', 'surface', 'primary'))
    expect(box.className).toContain('var(--color-success-solid)')
    expect(box.className).not.toContain('var(--color-success-primary)')
  })

  it('does not emit tone styles for unsupported color keys', () => {
    render(
      <Box data-testid="box" color={'chart-9' as any} variant="solid">
        Content
      </Box>,
    )

    const box = screen.getByTestId('box')

    expect(box.style.backgroundColor).toBe('')
    expect(box.style.color).toBe('')
  })

  it('supports layout composition without forwarding layout props to the DOM', () => {
    render(
      <Box data-testid="box" layout="row" align="center" justify="between" gap="2">
        <span>Left</span>
        <span>Right</span>
      </Box>,
    )

    const box = screen.getByTestId('box')

    expect(box).toHaveClass('flex', 'flex-row', 'items-center', 'justify-between', 'gap-2')
    expect(box.style.gap).toBe('')
    expect(box).not.toHaveAttribute('layout')
    expect(box).not.toHaveAttribute('align')
    expect(box).not.toHaveAttribute('justify')
  })

  it('normalizes prop-def-backed layout composition values', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    render(
      <Box
        data-testid="box"
        layout={' Grid ' as any}
        align={' CENTER ' as any}
        columns={' 12 ' as any}
        gap={' 2rem ' as any}
      >
        <span>One</span>
        <span>Two</span>
      </Box>,
    )

    const box = screen.getByTestId('box')

    expect(box).toHaveClass('grid', 'items-center')
    expect(box.style.gridTemplateColumns).toBe('repeat(12, minmax(0, 1fr))')
    expect(box.className).not.toContain('2rem')
    expect(box.style.gap).toBe('')
    expect(box).not.toHaveAttribute('layout')
    expect(box).not.toHaveAttribute('align')
    expect(box).not.toHaveAttribute('columns')
    expect(box).not.toHaveAttribute('gap')
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining('[LayoutComposition] Ignored unsupported gap value(s): 2rem'),
    )
  })

  it('maps responsive token layout gaps and skips unsupported breakpoint values', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    render(
      <Box
        data-testid="box"
        layout="row"
        gap={{ initial: '16px' as any, md: '24px' as any }}
        gapX={{ initial: '1', lg: '2rem' as any }}
        gapY={{ sm: '12px' as any, xl: '4' }}
      >
        <span>One</span>
        <span>Two</span>
      </Box>,
    )

    const box = screen.getByTestId('box')

    expect(box).toHaveClass('gap-x-1', 'xl:gap-y-4')
    expect(box.className).not.toContain('16px')
    expect(box.className).not.toContain('24px')
    expect(box.className).not.toContain('2rem')
    expect(box.style.gap).toBe('')
    expect(box.style.columnGap).toBe('')
    expect(box.style.rowGap).toBe('')
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining('[LayoutComposition] Ignored unsupported gap value(s): initial:16px, md:24px'),
    )
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining('[LayoutComposition] Ignored unsupported gapX value(s): lg:2rem'),
    )
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining('[LayoutComposition] Ignored unsupported gapY value(s): sm:12px'),
    )
  })
})
