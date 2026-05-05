import '@testing-library/jest-dom/vitest'
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import * as React from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { badgeColorVariants } from '@/elements/badge/Badge.css'
import { getColorVars } from '@/elements/utils'
import { Table } from './Table'
import { TableWrapper } from './TableWrapper'
import { tablePropDefs } from './table.props'

const TABLE_WRAPPER_INTERACTION_TEST_TIMEOUT_MS = 20_000

describe('TableWrapper', () => {
  afterEach(() => cleanup())

  const data: TableWrapper.Data = {
    columns: [
      { id: 'name', header: 'Customer', rowHeader: true },
      { id: 'mrr', header: 'MRR', justify: tablePropDefs.Cell.justify.values[2] },
    ],
    rows: [
      {
        id: 'group-b',
        values: { name: 'Growth', mrr: '$1,980' },
        subRows: [{ id: 'sam', values: { name: 'Sam Lee', mrr: '$980' } }],
      },
      {
        id: 'group-a',
        values: { name: 'Enterprise', mrr: '$8,400' },
        subRows: [{ id: 'alex', values: { name: 'Alex Morgan', mrr: '$1,200' } }],
      },
    ],
  }

  it('renders subRows and supports expanding hierarchical rows', () => {
    render(<TableWrapper data={data} />)

    expect(screen.queryByText('Sam Lee')).not.toBeInTheDocument()

    fireEvent.click(screen.getByLabelText('Expand group-b'))

    expect(screen.getByText('Sam Lee')).toBeInTheDocument()
  })

  it('groups flat rows into expandable tree rows', () => {
    const groupedData: TableWrapper.Data = {
      columns: [
        { id: 'name', header: 'Customer', rowHeader: true },
        { id: 'status', header: 'Status' },
      ],
      rows: [
        { id: 'row-1', values: { name: 'Maya Patel', status: 'Active' } },
        { id: 'row-2', values: { name: 'Sam Lee', status: 'Paused' } },
        { id: 'row-3', values: { name: 'Ari Singh', status: 'Active' } },
      ],
    }

    render(<TableWrapper data={groupedData} groupBy={['status']} />)

    expect(screen.getAllByText('Active')).toHaveLength(2)
    expect(screen.queryByText('Maya Patel')).not.toBeInTheDocument()

    fireEvent.click(screen.getByLabelText('Expand group:status:Active'))

    expect(screen.getByText('Maya Patel')).toBeInTheDocument()
    expect(screen.getByText('Ari Singh')).toBeInTheDocument()
  })

  it('honors shape="flat" for grouped rows', () => {
    const groupedData: TableWrapper.Data = {
      columns: [
        { id: 'name', header: 'Customer', rowHeader: true },
        { id: 'status', header: 'Status' },
      ],
      rows: [
        { id: 'row-1', values: { name: 'Maya Patel', status: 'Active' } },
        { id: 'row-2', values: { name: 'Sam Lee', status: 'Paused' } },
        { id: 'row-3', values: { name: 'Ari Singh', status: 'Active' } },
      ],
    }

    render(<TableWrapper data={groupedData} groupBy={['status']} shape="flat" />)

    expect(screen.queryByLabelText('Expand group:status:Active')).not.toBeInTheDocument()
    expect(screen.getByText('Maya Patel')).toBeInTheDocument()
    expect(screen.getByText('Sam Lee')).toBeInTheDocument()
    expect(screen.getByText('Ari Singh')).toBeInTheDocument()
  })

  it('honors defaultShape="flat" for grouped rows', () => {
    const groupedData: TableWrapper.Data = {
      columns: [
        { id: 'name', header: 'Customer', rowHeader: true },
        { id: 'status', header: 'Status' },
      ],
      rows: [
        { id: 'row-1', values: { name: 'Maya Patel', status: 'Active' } },
        { id: 'row-2', values: { name: 'Sam Lee', status: 'Paused' } },
      ],
    }

    render(<TableWrapper data={groupedData} groupBy={['status']} defaultShape="flat" />)

    expect(screen.queryByLabelText('Expand group:status:Active')).not.toBeInTheDocument()
    expect(screen.getByText('Maya Patel')).toBeInTheDocument()
    expect(screen.getByText('Sam Lee')).toBeInTheDocument()
  })

  it('renders shared row actions and isolates command clicks from row selection', () => {
    const onDuplicate = vi.fn()
    const onRemove = vi.fn()
    const onRowSelect = vi.fn()
    const rowActionData: TableWrapper.Data = {
      columns: [
        { id: 'name', header: 'Name', rowHeader: true },
        { id: 'plan', header: 'Plan' },
      ],
      rows: [{ id: 'row-1', values: { name: 'Premium support', plan: 'Growth' } }],
    }

    render(
      <TableWrapper
        data={rowActionData}
        onRowSelect={onRowSelect}
        rowActions={{
          labels: { duplicate: 'Duplicate row', remove: 'Delete row' },
          onDuplicate,
          onRemove,
        }}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Duplicate row' }))
    fireEvent.click(screen.getByRole('button', { name: 'Delete row' }))

    expect(onDuplicate).toHaveBeenCalledTimes(1)
    expect(onDuplicate).toHaveBeenCalledWith(expect.objectContaining({ id: 'row-1' }))
    expect(onRemove).toHaveBeenCalledTimes(1)
    expect(onRemove).toHaveBeenCalledWith(expect.objectContaining({ id: 'row-1' }))
    expect(onRowSelect).not.toHaveBeenCalled()
  })

  it('runs duplicate and remove row actions from row keyboard shortcuts', () => {
    const onDuplicate = vi.fn()
    const onRemove = vi.fn()
    const rowActionData: TableWrapper.Data = {
      columns: [
        { id: 'name', header: 'Name', rowHeader: true },
        { id: 'plan', header: 'Plan' },
      ],
      rows: [{ id: 'row-1', values: { name: 'Premium support', plan: 'Growth' } }],
    }

    render(
      <TableWrapper
        data={rowActionData}
        rowActions={{
          onDuplicate,
          onRemove,
        }}
      />,
    )

    const nameCell = screen.getByRole('gridcell', { name: 'Edit Name' })
    nameCell.focus()
    fireEvent.keyDown(nameCell, { key: 'd', metaKey: true })
    fireEvent.keyDown(nameCell, { key: 'Delete' })

    expect(onDuplicate).toHaveBeenCalledTimes(1)
    expect(onDuplicate).toHaveBeenCalledWith(expect.objectContaining({ id: 'row-1' }))
    expect(onRemove).toHaveBeenCalledTimes(1)
    expect(onRemove).toHaveBeenCalledWith(expect.objectContaining({ id: 'row-1' }))
  })

  it('suppresses disabled row keyboard shortcuts', () => {
    const onDuplicate = vi.fn()
    const onRemove = vi.fn()
    const rowActionData: TableWrapper.Data = {
      columns: [
        { id: 'name', header: 'Name', rowHeader: true },
        { id: 'plan', header: 'Plan' },
      ],
      rows: [{ id: 'row-1', values: { name: 'Premium support', plan: 'Growth' } }],
    }

    render(
      <TableWrapper
        data={rowActionData}
        rowActions={{
          onDuplicate,
          onRemove,
          canDuplicate: () => false,
          canRemove: () => false,
        }}
      />,
    )

    const nameCell = screen.getByRole('gridcell', { name: 'Edit Name' })
    nameCell.focus()

    expect(fireEvent.keyDown(nameCell, { key: 'd', metaKey: true })).toBe(false)
    expect(fireEvent.keyDown(nameCell, { key: 'Delete' })).toBe(false)
    expect(onDuplicate).not.toHaveBeenCalled()
    expect(onRemove).not.toHaveBeenCalled()
  })

  it('focuses the duplicated row first editable cell after duplicate row action', async () => {
    const initialData: TableWrapper.Data = {
      columns: [
        { id: 'service', header: 'Service', rowHeader: true, editor: { type: 'text' } },
        { id: 'quantity', header: 'Qty', editor: { type: 'number' } },
      ],
      rows: [{ id: 'row-1', values: { service: 'Premium support', quantity: 2 } }],
    }

    function Harness() {
      const [tableData, setTableData] = React.useState<TableWrapper.Data>(initialData)

      return (
        <TableWrapper
          data={tableData}
          onCellEdit={vi.fn()}
          rowActions={{
            labels: { duplicate: 'Duplicate row' },
            onDuplicate: row => {
              setTableData(current => {
                const index = current.rows.findIndex(item => item.id === row.id)
                const duplicate = {
                  ...row,
                  id: `${row.id}-duplicate`,
                  values: { ...row.values, service: `${String(row.values.service)} copy` },
                }
                if (index < 0) return { ...current, rows: [...current.rows, duplicate] }
                return {
                  ...current,
                  rows: [...current.rows.slice(0, index + 1), duplicate, ...current.rows.slice(index + 1)],
                }
              })
            },
          }}
        />
      )
    }

    render(<Harness />)

    fireEvent.click(screen.getByRole('button', { name: 'Duplicate row' }))

    await waitFor(() => {
      const editor = screen.getByRole('textbox', { name: 'Edit Service' })
      expect(editor).toHaveValue('Premium support copy')
      expect(editor).toHaveFocus()
    })
  })

  it('focuses duplicated picker cells without opening the editor', async () => {
    const initialData: TableWrapper.Data = {
      columns: [
        {
          id: 'status',
          header: 'Status',
          rowHeader: true,
          editor: {
            type: 'select',
            options: [
              { label: 'Active', value: 'active' },
              { label: 'Paused', value: 'paused' },
            ],
          },
        },
        { id: 'service', header: 'Service', editor: { type: 'text' } },
      ],
      rows: [{ id: 'row-1', values: { status: 'active', service: 'Premium support' } }],
    }

    function Harness() {
      const [tableData, setTableData] = React.useState<TableWrapper.Data>(initialData)

      return (
        <TableWrapper
          data={tableData}
          onCellEdit={vi.fn()}
          rowActions={{
            labels: { duplicate: 'Duplicate row' },
            onDuplicate: row => {
              setTableData(current => {
                const index = current.rows.findIndex(item => item.id === row.id)
                const duplicate = {
                  ...row,
                  id: `${row.id}-duplicate`,
                  values: { ...row.values, service: `${String(row.values.service)} copy` },
                }
                if (index < 0) return { ...current, rows: [...current.rows, duplicate] }
                return {
                  ...current,
                  rows: [...current.rows.slice(0, index + 1), duplicate, ...current.rows.slice(index + 1)],
                }
              })
            },
          }}
        />
      )
    }

    render(<Harness />)

    fireEvent.click(screen.getByRole('button', { name: 'Duplicate row' }))

    await waitFor(() => {
      const statusButtons = screen.getAllByRole('button', { name: 'Edit Status' })
      expect(statusButtons).toHaveLength(2)
      expect(statusButtons[1]).toHaveFocus()
    })
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument()
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  }, 10_000)

  it('does not reuse a stale duplicate focus request for later unrelated row inserts', async () => {
    const initialData: TableWrapper.Data = {
      columns: [{ id: 'service', header: 'Service', rowHeader: true, editor: { type: 'text' } }],
      rows: [{ id: 'row-1', values: { service: 'Premium support' } }],
    }
    const onDuplicate = vi.fn()

    function Harness() {
      const [tableData, setTableData] = React.useState<TableWrapper.Data>(initialData)

      return (
        <>
          <button
            type="button"
            onClick={() => {
              setTableData(current => ({
                ...current,
                rows: [...current.rows, { id: 'later-row', values: { service: 'Later row' } }],
              }))
            }}
          >
            Add unrelated row
          </button>
          <TableWrapper
            data={tableData}
            onCellEdit={vi.fn()}
            rowActions={{
              labels: { duplicate: 'Duplicate row' },
              onDuplicate,
            }}
          />
        </>
      )
    }

    render(<Harness />)

    fireEvent.click(screen.getByRole('button', { name: 'Duplicate row' }))
    await new Promise(resolve => window.setTimeout(resolve, 0))

    const addButton = screen.getByRole('button', { name: 'Add unrelated row' })
    addButton.focus()
    fireEvent.click(addButton)

    expect(await screen.findByText('Later row')).toBeInTheDocument()
    await new Promise(resolve => window.requestAnimationFrame(() => window.setTimeout(resolve, 0)))

    expect(screen.queryByDisplayValue('Later row')).not.toBeInTheDocument()
    expect(addButton).toHaveFocus()
  })

  it('does not reuse a stale async duplicate focus request for later unrelated row inserts', async () => {
    const initialData: TableWrapper.Data = {
      columns: [{ id: 'service', header: 'Service', rowHeader: true, editor: { type: 'text' } }],
      rows: [{ id: 'row-1', values: { service: 'Premium support' } }],
    }
    const onDuplicate = vi.fn(() => Promise.resolve())

    function Harness() {
      const [tableData, setTableData] = React.useState<TableWrapper.Data>(initialData)

      return (
        <>
          <button
            type="button"
            onClick={() => {
              setTableData(current => ({
                ...current,
                rows: [...current.rows, { id: 'later-row', values: { service: 'Later row' } }],
              }))
            }}
          >
            Add unrelated row
          </button>
          <TableWrapper
            data={tableData}
            onCellEdit={vi.fn()}
            rowActions={{
              labels: { duplicate: 'Duplicate row' },
              onDuplicate,
            }}
          />
        </>
      )
    }

    render(<Harness />)

    fireEvent.click(screen.getByRole('button', { name: 'Duplicate row' }))
    await waitFor(() => expect(onDuplicate).toHaveBeenCalledTimes(1))
    await new Promise(resolve => window.setTimeout(resolve, 0))

    const addButton = screen.getByRole('button', { name: 'Add unrelated row' })
    addButton.focus()
    fireEvent.click(addButton)

    expect(await screen.findByText('Later row')).toBeInTheDocument()
    await new Promise(resolve => window.requestAnimationFrame(() => window.setTimeout(resolve, 0)))

    expect(screen.queryByDisplayValue('Later row')).not.toBeInTheDocument()
    expect(addButton).toHaveFocus()
  })

  it('can morph grouped rows back to flat rows', () => {
    const groupedData: TableWrapper.Data = {
      columns: [
        { id: 'name', header: 'Customer', rowHeader: true },
        { id: 'status', header: 'Status' },
      ],
      rows: [
        { id: 'row-1', values: { name: 'Maya Patel', status: 'Active' } },
        { id: 'row-2', values: { name: 'Sam Lee', status: 'Paused' } },
      ],
    }

    const { rerender } = render(<TableWrapper data={groupedData} groupBy={['status']} />)

    expect(screen.getByLabelText('Expand group:status:Active')).toBeInTheDocument()
    expect(screen.queryByText('Maya Patel')).not.toBeInTheDocument()

    rerender(<TableWrapper data={groupedData} groupBy={[]} />)

    expect(screen.queryByLabelText('Expand group:status:Active')).not.toBeInTheDocument()
    expect(screen.getByText('Maya Patel')).toBeInTheDocument()
    expect(screen.getByText('Sam Lee')).toBeInTheDocument()
  })

  it('can render hierarchical data in a flat shape', () => {
    render(<TableWrapper data={data} shape="flat" />)

    expect(screen.queryByLabelText('Expand group-b')).not.toBeInTheDocument()
    expect(screen.getByText('Growth')).toBeInTheDocument()
    expect(screen.getByText('Sam Lee')).toBeInTheDocument()
  })

  it('collapses expanded rows when expandAll toggles off', () => {
    const { rerender } = render(<TableWrapper data={data} expandAll />)

    expect(screen.getByText('Sam Lee')).toBeInTheDocument()

    rerender(<TableWrapper data={data} expandAll={false} />)

    expect(screen.queryByText('Sam Lee')).not.toBeInTheDocument()
  })

  it(
    'sorts rows when clicking a sortable header',
    () => {
      render(<TableWrapper data={data} />)

      fireEvent.click(screen.getByRole('button', { name: /Customer/i }))

      const rowgroups = screen.getAllByRole('rowgroup')
      const tbody = rowgroups[1]
      if (!tbody) throw new Error('Expected a table body rowgroup')

      const bodyRows = within(tbody).getAllByRole('row')
      expect(bodyRows).toHaveLength(2)

      const firstRow = bodyRows[0]
      const secondRow = bodyRows[1]
      if (!firstRow || !secondRow) {
        throw new Error('Expected two body rows after sorting')
      }

      expect(within(firstRow).getByText('Enterprise')).toBeInTheDocument()
      expect(within(secondRow).getByText('Growth')).toBeInTheDocument()
    },
    TABLE_WRAPPER_INTERACTION_TEST_TIMEOUT_MS,
  )

  it('does not reserve tree indentation for flat row header cells', () => {
    const flatData: TableWrapper.Data = {
      columns: [{ id: 'name', header: 'Name', rowHeader: true }],
      rows: [{ id: 'row-1', values: { name: 'Premium support' } }],
    }

    render(<TableWrapper data={flatData} />)

    const rowHeader = screen.getByRole('rowheader', { name: 'Edit Name' })
    const content = rowHeader.firstElementChild as HTMLElement | null
    expect(content).toHaveStyle({ paddingInlineStart: '0rem' })
  })

  it('renders sortable header controls without extra horizontal padding', () => {
    render(<TableWrapper data={data} />)

    expect(screen.getByRole('button', { name: /Customer/i })).toHaveClass('p-0')
  })

  it('supports align as a column definition option', () => {
    const alignData: TableWrapper.Data = {
      columns: [
        { id: 'name', header: 'Name', rowHeader: true },
        { id: 'quantity', header: 'Qty', align: 'right' },
      ],
      rows: [{ id: 'row-1', values: { name: 'Service', quantity: 2 } }],
    }

    render(<TableWrapper data={alignData} />)

    const quantityCell = screen.getByRole('cell', { name: 'Edit Qty' })
    expect(quantityCell.className).toContain('text-end')
  })

  it('applies primitive table prop values from the prop contract', () => {
    const rootProps = {
      size: tablePropDefs.Root.size.values[1],
      variant: tablePropDefs.Root.variant.values[0],
      layout: tablePropDefs.Root.layout.values[1],
      striped: true,
      compact: true,
    }
    const rowAlign = tablePropDefs.Row.align.values[2]
    const cellJustify = tablePropDefs.Cell.justify.values[2]

    render(
      <Table.Root data-testid="table" {...rootProps}>
        <Table.Body>
          <Table.Row align={rowAlign}>
            <Table.Cell justify={cellJustify}>Total</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>,
    )

    expect(screen.getByTestId('table').className).toContain('table-fixed')
    expect(screen.getByRole('row').className).toContain('[&>td]:align-bottom')
    expect(screen.getByRole('cell', { name: 'Total' }).className).toContain('text-end')
  })

  it('moves focus between editable cells with keyboard navigation', async () => {
    const onCellEdit = vi.fn()
    const editableData: TableWrapper.Data = {
      columns: [
        { id: 'service', header: 'Service', rowHeader: true, editor: { type: 'text' } },
        { id: 'quantity', header: 'Qty', editor: { type: 'number' } },
        { id: 'readonly', header: 'Readonly' },
      ],
      rows: [
        { id: 'row-1', values: { service: 'Premium support', quantity: 2, readonly: 'A' } },
        { id: 'row-2', values: { service: 'Implementation service', quantity: 1, readonly: 'B' } },
      ],
    }

    render(<TableWrapper data={editableData} onCellEdit={onCellEdit} />)

    const serviceCells = screen.getAllByRole('button', { name: 'Edit Service' })
    const quantityCells = screen.getAllByRole('button', { name: 'Edit Qty' })
    const firstServiceCell = serviceCells[0]
    const secondServiceCell = serviceCells[1]
    const firstQuantityCell = quantityCells[0]
    const secondQuantityCell = quantityCells[1]

    if (!firstServiceCell || !secondServiceCell || !firstQuantityCell || !secondQuantityCell) {
      throw new Error('Expected editable cells')
    }

    firstServiceCell.focus()
    fireEvent.keyDown(firstServiceCell, { key: 'Tab' })
    await waitFor(() => expect(document.activeElement).toBe(firstQuantityCell))

    fireEvent.keyDown(firstQuantityCell, { key: 'ArrowDown' })
    await waitFor(() => expect(document.activeElement).toBe(secondQuantityCell))

    fireEvent.keyDown(secondQuantityCell, { key: 'Tab', shiftKey: true })
    await waitFor(() => expect(document.activeElement).toBe(secondServiceCell))
  })

  it('moves focus between readonly cells with arrow keys', async () => {
    const readonlyData: TableWrapper.Data = {
      columns: [
        { id: 'service', header: 'Service', rowHeader: true },
        { id: 'quantity', header: 'Qty' },
      ],
      rows: [
        { id: 'row-1', values: { service: 'Premium support', quantity: 2 } },
        { id: 'row-2', values: { service: 'Implementation service', quantity: 1 } },
      ],
    }

    render(<TableWrapper data={readonlyData} />)

    const firstServiceCell = screen.getByText('Premium support')
    const firstQuantityCell = screen.getByText('2')
    const secondQuantityCell = screen.getByText('1')

    firstServiceCell.focus()
    fireEvent.keyDown(firstServiceCell, { key: 'ArrowRight' })
    await waitFor(() => expect(firstQuantityCell).toHaveFocus())

    fireEvent.keyDown(firstQuantityCell, { key: 'ArrowDown' })
    await waitFor(() => expect(secondQuantityCell).toHaveFocus())
  })

  it('renders label, avatar, checkbox, timeline, sparkline, and priority cells from column renderers', () => {
    const rendererData: TableWrapper.Data = {
      columns: [
        { id: 'assignee', header: 'Assignee', rowHeader: true, renderer: { type: 'avatar' } },
        { id: 'pri', header: 'Pri', renderer: { type: 'priority', display: 'icon-only' } },
        { id: 'priority', header: 'Priority', renderer: { type: 'priority' } },
        {
          id: 'status',
          header: 'Status',
          renderer: {
            type: 'label',
            values: [{ value: 'active', label: 'Active', color: 'success' }],
          },
        },
        { id: 'due', header: 'Due', renderer: { type: 'timeline' } },
        { id: 'severity', header: 'Severity', renderer: { type: 'priority', display: 'label-only' } },
        { id: 'trend', header: 'Trend', renderer: { type: 'sparkline' } },
        { id: 'done', header: 'Done', renderer: { type: 'checkbox' } },
      ],
      rows: [
        {
          id: 'row-1',
          values: {
            assignee: { name: 'Maya Patel' },
            pri: 'low',
            priority: 'critical',
            status: 'active',
            due: { date: '2026-03-21', label: 'Launch window' },
            severity: 'blocker',
            trend: [1, 2, 3, 5, 8],
            done: true,
          },
        },
      ],
    }

    render(<TableWrapper data={rendererData} />)

    expect(screen.getByText('Active')).toBeInTheDocument()
    expect(screen.getByText('Critical')).toBeInTheDocument()
    expect(screen.getByText('Blocker')).toBeInTheDocument()
    expect(screen.getByText('Mar 21, 2026')).toBeInTheDocument()
    expect(screen.getByText('Launch window')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Sparkline' })).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: 'Checked' })).toBeDisabled()
  })

  it('centers checkbox renderer body cells by default', () => {
    const checkboxData: TableWrapper.Data = {
      columns: [
        { id: 'name', header: 'Name', rowHeader: true },
        { id: 'done', header: 'Done', renderer: { type: 'checkbox' } },
      ],
      rows: [{ id: 'row-1', values: { name: 'Task A', done: true } }],
    }

    render(<TableWrapper data={checkboxData} />)

    const checkbox = screen.getByRole('checkbox', { name: 'Checked' })
    const cell = checkbox.closest('td')
    expect(cell?.className).toContain('text-center')
  })

  it('sorts priority cells by rank instead of lexical label order', () => {
    const priorityData: TableWrapper.Data = {
      columns: [
        { id: 'name', header: 'Name', rowHeader: true },
        { id: 'priority', header: 'Priority', renderer: { type: 'priority' } },
      ],
      rows: [
        { id: 'row-high', values: { name: 'High', priority: 'high' } },
        { id: 'row-none', values: { name: 'None', priority: 'none' } },
        { id: 'row-critical', values: { name: 'Critical', priority: 'critical' } },
        { id: 'row-low', values: { name: 'Low', priority: 'low' } },
      ],
    }

    render(<TableWrapper data={priorityData} />)

    fireEvent.click(screen.getByRole('button', { name: /Priority/i }))

    const rowgroups = screen.getAllByRole('rowgroup')
    const tbody = rowgroups[1]
    if (!tbody) throw new Error('Expected a table body rowgroup')

    const bodyRows = within(tbody).getAllByRole('row')
    expect(bodyRows).toHaveLength(4)

    const rowHeaders = bodyRows.map(row => within(row).getByRole('rowheader'))
    expect(rowHeaders.map(cell => cell.textContent)).toEqual(['None', 'Low', 'High', 'Critical'])
  })

  it('falls back to string rendering for unknown priority, status, and classification values', () => {
    const invalidRendererData: TableWrapper.Data = {
      columns: [
        { id: 'name', header: 'Name', rowHeader: true },
        { id: 'priority', header: 'Priority', renderer: { type: 'priority' } },
        { id: 'status', header: 'Status', renderer: { type: 'status' } },
        { id: 'classification', header: 'Classification', renderer: { type: 'classification' } },
      ],
      rows: [
        {
          id: 'row-1',
          values: {
            name: 'Task A',
            priority: { value: 'urgent', label: 'Urgent' } as any,
            status: { value: 'paused', label: 'Paused' } as any,
            classification: { value: 'epic', label: 'Epic' } as any,
          },
        },
      ],
    }

    render(<TableWrapper data={invalidRendererData} />)

    expect(screen.getByText('Urgent')).toBeInTheDocument()
    expect(screen.getByText('Paused')).toBeInTheDocument()
    expect(screen.getByText('Epic')).toBeInTheDocument()
  })

  it('applies configured priority colors to rendered priority icons', () => {
    const priorityColorData: TableWrapper.Data = {
      columns: [
        { id: 'name', header: 'Name', rowHeader: true },
        {
          id: 'priority',
          header: 'Priority',
          renderer: {
            type: 'priority',
            values: [{ value: 'critical', color: 'success' }],
          },
        },
      ],
      rows: [{ id: 'row-1', values: { name: 'Task A', priority: 'critical' } }],
    }

    render(<TableWrapper data={priorityColorData} />)

    const label = screen.getByText('Critical')
    const cell = label.closest('td')
    const icon = cell?.querySelector('svg.lucide-triangle-alert') as SVGElement | null
    expect(icon).not.toBeNull()
    expect(icon?.parentElement).toHaveStyle({ color: getColorVars('success').text })
  })

  it('applies renderer variants to label-only table cells', () => {
    const labelOnlyData: TableWrapper.Data = {
      columns: [
        { id: 'name', header: 'Name', rowHeader: true },
        {
          id: 'severity',
          header: 'Severity',
          renderer: { type: 'priority', display: 'label-only', variant: 'soft' },
        },
      ],
      rows: [{ id: 'row-1', values: { name: 'Task A', severity: 'blocker' } }],
    }

    render(<TableWrapper data={labelOnlyData} />)

    const label = screen.getByText('Blocker')
    const cell = label.closest('td')
    const spans = Array.from(cell?.querySelectorAll('span') ?? [])
    expect(spans.some(span => span.className.includes(badgeColorVariants.error.soft))).toBe(true)
  })

  it(
    'edits text cells from a read-first cell action and commits with Enter',
    async () => {
      const onCellEdit = vi.fn()
      const editableData: TableWrapper.Data = {
        columns: [
          { id: 'service', header: 'Service', rowHeader: true, editor: { type: 'text' } },
          { id: 'quantity', header: 'Qty', editor: { type: 'number' } },
        ],
        rows: [{ id: 'row-1', values: { service: 'Premium support', quantity: 2 } }],
      }

      render(<TableWrapper data={editableData} onCellEdit={onCellEdit} />)

      fireEvent.click(screen.getByRole('button', { name: 'Edit Service' }))
      const input = screen.getByRole('textbox', { name: 'Edit Service' })
      fireEvent.change(input, { target: { value: 'Implementation service' } })
      fireEvent.keyDown(input, { key: 'Enter' })

      expect(onCellEdit).toHaveBeenCalledWith(
        expect.objectContaining({
          rowId: 'row-1',
          columnId: 'service',
          value: 'Implementation service',
          previousValue: 'Premium support',
        }),
      )
      await waitFor(() => expect(screen.getByRole('button', { name: 'Edit Service' })).toHaveFocus())
    },
    TABLE_WRAPPER_INTERACTION_TEST_TIMEOUT_MS,
  )

  it('renders editable cells directly in edit mode when requested', () => {
    const onCellEdit = vi.fn()
    const editableData: TableWrapper.Data = {
      columns: [{ id: 'service', header: 'Service', rowHeader: true, editor: { type: 'text' } }],
      rows: [{ id: 'row-1', values: { service: 'Premium support' } }],
    }

    render(<TableWrapper data={editableData} onCellEdit={onCellEdit} defaultCellMode="edit" />)

    expect(screen.getByRole('textbox', { name: 'Edit Service' })).toHaveValue('Premium support')
    expect(screen.queryByRole('button', { name: 'Edit Service' })).not.toBeInTheDocument()
  })

  it('forces read mode when table editing is disabled', () => {
    const onCellEdit = vi.fn()
    const editableData: TableWrapper.Data = {
      columns: [{ id: 'service', header: 'Service', rowHeader: true, editor: { type: 'text' } }],
      rows: [{ id: 'row-1', values: { service: 'Premium support' } }],
    }

    render(<TableWrapper data={editableData} editable={false} onCellEdit={onCellEdit} defaultCellMode="edit" />)

    expect(screen.getByText('Premium support')).toBeInTheDocument()
    expect(screen.queryByRole('textbox', { name: 'Edit Service' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Edit Service' })).not.toBeInTheDocument()
  })

  it('shows a cell mode toggle when multiple modes are allowed', () => {
    const onCellEdit = vi.fn()
    const editableData: TableWrapper.Data = {
      columns: [{ id: 'service', header: 'Service', rowHeader: true, editor: { type: 'text' } }],
      rows: [{ id: 'row-1', values: { service: 'Premium support' } }],
    }

    render(
      <TableWrapper
        data={editableData}
        onCellEdit={onCellEdit}
        allowedCellModes={['read', 'edit']}
        defaultCellMode="read"
      />,
    )

    expect(screen.getByRole('button', { name: 'Edit Service' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Edit mode' }))

    expect(screen.getByRole('textbox', { name: 'Edit Service' })).toHaveValue('Premium support')
  })

  it(
    'cancels edits with Escape',
    async () => {
      const onCellEdit = vi.fn()
      const editableData: TableWrapper.Data = {
        columns: [{ id: 'service', header: 'Service', rowHeader: true, editor: { type: 'text' } }],
        rows: [{ id: 'row-1', values: { service: 'Premium support' } }],
      }

      render(<TableWrapper data={editableData} onCellEdit={onCellEdit} />)

      fireEvent.keyDown(screen.getByRole('button', { name: 'Edit Service' }), { key: 'Enter' })
      const input = screen.getByRole('textbox', { name: 'Edit Service' })
      fireEvent.change(input, { target: { value: 'Canceled value' } })
      fireEvent.keyDown(input, { key: 'Escape' })

      expect(onCellEdit).not.toHaveBeenCalled()
      const readCell = screen.getByRole('button', { name: 'Edit Service' })
      expect(readCell).toHaveTextContent('Premium support')
      await waitFor(() => expect(readCell).toHaveFocus())
    },
    TABLE_WRAPPER_INTERACTION_TEST_TIMEOUT_MS,
  )

  it(
    'keeps invalid number edits in edit mode',
    () => {
      const onCellEdit = vi.fn()
      const editableData: TableWrapper.Data = {
        columns: [
          {
            id: 'quantity',
            header: 'Qty',
            editor: { type: 'number' },
            validateEdit: ({ value }) => (Number(value) > 0 ? undefined : 'Quantity must be positive'),
          },
        ],
        rows: [{ id: 'row-1', values: { quantity: 2 } }],
      }

      render(<TableWrapper data={editableData} onCellEdit={onCellEdit} />)

      fireEvent.click(screen.getByRole('button', { name: 'Edit Qty' }))
      const input = screen.getByRole('textbox', { name: 'Edit Qty' })
      fireEvent.change(input, { target: { value: '0' } })
      fireEvent.keyDown(input, { key: 'Enter' })

      expect(onCellEdit).not.toHaveBeenCalled()
      expect(screen.getByRole('textbox', { name: 'Edit Qty' })).toBeInTheDocument()
      expect(screen.getByText('Quantity must be positive')).toBeInTheDocument()
    },
    TABLE_WRAPPER_INTERACTION_TEST_TIMEOUT_MS,
  )

  it('blocks non-numeric input in number editors', () => {
    const onCellEdit = vi.fn()
    const editableData: TableWrapper.Data = {
      columns: [{ id: 'quantity', header: 'Qty', editor: { type: 'number' } }],
      rows: [{ id: 'row-1', values: { quantity: 2 } }],
    }

    render(<TableWrapper data={editableData} onCellEdit={onCellEdit} />)

    fireEvent.click(screen.getByRole('button', { name: 'Edit Qty' }))
    const input = screen.getByRole('textbox', { name: 'Edit Qty' })
    fireEvent.change(input, { target: { value: 'dd' } })

    expect(input).toHaveValue('2')
  })
})
