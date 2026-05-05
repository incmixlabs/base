import { describe, expect, it } from 'vitest'
import { comparePrioritySortableValues } from './table-sorting'

describe('comparePrioritySortableValues', () => {
  it('sorts known priority values by rank', () => {
    expect(comparePrioritySortableValues('none', 'low')).toBeLessThan(0)
    expect(comparePrioritySortableValues('critical', 'high')).toBeGreaterThan(0)
    expect(comparePrioritySortableValues('med', 'medium')).toBe(0)
  })

  it('falls back to text comparison when either value is not a sortable priority', () => {
    expect(
      comparePrioritySortableValues(undefined, 'low', {
        leftFallbackText: 'alpha',
        rightFallbackText: 'beta',
      }),
    ).toBeLessThan(0)

    expect(
      comparePrioritySortableValues('high', null, {
        leftFallbackText: 'zeta',
        rightFallbackText: 'eta',
      }),
    ).toBeGreaterThan(0)
  })
})
