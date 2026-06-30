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

  function expectClassTokens(className: string | undefined, tokens: readonly string[]) {
    const classTokens = new Set((className ?? '').split(/\s+/).filter(Boolean))
    for (const token of tokens) {
      expect(classTokens).toContain(token)
    }
  }

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

  it('clears the drag source active marker after drop', () => {
    const onItemDrag = vi.fn()

    render(<TreeView.Root data={data} expandAll onItemDrag={onItemDrag} />)

    const source = screen.getByRole('treeitem', { name: /File A/i })
    const target = screen.getByRole('treeitem', { name: /Folder B/i })
    const dataTransfer = {
      getData: vi.fn((type: string) => (type === 'text/plain' ? 'file-a' : '')),
      setData: vi.fn(),
    }

    fireEvent.pointerDown(source)
    expect(source).toHaveAttribute('data-active')

    fireEvent.dragStart(source, { dataTransfer })
    fireEvent.dragOver(target, { dataTransfer })
    fireEvent.drop(target, { dataTransfer })

    expect(source).not.toHaveAttribute('data-active')
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

  it('can hide indent guides', () => {
    const { container } = render(<TreeView.Root data={data} expandAll showIndentGuides={false} />)

    const branchContent = container.querySelector('[role="group"] > div')

    expect(branchContent).toBeTruthy()
    expectClassTokens(branchContent?.className, ['min-h-0', 'overflow-hidden'])
    expect(branchContent?.className).not.toContain('border-s')
    expect(branchContent?.className).not.toContain('border-neutral')
  })

  it('renders empty droppable folders as branch containers', () => {
    render(
      <TreeView.Root
        data={[
          { id: 'folder-a', name: 'Folder A', droppable: true, children: [{ id: 'file-a', name: 'File A' }] },
          { id: 'folder-b', name: 'Folder B', droppable: true, children: [] },
        ]}
        expandAll
      />,
    )

    expect(screen.getByRole('treeitem', { name: /Folder B/i })).toHaveAttribute('aria-expanded', 'true')
  })

  it('does not expose the drag rail marker for non-draggable items', () => {
    render(<TreeView.Root data={[{ id: 'utils', name: 'utils.ts' }]} />)

    const item = screen.getByRole('treeitem', { name: /utils\.ts/i })

    fireEvent.click(item)

    expect(item).toHaveAttribute('data-selected')
    expect(item).not.toHaveAttribute('data-drag-enabled')
  })

  it('applies concrete item size utilities', () => {
    render(<TreeView.Root data={data} expandAll size="sm" />)

    const item = screen.getByRole('treeitem', { name: /Folder A/i })

    expectClassTokens(item.className, ['text-sm', 'leading-5', 'px-2.5', 'py-1', 'gap-1.5'])
  })

  it('visually marks only the active item when controlled selection points elsewhere', () => {
    render(<TreeView.Root data={data} expandAll selectedItemId="folder-a" />)

    const selected = screen.getByRole('treeitem', { name: /Folder A/i })
    const active = screen.getByRole('treeitem', { name: /File B/i })

    fireEvent.pointerDown(active)

    expect(selected).toHaveAttribute('aria-selected', 'true')
    expect(selected).not.toHaveAttribute('data-selected')
    expect(active).not.toHaveAttribute('aria-selected', 'true')
    expect(active).toHaveAttribute('data-active')
  })
})
