import type { Meta, StoryObj } from '@storybook/react-vite'
import { ChartProvider } from '../ChartProvider'
import { chartPaletteColors, type ChartPaletteColor, type ChartPaletteMode } from '../chart-colors'
import { BarChart, type BarChartProps } from './BarChart'

const quarterlyPipeline = [
  { label: 'Research', value: 28 },
  { label: 'Concept', value: 44 },
  { label: 'Build', value: 61 },
  { label: 'Launch', value: 36 },
]

const chartPaletteModeOptions: ChartPaletteMode[] = ['spectrum', 'monochrome']

type BarChartStoryProps = BarChartProps & {
  paletteMode?: ChartPaletteMode
  paletteColor?: ChartPaletteColor
  paletteColors?: ChartPaletteColor[]
}

function BarChartStory({
  paletteMode = 'spectrum',
  paletteColor = 'primary',
  paletteColors,
  ...props
}: BarChartStoryProps) {
  return (
    <ChartProvider mode={paletteMode} color={paletteColor} colors={paletteColors}>
      <BarChart {...props} />
    </ChartProvider>
  )
}

const meta = {
  title: 'Charts/Bar Chart',
  component: BarChartStory,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    paletteMode: {
      control: 'select',
      options: chartPaletteModeOptions,
    },
    paletteColor: {
      control: 'select',
      options: chartPaletteColors,
    },
    paletteColors: {
      control: 'check',
      options: chartPaletteColors,
    },
    color: {
      control: 'select',
      options: chartPaletteColors,
    },
    height: {
      control: { type: 'number', min: 180, step: 20 },
    },
    showValueLabels: {
      control: 'boolean',
    },
    valueLabelOffset: {
      control: { type: 'number', min: 0, step: 2 },
    },
  },
  args: {
    title: 'Workflow Throughput',
    description: 'A compact narrative chart for reporting surfaces and authored composites.',
    data: quarterlyPipeline,
    height: 320,
    showValueLabels: true,
    paletteMode: 'spectrum',
    paletteColor: 'primary',
  },
} satisfies Meta<typeof BarChartStory>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Accent: Story = {
  args: {
    color: 'accent',
  },
}

export const Monochrome: Story = {
  args: {
    paletteMode: 'monochrome',
    paletteColor: 'accent',
  },
}

export const WithoutLabels: Story = {
  args: {
    showValueLabels: false,
  },
}
