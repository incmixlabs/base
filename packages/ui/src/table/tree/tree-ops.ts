import type {
  TableTreeOperationOptions,
  TableTreeRowLike,
  TableTreeRowValueOf,
  TableTreeRowValues,
  TableTreeVisibleRow,
} from './types'

type Path = number[]

function cloneRowValues<TValues extends TableTreeRowValues>(
  values: TValues,
  cloneValue?: TableTreeOperationOptions['cloneValue'],
): TValues {
  if (!cloneValue) return { ...values }

  return Object.fromEntries(Object.entries(values).map(([key, value]) => [key, cloneValue(value)])) as TValues
}

function cloneRows<TValues extends TableTreeRowValues, TRow extends TableTreeRowLike<TValues, TRow>>(
  rows: TRow[],
  options: TableTreeOperationOptions = {},
): TRow[] {
  return rows.map(row => ({
    ...row,
    values: cloneRowValues(row.values, options.cloneValue),
    subRows: row.subRows ? cloneRows(row.subRows, options) : undefined,
  })) as TRow[]
}

function findPath<TValues extends TableTreeRowValues, TRow extends TableTreeRowLike<TValues, TRow>>(
  rows: TRow[],
  rowId: string,
  prefix: Path = [],
): Path | undefined {
  for (let index = 0; index < rows.length; index += 1) {
    const row = rows[index]
    if (!row) continue
    const path = [...prefix, index]
    if (row.id === rowId) return path
    const childPath = row.subRows ? findPath(row.subRows, rowId, path) : undefined
    if (childPath) return childPath
  }

  return undefined
}

function rowsAtPath<TValues extends TableTreeRowValues, TRow extends TableTreeRowLike<TValues, TRow>>(
  rows: TRow[],
  parentPath: Path,
): TRow[] | undefined {
  let current = rows
  for (const segment of parentPath) {
    const row = current[segment]
    if (!row?.subRows) return undefined
    current = row.subRows
  }
  return current
}

function ensureRowsAtPath<TValues extends TableTreeRowValues, TRow extends TableTreeRowLike<TValues, TRow>>(
  rows: TRow[],
  parentPath: Path,
): TRow[] | undefined {
  let current = rows
  for (const segment of parentPath) {
    const row = current[segment]
    if (!row) return undefined
    row.subRows ??= []
    current = row.subRows
  }
  return current
}

function rowAtPath<TValues extends TableTreeRowValues, TRow extends TableTreeRowLike<TValues, TRow>>(
  rows: TRow[],
  path: Path,
): TRow | undefined {
  if (path.length === 0) return undefined
  const parentRows = rowsAtPath(rows, path.slice(0, -1))
  return parentRows?.[path[path.length - 1] ?? -1]
}

function removeAtPath<TValues extends TableTreeRowValues, TRow extends TableTreeRowLike<TValues, TRow>>(
  rows: TRow[],
  path: Path,
): TRow | undefined {
  const parentRows = rowsAtPath(rows, path.slice(0, -1))
  if (!parentRows) return undefined
  const [removed] = parentRows.splice(path[path.length - 1] ?? -1, 1)
  return removed
}

function insertAtPath<TValues extends TableTreeRowValues, TRow extends TableTreeRowLike<TValues, TRow>>(
  rows: TRow[],
  parentPath: Path,
  index: number,
  row: TRow,
) {
  const parentRows = ensureRowsAtPath(rows, parentPath)
  if (!parentRows) return
  parentRows.splice(Math.max(0, Math.min(index, parentRows.length)), 0, row)
}

function cloneRowWithIds<TValues extends TableTreeRowValues, TRow extends TableTreeRowLike<TValues, TRow>>(
  row: TRow,
  getCopiedRowId: (row: TRow, path: string) => string,
  options: TableTreeOperationOptions = {},
  path = 'copy',
): TRow {
  return {
    ...row,
    id: getCopiedRowId(row, path),
    values: cloneRowValues(row.values, options.cloneValue),
    subRows: row.subRows?.map((child, index) => cloneRowWithIds(child, getCopiedRowId, options, `${path}-${index}`)),
  } as TRow
}

export function flattenHierarchicalRows<
  TValues extends TableTreeRowValues,
  TRow extends TableTreeRowLike<TValues, TRow>,
>(rows: TRow[], expanded: Record<string, boolean>): Array<TableTreeVisibleRow<TValues, TRow>> {
  const visibleRows: Array<TableTreeVisibleRow<TValues, TRow>> = []

  const walk = (items: TRow[], depth: number, parentId?: string) => {
    for (const row of items) {
      const hasChildren = Boolean(row.subRows?.length)
      visibleRows.push({ row, depth, parentId, hasChildren })
      if (hasChildren && expanded[row.id]) {
        walk(row.subRows ?? [], depth + 1, row.id)
      }
    }
  }

  walk(rows, 0)
  return visibleRows
}

export function updateHierarchicalRowValue<
  TRow extends TableTreeRowLike<TableTreeRowValues, TRow>,
  TColumnId extends Extract<keyof TableTreeRowValueOf<TRow>, string>,
>(
  rows: TRow[],
  rowId: string,
  columnId: TColumnId,
  value: NoInfer<TableTreeRowValueOf<TRow>[TColumnId]>,
  options?: TableTreeOperationOptions,
): TRow[] {
  const nextRows = cloneRows(rows, options)
  const path = findPath(nextRows, rowId)
  const row = path ? rowAtPath(nextRows, path) : undefined
  if (!row) return rows

  row.values = { ...row.values, [columnId]: value }
  return nextRows
}

export function addHierarchicalChildRow<
  TValues extends TableTreeRowValues,
  TRow extends TableTreeRowLike<TValues, TRow>,
>(rows: TRow[], parentId: string, child: TRow, options?: TableTreeOperationOptions): TRow[] {
  const nextRows = cloneRows(rows, options)
  const path = findPath(nextRows, parentId)
  const parent = path ? rowAtPath(nextRows, path) : undefined
  if (!parent) return rows

  const [clonedChild] = cloneRows([child], options)
  parent.subRows = [...(parent.subRows ?? []), clonedChild]
  return nextRows
}

export function insertHierarchicalSiblingRow<
  TValues extends TableTreeRowValues,
  TRow extends TableTreeRowLike<TValues, TRow>,
>(rows: TRow[], rowId: string, sibling: TRow, options?: TableTreeOperationOptions): TRow[] {
  const nextRows = cloneRows(rows, options)
  const path = findPath(nextRows, rowId)
  if (!path) return rows

  const [clonedSibling] = cloneRows([sibling], options)
  insertAtPath(nextRows, path.slice(0, -1), (path[path.length - 1] ?? 0) + 1, clonedSibling)
  return nextRows
}

export function removeHierarchicalRow<TValues extends TableTreeRowValues, TRow extends TableTreeRowLike<TValues, TRow>>(
  rows: TRow[],
  rowId: string,
  options?: TableTreeOperationOptions,
): TRow[] {
  const nextRows = cloneRows(rows, options)
  const path = findPath(nextRows, rowId)
  if (!path) return rows

  removeAtPath(nextRows, path)
  return nextRows
}

export function duplicateHierarchicalRow<
  TValues extends TableTreeRowValues,
  TRow extends TableTreeRowLike<TValues, TRow>,
>(
  rows: TRow[],
  rowId: string,
  getCopiedRowId: (row: TRow, path: string) => string = (row, path) => `${row.id}-${path}`,
  options?: TableTreeOperationOptions,
): TRow[] {
  const nextRows = cloneRows(rows, options)
  const path = findPath(nextRows, rowId)
  const row = path ? rowAtPath(nextRows, path) : undefined
  if (!path || !row) return rows

  insertAtPath(
    nextRows,
    path.slice(0, -1),
    (path[path.length - 1] ?? 0) + 1,
    cloneRowWithIds(row, getCopiedRowId, options),
  )
  return nextRows
}

export function indentHierarchicalRow<TValues extends TableTreeRowValues, TRow extends TableTreeRowLike<TValues, TRow>>(
  rows: TRow[],
  rowId: string,
  options?: TableTreeOperationOptions,
): TRow[] {
  const nextRows = cloneRows(rows, options)
  const path = findPath(nextRows, rowId)
  if (!path) return rows

  const index = path[path.length - 1] ?? 0
  if (index === 0) return rows

  const previousSiblingPath = [...path.slice(0, -1), index - 1]
  const row = removeAtPath(nextRows, path)
  const previousSibling = rowAtPath(nextRows, previousSiblingPath)
  if (!row || !previousSibling) return rows

  previousSibling.subRows = [...(previousSibling.subRows ?? []), row]
  return nextRows
}

export function outdentHierarchicalRow<
  TValues extends TableTreeRowValues,
  TRow extends TableTreeRowLike<TValues, TRow>,
>(rows: TRow[], rowId: string, options?: TableTreeOperationOptions): TRow[] {
  const nextRows = cloneRows(rows, options)
  const path = findPath(nextRows, rowId)
  if (!path || path.length < 2) return rows

  const parentPath = path.slice(0, -1)
  const grandParentPath = path.slice(0, -2)
  const parentIndex = parentPath[parentPath.length - 1] ?? 0
  const row = removeAtPath(nextRows, path)
  if (!row) return rows

  insertAtPath(nextRows, grandParentPath, parentIndex + 1, row)
  return nextRows
}

type TableTreeCountAggregateOperator = 'count'
type TableTreeNumericAggregateOperator = 'sum' | 'min' | 'max' | 'mean'
type TableTreeAggregateOperator = TableTreeCountAggregateOperator | TableTreeNumericAggregateOperator
type TableTreeAggregateFunction<T> = {
  bivarianceHack(values: T[]): T
}['bivarianceHack']
type NumericKeys<TValues> = {
  [TKey in keyof TValues]-?: NonNullable<TValues[TKey]> extends number ? TKey : never
}[keyof TValues]
type NumberCompatibleKeys<TValues> = {
  [TKey in keyof TValues]-?: number extends TValues[TKey]
    ? TKey
    : NonNullable<TValues[TKey]> extends number
      ? TKey
      : never
}[keyof TValues]

export type TableTreeAggregateDefinition<
  TValues extends TableTreeRowValues,
  TKey extends keyof TValues = keyof TValues,
> = TKey extends keyof TValues
  ? {
      column: TKey
      fn:
        | TableTreeAggregateFunction<TValues[TKey]>
        | (TKey extends NumericKeys<TValues> ? TableTreeNumericAggregateOperator : never)
        | (TKey extends NumberCompatibleKeys<TValues> ? TableTreeCountAggregateOperator : never)
      recursive?: boolean
    }
  : never

function computeAggregateFn<T>(fn: TableTreeAggregateOperator | ((values: T[]) => T), values: T[]): T {
  if (typeof fn === 'function') return fn(values as never) as T
  if (fn === 'count') return values.length as T

  const nums = values.map(Number).filter(n => !Number.isNaN(n))
  if (nums.length === 0) return 0 as T

  switch (fn) {
    case 'sum':
      return nums.reduce((a, b) => a + b, 0) as T
    case 'min':
      return nums.reduce((a, b) => Math.min(a, b), Infinity) as T
    case 'max':
      return nums.reduce((a, b) => Math.max(a, b), -Infinity) as T
    case 'mean':
      return (nums.reduce((a, b) => a + b, 0) / nums.length) as T
  }
}

/**
 * Aggregates values up the tree hierarchy.
 *
 * By default, each parent aggregates from its immediate children's already-aggregated values.
 * Set `recursive` to `false` on a definition to aggregate from all leaf descendants instead.
 */
export function aggregateHierarchicalRows<TRow extends TableTreeRowLike<TableTreeRowValues, TRow>>(
  rows: TRow[],
  definitions: TableTreeAggregateDefinition<TableTreeRowValueOf<TRow>>[],
): TRow[] {
  type RowValues = TableTreeRowValueOf<TRow>

  return rows.map(row => {
    if (!row.subRows?.length) return row

    const aggregatedChildren = aggregateHierarchicalRows(row.subRows, definitions)
    const updatedValues = { ...(row.values as RowValues) }

    for (const def of definitions) {
      const column = def.column as keyof RowValues
      type ColumnValue = RowValues[typeof column]
      const aggregateFn = def.fn as TableTreeAggregateOperator | ((values: ColumnValue[]) => ColumnValue)
      const childValues = aggregatedChildren.map(child => (child.values as RowValues)[column]) as ColumnValue[]

      if (def.recursive !== false) {
        updatedValues[column] = computeAggregateFn(aggregateFn, childValues) as RowValues[typeof column]
      } else {
        const leafValues: ColumnValue[] = []
        const collectLeaves = (items: TRow[]) => {
          for (const item of items) {
            if (item.subRows?.length) collectLeaves(item.subRows)
            else leafValues.push((item.values as RowValues)[column] as ColumnValue)
          }
        }
        collectLeaves(aggregatedChildren)
        updatedValues[column] = computeAggregateFn(aggregateFn, leafValues) as RowValues[typeof column]
      }
    }

    return { ...row, values: updatedValues, subRows: aggregatedChildren } as TRow
  })
}
