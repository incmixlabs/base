import '@testing-library/jest-dom/vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { TreeView } from './TreeView'

describe('TreeView', () => {
  afterEach(() => cleanup())

  const data = [
    {
      id: 'folder-a',
      name: 'Folder A',
      draggable: true,
      droppable: true,
      children: [{ id: 'file-a', name: 'File A', draggable: true }],
    },
    {
      id: 'folder-b',
      name: 'Folder B',
      draggable: true,
      droppable: true,
      children: [{ id: 'file-b', name: 'File B', draggable: true }],
    },
  ]

  it('calls onItemDrag when drop resolves the source item from dataTransfer', () => {
    const onItemDrag = vi.fn()

    render(<TreeView.Root data={data} expandAll onItemDrag={onItemDrag} />)

    const target = screen.getByRole('treeitem', { name: /Folder B/i })
    const dataTransfer = {
      getData: vi.fn((type: string) => (type === 'text/plain' ? 'file-a' : '')),
      setData: vi.fn(),
    }

    fireEvent.dragOver(target, { dataTransfer })
    fireEvent.drop(target, { dataTransfer })

    expect(onItemDrag).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'file-a', name: 'File A' }),
      expect.objectContaining({ id: 'folder-b', name: 'Folder B' }),
    )
  })

  it('accepts drops on the expanded branch container, not only the row label', () => {
    const onItemDrag = vi.fn()

    const { container } = render(<TreeView.Root data={data} expandAll onItemDrag={onItemDrag} />)

    const groups = container.querySelectorAll('[role="group"]')
    const folderBGroup = groups[1]
    expect(folderBGroup).toBeTruthy()

    const dataTransfer = {
      getData: vi.fn((type: string) => (type === 'text/plain' ? 'file-a' : '')),
      setData: vi.fn(),
    }

    fireEvent.dragEnter(folderBGroup as HTMLElement, { dataTransfer })
    fireEvent.dragOver(folderBGroup as HTMLElement, { dataTransfer })
    fireEvent.drop(folderBGroup as HTMLElement, { dataTransfer })

    expect(onItemDrag).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'file-a', name: 'File A' }),
      expect.objectContaining({ id: 'folder-b', name: 'Folder B' }),
    )
  })
})
