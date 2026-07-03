import '@testing-library/jest-dom/vitest'
import { cleanup, render } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { Slider } from './Slider'

afterEach(() => {
  cleanup()
})

function expectClassTokens(className: string | undefined, tokens: readonly string[]) {
  const classTokens = new Set((className ?? '').split(/\s+/).filter(Boolean))
  for (const token of tokens) {
    expect(classTokens).toContain(token)
  }
}

describe('Slider', () => {
  it('uses semantic color, radius, and static sizing utilities', () => {
    const { container } = render(<Slider color="info" defaultValue={[40]} radius="lg" size="md" variant="solid" />)

    const root = container.querySelector('[data-slot="slider"]')
    const track = container.querySelector('[data-slot="slider-track"]')
    const indicator = container.querySelector('[data-slot="slider-indicator"]')
    const thumb = container.querySelector('[data-slot="slider-thumb"]')

    expectClassTokens(root?.className, ['relative', 'flex', 'w-full'])
    expectClassTokens(track?.className, [
      'relative',
      'overflow-hidden',
      'rounded-lg',
      'h-2',
      'border-0',
      'bg-[var(--color-info-solid-alpha)]',
    ])
    expectClassTokens(indicator?.className, ['absolute', 'rounded-lg', 'bg-info-solid', 'h-full'])
    expectClassTokens(thumb?.className, [
      'block',
      'border-2',
      'bg-light-surface',
      'h-5',
      'w-5',
      '[border-color:var(--color-info-solid)]',
      'focus-visible:[outline-color:var(--color-info-solid-alpha)]',
    ])
  })
})
