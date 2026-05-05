'use client'

import type { ColumnFiltersState } from '@tanstack/react-table'
import type * as React from 'react'
import type { FilterField } from '@/elements/filter/filter.props'
import { TableFilter } from '@/elements/filter/TableFilter'
import type { TableSize, TableVariant } from '@/table/basic/Table'
import type { TableCellModeProps } from '@/table/shared/table-editable-cell.props'
import type { TableCellEditCommitHandler } from '@/table/shared/table-editing'
import { InfiniteTable } from './InfiniteTable'
import { useInfiniteTable } from './infinite-table.context'
import type { InfiniteTableColumnDef, InfiniteTableRowActions } from './infinite-table.props'

export type InfiniteTableWrapperProps<TData> = TableCellModeProps & {
  /** TanStack column definitions */
  columns: InfiniteTableColumnDef<TData, unknown>[]
  /** Row data array */
  data: TData[]
  /** Declarative filter field configuration */
  filterFields?: FilterField<TData>[]
  /** Pre-applied column filters */
  defaultColumnFilters?: ColumnFiltersState

  /** Show the toolbar (default: true) */
  toolbar?: boolean
  /** Custom actions rendered in the toolbar's right slot */
  toolbarActions?: React.ReactNode
  /** Show the filter sidebar (default: true when filterFields is provided) */
  filterPanel?: boolean
  /** Whether the filter panel starts open (default: true) */
  defaultFilterPanelOpen?: boolean
  /** Show the footer (default: false) */
  footer?: React.ReactNode

  /** Table size variant */
  size?: TableSize
  /** Table visual variant */
  variant?: TableVariant
  /** Estimated row height in px for the virtualizer */
  estimateRowHeight?: number

  /** Extract a unique key from each row */
  getRowId?: (row: TData) => string

  /** Infinite scroll callbacks */
  hasNextPage?: boolean
  fetchNextPage?: () => void
  isFetching?: boolean
  isLoading?: boolean
  totalRows?: number
  filterRows?: number

  /** Enable the detail drawer (opens on row click) */
  detailDrawer?: boolean
  /** Custom detail renderer for the drawer */
  renderDetail?: (row: TData, isLoading: boolean) => React.ReactNode
  /** Async data fetcher for the detail drawer */
  fetchDetail?: (row: TData) => Promise<Record<string, unknown>>
  /** Title for the detail drawer */
  detailTitle?: React.ReactNode | ((row: TData) => React.ReactNode)
  /** Per-row click guard — return false to disable row click for that row */
  isRowClickable?: (row: TData) => boolean

  /** Handler called when a cell edit is committed */
  onCellEdit?: TableCellEditCommitHandler<TData>

  /** Optional flat row actions rendered from each row's first cell */
  rowActions?: InfiniteTableRowActions<TData>

  /** Content for the summary chart slot (rendered above toolbar) */
  summaryChart?: React.ReactNode
}

function ConnectedFilter() {
  const { table, filterFields, columnFilters, size, color } = useInfiniteTable()
  const filterColor = color === 'neutral' ? 'primary' : color
  return (
    <TableFilter
      table={table}
      filterFields={filterFields}
      columnFilters={columnFilters}
      size={size}
      color={filterColor}
      className="h-full min-h-0 w-64 shrink-0 overflow-y-auto border-r border-[var(--color-neutral-border)] bg-background"
    />
  )
}

export function InfiniteTableWrapper<TData>({
  columns,
  data,
  filterFields,
  defaultColumnFilters,
  toolbar = true,
  toolbarActions,
  filterPanel,
  defaultFilterPanelOpen,
  footer,
  size = 'sm',
  variant = 'ghost',
  estimateRowHeight,
  getRowId,
  hasNextPage,
  fetchNextPage,
  isFetching,
  isLoading,
  totalRows,
  filterRows,
  detailDrawer = false,
  renderDetail,
  fetchDetail,
  detailTitle,
  isRowClickable,
  editable,
  defaultCellMode,
  cellMode,
  onCellModeChange,
  allowedCellModes,
  onCellEdit,
  rowActions,
  summaryChart,
}: InfiniteTableWrapperProps<TData>) {
  const showFilterPanel = filterPanel ?? (filterFields != null && filterFields.length > 0)
  const contentProps = {
    estimateRowHeight,
    hasNextPage,
    fetchNextPage,
  }

  return (
    <InfiniteTable.Root
      columns={columns}
      data={data}
      filterFields={filterFields}
      defaultColumnFilters={defaultColumnFilters}
      size={size}
      variant={variant}
      defaultFilterPanelOpen={defaultFilterPanelOpen}
      getRowId={getRowId}
      isRowClickable={isRowClickable}
      editable={editable}
      defaultCellMode={defaultCellMode}
      cellMode={cellMode}
      onCellModeChange={onCellModeChange}
      allowedCellModes={allowedCellModes}
      onCellEdit={onCellEdit}
      rowActions={rowActions}
      isFetching={isFetching}
      isLoading={isLoading}
      totalRows={totalRows}
      filterRows={filterRows}
    >
      {summaryChart != null ? <InfiniteTable.SummaryChart>{summaryChart}</InfiniteTable.SummaryChart> : null}
      {toolbar ? <InfiniteTable.Toolbar actions={toolbarActions} /> : null}
      {showFilterPanel ? (
        <InfiniteTable.Layout>
          <ConnectedFilter />
          <InfiniteTable.Content {...contentProps} />
        </InfiniteTable.Layout>
      ) : (
        <InfiniteTable.Content {...contentProps} />
      )}
      {footer != null ? <InfiniteTable.Footer>{footer}</InfiniteTable.Footer> : null}
      {detailDrawer ? (
        <InfiniteTable.DetailDrawer renderDetail={renderDetail} fetchDetail={fetchDetail} title={detailTitle} />
      ) : null}
    </InfiniteTable.Root>
  )
}

InfiniteTableWrapper.displayName = 'InfiniteTableWrapper'

export namespace InfiniteTableWrapperProps {
  export type Props<TData> = InfiniteTableWrapperProps<TData>
}
