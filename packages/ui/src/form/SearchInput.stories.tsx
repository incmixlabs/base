import type { Meta, StoryObj } from '@storybook/react-vite'
import { Box } from '@/layouts/box/Box'
import { colorPropDef, SemanticColor } from '@/theme/props/color.prop'
import { getPropDefValues } from '@/theme/props/prop-def'
import { radiusPropDef } from '@/theme/props/radius.prop'
import { textFieldTokens } from '@/theme/tokens'
import { SearchInput } from './SearchInput'
import { textFieldSizes, textFieldVariants } from './text-field.props'

const meta: Meta<typeof SearchInput> = {
  title: 'Form/SearchInput',
  component: SearchInput,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  args: {
    size: 'md',
    variant: 'outline',
    radius: 'md',
    color: SemanticColor.slate,
    error: false,
    disabled: false,
    placeholder: 'Search...',
  },
  argTypes: {
    size: {
      control: 'select',
      options: [...textFieldSizes],
    },
    variant: {
      control: 'select',
      options: [...textFieldVariants, ...textFieldTokens.floatingVariant],
    },
    color: {
      control: 'select',
      options: getPropDefValues(colorPropDef.color),
    },
    radius: {
      control: 'select',
      options: getPropDefValues(radiusPropDef.radius),
    },
    label: {
      control: 'text',
    },
    error: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const FloatingOutlined: Story = {
  args: {
    label: 'Search projects',
    variant: 'floating-outlined',
  },
}

export const AllVariants: Story = {
  render: () => (
    <Box display="flex" className="max-w-md flex-col gap-4">
      <SearchInput variant="outline" placeholder="Outline search" />
      <SearchInput variant="soft" placeholder="Soft search" />
      <SearchInput variant="solid" placeholder="Solid search" />
      <SearchInput variant="ghost" placeholder="Ghost search" />
      <SearchInput variant="floating-filled" label="Filled search" />
      <SearchInput variant="floating-outlined" label="Outlined search" />
      <SearchInput variant="floating-standard" label="Standard search" />
    </Box>
  ),
}

export const Sizes: Story = {
  render: () => (
    <Box display="flex" className="max-w-md flex-col gap-4">
      {textFieldSizes.map(size => (
        <SearchInput key={size} size={size} placeholder={`Search size ${size}`} />
      ))}
    </Box>
  ),
}

export const ColorsAndRadius: Story = {
  render: () => (
    <Box display="flex" className="max-w-md flex-col gap-4">
      <SearchInput color="slate" radius="sm" placeholder="Slate / sm" />
      <SearchInput color="primary" radius="md" placeholder="Primary / md" />
      <SearchInput color="success" radius="lg" placeholder="Success / lg" />
      <SearchInput color="warning" radius="full" placeholder="Warning / full" />
    </Box>
  ),
}
