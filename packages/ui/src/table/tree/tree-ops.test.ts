import { describe, expect, it } from 'vitest'
import {
  addHierarchicalChildRow,
  aggregateHierarchicalRows,
  duplicateHierarchicalRow,
  flattenHierarchicalRows,
  indentHierarchicalRow,
  insertHierarchicalSiblingRow,
  outdentHierarchicalRow,
  removeHierarchicalRow,
  updateHierarchicalRowValue,
} from './tree-ops'
import type { TableTreeRow, TableTreeRowLike } from './types'

type RowValues = {
  name: string
  quantity: number
}

function createRows(): Array<TableTreeRow<RowValues>> {
  return [
    {
      id: 'bundle',
      values: { name: 'Enterprise bundle', quantity: 1 },
      subRows: [
        { id: 'base', values: { name: 'Base license', quantity: 100 } },
        { id: 'support', values: { name: 'Premium support', quantity: 1 } },
      ],
    },
    { id: 'services', values: { name: 'Implementation services', quantity: 1 } },
  ]
}

function createTrainingRow(): TableTreeRow<RowValues> {
  return {
    id: 'training',
    values: { name: 'Training', quantity: 2 },
  }
}

describe('hierarchical table tree operations', () => {
  it('flattens only expanded branches', () => {
    const rows = createRows()

    expect(flattenHierarchicalRows(rows, {}).map(item => item.row.id)).toEqual(['bundle', 'services'])
    expect(flattenHierarchicalRows(rows, { bundle: true }).map(item => [item.row.id, item.depth])).toEqual([
      ['bundle', 0],
      ['base', 1],
      ['support', 1],
      ['services', 0],
    ])
  })

  it('updates nested cell values without mutating the original rows', () => {
    const rows = createRows()
    const nextRows = updateHierarchicalRowValue(rows, 'base', 'quantity', 120)
    // @ts-expect-error quantity must be updated with a number value.
    updateHierarchicalRowValue(rows, 'base', 'quantity', '120')

    expect(nextRows[0]?.subRows?.[0]?.values.quantity).toBe(120)
    expect(rows[0]?.subRows?.[0]?.values.quantity).toBe(100)
  })

  it('preserves caller row metadata types', () => {
    interface RichRow extends TableTreeRowLike<RowValues, RichRow> {
      selected: boolean
    }
    const rows: RichRow[] = [
      {
        id: 'bundle',
        selected: true,
        values: { name: 'Enterprise bundle', quantity: 1 },
        subRows: [{ id: 'base', selected: false, values: { name: 'Base license', quantity: 100 } }],
      },
    ]
    const nextRows: RichRow[] = updateHierarchicalRowValue(rows, 'base', 'quantity', 120)

    expect(nextRows[0]?.selected).toBe(true)
    expect(nextRows[0]?.subRows?.[0]?.selected).toBe(false)
    expect(nextRows[0]?.subRows?.[0]?.values.quantity).toBe(120)

    const withChild: RichRow[] = addHierarchicalChildRow(rows, 'bundle', {
      id: 'support',
      selected: false,
      values: { name: 'Support', quantity: 1 },
    })

    expect(withChild[0]?.subRows?.map(row => row.selected)).toEqual([false, false])
  })

  it('adds, duplicates, and removes nested rows', () => {
    const trainingRow = createTrainingRow()
    const rows = addHierarchicalChildRow(createRows(), 'bundle', trainingRow)
    const duplicated = duplicateHierarchicalRow(rows, 'training', row => `${row.id}-copy`)
    const removed = removeHierarchicalRow(duplicated, 'support')

    expect(removed[0]?.subRows?.map(row => row.id)).toEqual(['base', 'training', 'training-copy'])
    expect(rows[0]?.subRows?.[2]).not.toBe(trainingRow)
    expect(rows[0]?.subRows?.[2]?.values).not.toBe(trainingRow.values)
  })

  it('inserts a sibling after the targeted row', () => {
    const trainingRow = createTrainingRow()
    const rows = insertHierarchicalSiblingRow(createRows(), 'base', trainingRow)

    expect(rows[0]?.subRows?.map(row => row.id)).toEqual(['base', 'training', 'support'])
    expect(rows[0]?.subRows?.[1]).not.toBe(trainingRow)
    expect(rows[0]?.subRows?.[1]?.values).not.toBe(trainingRow.values)
  })

  it('keeps arbitrary object cell values intact unless a clone strategy is provided', () => {
    const createdAt = new Date('2026-01-01T00:00:00.000Z')
    const rows: Array<TableTreeRow<Record<string, unknown>>> = [
      {
        id: 'row',
        values: {
          createdAt,
          formula: {
            expression: 'quantity * price',
            metadata: { status: 'valid' },
          },
        },
      },
    ]

    const duplicated = duplicateHierarchicalRow(rows, 'row', row => `${row.id}-copy`)
    const copiedDate = duplicated[1]?.values.createdAt

    expect(copiedDate).toBe(createdAt)

    const cloned = duplicateHierarchicalRow(rows, 'row', row => `${row.id}-copy`, {
      cloneValue: value => {
        if (value === null || typeof value !== 'object') return value
        if (value instanceof Date) return value
        return structuredClone(value)
      },
    })
    const originalFormula = cloned[0]?.values.formula
    const copiedFormula = cloned[1]?.values.formula

    expect(copiedFormula).toEqual(originalFormula)
    expect(copiedFormula).not.toBe(originalFormula)
  })

  it('indents and outdents rows relative to siblings', () => {
    const indented = indentHierarchicalRow(createRows(), 'support')

    expect(indented[0]?.subRows?.map(row => row.id)).toEqual(['base'])
    expect(indented[0]?.subRows?.[0]?.subRows?.map(row => row.id)).toEqual(['support'])

    const outdented = outdentHierarchicalRow(indented, 'support')

    expect(outdented[0]?.subRows?.map(row => row.id)).toEqual(['base', 'support'])
    expect(outdented[0]?.subRows?.[0]?.subRows).toEqual([])
    expect(outdented.map(row => row.id)).toEqual(['bundle', 'services'])
  })

  it('outdents the original row after duplicating it', () => {
    const duplicated = duplicateHierarchicalRow(createRows(), 'support', row => `${row.id}-copy`)
    const outdented = outdentHierarchicalRow(duplicated, 'support')

    expect(outdented.map(row => row.id)).toEqual(['bundle', 'support', 'services'])
    expect(outdented[0]?.subRows?.map(row => row.id)).toEqual(['base', 'support-copy'])
  })
})

describe('aggregateHierarchicalRows', () => {
  type PriceRow = { name: string; quantity: number; unitPrice: number }

  function createPriceRows(): Array<TableTreeRow<PriceRow>> {
    return [
      {
        id: 'bundle',
        values: { name: 'Enterprise bundle', quantity: 0, unitPrice: 0 },
        subRows: [
          { id: 'base', values: { name: 'Base license', quantity: 100, unitPrice: 50 } },
          { id: 'support', values: { name: 'Premium support', quantity: 1, unitPrice: 2400 } },
        ],
      },
      { id: 'services', values: { name: 'Implementation services', quantity: 1, unitPrice: 15000 } },
    ]
  }

  it('sums child values into parent', () => {
    const rows = createPriceRows()
    const result = aggregateHierarchicalRows(rows, [{ column: 'quantity', fn: 'sum' }])

    expect(result[0]?.values.quantity).toBe(101)
    expect(result[1]?.values.quantity).toBe(1)
  })

  it('computes count', () => {
    const rows = createPriceRows()
    const result = aggregateHierarchicalRows(rows, [{ column: 'quantity', fn: 'count' }])

    expect(result[0]?.values.quantity).toBe(2)
  })

  it('counts non-numeric child values into a number-compatible column', () => {
    type CountRow = { name: string | number }
    const rows: Array<TableTreeRow<CountRow>> = [
      {
        id: 'bundle',
        values: { name: 'Enterprise bundle' },
        subRows: [
          { id: 'base', values: { name: 'Base license' } },
          { id: 'support', values: { name: 'Premium support' } },
        ],
      },
    ]
    const result = aggregateHierarchicalRows(rows, [{ column: 'name', fn: 'count' }])

    expect(result[0]?.values.name).toBe(2)
  })

  it('computes min and max', () => {
    const rows = createPriceRows()
    const minResult = aggregateHierarchicalRows(rows, [{ column: 'unitPrice', fn: 'min' }])
    const maxResult = aggregateHierarchicalRows(rows, [{ column: 'unitPrice', fn: 'max' }])

    expect(minResult[0]?.values.unitPrice).toBe(50)
    expect(maxResult[0]?.values.unitPrice).toBe(2400)
  })

  it('computes mean', () => {
    const rows = createPriceRows()
    const result = aggregateHierarchicalRows(rows, [{ column: 'unitPrice', fn: 'mean' }])

    expect(result[0]?.values.unitPrice).toBe(1225)
  })

  it('supports custom aggregate function', () => {
    const rows = createPriceRows()
    const result = aggregateHierarchicalRows(rows, [{ column: 'name', fn: (values: string[]) => values.join(', ') }])

    expect(result[0]?.values.name).toBe('Base license, Premium support')
  })

  it('aggregates recursively through nested levels', () => {
    const rows: Array<TableTreeRow<PriceRow>> = [
      {
        id: 'root',
        values: { name: 'Root', quantity: 0, unitPrice: 0 },
        subRows: [
          {
            id: 'group',
            values: { name: 'Group', quantity: 0, unitPrice: 0 },
            subRows: [
              { id: 'a', values: { name: 'A', quantity: 10, unitPrice: 5 } },
              { id: 'b', values: { name: 'B', quantity: 20, unitPrice: 10 } },
            ],
          },
          { id: 'c', values: { name: 'C', quantity: 5, unitPrice: 3 } },
        ],
      },
    ]

    const result = aggregateHierarchicalRows(rows, [{ column: 'quantity', fn: 'sum' }])

    expect(result[0]?.subRows?.[0]?.values.quantity).toBe(30)
    expect(result[0]?.values.quantity).toBe(35)
  })

  it('does not mutate original rows', () => {
    const rows = createPriceRows()
    const result = aggregateHierarchicalRows(rows, [{ column: 'quantity', fn: 'sum' }])

    expect(rows[0]?.values.quantity).toBe(0)
    expect(result[0]?.values.quantity).toBe(101)
  })

  it('leaves leaf rows unchanged', () => {
    const rows = createPriceRows()
    const result = aggregateHierarchicalRows(rows, [{ column: 'quantity', fn: 'sum' }])

    expect(result[1]?.values.quantity).toBe(1)
    expect(result[1]?.values.name).toBe('Implementation services')
  })
})
