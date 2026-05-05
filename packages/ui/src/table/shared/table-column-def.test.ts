import { describe, expect, it } from 'vitest'
import {
  getTableColumnRuntimeMeta,
  type TableColumnDef,
  toFlatTableColumnDef,
  toTanStackTableColumnDef,
} from './table-column-def'

type ProductRow = {
  id: string
  name: string
  status: 'draft' | 'active'
  quantity: number
}

describe('TableColumnDef adapters', () => {
  it('flattens format and editing config into runtime metadata', () => {
    const column: TableColumnDef<ProductRow, ProductRow['status']> = {
      id: 'status',
      header: 'Status',
      accessorKey: 'status',
      sortable: false,
      format: {
        renderer: {
          type: 'label',
          values: [
            { value: 'draft', label: 'Draft', color: 'slate' },
            { value: 'active', label: 'Active', color: 'success' },
          ],
        },
        align: 'center',
        verticalAlign: 'center',
      },
      editor: {
        type: 'select',
        options: [
          { value: 'draft', label: 'Draft' },
          { value: 'active', label: 'Active' },
        ],
      },
    }

    expect(getTableColumnRuntimeMeta(column)).toMatchObject({
      id: 'status',
      header: 'Status',
      sortable: false,
      renderer: { type: 'label' },
      align: 'center',
      justify: 'center',
      verticalAlign: 'center',
      editor: { type: 'select' },
    })
  })

  it('lets readOnly win over editable and editor config', () => {
    const column: TableColumnDef<ProductRow, string> = {
      id: 'name',
      accessorKey: 'name',
      editable: true,
      readOnly: true,
      editor: { type: 'text' },
    }

    expect(getTableColumnRuntimeMeta(column)).toMatchObject({
      editable: false,
      editor: { type: 'readonly' },
    })
  })

  it('creates a flat table column for TableWrapper-style consumers', () => {
    const column = toFlatTableColumnDef<ProductRow, number>({
      id: 'quantity',
      header: 'Qty',
      accessorKey: 'quantity',
      width: '7rem',
      minWidth: '5rem',
      format: { align: 'right' },
      editor: { type: 'number', min: 0 },
    })

    expect(column).toMatchObject({
      id: 'quantity',
      header: 'Qty',
      width: '7rem',
      minWidth: '5rem',
      align: 'right',
      justify: 'end',
      editor: { type: 'number', min: 0 },
    })
  })

  it('prefers accessorFn when accessor is provided', () => {
    const column = toTanStackTableColumnDef<ProductRow, string>({
      id: 'computedName',
      accessor: row => `${row.name}-${row.id}`,
    })

    expect(column).toMatchObject({
      id: 'computedName',
    })
    const accessorColumn = column as { accessorFn?: unknown; accessorKey?: unknown }
    expect(accessorColumn.accessorFn).toBeTypeOf('function')
    expect(accessorColumn.accessorKey).toBeUndefined()
  })

  it('creates a TanStack column for virtual and tree table consumers', () => {
    const column = toTanStackTableColumnDef<ProductRow, number>({
      id: 'quantity',
      header: 'Qty',
      accessorKey: 'quantity',
      width: 120,
      minWidth: 80,
      maxWidth: 200,
      sortable: true,
      resizable: true,
      format: { align: 'right' },
      validateEdit: input => {
        // @ts-expect-error numeric column validators should receive numeric values.
        const invalidString: string = input.value
        void invalidString

        return input.value >= 0 ? undefined : 'Quantity must be positive'
      },
    })

    expect(column).toMatchObject({
      id: 'quantity',
      accessorKey: 'quantity',
      enableSorting: true,
      enableResizing: true,
      size: 120,
      minSize: 80,
      maxSize: 200,
      meta: {
        id: 'quantity',
        header: 'Qty',
        align: 'right',
        justify: 'end',
      },
    })
  })
})
