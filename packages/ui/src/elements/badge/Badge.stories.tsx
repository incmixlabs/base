import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge, IconButton } from '@/elements'
import { badgePropDefs } from '@/elements/badge/badge.props'
import { getPropDefValues } from '@/theme/props/prop-def'
import { selectArgType } from '@/theme/props/storybook'

const labelForValue = (value: string) => `${value.charAt(0).toUpperCase()}${value.slice(1)}`

const meta: Meta<typeof Badge> = {
  title: 'Elements/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      ...selectArgType(badgePropDefs.size),
    },
    variant: {
      ...selectArgType(badgePropDefs.variant),
    },
    color: {
      ...selectArgType(badgePropDefs.color),
    },
    radius: {
      ...selectArgType(badgePropDefs.radius),
    },
    highContrast: {
      control: 'boolean',
    },
    hover: {
      control: 'boolean',
    },
    icon: {
      control: 'text',
    },
  },
}

export default meta
type Story = StoryObj<typeof Badge>

export const Playground: Story = {
  args: {
    children: 'Badge',
    size: 'sm',
    variant: 'soft',
    color: 'slate',
    radius: 'full',
    highContrast: false,
    hover: false,
  },
}

export const Default: Story = {
  args: {
    children: 'Badge',
    hover: false,
  },
}

export const WithIcon: Story = {
  args: {
    children: 'Info',
    icon: 'info',
    size: 'sm',
    variant: 'soft',
    color: 'info',
    radius: 'full',
    highContrast: false,
    hover: false,
  },
}

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      {getPropDefValues(badgePropDefs.size).map(size => (
        <Badge key={size} size={size}>
          Size {size}
        </Badge>
      ))}
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      {getPropDefValues(badgePropDefs.variant).map(variant => (
        <Badge key={variant} variant={variant}>
          {variant}
        </Badge>
      ))}
    </div>
  ),
}

export const Colors: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {getPropDefValues(badgePropDefs.variant).map(variant => (
        <div key={variant} className="flex items-center gap-2">
          <span className="w-16 text-sm capitalize">{variant}:</span>
          {getPropDefValues(badgePropDefs.color).map(color => (
            <Badge key={color} variant={variant} color={color}>
              {color}
            </Badge>
          ))}
        </div>
      ))}
    </div>
  ),
}

export const Radius: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      {getPropDefValues(badgePropDefs.radius).map(radius => (
        <Badge key={radius} radius={radius}>
          {radius}
        </Badge>
      ))}
    </div>
  ),
}

export const HighContrast: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Badge variant="soft">Normal</Badge>
      <Badge variant="soft" highContrast>
        High Contrast
      </Badge>
    </div>
  ),
}

export const SizeComparison: Story = {
  render: () => (
    <div className="space-y-6">
      {getPropDefValues(badgePropDefs.size).map(size => (
        <div key={size} className="space-y-2">
          <span className="text-xs text-muted font-mono">{size}</span>
          <div className="flex items-center gap-3">
            {getPropDefValues(badgePropDefs.variant).map(variant => (
              <Badge key={variant} size={size} variant={variant}>
                {labelForValue(variant)}
              </Badge>
            ))}
            <Badge size={size} variant="soft" color="success" className="gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
              Active
            </Badge>
            <Badge size={size} variant="solid" color="error" radius="full">
              3
            </Badge>
          </div>
        </div>
      ))}
    </div>
  ),
}

export const StatusBadges: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Badge color="success" variant="soft">
        Active
      </Badge>
      <Badge color="warning" variant="soft">
        Pending
      </Badge>
      <Badge color="error" variant="soft">
        Inactive
      </Badge>
      <Badge color="info" variant="soft">
        Processing
      </Badge>
    </div>
  ),
}

export const WithDot: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Badge color="success" variant="soft" className="gap-1.5">
        <span className="h-2 w-2 rounded-full bg-current" />
        Online
      </Badge>
      <Badge color="warning" variant="soft" className="gap-1.5">
        <span className="h-2 w-2 rounded-full bg-current" />
        Away
      </Badge>
      <Badge color="neutral" variant="soft" className="gap-1.5">
        <span className="h-2 w-2 rounded-full bg-current" />
        Offline
      </Badge>
    </div>
  ),
}

export const InContext: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h3 className="font-semibold">Project Status</h3>
        <Badge color="success" variant="soft" size="xs">
          Active
        </Badge>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm">Version</span>
        <Badge variant="outline" size="xs">
          v2.0.0
        </Badge>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm">Environment</span>
        <Badge color="info" variant="surface" size="xs">
          Production
        </Badge>
      </div>
      <div className="p-4 border rounded-lg">
        <div className="flex items-start justify-between">
          <div>
            <h4 className="font-medium">New Feature Request</h4>
            <p className="text-sm text-muted">Submitted 2 hours ago</p>
          </div>
          <div className="flex gap-2">
            <Badge color="primary" variant="soft" size="xs">
              Feature
            </Badge>
            <Badge color="warning" variant="soft" size="xs">
              High Priority
            </Badge>
          </div>
        </div>
      </div>
    </div>
  ),
}

export const BadgeWithAvatar: Story = {
  args: {
    variant: 'surface',
    size: 'xs',
    color: 'slate',
  },
  render: args => (
    <Badge {...args} avatar={{ name: 'Jane Doe' }}>
      Jane Doe
    </Badge>
  ),
}

export const BadgeWithDelete: Story = {
  args: {
    variant: 'surface',
    size: 'xs',
    color: 'slate',
  },
  render: args => (
    <Badge {...args} onDelete={() => undefined}>
      Filter: Active
    </Badge>
  ),
}

export const BadgeWithAvatarAndDelete: Story = {
  args: {
    variant: 'outline',
    size: 'xs',
    color: 'primary',
  },
  render: args => (
    <Badge {...args} onDelete={() => undefined} avatar={{ name: 'Alex Rivera' }}>
      Alex Rivera
    </Badge>
  ),
}
export const NotificationCount: Story = {
  render: () => (
    <div className="flex items-center gap-8">
      <div className="relative">
        <IconButton aria-label="Notifications" color="primary" size="lg" variant="outline" icon="bell" />
        <Badge color="error" variant="solid" size="xs" radius="full" className="absolute -top-3 -right-3">
          3
        </Badge>
      </div>
      <div className="relative">
        <IconButton aria-label="Messages" color="primary" size="lg" variant="outline" icon="mail" />
        <Badge color="primary" variant="solid" size="xs" radius="full" className="absolute -top-3 -right-2">
          12
        </Badge>
      </div>
    </div>
  ),
}
