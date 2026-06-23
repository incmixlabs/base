import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { RadioCards } from './RadioCards'
import { radioCardIndicatorColorVariants, radioCardRootColorVariants } from './radio-cards.css'

afterEach(() => {
  cleanup()
})

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

    expect(radioCard).toHaveClass(radioCardRootColorVariants.primary)
    expect(indicatorShell).toHaveClass(radioCardIndicatorColorVariants.primary)
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
})
