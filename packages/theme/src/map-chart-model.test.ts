import { describe, expect, it } from 'vitest'
import { createMapChartModel, type MapChartFeature, type MapChartGeometry } from './map-chart-model.js'

const polygon: MapChartGeometry = {
  type: 'Polygon',
  coordinates: [
    [
      [0, 0],
      [1, 0],
      [1, 1],
      [0, 0],
    ],
  ],
}

const features: MapChartFeature[] = [
  {
    type: 'Feature',
    id: 'US',
    properties: { name: 'United States', isoCode: 'US' },
    geometry: polygon,
  },
  {
    type: 'Feature',
    id: 'CA',
    properties: { name: 'Canada', isoCode: 'CA' },
    geometry: polygon,
  },
]

const colors = {
  baseFill: '#e5e7eb',
  baseStroke: '#fffaf1',
  activeStroke: '#d6d3d1',
  activeTextFill: '#ffffff',
  mutedText: '#334155',
}

describe('createMapChartModel', () => {
  it('matches locations to features and enriches map properties', () => {
    const model = createMapChartModel({
      features,
      locations: [{ id: 'usa', featureId: 'US', name: 'USA', value: 12 }],
      colors,
      valueFormatter: value => `${value} visits`,
      resolveLocationColor: () => '#f97316',
    })

    expect(model.features.map(feature => feature.properties.__mapActive)).toEqual([true, false])
    expect(model.features[0]?.properties).toMatchObject({
      __mapFill: '#f97316',
      __mapStroke: '#d6d3d1',
      __mapName: 'USA',
      __mapValue: 12,
      __mapFormattedValue: '12 visits',
      __mapTextFill: '#ffffff',
    })
    expect(model.features[1]?.properties).toMatchObject({
      __mapFill: '#e5e7eb',
      __mapStroke: 'transparent',
      __mapName: 'Canada',
      __mapFormattedValue: 'No data',
      __mapTextFill: '#334155',
    })
  })

  it('preserves the first owner when duplicate location aliases exist', () => {
    const model = createMapChartModel({
      features,
      locations: [
        { id: 'US', name: 'First', value: 1 },
        { id: 'US', name: 'Second', value: 2 },
      ],
      colors,
      valueFormatter: String,
      resolveLocationColor: ({ index }) => (index === 0 ? '#f97316' : '#06b6d4'),
    })

    expect(model.features[0]?.properties).toMatchObject({
      __mapFill: '#f97316',
      __mapName: 'First',
      __mapValue: 1,
    })
  })

  it('prioritizes explicit identifiers over earlier name aliases', () => {
    const model = createMapChartModel({
      features,
      locations: [
        { id: 'other', name: 'United States', value: 1 },
        { id: 'actual-us', featureId: 'US', name: 'Matched by featureId', value: 2 },
      ],
      colors,
      valueFormatter: String,
      resolveLocationColor: ({ index }) => (index === 0 ? '#f97316' : '#06b6d4'),
    })

    expect(model.features[0]?.properties).toMatchObject({
      __mapFill: '#06b6d4',
      __mapName: 'Matched by featureId',
      __mapValue: 2,
    })
  })
})
