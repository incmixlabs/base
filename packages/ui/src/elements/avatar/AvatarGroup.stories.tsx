import type { Meta, StoryObj } from '@storybook/react-vite'
import { Avatar, AvatarGroup } from '@/elements'
import { SemanticColor } from '@/theme/props/color.prop'

const meta: Meta<typeof AvatarGroup> = {
  title: 'Elements/AvatarGroup',
  component: AvatarGroup,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2x'],
    },
    layout: {
      control: 'select',
      options: ['stack', 'spread'],
    },
    max: {
      control: 'number',
    },
    overflowHoverCard: {
      control: 'object',
    },
    hoverCard: {
      control: 'object',
    },
    showPresence: {
      control: 'boolean',
    },
  },
}

export default meta
type Story = StoryObj<typeof AvatarGroup>

export const Stack: Story = {
  args: {
    layout: 'stack',
    size: 'md',
  },
  render: args => (
    <AvatarGroup {...args}>
      <Avatar src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" />
      <Avatar src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face" />
      <Avatar src="https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop&crop=face" />
      <Avatar name="John Doe" />
      <Avatar name="Alice Smith" />
    </AvatarGroup>
  ),
}

export const Spread: Story = {
  args: {
    layout: 'spread',
    size: 'md',
  },
  render: args => (
    <AvatarGroup {...args}>
      <Avatar src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" />
      <Avatar src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face" />
      <Avatar src="https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop&crop=face" />
      <Avatar name="John Doe" />
      <Avatar name="Alice Smith" />
    </AvatarGroup>
  ),
}

export const Layouts: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium mb-2">Stack (overlapping)</p>
        <AvatarGroup layout="stack" size="md">
          <Avatar src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" />
          <Avatar src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face" />
          <Avatar src="https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop&crop=face" />
          <Avatar name="John Doe" />
        </AvatarGroup>
      </div>
      <div>
        <p className="text-sm font-medium mb-2">Spread (side by side)</p>
        <AvatarGroup layout="spread" size="md">
          <Avatar src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" />
          <Avatar src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face" />
          <Avatar src="https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop&crop=face" />
          <Avatar name="John Doe" />
        </AvatarGroup>
      </div>
    </div>
  ),
}

export const WithMax: Story = {
  args: {
    max: 3,
    size: 'md',
  },
  render: args => (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm font-medium mb-2">Stack with max {args.max}:</p>
        <AvatarGroup max={args.max} size={args.size} layout="stack">
          <Avatar src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" />
          <Avatar src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face" />
          <Avatar src="https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop&crop=face" />
          <Avatar name="John Doe" />
          <Avatar name="Alice Smith" />
          <Avatar name="Mary Kim" />
        </AvatarGroup>
      </div>
      <div>
        <p className="text-sm font-medium mb-2">Spread with max {args.max}:</p>
        <AvatarGroup max={args.max} size={args.size} layout="spread">
          <Avatar src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" />
          <Avatar src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face" />
          <Avatar src="https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop&crop=face" />
          <Avatar name="John Doe" />
          <Avatar name="Alice Smith" />
          <Avatar name="Mary Kim" />
        </AvatarGroup>
      </div>
      <div>
        <p className="text-sm font-medium mb-2">With overflow click handler:</p>
        <AvatarGroup
          max={args.max}
          size={args.size}
          layout="stack"
          onOverflowClick={(count, _items) => alert(`Clicked! ${count} more users`)}
        >
          <Avatar src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" />
          <Avatar src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face" />
          <Avatar src="https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop&crop=face" />
          <Avatar name="John Doe" />
          <Avatar name="Alice Smith" />
          <Avatar name="Mary Kim" />
          <Avatar name="Robert Brown" />
          <Avatar name="Lisa Chen" />
        </AvatarGroup>
      </div>
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-8">
      <div className="space-y-4">
        <p className="text-sm font-medium">Stack Layout</p>
        {(['xs', 'sm', 'md', 'lg', 'xl', '2x'] as const).map(size => (
          <div key={size} className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground w-12">{size}</span>
            <AvatarGroup size={size} layout="stack" max={4}>
              <Avatar src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" />
              <Avatar src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face" />
              <Avatar src="https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop&crop=face" />
              <Avatar name="John Doe" />
              <Avatar name="Alice Smith" />
            </AvatarGroup>
          </div>
        ))}
      </div>
      <div className="space-y-4">
        <p className="text-sm font-medium">Spread Layout</p>
        {(['xs', 'sm', 'md', 'lg', 'xl', '2x'] as const).map(size => (
          <div key={size} className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground w-12">{size}</span>
            <AvatarGroup size={size} layout="spread" max={4}>
              <Avatar src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" />
              <Avatar src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face" />
              <Avatar src="https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop&crop=face" />
              <Avatar name="John Doe" />
              <Avatar name="Alice Smith" />
            </AvatarGroup>
          </div>
        ))}
      </div>
    </div>
  ),
}

export const Presence: Story = {
  args: {
    size: 'md',
    layout: 'spread',
    showPresence: true,
  },
  render: args => (
    <AvatarGroup {...args}>
      <Avatar name="John Doe" presence="online" />
      <Avatar name="Jane Smith" presence="busy" />
      <Avatar name="Maya Lane" presence="offline" />
      <Avatar name="Nora Bell" presence="unknown" />
    </AvatarGroup>
  ),
}

export const OverflowHoverCard: Story = {
  args: {
    max: 3,
    size: 'md',
    layout: 'spread',
    overflowHoverCard: {
      title: 'Reviewers',
      color: SemanticColor.light,
      variant: 'surface',
    },
  },
  render: args => (
    <AvatarGroup {...args}>
      <Avatar name="John Doe" description="john@example.com" />
      <Avatar name="Jane Smith" description="jane@example.com" />
      <Avatar name="Bob Johnson" description="bob@example.com" />
      <Avatar name="Alice Brown" description="alice@example.com" />
      <Avatar name="Liam Park" description="liam@example.com" />
    </AvatarGroup>
  ),
}

export const GroupHoverCard: Story = {
  args: {
    max: 3,
    size: 'md',
    layout: 'spread',
    hoverCard: {
      title: 'Reviewers',
      color: SemanticColor.light,
      variant: 'surface',
    },
  },
  render: args => (
    <AvatarGroup {...args}>
      <Avatar name="John Doe" description="john@example.com" />
      <Avatar name="Jane Smith" description="jane@example.com" />
      <Avatar name="Bob Johnson" description="bob@example.com" />
      <Avatar name="Alice Brown" description="alice@example.com" />
      <Avatar name="Liam Park" description="liam@example.com" />
    </AvatarGroup>
  ),
}

export const StackHoverCard: Story = {
  args: {
    max: 3,
    size: 'md',
    layout: 'stack',
    hoverCard: {
      title: 'Reviewers',
      color: SemanticColor.light,
      variant: 'surface',
    },
  },
  render: args => (
    <AvatarGroup {...args}>
      <Avatar name="John Doe" description="john@example.com" />
      <Avatar name="Jane Smith" description="jane@example.com" />
      <Avatar name="Bob Johnson" description="bob@example.com" />
      <Avatar name="Alice Brown" description="alice@example.com" />
      <Avatar name="Liam Park" description="liam@example.com" />
    </AvatarGroup>
  ),
}
