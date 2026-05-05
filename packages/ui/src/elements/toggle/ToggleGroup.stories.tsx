import type { Meta, StoryObj } from '@storybook/react-vite'
import { AlignCenter, AlignLeft, AlignRight, Bold, Italic, Underline } from 'lucide-react'
import type { ComponentProps } from 'react'
import { Box } from '@/layouts/box/Box'
import { selectArgType } from '@/theme/props/storybook'
import { ToggleGroup } from './Toggle'
import { togglePropDefs } from './toggle.props'

type ToggleGroupRootProps = ComponentProps<typeof ToggleGroup.Root>

function FormattingToggleGroup(args: ToggleGroupRootProps) {
  return (
    <ToggleGroup.Root {...args}>
      <ToggleGroup.Item value="bold" aria-label="Bold">
        <Bold className="h-4 w-4" />
      </ToggleGroup.Item>
      <ToggleGroup.Item value="italic" aria-label="Italic">
        <Italic className="h-4 w-4" />
      </ToggleGroup.Item>
      <ToggleGroup.Item value="underline" aria-label="Underline">
        <Underline className="h-4 w-4" />
      </ToggleGroup.Item>
    </ToggleGroup.Root>
  )
}

function AlignmentToggleGroup(args: ToggleGroupRootProps) {
  return (
    <ToggleGroup.Root {...args}>
      <ToggleGroup.Item value="left" aria-label="Align left">
        <AlignLeft className="h-4 w-4" />
      </ToggleGroup.Item>
      <ToggleGroup.Item value="center" aria-label="Align center">
        <AlignCenter className="h-4 w-4" />
      </ToggleGroup.Item>
      <ToggleGroup.Item value="right" aria-label="Align right">
        <AlignRight className="h-4 w-4" />
      </ToggleGroup.Item>
    </ToggleGroup.Root>
  )
}

const meta: Meta<typeof ToggleGroup.Root> = {
  title: 'Elements/ToggleGroup',
  component: ToggleGroup.Root,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: selectArgType(togglePropDefs.size),
    variant: selectArgType(togglePropDefs.variant),
    color: selectArgType(togglePropDefs.color),
    radius: selectArgType(togglePropDefs.radius),
    highContrast: { control: 'boolean' },
    disabled: { control: 'boolean' },
    flush: { control: 'boolean' },
    multiple: { control: 'boolean' },
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
    defaultValue: { control: false },
    value: { control: false },
    onValueChange: { control: false },
    children: { control: false },
  },
  args: {
    size: 'xs',
    variant: 'solid',
    color: 'slate',
    radius: 'sm',
    highContrast: false,
    disabled: false,
    flush: true,
    multiple: true,
    orientation: 'horizontal',
    defaultValue: ['bold'],
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  argTypes: {
    defaultValue: {
      control: 'check',
      options: ['bold', 'italic', 'underline'],
    },
  },
  render: args => <FormattingToggleGroup key={JSON.stringify(args)} {...args} />,
}

export const TextFormatting: Story = {
  args: {
    multiple: true,
    defaultValue: ['bold'],
  },
  argTypes: {
    defaultValue: {
      control: 'check',
      options: ['bold', 'italic', 'underline'],
    },
  },
  render: args => <FormattingToggleGroup key={JSON.stringify(args)} {...args} />,
}

export const Alignment: Story = {
  args: {
    multiple: false,
    defaultValue: ['center'],
  },
  argTypes: {
    defaultValue: {
      control: 'check',
      options: ['left', 'center', 'right'],
    },
  },
  render: args => <AlignmentToggleGroup key={JSON.stringify(args)} {...args} />,
}

export const Variants: Story = {
  render: () => (
    <Box display="flex" className="items-center gap-4">
      <FormattingToggleGroup variant="soft" multiple defaultValue={['bold']} />
      <FormattingToggleGroup variant="solid" multiple defaultValue={['bold']} />
    </Box>
  ),
}
