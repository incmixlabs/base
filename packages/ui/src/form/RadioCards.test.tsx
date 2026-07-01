import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { RadioCards } from './RadioCards'

afterEach(() => {
  cleanup()
})

function expectClassTokens(className: string | undefined, tokens: readonly string[]) {
  const classTokens = new Set((className ?? '').split(/\s+/).filter(Boolean))
  for (const token of tokens) {
    expect(classTokens).toContain(token)
  }
}

describe('RadioCards', () => {
  it('reflects the controlled value in the checked radio state', () => {
    render(
      <RadioCards.Root value="draft">
        <RadioCards.Item value="draft">Draft</RadioCards.Item>
        <RadioCards.Item value="published">Published</RadioCards.Item>
      </RadioCards.Root>,
    )

    expect(screen.getByRole('radio', { name: 'Draft' })).toBeChecked()
    expect(screen.getByRole('radio', { name: 'Published' })).not.toBeChecked()
  })

  it('uses card-specific indicator styles that respond to the parent checked state', () => {
    render(
      <RadioCards.Root value="draft" color="primary">
        <RadioCards.Item value="draft">Draft</RadioCards.Item>
      </RadioCards.Root>,
    )

    const radioCard = screen.getByRole('radio', { name: 'Draft' })
    const indicatorShell = radioCard.querySelector('span')

    expectClassTokens(radioCard.className, [
      'data-[checked]:bg-primary-soft',
      'data-[checked]:[border-color:var(--color-primary-primary)]',
      'data-[checked]:[box-shadow:0_0_0_2px_var(--color-primary-primary-alpha)]',
      'data-[checked]:hover:bg-primary-soft-hover',
    ])
    expectClassTokens(indicatorShell?.className, [
      'border-primary',
      'bg-primary-surface',
      'group-data-[checked]:bg-primary-solid',
      'group-data-[checked]:[border-color:var(--color-primary-primary)]',
    ])
    const radioCardTokens = new Set(radioCard.className.split(/\s+/).filter(Boolean))
    expect(radioCardTokens).not.toContain('surface-color-primary')
    expect(radioCardTokens).not.toContain('surface-variant-classic')
  })

  it('emits value changes when an enabled card is selected', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()

    render(
      <RadioCards.Root value="draft" onValueChange={onValueChange}>
        <RadioCards.Item value="draft">Draft</RadioCards.Item>
        <RadioCards.Item value="published">Published</RadioCards.Item>
      </RadioCards.Root>,
    )

    await user.click(screen.getByRole('radio', { name: 'Published' }))

    expect(onValueChange).toHaveBeenCalledWith('published')
  })

  it('normalizes item disabled before merging with root disabled state', () => {
    render(
      <RadioCards.Root disabled={'false' as any}>
        <RadioCards.Item value="standard" disabled={'false' as any}>
          Standard
        </RadioCards.Item>
      </RadioCards.Root>,
    )

    expect(screen.getByRole('radio', { name: 'Standard' })).not.toBeDisabled()
  })

  it('uses the shared spacing scale for gap values', () => {
    render(
      <RadioCards.Root gap={'7' as any} {...({ 'data-testid': 'radio-cards' } as any)}>
        <RadioCards.Item value="standard">Standard</RadioCards.Item>
      </RadioCards.Root>,
    )

    expect(screen.getByTestId('radio-cards')).toHaveClass('gap-7')
  })

  it('uses direct radio-card spacing and text classes', () => {
    render(
      <RadioCards.Root size="md" value="standard">
        <RadioCards.Item value="standard">Standard</RadioCards.Item>
      </RadioCards.Root>,
    )

    const radioCard = screen.getByRole('radio', { name: 'Standard' })
    const row = radioCard.querySelector('div')
    const content = row?.lastElementChild

    expectClassTokens(radioCard.className, ['box-border', 'p-4'])
    expectClassTokens(row?.className, ['gap-4'])
    expectClassTokens(content?.className, ['text-base', 'leading-6'])
  })

  it('keeps the xs radio indicator on the original direct size scale', () => {
    render(
      <RadioCards.Root size="xs" value="standard">
        <RadioCards.Item value="standard">Standard</RadioCards.Item>
      </RadioCards.Root>,
    )

    const radioCard = screen.getByRole('radio', { name: 'Standard' })
    const row = radioCard.querySelector('div')
    const content = row?.lastElementChild
    const indicatorShell = radioCard.querySelector('span')
    const indicatorInner = indicatorShell?.firstElementChild

    expectClassTokens(content?.className, ['text-xs', 'leading-4'])
    expectClassTokens(indicatorShell?.className, ['box-border', '[height:0.75rem]', '[width:0.75rem]'])
    expectClassTokens(indicatorInner?.className, [
      '[background-color:var(--color-light-primary)]',
      '[height:0.375rem]',
      '[width:0.375rem]',
    ])
  })
})
