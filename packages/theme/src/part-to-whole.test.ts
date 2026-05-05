import { describe, expect, it } from 'vitest'
import { createPartToWholeModel } from './part-to-whole.js'

describe('createPartToWholeModel', () => {
  it('normalizes values against their total', () => {
    const model = createPartToWholeModel([
      { label: 'A', value: 30 },
      { label: 'B', value: 70 },
    ])

    expect(model.total).toBe(100)
    expect(model.items.map(item => item.percentage)).toEqual([30, 70])
    expect(model.items.map(item => item.barPercentage)).toEqual([30, 70])
  })

  it('uses explicit totals and minimum visible percentages for small positive values', () => {
    const model = createPartToWholeModel([{ label: 'A', value: 1 }], {
      total: 200,
      minVisiblePercentage: 2,
    })

    expect(model.total).toBe(200)
    expect(model.items.map(item => item.percentage)).toEqual([0.5])
    expect(model.items.map(item => item.barPercentage)).toEqual([2])
  })

  it('marks null and invalid values as missing while clamping negative values', () => {
    const model = createPartToWholeModel([
      { label: 'A', value: null },
      { label: 'B', value: Number.NaN },
      { label: 'C', value: -10 },
    ])

    expect(model.total).toBe(0)
    expect(model.items.map(item => item.hasValue)).toEqual([false, false, true])
    expect(model.items.map(item => item.value)).toEqual([0, 0, 0])
  })
})
