import type { Meta, StoryObj } from '@storybook/react-vite'
import { File, FileText, Folder, FolderOpen, Image } from 'lucide-react'
import * as React from 'react'
import type { TreeDataItem } from './TreeView'
import { TreeViewWrapper } from './TreeViewWrapper'
import { moveTreeItem } from './tree-view-dnd'

const meta = {
  title: 'Elements/TreeView',
  component: TreeViewWrapper,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof TreeViewWrapper>

export default meta

type Story = StoryObj<typeof TreeViewWrapper>

const fileTreeData: TreeDataItem[] = [
  {
    id: '1',
    name: 'Documents',
    icon: Folder,
    openIcon: FolderOpen,
    children: [
      {
        id: '1-1',
        name: 'Reports',
        icon: Folder,
        openIcon: FolderOpen,
        children: [
          { id: '1-1-1', name: 'Q1 Report.pdf', icon: FileText },
          { id: '1-1-2', name: 'Q2 Report.pdf', icon: FileText },
        ],
      },
      {
        id: '1-2',
        name: 'Invoices',
        icon: Folder,
        openIcon: FolderOpen,
        children: [{ id: '1-2-1', name: 'Invoice #001.pdf', icon: FileText }],
      },
    ],
  },
  {
    id: '2',
    name: 'Images',
    icon: Folder,
    openIcon: FolderOpen,
    children: [
      { id: '2-1', name: 'photo.jpg', icon: Image },
      { id: '2-2', name: 'banner.png', icon: Image },
    ],
  },
  { id: '3', name: 'README.md', icon: File },
]

export const Default: Story = {
  args: {
    className: 'w-[320px]',
    data: fileTreeData,
    onSelectChange: item => console.log('Selected:', item?.name),
  },
}

export const ExpandAll: Story = {
  args: {
    className: 'w-[320px]',
    data: fileTreeData,
    expandAll: true,
  },
}

export const WithInitialSelection: Story = {
  args: {
    className: 'w-[320px]',
    data: fileTreeData,
    initialSelectedItemId: '1-1-1',
  },
}

export const Sizes: Story = {
  render: () => (
    <div className="flex gap-8">
      {(['sm', 'md', 'lg'] as const).map(size => (
        <div key={size} className="flex-1">
          <p className="text-xs text-muted-foreground mb-2">{size}</p>
          <TreeViewWrapper
            size={size}
            expandAll
            data={[
              {
                id: `${size}-root`,
                name: 'Root',
                icon: Folder,
                openIcon: FolderOpen,
                children: [
                  { id: `${size}-a`, name: 'Child A', icon: File },
                  { id: `${size}-b`, name: 'Child B', icon: File },
                ],
              },
            ]}
          />
        </div>
      ))}
    </div>
  ),
}

export const WithDragAndDrop: Story = {
  render: () => {
    const [data, setData] = React.useState<TreeDataItem[]>([
      {
        id: 'folder-1',
        name: 'Folder A',
        icon: Folder,
        openIcon: FolderOpen,
        draggable: true,
        droppable: true,
        children: [
          { id: 'file-1', name: 'File 1.txt', icon: File, draggable: true },
          { id: 'file-2', name: 'File 2.txt', icon: File, draggable: true },
        ],
      },
      {
        id: 'folder-2',
        name: 'Folder B',
        icon: Folder,
        openIcon: FolderOpen,
        draggable: true,
        droppable: true,
        children: [{ id: 'file-3', name: 'File 3.txt', icon: File, draggable: true }],
      },
    ])

    return (
      <TreeViewWrapper
        className="w-[320px]"
        expandAll
        data={data}
        onItemDrag={(source, target) => {
          setData(current => moveTreeItem(current, source.id, target.id))
        }}
      />
    )
  },
}

export const WithDisabledItems: Story = {
  args: {
    className: 'w-[320px]',
    expandAll: true,
    data: [
      {
        id: 'root',
        name: 'Project',
        icon: Folder,
        openIcon: FolderOpen,
        children: [
          { id: 'active', name: 'Active File', icon: File },
          { id: 'disabled', name: 'Locked File', icon: File, disabled: true },
          {
            id: 'disabled-folder',
            name: 'Archived',
            icon: Folder,
            disabled: true,
            children: [{ id: 'archived-1', name: 'Old Report.pdf', icon: FileText }],
          },
        ],
      },
    ],
  },
}

export const WithDefaultIcons: Story = {
  args: {
    className: 'w-[320px]',
    expandAll: true,
    defaultNodeIcon: Folder,
    defaultLeafIcon: File,
    data: [
      {
        id: 'src',
        name: 'src',
        children: [
          {
            id: 'components',
            name: 'components',
            children: [
              { id: 'button', name: 'Button.tsx' },
              { id: 'input', name: 'Input.tsx' },
            ],
          },
          { id: 'index', name: 'index.ts' },
          { id: 'utils', name: 'utils.ts' },
        ],
      },
    ],
  },
}
