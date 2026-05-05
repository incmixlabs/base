import { describe, expect, it } from 'vitest'
import { autoformChartPropDefs } from './autoform-chart.props'
import { barChartPropDefs } from './bar-chart/props'
import { mapChartPropDefs } from './map-chart/props'
import {
  chartClassNamePropDef,
  chartColorPropDef,
  chartDescriptionPropDef,
  chartMetricPropDefs,
  chartOptionalColorPropDef,
  chartStringTitlePropDef,
  chartSurfacePropDefs,
  chartValueFormatterPropDef,
} from './props'

describe('shared chart prop definitions', () => {
  it('composes BarChart props from shared chart prop defs', () => {
    expect(barChartPropDefs.title).toBe(chartStringTitlePropDef)
    expect(barChartPropDefs.description).toBe(chartDescriptionPropDef)
    expect(barChartPropDefs.color).toBe(chartColorPropDef)
    expect(barChartPropDefs.className).toBe(chartClassNamePropDef)
    expect(barChartPropDefs.height.default).toBe(320)
  })

  it('composes MapChart props from shared chart prop defs', () => {
    expect(mapChartPropDefs.title.type).toBe(chartSurfacePropDefs.title.type)
    expect(mapChartPropDefs.metric).toBe(chartMetricPropDefs.metric)
    expect(mapChartPropDefs.metricLabel.type).toBe(chartMetricPropDefs.metricLabel.type)
    expect(mapChartPropDefs.valueFormatter).toBe(chartValueFormatterPropDef)
    expect(mapChartPropDefs.className).toBe(chartClassNamePropDef)
    expect(mapChartPropDefs.height.default).toBe(402)
  })

  it('keeps optional chart colors distinct from default single-color charts', () => {
    expect(chartOptionalColorPropDef.values).toBe(chartColorPropDef.values)
    expect(chartOptionalColorPropDef.default).toBeUndefined()
    expect(chartColorPropDef.default).toBe('chart1')
  })

  it('keeps AutoformChart prop definitions internal to the chart contract layer', () => {
    expect(autoformChartPropDefs.chart.required).toBe(true)
    expect(autoformChartPropDefs.chart.typeFullName).toBe('AutoformChartDef<TRow>')
    expect(autoformChartPropDefs.height.default).toBe(320)
    expect(autoformChartPropDefs.width.default).toBe(0)
    expect(autoformChartPropDefs.getChartComponent.typeFullName).toBe('AutoformChartRenderer<TRow, TChart>')
    expect(autoformChartPropDefs.loadingFallback.type).toBe('ReactNode')
    expect(autoformChartPropDefs.unsupportedFallback.type).toBe('ReactNode')
  })
})
