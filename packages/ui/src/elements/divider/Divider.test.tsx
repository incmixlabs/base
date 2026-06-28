import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { Divider } from './Divider'

function expectClassTokens(className: string | undefined, tokens: readonly string[]) {
  const classTokens = new Set((className ?? '').split(/\s+/).filter(Boolean))
  for (const token of tokens) {
    expect(classTokens).toContain(token)
  }
}

function expectNoClassTokens(className: string | undefined, tokens: readonly string[]) {
  const classTokens = new Set((className ?? '').split(/\s+/).filter(Boolean))
  for (const token of tokens) {
    expect(classTokens).not.toContain(token)
  }
}

afterEach(() => {
  cleanup()
})

describe('Divider', () => {
  it('renders a horizontal divider by default', () => {
    render(<Divider data-testid="divider" />)

    const divider = screen.getByTestId('divider')

    expect(divider).toHaveAttribute('role', 'separator')
    expect(divider).toHaveAttribute('aria-orientation', 'horizontal')
    expect(divider).toHaveAttribute('data-orientation', 'horizontal')
    expectClassTokens(divider.className, [
      'flex',
      'items-center',
      'self-stretch',
      'before:content-[""]',
      'after:content-[""]',
      'before:bg-[color-mix(in_oklch,currentcolor_12%,transparent)]',
      'after:bg-[color-mix(in_oklch,currentcolor_12%,transparent)]',
      'flex-row',
      'w-full',
      'h-auto',
      'before:w-full',
      'after:w-full',
      'before:h-[0.125rem]',
      'after:h-[0.125rem]',
    ])
    expectNoClassTokens(divider.className, ['gap-4', 'h-4', 'my-4'])
  })

  it('renders children as divider label content', () => {
    render(<Divider data-testid="divider">OR</Divider>)

    const divider = screen.getByTestId('divider')

    expect(screen.getByText('OR')).toBeInTheDocument()
    expectClassTokens(divider.className, ['gap-4', 'h-4', 'my-4'])
  })

  it('applies vertical orientation and visual variants', () => {
    render(
      <Divider data-testid="divider" orientation="vertical" size="lg" color="primary" align="start">
        OR
      </Divider>,
    )

    const divider = screen.getByTestId('divider')

    expect(divider).toHaveAttribute('data-orientation', 'vertical')
    expect(divider).toHaveAttribute('aria-orientation', 'vertical')
    expectClassTokens(divider.className, [
      'flex-col',
      'w-4',
      'mx-4',
      'before:h-full',
      'after:h-full',
      'before:w-[0.5rem]',
      'after:w-[0.5rem]',
      'before:bg-primary-solid',
      'after:bg-primary-solid',
      'before:hidden',
    ])
    expectNoClassTokens(divider.className, [
      'before:bg-[color-mix(in_oklch,currentcolor_12%,transparent)]',
      'after:bg-[color-mix(in_oklch,currentcolor_12%,transparent)]',
    ])
  })
})
