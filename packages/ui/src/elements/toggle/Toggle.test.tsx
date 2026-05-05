import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { SemanticColor } from '@/theme/props/color.prop'
import { Toggle, ToggleGroup } from './Toggle'
import { toggleColorVariants, toggleSizeVariants } from './Toggle.css'

afterEach(() => {
  cleanup()
})

describe('Toggle', () => {
  it('normalizes whitespace around color and variant', () => {
    render(
      <Toggle aria-label="Test" color={' info ' as any} variant={' solid ' as any}>
        <span>Icon</span>
      </Toggle>,
    )

    const button = screen.getByRole('button', { name: 'Test' })
    expect(button.className).toContain(toggleColorVariants.info.solid)
  })

  it('falls back to primary color and variant for invalid values', () => {
    render(
      <Toggle aria-label="Test" color={'not-a-color' as any} variant={'invalid' as any}>
        <span>Icon</span>
      </Toggle>,
    )

    const button = screen.getByRole('button', { name: 'Test' })
    expect(button.className).toContain(toggleColorVariants[SemanticColor.primary].soft)
  })

  it('falls back to default size for invalid values', () => {
    render(
      <Toggle aria-label="Test" size={'9' as any}>
        <span>Icon</span>
      </Toggle>,
    )

    const button = screen.getByRole('button', { name: 'Test' })
    expect(button.className).toContain(toggleSizeVariants.md)
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
    expect(button.className).toContain(toggleColorVariants[SemanticColor.slate].solid)
    expect(button.className).toContain(toggleSizeVariants.xs)
  })
})
