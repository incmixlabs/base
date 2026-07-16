import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, it } from 'vitest'
import { Switch, SwitchSegmented } from './Switch'
import { expectClassTokens } from './test-utils'

afterEach(() => {
  cleanup()
})

const switchSizeCases = [
  {
    size: 'xs',
    root: ['h-4', 'w-7'],
    thumb: ['h-3', 'w-3', 'data-[checked]:translate-x-3'],
  },
  {
    size: 'sm',
    root: ['h-5', 'w-9'],
    thumb: ['h-4', 'w-4', 'data-[checked]:translate-x-4'],
  },
  {
    size: 'md',
    root: ['h-6', 'w-11'],
    thumb: ['h-5', 'w-5', 'data-[checked]:translate-x-5'],
  },
  {
    size: 'lg',
    root: ['h-7', 'w-14'],
    thumb: ['h-6', 'w-6', 'data-[checked]:translate-x-7'],
  },
] as const

describe('Switch', () => {
  it('uses semantic checked and unchecked colors', () => {
    render(<Switch color="success" variant="soft" highContrast size="sm" data-testid="switch" />)

    const switchControl = screen.getByTestId('switch')

    expectClassTokens(switchControl.className, [
      '[&:not([data-checked])]:[background-color:var(--color-neutral-border-subtle)]',
      '[&:not([data-checked])]:[border-color:var(--color-neutral-border-subtle)]',
      'data-[checked]:bg-success-solid',
      'data-[checked]:[border-color:var(--color-success-solid)]',
      'focus-visible:[outline-color:var(--color-success-solid-alpha)]',
      'rounded-full',
      'af-high-contrast',
      'saturate-[1.2]',
    ])
  })

  it('uses neutral checked colors with dark-mode variants', () => {
    render(<Switch color="neutral" defaultChecked data-testid="switch" />)

    const switchControl = screen.getByTestId('switch')

    expectClassTokens(switchControl.className, [
      'data-[checked]:[background-color:var(--color-neutral-border)]',
      'dark:data-[checked]:[background-color:color-mix(in_oklch,var(--color-neutral-border)_72%,white)]',
      'data-[checked]:[border-color:var(--color-neutral-border)]',
      'dark:data-[checked]:[border-color:color-mix(in_oklch,var(--color-neutral-border)_72%,white)]',
    ])
  })

  it.each(switchSizeCases)('uses static size utilities for $size', ({ size, root, thumb: thumbTokens }) => {
    render(<Switch size={size} data-testid="switch" />)

    const switchControl = screen.getByTestId('switch')
    const thumb = switchControl.querySelector('[data-slot="thumb"],span')

    expectClassTokens(switchControl.className, root)
    expectClassTokens(thumb?.className, ['bg-light-surface', ...thumbTokens])
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
