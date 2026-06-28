import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Tooltip } from './Tooltip'

function expectClassTokens(className: string | undefined, tokens: readonly string[]) {
  const classTokens = new Set((className ?? '').split(/\s+/).filter(Boolean))
  for (const token of tokens) {
    expect(classTokens).toContain(token)
  }
}

describe('Tooltip', () => {
  it('renders the floating surface class contract', () => {
    render(
      <Tooltip.Root defaultOpen>
        <Tooltip.Trigger render={<button type="button">Trigger</button>} />
        <Tooltip.Content size="md" maxWidth="lg">
          <Tooltip.Arrow />
          Tooltip body
        </Tooltip.Content>
      </Tooltip.Root>,
    )

    const popup = screen.getByText('Tooltip body').closest('[class]')
    expect(popup).not.toBeNull()
    expectClassTokens(popup?.className, [
      'relative',
      'box-border',
      'overflow-visible',
      'rounded-[var(--element-border-radius)]',
      '[min-width:var(--anchor-width)]',
      'px-3',
      'py-1',
      'text-base',
      'leading-6',
      'max-w-[32rem]',
      'bg-inverse-solid',
      'border-[var(--color-inverse-text)]',
      'text-inverse-contrast',
    ])

    const arrow = document.body.querySelector('.surface-floating-arrow')
    expect(arrow).not.toBeNull()
    expectClassTokens(arrow?.className, ['[fill:var(--color-inverse-primary)]', '[color:var(--color-inverse-text)]'])
  })
})
