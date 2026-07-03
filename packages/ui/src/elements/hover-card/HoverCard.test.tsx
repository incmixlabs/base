import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { floatingSurfaceElevation } from '../surface/surface.class'
import { HoverCard } from './HoverCard'

afterEach(() => {
  cleanup()
})

function expectClassTokens(className: string | undefined, tokens: readonly string[]) {
  const classTokens = new Set((className ?? '').split(/\s+/).filter(Boolean))
  for (const token of tokens) {
    expect(classTokens).toContain(token)
  }
}

describe('HoverCard', () => {
  it('renders the shared floating surface class contract', () => {
    render(
      <HoverCard.Root defaultOpen>
        <HoverCard.Trigger>Open</HoverCard.Trigger>
        <HoverCard.Content size="md" maxWidth="md">
          Hover card body
        </HoverCard.Content>
      </HoverCard.Root>,
    )

    const popup = screen.getByText('Hover card body').closest('[class]')
    expect(popup).not.toBeNull()
    expectClassTokens(popup?.className, [
      'relative',
      'box-border',
      'overflow-visible',
      'rounded-[var(--element-border-radius)]',
      'border',
      'border-solid',
      'px-3',
      'py-1',
      'text-base',
      'leading-6',
      'max-w-[28rem]',
      'bg-neutral-surface',
      'border-neutral',
      'text-neutral',
      floatingSurfaceElevation,
    ])
    expect(popup?.className).not.toContain('surface-color-')
    expect(popup?.className).not.toContain('surface-variant-')
  })

  it('normalizes invalid runtime size values before applying size classes', () => {
    render(
      <HoverCard.Root defaultOpen>
        <HoverCard.Trigger>Open</HoverCard.Trigger>
        <HoverCard.Content size={'huge' as any}>Hover card body</HoverCard.Content>
      </HoverCard.Root>,
    )

    const popup = screen.getByText('Hover card body').closest('[class]')
    expect(popup).not.toBeNull()
    expectClassTokens(popup?.className, ['px-3', 'py-1', 'text-base', 'leading-6'])
  })
})
