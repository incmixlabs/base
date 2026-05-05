'use client'

import type { ExpandedState } from '@tanstack/react-table'
import * as React from 'react'
import { TableWrapper } from './basic/TableWrapper'
import type { TableSize, TableVariant } from './basic/table.props'
import type { TableWrapperColumn, TableWrapperData, TableWrapperRow } from './basic/table-wrapper.props'
import { InfiniteTableWrapper } from './infinite/InfiniteTableWrapper'
import type { InfiniteTableColumnDef } from './infinite/infinite-table.props'
import type { TableCellValue } from './shared/table-cell.props'
import type { TableColumnDef, TanStackTableColumnDef } from './shared/table-column-def'
import { getTableColumnRuntimeMeta, toFlatTableColumnDefs } from './shared/table-column-def'
import { resolveTableEngine, type TableEngine } from './shared/table-engine'
import {
  flattenTableRows,
  groupTableRows,
  hasNestedTableRows,
  type TableGroupRowMetadata,
  type TableShape,
} from './shared/table-grouping'
import { TreeTable } from './tree-table/TreeTable'
import type { TreeTableColumnDef } from './tree-table/tree-table.props'

export type TableViewRuntimeRow<TRow> = {
  id: string
  source?: TRow
  values: Record<string, TableCellValue>
  grouping?: TableGroupRowMetadata
  subRows?: TableViewRuntimeRow<TRow>[]
}

export type TableViewProps<TRow> = {
  columns: readonly TableColumnDef<TRow>[]
  data: readonly TRow[]
  getRowId?: (row: TRow, index: number) => string
  getSubRows?: (row: TRow) => readonly TRow[] | undefined
  engine?: TableEngine
  defaultEngine?: TableEngine
  shape?: TableShape
  defaultShape?: TableShape
  groupBy?: readonly string[]
  defaultGroupBy?: readonly string[]
  expandAll?: boolean
  defaultExpanded?: ExpandedState
  toolbar?: boolean
  toolbarActions?: React.ReactNode
  meta?: React.ReactNode
  caption?: React.ReactNode
  size?: TableSize
  variant?: TableVariant
  compact?: boolean
  gridLines?: boolean
  totalRows?: number
  filteredRows?: number
  activeFilterCount?: number
  onReset?: () => void
  estimateRowHeight?: number
  minBodyHeight?: number
  maxBodyHeight?: number
  className?: string
}

function getDefaultRowId<TRow>(row: TRow, index: number) {
  if (row && typeof row === 'object' && 'id' in row) {
    const id = row.id
    if (typeof id === 'string' || typeof id === 'number') return String(id)
  }

  return `row-${index}`
}

function getColumnValue<TRow>(column: TableColumnDef<TRow>, row: TRow) {
  if (column.accessor) return column.accessor(row)
  const key = column.accessorKey as keyof TRow | undefined
  return key ? row[key] : undefined
}

function getWrapperColumnSize(value: string | number | undefined) {
  if (typeof value === 'number') return `${value}px`
  return value
}

function createRuntimeRows<TRow>({
  columns,
  rows,
  getRowId,
  getSubRows,
  scopeRowIds = false,
  parentPath = '',
}: {
  columns: readonly TableColumnDef<TRow>[]
  rows: readonly TRow[]
  getRowId: (row: TRow, index: number) => string
  getSubRows?: (row: TRow) => readonly TRow[] | undefined
  scopeRowIds?: boolean
  parentPath?: string
}): TableViewRuntimeRow<TRow>[] {
  return rows.map((row, index) => {
    const subRows = getSubRows?.(row)
    const localId = getRowId(row, index)
    const id = scopeRowIds && parentPath ? `${parentPath}.${localId}` : localId

    return {
      id,
      source: row,
      values: Object.fromEntries(
        columns.map(column => [column.id, getColumnValue(column, row) as TableCellValue]),
      ) as Record<string, TableCellValue>,
      subRows: subRows?.length
        ? createRuntimeRows({
            columns,
            rows: subRows,
            getRowId,
            getSubRows,
            scopeRowIds,
            parentPath: id,
          })
        : undefined,
    }
  })
}

function createGroupedRuntimeRows<TRow>({
  rows,
  groupBy,
  rowHeaderColumnId,
}: {
  rows: readonly TableViewRuntimeRow<TRow>[]
  groupBy: readonly string[]
  rowHeaderColumnId?: string
}) {
  if (groupBy.length === 0) return [...rows]

  return groupTableRows<TableViewRuntimeRow<TRow>>({
    rows,
    groupBy,
    getValue: (row, columnId) => row.values[columnId],
    createGroupRow: ({ id, columnId, value, label, depth, path, rows: subRows }) => {
      const values: Record<string, TableCellValue> = {}
      if (rowHeaderColumnId) values[rowHeaderColumnId] = label
      values[columnId] = label

      return {
        id,
        values,
        grouping: {
          kind: 'group',
          columnId,
          value,
          label,
          depth,
          path,
        },
        subRows: [...subRows],
      }
    },
  })
}

function createWrapperColumns<TRow>(columns: readonly TableColumnDef<TRow>[]): TableWrapperColumn[] {
  return toFlatTableColumnDefs(columns).map(column => ({
    id: column.id,
    header: column.header ?? column.id,
    rowHeader: column.rowHeader,
    align: column.align,
    justify: column.justify,
    width: getWrapperColumnSize(column.width),
    minWidth: getWrapperColumnSize(column.minWidth),
    maxWidth: getWrapperColumnSize(column.maxWidth),
    renderer: column.renderer,
    sortable: column.sortable,
  }))
}

function createRuntimeTanStackColumns<TRow>(
  columns: readonly TableColumnDef<TRow>[],
): TanStackTableColumnDef<TableViewRuntimeRow<TRow>>[] {
  return columns.map(column => ({
    id: column.id,
    header: typeof column.header === 'string' ? column.header : () => column.header,
    accessorFn: row => row.values[column.id],
    enableSorting: column.sortable,
    enableResizing: column.resizable,
    size: typeof column.width === 'number' ? column.width : undefined,
    minSize: typeof column.minWidth === 'number' ? column.minWidth : undefined,
    maxSize: typeof column.maxWidth === 'number' ? column.maxWidth : undefined,
    meta: getTableColumnRuntimeMeta(column) as TanStackTableColumnDef<TableViewRuntimeRow<TRow>>['meta'],
  }))
}

function createWrapperData<TRow>({
  caption,
  columns,
  rows,
}: {
  caption?: React.ReactNode
  columns: readonly TableColumnDef<TRow>[]
  rows: readonly TableViewRuntimeRow<TRow>[]
}): TableWrapperData {
  return {
    caption,
    columns: createWrapperColumns(columns),
    rows: rows as TableWrapperRow[],
  }
}

export function TableView<TRow>({
  columns,
  data,
  getRowId: getRowIdProp,
  getSubRows,
  engine,
  defaultEngine,
  shape,
  defaultShape,
  groupBy,
  defaultGroupBy = [],
  expandAll,
  defaultExpanded = true,
  toolbar = true,
  toolbarActions,
  meta,
  caption,
  size = 'sm',
  variant = 'ghost',
  compact,
  gridLines,
  totalRows,
  filteredRows,
  activeFilterCount,
  onReset,
  estimateRowHeight,
  minBodyHeight,
  maxBodyHeight,
  className,
}: TableViewProps<TRow>) {
  const getRowId: (row: TRow, index: number) => string = getRowIdProp ?? getDefaultRowId
  const scopeFallbackRowIds = getRowIdProp == null
  const [uncontrolledGroupBy] = React.useState(() => [...defaultGroupBy])
  const [uncontrolledShape] = React.useState<TableShape | undefined>(defaultShape)
  const resolvedGroupBy = groupBy ?? uncontrolledGroupBy
  const rowHeaderColumnId = React.useMemo(
    () => columns.find(column => column.rowHeader)?.id ?? columns[0]?.id,
    [columns],
  )
  const runtimeRows = React.useMemo(
    () =>
      createRuntimeRows({
        columns,
        rows: data,
        getRowId,
        getSubRows,
        scopeRowIds: scopeFallbackRowIds,
      }),
    [columns, data, getRowId, getSubRows, scopeFallbackRowIds],
  )
  const groupedRows = React.useMemo(
    () =>
      createGroupedRuntimeRows({
        rows: runtimeRows,
        groupBy: resolvedGroupBy,
        rowHeaderColumnId,
      }),
    [resolvedGroupBy, rowHeaderColumnId, runtimeRows],
  )
  const hasGroupedRows = resolvedGroupBy.length > 0
  const hasNestedRows = React.useMemo(() => hasNestedTableRows(groupedRows, row => row.subRows), [groupedRows])
  const resolvedShape: TableShape = shape ?? uncontrolledShape ?? (hasNestedRows ? 'tree' : 'flat')
  const tableRows = React.useMemo(() => {
    if (resolvedShape === 'tree') return groupedRows

    return flattenTableRows({
      rows: groupedRows,
      getSubRows: row => row.subRows,
      clearSubRows: row => (row.subRows ? { ...row, subRows: undefined } : row),
    })
  }, [groupedRows, resolvedShape])
  const resolvedEngine = resolveTableEngine({ engine, defaultEngine })

  if (resolvedEngine === 'virtual' && resolvedShape === 'tree') {
    const treeColumns = createRuntimeTanStackColumns(columns) as TreeTableColumnDef<TableViewRuntimeRow<TRow>>[]
    return (
      <div className={className}>
        <TreeTable.Root
          columns={treeColumns}
          data={tableRows}
          getRowId={row => row.id}
          getSubRows={row => row.subRows}
          defaultExpanded={defaultExpanded}
          size={size}
          variant={variant}
        >
          {toolbar ? <TreeTable.Toolbar count={totalRows ?? data.length} meta={meta} actions={toolbarActions} /> : null}
          <TreeTable.Content
            estimateRowHeight={estimateRowHeight}
            minBodyHeight={minBodyHeight}
            maxBodyHeight={maxBodyHeight}
          />
        </TreeTable.Root>
      </div>
    )
  }

  if (resolvedEngine === 'virtual') {
    const virtualColumns = createRuntimeTanStackColumns(columns) as InfiniteTableColumnDef<TableViewRuntimeRow<TRow>>[]
    return (
      <div className={className}>
        <InfiniteTableWrapper
          columns={virtualColumns}
          data={tableRows}
          toolbar={toolbar}
          toolbarActions={toolbarActions}
          size={size}
          variant={variant}
          estimateRowHeight={estimateRowHeight}
          getRowId={row => row.id}
          totalRows={totalRows ?? data.length}
          filterRows={filteredRows}
        />
      </div>
    )
  }

  return (
    <div className={className}>
      <TableWrapper
        data={createWrapperData({ caption, columns, rows: tableRows })}
        shape={resolvedShape}
        expandAll={expandAll ?? hasGroupedRows}
        meta={meta}
        toolbarActions={toolbarActions}
        totalRows={totalRows}
        filteredRows={filteredRows}
        activeFilterCount={activeFilterCount}
        onReset={onReset}
        size={size}
        variant={variant}
        compact={compact}
        gridLines={gridLines}
      />
    </div>
  )
}

TableView.displayName = 'TableView'

export namespace TableView {
  export type Props<TRow> = TableViewProps<TRow>
  export type RuntimeRow<TRow> = TableViewRuntimeRow<TRow>
}
