'use client'

import type { ColumnFiltersState, Table as TanStackTable } from '@tanstack/react-table'
import * as React from 'react'
import type { FilterField } from '@/elements/filter/filter.props'
import type { TableSize, TableVariant } from '@/table/basic/Table'
import type { TableCellMode } from '@/table/shared/table-editable-cell.props'
import type { TableCellEditCommitHandler } from '@/table/shared/table-editing'
import type { Color } from '@/theme/tokens'
import type { InfiniteTableRowActions, InfiniteTableSummaryChartProps } from './infinite-table.props'

export interface InfiniteTableContextValue<TData = unknown> {
  table: TanStackTable<TData>
  columnFilters: ColumnFiltersState
  filterFields: FilterField<TData>[]
  size: TableSize
  variant: TableVariant
  color: Color
  totalRows?: number
  filterRows?: number
  activeFilterCount?: number
  isFetching?: boolean
  isLoading?: boolean
  /** Index of the selected row (for detail drawer), or null */
  selectedRowIndex: number | null
  /** Select a row by index, or null to deselect */
  selectRow: (index: number | null) => void
  /** Whether row click is enabled (set automatically when DetailDrawer or onRowClick is used) */
  enableRowClick: boolean
  setEnableRowClick: (enabled: boolean) => void
  /** Per-row click guard */
  isRowClickable: (row: unknown) => boolean
  footerContent?: React.ReactNode
  setFooterContent: (content: React.ReactNode | undefined) => void
  summaryChart?: InfiniteTableSummaryChartProps
  setSummaryChart: (summary: InfiniteTableSummaryChartProps | undefined) => void
  cellMode: TableCellMode
  cellModeToggle?: React.ReactNode
  onCellEdit?: TableCellEditCommitHandler<TData>
  rowActions?: InfiniteTableRowActions<TData>
}

export interface ControlsContextValue {
  open: boolean
  setOpen: (open: boolean) => void
  toggle: () => void
  hasFilterPanel: boolean
  registerFilterPanel: () => () => void
}

const InfiniteTableContext = React.createContext<InfiniteTableContextValue | null>(null)
const ControlsContext = React.createContext<ControlsContextValue | null>(null)

export function InfiniteTableProvider<TData>({
  value,
  children,
}: {
  value: InfiniteTableContextValue<TData>
  children: React.ReactNode
}) {
  return (
    <InfiniteTableContext.Provider value={value as InfiniteTableContextValue}>{children}</InfiniteTableContext.Provider>
  )
}

export function ControlsProvider({
  children,
  defaultOpen = true,
}: {
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [open, setOpen] = React.useState(defaultOpen)
  const [hasFilterPanel, setHasFilterPanel] = React.useState(false)
  const toggle = React.useCallback(() => setOpen(prev => !prev), [])
  const registerFilterPanel = React.useCallback(() => {
    setHasFilterPanel(true)
    return () => setHasFilterPanel(false)
  }, [])

  const value = React.useMemo(
    () => ({ open, setOpen, toggle, hasFilterPanel, registerFilterPanel }),
    [open, toggle, hasFilterPanel, registerFilterPanel],
  )

  return <ControlsContext.Provider value={value}>{children}</ControlsContext.Provider>
}

export function useInfiniteTable<TData = unknown>() {
  const context = React.useContext(InfiniteTableContext)
  if (!context) throw new Error('useInfiniteTable must be used within InfiniteTable.Root')
  return context as InfiniteTableContextValue<TData>
}

export function useControls() {
  const context = React.useContext(ControlsContext)
  if (!context) throw new Error('useControls must be used within InfiniteTable.Root')
  return context
}
