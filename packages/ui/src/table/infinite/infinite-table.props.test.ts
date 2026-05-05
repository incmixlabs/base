import { describe, expect, it } from 'vitest'
import type { InfiniteTableColumnDef } from './infinite-table.props'

type ProductRow = {
  id: string
  quantity: number
}

describe('InfiniteTableColumnDef editable metadata types', () => {
  it('carries the column value type into edit validators', () => {
    const column: InfiniteTableColumnDef<ProductRow, number> = {
      accessorKey: 'quantity',
      meta: {
        validateEdit: input => {
          // @ts-expect-error quantity validator values must stay typed as number.
          const invalidString: string = input.value
          void invalidString

          return input.value > 0 ? undefined : 'Quantity must be positive'
        },
      },
    }

    expect(
      column.meta?.validateEdit?.({
        row: { id: 'product-1', quantity: 2 },
        rowId: 'product-1',
        columnId: 'quantity',
        value: 2,
      }),
    ).toBeUndefined()
  })
})
