import { describe, expect, it } from 'vitest'
import { createPartToWholeChartModel } from './part-to-whole-chart.js'

describe('createPartToWholeChartModel', () => {
  it('adds formatted labels and backend-safe concrete colors to normalized items', () => {
    const model = createPartToWholeChartModel(
      [
        { label: 'United States', value: 34 },
        { label: 'Canada', value: 26 },
      ],
      {
        title: 'Top countries',
        valueFormat: 'percent',
      },
    )

    expect(model.total).toBe(60)
    expect(model.summaryLabel).toBe('Top countries: United States 34%, Canada 26%')
    expect(model.items.map(item => item.valueLabel)).toEqual(['34%', '26%'])
    expect(model.items.map(item => item.fillColor)).toEqual(['#f97316', '#06b6d4'])
  })

  it('lets browser renderers provide CSS variable color resolution from the same model', () => {
    const model = createPartToWholeChartModel([{ label: 'A', value: 1 }], {
      resolveColor: ({ color, fallbackColor }) => `var(--${color || fallbackColor})`,
    })

    expect(model.items.map(item => item.fillColor)).toEqual(['var(--chart1)'])
  })

  it('passes custom color strings through for renderer-specific values', () => {
    const model = createPartToWholeChartModel([{ label: 'Custom', value: 1, color: 'rebeccapurple' }])

    expect(model.items.map(item => item.fillColor)).toEqual(['rebeccapurple'])
  })
})
