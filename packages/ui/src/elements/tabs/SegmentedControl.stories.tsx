import type { Meta, StoryObj } from '@storybook/react-vite'
import * as React from 'react'
import { SemanticColor, semanticColorKeys } from '@/theme/props/color.prop'
import { getPropDefValues } from '@/theme/props/prop-def'
import { radiusPropDef } from '@/theme/props/radius.prop'
import { createKeyedStateMap } from '@/theme/tokens'
import { Text } from '@/typography'
import { SegmentedControl } from './SegmentedControl'
import { segmentedControlRootPropDefs } from './segmented-control.props'

const meta: Meta<typeof SegmentedControl.Root> = {
  title: 'Elements/SegmentedControl',
  component: SegmentedControl.Root,
  parameters: {
    layout: 'centered',
  },
}
export default meta

type Story = StoryObj<typeof SegmentedControl.Root>

export const Playground: Story = {
  argTypes: {
    size: {
      control: { type: 'select' },
      options: getPropDefValues(segmentedControlRootPropDefs.size),
    },
    radius: {
      control: { type: 'select' },
      options: getPropDefValues(radiusPropDef.radius),
    },
    color: {
      control: { type: 'select' },
      options: semanticColorKeys,
    },
    variant: {
      control: { type: 'select' },
      options: getPropDefValues(segmentedControlRootPropDefs.variant),
    },
    disabled: {
      control: { type: 'boolean' },
    },
    highContrast: {
      control: { type: 'boolean' },
    },
    hover: {
      control: { type: 'boolean' },
    },
  },
  args: {
    size: 'md',
    radius: 'md',
    color: SemanticColor.slate,
    variant: 'surface',
    disabled: false,
    highContrast: false,
    hover: true,
  },
  render: args => {
    const [value, setValue] = React.useState('a')
    return (
      <SegmentedControl.Root
        size={args.size}
        radius={args.radius}
        color={args.color}
        variant={args.variant}
        highContrast={args.highContrast}
        hover={args.hover}
        value={value}
        onValueChange={setValue}
      >
        <SegmentedControl.Item value="a" disabled={args.disabled}>
          Option A
        </SegmentedControl.Item>
        <SegmentedControl.Item value="b">Option B</SegmentedControl.Item>
        <SegmentedControl.Item value="c">Option C</SegmentedControl.Item>
      </SegmentedControl.Root>
    )
  },
}

// Default
export const Default: Story = {
  render: () => {
    const [value, setValue] = React.useState('inbox')
    return (
      <SegmentedControl.Root value={value} onValueChange={setValue}>
        <SegmentedControl.Item value="inbox">Inbox</SegmentedControl.Item>
        <SegmentedControl.Item value="drafts">Drafts</SegmentedControl.Item>
        <SegmentedControl.Item value="sent">Sent</SegmentedControl.Item>
      </SegmentedControl.Root>
    )
  },
}

export const Animated: Story = {
  render: () => {
    const [value, setValue] = React.useState('overview')
    return (
      <SegmentedControl.Root animated value={value} onValueChange={setValue} className="w-[400px]">
        <SegmentedControl.Item value="overview">Overview</SegmentedControl.Item>
        <SegmentedControl.Item value="analytics">Analytics</SegmentedControl.Item>
        <SegmentedControl.Item value="reports">Reports</SegmentedControl.Item>
        <SegmentedControl.Content value="overview">
          <div className="space-y-2 pt-4">
            <h3 className="font-medium">Overview</h3>
            <Text as="p" size="sm" color="neutral" muted>
              High-level metrics and summary information.
            </Text>
          </div>
        </SegmentedControl.Content>
        <SegmentedControl.Content value="analytics">
          <div className="space-y-2 pt-4">
            <h3 className="font-medium">Analytics</h3>
            <Text as="p" size="sm" color="neutral" muted>
              Detailed breakdowns and trend analysis.
            </Text>
          </div>
        </SegmentedControl.Content>
        <SegmentedControl.Content value="reports">
          <div className="space-y-2 pt-4">
            <h3 className="font-medium">Reports</h3>
            <Text as="p" size="sm" color="neutral" muted>
              Generated reports and export options.
            </Text>
          </div>
        </SegmentedControl.Content>
      </SegmentedControl.Root>
    )
  },
}

// Sizes
export const Sizes: Story = {
  render: () => {
    const sizes = getPropDefValues(segmentedControlRootPropDefs.size)
    const [values, setValues] = React.useState(createKeyedStateMap(sizes, () => 'a'))

    return (
      <div className="flex flex-col gap-4 items-start">
        {sizes.map(size => (
          <div key={size}>
            <Text as="p" size="sm" color="neutral" muted mb="2">
              {size}
              {size === segmentedControlRootPropDefs.size.default ? ' (default)' : ''}
            </Text>
            <SegmentedControl.Root
              size={size}
              value={values[size]}
              onValueChange={value => setValues(prev => ({ ...prev, [size]: value }))}
            >
              <SegmentedControl.Item value="a">Option A</SegmentedControl.Item>
              <SegmentedControl.Item value="b">Option B</SegmentedControl.Item>
              <SegmentedControl.Item value="c">Option C</SegmentedControl.Item>
            </SegmentedControl.Root>
          </div>
        ))}
      </div>
    )
  },
}

// Radius
export const Radius: Story = {
  render: () => {
    const radii = getPropDefValues(radiusPropDef.radius)
    const [values, setValues] = React.useState(createKeyedStateMap(radii, () => 'a'))

    return (
      <div className="flex flex-col gap-4 items-start">
        {radii.map(radius => (
          <div key={radius}>
            <Text as="p" size="sm" color="neutral" muted mb="2" className="capitalize">
              {radius}
              {radius === radiusPropDef.radius.default ? ' (default)' : ''}
            </Text>
            <SegmentedControl.Root
              radius={radius}
              value={values[radius]}
              onValueChange={value => setValues(prev => ({ ...prev, [radius]: value }))}
            >
              <SegmentedControl.Item value="a">A</SegmentedControl.Item>
              <SegmentedControl.Item value="b">B</SegmentedControl.Item>
              <SegmentedControl.Item value="c">C</SegmentedControl.Item>
            </SegmentedControl.Root>
          </div>
        ))}
      </div>
    )
  },
}

// With Icons
export const WithIcons: Story = {
  render: () => {
    const [value, setValue] = React.useState('list')
    return (
      <SegmentedControl.Root value={value} onValueChange={setValue}>
        <SegmentedControl.Item value="list" aria-label="List view">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
        </SegmentedControl.Item>
        <SegmentedControl.Item value="grid" aria-label="Grid view">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
            />
          </svg>
        </SegmentedControl.Item>
      </SegmentedControl.Root>
    )
  },
}

// Disabled Items
export const DisabledItems: Story = {
  render: () => {
    const [value, setValue] = React.useState('active')
    return (
      <SegmentedControl.Root value={value} onValueChange={setValue}>
        <SegmentedControl.Item value="active">Active</SegmentedControl.Item>
        <SegmentedControl.Item value="pending">Pending</SegmentedControl.Item>
        <SegmentedControl.Item value="disabled" disabled>
          Disabled
        </SegmentedControl.Item>
      </SegmentedControl.Root>
    )
  },
}

// Two Options
export const TwoOptions: Story = {
  render: () => {
    const [value, setValue] = React.useState('monthly')
    return (
      <SegmentedControl.Root value={value} onValueChange={setValue}>
        <SegmentedControl.Item value="monthly">Monthly</SegmentedControl.Item>
        <SegmentedControl.Item value="yearly">Yearly</SegmentedControl.Item>
      </SegmentedControl.Root>
    )
  },
}

// Colors
export const Colors: Story = {
  render: () => {
    const colors = semanticColorKeys
    const [values, setValues] = React.useState(createKeyedStateMap(colors, () => 'a'))

    return (
      <div className="flex flex-col gap-4 items-start">
        {colors.map(color => (
          <div key={color}>
            <Text as="p" size="sm" color="neutral" muted mb="2" className="capitalize">
              {color}
            </Text>
            <SegmentedControl.Root
              color={color}
              value={values[color]}
              onValueChange={v => setValues(prev => ({ ...prev, [color]: v }))}
            >
              <SegmentedControl.Item value="a">Option A</SegmentedControl.Item>
              <SegmentedControl.Item value="b">Option B</SegmentedControl.Item>
              <SegmentedControl.Item value="c">Option C</SegmentedControl.Item>
            </SegmentedControl.Root>
          </div>
        ))}
      </div>
    )
  },
}
