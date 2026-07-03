import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { flexByDirection } from './Flex.classes'
import { Flex } from './Flex'

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

describe('Flex', () => {
  it('normalizes enum props case-insensitively and maps token gaps to utilities', () => {
    render(
      <Flex data-testid="flex" direction={' COLUMN ' as any} gap={' 4 ' as any}>
        <span>One</span>
      </Flex>,
    )

    const flex = screen.getByTestId('flex')

    expect(flex.className).toContain(flexByDirection.column)
    expect(flex).toHaveClass('gap-4')
    expect(flex.style.gap).toBe('')
  })

  it('ignores unsupported arbitrary gap strings', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    render(
      <Flex data-testid="flex" gap={' 2rem ' as any}>
        <span>One</span>
      </Flex>,
    )

    const flex = screen.getByTestId('flex')

    expect(flex.className).not.toContain('2rem')
    expect(flex.style.gap).toBe('')
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('[Flex] Ignored unsupported gap value(s): 2rem'))
  })

  it('maps responsive token gaps and skips unsupported breakpoint values', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    render(
      <Flex
        data-testid="flex"
        gap={{ initial: '2rem' as any, md: '4' }}
        gapX={{ initial: '1', lg: '24px' as any }}
        gapY={{ sm: '3', xl: '5' }}
      >
        <span>One</span>
      </Flex>,
    )

    const flex = screen.getByTestId('flex')

    expect(flex).toHaveClass('md:gap-4', 'gap-x-1', 'sm:gap-y-3', 'xl:gap-y-5')
    expect(flex.className).not.toContain('2rem')
    expect(flex.className).not.toContain('24px')
    expect(flex.getAttribute('style')).toBeNull()
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('[Flex] Ignored unsupported gap value(s): initial:2rem'))
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('[Flex] Ignored unsupported gapX value(s): lg:24px'))
  })
})
