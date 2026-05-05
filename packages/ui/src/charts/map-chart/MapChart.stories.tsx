import type { Meta, StoryObj } from '@storybook/react-vite'
import { ChartProvider } from '../ChartProvider'
import { chartPaletteColors, type ChartPaletteColor, type ChartPaletteMode } from '../chart-colors'
import { MapChart, type MapChartLocationDatum, type MapChartProps } from './MapChart'
import { mapChartProjectionValues, mapChartProjections } from './props'
import { sampleSalesLocations, sampleWorldMapFeatures } from './sample-world-map'

const storyValueFormatter = (value: number) => new Intl.NumberFormat('en-US').format(value)
const chartPaletteModeOptions: ChartPaletteMode[] = ['spectrum', 'monochrome']

type SalesLocationsMapChartProps = MapChartProps & {
  paletteMode?: ChartPaletteMode
  paletteColor?: ChartPaletteColor
  paletteColors?: ChartPaletteColor[]
}

function getLocationTotal(locations: MapChartLocationDatum[]) {
  return locations.reduce((total, location) => total + location.value, 0)
}

function SalesLocationsMapChart({
  paletteMode = 'spectrum',
  paletteColor = 'primary',
  paletteColors,
  features = sampleWorldMapFeatures,
  locations = sampleSalesLocations,
  metric,
  summaryLimit = 5,
  valueFormatter = storyValueFormatter,
  ...props
}: SalesLocationsMapChartProps) {
  return (
    <ChartProvider mode={paletteMode} color={paletteColor} colors={paletteColors}>
      <MapChart
        features={features}
        locations={locations}
        metric={metric ?? valueFormatter(getLocationTotal(locations))}
        summaryLimit={summaryLimit}
        valueFormatter={valueFormatter}
        {...props}
      />
    </ChartProvider>
  )
}

const meta = {
  title: 'Charts/Map Chart',
  component: SalesLocationsMapChart,
  decorators: [
    Story => (
      <div style={{ width: 'min(100%, 1192px)', margin: '0 auto' }}>
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
    projection: {
      control: 'select',
      options: mapChartProjectionValues,
    },
    height: {
      control: { type: 'number', min: 240, step: 20 },
    },
    mapMaxWidth: {
      control: { type: 'number', min: 320, step: 20 },
    },
    summaryLimit: {
      control: { type: 'number', min: 0, step: 1 },
    },
    showSummary: {
      control: 'boolean',
    },
    showZoomControls: {
      control: 'boolean',
    },
    title: {
      control: 'text',
    },
    metric: {
      control: 'text',
    },
    metricLabel: {
      control: 'text',
    },
    trend: {
      control: 'text',
    },
    otherLabel: {
      control: 'text',
    },
    otherValue: {
      control: 'text',
    },
    valueFormatter: {
      table: { disable: true },
    },
  },
  args: {
    title: 'Most Sales Locations',
    metricLabel: 'Sales this month',
    trend: '14.6% up',
    height: 402,
    projection: mapChartProjections.mercator,
    paletteMode: 'spectrum',
    paletteColor: 'primary',
  },
} satisfies Meta<typeof SalesLocationsMapChart>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const MapOnly: Story = {
  args: {
    showSummary: false,
    height: 420,
  },
}

export const WithoutZoomControls: Story = {
  args: {
    showZoomControls: false,
  },
}

export const Monochrome: Story = {
  args: {
    paletteMode: 'monochrome',
    paletteColor: 'accent',
  },
}

export const NaturalEarth: Story = {
  args: {
    projection: mapChartProjections.naturalEarth1,
  },
}

export const FlatWorld: Story = {
  args: {
    projection: mapChartProjections.equirectangular,
  },
}
