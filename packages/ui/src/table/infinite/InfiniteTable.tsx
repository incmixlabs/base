'use client'

import {
  type ColumnFiltersState,
  type ColumnOrderState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
  type Row,
  type RowSelectionState,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import * as React from 'react'
import { HoverCard } from '@/elements/hover-card/HoverCard'
import { Flex } from '@/layouts/flex/Flex'
import { Grid } from '@/layouts/grid/Grid'
import { cn } from '@/lib/utils'
import type { TableSize } from '@/table/basic/Table'
import {
  compareSharedTableCellValues,
  deriveEditorFromRenderer,
  getSharedTableColumnJustify,
  isFullCellRenderer,
  isTableCellEditable,
  matchesDateFilter,
  READ_TABLE_CELL_MODE,
  renderTableCellValue,
  resolveTableCellEditorConfig,
  StackedSummaryBar,
  shouldActivateTableCellEditorOnFocus,
  TableCellModeToggle,
  TableCellModeToolbarActions,
  TableColumnHeaderContent,
  TableColumnResizeHandle,
  TableEditableCellContent,
  type TableEditableCellNavigation,
  type TableEditableCellNavigationOptions,
  TableHeader,
  type TableRowActionConfig,
  TableRowActions,
  useTableCellMode,
} from '@/table/shared'
import { objectToDetailEntries, TableDetailDrawer } from '@/table/shared/TableDetailDrawer'
import { editableCellWrapper } from '@/table/shared/table-editable-cell.css'
import { getTableRowIdFromKeyboardEvent, getTableRowKeyboardAction } from '@/table/shared/table-row-keyboard-actions'
import {
  tableBodyViewportClass,
  tableCellStructureClass,
  tableFixedLayoutClass,
  tableFooterCellStructureClass,
  tableFooterViewportClass,
  tableHeaderCellStructureClass,
  tableHeaderRowClass,
  tableHeaderViewportClass,
  tableVirtualBodyClass,
} from '@/table/shared/table-structure'
import { tableSizeTokens } from '@/table/table.tokens'
import {
  cellClass,
  emptyStateClass,
  loadingRowClass,
  resizeHandleActiveClass,
  resizeHandleClass,
  rowClass,
  tfootCellClass,
  tfootRowClass,
  theadCellClass,
  theadClass,
} from './infinit-table.css'
import { ControlsProvider, InfiniteTableProvider, useInfiniteTable } from './infinite-table.context'
import type {
  InfiniteTableColumnMeta,
  InfiniteTableFooterProps,
  InfiniteTableRootProps,
  InfiniteTableRowAction,
  InfiniteTableSummaryChartProps,
  InfiniteTableToolbarProps,
} from './infinite-table.props'

// ─── Helpers ────────────────────────────────────────────────────────────────

function getColumnMeta<TData>(meta: unknown): InfiniteTableColumnMeta<TData> {
  return meta && typeof meta === 'object' && !Array.isArray(meta) ? (meta as InfiniteTableColumnMeta<TData>) : {}
}

function mapJustifyToAlign(justify: 'start' | 'center' | 'end' | undefined): 'left' | 'center' | 'right' | undefined {
  if (justify === 'start') return 'left'
  if (justify === 'end') return 'right'
  return justify
}

function getCellSizeStyle(size: TableSize): React.CSSProperties {
  const t = tableSizeTokens[size]
  return {
    paddingInline: t.paddingX,
    paddingBlock: t.paddingY,
    fontSize: t.fontSize,
    lineHeight: t.lineHeight,
  }
}

function getEstimatedRowHeight(size: TableSize): number {
  return tableSizeTokens[size].estimatedRowHeight
}

// ─── Root ───────────────────────────────────────────────────────────────────

/** Custom filter function for checkbox-style filters: checks array membership */
function arrIncludesSome(row: { getValue: (columnId: string) => unknown }, columnId: string, filterValue: string[]) {
  if (!filterValue || filterValue.length === 0) return true
  const value = String(row.getValue(columnId))
  return filterValue.includes(value)
}

function InfiniteTableRoot<TData, TValue = unknown>({
  columns,
  data,
  filterFields = [],
  defaultColumnFilters = [],
  defaultSorting = [],
  defaultColumnVisibility = {},
  defaultColumnOrder = [],
  defaultRowSelection = {},
  defaultFilterPanelOpen,
  totalRows,
  filterRows,
  activeFilterCount,
  isFetching,
  isLoading,
  size = 'sm',
  variant = 'ghost',
  color = 'neutral',
  getRowId,
  isRowClickable: isRowClickableProp,
  editable = true,
  defaultCellMode = READ_TABLE_CELL_MODE,
  cellMode,
  onCellModeChange,
  allowedCellModes,
  onCellEdit: onCellEditProp,
  rowActions,
  children,
}: InfiniteTableRootProps<TData, TValue>) {
  'use no memo'
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(defaultColumnFilters)
  const [sorting, setSorting] = React.useState<SortingState>(defaultSorting)
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>(defaultColumnVisibility)
  const [columnOrder, setColumnOrder] = React.useState<ColumnOrderState>(defaultColumnOrder)
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>(defaultRowSelection)
  const [selectedRowIndex, setSelectedRowIndex] = React.useState<number | null>(null)
  const selectRow = React.useCallback((index: number | null) => setSelectedRowIndex(index), [])
  const [enableRowClick, setEnableRowClick] = React.useState(false)
  const [footerContent, setFooterContent] = React.useState<React.ReactNode | undefined>(undefined)
  const [summaryChart, setSummaryChart] = React.useState<InfiniteTableSummaryChartProps | undefined>(undefined)
  const isTableEditable = editable !== false && Boolean(onCellEditProp)
  const tableCellMode = useTableCellMode({
    editable: isTableEditable,
    defaultCellMode,
    cellMode,
    onCellModeChange,
    allowedCellModes,
  })
  const cellModeToggle = tableCellMode.showCellModeToggle ? (
    <TableCellModeToggle
      cellMode={tableCellMode.cellMode}
      allowedCellModes={tableCellMode.allowedCellModes}
      onCellModeChange={tableCellMode.setCellMode}
    />
  ) : null

  // Reset selected row when filters or sorting change to avoid stale index
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally reset on filter/sort changes
  React.useEffect(() => {
    setSelectedRowIndex(null)
  }, [columnFilters, sorting])

  // Keep isRowClickable in a ref so it doesn't cause context re-renders on every parent render
  const isRowClickableRef = React.useRef(isRowClickableProp)
  isRowClickableRef.current = isRowClickableProp
  const isRowClickable = React.useCallback((row: unknown) => isRowClickableRef.current?.(row as TData) ?? true, [])

  // Auto-assign checkbox filterFn to columns that have checkbox filter fields
  const processedColumns = React.useMemo(() => {
    const multiSelectFieldIds = new Set<string>(
      filterFields.filter(f => f.type === 'checkbox' || f.type === 'avatar-list').map(f => f.id),
    )
    const calendarFieldIds = new Set<string>(filterFields.filter(f => f.type === 'calendar').map(f => f.id))
    return columns.map(col => {
      const id = ('accessorKey' in col ? (col.accessorKey as string) : col.id) ?? ''
      if (id && multiSelectFieldIds.has(id) && !col.filterFn) {
        return { ...col, filterFn: arrIncludesSome }
      }
      if (id && calendarFieldIds.has(id) && !col.filterFn) {
        return { ...col, filterFn: matchesDateFilter }
      }
      const columnMeta = getColumnMeta<TData>(col.meta)
      if (columnMeta.renderer && !col.sortingFn) {
        return {
          ...col,
          sortingFn: (left: Row<TData>, right: Row<TData>, columnId: string) => {
            return compareSharedTableCellValues({
              leftValue: left.getValue(columnId),
              rightValue: right.getValue(columnId),
              column: columnMeta,
            })
          },
        }
      }
      return col
    })
  }, [columns, filterFields])

  const table = useReactTable({
    data,
    columns: processedColumns,
    state: {
      columnFilters,
      sorting,
      columnVisibility,
      columnOrder,
      rowSelection,
    },
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnOrderChange: setColumnOrder,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    columnResizeMode: 'onChange',
    getRowId: getRowId as ((row: TData) => string) | undefined,
  })

  const contextValue = {
    table,
    columnFilters,
    filterFields,
    size,
    variant,
    color,
    totalRows,
    filterRows,
    activeFilterCount,
    isFetching,
    isLoading,
    selectedRowIndex,
    selectRow,
    enableRowClick,
    setEnableRowClick,
    isRowClickable,
    footerContent,
    setFooterContent,
    summaryChart,
    setSummaryChart,
    cellMode: tableCellMode.cellMode,
    cellModeToggle,
    onCellEdit: isTableEditable ? onCellEditProp : undefined,
    rowActions,
  }

  return (
    <InfiniteTableProvider value={contextValue}>
      <ControlsProvider defaultOpen={defaultFilterPanelOpen}>
        <Flex
          direction="column"
          className="h-full w-full min-h-0 overflow-hidden"
          style={{
            fontSize: tableSizeTokens[size].fontSize,
            lineHeight: tableSizeTokens[size].lineHeight,
          }}
        >
          {children}
        </Flex>
      </ControlsProvider>
    </InfiniteTableProvider>
  )
}

InfiniteTableRoot.displayName = 'InfiniteTable.Root'

// ─── Layout ──────────────────────────────────────────────────────────────────

function InfiniteTableLayout({ children }: { children: React.ReactNode }) {
  return <Flex className="min-h-0 flex-1 overflow-hidden">{children}</Flex>
}

InfiniteTableLayout.displayName = 'InfiniteTable.Layout'

// ─── Toolbar ────────────────────────────────────────────────────────────────

function InfiniteTableToolbar({ appliedFilters, meta, actions }: InfiniteTableToolbarProps) {
  const { table, columnFilters, totalRows, filterRows, activeFilterCount, cellModeToggle } = useInfiniteTable()

  const filteredCount = filterRows ?? table.getFilteredRowModel().rows.length
  const totalCount = totalRows ?? table.getCoreRowModel().rows.length
  const hasColumnFilters = columnFilters.length > 0

  return (
    <TableHeader
      appliedFilters={appliedFilters}
      meta={meta}
      actions={<TableCellModeToolbarActions toggle={cellModeToggle}>{actions}</TableCellModeToolbarActions>}
      totalRows={totalCount}
      filteredRows={filteredCount}
      activeFilterCount={activeFilterCount ?? columnFilters.length}
      onReset={hasColumnFilters ? () => table.resetColumnFilters() : undefined}
    />
  )
}

InfiniteTableToolbar.displayName = 'InfiniteTable.Toolbar'

// ─── Editable cell navigation ──────────────────────────────────────────────

type EditableCellTarget = {
  id: string
  rowId: string
  rowIndex: number
  columnIndex: number
  activateOnFocus: boolean
}

type CellNavigationTarget = Omit<EditableCellTarget, 'activateOnFocus'>

type PendingRowFocus = {
  beforeRowIds: Set<string>
  requestId: number
  sourceRowId: string
}

function clearPendingRowFocusOnActionSettled(
  requestId: number | undefined,
  result: void | Promise<void> | undefined,
  clearRequest: (requestId: number) => void,
) {
  if (requestId == null) return
  if (result) {
    void Promise.resolve(result)
      .finally(() => clearRequest(requestId))
      .catch(() => undefined)
    return
  }
  clearRequest(requestId)
}

// ─── Content (virtualized table) ────────────────────────────────────────────

function InfiniteTableContent({
  className,
  estimateRowHeight,
  hasNextPage,
  fetchNextPage,
}: {
  className?: string
  estimateRowHeight?: number
  hasNextPage?: boolean
  fetchNextPage?: () => void
}) {
  const {
    table,
    size,
    isLoading,
    isFetching,
    selectRow,
    selectedRowIndex,
    enableRowClick,
    isRowClickable,
    footerContent,
    summaryChart,
    cellMode,
    onCellEdit,
    rowActions,
  } = useInfiniteTable()
  const containerRef = React.useRef<HTMLDivElement>(null)
  const pendingRowFocusRef = React.useRef<PendingRowFocus | null>(null)
  const rowFocusRequestIdRef = React.useRef(0)

  const { rows } = table.getRowModel()
  const rowHeight = estimateRowHeight ?? getEstimatedRowHeight(size)
  const [scrollLeft, setScrollLeft] = React.useState(0)

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => containerRef.current,
    estimateSize: () => rowHeight,
    overscan: 10,
  })

  // CSS variable column sizing
  const flatHeaders = table.getFlatHeaders()
  const columnSizeVars: Record<string, string> = {}
  for (const header of flatHeaders) {
    columnSizeVars[`--col-${header.column.id}-size`] = `${header.getSize()}px`
  }

  const cellStyle = getCellSizeStyle(size)
  const summaryColumns = React.useMemo(
    () => new Map((summaryChart?.columns ?? []).map(column => [column.columnId, column])),
    [summaryChart?.columns],
  )
  const visibleColumns = table.getVisibleLeafColumns()
  const tableWidth = `${visibleColumns.reduce((sum, column) => sum + column.getSize(), 0)}px`
  const hasFooterRegion = Boolean(summaryChart?.columns?.length || footerContent)
  const hasRowActions = Boolean(rowActions?.onDuplicate || rowActions?.onRemove)

  // ── Editable cell navigation ────────────────────────────────────────────
  const tableInstanceId = React.useId()

  const getEditableCellReadViewId = React.useCallback(
    (rowId: string, columnId: string) => `${tableInstanceId}-editable-${rowId}-${columnId}`,
    [tableInstanceId],
  )

  const editableCellTargets = React.useMemo<EditableCellTarget[]>(() => {
    if (!onCellEdit) return []
    const targets: EditableCellTarget[] = []
    for (const [rowIndex, row] of rows.entries()) {
      for (const [columnIndex, cell] of row.getVisibleCells().entries()) {
        const columnMeta = getColumnMeta(cell.column.columnDef.meta)
        const context = {
          row: row.original,
          rowId: row.id,
          columnId: cell.column.id,
          value: cell.getValue(),
        }
        const editor =
          resolveTableCellEditorConfig(columnMeta.editor, context) ?? deriveEditorFromRenderer(columnMeta.renderer)
        if (!isTableCellEditable({ editable: columnMeta.editable, editor, context })) continue
        targets.push({
          id: getEditableCellReadViewId(row.id, cell.column.id),
          rowId: row.id,
          rowIndex,
          columnIndex,
          activateOnFocus: shouldActivateTableCellEditorOnFocus(editor),
        })
      }
    }
    return targets
  }, [onCellEdit, rows, getEditableCellReadViewId])

  const cellNavigationTargets = React.useMemo<CellNavigationTarget[]>(() => {
    const targets: CellNavigationTarget[] = []
    for (const [rowIndex, row] of rows.entries()) {
      for (const [columnIndex, cell] of row.getVisibleCells().entries()) {
        targets.push({
          id: getEditableCellReadViewId(row.id, cell.column.id),
          rowId: row.id,
          rowIndex,
          columnIndex,
        })
      }
    }
    return targets
  }, [rows, getEditableCellReadViewId])

  const editableCellTargetsRef = React.useRef(editableCellTargets)
  const cellNavigationTargetsRef = React.useRef<CellNavigationTarget[]>(cellNavigationTargets)
  React.useLayoutEffect(() => {
    editableCellTargetsRef.current = editableCellTargets
  }, [editableCellTargets])

  React.useLayoutEffect(() => {
    cellNavigationTargetsRef.current = cellNavigationTargets
  }, [cellNavigationTargets])

  const focusEditableCell = React.useCallback(
    (id: string, targetRowIndex?: number, options?: TableEditableCellNavigationOptions) => {
      if (targetRowIndex != null) {
        virtualizer.scrollToIndex(targetRowIndex, { align: 'auto' })
      }
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          const target = document.getElementById(id)
          target?.focus()
          if (options?.activate) target?.click()
        })
      })
    },
    [virtualizer],
  )

  const navigateEditableCell = React.useCallback(
    (
      currentId: string,
      direction: TableEditableCellNavigation,
      options?: TableEditableCellNavigationOptions,
    ): boolean => {
      const targets = editableCellTargetsRef.current
      const currentIndex = targets.findIndex(t => t.id === currentId)
      if (currentIndex < 0) return false

      if (direction === 'next' || direction === 'previous') {
        const offset = direction === 'next' ? 1 : -1
        const nextTarget = targets[currentIndex + offset]
        if (!nextTarget) return false
        if (!options?.probe) {
          focusEditableCell(nextTarget.id, nextTarget.rowIndex, {
            ...options,
            activate: options?.activate === true && nextTarget.activateOnFocus,
          })
        }
        return true
      }

      const currentTarget = targets[currentIndex]
      if (!currentTarget) return false
      const candidates = targets.filter(t => t.columnIndex === currentTarget.columnIndex)
      const currentColumnIndex = candidates.findIndex(t => t.id === currentId)
      const offset = direction === 'down' ? 1 : -1
      const nextTarget = candidates[currentColumnIndex + offset]
      if (!nextTarget) return false
      if (!options?.probe) {
        focusEditableCell(nextTarget.id, nextTarget.rowIndex, {
          ...options,
          activate: options?.activate === true && nextTarget.activateOnFocus,
        })
      }
      return true
    },
    [focusEditableCell],
  )

  const navigateCell = React.useCallback(
    (
      currentId: string,
      direction: TableEditableCellNavigation,
      options?: TableEditableCellNavigationOptions,
    ): boolean => {
      const targets = cellNavigationTargetsRef.current
      const currentIndex = targets.findIndex(t => t.id === currentId)
      if (currentIndex < 0) return false

      if (direction === 'next' || direction === 'previous') {
        const offset = direction === 'next' ? 1 : -1
        const nextTarget = targets[currentIndex + offset]
        if (!nextTarget) return false
        if (!options?.probe) focusEditableCell(nextTarget.id, nextTarget.rowIndex, options)
        return true
      }

      const currentTarget = targets[currentIndex]
      if (!currentTarget) return false
      const candidates = targets.filter(t => t.columnIndex === currentTarget.columnIndex)
      const currentColumnIndex = candidates.findIndex(t => t.id === currentId)
      const offset = direction === 'down' ? 1 : -1
      const nextTarget = candidates[currentColumnIndex + offset]
      if (!nextTarget) return false
      if (!options?.probe) focusEditableCell(nextTarget.id, nextTarget.rowIndex, options)
      return true
    },
    [focusEditableCell],
  )

  const requestRowActionFocus = React.useCallback(
    (sourceRowId: string) => {
      const requestId = rowFocusRequestIdRef.current + 1
      rowFocusRequestIdRef.current = requestId
      pendingRowFocusRef.current = {
        beforeRowIds: new Set(rows.map(row => row.id)),
        requestId,
        sourceRowId,
      }
      return requestId
    },
    [rows],
  )

  const clearPendingRowFocusRequest = React.useCallback((requestId: number) => {
    window.setTimeout(() => {
      if (pendingRowFocusRef.current?.requestId === requestId) {
        pendingRowFocusRef.current = null
      }
    }, 0)
  }, [])

  const handleRowActionKeyboard = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      const action = getTableRowKeyboardAction(event)
      if (!action || !rowActions) return

      const rowId = getTableRowIdFromKeyboardEvent(event)
      const row = rowId ? rows.find(item => item.id === rowId) : undefined
      if (!row) return

      const isSupportedAction =
        (action === 'duplicate' && Boolean(rowActions.onDuplicate)) ||
        (action === 'remove' && Boolean(rowActions.onRemove))
      if (!isSupportedAction) return

      event.preventDefault()
      event.stopPropagation()

      if (action === 'duplicate' && rowActions.onDuplicate) {
        if (!(rowActions.canDuplicate?.(row.original) ?? true)) return
        const focusRequestId = requestRowActionFocus(row.id)
        const result = rowActions.onDuplicate(row.original)
        clearPendingRowFocusOnActionSettled(focusRequestId, result, clearPendingRowFocusRequest)
        return
      }

      if (action === 'remove' && rowActions.onRemove) {
        if (!(rowActions.canRemove?.(row.original) ?? true)) return
        rowActions.onRemove(row.original)
      }
    },
    [clearPendingRowFocusRequest, requestRowActionFocus, rowActions, rows],
  )

  React.useLayoutEffect(() => {
    const pending = pendingRowFocusRef.current
    if (!pending || !onCellEdit) return

    const editableRowIds = new Set(editableCellTargets.map(target => target.rowId))
    const indexedRows = rows.map((row, rowIndex) => ({ row, rowIndex }))
    const addedRows = indexedRows.filter(({ row }) => !pending.beforeRowIds.has(row.id))
    if (addedRows.length === 0) return

    const editableAddedRows = addedRows.filter(({ row }) => editableRowIds.has(row.id))
    if (editableAddedRows.length === 0) {
      pendingRowFocusRef.current = null
      return
    }

    const sourceRowIndex = indexedRows.find(({ row }) => row.id === pending.sourceRowId)?.rowIndex ?? -1
    const targetRow =
      editableAddedRows.find(({ rowIndex }) => sourceRowIndex < 0 || rowIndex > sourceRowIndex) ?? editableAddedRows[0]
    const target = editableCellTargets
      .filter(cellTarget => cellTarget.rowId === targetRow?.row.id)
      .sort((left, right) => left.columnIndex - right.columnIndex)[0]

    pendingRowFocusRef.current = null
    if (!target) return
    focusEditableCell(target.id, target.rowIndex, { activate: target.activateOnFocus })
  }, [editableCellTargets, focusEditableCell, onCellEdit, rows])

  // Shared load-more check — guarded against overlapping fetches
  const maybeLoadMore = React.useCallback(
    (target: HTMLDivElement) => {
      if (!hasNextPage || !fetchNextPage || isFetching) return
      if (target.scrollTop + target.clientHeight >= target.scrollHeight - rowHeight * 2) {
        fetchNextPage()
      }
    },
    [hasNextPage, fetchNextPage, isFetching, rowHeight],
  )

  const handleScroll = React.useCallback(
    (event: React.UIEvent<HTMLDivElement>) => {
      setScrollLeft(event.currentTarget.scrollLeft)
      maybeLoadMore(event.currentTarget)
    },
    [maybeLoadMore],
  )

  // If initial data doesn't fill the container, trigger next page fetch
  // biome-ignore lint/correctness/useExhaustiveDependencies: rows.length triggers re-check when new data arrives
  React.useEffect(() => {
    const target = containerRef.current
    if (target) maybeLoadMore(target)
  }, [rows.length, maybeLoadMore])

  return (
    <Grid
      rows="auto minmax(0, 1fr) auto"
      className={cn('w-full min-h-0 min-w-0 flex-1 overflow-hidden', className)}
      style={columnSizeVars as React.CSSProperties}
    >
      <div className={tableHeaderViewportClass}>
        <table
          className={tableFixedLayoutClass}
          style={{ width: tableWidth, transform: `translateX(${-scrollLeft}px)` }}
        >
          <thead className={theadClass}>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id} className={tableHeaderRowClass}>
                {headerGroup.headers.map(header => {
                  const canSort = header.column.getCanSort()
                  const sorted = header.column.getIsSorted()
                  const toggleSort = header.column.getToggleSortingHandler()
                  const columnMeta = getColumnMeta(header.column.columnDef.meta)
                  const align = columnMeta.align ?? mapJustifyToAlign(getSharedTableColumnJustify(columnMeta))
                  const { verticalAlign } = columnMeta
                  return (
                    <th
                      key={header.id}
                      className={cn(tableHeaderCellStructureClass, theadCellClass)}
                      aria-sort={
                        canSort
                          ? sorted === 'asc'
                            ? 'ascending'
                            : sorted === 'desc'
                              ? 'descending'
                              : 'none'
                          : undefined
                      }
                      style={{
                        width: `var(--col-${header.column.id}-size)`,
                        ...cellStyle,
                        ...(align ? { textAlign: align } : undefined),
                      }}
                    >
                      <Flex
                        align={verticalAlign ?? 'center'}
                        justify={align === 'right' ? 'end' : align === 'center' ? 'center' : 'start'}
                        style={{ height: '100%' }}
                      >
                        <TableColumnHeaderContent
                          isPlaceholder={header.isPlaceholder}
                          sortable={canSort}
                          sortDirection={sorted}
                          onSort={toggleSort}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </TableColumnHeaderContent>
                      </Flex>
                      {header.column.getCanResize() ? (
                        <TableColumnResizeHandle
                          columnId={header.column.id}
                          header={header.column.columnDef.header}
                          currentSize={header.getSize()}
                          currentSizing={table.getState().columnSizing}
                          minSize={header.column.columnDef.minSize}
                          maxSize={header.column.columnDef.maxSize}
                          isResizing={header.column.getIsResizing()}
                          className={resizeHandleClass}
                          activeClassName={resizeHandleActiveClass}
                          onMouseDown={header.getResizeHandler()}
                          onTouchStart={header.getResizeHandler()}
                          onResize={(columnId, nextSize) => {
                            table.setColumnSizing(previousSizing => ({ ...previousSizing, [columnId]: nextSize }))
                          }}
                          onReset={() => header.column.resetSize()}
                        />
                      ) : null}
                    </th>
                  )
                })}
              </tr>
            ))}
          </thead>
        </table>
      </div>
      <div
        ref={containerRef}
        className={tableBodyViewportClass}
        onScroll={handleScroll}
        onKeyDownCapture={handleRowActionKeyboard}
      >
        {isLoading ? (
          <Flex align="center" justify="center" p="4" className={loadingRowClass}>
            Loading...
          </Flex>
        ) : rows.length === 0 ? (
          <Flex align="center" justify="center" p="8" className={emptyStateClass}>
            No results
          </Flex>
        ) : (
          <table className={tableFixedLayoutClass} style={{ width: tableWidth }}>
            <tbody className={tableVirtualBodyClass} style={{ height: `${virtualizer.getTotalSize()}px` }}>
              {virtualizer.getVirtualItems().map(virtualRow => {
                const row = rows[virtualRow.index]
                if (!row) return null
                const clickable = enableRowClick && isRowClickable(row.original)
                return (
                  <tr
                    key={row.id}
                    data-index={virtualRow.index}
                    data-table-row-id={row.id}
                    ref={virtualizer.measureElement}
                    className={cn(rowClass, 'group/table-row', clickable && 'cursor-pointer')}
                    style={{ width: tableWidth, transform: `translateY(${virtualRow.start}px)` }}
                    data-state={
                      selectedRowIndex === virtualRow.index ? 'active' : row.getIsSelected() ? 'selected' : undefined
                    }
                    onClick={clickable ? () => selectRow(virtualRow.index) : undefined}
                  >
                    {row.getVisibleCells().map((cell, cellIndex) => {
                      const columnMeta = getColumnMeta(cell.column.columnDef.meta)
                      const align = columnMeta.align ?? mapJustifyToAlign(getSharedTableColumnJustify(columnMeta))
                      const { verticalAlign, hoverCard } = columnMeta
                      const fullCell = columnMeta.fullCell ?? isFullCellRenderer(columnMeta.renderer)
                      const rendered = columnMeta.renderer
                        ? renderTableCellValue(cell.getValue() as never, columnMeta.renderer, size)
                        : flexRender(cell.column.columnDef.cell, cell.getContext())

                      const editContext = onCellEdit
                        ? { row: row.original, rowId: row.id, columnId: cell.column.id, value: cell.getValue() }
                        : null
                      const resolvedEditor = editContext
                        ? resolveTableCellEditorConfig(columnMeta.editor, editContext)
                        : undefined
                      const effectiveEditor = resolvedEditor ?? deriveEditorFromRenderer(columnMeta.renderer)
                      const isEditable =
                        editContext != null &&
                        isTableCellEditable({
                          editable: columnMeta.editable,
                          editor: effectiveEditor,
                          context: editContext,
                        })
                      const readViewId = getEditableCellReadViewId(row.id, cell.column.id)
                      const isNavigable = true

                      const displayContent =
                        !isEditable && hoverCard ? (
                          <HoverCard.Root>
                            <HoverCard.Trigger
                              render={<button type="button" />}
                              nativeButton
                              className="cursor-default truncate bg-transparent border-none p-0 text-inherit font-inherit text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                            >
                              {rendered}
                            </HoverCard.Trigger>
                            <HoverCard.Content side="bottom" align="start" size="sm" maxWidth="none">
                              {hoverCard(cell.getValue(), row.original)}
                            </HoverCard.Content>
                          </HoverCard.Root>
                        ) : (
                          rendered
                        )
                      const content =
                        isEditable || isNavigable ? (
                          <TableEditableCellContent
                            isEditable={isEditable}
                            context={editContext}
                            editor={effectiveEditor}
                            validateEdit={columnMeta.validateEdit}
                            onCommit={onCellEdit}
                            onNavigate={
                              isEditable
                                ? (direction, options) => navigateEditableCell(readViewId, direction, options)
                                : undefined
                            }
                            onReadNavigate={(direction, options) => navigateCell(readViewId, direction, options)}
                            ariaLabel={
                              typeof columnMeta.header === 'string'
                                ? `Edit ${columnMeta.header}`
                                : `Edit ${cell.column.id}`
                            }
                            readViewId={readViewId}
                            cellMode={cellMode}
                            isNavigable={isNavigable}
                          >
                            {displayContent}
                          </TableEditableCellContent>
                        ) : (
                          displayContent
                        )
                      const isFirstColumn = cellIndex === 0
                      const contentWithRowActions =
                        isFirstColumn && hasRowActions ? (
                          <Flex align={verticalAlign ?? 'center'} gap="1" className="h-full w-full min-w-0">
                            <span className="min-w-0 flex-1 overflow-hidden truncate">{content}</span>
                            <InfiniteRowActions
                              row={row}
                              onDuplicateAction={() => requestRowActionFocus(row.id)}
                              onDuplicateSettled={clearPendingRowFocusRequest}
                            />
                          </Flex>
                        ) : (
                          content
                        )

                      return (
                        <td
                          key={cell.id}
                          className={cn(
                            tableCellStructureClass,
                            cellClass,
                            fullCell && 'relative',
                            (isEditable || isNavigable) && editableCellWrapper,
                          )}
                          style={{
                            width: `var(--col-${cell.column.id}-size)`,
                            ...(fullCell ? { paddingInline: 0, paddingBlock: 0, position: 'relative' } : cellStyle),
                            ...(align ? { textAlign: align } : undefined),
                          }}
                        >
                          <Flex align={verticalAlign ?? 'center'} style={{ height: '100%' }}>
                            {contentWithRowActions}
                          </Flex>
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
      {hasFooterRegion ? (
        <div className={tableFooterViewportClass}>
          <div style={{ width: tableWidth, transform: `translateX(${-scrollLeft}px)` }}>
            {summaryChart?.columns?.length ? (
              <div className={cn(tfootRowClass, summaryChart.className)}>
                {visibleColumns.map(column => {
                  const summaryColumn = summaryColumns.get(column.id)
                  return (
                    <div
                      key={column.id}
                      className={cn(tableFooterCellStructureClass, tfootCellClass)}
                      style={{
                        ...cellStyle,
                        paddingInline: 0,
                        paddingBlock: 0,
                        width: `var(--col-${column.id}-size)`,
                      }}
                    >
                      {summaryColumn ? <StackedSummaryBar segments={summaryColumn.segments} /> : null}
                    </div>
                  )
                })}
              </div>
            ) : null}
            {footerContent ? (
              <div className={tfootRowClass}>
                <div
                  className={cn(tableFooterCellStructureClass, tfootCellClass)}
                  style={{
                    ...cellStyle,
                    width: tableWidth,
                    paddingBlock: `calc(${cellStyle.paddingBlock} + 0.25rem)`,
                    whiteSpace: 'normal',
                  }}
                >
                  {footerContent}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </Grid>
  )
}

InfiniteTableContent.displayName = 'InfiniteTable.Content'

// ─── Footer ─────────────────────────────────────────────────────────────────

function InfiniteTableFooter({ children }: InfiniteTableFooterProps) {
  const { setFooterContent } = useInfiniteTable()

  React.useEffect(() => {
    setFooterContent(children)
    return () => setFooterContent(undefined)
  }, [children, setFooterContent])

  return null
}

InfiniteTableFooter.displayName = 'InfiniteTable.Footer'

// ─── Summary Chart ──────────────────────────────────────────────────────────

function InfiniteTableSummaryChart({ children, className, columns }: InfiniteTableSummaryChartProps) {
  const { setSummaryChart } = useInfiniteTable()

  React.useEffect(() => {
    if (!columns?.length) {
      setSummaryChart(undefined)
      return
    }

    setSummaryChart({ className, columns })
    return () => setSummaryChart(undefined)
  }, [className, columns, setSummaryChart])

  if (!children) return null

  return (
    <div className={cn('w-full min-w-0 border-border/70 border-b bg-background px-4 py-3', className)}>{children}</div>
  )
}

InfiniteTableSummaryChart.displayName = 'InfiniteTable.SummaryChart'

// ─── Detail Drawer ──────────────────────────────────────────────────────────

export interface InfiniteTableDetailDrawerProps<TData> {
  /** Custom renderer for the detail content */
  renderDetail?: (row: TData, isLoading: boolean) => React.ReactNode
  /** Async data fetcher — called when a row is selected */
  fetchDetail?: (row: TData) => Promise<Record<string, unknown>>
  /** Drawer title — string or function that receives the row */
  title?: React.ReactNode | ((row: TData) => React.ReactNode)
  /** Max drawer width (default: 480) */
  maxWidth?: number
}

function InfiniteTableDetailDrawer<TData>({
  renderDetail,
  fetchDetail,
  title: titleProp,
  maxWidth,
}: InfiniteTableDetailDrawerProps<TData>) {
  const { table, selectedRowIndex, selectRow, setEnableRowClick } = useInfiniteTable<TData>()

  // Register that row clicking is enabled while this component is mounted
  React.useEffect(() => {
    setEnableRowClick(true)
    return () => setEnableRowClick(false)
  }, [setEnableRowClick])

  const rows = table.getRowModel().rows
  const selectedRow = selectedRowIndex != null ? rows[selectedRowIndex] : null
  const rowData = selectedRow?.original ?? null

  const [fetchedData, setFetchedData] = React.useState<Record<string, unknown> | null>(null)
  const [isFetchLoading, setIsFetchLoading] = React.useState(false)
  const fetchIdRef = React.useRef(0)

  // Fetch detail data when row changes
  React.useEffect(() => {
    if (!fetchDetail || !rowData) {
      setFetchedData(null)
      return
    }
    const id = ++fetchIdRef.current
    let cancelled = false
    setIsFetchLoading(true)
    fetchDetail(rowData).then(
      data => {
        if (!cancelled && id === fetchIdRef.current) {
          setFetchedData(data)
          setIsFetchLoading(false)
        }
      },
      () => {
        if (!cancelled && id === fetchIdRef.current) {
          setFetchedData(null)
          setIsFetchLoading(false)
        }
      },
    )
    return () => {
      cancelled = true
    }
  }, [fetchDetail, rowData])

  const resolvedTitle = rowData
    ? typeof titleProp === 'function'
      ? (titleProp as (row: TData) => React.ReactNode)(rowData)
      : titleProp
    : undefined

  // Build entries from row data (merge fetched data if available)
  const entries = React.useMemo(() => {
    if (!rowData) return []
    const source = fetchedData ? { ...(rowData as Record<string, unknown>), ...fetchedData } : rowData
    return objectToDetailEntries(source as Record<string, unknown>)
  }, [rowData, fetchedData])

  return (
    <TableDetailDrawer
      open={selectedRowIndex != null}
      onOpenChange={open => {
        if (!open) selectRow(null)
      }}
      title={resolvedTitle}
      entries={entries}
      rowCount={rows.length}
      currentIndex={selectedRowIndex ?? 0}
      onNavigate={selectRow}
      isLoading={isFetchLoading}
      maxWidth={maxWidth}
    >
      {renderDetail && rowData ? renderDetail(rowData, isFetchLoading) : undefined}
    </TableDetailDrawer>
  )
}

InfiniteTableDetailDrawer.displayName = 'InfiniteTable.DetailDrawer'

// ─── Row Actions ────────────────────────────────────────────────────────────

function InfiniteRowActions<TData>({
  row,
  onDuplicateAction,
  onDuplicateSettled,
}: {
  row: Row<TData>
  onDuplicateAction?: () => number
  onDuplicateSettled?: (requestId: number) => void
}) {
  const { rowActions } = useInfiniteTable<TData>()
  if (!rowActions) return null

  const rowData = row.original
  const showDuplicate = Boolean(rowActions.onDuplicate && (rowActions.canDuplicate?.(rowData) ?? true))
  const showRemove = Boolean(rowActions.onRemove && (rowActions.canRemove?.(rowData) ?? true))
  const actionItems: Array<TableRowActionConfig<InfiniteTableRowAction> | null> = [
    showDuplicate
      ? {
          value: 'duplicate',
          label: rowActions.labels?.duplicate,
          onAction: () => {
            const focusRequestId = onDuplicateAction?.()
            const result = rowActions.onDuplicate?.(rowData)
            clearPendingRowFocusOnActionSettled(focusRequestId, result, onDuplicateSettled ?? (() => undefined))
          },
        }
      : null,
    showRemove
      ? {
          value: 'remove',
          label: rowActions.labels?.remove,
          onAction: () => {
            rowActions.onRemove?.(rowData)
          },
        }
      : null,
  ]
  const actions = actionItems.filter((action): action is TableRowActionConfig<InfiniteTableRowAction> => action != null)

  if (actions.length === 0) return null

  return <TableRowActions actions={actions} ariaLabel="Row actions" />
}

// ─── Compound Export ────────────────────────────────────────────────────────

export const InfiniteTable = {
  Root: InfiniteTableRoot,
  Layout: InfiniteTableLayout,
  Toolbar: InfiniteTableToolbar,
  SummaryChart: InfiniteTableSummaryChart,
  Content: InfiniteTableContent,
  Footer: InfiniteTableFooter,
  DetailDrawer: InfiniteTableDetailDrawer,
}

export namespace InfiniteTableProps {
  export type Root<TData, TValue = unknown> = InfiniteTableRootProps<TData, TValue>
  export type Toolbar = InfiniteTableToolbarProps
  export type SummaryChart = InfiniteTableSummaryChartProps
  export type Footer = InfiniteTableFooterProps
}
