import type { Meta, StoryObj } from '@storybook/react-vite'
import { avatarPickerSizes } from '@/form/avatar-picker.props'
import { AvatarList } from './AvatarList'
import type { AvatarListItem } from './avatar-list.props'

const items: AvatarListItem[] = [
  {
    id: '1',
    name: 'Annie Case',
    title: 'Design Lead',
    email: 'annie@example.com',
    presence: 'online',
  },
  {
    id: '2',
    name: 'Marco Reed',
    title: 'Frontend Engineer',
    email: 'marco@example.com',
    presence: 'busy',
  },
  {
    id: '3',
    name: 'Priya Shah',
    title: 'Product Manager',
    email: 'priya@example.com',
    presence: 'offline',
  },
]

const meta: Meta<typeof AvatarList> = {
  title: 'Elements/AvatarList',
  component: AvatarList,
  args: {
    items,
    size: 'sm',
  },
}

export default meta

type Story = StoryObj<typeof AvatarList>

export const Default: Story = {}

export const Sizes: Story = {
  render: args => (
    <div style={{ display: 'grid', gap: '0.75rem', alignContent: 'start' }}>
      {avatarPickerSizes.map(size => (
        <div key={size} style={{ display: 'grid', gap: '0.375rem' }}>
          <div
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--color-slate-text)',
            }}
          >
            {size}
          </div>
          <AvatarList {...args} size={size} />
        </div>
      ))}
    </div>
  ),
}

export const Selectable: Story = {
  render: args => <AvatarList {...args} selectable />,
}
