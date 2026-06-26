import type { Meta, StoryObj } from '@storybook/react-vite'
import { Box } from '@/layouts/box/Box'
import { getPropDefValues } from '@/theme/props/prop-def'
import { selectArgType } from '@/theme/props/storybook'
import { IconButton } from './IconButton'
import { iconButtonPropDefs } from './icon-button.props'

const labelForValue = (value: string) => `${value.charAt(0).toUpperCase()}${value.slice(1)}`

const meta: Meta<typeof IconButton> = {
  title: 'Elements/IconButton',
  component: IconButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      ...selectArgType(iconButtonPropDefs.size),
    },
    variant: {
      ...selectArgType(iconButtonPropDefs.variant),
    },
    color: {
      ...selectArgType(iconButtonPropDefs.color),
    },
    radius: {
      ...selectArgType(iconButtonPropDefs.radius),
    },
    loading: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    highContrast: {
      control: 'boolean',
    },
    icon: {
      control: iconButtonPropDefs.icon.type === 'string' ? 'text' : undefined,
    },
    title: {
      control: iconButtonPropDefs.title.type === 'string' ? 'text' : undefined,
    },
    fill: {
      control: iconButtonPropDefs.fill.type === 'boolean' ? 'boolean' : undefined,
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    variant: 'soft',
    size: 'md',
    title: 'Search',
    icon: 'search',
  },
}

export const Variants: Story = {
  render: () => (
    <Box display="flex" className="gap-3">
      {getPropDefValues(iconButtonPropDefs.variant).map(variant => (
        <IconButton key={variant} aria-label={labelForValue(variant)} variant={variant} icon="search" />
      ))}
    </Box>
  ),
}

export const Sizes: Story = {
  render: () => (
    <Box display="flex" className="items-center gap-3">
      {getPropDefValues(iconButtonPropDefs.size).map(size => (
        <IconButton key={size} aria-label={`Size ${size}`} size={size} icon="search" />
      ))}
    </Box>
  ),
}

export const Radius: Story = {
  render: () => (
    <Box display="flex" className="items-center gap-3">
      {getPropDefValues(iconButtonPropDefs.radius).map(radius => (
        <IconButton key={radius} aria-label={`Radius ${radius}`} radius={radius} variant="soft" icon="search" />
      ))}
    </Box>
  ),
}

export const DynamicIcons: Story = {
  args: {
    size: 'md',
    variant: 'soft',
    color: 'slate',
    radius: 'md',
    disabled: false,
    loading: false,
    highContrast: false,
  },
  render: args => (
    <Box display="flex" className="items-center gap-3">
      <IconButton {...args} title="Search" icon="search" />
      <IconButton {...args} title="Copy" icon="copy" variant="outline" />
      <IconButton {...args} title="Close" icon="close" variant="ghost" />
      <IconButton
        {...args}
        aria-label="Settings"
        icon="settings"
        title={({ icon, disabled, size }) => (
          <span>
            {icon ?? 'settings'}
            {' · '}
            {size}
            {disabled ? ' disabled' : ''}
          </span>
        )}
      />
    </Box>
  ),
}
