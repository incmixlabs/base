import type {
  ColumnDef,
  ColumnFiltersState,
  ColumnOrderState,
  RowSelectionState,
  SortingState,
  VisibilityState,
} from '@tanstack/react-table'
import type * as React from 'react'
import type { FilterField } from '@/elements/filter/filter.props'
import type { TableSize, TableVariant } from '@/table/basic/Table'
import type { SharedTableColumnMeta } from '@/table/shared'
import type { StackedSummaryBarSegment } from '@/table/shared/StackedSummaryBar'
import type { TableHeaderAppliedFilter } from '@/table/shared/TableHeader'
import type { TableCellModeProps } from '@/table/shared/table-editable-cell.props'
import type { TableCellEditCommitHandler } from '@/table/shared/table-editing'
import type { Color } from '@/theme/tokens'

export type InfiniteTableColumnMeta<TData = unknown, TValue = unknown> = SharedTableColumnMeta<TData, TValue> & {
  align?: 'left' | 'center' | 'right'
  verticalAlign?: 'start' | 'center' | 'end'
  fullCell?: boolean
  hoverCard?: (value: unknown, row: TData) => React.ReactNode
  detail?: (value: unknown, row: TData) => React.ReactNode
}

export type InfiniteTableColumnDef<TData, TValue = unknown> = ColumnDef<TData, TValue> & {
  meta?: InfiniteTableColumnMeta<TData, TValue>
}

export type InfiniteTableRowAction = 'duplicate' | 'remove'

export type InfiniteTableRowActionLabels = Partial<Record<InfiniteTableRowAction, string>>

export type InfiniteTableRowActions<TData> = {
  onDuplicate?: (row: TData) => void | Promise<void>
  onRemove?: (row: TData) => void
  canDuplicate?: (row: TData) => boolean
  canRemove?: (row: TData) => boolean
  labels?: InfiniteTableRowActionLabels
}

/** @deprecated Use `FilterField` from `@/elements/filter/filter.props` */
export type InfiniteTableFilterField<TData> = FilterField<TData>

/** @deprecated Use `FilterOption` from `@/elements/filter/filter.props` */
/** @deprecated Use `FilterFieldType` from `@/elements/filter/filter.props` */
export type {
  FilterFieldType as InfiniteTableFilterFieldType,
  FilterOption as InfiniteTableFilterOption,
} from '@/elements/filter/filter.props'

/** Props for the InfiniteTable.Root component */
export type InfiniteTableRootProps<TData, TValue = unknown> = TableCellModeProps & {
  columns: InfiniteTableColumnDef<TData, TValue>[]
  data: TData[]
  filterFields?: FilterField<TData>[]

  /** Initial state */
  defaultColumnFilters?: ColumnFiltersState
  defaultSorting?: SortingState
  defaultColumnVisibility?: VisibilityState
  defaultColumnOrder?: ColumnOrderState
  defaultRowSelection?: RowSelectionState

  /** Whether the filter panel starts open (default: true) */
  defaultFilterPanelOpen?: boolean

  /** Infinite scroll control */
  totalRows?: number
  filterRows?: number
  activeFilterCount?: number
  isFetching?: boolean
  isLoading?: boolean

  /** Appearance */
  size?: TableSize
  variant?: TableVariant
  color?: Color

  /** Row identity */
  getRowId?: (row: TData) => string

  /**
   * Per-row click guard. Return false to disable click + cursor-pointer for that row.
   * Only called when row clicking is enabled (e.g. DetailDrawer is mounted).
   * @default () => true
   */
  isRowClickable?: (row: TData) => boolean

  onCellEdit?: TableCellEditCommitHandler<TData>

  rowActions?: InfiniteTableRowActions<TData>

  children?: React.ReactNode
}

/** Props for the toolbar component */
export type InfiniteTableToolbarProps = {
  appliedFilters?: readonly TableHeaderAppliedFilter[]
  meta?: React.ReactNode
  actions?: React.ReactNode
}

/** Props for the main table content area */
export type InfiniteTableContentProps = {
  className?: string
  estimateRowHeight?: number
  hasNextPage?: boolean
  fetchNextPage?: () => void
}

/** Props for the footer slot */
export type InfiniteTableFooterProps = {
  children?: React.ReactNode
}

export type InfiniteTableSummaryChartColumn = {
  columnId: string
  segments: readonly StackedSummaryBarSegment[]
}

export type InfiniteTableSummaryChartProps = {
  children?: React.ReactNode
  className?: string
  columns?: readonly InfiniteTableSummaryChartColumn[]
}
