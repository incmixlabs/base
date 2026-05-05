import type React from 'react'
import type { PropDef } from '@/theme/props/prop-def'
import { SURFACE_COLOR_KEYS, type SurfaceColorKey } from '@/theme/tokens'

export const chartTitlePropDef = { type: 'ReactNode' } satisfies PropDef<React.ReactNode>
export const chartStringTitlePropDef = { type: 'string' } satisfies PropDef<string>
export const chartDescriptionPropDef = { type: 'string' } satisfies PropDef<string>
export const chartMetricPropDef = { type: 'ReactNode' } satisfies PropDef<React.ReactNode>
export const chartMetricLabelPropDef = { type: 'ReactNode' } satisfies PropDef<React.ReactNode>
export const chartTrendPropDef = { type: 'ReactNode' } satisfies PropDef<React.ReactNode>
export const chartHeightPropDef = { type: 'number' } satisfies PropDef<number>
export const chartClassNamePropDef = { type: 'string' } satisfies PropDef<string>
export const chartColorPropDef = {
  type: 'enum',
  values: SURFACE_COLOR_KEYS,
  default: 'chart1',
} satisfies PropDef<SurfaceColorKey>
export const chartOptionalColorPropDef = {
  type: 'enum',
  values: SURFACE_COLOR_KEYS,
  default: undefined as SurfaceColorKey | undefined,
} satisfies PropDef<SurfaceColorKey>
export const chartValueFormatterPropDef = {
  type: 'callback',
  typeFullName: '(value: number) => string',
} satisfies PropDef<(value: number) => string>

export const chartSurfacePropDefs = {
  title: chartTitlePropDef,
  height: chartHeightPropDef,
  className: chartClassNamePropDef,
} satisfies {
  title: PropDef<React.ReactNode>
  height: PropDef<number>
  className: PropDef<string>
}

export const chartMetricPropDefs = {
  metric: chartMetricPropDef,
  metricLabel: chartMetricLabelPropDef,
  trend: chartTrendPropDef,
} satisfies {
  metric: PropDef<React.ReactNode>
  metricLabel: PropDef<React.ReactNode>
  trend: PropDef<React.ReactNode>
}
