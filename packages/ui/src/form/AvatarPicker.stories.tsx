import type { Meta, StoryObj } from '@storybook/react-vite'
import * as React from 'react'
import { Label } from '@/form'
import { colorPropDef, SemanticColor } from '@/theme/props/color.prop'
import { getPropDefValues } from '@/theme/props/prop-def'
import { type AvatarItem, AvatarPicker, type AvatarPickerProps } from './AvatarPicker'
import { avatarPickerPropDefs } from './avatar-picker.props'

const sampleItems: AvatarItem[] = [
  { id: '1', name: 'John Doe', description: 'john@example.com' },
  { id: '2', name: 'Jane Smith', description: 'jane@example.com' },
  { id: '3', name: 'Bob Johnson', description: 'bob@example.com' },
  { id: '4', name: 'Alice Williams', description: 'alice@example.com' },
  { id: '5', name: 'Charlie Brown', description: 'charlie@example.com' },
  { id: '6', name: 'Diana Ross', description: 'diana@example.com' },
  { id: '7', name: 'Eve Anderson', description: 'eve@example.com' },
  { id: '8', name: 'Frank Miller', description: 'frank@example.com' },
]

const itemsWithAvatars: AvatarItem[] = [
  { id: '1', name: 'John Doe', description: 'john@example.com', avatar: 'https://i.pravatar.cc/150?u=john' },
  { id: '2', name: 'Jane Smith', description: 'jane@example.com', avatar: 'https://i.pravatar.cc/150?u=jane' },
  { id: '3', name: 'Bob Johnson', description: 'bob@example.com', avatar: 'https://i.pravatar.cc/150?u=bob' },
  { id: '4', name: 'Alice Williams', description: 'alice@example.com', avatar: 'https://i.pravatar.cc/150?u=alice' },
  { id: '5', name: 'Eve Anderson', description: 'eve@example.com', avatar: 'https://i.pravatar.cc/150?u=eve' },
  { id: '6', name: 'Frank Miller', description: 'frank@example.com', avatar: 'https://i.pravatar.cc/150?u=frank' },
]

function AvatarPickerStoryWrapper(props: AvatarPickerProps) {
  const { multiple = false } = props
  const [value, setValue] = React.useState<string | string[]>(multiple ? [] : '')

  React.useEffect(() => {
    setValue(multiple ? [] : '')
  }, [multiple])

  return (
    <div className="w-80 space-y-2">
      <Label>{multiple ? 'Team members' : 'Assign to'}</Label>
      <AvatarPicker {...props} value={value} onValueChange={setValue} />
    </div>
  )
}

const meta: Meta<typeof AvatarPicker> = {
  title: 'Form/AvatarPicker',
  component: AvatarPicker,
  parameters: {
    layout: 'centered',
  },
  args: {
    items: itemsWithAvatars,
    placeholder: 'Select person...',
    searchPlaceholder: 'Search people...',
    size: avatarPickerPropDefs.size.default,
    highlightColor: SemanticColor.slate,
    multiple: false,
    disabled: false,
    searchable: true,
    maxHeight: 300,
    noResultsText: 'No results found',
    showHoverCard: true,
  },
  argTypes: {
    items: { control: false },
    value: { control: false },
    onValueChange: { control: false },
    renderItem: { control: false },
    size: {
      control: 'select',
      options: avatarPickerPropDefs.size.values,
    },
    highlightColor: {
      control: 'select',
      options: getPropDefValues(colorPropDef.color),
    },
    multiple: { control: 'boolean' },
    disabled: { control: 'boolean' },
    searchable: { control: 'boolean' },
    placeholder: { control: 'text' },
    searchPlaceholder: { control: 'text' },
    noResultsText: { control: 'text' },
    showHoverCard: { control: 'boolean' },
    maxHeight: { control: { type: 'number', min: 120, max: 480, step: 20 } },
    className: { control: false },
  },
}

export default meta
type Story = StoryObj<typeof AvatarPicker>

export const Playground: Story = {
  render: args => <AvatarPickerStoryWrapper {...args} />,
}

export const Default: Story = {
  render: args => <AvatarPickerStoryWrapper {...args} items={itemsWithAvatars} />,
}

export const Multiple: Story = {
  render: args => (
    <AvatarPickerStoryWrapper {...args} items={itemsWithAvatars} multiple placeholder="Select team members..." />
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="w-80 space-y-4">
      {avatarPickerPropDefs.size.values.map(size => (
        <div key={size} className="space-y-1">
          <Label>Size {size}</Label>
          <AvatarPickerStoryWrapper items={itemsWithAvatars} size={size} />
        </div>
      ))}
    </div>
  ),
}

export const HighlightColors: Story = {
  render: () => {
    const colors = [
      SemanticColor.slate,
      SemanticColor.primary,
      SemanticColor.info,
      SemanticColor.success,
      SemanticColor.warning,
      SemanticColor.error,
    ] as const

    return (
      <div className="w-80 space-y-4">
        {colors.map(color => (
          <div key={color} className="space-y-1">
            <Label className="capitalize">{color}</Label>
            <AvatarPickerStoryWrapper items={itemsWithAvatars} highlightColor={color} />
          </div>
        ))}
      </div>
    )
  },
}

export const WithoutSearch: Story = {
  args: {
    searchable: false,
    items: sampleItems.slice(0, 4),
  },
  render: args => <AvatarPickerStoryWrapper {...args} />,
}

export const Disabled: Story = {
  render: () => (
    <div className="w-80 space-y-2">
      <Label>Assigned (read-only)</Label>
      <AvatarPicker items={itemsWithAvatars} value="1" disabled placeholder="Cannot change..." />
    </div>
  ),
}

export const InFieldLayout: Story = {
  render: () => {
    const [assignee, setAssignee] = React.useState<string | string[]>('')

    return (
      <div className="w-80 space-y-2">
        <Label>Assignee</Label>
        <div className="text-sm text-muted-foreground">Choose the person responsible for this task.</div>
        <AvatarPicker items={itemsWithAvatars} value={assignee} onValueChange={setAssignee} />
      </div>
    )
  },
}

export const IdentityHoverCards: Story = {
  render: () => (
    <div className="w-80 space-y-2">
      <Label>Review owner</Label>
      <AvatarPicker items={itemsWithAvatars} value="2" showHoverCard />
    </div>
  ),
}
