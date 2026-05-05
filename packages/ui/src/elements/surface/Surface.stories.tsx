import type { Meta, StoryObj } from '@storybook/react-vite'
import { Box } from '@/layouts/box/Box'
import { normalizeChartColor, SemanticColor } from '@/theme/props/color.prop'
import { getPropDefValues } from '@/theme/props/prop-def'
import type { ChartColorToken } from '@/theme/tokens'
import { Surface } from './Surface'
import { surfacePropDefs } from './surface.props'

const chartToneColors = getPropDefValues(surfacePropDefs.color).filter(
  (value): value is ChartColorToken => normalizeChartColor(value) === value,
)

const meta: Meta<typeof Surface> = {
  title: 'Elements/Surface',
  component: Surface,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    variant: 'surface',
    color: SemanticColor.neutral,
    radius: 'md',
    highContrast: false,
    hover: true,
    children: 'Surface',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: getPropDefValues(surfacePropDefs.variant),
      description: 'The visual variant',
    },
    color: {
      control: 'select',
      options: getPropDefValues(surfacePropDefs.color),
      description: 'The surface tone, including semantic and chart tones',
    },
    radius: {
      control: 'select',
      options: getPropDefValues(surfacePropDefs.radius),
      description: 'The border radius',
    },
    highContrast: {
      control: 'boolean',
      description: 'Enable high contrast styling',
    },
    hover: {
      control: 'boolean',
      description: 'Enable hover/active interactive styles',
    },
    shape: {
      control: 'select',
      options: getPropDefValues(surfacePropDefs.shape),
      description: 'Optional shape variant',
    },
    square: {
      control: 'boolean',
      description: 'Force a square aspect ratio',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  args: {
    children: 'Surface',
    variant: 'surface',
    color: SemanticColor.neutral,
  },
  render: args => (
    <Surface {...args} className="px-4 py-2">
      {args.children}
    </Surface>
  ),
}

export const AllVariants: Story = {
  render: () => (
    <Box display="flex" className="flex-wrap gap-3">
      <Surface variant="classic" color="primary" className="px-4 py-2">
        Classic
      </Surface>
      <Surface variant="solid" color="primary" className="px-4 py-2">
        Solid
      </Surface>
      <Surface variant="soft" color="primary" className="px-4 py-2">
        Soft
      </Surface>
      <Surface variant="surface" color="primary" className="px-4 py-2">
        Surface
      </Surface>
      <Surface variant="outline" color="primary" className="px-4 py-2">
        Outline
      </Surface>
      <Surface variant="ghost" color="primary" className="px-4 py-2">
        Ghost
      </Surface>
    </Box>
  ),
}

export const AllColors: Story = {
  render: () => (
    <Box display="flex" className="flex-wrap gap-3">
      <Surface variant="surface" color="slate" className="px-4 py-2">
        Default
      </Surface>
      <Surface variant="surface" color="primary" className="px-4 py-2">
        Primary
      </Surface>
      <Surface variant="surface" color="secondary" className="px-4 py-2">
        Secondary
      </Surface>
      <Surface variant="surface" color="accent" className="px-4 py-2">
        Accent
      </Surface>
      <Surface variant="surface" color="neutral" className="px-4 py-2">
        Neutral
      </Surface>
      <Surface variant="surface" color="info" className="px-4 py-2">
        Info
      </Surface>
      <Surface variant="surface" color="success" className="px-4 py-2">
        Success
      </Surface>
      <Surface variant="surface" color="warning" className="px-4 py-2">
        Warning
      </Surface>
      <Surface variant="surface" color="error" className="px-4 py-2">
        Error
      </Surface>
      <Surface variant="surface" color="chart1" className="px-4 py-2">
        Chart 1
      </Surface>
      <Surface variant="surface" color="chart-2" className="px-4 py-2">
        Chart 2
      </Surface>
    </Box>
  ),
}

export const ChartTones: Story = {
  args: {
    variant: 'surface',
    radius: 'md',
    highContrast: false,
    hover: true,
  },
  parameters: {
    controls: { include: ['variant', 'radius', 'highContrast', 'hover'] },
  },
  render: args => (
    <Box display="flex" className="flex-wrap gap-3">
      {chartToneColors.map(color => (
        <Surface
          key={color}
          variant={args.variant}
          color={color}
          radius={args.radius}
          highContrast={args.highContrast}
          hover={args.hover}
          className="px-4 py-2"
        >
          {color}
        </Surface>
      ))}
    </Box>
  ),
}

export const Shapes: Story = {
  render: () => (
    <Box display="flex" className="flex-wrap gap-4 items-center">
      <Surface shape="rect" variant="surface" color="info" className="px-4 py-2">
        Rect
      </Surface>
      <Surface shape="ellipse" variant="surface" color="info" className="px-4 py-2">
        Ellipse
      </Surface>
      <Surface shape="pill" variant="surface" color="info" className="px-4 py-2">
        Pill
      </Surface>
      <Surface shape="square" variant="soft" color="info" className="size-16 grid place-items-center">
        Sq
      </Surface>
      <Surface shape="circle" variant="soft" color="info" className="size-16 grid place-items-center">
        C
      </Surface>
      <Surface shape="hexagon" variant="soft" color="info" className="size-16 grid place-items-center">
        H
      </Surface>
    </Box>
  ),
}

export const HighContrast: Story = {
  render: () => (
    <Box display="flex" className="flex-wrap gap-3">
      <Surface variant="classic" color="primary" highContrast className="px-4 py-2">
        Classic HC
      </Surface>
      <Surface variant="solid" color="primary" highContrast className="px-4 py-2">
        Solid HC
      </Surface>
      <Surface variant="soft" color="primary" highContrast className="px-4 py-2">
        Soft HC
      </Surface>
      <Surface variant="surface" color="primary" highContrast className="px-4 py-2">
        Surface HC
      </Surface>
      <Surface variant="outline" color="primary" highContrast className="px-4 py-2">
        Outline HC
      </Surface>
      <Surface variant="ghost" color="primary" highContrast className="px-4 py-2">
        Ghost HC
      </Surface>
    </Box>
  ),
}
