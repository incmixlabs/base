import type { Meta, StoryObj } from '@storybook/react-vite'
import { Avatar, AvatarProvider } from '@/elements'
import { avatarPropDefs } from '@/elements/avatar/avatar.props'
import { Image } from '@/elements/image/Image'
import { AspectRatio } from '@/layouts'
import { getPropDefValues } from '@/theme/props/prop-def'
import { Text } from '@/typography'

const meta: Meta<typeof Avatar> = {
  title: 'Elements/Avatar',
  component: Avatar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Avatar displays a user image with automatic fallback behavior. When `name` is provided, initials are shown while the image loads or when it fails, and a deterministic hue is computed from the name. `AvatarProvider` controls group defaults like `colorMode` (`soft`/`solid`) and `radius`.',
      },
    },
  },
  argTypes: {
    id: {
      control: 'text',
    },
    src: {
      control: 'text',
    },
    alt: {
      control: 'text',
    },
    name: {
      control: 'text',
    },
    description: {
      control: 'text',
    },
    size: {
      control: 'select',
      options: getPropDefValues(avatarPropDefs.size),
    },
    radius: {
      control: 'select',
      options: getPropDefValues(avatarPropDefs.radius),
    },
  },
}

export default meta
type Story = StoryObj<typeof Avatar>

export const Default: Story = {
  args: {
    src: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    alt: 'User avatar',
  },
}

export const WithName: Story = {
  args: {
    name: 'John Doe',
  },
}

export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-4">
      {(['xs', 'sm', 'md', 'lg', 'xl', '2x'] as const).map(size => (
        <Avatar
          key={size}
          size={size}
          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
        />
      ))}
    </div>
  ),
}

export const FallbackSizes: Story = {
  render: () => (
    <div className="flex items-end gap-4">
      {(['xs', 'sm', 'md', 'lg', 'xl', '2x'] as const).map(size => (
        <Avatar key={size} size={size} name="John Doe" />
      ))}
    </div>
  ),
}

export const SoftMode: Story = {
  name: 'Color Mode: Soft (default)',
  render: () => (
    <AvatarProvider colorMode="soft">
      <div className="flex gap-3">
        {['Alice Walker', 'Bob Chen', 'Charlie Davis', 'Diana Evans', 'Edward Fox', 'Fiona Grant'].map(name => (
          <Avatar key={name} size="lg" name={name} />
        ))}
      </div>
    </AvatarProvider>
  ),
}

export const SolidMode: Story = {
  name: 'Color Mode: Solid',
  render: () => (
    <AvatarProvider colorMode="solid">
      <div className="flex gap-3">
        {['Alice Walker', 'Bob Chen', 'Charlie Davis', 'Diana Evans', 'Edward Fox', 'Fiona Grant'].map(name => (
          <Avatar key={name} size="lg" name={name} />
        ))}
      </div>
    </AvatarProvider>
  ),
}

export const Radius: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      {(['none', 'sm', 'md', 'lg', 'full'] as const).map(radius => (
        <Avatar key={radius} radius={radius} name="John Doe" size="lg" />
      ))}
    </div>
  ),
}

export const RadiusFromProvider: Story = {
  name: 'Radius from Provider',
  render: () => (
    <div className="flex flex-col gap-4">
      {(['none', 'sm', 'md', 'lg', 'full'] as const).map(radius => (
        <div key={radius} className="flex items-center gap-4">
          <span className="text-sm w-12 text-muted-foreground">{radius}</span>
          <AvatarProvider radius={radius}>
            <div className="flex gap-2">
              {['Alice', 'Bob', 'Charlie', 'Diana', 'Edward', 'Fiona'].map(name => (
                <Avatar key={name} size="md" name={name} />
              ))}
            </div>
          </AvatarProvider>
        </div>
      ))}
    </div>
  ),
}

export const BrokenImage: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar src="https://broken-link.com/image.jpg" name="John Doe" />
      <Avatar src="https://broken-link.com/image.jpg" name="Alice Smith" />
      <Avatar src="https://broken-link.com/image.jpg" />
    </div>
  ),
}

export const UserCard: Story = {
  render: () => (
    <div className="flex items-center gap-3 p-4 border rounded-lg w-72">
      <Avatar
        size="lg"
        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
        name="John Doe"
      />
      <div>
        <p className="font-medium">John Doe</p>
        <p className="text-sm text-muted-foreground">john@example.com</p>
      </div>
    </div>
  ),
}

export const AvatarHoverCard: Story = {
  render: () => (
    <Avatar
      size="lg"
      name="John Doe"
      title="Staff engineer, Platform"
      email="john@example.com"
      presence="online"
      showPresence
      hoverCard={{
        presence: 'online',
      }}
    />
  ),
}

export const Presence: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar name="John Doe" presence="online" showPresence />
      <Avatar name="Jane Smith" presence="busy" showPresence />
      <Avatar name="Maya Lane" presence="offline" showPresence />
      <Avatar name="Nora Bell" presence="unknown" showPresence />
    </div>
  ),
}

export const CustomHoverCard: Story = {
  render: () => (
    <Avatar
      size="lg"
      radius="none"
      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
      name="John Doe"
      title="Staff engineer"
      email="john@example.com"
      hoverCard={{ presence: 'online' }}
      renderHoverCard={({ avatar, title, email, presence }) => (
        <div className="flex min-w-56 items-start gap-3 rounded-xl border border-neutral-200 bg-white p-3 shadow-sm">
          {avatar?.src ? (
            <AspectRatio ratio="1/1" className="w-12">
              <Image src={avatar.src} alt={avatar.name ?? 'Avatar'} className="h-full w-full" />
            </AspectRatio>
          ) : null}
          <div className="min-w-0">
            <Text size="sm" weight="medium">
              {title}
            </Text>
            <Text size="sm" color="neutral" className="mt-1">
              {email}
            </Text>
            <Text size="xs" className="mt-2 uppercase tracking-[0.12em] text-teal-700">
              {presence}
            </Text>
          </div>
        </div>
      )}
    />
  ),
}

export const CommentThread: Story = {
  render: () => (
    <div className="space-y-4 w-96">
      <div className="flex gap-3">
        <Avatar size="md" name="John Doe" />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">John Doe</span>
            <span className="text-xs text-muted-foreground">2 hours ago</span>
          </div>
          <p className="text-sm mt-1">This looks great! I love the new design direction.</p>
        </div>
      </div>
      <div className="flex gap-3 ml-8">
        <Avatar size="sm" name="Jane Smith" />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">Jane Smith</span>
            <span className="text-xs text-muted-foreground">1 hour ago</span>
          </div>
          <p className="text-sm mt-1">Thanks! Let me know if you have any suggestions.</p>
        </div>
      </div>
    </div>
  ),
}
