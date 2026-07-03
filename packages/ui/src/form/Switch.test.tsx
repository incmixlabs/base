import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { Switch, SwitchSegmented } from './Switch'

afterEach(() => {
  cleanup()
})

function expectClassTokens(className: string | undefined, tokens: readonly string[]) {
  const classTokens = new Set((className ?? '').split(/\s+/).filter(Boolean))
  for (const token of tokens) {
    expect(classTokens).toContain(token)
  }
}

describe('Switch', () => {
  it('uses static size utilities and semantic checked colors', () => {
    render(<Switch color="success" variant="soft" highContrast size="sm" data-testid="switch" />)

    const switchControl = screen.getByTestId('switch')

    expectClassTokens(switchControl.className, [
      'h-5',
      'w-9',
      'bg-neutral-soft',
      'data-[checked]:bg-success-solid',
      'data-[checked]:[border-color:var(--color-success-solid)]',
      'focus-visible:[outline-color:var(--color-success-solid-alpha)]',
      'rounded-full',
      'af-high-contrast',
      'saturate-[1.2]',
    ])

    const thumb = switchControl.querySelector('[data-slot="thumb"],span')
    expectClassTokens(thumb?.className, ['bg-light-surface', 'h-4', 'w-4', 'data-[checked]:translate-x-4'])
  })

  it('uses semantic label classes for segmented switches', () => {
    render(<SwitchSegmented color="primary" uncheckedLabel="Off" checkedLabel="On" aria-label="Power" />)

    expectClassTokens(screen.getByText('Off').className, [
      'text-primary',
      'peer-data-[checked]:text-[color-mix(in_oklch,var(--color-primary-contrast)_80%,transparent)]',
    ])
    expectClassTokens(screen.getByText('On').className, [
      'text-[color-mix(in_oklch,var(--color-primary-text)_55%,transparent)]',
      'peer-data-[checked]:text-primary',
    ])
  })
})
