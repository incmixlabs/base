import { describe, expect, it } from 'vitest'
import { createSummaryBarChartModel } from './summary-bar-chart.js'
import { createSummaryBarChartSpec } from './summary-bar-chart-spec.js'

const colors = {
  foreground: '#111827',
  muted: '#64748b',
  border: '#cbd5e1',
  primaryFill: '#0d9488',
  secondaryFill: '#dc2626',
}

describe('createSummaryBarChartSpec', () => {
  it('creates deterministic stacked G2 interval specs from the shared model', () => {
    const model = createSummaryBarChartModel([
      { label: '00:00', value: 10, secondary: 3 },
      { label: '06:00', value: 5 },
    ])
    const spec = createSummaryBarChartSpec(model, {
      colors,
      primaryLabel: 'Requests',
      secondaryLabel: 'Errors',
    })

    expect(spec).toMatchObject({
      type: 'interval',
      encode: { x: 'label', y: 'value', color: 'segment' },
      transform: [{ type: 'stackY' }],
      scale: {
        y: { domainMax: 10, nice: true },
        color: { range: ['#0d9488', '#dc2626'] },
      },
      style: { radiusTopLeft: 2, radiusTopRight: 2, maxWidth: 18 },
    })
    expect(spec.data).toEqual([
      { label: '00:00', segment: 'Requests', value: 7, total: 10 },
      { label: '00:00', segment: 'Errors', value: 3, total: 10 },
      { label: '06:00', segment: 'Requests', value: 5, total: 5 },
      { label: '06:00', segment: 'Errors', value: 0, total: 5 },
    ])
  })
})
