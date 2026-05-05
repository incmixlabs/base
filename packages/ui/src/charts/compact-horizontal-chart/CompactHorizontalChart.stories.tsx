import type { Meta, StoryObj } from '@storybook/react-vite'
import { Column } from '@/layouts/flex/Flex'
import { ChartProvider } from '../ChartProvider'
import { chartPaletteColors, type ChartPaletteColor, type ChartPaletteMode } from '../chart-colors'
import { CompactHorizontalChart, type CompactHorizontalChartProps } from './CompactHorizontalChart'
import { compactHorizontalChartLabelPlacementValues, compactHorizontalChartRadiusValues } from './props'

const chartPaletteModeOptions: ChartPaletteMode[] = ['spectrum', 'monochrome']

const countryDistribution = [
  { label: 'United States', value: 34 },
  { label: 'Russia', value: 26 },
  { label: 'Ukraine', value: 15 },
  { label: 'India', value: 12 },
  { label: 'China', value: 8 },
  { label: 'Other', value: 5 },
]

type CompactHorizontalChartStoryProps = CompactHorizontalChartProps & {
  paletteMode?: ChartPaletteMode
  paletteColor?: ChartPaletteColor
  paletteColors?: ChartPaletteColor[]
}

function CompactHorizontalChartStory({
  paletteMode = 'spectrum',
  paletteColor = 'primary',
  paletteColors,
  ...props
}: CompactHorizontalChartStoryProps) {
  return (
    <ChartProvider mode={paletteMode} color={paletteColor} colors={paletteColors}>
      <CompactHorizontalChart {...props} />
    </ChartProvider>
  )
}

const meta = {
  title: 'Charts/Compact Horizontal Chart',
  component: CompactHorizontalChartStory,
  decorators: [
    Story => (
      <div style={{ width: 'min(100%, 560px)' }}>
        <Story />
      </div>
    ),
  ],
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
    maxValue: {
      control: { type: 'number', min: 1, step: 1 },
    },
    minVisiblePercent: {
      control: { type: 'number', min: 0, max: 10, step: 0.5 },
    },
    showValues: {
      control: 'boolean',
    },
    labelPlacement: {
      control: 'select',
      options: compactHorizontalChartLabelPlacementValues,
    },
    radius: {
      control: 'select',
      options: compactHorizontalChartRadiusValues,
    },
    valueFormatter: {
      table: { disable: true },
    },
  },
  args: {
    title: 'Top countries',
    description: 'Traffic distribution',
    data: countryDistribution,
    labelPlacement: 'top',
    minVisiblePercent: 1,
    showValues: true,
    paletteMode: 'spectrum',
    paletteColor: 'primary',
    valueFormatter: value => `${value}%`,
  },
} satisfies Meta<typeof CompactHorizontalChartStory>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Monochrome: Story = {
  args: {
    paletteMode: 'monochrome',
    paletteColor: 'accent',
  },
}

export const SingleColor: Story = {
  args: {
    color: 'primary',
  },
}

export const LeftLabels: Story = {
  args: {
    labelPlacement: 'left',
  },
}

export const RadiusVariants: Story = {
  render: args => (
    <Column gap="4">
      {compactHorizontalChartRadiusValues.map(radius => (
        <CompactHorizontalChartStory key={radius} {...args} radius={radius} title={`radius="${radius}"`} />
      ))}
    </Column>
  ),
}

export const WithoutValues: Story = {
  args: {
    showValues: false,
  },
}
