import type { AutoformChartDef, AutoformChartRenderer, AutoformChartRendererMap } from './chart-contract'

export type AutoformChartRendererResolutionOptions<
  TRow = unknown,
  TChart extends AutoformChartDef<TRow> = AutoformChartDef<TRow>,
> = {
  chart: TChart
  getChartComponent?: AutoformChartRenderer<TRow, TChart>
  renderers?: AutoformChartRendererMap<TRow, TChart>
  defaultRenderers?: AutoformChartRendererMap<TRow, TChart>
}

export function resolveAutoformChartRenderer<
  TRow = unknown,
  TChart extends AutoformChartDef<TRow> = AutoformChartDef<TRow>,
>({
  chart,
  getChartComponent,
  renderers,
  defaultRenderers,
}: AutoformChartRendererResolutionOptions<TRow, TChart>): AutoformChartRenderer<TRow, TChart> | undefined {
  return getChartComponent ?? renderers?.[chart.type] ?? defaultRenderers?.[chart.type]
}
