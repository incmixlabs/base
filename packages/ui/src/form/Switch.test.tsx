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
  it('uses token-backed size utilities and semantic checked colors', () => {
    render(<Switch color="success" variant="soft" highContrast size="sm" data-testid="switch" />)

    const switchControl = screen.getByTestId('switch')

    expectClassTokens(switchControl.className, [
      '[--sw-root-height:var(--component-switch-size-sm-root-height,1.25rem)]',
      '[--sw-root-width:var(--component-switch-size-sm-root-width,2.25rem)]',
      '[--sw-thumb-size:var(--component-switch-size-sm-thumb-size,1rem)]',
      '[--sw-thumb-translate:var(--component-switch-size-sm-thumb-translate,1rem)]',
      'bg-neutral-soft',
      'data-[checked]:bg-success-solid',
      'data-[checked]:[border-color:var(--color-success-primary)]',
      'focus-visible:[outline-color:var(--color-success-primary-alpha)]',
      'rounded-full',
      'af-high-contrast',
      'saturate-[1.2]',
    ])
    expect(switchControl.className).not.toContain('radius_radiusStyleVariants')

    const thumb = switchControl.querySelector('[data-slot="thumb"],span')
    expectClassTokens(thumb?.className, [
      'bg-light-surface',
      'h-[var(--sw-thumb-size)]',
      'w-[var(--sw-thumb-size)]',
      'data-[checked]:translate-x-[var(--sw-thumb-translate)]',
    ])
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
