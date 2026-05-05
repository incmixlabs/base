import type React from 'react'
import type { PropDef } from '@/theme/props/prop-def'
import type {
  AutoformChartDef,
  AutoformChartRenderer,
  AutoformChartRendererMap,
  AutoformChartRenderTheme,
} from './chart-contract'
import { chartClassNamePropDef, chartHeightPropDef } from './props'

const autoformChartPropDefs = {
  chart: {
    type: 'object',
    typeFullName: 'AutoformChartDef<TRow>',
    required: true,
  },
  data: {
    type: 'object',
    typeFullName: 'readonly TRow[]',
  },
  width: {
    type: 'number',
    default: 0,
  },
  height: {
    ...chartHeightPropDef,
    default: 320,
  },
  theme: {
    type: 'object',
    typeFullName: 'AutoformChartRenderTheme',
  },
  isSelected: {
    type: 'boolean',
  },
  readonly: {
    type: 'boolean',
  },
  renderers: {
    type: 'object',
    typeFullName: 'AutoformChartRendererMap<TRow, TChart>',
  },
  defaultRenderers: {
    type: 'object',
    typeFullName: 'AutoformChartRendererMap<TRow, TChart>',
  },
  getChartComponent: {
    type: 'callback',
    typeFullName: 'AutoformChartRenderer<TRow, TChart>',
  },
  loadingFallback: {
    type: 'ReactNode',
  },
  unsupportedFallback: {
    type: 'ReactNode',
  },
  className: chartClassNamePropDef,
} satisfies {
  chart: PropDef<AutoformChartDef>
  data: PropDef<readonly unknown[]>
  width: PropDef<number>
  height: PropDef<number>
  theme: PropDef<AutoformChartRenderTheme>
  isSelected: PropDef<boolean>
  readonly: PropDef<boolean>
  renderers: PropDef<AutoformChartRendererMap>
  defaultRenderers: PropDef<AutoformChartRendererMap>
  getChartComponent: PropDef<AutoformChartRenderer>
  loadingFallback: PropDef<React.ReactNode>
  unsupportedFallback: PropDef<React.ReactNode>
  className: PropDef<string>
}

export { autoformChartPropDefs }
