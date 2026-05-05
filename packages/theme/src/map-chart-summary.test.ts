import { describe, expect, it } from 'vitest'
import { createMapChartSummaryModel } from './map-chart-summary.js'

describe('createMapChartSummaryModel', () => {
  it('returns backend-safe summary rows with concrete colors and labels', () => {
    const model = createMapChartSummaryModel({
      title: 'Top countries',
      valueFormat: 'percent',
      locations: [
        { id: 'ca', name: 'Canada', value: 26, color: 'chart2' },
        { id: 'us', name: 'United States', value: 34, color: 'chart1' },
        { id: 'br', name: 'Brazil', value: 9, color: 'chart3' },
      ],
      summaryLimit: 2,
      otherLabel: 'Other countries',
    })

    expect(model.total).toBe(69)
    expect(model.totalLabel).toBe('69%')
    expect(model.items.map(item => [item.name, item.valueLabel, item.color])).toEqual([
      ['United States', '34%', '#f97316'],
      ['Canada', '26%', '#06b6d4'],
    ])
    expect(model.other).toMatchObject({
      label: 'Other countries',
      count: 1,
      total: 9,
      valueLabel: '9%',
      color: '#e5e7eb',
    })
    expect(model.summaryLabel).toBe('Top countries: United States 34%, Canada 26%, Brazil 9%')
  })

  it('lets browser or custom renderers provide their own color resolver', () => {
    const model = createMapChartSummaryModel({
      locations: [{ id: 'us', name: 'United States', value: 34, color: 'primary' }],
      resolveColor: ({ color, role }) => `var(--${color}-${role})`,
    })

    expect(model.items[0]?.color).toBe('var(--primary-fill)')
  })

  it('sanitizes non-finite values before sorting and totaling', () => {
    const model = createMapChartSummaryModel({
      locations: [
        { id: 'invalid', name: 'Invalid', value: Number.NaN },
        { id: 'valid', name: 'Valid', value: 2 },
        { id: 'infinite', name: 'Infinite', value: Number.POSITIVE_INFINITY },
      ],
      summaryLimit: 3,
    })

    expect(model.total).toBe(2)
    expect(model.allItems.map(item => [item.name, item.value])).toEqual([
      ['Valid', 2],
      ['Invalid', 0],
      ['Infinite', 0],
    ])
  })
})
