import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { Spinner } from './Spinner'

afterEach(() => {
  cleanup()
})

function expectClassTokens(className: string | undefined, tokens: readonly string[]) {
  const classTokens = new Set((className ?? '').split(/\s+/).filter(Boolean))

  for (const token of tokens) {
    expect(classTokens).toContain(token)
  }
}

describe('Spinner', () => {
  it('renders the default spinner utility contract', () => {
    render(<Spinner size="sm" color="success" />)

    const root = screen.getByRole('status', { name: 'Loading' })
    const visual = root.querySelector('[aria-hidden="true"]')

    expectClassTokens(root.className, ['inline-flex', 'items-center', 'justify-center'])
    expectClassTokens(visual?.className, [
      'text-[var(--color-success-primary)]',
      'block',
      'box-border',
      'rounded-full',
      'border-2',
      'border-current',
      'border-r-transparent',
      'animate-[af-spinner-rotate_800ms_linear_infinite]',
      'h-8',
      'w-8',
    ])
    expect(root.querySelector('.sr-only')).toHaveTextContent('Loading...')
    expect(visual?.className).not.toContain('Spinner_')
  })

  it('renders code spinner brace delay classes', () => {
    render(<Spinner variant="code" size="xs" />)

    const root = screen.getByRole('status', { name: 'Loading' })
    const visual = root.querySelector('[aria-hidden="true"]')
    const braces = Array.from(root.querySelectorAll('[aria-hidden="true"] > span'))

    expectClassTokens(visual?.className, ['font-mono', 'font-bold', 'opacity-80', 'h-6', 'w-6', 'text-sm'])
    expectClassTokens(braces[0]?.className, [
      'animate-[af-spinner-brace-pulse_400ms_ease-in-out_infinite_alternate]',
      '[animation-delay:0ms]',
    ])
    expectClassTokens(braces[1]?.className, [
      'animate-[af-spinner-brace-pulse_400ms_ease-in-out_infinite_alternate]',
      '[animation-delay:300ms]',
    ])
  })

  it('renders ai spinner glyph classes', () => {
    render(<Spinner variant="ai" size="lg" color="light" />)

    const root = screen.getByRole('status', { name: 'Loading' })
    const visual = root.querySelector('[aria-hidden="true"]')
    const halo = root.querySelector('[aria-hidden="true"] > span')
    const glyphs = root.querySelectorAll('svg')

    expectClassTokens(visual?.className, [
      'text-[var(--color-light-contrast)]',
      'relative',
      'isolate',
      '[transform:translateZ(0)]',
      'h-16',
      'w-16',
    ])
    expectClassTokens(halo?.className, [
      'absolute',
      'inset-[-10%]',
      'rounded-full',
      'blur-[6px]',
      'animate-[af-spinner-sparkle-halo-pulse_1.8s_ease-in-out_infinite]',
    ])
    expectClassTokens(glyphs[0]?.getAttribute('class') ?? undefined, [
      'fill-current',
      'will-change-[transform,opacity]',
      'h-[82%]',
      'w-[82%]',
      'animate-[af-spinner-sparkle-rotate_3s_ease-in-out_infinite]',
    ])
    expectClassTokens(glyphs[1]?.getAttribute('class') ?? undefined, [
      'left-[8%]',
      'top-[3%]',
      'h-[32%]',
      'w-[32%]',
      'animate-[af-spinner-sparkle-pulse_2s_ease-in-out_infinite]',
    ])
  })
})
