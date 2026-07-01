import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { SemanticColor } from '@/theme/props/color.prop'
import { Toggle, ToggleGroup } from './Toggle'

afterEach(() => {
  cleanup()
})

function expectClassTokens(className: string | undefined, tokens: readonly string[]) {
  const classTokens = new Set((className ?? '').split(/\s+/).filter(Boolean))
  for (const token of tokens) {
    expect(classTokens).toContain(token)
  }
}

describe('Toggle', () => {
  it('normalizes whitespace around color and variant', () => {
    render(
      <Toggle aria-label="Test" color={' info ' as any} variant={' solid ' as any}>
        <span>Icon</span>
      </Toggle>,
    )

    const button = screen.getByRole('button', { name: 'Test' })
    expectClassTokens(button.className, [
      'bg-transparent',
      '[color:var(--color-info-text)]',
      '[border-color:var(--color-info-border)]',
      'hover:[background-color:var(--color-info-soft)]',
      'aria-[pressed=true]:[background-color:var(--color-info-solid)]',
    ])
  })

  it('falls back to primary color and variant for invalid values', () => {
    render(
      <Toggle aria-label="Test" color={'not-a-color' as any} variant={'invalid' as any}>
        <span>Icon</span>
      </Toggle>,
    )

    const button = screen.getByRole('button', { name: 'Test' })
    expectClassTokens(button.className, [
      'bg-transparent',
      `[color:var(--color-${SemanticColor.primary}-text)]`,
      `[border-color:var(--color-${SemanticColor.primary}-border)]`,
      `hover:[background-color:var(--color-${SemanticColor.primary}-soft-hover)]`,
      `aria-[pressed=true]:[background-color:var(--color-${SemanticColor.primary}-soft)]`,
    ])
  })

  it('falls back to default size for invalid values', () => {
    render(
      <Toggle aria-label="Test" size={'9' as any}>
        <span>Icon</span>
      </Toggle>,
    )

    const button = screen.getByRole('button', { name: 'Test' })
    expectClassTokens(button.className, ['h-8', 'min-w-8', 'px-3', 'text-base', 'gap-2', '[&_svg]:h-4'])
  })
})

describe('ToggleGroup', () => {
  it('renders group items using inherited group styling', () => {
    render(
      <ToggleGroup.Root value={['bold']}>
        <ToggleGroup.Item value="bold" aria-label="Bold">
          B
        </ToggleGroup.Item>
      </ToggleGroup.Root>,
    )

    const button = screen.getByRole('button', { name: 'Bold' })
    expectClassTokens(button.className, [
      'h-6',
      'min-w-6',
      'px-2',
      `[color:var(--color-${SemanticColor.slate}-text)]`,
      `[border-color:var(--color-${SemanticColor.slate}-border)]`,
      `aria-[pressed=true]:[background-color:var(--color-${SemanticColor.slate}-solid)]`,
    ])
  })

  it('applies vertical flush classes for grouped items', () => {
    render(
      <ToggleGroup.Root orientation="vertical" defaultValue={['left']} multiple={false}>
        <ToggleGroup.Item value="left">Left</ToggleGroup.Item>
        <ToggleGroup.Item value="center">Center</ToggleGroup.Item>
      </ToggleGroup.Root>,
    )

    const buttons = screen.getAllByRole('button')
    expectClassTokens(buttons[1]?.className, [
      '[&:not(:first-child)]:-mt-px',
      '[&:last-child:not(:first-child)]:rounded-t-none',
    ])
  })
})
