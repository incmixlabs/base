import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { Rating, RatingItem } from './Rating'
import { expectClassTokens } from './test-utils'

afterEach(() => {
  cleanup()
})

describe('Rating', () => {
  it('uses semantic color and static sizing utilities', () => {
    render(
      <Rating color="info" defaultValue={1} size="lg">
        <RatingItem />
        <RatingItem />
      </Rating>,
    )

    const rating = screen.getByRole('radiogroup')
    const [firstItem] = screen.getAllByRole('radio')

    expectClassTokens(rating.className, ['flex', 'outline-none', 'text-info'])
    expectClassTokens(rating.className, ['gap-2.5'])
    expectClassTokens(firstItem.className, [
      'inline-flex',
      'h-5',
      'w-5',
      'focus-visible:[outline-color:var(--color-info-solid-alpha)]',
    ])
    expect(firstItem.className).not.toContain('Rating_ratingItemBase')
  })
})
