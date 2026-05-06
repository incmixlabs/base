import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { RadioCards } from './RadioCards'

afterEach(() => {
  cleanup()
})

describe('RadioCards', () => {
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

    expect(screen.getByTestId('radio-cards')).toHaveClass('gap-8')
  })
})
