import type { Meta, StoryObj } from '@storybook/react-vite'
import * as React from 'react'
import { Button } from '@/elements/button/Button'
import { ContextMenu } from './ContextMenu'
import { DropdownMenu } from './DropdownMenu'
import { MenuWrapper } from './MenuWrapper'
import type { MenuWrapperData, MenuWrapperEntry, MenuWrapperProps } from './menu-wrapper.types'

const demoData: MenuWrapperData = [
  {
    id: 'file',
    label: 'File',
    items: [
      { id: 'new', label: 'New file', shortcut: '⌘N' },
      { id: 'open', label: 'Open', shortcut: '⌘O' },
      { kind: 'separator', id: 'sep-1' },
      {
        kind: 'submenu',
        id: 'share',
        label: 'Share',
        items: [
          { id: 'email', label: 'Email' },
          { id: 'link', label: 'Copy link' },
        ],
      },
    ],
  },
  {
    id: 'view',
    label: 'View',
    items: [
      { kind: 'checkbox', id: 'status', label: 'Show status bar', checked: true },
      { kind: 'checkbox', id: 'minimap', label: 'Show minimap', checked: false },
      { kind: 'separator', id: 'sep-2' },
      {
        kind: 'radio-group',
        id: 'density',
        value: 'compact',
        items: [
          { id: 'dense', label: 'Compact', value: 'compact' },
          { id: 'comfortable', label: 'Comfortable', value: 'comfortable' },
        ],
      },
    ],
  },
]

function updateEntries(
  entries: MenuWrapperEntry[],
  updater: (entry: MenuWrapperEntry) => MenuWrapperEntry,
): MenuWrapperEntry[] {
  return entries.map(entry => {
    const next = updater(entry)
    if (next.kind === 'submenu') {
      return { ...next, items: updateEntries(next.items, updater) }
    }
    return next
  })
}

function InteractiveMenuWrapper(args: MenuWrapperProps) {
  const [data, setData] = React.useState<MenuWrapperData>(args.data)

  React.useEffect(() => {
    setData(args.data)
  }, [args.data])

  return (
    <MenuWrapper
      {...args}
      data={data}
      onCheckboxChange={(item, checked) => {
        setData(previous =>
          previous.map(group => ({
            ...group,
            items: updateEntries(group.items, entry =>
              entry.kind === 'checkbox' && entry.id === item.id ? { ...entry, checked } : entry,
            ),
          })),
        )
      }}
      onRadioValueChange={(group, value) => {
        setData(previous =>
          previous.map(current => ({
            ...current,
            items: updateEntries(current.items, entry =>
              entry.kind === 'radio-group' && entry.id === group.id ? { ...entry, value } : entry,
            ),
          })),
        )
      }}
      onItemSelect={item => args.onItemSelect?.(item)}
    />
  )
}

const meta = {
  title: 'Elements/MenuWrapper',
  component: MenuWrapper,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Typed data-driven wrapper over `DropdownMenu` and `ContextMenu`. Primitives remain the escape hatch for custom composition.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    mode: { control: 'inline-radio', options: ['dropdown', 'context'] },
    variant: { control: 'select', options: ['solid', 'soft', 'surface'] },
    color: { control: 'select' },
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl', '2x'] },
  },
} satisfies Meta<MenuWrapperProps>

export default meta

type Story = StoryObj<MenuWrapperProps>

export const DataDrivenDropdown: Story = {
  args: {
    mode: 'dropdown',
    data: demoData,
    trigger: <Button variant="soft">Open actions</Button>,
    variant: 'solid',
    color: 'slate',
    size: 'md',
  },
  render: (args: MenuWrapperProps) => <InteractiveMenuWrapper {...args} />,
}

export const DataDrivenContextMenu: Story = {
  args: {
    mode: 'context',
    data: demoData,
    variant: 'soft',
    color: 'slate',
  },
  render: (args: MenuWrapperProps) => <InteractiveMenuWrapper {...args} />,
}

export const WrapperVsPrimitive: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false)
    return (
      <div className="flex items-start gap-6">
        <div className="space-y-2">
          <div className="text-sm font-medium">MenuWrapper</div>
          <MenuWrapper data={demoData} trigger={<Button variant="soft">Wrapper menu</Button>} onItemSelect={() => {}} />
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium">Primitives</div>
          <DropdownMenu.Root open={open} onOpenChange={setOpen}>
            <DropdownMenu.Trigger>
              <Button variant="soft">Primitive menu</Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
              <DropdownMenu.Label>File</DropdownMenu.Label>
              <DropdownMenu.Item shortcut="⌘N">New file</DropdownMenu.Item>
              <DropdownMenu.Item shortcut="⌘O">Open</DropdownMenu.Item>
              <DropdownMenu.Separator />
              <DropdownMenu.Sub>
                <DropdownMenu.SubTrigger>Share</DropdownMenu.SubTrigger>
                <DropdownMenu.SubContent>
                  <DropdownMenu.Item>Email</DropdownMenu.Item>
                  <DropdownMenu.Item>Copy link</DropdownMenu.Item>
                </DropdownMenu.SubContent>
              </DropdownMenu.Sub>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium">Context primitive</div>
          <ContextMenu.Root>
            <ContextMenu.Trigger>
              <div className="inline-flex min-h-10 items-center justify-center rounded-md border border-border px-3 text-sm">
                Right click
              </div>
            </ContextMenu.Trigger>
            <ContextMenu.Content>
              <ContextMenu.Item>Rename</ContextMenu.Item>
              <ContextMenu.Item color="error">Delete</ContextMenu.Item>
            </ContextMenu.Content>
          </ContextMenu.Root>
        </div>
      </div>
    )
  },
}
