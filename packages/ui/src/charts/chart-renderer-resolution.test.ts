import { describe, expect, it, vi } from 'vitest'
import type { AutoformChartDef, AutoformChartRenderer, AutoformChartRendererMap } from './chart-contract'
import { resolveAutoformChartRenderer } from './chart-renderer-resolution'

type ChartRow = {
  stage: string
  count: number
}

const chart: AutoformChartDef<ChartRow> = {
  id: 'pipeline',
  type: 'bar',
  dataSource: { kind: 'rows' },
}

function createRenderer(name: string): AutoformChartRenderer<ChartRow> {
  const renderer = vi.fn(() => null)
  renderer.mockName(name)
  return renderer
}

describe('resolveAutoformChartRenderer', () => {
  it('prefers an explicit getChartComponent renderer', () => {
    const explicitRenderer = createRenderer('explicit')
    const registryRenderer = createRenderer('registry')
    const defaultRenderer = createRenderer('default')

    expect(
      resolveAutoformChartRenderer({
        chart,
        getChartComponent: explicitRenderer,
        renderers: { bar: registryRenderer },
        defaultRenderers: { bar: defaultRenderer },
      }),
    ).toBe(explicitRenderer)
  })

  it('falls back to a chart type renderer before built-in defaults', () => {
    const registryRenderer = createRenderer('registry')
    const defaultRenderer = createRenderer('default')

    expect(
      resolveAutoformChartRenderer({
        chart,
        renderers: { bar: registryRenderer },
        defaultRenderers: { bar: defaultRenderer },
      }),
    ).toBe(registryRenderer)
  })

  it('uses built-in default renderers after custom renderers', () => {
    const defaultRenderer = createRenderer('default')

    expect(
      resolveAutoformChartRenderer({
        chart,
        defaultRenderers: { bar: defaultRenderer },
      }),
    ).toBe(defaultRenderer)
  })

  it('returns undefined for unsupported chart types', () => {
    const defaultRenderers: AutoformChartRendererMap<ChartRow> = {
      bar: createRenderer('default'),
    }

    expect(
      resolveAutoformChartRenderer({
        chart: { ...chart, type: 'waterfall' },
        defaultRenderers,
      }),
    ).toBeUndefined()
  })
})
