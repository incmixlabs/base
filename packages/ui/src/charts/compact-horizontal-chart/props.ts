import type React from 'react'
import type { PropDef } from '@/theme/props/prop-def'
import type { Radius, SurfaceColorKey } from '@/theme/tokens'
import {
  chartClassNamePropDef,
  chartDescriptionPropDef,
  chartOptionalColorPropDef,
  chartStringTitlePropDef,
  chartValueFormatterPropDef,
} from '../props'
import { type ChartValueFormatKind, chartValueFormatKinds } from '../value-format'

export const compactHorizontalChartLabelPlacements = {
  top: 'top',
  left: 'left',
} as const

export type CompactHorizontalChartLabelPlacement =
  (typeof compactHorizontalChartLabelPlacements)[keyof typeof compactHorizontalChartLabelPlacements]

export const compactHorizontalChartLabelPlacementValues = Object.values(
  compactHorizontalChartLabelPlacements,
) as readonly CompactHorizontalChartLabelPlacement[]

export const compactHorizontalChartRadiusValues = ['none', 'sm', 'md', 'lg'] as const
export type CompactHorizontalChartRadius = Extract<Radius, (typeof compactHorizontalChartRadiusValues)[number]>

const compactHorizontalChartPropDefs = {
  data: { type: 'string', required: true },
  title: chartStringTitlePropDef,
  description: chartDescriptionPropDef,
  color: chartOptionalColorPropDef,
  maxValue: { type: 'number' },
  minVisiblePercent: { type: 'number', default: 1 },
  labelPlacement: { type: 'enum', values: compactHorizontalChartLabelPlacementValues, default: 'top' },
  showValues: { type: 'boolean', default: true },
  valueFormat: {
    type: 'enum',
    values: chartValueFormatKinds,
    default: 'number',
  },
  valueFormatter: chartValueFormatterPropDef,
  radius: { type: 'enum', values: compactHorizontalChartRadiusValues },
  emptyMessage: { type: 'ReactNode', default: 'Add at least one data point to render the chart.' },
  className: chartClassNamePropDef,
} satisfies {
  data: PropDef<string>
  title: PropDef<string>
  description: PropDef<string>
  color: PropDef<SurfaceColorKey>
  maxValue: PropDef<number>
  minVisiblePercent: PropDef<number>
  labelPlacement: PropDef<CompactHorizontalChartLabelPlacement>
  showValues: PropDef<boolean>
  valueFormat: PropDef<ChartValueFormatKind>
  valueFormatter: PropDef<(value: number) => string>
  radius: PropDef<CompactHorizontalChartRadius>
  emptyMessage: PropDef<React.ReactNode>
  className: PropDef<string>
}

export { compactHorizontalChartPropDefs }
