import type { Meta, StoryObj } from '@storybook/react-vite'
import { Copy, Search, Settings, Trash2 } from 'lucide-react'
import { Box } from '@/layouts/box/Box'
import { selectArgType } from '@/theme/props/storybook'
import { IconButton } from './IconButton'
import { iconButtonPropDefs } from './icon-button.props'

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
      <IconButton aria-label="Solid" variant="solid">
        <Search className="h-4 w-4" />
      </IconButton>
      <IconButton aria-label="Soft" variant="soft">
        <Copy className="h-4 w-4" />
      </IconButton>
      <IconButton aria-label="Outline" variant="outline">
        <Settings className="h-4 w-4" />
      </IconButton>
      <IconButton aria-label="Ghost" variant="ghost">
        <Trash2 className="h-4 w-4" />
      </IconButton>
    </Box>
  ),
}

export const Sizes: Story = {
  render: () => (
    <Box display="flex" className="items-center gap-3">
      <IconButton aria-label="Small" size="sm">
        <Search className="h-3 w-3" />
      </IconButton>
      <IconButton aria-label="Medium" size="md">
        <Search className="h-4 w-4" />
      </IconButton>
      <IconButton aria-label="Large" size="lg">
        <Search className="h-5 w-5" />
      </IconButton>
      <IconButton aria-label="Extra Large" size="xl">
        <Search className="h-6 w-6" />
      </IconButton>
    </Box>
  ),
}

export const Radius: Story = {
  render: () => (
    <Box display="flex" className="items-center gap-3">
      <IconButton aria-label="none" radius="none" variant="soft">
        <Search className="h-4 w-4" />
      </IconButton>
      <IconButton aria-label="sm" radius="sm" variant="soft">
        <Search className="h-4 w-4" />
      </IconButton>
      <IconButton aria-label="md" radius="md" variant="soft">
        <Search className="h-4 w-4" />
      </IconButton>
      <IconButton aria-label="lg" radius="lg" variant="soft">
        <Search className="h-4 w-4" />
      </IconButton>
      <IconButton aria-label="full" radius="full" variant="soft">
        <Search className="h-4 w-4" />
      </IconButton>
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
