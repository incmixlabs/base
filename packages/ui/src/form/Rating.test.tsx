import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { Rating, RatingItem } from './Rating'

afterEach(() => {
  cleanup()
})

function expectClassTokens(className: string | undefined, tokens: readonly string[]) {
  const classTokens = new Set((className ?? '').split(/\s+/).filter(Boolean))
  for (const token of tokens) {
    expect(classTokens).toContain(token)
  }
}

describe('Rating', () => {
  it('uses semantic color and token-backed sizing classes', () => {
    render(
      <Rating color="info" defaultValue={1} size="lg">
        <RatingItem />
        <RatingItem />
      </Rating>,
    )

    const rating = screen.getByRole('radiogroup')
    const [firstItem] = screen.getAllByRole('radio')

    expectClassTokens(rating.className, ['flex', 'outline-none', 'text-info'])
    expectClassTokens(rating.className, ['gap-[var(--af-rating-size-lg-gap,0.625rem)]'])
    expectClassTokens(firstItem.className, [
      'inline-flex',
      'h-[var(--af-rating-size-lg-icon-size,1.25rem)]',
      'w-[var(--af-rating-size-lg-icon-size,1.25rem)]',
      'focus-visible:[outline-color:var(--color-info-primary-alpha)]',
    ])
    expect(firstItem.className).not.toContain('Rating_ratingItemBase')
  })
})
