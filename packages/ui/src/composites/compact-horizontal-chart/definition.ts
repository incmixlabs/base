import type { JsonSchemaNode } from '@incmix/core'
import { chartPaletteColors } from '@/charts/chart-colors'
import {
  CompactHorizontalChart,
  compactHorizontalChartLabelPlacementValues,
  compactHorizontalChartRadiusValues,
} from '@/charts/compact-horizontal-chart'
import { chartValueFormatKinds } from '@/charts/value-format'
import { compactHorizontalChartCompositeSampleData } from './sample-data'

export const compactHorizontalChartCompositeJsx = `
export default function CompactHorizontalChartTemplate({ data, props }) {
  return (
    <CompactHorizontalChart
      data={data}
      title={props?.title}
      description={props?.description}
      color={props?.color}
      maxValue={props?.maxValue}
      minVisiblePercent={props?.minVisiblePercent}
      labelPlacement={props?.labelPlacement}
      showValues={props?.showValues}
      valueFormat={props?.valueFormat}
      radius={props?.radius}
    />
  )
}
`

export const compactHorizontalChartCompositeSampleProps = {
  title: 'Top countries',
  description: 'Traffic distribution',
  color: 'warning',
  labelPlacement: 'top',
  showValues: true,
  valueFormat: 'percent',
  radius: 'md',
}

export const compactHorizontalChartCompositeJsonSchema = {
  title: 'compact-horizontal-chart composite data',
  type: 'array',
  minItems: 1,
  items: {
    type: 'object',
    properties: {
      label: {
        type: 'string',
        minLength: 1,
      },
      value: {
        type: 'number',
      },
      color: {
        type: 'string',
        description: 'Optional chart, semantic, CSS, or token color override for this row.',
      },
    },
    required: ['label', 'value'],
    additionalProperties: false,
  },
} satisfies JsonSchemaNode

export const compactHorizontalChartCompositePropsSchema = {
  title: 'compact-horizontal-chart composite props',
  type: 'object',
  properties: {
    title: {
      type: 'string',
      default: compactHorizontalChartCompositeSampleProps.title,
    },
    description: {
      type: 'string',
      default: compactHorizontalChartCompositeSampleProps.description,
    },
    color: {
      type: 'string',
      enum: [...chartPaletteColors],
      default: compactHorizontalChartCompositeSampleProps.color,
    },
    maxValue: {
      type: 'number',
    },
    minVisiblePercent: {
      type: 'number',
      default: 1,
    },
    labelPlacement: {
      type: 'string',
      enum: [...compactHorizontalChartLabelPlacementValues],
      default: compactHorizontalChartCompositeSampleProps.labelPlacement,
    },
    showValues: {
      type: 'boolean',
      default: compactHorizontalChartCompositeSampleProps.showValues,
    },
    valueFormat: {
      type: 'string',
      enum: [...chartValueFormatKinds],
      default: compactHorizontalChartCompositeSampleProps.valueFormat,
    },
    radius: {
      type: 'string',
      enum: [...compactHorizontalChartRadiusValues],
      default: compactHorizontalChartCompositeSampleProps.radius,
    },
  },
  additionalProperties: false,
} satisfies JsonSchemaNode

export const compactHorizontalChartCompositeDefinition = {
  name: 'compact-horizontal-chart',
  sampleData: compactHorizontalChartCompositeSampleData,
  sampleProps: compactHorizontalChartCompositeSampleProps,
  jsonSchema: compactHorizontalChartCompositeJsonSchema,
  propsSchema: compactHorizontalChartCompositePropsSchema,
  jsx: compactHorizontalChartCompositeJsx,
  runtimeScope: { CompactHorizontalChart },
}
