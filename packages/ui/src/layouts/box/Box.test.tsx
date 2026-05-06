import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { gapResponsiveClasses, gapResponsiveVars } from '@/theme/helpers/gap-responsive.css'
import { heightResponsiveClasses, heightResponsiveVars } from '@/theme/helpers/height-responsive.css'
import { marginResponsiveClasses, marginResponsiveVars } from '@/theme/helpers/margin-responsive.css'
import { paddingResponsiveClasses, paddingResponsiveVars } from '@/theme/helpers/padding-responsive.css'
import { widthResponsiveClasses, widthResponsiveVars } from '@/theme/helpers/width-responsive.css'
import { Theme } from '@/theme/ThemeProvider'
import { designTokens } from '@/theme/tokens'
import { Box } from './Box'

afterEach(() => {
  cleanup()
})

function customPropertyName(value: string): string {
  const match = /^var\((--[^)]+)\)$/.exec(value)
  return match?.[1] ?? value
}

describe('Box', () => {
  it('defaults radius to the ThemeProvider radius', () => {
    render(
      <Theme radius="lg">
        <Box data-testid="box">Content</Box>
      </Theme>,
    )

    expect(screen.getByTestId('box').style.borderRadius).toBe(designTokens.radius.lg)
  })

  it('uses shared responsive spacing helpers for layout padding and margin', () => {
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

    expect(box.className).toContain(paddingResponsiveClasses.p)
    expect(box.className).toContain(marginResponsiveClasses.mx)
    expect(box.className).toContain(widthResponsiveClasses.width)
    expect(box.className).toContain(heightResponsiveClasses.height)
    expect(box.className).not.toContain('p-2')
    expect(box.className).not.toContain('md:p-4')
    expect(box.getAttribute('style')).toContain(customPropertyName(widthResponsiveVars.width.initial))
    expect(box.getAttribute('style')).toContain(customPropertyName(heightResponsiveVars.height.initial))
  })

  it('supports padding and margin aliases without forwarding them to the DOM', () => {
    render(
      <Box data-testid="box" padding={{ initial: '2', md: '4' }} margin={{ initial: '1', lg: '3' }}>
        Content
      </Box>,
    )

    const box = screen.getByTestId('box')

    expect(box.className).toContain(paddingResponsiveClasses.p)
    expect(box.className).toContain(marginResponsiveClasses.m)
    expect(box.getAttribute('style')).toContain(customPropertyName(paddingResponsiveVars.p.initial))
    expect(box.getAttribute('style')).toContain(customPropertyName(marginResponsiveVars.m.initial))
    expect(box).not.toHaveAttribute('padding')
    expect(box).not.toHaveAttribute('margin')
  })

  it('maps width full alias to 100%', () => {
    render(
      <Box data-testid="box" width="full">
        Content
      </Box>,
    )

    const box = screen.getByTestId('box')

    expect(box.className).toContain(widthResponsiveClasses.width)
    expect(box.style.getPropertyValue(customPropertyName(widthResponsiveVars.width.initial))).toBe('100%')
  })

  it.each(['chart1', 'chart-1'] as const)('resolves chart color key %s', color => {
    render(
      <Box data-testid="box" color={color} variant="solid">
        Content
      </Box>,
    )

    expect(screen.getByTestId('box')).toHaveStyle({
      backgroundColor: 'var(--chart-1)',
      color: 'var(--chart-1-contrast)',
    })
  })

  it.each(['chart1', 'chart-1'] as const)('resolves chart tone key %s via tone prop', tone => {
    render(
      <Box data-testid="box" tone={tone} variant="solid">
        Content
      </Box>,
    )

    expect(screen.getByTestId('box')).toHaveStyle({
      backgroundColor: 'var(--chart-1)',
      color: 'var(--chart-1-contrast)',
    })
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

    expect(box).toHaveClass('flex', 'flex-row', 'items-center', 'justify-between')
    expect(box.getAttribute('style')).toContain('gap:')
    expect(box).not.toHaveAttribute('layout')
    expect(box).not.toHaveAttribute('align')
    expect(box).not.toHaveAttribute('justify')
  })

  it('normalizes prop-def-backed layout composition values', () => {
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
    expect(box.style.gap).toBe('2rem')
  })

  it('supports responsive custom layout gap values', () => {
    render(
      <Box
        data-testid="box"
        layout="row"
        gap={{ initial: '16px', md: '24px' }}
        gapX={{ initial: '1', lg: '2rem' }}
        gapY={{ sm: '12px', xl: '4' }}
      >
        <span>One</span>
        <span>Two</span>
      </Box>,
    )

    const box = screen.getByTestId('box')

    expect(box.className).toContain(gapResponsiveClasses.gap)
    expect(box.className).toContain(gapResponsiveClasses.gapX)
    expect(box.className).toContain(gapResponsiveClasses.gapY)
    expect(box.style.getPropertyValue(customPropertyName(gapResponsiveVars.gap.initial))).toBe('16px')
    expect(box.style.getPropertyValue(customPropertyName(gapResponsiveVars.gap.md))).toBe('24px')
    expect(box.style.getPropertyValue(customPropertyName(gapResponsiveVars.gapX.initial))).toBe('4px')
    expect(box.style.getPropertyValue(customPropertyName(gapResponsiveVars.gapX.lg))).toBe('2rem')
    expect(box.style.getPropertyValue(customPropertyName(gapResponsiveVars.gapY.sm))).toBe('12px')
    expect(box.style.getPropertyValue(customPropertyName(gapResponsiveVars.gapY.xl))).toBe('16px')
  })
})
