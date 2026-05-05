import type { PropDef } from '@/theme/props/prop-def'
import {
  chartClassNamePropDef,
  chartHeightPropDef,
  chartMetricPropDefs,
  chartSurfacePropDefs,
  chartValueFormatterPropDef,
} from '../props'

export const mapChartProjections = {
  equalEarth: 'equalEarth',
  naturalEarth1: 'naturalEarth1',
  mercator: 'mercator',
  equirectangular: 'equirectangular',
  orthographic: 'orthographic',
  albers: 'albers',
} as const

export type MapChartProjection = (typeof mapChartProjections)[keyof typeof mapChartProjections]

export const mapChartProjectionValues = Object.values(mapChartProjections) as readonly MapChartProjection[]

const mapChartPropDefs = {
  features: { type: 'string' },
  locations: { type: 'string' },
  title: { ...chartSurfacePropDefs.title, default: 'Map chart' },
  metric: chartMetricPropDefs.metric,
  metricLabel: { ...chartMetricPropDefs.metricLabel, default: 'Value' },
  trend: chartMetricPropDefs.trend,
  height: { ...chartHeightPropDef, default: 402 },
  mapMaxWidth: { type: 'number', default: 827 },
  projection: { type: 'enum', values: mapChartProjectionValues, default: mapChartProjections.mercator },
  summaryLimit: { type: 'number', default: 5 },
  showSummary: { type: 'boolean', default: true },
  showZoomControls: { type: 'boolean', default: true },
  otherLabel: { type: 'ReactNode', default: 'Other countries' },
  otherValue: { type: 'ReactNode' },
  valueFormatter: chartValueFormatterPropDef,
  emptyMessage: { type: 'ReactNode', default: 'Add GeoJSON features to render the map.' },
  className: chartClassNamePropDef,
} satisfies Record<string, PropDef>

export { mapChartPropDefs }
