import type { MapChartModelFeature } from './map-chart-model.js'

export type MapChartProjection =
  | 'equalEarth'
  | 'naturalEarth1'
  | 'mercator'
  | 'equirectangular'
  | 'orthographic'
  | 'albers'

export type CreateMapChartSpecOptions = {
  features: readonly MapChartModelFeature[]
  projection: MapChartProjection
  metricLabel: string
  baseFill: string
  baseStroke: string
  activeStroke: string
}

export type MapChartSpec = Record<string, unknown>

export function createMapChartSpec({
  features,
  projection,
  metricLabel,
  baseFill,
  baseStroke,
  activeStroke,
}: CreateMapChartSpecOptions): MapChartSpec {
  return {
    type: 'geoPath',
    data: features,
    coordinate: {
      type: projection,
      size: 'fitExtent',
    },
    style: {
      fill: (datum: MapChartModelFeature) => String(datum.properties.__mapFill ?? baseFill),
      stroke: (datum: MapChartModelFeature) => String(datum.properties.__mapStroke ?? baseStroke),
      lineWidth: (datum: MapChartModelFeature) => (datum.properties.__mapActive ? 0.8 : 0.45),
      opacity: (datum: MapChartModelFeature) => (datum.properties.__mapActive ? 1 : 0.72),
      cursor: 'default',
    },
    tooltip: {
      title: (datum: MapChartModelFeature) => String(datum.properties.__mapName ?? 'Location'),
      items: [
        {
          name: metricLabel,
          value: (datum: MapChartModelFeature) => String(datum.properties.__mapFormattedValue ?? 'No data'),
        },
      ],
    },
    state: {
      active: {
        lineWidth: 1,
        stroke: activeStroke,
      },
      inactive: {
        opacity: 0.72,
      },
    },
    interaction: {
      tooltip: {
        shared: false,
      },
      elementHighlight: true,
    },
    animate: {
      enter: {
        type: 'fadeIn',
        duration: 320,
      },
    },
  }
}
