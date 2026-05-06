import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { flexByDirection } from './Flex.css'
import { Flex } from './Flex'

afterEach(() => {
  cleanup()
})

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
})
