import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { Card } from './Card'
import { Inset } from './Inset'

afterEach(() => {
  cleanup()
})

describe('Inset', () => {
  it('uses shared responsive padding helpers for content padding', () => {
    render(
      <Card.Root data-testid="card">
        <Inset data-testid="inset" px="current" py="0">
          Content
        </Inset>
      </Card.Root>,
    )

    const inset = screen.getByTestId('inset')

    expect(inset.className).not.toContain('px-current')
    expect(inset.className).not.toContain('py-0')
    expect(inset.style.paddingTop).toBe('0px')
    expect(inset.style.paddingRight).toBe('var(--inset-padding, 0px)')
    expect(inset.style.paddingBottom).toBe('0px')
    expect(inset.style.paddingLeft).toBe('var(--inset-padding, 0px)')
  })

  it('supports radix clip semantics', () => {
    render(
      <Card.Root data-testid="card">
        <Inset data-testid="inset" clip="padding-box" side="top" pb="current">
          Content
        </Inset>
      </Card.Root>,
    )

    const inset = screen.getByTestId('inset')
    expect(inset.style.marginTop).toContain('var(--inset-padding')
    expect(inset.getAttribute('style')).toContain('--inset-padding')
  })
})
