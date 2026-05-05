import '@testing-library/jest-dom/vitest'
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import * as React from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { type TableColumnDef, toTanStackTableColumnDefs } from '@/table/shared'
import { InfiniteTable } from './InfiniteTable'
import type { InfiniteTableColumnDef } from './infinite-table.props'

const virtualizerScrollToIndex = vi.hoisted(() => vi.fn())
const virtualizerVisibleCount = vi.hoisted(() => ({ current: Number.POSITIVE_INFINITY }))

vi.mock('@tanstack/react-virtual', async importOriginal => {
  const actual = await importOriginal<typeof import('@tanstack/react-virtual')>()
  return {
    ...actual,
    useVirtualizer: ({ count, estimateSize }: { count: number; estimateSize: () => number }) => {
      const rowHeight = estimateSize()
      const renderedCount = Math.min(count, virtualizerVisibleCount.current)
      return {
        getVirtualItems: () =>
          Array.from({ length: renderedCount }, (_, index) => ({
            key: index,
            index,
            start: index * rowHeight,
            size: rowHeight,
          })),
        getTotalSize: () => count * rowHeight,
        measureElement: () => undefined,
        scrollToIndex: virtualizerScrollToIndex,
      }
    },
  }
})

type ServiceRow = {
  id: string
  service: string
  quantity: number
}

const rows: ServiceRow[] = [
  { id: 'premium', service: 'Premium support', quantity: 2 },
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

const columns: InfiniteTableColumnDef<ServiceRow>[] = toTanStackTableColumnDefs(sharedColumns)
describe('InfiniteTable', () => {
  afterEach(() => {
    cleanup()
    virtualizerScrollToIndex.mockClear()
    virtualizerVisibleCount.current = Number.POSITIVE_INFINITY
  })

  it('resizes columns with keyboard-accessible separators', async () => {
    render(
      <div style={{ height: 240, width: 420 }}>
        <InfiniteTable.Root columns={columns} data={rows} getRowId={row => row.id}>
          <InfiniteTable.Content />
        </InfiniteTable.Root>
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

  it('renders child summary charts inline above the table content', () => {
    render(
      <div style={{ height: 240, width: 420 }}>
        <InfiniteTable.Root columns={columns} data={rows} getRowId={row => row.id}>
          <InfiniteTable.SummaryChart>
            <div data-testid="summary-slot">Summary chart slot</div>
          </InfiniteTable.SummaryChart>
          <InfiniteTable.Toolbar />
          <InfiniteTable.Content />
        </InfiniteTable.Root>
      </div>,
    )

    const summary = screen.getByTestId('summary-slot')
    const firstHeader = screen.getByRole('columnheader', { name: /Service/i })

    expect(summary.compareDocumentPosition(firstHeader) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })

  it('renders the shared cell mode toggle from the toolbar', () => {
    render(
      <div style={{ height: 240, width: 420 }}>
        <InfiniteTable.Root
          columns={columns}
          data={rows}
          getRowId={row => row.id}
          onCellEdit={vi.fn()}
          allowedCellModes={['read', 'edit']}
        >
          <InfiniteTable.Toolbar />
        </InfiniteTable.Root>
      </div>,
    )

    expect(screen.getByRole('button', { name: 'Read mode' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Edit mode' })).toBeInTheDocument()
  })

  it('moves focus between readonly cells with arrow keys', async () => {
    render(
      <div style={{ height: 240, width: 420 }}>
        <InfiniteTable.Root columns={columns} data={rows} getRowId={row => row.id}>
          <InfiniteTable.Content />
        </InfiniteTable.Root>
      </div>,
    )

    const serviceCells = screen.getAllByRole('gridcell', { name: 'Edit Service' })
    const quantityCells = screen.getAllByRole('gridcell', { name: 'Edit Qty' })
    const firstServiceCell = serviceCells[0]
    const firstQuantityCell = quantityCells[0]
    const secondQuantityCell = quantityCells[1]
    if (!firstServiceCell || !firstQuantityCell || !secondQuantityCell) {
      throw new Error('Expected readonly cell navigation targets')
    }

    firstServiceCell.focus()
    fireEvent.keyDown(firstServiceCell, { key: 'ArrowRight' })
    await waitFor(() => expect(firstQuantityCell).toHaveFocus())

    fireEvent.keyDown(firstQuantityCell, { key: 'ArrowDown' })
    await waitFor(() => expect(secondQuantityCell).toHaveFocus())
  })

  it('scrolls virtualized readonly navigation targets into view', async () => {
    virtualizerVisibleCount.current = 1
    const manyRows = Array.from({ length: 12 }, (_, index) => ({
      id: `row-${index}`,
      service: `Service ${index}`,
      quantity: index,
    }))

    render(
      <div style={{ height: 240, width: 420 }}>
        <InfiniteTable.Root columns={columns} data={manyRows} getRowId={row => row.id}>
          <InfiniteTable.Content />
        </InfiniteTable.Root>
      </div>,
    )

    const firstServiceCell = screen.getByRole('gridcell', { name: 'Edit Service' })
    firstServiceCell.focus()
    fireEvent.keyDown(firstServiceCell, { key: 'ArrowDown' })

    await waitFor(() => expect(virtualizerScrollToIndex).toHaveBeenCalledWith(1, { align: 'auto' }))
  })

  it('runs duplicate and remove row actions from row keyboard shortcuts', () => {
    const onDuplicate = vi.fn()
    const onRemove = vi.fn()

    render(
      <div style={{ height: 240, width: 420 }}>
        <InfiniteTable.Root
          columns={columns}
          data={rows}
          getRowId={row => row.id}
          rowActions={{
            onDuplicate,
            onRemove,
          }}
        >
          <InfiniteTable.Content />
        </InfiniteTable.Root>
      </div>,
    )

    const firstServiceCell = screen.getAllByRole('gridcell', { name: 'Edit Service' })[0]
    if (!firstServiceCell) throw new Error('Expected readonly service cell')

    firstServiceCell.focus()
    fireEvent.keyDown(firstServiceCell, { key: 'd', metaKey: true })
    fireEvent.keyDown(firstServiceCell, { key: 'Delete' })

    expect(onDuplicate).toHaveBeenCalledTimes(1)
    expect(onDuplicate).toHaveBeenCalledWith(expect.objectContaining({ id: 'premium' }))
    expect(onRemove).toHaveBeenCalledTimes(1)
    expect(onRemove).toHaveBeenCalledWith(expect.objectContaining({ id: 'premium' }))
  })

  it('suppresses disabled row keyboard shortcuts', () => {
    const onDuplicate = vi.fn()
    const onRemove = vi.fn()

    render(
      <div style={{ height: 240, width: 420 }}>
        <InfiniteTable.Root
          columns={columns}
          data={rows}
          getRowId={row => row.id}
          rowActions={{
            onDuplicate,
            onRemove,
            canDuplicate: () => false,
            canRemove: () => false,
          }}
        >
          <InfiniteTable.Content />
        </InfiniteTable.Root>
      </div>,
    )

    const firstServiceCell = screen.getAllByRole('gridcell', { name: 'Edit Service' })[0]
    if (!firstServiceCell) throw new Error('Expected readonly service cell')

    firstServiceCell.focus()
    expect(fireEvent.keyDown(firstServiceCell, { key: 'd', metaKey: true })).toBe(false)
    expect(fireEvent.keyDown(firstServiceCell, { key: 'Delete' })).toBe(false)
    expect(onDuplicate).not.toHaveBeenCalled()
    expect(onRemove).not.toHaveBeenCalled()
  })

  it('focuses the duplicated row first editable cell after duplicate row action', async () => {
    const editableColumns = toTanStackTableColumnDefs<ServiceRow>([
      {
        id: 'service',
        header: 'Service',
        editor: { type: 'text' },
      },
      {
        id: 'quantity',
        header: 'Qty',
        editor: { type: 'number' },
      },
    ])

    function Harness() {
      const [data, setData] = React.useState(rows)

      return (
        <div style={{ height: 240, width: 420 }}>
          <InfiniteTable.Root
            columns={editableColumns}
            data={data}
            getRowId={row => row.id}
            onCellEdit={vi.fn()}
            rowActions={{
              labels: { duplicate: 'Duplicate row' },
              onDuplicate: row => {
                setData(current => {
                  const index = current.findIndex(item => item.id === row.id)
                  const duplicate = { ...row, id: `${row.id}-duplicate`, service: `${row.service} copy` }
                  if (index < 0) return [...current, duplicate]
                  return [...current.slice(0, index + 1), duplicate, ...current.slice(index + 1)]
                })
              },
            }}
          >
            <InfiniteTable.Content />
          </InfiniteTable.Root>
        </div>
      )
    }

    render(<Harness />)

    const duplicateButtons = await screen.findAllByRole('button', { name: 'Duplicate row' })
    fireEvent.click(duplicateButtons[0] as HTMLElement)

    await waitFor(() => {
      const editor = screen.getByRole('textbox', { name: 'Edit Service' })
      expect(editor).toHaveValue('Premium support copy')
      expect(editor).toHaveFocus()
    })
  }, 10_000)
})
