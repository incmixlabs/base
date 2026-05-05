'use client'

import { AutoformChartHost, type AutoformChartHostProps } from './AutoformChartHost'
import type { AutoformChartDef } from './chart-contract'
import { defaultAutoformChartRenderers } from './chart-renderers'

export type AutoformChartProps<
  TRow = unknown,
  TChart extends AutoformChartDef<TRow> = AutoformChartDef<TRow>,
> = AutoformChartHostProps<TRow, TChart>

export function AutoformChart<TRow = unknown, TChart extends AutoformChartDef<TRow> = AutoformChartDef<TRow>>(
  props: AutoformChartProps<TRow, TChart>,
) {
  return <AutoformChartHost defaultRenderers={defaultAutoformChartRenderers} {...props} />
}

AutoformChart.displayName = 'AutoformChart'

export { defaultAutoformChartRenderers }
