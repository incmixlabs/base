import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { gapResponsiveClasses, gapResponsiveVars } from '@/theme/helpers/gap-responsive.css'
import { flexByDirection } from './Flex.css'
import { Flex } from './Flex'

afterEach(() => {
  cleanup()
})

function customPropertyName(value: string): string {
  const match = /^var\((--[^)]+)\)$/.exec(value)
  return match?.[1] ?? value
}

describe('Flex', () => {
  it('normalizes enum props case-insensitively and resolves token gaps', () => {
    render(
      <Flex data-testid="flex" direction={' COLUMN ' as any} gap={' 4 ' as any}>
        <span>One</span>
      </Flex>,
    )

    const flex = screen.getByTestId('flex')

    expect(flex.className).toContain(flexByDirection.column)
    expect(flex.style.gap).toBe('16px')
  })

  it('preserves custom gap strings', () => {
    render(
      <Flex data-testid="flex" gap={' 2rem ' as any}>
        <span>One</span>
      </Flex>,
    )

    expect(screen.getByTestId('flex').style.gap).toBe('2rem')
  })

  it('preserves responsive custom gap values', () => {
    render(
      <Flex
        data-testid="flex"
        gap={{ initial: '2rem', md: '4' }}
        gapX={{ initial: '1', lg: '24px' }}
        gapY={{ sm: '12px', xl: '5' }}
      >
        <span>One</span>
      </Flex>,
    )

    const flex = screen.getByTestId('flex')

    expect(flex.className).toContain(gapResponsiveClasses.gap)
    expect(flex.className).toContain(gapResponsiveClasses.gapX)
    expect(flex.className).toContain(gapResponsiveClasses.gapY)
    expect(flex.style.getPropertyValue(customPropertyName(gapResponsiveVars.gap.initial))).toBe('2rem')
    expect(flex.style.getPropertyValue(customPropertyName(gapResponsiveVars.gap.md))).toBe('16px')
    expect(flex.style.getPropertyValue(customPropertyName(gapResponsiveVars.gapX.initial))).toBe('4px')
    expect(flex.style.getPropertyValue(customPropertyName(gapResponsiveVars.gapX.lg))).toBe('24px')
    expect(flex.style.getPropertyValue(customPropertyName(gapResponsiveVars.gapY.sm))).toBe('12px')
    expect(flex.style.getPropertyValue(customPropertyName(gapResponsiveVars.gapY.xl))).toBe('24px')
  })
})
