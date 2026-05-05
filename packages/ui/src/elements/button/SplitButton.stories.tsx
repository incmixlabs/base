import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Box } from '@/layouts/box/Box'
import { SemanticColor } from '@/theme/props/color.prop'
import { getPropDefValues } from '@/theme/props/prop-def'
import { selectArgType } from '@/theme/props/storybook'
import { DropdownMenu } from '../menu/DropdownMenu'
import { SplitButton, type SplitButtonItem, type SplitButtonProps } from './SplitButton'
import { splitButtonPropDefs } from './split-button.props'

/** Reusable controlled wrapper for stories that need selection state. */
function ControlledSplitButton(props: SplitButtonProps) {
  const [value, setValue] = useState(props.defaultValue ?? props.items[0]?.id)
  return <SplitButton {...props} value={value} onValueChange={setValue} />
}

const issueCloseItems: SplitButtonItem[] = [
  {
    id: 'completed',
    label: 'Close as completed',
    description: 'Done, closed, fixed, resolved',
    icon: 'circle-check-big',
  },
  {
    id: 'not-planned',
    label: 'Close as not planned',
    description: "Won't fix, can't repro, stale",
    icon: 'circle-slash',
  },
  {
    id: 'duplicate',
    label: 'Close as duplicate',
    description: 'Duplicate of another issue',
    icon: 'circle-slash',
    children: (
      <>
        <DropdownMenu.Label>Select duplicate issue</DropdownMenu.Label>
        <DropdownMenu.Item onClick={() => console.log('Issue #101')}>Issue #101 - Login bug</DropdownMenu.Item>
        <DropdownMenu.Item onClick={() => console.log('Issue #203')}>Issue #203 - Auth failure</DropdownMenu.Item>
        <DropdownMenu.Item onClick={() => console.log('Issue #305')}>Issue #305 - Session timeout</DropdownMenu.Item>
      </>
    ),
  },
]

const meta: Meta<typeof SplitButton> = {
  title: 'Elements/SplitButton',
  component: SplitButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      ...selectArgType(splitButtonPropDefs.size),
      description: 'Button size',
    },
    variant: {
      ...selectArgType(splitButtonPropDefs.variant),
      description: 'Visual variant',
    },
    color: {
      ...selectArgType(splitButtonPropDefs.color),
      description: 'Color scheme',
    },
    radius: {
      ...selectArgType(splitButtonPropDefs.radius),
      description: 'Border radius',
    },
    loading: {
      control: 'boolean',
      description: 'Loading state',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
    highContrast: {
      control: 'boolean',
      description: 'High contrast mode',
    },
    inverse: {
      control: 'boolean',
      description: 'Inverse text treatment',
    },
    iconStart: {
      control: 'text',
      description: 'Override start icon',
    },
    iconEnd: {
      control: 'text',
      description: 'Override end icon',
    },
    menuSize: {
      ...selectArgType(splitButtonPropDefs.menuSize),
      description: 'Dropdown menu size',
    },
    menuAlign: {
      ...selectArgType(splitButtonPropDefs.menuAlign),
      description: 'Dropdown alignment',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// No props - verifies defaults (color: primary, variant: soft)
export const NoProps: Story = {
  args: {
    items: [
      { id: 'one', label: 'Option one' },
      { id: 'two', label: 'Option two' },
      { id: 'three', label: 'Option three' },
    ],
  },
}

// Default - GitHub-style issue close
export const Default: Story = {
  args: {
    items: issueCloseItems,
    defaultValue: 'completed',
    variant: 'soft',
    color: SemanticColor.slate,
  },
  render: args => <ControlledSplitButton {...args} onAction={item => console.log('Action:', item.id, item.label)} />,
}

// Controlled with selected duplicate
export const SelectedWithChildren: Story = {
  args: {
    items: issueCloseItems,
    defaultValue: 'duplicate',
    variant: 'soft',
  },
  render: args => <ControlledSplitButton {...args} onAction={item => console.log('Action:', item.id)} />,
}

// Simple items (no icons, no descriptions, no children)
const simpleItems: SplitButtonItem[] = [
  { id: 'merge', label: 'Merge' },
  { id: 'squash', label: 'Squash and merge' },
  { id: 'rebase', label: 'Rebase and merge' },
]

export const Simple: Story = {
  args: {
    items: simpleItems,
    defaultValue: 'merge',
    variant: 'solid',
    color: SemanticColor.success,
  },
  render: args => <ControlledSplitButton {...args} onAction={item => console.log('Merge action:', item.id)} />,
}

// With icon overrides
export const WithIconOverride: Story = {
  args: {
    items: simpleItems,
    defaultValue: 'merge',
    variant: 'solid',
    color: SemanticColor.primary,
    iconStart: 'git-merge',
  },
  render: args => <ControlledSplitButton {...args} onAction={item => console.log('Action:', item.id)} />,
}

// All sizes
export const AllSizes: Story = {
  render: () => (
    <Box display="flex" className="flex-col gap-4 items-start">
      {getPropDefValues(splitButtonPropDefs.size).map(size => (
        <SplitButton
          key={size}
          items={simpleItems}
          defaultValue="merge"
          size={size}
          variant="solid"
          color={SemanticColor.success}
          onAction={item => console.log(size, item.id)}
        />
      ))}
    </Box>
  ),
}

// All variants
export const AllVariants: Story = {
  render: () => (
    <Box display="flex" className="gap-4 flex-wrap">
      <SplitButton items={simpleItems} defaultValue="merge" variant="solid" />
      <SplitButton items={simpleItems} defaultValue="merge" variant="soft" />
      <SplitButton items={simpleItems} defaultValue="merge" variant="outline" />
      <SplitButton items={simpleItems} defaultValue="merge" variant="ghost" />
    </Box>
  ),
}

// All colors with solid variant
export const AllColorsSolid: Story = {
  render: () => (
    <Box display="flex" className="gap-4 flex-wrap">
      <SplitButton items={simpleItems} defaultValue="merge" color={SemanticColor.primary} variant="solid" />
      <SplitButton items={simpleItems} defaultValue="merge" color={SemanticColor.success} variant="solid" />
      <SplitButton items={simpleItems} defaultValue="merge" color={SemanticColor.warning} variant="solid" />
      <SplitButton items={simpleItems} defaultValue="merge" color={SemanticColor.error} variant="solid" />
      <SplitButton items={simpleItems} defaultValue="merge" color={SemanticColor.info} variant="solid" />
    </Box>
  ),
}

// Disabled
export const Disabled: Story = {
  args: {
    items: simpleItems,
    defaultValue: 'merge',
    variant: 'solid',
    color: SemanticColor.success,
    disabled: true,
  },
}

// Loading
export const Loading: Story = {
  args: {
    items: simpleItems,
    defaultValue: 'merge',
    variant: 'solid',
    color: SemanticColor.success,
    loading: true,
  },
}
