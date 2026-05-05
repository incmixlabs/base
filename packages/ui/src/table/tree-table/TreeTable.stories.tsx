import type { Meta, StoryObj } from '@storybook/react-vite'
import * as React from 'react'
import { Flex } from '@/layouts/flex/Flex'
import {
  EDIT_TABLE_CELL_MODE,
  READ_TABLE_CELL_MODE,
  toTanStackTableColumnDefs,
  type TableColumnDef,
} from '@/table/shared'
import {
  addHierarchicalChildRow,
  aggregateHierarchicalRows,
  duplicateHierarchicalRow,
  indentHierarchicalRow,
  insertHierarchicalSiblingRow,
  outdentHierarchicalRow,
  removeHierarchicalRow,
  updateHierarchicalRowValue,
} from '../tree'
import type { TreeTableColumnDef } from './tree-table.props'
import { TreeTable } from './TreeTable'

// ─── Sample data ────────────────────────────────────────────────────────────

type LineItem = {
  id: string
  values: LineItemValues
  subRows?: LineItem[]
}

type LineItemValues = {
  name: string
  quantity: number
  unitPrice: number
  totalValue?: number
}

function createSampleData(): LineItem[] {
  return [
    {
      id: 'bundle',
      values: { name: 'Enterprise bundle', quantity: 1, unitPrice: 0 },
      subRows: [
        { id: 'base', values: { name: 'Base license', quantity: 100, unitPrice: 50 } },
        { id: 'support', values: { name: 'Premium support', quantity: 1, unitPrice: 2400 } },
        {
          id: 'addons',
          values: { name: 'Add-ons', quantity: 1, unitPrice: 0 },
          subRows: [
            { id: 'sso', values: { name: 'SSO integration', quantity: 1, unitPrice: 500 } },
            { id: 'audit', values: { name: 'Audit logging', quantity: 1, unitPrice: 300 } },
          ],
        },
      ],
    },
    { id: 'services', values: { name: 'Implementation services', quantity: 1, unitPrice: 15000 } },
    { id: 'training', values: { name: 'Training sessions', quantity: 3, unitPrice: 1200 } },
  ]
}

const columns: TreeTableColumnDef<LineItem>[] = [
  {
    id: 'name',
    accessorFn: row => row.values.name,
    header: 'Item',
    size: 300,
    meta: {
      editable: true,
      editor: { type: 'text' },
    },
  },
  {
    id: 'quantity',
    accessorFn: row => row.values.quantity,
    header: 'Qty',
    size: 100,
    meta: {
      editable: true,
      editor: { type: 'number', min: 0 },
      justify: 'end',
    },
  },
  {
    id: 'unitPrice',
    accessorFn: row => row.values.unitPrice,
    header: 'Unit price',
    size: 120,
    meta: {
      editable: true,
      editor: { type: 'number', min: 0, decimal: 2 },
      justify: 'end',
    },
    cell: ({ getValue }) => {
      const val = getValue() as number
      return `$${val.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
    },
  },
  {
    id: 'total',
    header: 'Total',
    size: 120,
    meta: {
      justify: 'end',
      editor: { type: 'readonly' },
    },
    accessorFn: row => row.values.quantity * row.values.unitPrice,
    cell: ({ getValue }) => {
      const val = getValue() as number
      return `$${val.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
    },
  },
]

const sharedColumnDefs: TableColumnDef<LineItem>[] = [
  {
    id: 'name',
    header: 'Item',
    accessor: row => row.values.name,
    width: 300,
    editable: true,
    editor: { type: 'text' },
  },
  {
    id: 'quantity',
    header: 'Qty',
    accessor: row => row.values.quantity,
    width: 100,
    editable: true,
    editor: { type: 'number', min: 0 },
    format: { align: 'right' },
  },
  {
    id: 'unitPrice',
    header: 'Unit price',
    accessor: row => row.values.unitPrice,
    width: 120,
    editable: true,
    editor: { type: 'number', min: 0, decimal: 2 },
    format: { align: 'right' },
  },
  {
    id: 'total',
    header: 'Total',
    accessor: row => row.values.quantity * row.values.unitPrice,
    width: 120,
    readOnly: true,
    format: { align: 'right' },
  },
]

const sharedColumns: TreeTableColumnDef<LineItem>[] = toTanStackTableColumnDefs(sharedColumnDefs)

// ─── Meta ───────────────────────────────────────────────────────────────────

const meta: Meta = {
  title: 'Table/TreeTable',
  parameters: { layout: 'fullscreen' },
  decorators: [
    Story => (
      <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta

// ─── Default ────────────────────────────────────────────────────────────────

export const Default: StoryObj = {
  render: () => {
    const [data, setData] = React.useState(createSampleData)

    return (
      <Flex direction="column" className="h-full w-full">
        <TreeTable.Root<LineItem>
          columns={columns}
          data={data}
          getRowId={row => row.id}
          getSubRows={row => row.subRows}
          size="sm"
          onCellEdit={({ rowId, columnId, value }) => {
            setData(prev => updateLineItemValue(prev, rowId, columnId, value))
          }}
          onAddChild={parent => {
            setData(prev => addHierarchicalChildRow(prev, parent.id, createNewLineItem()))
          }}
          onAddSibling={row => {
            setData(prev => insertHierarchicalSiblingRow(prev, row.id, createNewLineItem()))
          }}
          onRemove={row => {
            setData(prev => removeHierarchicalRow(prev, row.id))
          }}
          onIndent={row => {
            setData(prev => indentHierarchicalRow(prev, row.id))
          }}
          onOutdent={row => {
            setData(prev => outdentHierarchicalRow(prev, row.id))
          }}
          onDuplicate={row => {
            setData(prev => duplicateLineItemRow(prev, row.id))
          }}
        >
          <TreeTable.Toolbar actions={<span className="text-xs text-muted-foreground">Editable tree table</span>} />
          <TreeTable.Content />
        </TreeTable.Root>
      </Flex>
    )
  },
}

export const SharedColumnSchema: StoryObj = {
  render: () => {
    const [data, setData] = React.useState(createSampleData)

    return (
      <Flex direction="column" className="h-full w-full">
        <TreeTable.Root<LineItem>
          columns={sharedColumns}
          data={data}
          getRowId={row => row.id}
          getSubRows={row => row.subRows}
          size="sm"
          onCellEdit={({ rowId, columnId, value }) => {
            setData(prev => updateLineItemValue(prev, rowId, columnId, value))
          }}
          onAddChild={parent => {
            setData(prev => addHierarchicalChildRow(prev, parent.id, createNewLineItem()))
          }}
          onAddSibling={row => {
            setData(prev => insertHierarchicalSiblingRow(prev, row.id, createNewLineItem()))
          }}
          onRemove={row => {
            setData(prev => removeHierarchicalRow(prev, row.id))
          }}
          onIndent={row => {
            setData(prev => indentHierarchicalRow(prev, row.id))
          }}
          onOutdent={row => {
            setData(prev => outdentHierarchicalRow(prev, row.id))
          }}
          onDuplicate={row => {
            setData(prev => duplicateLineItemRow(prev, row.id))
          }}
        >
          <TreeTable.Toolbar
            actions={<span className="text-xs text-muted-foreground">Shared TableColumnDef adapter path</span>}
          />
          <TreeTable.Content />
        </TreeTable.Root>
      </Flex>
    )
  },
}

// ─── Read-only ──────────────────────────────────────────────────────────────

export const ReadOnly: StoryObj = {
  render: () => {
    const readonlyColumns: TreeTableColumnDef<LineItem>[] = columns.map(col => ({
      ...col,
      meta: { ...col.meta, editable: false, editor: undefined },
    }))

    return (
      <Flex direction="column" className="h-full w-full">
        <TreeTable.Root<LineItem>
          columns={readonlyColumns}
          data={createSampleData()}
          getRowId={row => row.id}
          getSubRows={row => row.subRows}
          size="sm"
        >
          <TreeTable.Toolbar />
          <TreeTable.Content />
        </TreeTable.Root>
      </Flex>
    )
  },
}

// ─── With Aggregates ────────────────────────────────────────────────────────

function computeAggregates(rows: LineItem[]): LineItem[] {
  const withTotals = rows.map(addLineItemTotalValue)
  const aggregated = aggregateHierarchicalRows(withTotals, [
    { column: 'quantity', fn: 'sum' },
    { column: 'totalValue', fn: 'sum' },
  ])

  return aggregated.map(normalizeAggregatedLineItem)
}

function addLineItemTotalValue(row: LineItem): LineItem {
  return {
    ...row,
    values: {
      ...row.values,
      totalValue: row.values.quantity * row.values.unitPrice,
    },
    subRows: row.subRows?.map(addLineItemTotalValue),
  }
}

function normalizeAggregatedLineItem(row: LineItem): LineItem {
  const normalizedChildren = row.subRows?.map(normalizeAggregatedLineItem)
  if (!normalizedChildren?.length) return row

  const totalQty = row.values.quantity
  const totalValue = row.values.totalValue ?? 0

  return {
    ...row,
    values: {
      ...row.values,
      unitPrice: totalQty > 0 ? totalValue / totalQty : 0,
    },
    subRows: normalizedChildren,
  }
}

const aggregateColumns: TreeTableColumnDef<LineItem>[] = [
  {
    id: 'name',
    accessorFn: row => row.values.name,
    header: 'Item',
    size: 300,
  },
  {
    id: 'quantity',
    accessorFn: row => row.values.quantity,
    header: 'Qty',
    size: 100,
    meta: { justify: 'end' },
  },
  {
    id: 'unitPrice',
    accessorFn: row => row.values.unitPrice,
    header: 'Unit price',
    size: 120,
    meta: { justify: 'end' },
    cell: ({ getValue }) => {
      const val = getValue() as number
      return `$${val.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
    },
  },
  {
    id: 'total',
    header: 'Total',
    size: 140,
    meta: { justify: 'end' },
    accessorFn: row => row.values.quantity * row.values.unitPrice,
    cell: ({ getValue }) => {
      const val = getValue() as number
      return `$${val.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
    },
  },
]

export const WithAggregates: StoryObj = {
  render: () => {
    const data = React.useMemo(() => computeAggregates(createSampleData()), [])

    return (
      <Flex direction="column" className="h-full w-full">
        <TreeTable.Root<LineItem>
          columns={aggregateColumns}
          data={data}
          getRowId={row => row.id}
          getSubRows={row => row.subRows}
          size="sm"
        >
          <TreeTable.Toolbar
            meta={<span className="text-xs text-muted-foreground">Parent rows show aggregated totals</span>}
          />
          <TreeTable.Content />
        </TreeTable.Root>
      </Flex>
    )
  },
}

// ─── Editable with Aggregates ───────────────────────────────────────────────

const isLeaf = (row: LineItem) => !row.subRows?.length

const editableAggregateColumns: TreeTableColumnDef<LineItem>[] = [
  {
    id: 'name',
    accessorFn: row => row.values.name,
    header: 'Item',
    size: 300,
    meta: {
      editable: true,
      editor: { type: 'text' },
    },
  },
  {
    id: 'quantity',
    accessorFn: row => row.values.quantity,
    header: 'Qty',
    size: 100,
    meta: {
      editable: ({ row }) => isLeaf(row as LineItem),
      editor: { type: 'number', min: 0 },
      justify: 'end',
    },
  },
  {
    id: 'unitPrice',
    accessorFn: row => row.values.unitPrice,
    header: 'Unit price',
    size: 120,
    meta: {
      editable: ({ row }) => isLeaf(row as LineItem),
      editor: { type: 'number', min: 0, decimal: 2 },
      justify: 'end',
    },
    cell: ({ getValue }) => {
      const val = getValue() as number
      return `$${val.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
    },
  },
  {
    id: 'total',
    header: 'Total',
    size: 140,
    meta: {
      justify: 'end',
      editor: { type: 'readonly' },
    },
    accessorFn: row => row.values.quantity * row.values.unitPrice,
    cell: ({ getValue }) => {
      const val = getValue() as number
      return `$${val.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
    },
  },
]

export const EditableWithAggregates: StoryObj = {
  render: () => {
    const [data, setData] = React.useState(createSampleData)
    const aggregated = React.useMemo(() => computeAggregates(data), [data])

    return (
      <Flex direction="column" className="h-full w-full">
        <TreeTable.Root<LineItem>
          columns={editableAggregateColumns}
          data={aggregated}
          getRowId={row => row.id}
          getSubRows={row => row.subRows}
          size="sm"
          defaultCellMode={EDIT_TABLE_CELL_MODE}
          allowedCellModes={[READ_TABLE_CELL_MODE, EDIT_TABLE_CELL_MODE]}
          onCellEdit={({ rowId, columnId, value }) => {
            setData(prev => updateLineItemValue(prev, rowId, columnId, value))
          }}
          onAddChild={parent => {
            setData(prev => addHierarchicalChildRow(prev, parent.id, createNewLineItem()))
          }}
          onAddSibling={row => {
            setData(prev => insertHierarchicalSiblingRow(prev, row.id, createNewLineItem()))
          }}
          onRemove={row => {
            setData(prev => removeHierarchicalRow(prev, row.id))
          }}
          onIndent={row => {
            setData(prev => indentHierarchicalRow(prev, row.id))
          }}
          onOutdent={row => {
            setData(prev => outdentHierarchicalRow(prev, row.id))
          }}
          onDuplicate={row => {
            setData(prev => duplicateLineItemRow(prev, row.id))
          }}
        >
          <TreeTable.Toolbar
            meta={
              <span className="text-xs text-muted-foreground">
                Labels are editable, leaf numeric cells are editable, parent rows show aggregated totals
              </span>
            }
          />
          <TreeTable.Content />
        </TreeTable.Root>
      </Flex>
    )
  },
}

// ─── Story adapters ─────────────────────────────────────────────────────────

function createStoryId(prefix: string) {
  return `${prefix}-${globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2, 10)}`
}

function createNewLineItem(): LineItem {
  return {
    id: createStoryId('new'),
    values: { name: 'New item', quantity: 1, unitPrice: 0 },
  }
}

function duplicateLineItemRow(rows: LineItem[], rowId: string) {
  let copiedRootId: string | undefined
  let copiedRootName: string | undefined
  const duplicated = duplicateHierarchicalRow(rows, rowId, (row, path) => {
    const copiedId = createStoryId(`${row.id}-copy`)
    if (path === 'copy') {
      copiedRootId = copiedId
      copiedRootName = `${row.values.name} copy`
    }
    return copiedId
  })

  return copiedRootId && copiedRootName
    ? updateHierarchicalRowValue(duplicated, copiedRootId, 'name', copiedRootName)
    : duplicated
}

function updateLineItemValue(rows: LineItem[], rowId: string, columnId: string, value: unknown): LineItem[] {
  if (columnId === 'name') {
    return updateHierarchicalRowValue(rows, rowId, 'name', String(value))
  }
  if (columnId === 'quantity') {
    return updateHierarchicalRowValue(rows, rowId, 'quantity', Number(value))
  }
  if (columnId === 'unitPrice') {
    return updateHierarchicalRowValue(rows, rowId, 'unitPrice', Number(value))
  }
  return rows
}
