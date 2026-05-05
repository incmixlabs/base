import type { Meta, StoryObj } from '@storybook/react-vite'
import type * as React from 'react'
import { Avatar, AvatarPie } from '@/elements'

type StoryAvatar = {
  id: string
  name: string
  src?: string
}

const imageAvatars: StoryAvatar[] = [
  {
    id: 'maya',
    name: 'Maya',
    src: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=160&h=160&fit=crop&crop=face',
  },
  {
    id: 'nora',
    name: 'Nora',
    src: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=160&h=160&fit=crop&crop=face',
  },
  {
    id: 'omar',
    name: 'Omar',
    src: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=160&h=160&fit=crop&crop=face',
  },
  {
    id: 'zoe',
    name: 'Zoe',
    src: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=160&h=160&fit=crop&crop=face',
  },
  {
    id: 'liam',
    name: 'Liam',
    src: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&h=160&fit=crop&crop=face',
  },
  { id: 'iris', name: 'Iris' },
  { id: 'noah', name: 'Noah' },
  { id: 'kai', name: 'Kai' },
  { id: 'elle', name: 'Elle' },
  { id: 'paz', name: 'Paz' },
  { id: 'quinn', name: 'Quinn' },
  { id: 'rhea', name: 'Rhea' },
]

const twoLetterAvatars: StoryAvatar[] = [
  { id: 'maya', name: 'Maya Ash' },
  { id: 'nora', name: 'Nell Ember' },
  { id: 'omar', name: 'Owen Birch' },
  { id: 'zoe', name: 'Zia Vale' },
  { id: 'liam', name: 'Luca Dawn' },
]

const oneLetterAvatars: StoryAvatar[] = [
  { id: 'maya', name: 'Maya' },
  { id: 'nora', name: 'Nora' },
  { id: 'omar', name: 'Omar' },
  { id: 'zoe', name: 'Zoe' },
  { id: 'liam', name: 'Liam' },
]

type AvatarPieStoryArgs = React.ComponentProps<typeof AvatarPie> & {
  avatarCount?: number
  useImages?: boolean
}

const meta: Meta<AvatarPieStoryArgs> = {
  title: 'Elements/AvatarPie',
  component: AvatarPie,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'AvatarPie composes up to three visible slices in a circular surface. For counts above three, it shows the first two avatars and an overflow slice such as `2+`, `3+`, `9+`, or `+`.',
      },
    },
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2x'],
    },
    avatarCount: {
      control: 'number',
    },
    useImages: {
      control: 'boolean',
    },
  },
}

export default meta
type Story = StoryObj<AvatarPieStoryArgs>

export const Playground: Story = {
  args: {
    size: 'lg',
    avatarCount: 5,
    useImages: true,
  },
  render: ({ avatarCount = 5, useImages = true, ...args }) => {
    const count = Math.max(1, Math.min(imageAvatars.length, avatarCount))
    const avatars = imageAvatars.slice(0, count)

    return (
      <div className="flex items-center gap-4">
        <AvatarPie {...args}>
          {avatars.map(avatar => (
            <Avatar key={avatar.id} name={avatar.name} src={useImages ? avatar.src : undefined} />
          ))}
        </AvatarPie>
        <span className="text-sm text-muted-foreground">Count {count}</span>
      </div>
    )
  },
}

export const TwoUp: Story = {
  args: {
    size: 'lg',
  },
  render: args => (
    <AvatarPie {...args}>
      <Avatar name="Maya" />
      <Avatar name="Nora" />
    </AvatarPie>
  ),
}

export const ThreeUp: Story = {
  args: {
    size: 'lg',
  },
  render: args => (
    <AvatarPie {...args}>
      <Avatar name="Maya" />
      <Avatar name="Nora" />
      <Avatar name="Omar" />
    </AvatarPie>
  ),
}

export const OneLetterFallbacks: Story = {
  args: {
    size: 'lg',
    avatarCount: 3,
  },
  render: ({ avatarCount = 3, ...args }) => (
    <AvatarPie {...args}>
      {oneLetterAvatars.slice(0, avatarCount).map(avatar => (
        <Avatar key={avatar.id} name={avatar.name} />
      ))}
    </AvatarPie>
  ),
}

export const TwoLetterFallbacks: Story = {
  args: {
    size: 'lg',
    avatarCount: 3,
  },
  render: ({ avatarCount = 3, ...args }) => (
    <AvatarPie {...args}>
      {twoLetterAvatars.slice(0, avatarCount).map(avatar => (
        <Avatar key={avatar.id} name={avatar.name} />
      ))}
    </AvatarPie>
  ),
}

export const WithImages: Story = {
  args: {
    size: 'lg',
    avatarCount: 3,
  },
  render: ({ avatarCount = 3, ...args }) => (
    <AvatarPie {...args}>
      {imageAvatars.slice(0, avatarCount).map(avatar => (
        <Avatar key={avatar.id} name={avatar.name} src={avatar.src} />
      ))}
    </AvatarPie>
  ),
}

export const OverflowCounts: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      {[4, 5, 11, 12].map(count => (
        <div key={count} className="flex flex-col items-center gap-2">
          <AvatarPie size="lg">
            {imageAvatars.slice(0, count).map(avatar => (
              <Avatar key={`${count}-${avatar.id}`} name={avatar.name} src={avatar.src} />
            ))}
          </AvatarPie>
          <span className="text-xs text-muted-foreground">{count} avatars</span>
        </div>
      ))}
    </div>
  ),
}

export const HoverCardList: Story = {
  args: {
    size: 'lg',
    hoverCard: { title: 'Selected people' },
  },
  render: args => (
    <AvatarPie {...args}>
      <Avatar name="Maya Lane" description="maya@example.com" src={imageAvatars[0].src} />
      <Avatar name="Nora Bell" description="nora@example.com" src={imageAvatars[1].src} />
      <Avatar
        name="Omar Diaz"
        description="omar@example.com"
        src={imageAvatars[2].src}
        hoverCard={{ title: 'Approver', presence: 'busy', managerId: 'security' }}
      />
      <Avatar name="Zoe Park" description="zoe@example.com" src={imageAvatars[3].src} />
    </AvatarPie>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      {(['xs', 'sm', 'md', 'lg', 'xl', '2x'] as const).map(size => (
        <AvatarPie key={size} size={size}>
          <Avatar name="Maya" src={imageAvatars[0].src} />
          <Avatar name="Nora" src={imageAvatars[1].src} />
          <Avatar name="Omar" src={imageAvatars[2].src} />
        </AvatarPie>
      ))}
    </div>
  ),
}
