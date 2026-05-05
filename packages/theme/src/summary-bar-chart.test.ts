import { describe, expect, it } from 'vitest'
import { createSummaryBarChartModel } from './summary-bar-chart.js'

describe('createSummaryBarChartModel', () => {
  it('splits values into primary and secondary stacked segments', () => {
    const model = createSummaryBarChartModel([
      { label: '00:00', value: 10, secondary: 3 },
      { label: '06:00', value: 5 },
    ])

    expect(model.domainMax).toBe(10)
    expect(model.bins).toMatchObject([
      {
        label: '00:00',
        value: 10,
        primary: 7,
        secondary: 3,
      },
      {
        label: '06:00',
        value: 5,
        primary: 5,
        secondary: 0,
      },
    ])
  })

  it('sanitizes non-finite values and clamps secondary into the total', () => {
    const model = createSummaryBarChartModel([
      { label: 'Invalid', value: Number.NaN, secondary: 2 },
      { label: 'Overflow', value: 4, secondary: 20 },
      { label: 'Negative', value: -1, secondary: Number.POSITIVE_INFINITY },
    ])

    expect(model.domainMax).toBe(4)
    expect(model.bins).toMatchObject([
      { label: 'Invalid', value: 0, primary: 0, secondary: 0 },
      { label: 'Overflow', value: 4, primary: 0, secondary: 4 },
      { label: 'Negative', value: 0, primary: 0, secondary: 0 },
    ])
  })
})
