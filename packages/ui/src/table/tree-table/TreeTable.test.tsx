import '@testing-library/jest-dom/vitest'
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  EDIT_TABLE_CELL_MODE,
  READ_TABLE_CELL_MODE,
  type TableColumnDef,
  toTanStackTableColumnDefs,
} from '@/table/shared'
import { TreeTable } from './TreeTable'
import type { TreeTableColumnDef } from './tree-table.props'

vi.mock('@tanstack/react-virtual', async importOriginal => {
  const actual = await importOriginal<typeof import('@tanstack/react-virtual')>()
  return {
    ...actual,
    useVirtualizer: ({ count, estimateSize }: { count: number; estimateSize: () => number }) => {
      const rowHeight = estimateSize()
      return {
        getVirtualItems: () =>
          Array.from({ length: count }, (_, index) => ({
            key: index,
            index,
            start: index * rowHeight,
            size: rowHeight,
          })),
        getTotalSize: () => count * rowHeight,
        measureElement: () => undefined,
        scrollToIndex: () => undefined,
      }
    },
  }
})

type ServiceRow = {
  id: string
  service: string
  quantity: number
  subRows?: ServiceRow[]
}

const rows: ServiceRow[] = [
  {
    id: 'premium',
    service: 'Premium support',
    quantity: 2,
    subRows: [{ id: 'premium-training', service: 'Training', quantity: 1 }],
  },
  { id: 'implementation', service: 'Implementation', quantity: 1 },
]

const sharedColumns: TableColumnDef<ServiceRow>[] = [
  {
    id: 'service',
    header: 'Service',
    width: 100,
    minWidth: 80,
    maxWidth: 130,
    resizable: true,
  },
  {
    id: 'quantity',
    header: 'Qty',
    width: 80,
    resizable: false,
  },
]

const columns: TreeTableColumnDef<ServiceRow>[] = toTanStackTableColumnDefs(sharedColumns)
describe('TreeTable', () => {
  afterEach(() => cleanup())

  it('resizes columns with keyboard-accessible separators', async () => {
    render(
      <div style={{ height: 240, width: 420 }}>
        <TreeTable.Root columns={columns} data={rows} getRowId={row => row.id} getSubRows={row => row.subRows}>
          <TreeTable.Content maxBodyHeight={160} />
        </TreeTable.Root>
      </div>,
    )

    const resizeHandle = screen.getByRole('separator', { name: 'Resize Service column' })
    expect(resizeHandle).toHaveAttribute('aria-orientation', 'vertical')
    expect(resizeHandle).toHaveAttribute('aria-valuemin', '80')
    expect(resizeHandle).toHaveAttribute('aria-valuemax', '130')
    expect(resizeHandle).toHaveAttribute('aria-valuenow', '100')

    fireEvent.keyDown(resizeHandle, { key: 'ArrowRight' })
    await waitFor(() => expect(resizeHandle).toHaveAttribute('aria-valuenow', '112'))

    fireEvent.keyDown(resizeHandle, { key: 'ArrowRight', shiftKey: true })
    await waitFor(() => expect(resizeHandle).toHaveAttribute('aria-valuenow', '130'))

    fireEvent.keyDown(resizeHandle, { key: 'ArrowLeft' })
    await waitFor(() => expect(resizeHandle).toHaveAttribute('aria-valuenow', '118'))
  })

  it('applies minBodyHeight without requiring maxBodyHeight', () => {
    const { container } = render(
      <div style={{ height: 240, width: 420 }}>
        <TreeTable.Root columns={columns} data={rows} getRowId={row => row.id} getSubRows={row => row.subRows}>
          <TreeTable.Content minBodyHeight={180} />
        </TreeTable.Root>
      </div>,
    )

    const viewport = container.querySelector<HTMLElement>('.overflow-y-auto')

    expect(viewport).toHaveStyle({ minHeight: '180px' })
  })

  it('renders the shared cell mode toggle from the toolbar', () => {
    render(
      <div style={{ height: 240, width: 420 }}>
        <TreeTable.Root
          columns={columns}
          data={rows}
          getRowId={row => row.id}
          getSubRows={row => row.subRows}
          onCellEdit={vi.fn()}
          allowedCellModes={['read', 'edit']}
        >
          <TreeTable.Toolbar />
        </TreeTable.Root>
      </div>,
    )

    expect(screen.getByRole('button', { name: 'Read mode' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Edit mode' })).toBeInTheDocument()
  })

  it('moves focus between readonly cells with arrow keys', async () => {
    render(
      <div style={{ height: 240, width: 420 }}>
        <TreeTable.Root columns={columns} data={rows} getRowId={row => row.id} getSubRows={row => row.subRows}>
          <TreeTable.Content />
        </TreeTable.Root>
      </div>,
    )

    const firstServiceCell = screen.getAllByRole('gridcell', { name: 'Edit Service' })[0]
    const quantityCells = screen.getAllByRole('gridcell', { name: 'Edit Qty' })
    const firstQuantityCell = quantityCells[0]
    const childQuantityCell = quantityCells[1]
    if (!firstServiceCell) throw new Error('Expected first service cell')
    if (!firstQuantityCell) throw new Error('Expected first quantity cell')
    if (!childQuantityCell) throw new Error('Expected child quantity cell')

    firstServiceCell.focus()
    fireEvent.keyDown(firstServiceCell, { key: 'ArrowRight' })
    await waitFor(() => expect(firstQuantityCell).toHaveFocus())

    fireEvent.keyDown(firstQuantityCell, { key: 'ArrowDown' })
    await waitFor(() => expect(childQuantityCell).toHaveFocus())
  })

  it('runs row actions from keyboard shortcuts', () => {
    const onDuplicate = vi.fn()
    const onRemove = vi.fn()
    const onIndent = vi.fn()
    const onOutdent = vi.fn()
    const onMoveUp = vi.fn()
    const onMoveDown = vi.fn()

    render(
      <div style={{ height: 240, width: 420 }}>
        <TreeTable.Root
          columns={columns}
          data={rows}
          getRowId={row => row.id}
          getSubRows={row => row.subRows}
          onDuplicate={onDuplicate}
          onRemove={onRemove}
          onIndent={onIndent}
          onOutdent={onOutdent}
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
        >
          <TreeTable.Content />
        </TreeTable.Root>
      </div>,
    )

    const firstServiceCell = screen.getAllByRole('gridcell', { name: 'Edit Service' })[0]
    if (!firstServiceCell) throw new Error('Expected readonly service cell')

    firstServiceCell.focus()
    fireEvent.keyDown(firstServiceCell, { key: 'd', metaKey: true })
    fireEvent.keyDown(firstServiceCell, { key: 'Delete' })
    fireEvent.keyDown(firstServiceCell, { key: ']', code: 'BracketRight', metaKey: true })
    fireEvent.keyDown(firstServiceCell, { key: '[', code: 'BracketLeft', metaKey: true })
    fireEvent.keyDown(firstServiceCell, { key: 'ArrowUp', altKey: true })
    fireEvent.keyDown(firstServiceCell, { key: 'ArrowDown', altKey: true })

    expect(onDuplicate).toHaveBeenCalledTimes(1)
    expect(onDuplicate).toHaveBeenCalledWith(expect.objectContaining({ id: 'premium' }))
    expect(onRemove).toHaveBeenCalledTimes(1)
    expect(onRemove).toHaveBeenCalledWith(expect.objectContaining({ id: 'premium' }))
    expect(onIndent).toHaveBeenCalledTimes(1)
    expect(onIndent).toHaveBeenCalledWith(expect.objectContaining({ id: 'premium' }))
    expect(onOutdent).toHaveBeenCalledTimes(1)
    expect(onOutdent).toHaveBeenCalledWith(expect.objectContaining({ id: 'premium' }))
    expect(onMoveUp).toHaveBeenCalledTimes(1)
    expect(onMoveUp).toHaveBeenCalledWith(expect.objectContaining({ id: 'premium' }))
    expect(onMoveDown).toHaveBeenCalledTimes(1)
    expect(onMoveDown).toHaveBeenCalledWith(expect.objectContaining({ id: 'premium' }))
  })

  it('suppresses disabled row keyboard shortcuts', () => {
    const onDuplicate = vi.fn()
    const onRemove = vi.fn()
    const onIndent = vi.fn()
    const onOutdent = vi.fn()
    const onMoveUp = vi.fn()
    const onMoveDown = vi.fn()

    render(
      <div style={{ height: 240, width: 420 }}>
        <TreeTable.Root
          columns={columns}
          data={rows}
          getRowId={row => row.id}
          getSubRows={row => row.subRows}
          onDuplicate={onDuplicate}
          onRemove={onRemove}
          onIndent={onIndent}
          onOutdent={onOutdent}
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
          canDuplicate={() => false}
          canRemove={() => false}
          canIndent={() => false}
          canOutdent={() => false}
          canMoveUp={() => false}
          canMoveDown={() => false}
        >
          <TreeTable.Content />
        </TreeTable.Root>
      </div>,
    )

    const firstServiceCell = screen.getAllByRole('gridcell', { name: 'Edit Service' })[0]
    if (!firstServiceCell) throw new Error('Expected readonly service cell')

    firstServiceCell.focus()
    expect(fireEvent.keyDown(firstServiceCell, { key: 'd', metaKey: true })).toBe(false)
    expect(fireEvent.keyDown(firstServiceCell, { key: 'Delete' })).toBe(false)
    expect(fireEvent.keyDown(firstServiceCell, { key: ']', code: 'BracketRight', metaKey: true })).toBe(false)
    expect(fireEvent.keyDown(firstServiceCell, { key: '[', code: 'BracketLeft', metaKey: true })).toBe(false)
    expect(fireEvent.keyDown(firstServiceCell, { key: 'ArrowUp', altKey: true })).toBe(false)
    expect(fireEvent.keyDown(firstServiceCell, { key: 'ArrowDown', altKey: true })).toBe(false)
    expect(onDuplicate).not.toHaveBeenCalled()
    expect(onRemove).not.toHaveBeenCalled()
    expect(onIndent).not.toHaveBeenCalled()
    expect(onOutdent).not.toHaveBeenCalled()
    expect(onMoveUp).not.toHaveBeenCalled()
    expect(onMoveDown).not.toHaveBeenCalled()
  })

  it('allows parent row labels to enter edit mode when the column is editable', async () => {
    const editableColumns: TreeTableColumnDef<ServiceRow>[] = toTanStackTableColumnDefs([
      {
        id: 'service',
        header: 'Service',
        editor: { type: 'text' },
      },
      {
        id: 'quantity',
        header: 'Qty',
        editor: { type: 'number' },
        editable: ({ row }) => !(row as ServiceRow).subRows?.length,
      },
    ])

    render(
      <div style={{ height: 240, width: 420 }}>
        <TreeTable.Root
          columns={editableColumns}
          data={rows}
          getRowId={row => row.id}
          getSubRows={row => row.subRows}
          onCellEdit={vi.fn()}
        >
          <TreeTable.Content />
        </TreeTable.Root>
      </div>,
    )

    const parentLabel = screen.getAllByRole('button', { name: 'Edit Service' })[0]
    if (!parentLabel) throw new Error('Expected parent label cell')

    fireEvent.click(parentLabel)

    await waitFor(() => {
      const editor = screen.getByRole('textbox', { name: 'Edit Service' })
      expect(editor).toHaveValue('Premium support')
      expect(editor).toHaveFocus()
    })
  }, 10_000)

  it('renders editable parent row labels in edit mode when aggregate sibling cells are readonly', () => {
    const aggregateColumns: TreeTableColumnDef<ServiceRow>[] = toTanStackTableColumnDefs([
      {
        id: 'service',
        header: 'Service',
        editor: { type: 'text' },
      },
      {
        id: 'quantity',
        header: 'Qty',
        editor: { type: 'number' },
        editable: ({ row }) => !(row as ServiceRow).subRows?.length,
      },
    ])

    render(
      <div style={{ height: 240, width: 420 }}>
        <TreeTable.Root
          columns={aggregateColumns}
          data={rows}
          getRowId={row => row.id}
          getSubRows={row => row.subRows}
          onCellEdit={vi.fn()}
          defaultCellMode={EDIT_TABLE_CELL_MODE}
          allowedCellModes={[READ_TABLE_CELL_MODE, EDIT_TABLE_CELL_MODE]}
        >
          <TreeTable.Content />
        </TreeTable.Root>
      </div>,
    )

    const parentLabelEditor = screen.getAllByRole('textbox', { name: 'Edit Service' })[0]
    const parentQuantityReadCell = screen.getAllByRole('gridcell', { name: 'Edit Qty' })[0]
    if (!parentLabelEditor) throw new Error('Expected parent label editor')
    if (!parentQuantityReadCell) throw new Error('Expected readonly parent quantity cell')

    expect(parentLabelEditor).toHaveValue('Premium support')
    expect(parentQuantityReadCell).toHaveTextContent('2')
  })

  it('moves focus between edit-mode parent row label editors with arrow keys', async () => {
    const aggregateColumns: TreeTableColumnDef<ServiceRow>[] = toTanStackTableColumnDefs([
      {
        id: 'service',
        header: 'Service',
        editor: { type: 'text' },
      },
      {
        id: 'quantity',
        header: 'Qty',
        editor: { type: 'number' },
        editable: ({ row }) => !(row as ServiceRow).subRows?.length,
      },
    ])

    render(
      <div style={{ height: 240, width: 420 }}>
        <TreeTable.Root
          columns={aggregateColumns}
          data={rows}
          getRowId={row => row.id}
          getSubRows={row => row.subRows}
          onCellEdit={vi.fn()}
          defaultCellMode={EDIT_TABLE_CELL_MODE}
          allowedCellModes={[READ_TABLE_CELL_MODE, EDIT_TABLE_CELL_MODE]}
        >
          <TreeTable.Content />
        </TreeTable.Root>
      </div>,
    )

    const labelEditors = screen.getAllByRole('textbox', { name: 'Edit Service' })
    const parentLabelEditor = labelEditors[0]
    const childLabelEditor = labelEditors[1]
    if (!parentLabelEditor) throw new Error('Expected parent label editor')
    if (!childLabelEditor) throw new Error('Expected child label editor')

    parentLabelEditor.focus()
    fireEvent.keyDown(parentLabelEditor, { key: 'ArrowDown' })

    await waitFor(() => expect(childLabelEditor).toHaveFocus())
  })
})
