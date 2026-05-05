import { describe, expect, it } from 'vitest'
import { matchesDateFilter } from './filtering'

describe('matchesDateFilter', () => {
  it('includes row values later on the selected range end day', () => {
    const row = {
      getValue: () => new Date(2026, 3, 20, 16, 45),
    }

    expect(
      matchesDateFilter(row, 'date', {
        from: new Date(2026, 3, 15),
        to: new Date(2026, 3, 20),
      }),
    ).toBe(true)
  })
})
