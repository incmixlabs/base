import type { Meta, StoryObj } from '@storybook/react-vite'
import { AutoformChart, type AutoformChartProps } from './AutoformChart'
import type { AutoformChartDef } from './chart-contract'

type PipelineRow = {
  stage: string
  count: number
}

const pipelineRows: PipelineRow[] = [
  { stage: 'Qualified', count: 24 },
  { stage: 'Proposal', count: 18 },
  { stage: 'Review', count: 11 },
  { stage: 'Won', count: 7 },
]

const barChart: AutoformChartDef<PipelineRow> = {
  id: 'pipeline-bar',
  type: 'bar',
  title: 'Pipeline by Stage',
  subtitle: 'Rendered by the default G2-backed BarChart adapter.',
  dataSource: { kind: 'inline', rows: pipelineRows },
  encodings: { x: 'stage', y: 'count' },
  theme: { color: 'chart1' },
}

const horizontalChart: AutoformChartDef<PipelineRow> = {
  ...barChart,
  id: 'pipeline-horizontal',
  type: 'horizontal',
  title: 'Pipeline Distribution',
  subtitle: 'Rendered by the custom CompactHorizontalChart adapter.',
  theme: { color: 'primary' },
}

const customRendererChart: AutoformChartDef<PipelineRow> = {
  ...barChart,
  id: 'pipeline-custom',
  type: 'custom-pipeline',
  title: 'Custom Pipeline Snapshot',
  subtitle: 'Rendered through a local renderer registry without using the default G2 adapter.',
}

function PipelineAutoformChart(props: AutoformChartProps<PipelineRow>) {
  return <AutoformChart {...props} />
}

const renderSlot: AutoformChartProps<PipelineRow>['getChartComponent'] = ({ chart, data, height }) => (
  <div
    role="img"
    aria-label={`${chart.title}: ${data.length} rows`}
    style={{
      alignItems: 'center',
      background: 'var(--color-neutral-soft)',
      border: '1px dashed var(--border)',
      borderRadius: 8,
      color: 'color-mix(in oklch, var(--color-neutral-text) 68%, transparent)',
      display: 'flex',
      height,
      justifyContent: 'center',
    }}
  >
    Custom renderer slot for {chart.id}
  </div>
)

const rendererRegistry: AutoformChartProps<PipelineRow>['renderers'] = {
  'custom-pipeline': ({ chart, data, height }) => (
    <div
      role="img"
      aria-label={`${chart.title}: ${data.length} rows`}
      style={{
        alignItems: 'center',
        background: 'color-mix(in srgb, var(--color-primary-primary) 10%, transparent)',
        border: '1px solid var(--border)',
        borderRadius: 8,
        color: 'var(--foreground)',
        display: 'grid',
        gap: 4,
        height,
        justifyItems: 'center',
        padding: 24,
      }}
    >
      <strong>{chart.title}</strong>
      <span>{data.reduce((total, row) => total + row.count, 0)} open opportunities</span>
    </div>
  ),
}

const meta = {
  title: 'Charts/Autoform Chart Contract',
  component: PipelineAutoformChart,
  parameters: {
    layout: 'padded',
  },
  args: {
    chart: barChart,
  },
} satisfies Meta<typeof PipelineAutoformChart>

export default meta

type Story = StoryObj<typeof meta>

export const G2BarFromContract: Story = {
  args: {
    chart: barChart,
  },
}

export const CustomHorizontalFromContract: Story = {
  args: {
    chart: horizontalChart,
  },
  render: args => (
    <div style={{ width: 'min(100%, 560px)' }}>
      <PipelineAutoformChart {...args} />
    </div>
  ),
}

export const RendererSlot: Story = {
  args: {
    chart: barChart,
  },
  render: args => <PipelineAutoformChart {...args} getChartComponent={renderSlot} />,
}

export const G2AndCustomRenderers: Story = {
  args: {
    chart: barChart,
  },
  render: args => (
    <div
      style={{
        display: 'grid',
        gap: 24,
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      }}
    >
      <PipelineAutoformChart {...args} chart={barChart} />
      <PipelineAutoformChart {...args} chart={customRendererChart} renderers={rendererRegistry} />
    </div>
  ),
}
