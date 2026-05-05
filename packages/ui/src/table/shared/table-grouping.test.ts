import { describe, expect, it } from 'vitest'
import { flattenTableRows, groupTableRows, hasNestedTableRows } from './table-grouping'

type TestRow = {
  id: string
  values: Record<string, unknown>
  subRows?: TestRow[]
}

describe('table grouping helpers', () => {
  it('groups rows by column values and preserves insertion order', () => {
    const rows: TestRow[] = [
      { id: 'row-1', values: { status: 'open', owner: 'Maya' } },
      { id: 'row-2', values: { status: 'closed', owner: 'Ari' } },
      { id: 'row-3', values: { status: 'open', owner: 'Sam' } },
    ]

    const grouped = groupTableRows({
      rows,
      groupBy: ['status'],
      getValue: (row, columnId) => row.values[columnId],
      createGroupRow: ({ id, label, rows: subRows }) => ({
        id,
        values: { status: label },
        subRows: [...subRows],
      }),
    })

    expect(grouped.map(row => row.values.status)).toEqual(['open', 'closed'])
    expect(grouped[0]?.subRows?.map(row => row.id)).toEqual(['row-1', 'row-3'])
    expect(grouped[1]?.subRows?.map(row => row.id)).toEqual(['row-2'])
  })

  it('uses object identity keys separately from display labels', () => {
    const rows: TestRow[] = [
      { id: 'row-1', values: { owner: { id: 1, name: 'Sam' } } },
      { id: 'row-2', values: { owner: { id: 2, name: 'Sam' } } },
    ]

    const grouped = groupTableRows({
      rows,
      groupBy: ['owner'],
      getValue: (row, columnId) => row.values[columnId],
      createGroupRow: ({ id, label, rows: subRows }) => ({
        id,
        values: { owner: label },
        subRows: [...subRows],
      }),
    })

    expect(grouped.map(row => row.values.owner)).toEqual(['Sam', 'Sam'])
    expect(grouped.map(row => row.id)).toEqual(['group:owner:1', 'group:owner:2'])
    expect(grouped[0]?.subRows?.map(row => row.id)).toEqual(['row-1'])
    expect(grouped[1]?.subRows?.map(row => row.id)).toEqual(['row-2'])
  })

  it('detects and flattens nested rows', () => {
    const rows: TestRow[] = [
      {
        id: 'parent',
        values: { name: 'Parent' },
        subRows: [{ id: 'child', values: { name: 'Child' } }],
      },
    ]

    expect(hasNestedTableRows(rows, row => row.subRows)).toBe(true)
    expect(
      flattenTableRows({
        rows,
        getSubRows: row => row.subRows,
        clearSubRows: row => ({ ...row, subRows: undefined }),
      }),
    ).toEqual([
      { id: 'parent', values: { name: 'Parent' }, subRows: undefined },
      { id: 'child', values: { name: 'Child' }, subRows: undefined },
    ])
  })
})
