import { describe, expect, it } from 'vitest'
import type { TreeDataItem } from './TreeView'
import { moveTreeItem } from './tree-view-dnd'

describe('moveTreeItem', () => {
  const createData = (): TreeDataItem[] => [
    {
      id: 'folder-a',
      name: 'Folder A',
      children: [
        { id: 'file-a1', name: 'File A1' },
        { id: 'file-a2', name: 'File A2' },
      ],
    },
    {
      id: 'folder-b',
      name: 'Folder B',
      children: [{ id: 'file-b1', name: 'File B1' }],
    },
  ]

  it('reorders siblings when source and target share a parent', () => {
    const moved = moveTreeItem(createData(), 'folder-a', 'folder-b')

    expect(moved.map(item => item.id)).toEqual(['folder-b', 'folder-a'])
  })

  it('reorders siblings when moving upward within the same parent', () => {
    const moved = moveTreeItem(createData(), 'folder-b', 'folder-a')

    expect(moved.map(item => item.id)).toEqual(['folder-b', 'folder-a'])
  })

  it('reparents an item when dropped on a different parent', () => {
    const moved = moveTreeItem(createData(), 'file-a1', 'folder-b')
    const folderA = moved.find(item => item.id === 'folder-a')
    const folderB = moved.find(item => item.id === 'folder-b')

    expect(folderA?.children?.map(item => item.id)).toEqual(['file-a2'])
    expect(folderB?.children?.map(item => item.id)).toEqual(['file-b1', 'file-a1'])
  })

  it('ignores moves into a descendant', () => {
    const data: TreeDataItem[] = [
      {
        id: 'folder-a',
        name: 'Folder A',
        children: [
          {
            id: 'folder-a1',
            name: 'Folder A1',
            children: [{ id: 'file-a1', name: 'File A1' }],
          },
        ],
      },
    ]

    expect(moveTreeItem(data, 'folder-a', 'folder-a1')).toEqual(data)
  })
})
