import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Popover } from './Popover'

function expectClassTokens(className: string | undefined, tokens: readonly string[]) {
  const classTokens = new Set((className ?? '').split(/\s+/).filter(Boolean))
  for (const token of tokens) {
    expect(classTokens).toContain(token)
  }
}

describe('Popover', () => {
  it('renders the floating surface class contract', () => {
    render(
      <Popover.Root defaultOpen>
        <Popover.Trigger>Open</Popover.Trigger>
        <Popover.Content size="lg" maxWidth="md">
          <Popover.Arrow />
          Popover body
        </Popover.Content>
      </Popover.Root>,
    )

    const trigger = screen.getByRole('button', { name: 'Open' })
    expectClassTokens(trigger.className, [
      'outline-none',
      'focus-visible:outline-solid',
      'focus-visible:outline-2',
      'focus-visible:outline-offset-2',
      'focus-visible:outline-primary',
    ])

    const popup = screen.getByText('Popover body').closest('[class]')
    expect(popup).not.toBeNull()
    expectClassTokens(popup?.className, [
      'relative',
      'box-border',
      'overflow-visible',
      'rounded-[var(--element-border-radius)]',
      '[min-width:var(--popover-trigger-width,var(--radix-popover-trigger-width))]',
      'px-3.5',
      'py-[0.4375rem]',
      'text-lg',
      'leading-[1.625rem]',
      'max-w-[28rem]',
      'bg-neutral-surface',
      'border-neutral',
      'text-neutral',
      '[box-shadow:var(--shadow-xs)]',
    ])

    const arrow = document.body.querySelector('.surface-floating-arrow')
    expect(arrow).not.toBeNull()
    expectClassTokens(arrow?.className, ['[fill:var(--color-neutral-surface)]', '[color:var(--color-neutral-border)]'])
  })
})
