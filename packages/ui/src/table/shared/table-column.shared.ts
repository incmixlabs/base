import * as React from 'react'
import type { TableCellRenderer, TableCellValue } from './table-cell.props'
import { getTableCellTextValue, resolveTableCellJustify } from './table-cell-renderers'
import type { TableEditableColumnMeta } from './table-editing'
import { comparePrioritySortableValues, getTableSortableValue } from './table-sorting'

export type SharedTableColumnJustify = 'start' | 'center' | 'end'

export type SharedTableColumnMeta<
  TRow = unknown,
  TValue = unknown,
  TJustify = SharedTableColumnJustify,
> = TableEditableColumnMeta<TRow, TValue> & {
  id?: string
  header?: React.ReactNode
  justify?: TJustify
  rowHeader?: boolean
  sortable?: boolean
  renderer?: TableCellRenderer
}

export function getSharedTableColumnJustify(column: Pick<SharedTableColumnMeta, 'justify' | 'rowHeader' | 'renderer'>) {
  return resolveTableCellJustify({
    justify: column.justify,
    rowHeader: column.rowHeader,
    renderer: column.renderer,
  })
}

export function getSharedTableCellDisplayText(
  value: unknown,
  renderer: TableCellRenderer | undefined,
): string | undefined {
  if (renderer?.type !== 'label') return undefined

  if (value && typeof value === 'object' && !React.isValidElement(value) && 'label' in value) {
    const label = value.label
    if (typeof label === 'string' || typeof label === 'number') return String(label)
  }

  const rawValue =
    value &&
    typeof value === 'object' &&
    !React.isValidElement(value) &&
    'value' in value &&
    typeof value.value === 'string'
      ? value.value
      : typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean'
        ? String(value)
        : undefined

  if (rawValue === undefined) return undefined

  const match = renderer.values?.find(item => item.value === rawValue)
  if (typeof match?.label === 'string' || typeof match?.label === 'number') {
    return String(match.label)
  }

  return undefined
}

export function compareSharedTableCellValues({
  leftValue,
  rightValue,
  column,
}: {
  leftValue: unknown
  rightValue: unknown
  column: Pick<SharedTableColumnMeta, 'renderer'>
}) {
  const leftFallbackText =
    getSharedTableCellDisplayText(leftValue, column.renderer) ?? getTableCellTextValue(leftValue as TableCellValue)
  const rightFallbackText =
    getSharedTableCellDisplayText(rightValue, column.renderer) ?? getTableCellTextValue(rightValue as TableCellValue)

  if (column.renderer?.type === 'priority') {
    return comparePrioritySortableValues(leftValue, rightValue, {
      leftFallbackText,
      rightFallbackText,
    })
  }

  const leftSortable = getTableSortableValue(leftValue, leftFallbackText)
  const rightSortable = getTableSortableValue(rightValue, rightFallbackText)

  if (typeof leftSortable === 'number' && typeof rightSortable === 'number') {
    if (leftSortable < rightSortable) return -1
    if (leftSortable > rightSortable) return 1
    return 0
  }

  const leftComparable = String(leftSortable)
  const rightComparable = String(rightSortable)
  if (leftComparable < rightComparable) return -1
  if (leftComparable > rightComparable) return 1
  return 0
}
