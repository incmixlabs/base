import { describe, expect, it } from 'vitest'
import { createMapChartModel, type MapChartFeature } from './map-chart-model.js'
import { createMapChartSpec } from './map-chart-spec.js'

const feature: MapChartFeature = {
  type: 'Feature',
  id: 'US',
  properties: { name: 'United States' },
  geometry: {
    type: 'Polygon',
    coordinates: [
      [
        [0, 0],
        [1, 0],
        [1, 1],
        [0, 0],
      ],
    ],
  },
}

describe('createMapChartSpec', () => {
  it('creates a deterministic G2 geoPath spec from a map model', () => {
    const model = createMapChartModel({
      features: [feature],
      locations: [{ id: 'US', name: 'United States', value: 10 }],
      colors: {
        baseFill: '#e5e7eb',
        baseStroke: '#fffaf1',
        activeStroke: '#d6d3d1',
        activeTextFill: '#ffffff',
        mutedText: '#334155',
      },
      valueFormatter: value => `${value}`,
      resolveLocationColor: () => '#f97316',
    })
    const spec = createMapChartSpec({
      features: model.features,
      projection: 'mercator',
      metricLabel: 'Sales',
      baseFill: '#e5e7eb',
      baseStroke: '#fffaf1',
      activeStroke: '#d6d3d1',
    })

    expect(spec).toMatchObject({
      type: 'geoPath',
      coordinate: { type: 'mercator', size: 'fitExtent' },
      state: { active: { lineWidth: 1, stroke: '#d6d3d1' } },
      interaction: { elementHighlight: true },
    })
    expect(spec.data).toBe(model.features)
  })
})
