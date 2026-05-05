import type { Meta, StoryObj } from '@storybook/react-vite'
import { MoreHorizontal } from 'lucide-react'
import { Button, IconButton } from '@/elements'
import { Popover } from './Popover'
import { PopoverWrapper } from './PopoverWrapper'
import type { PopoverWrapperData, PopoverWrapperProps } from './popover-wrapper.types'

const profileData: PopoverWrapperData = {
  title: 'Profile quick actions',
  description: 'Structured content from typed data.',
  sections: [
    {
      id: 'identity',
      title: 'Identity',
      fields: [
        { id: 'name', label: 'Name', value: 'Alex Morgan' },
        { id: 'email', label: 'Email', value: 'alex@autoform.dev' },
      ],
    },
    {
      id: 'actions',
      title: 'Actions',
      actions: [
        { id: 'edit', label: 'Edit profile', variant: 'soft', color: 'primary' },
        { id: 'invite', label: 'Invite user', variant: 'surface' },
        { id: 'remove', label: 'Remove', variant: 'solid', color: 'error' },
      ],
    },
  ],
}

const meta = {
  title: 'Elements/PopoverWrapper',
  component: PopoverWrapper,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<PopoverWrapperProps>

export default meta

type Story = StoryObj<PopoverWrapperProps>

export const DataDriven: Story = {
  args: {
    trigger: <Button variant="outline">Open popover</Button>,
    data: profileData,
    variant: 'surface',
    size: 'sm',
    maxWidth: 'sm',
  },
}

export const WrapperVsPrimitive: Story = {
  render: () => (
    <div className="flex items-start gap-6">
      <div className="space-y-2">
        <div className="text-sm font-medium">PopoverWrapper</div>
        <PopoverWrapper
          trigger={
            <IconButton variant="soft" aria-label="Open wrapper popover">
              <MoreHorizontal />
            </IconButton>
          }
          data={profileData}
        />
      </div>
      <div className="space-y-2">
        <div className="text-sm font-medium">Primitives</div>
        <Popover.Root>
          <Popover.Trigger render={<Button variant="outline" />}>Open primitive</Popover.Trigger>
          <Popover.Content>
            <Popover.Arrow />
            <div className="text-sm font-medium">Manual composition</div>
          </Popover.Content>
        </Popover.Root>
      </div>
    </div>
  ),
}
