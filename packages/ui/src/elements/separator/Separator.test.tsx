import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { Separator } from './Separator'

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

describe('Separator', () => {
  it('renders a horizontal separator by default', () => {
    render(<Separator data-testid="separator" />)

    const separator = screen.getByTestId('separator')

    expect(separator).toHaveAttribute('role', 'separator')
    expect(separator).toHaveAttribute('aria-orientation', 'horizontal')
    expect(separator).toHaveAttribute('data-orientation', 'horizontal')
    expectClassTokens(separator.className, [
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
    expectNoClassTokens(separator.className, ['gap-4', 'h-4', 'my-4'])
  })

  it('renders children as separator label content', () => {
    render(<Separator data-testid="separator">OR</Separator>)

    const separator = screen.getByTestId('separator')

    expect(screen.getByText('OR')).toBeInTheDocument()
    expectClassTokens(separator.className, ['gap-4', 'h-4', 'my-4'])
  })

  it('does not use labelled layout for invisible conditional children', () => {
    render(<Separator data-testid="separator">{false && 'OR'}</Separator>)

    const separator = screen.getByTestId('separator')

    expectNoClassTokens(separator.className, ['gap-4', 'h-4', 'my-4'])
    expectClassTokens(separator.className, ['w-full', 'h-auto'])
  })

  it('can render as a decorative visual rule', () => {
    render(<Separator decorative data-testid="separator" />)

    const separator = screen.getByTestId('separator')

    expect(separator).toHaveAttribute('role', 'presentation')
    expect(separator).toHaveAttribute('aria-hidden', 'true')
    expect(separator).not.toHaveAttribute('aria-orientation')
    expect(separator).toHaveAttribute('data-orientation', 'horizontal')
  })

  it('keeps derived accessibility props non-overridable', () => {
    render(
      <Separator
        decorative
        role="separator"
        aria-hidden={false}
        aria-orientation="vertical"
        data-orientation="vertical"
        data-testid="separator"
      />,
    )

    const separator = screen.getByTestId('separator')

    expect(separator).toHaveAttribute('role', 'presentation')
    expect(separator).toHaveAttribute('aria-hidden', 'true')
    expect(separator).not.toHaveAttribute('aria-orientation')
    expect(separator).toHaveAttribute('data-orientation', 'horizontal')
  })

  it('applies vertical orientation and visual variants', () => {
    render(
      <Separator data-testid="separator" orientation="vertical" size="lg" color="primary" align="start">
        OR
      </Separator>,
    )

    const separator = screen.getByTestId('separator')

    expect(separator).toHaveAttribute('data-orientation', 'vertical')
    expect(separator).toHaveAttribute('aria-orientation', 'vertical')
    expectClassTokens(separator.className, [
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
    expectNoClassTokens(separator.className, [
      'before:bg-[color-mix(in_oklch,currentcolor_12%,transparent)]',
      'after:bg-[color-mix(in_oklch,currentcolor_12%,transparent)]',
    ])
  })
})
