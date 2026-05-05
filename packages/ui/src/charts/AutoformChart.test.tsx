import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { AutoformChart } from './AutoformChart'
import { AutoformChartHost } from './AutoformChartHost'
import type { AutoformChartDef } from './chart-contract'

type ChartRow = {
  stage: string
  count: number
}

const pipelineChart: AutoformChartDef<ChartRow> = {
  id: 'pipeline',
  type: 'bar',
  dataSource: { kind: 'inline', rows: [{ stage: 'Qualified', count: 24 }] },
  encodings: { x: 'stage', y: 'count' },
  title: 'Pipeline',
}

const suspendedChartPromise = new Promise<never>(() => {})

function SuspendedChart(): never {
  throw suspendedChartPromise
}

afterEach(() => cleanup())

describe('AutoformChart', () => {
  it('uses the custom fallback while a renderer is suspended', () => {
    render(
      <AutoformChart
        chart={pipelineChart}
        loadingFallback={<div role="status">Loading custom chart</div>}
        getChartComponent={() => <SuspendedChart />}
      />,
    )

    expect(screen.getByRole('status')).toHaveTextContent('Loading custom chart')
  })

  it('renders a G2-backed default bar chart from the shared chart definition', async () => {
    render(<AutoformChart chart={pipelineChart} />)

    expect(await screen.findByText('Pipeline')).toBeInTheDocument()
  })

  it('renders the existing custom horizontal chart through the same contract', async () => {
    render(
      <AutoformChart
        chart={{
          ...pipelineChart,
          id: 'horizontal-pipeline',
          type: 'horizontal',
          title: 'Horizontal pipeline',
        }}
      />,
    )

    expect(await screen.findByRole('img', { name: 'Horizontal pipeline: Qualified 24' })).toBeInTheDocument()
  })

  it('uses a getChartComponent renderer slot when supplied', () => {
    render(
      <AutoformChart
        chart={pipelineChart}
        getChartComponent={({ chart, height, readonly }) => (
          <div role="img" aria-label={`${chart.id} ${height} ${readonly ? 'readonly' : 'editable'}`}>
            Custom renderer
          </div>
        )}
        height={280}
        readonly
      />,
    )

    expect(screen.getByRole('img', { name: 'pipeline 280 readonly' })).toHaveTextContent('Custom renderer')
  })

  it('clamps non-finite dimensions before rendering', () => {
    const { container } = render(
      <AutoformChartHost
        chart={pipelineChart}
        getChartComponent={({ height, width }) => (
          <div role="img" aria-label={`width ${width} height ${height}`}>
            Custom renderer
          </div>
        )}
        height={Number.NaN}
        width={Number.POSITIVE_INFINITY}
      />,
    )
    const host = container.querySelector('[data-chart-id="pipeline"]')

    expect(screen.getByRole('img', { name: 'width 0 height 48' })).toHaveTextContent('Custom renderer')
    expect(host).toHaveAttribute('style', 'min-height: 48px;')
  })

  it('supports a custom-only host without built-in renderers', () => {
    render(
      <AutoformChartHost
        chart={{ ...pipelineChart, type: 'custom-card' }}
        getChartComponent={({ chart, data }) => (
          <div role="img" aria-label={`${chart.type} ${data.length}`}>
            Lightweight custom chart
          </div>
        )}
      />,
    )

    expect(screen.getByRole('img', { name: 'custom-card 1' })).toHaveTextContent('Lightweight custom chart')
  })

  it('renders the unsupported renderer fallback for unregistered chart types', () => {
    render(<AutoformChart chart={{ ...pipelineChart, type: 'waterfall' }} />)

    expect(screen.getByRole('status')).toHaveTextContent('No chart renderer registered for waterfall.')
  })

  it('keeps unsupported renderer fallback distinct from loading fallback', () => {
    render(
      <AutoformChart
        chart={{ ...pipelineChart, type: 'waterfall' }}
        loadingFallback={<div role="status">Loading custom chart</div>}
        unsupportedFallback={<div role="alert">Unsupported custom chart</div>}
      />,
    )

    expect(screen.getByRole('alert')).toHaveTextContent('Unsupported custom chart')
    expect(screen.queryByText('Loading custom chart')).not.toBeInTheDocument()
  })
})
