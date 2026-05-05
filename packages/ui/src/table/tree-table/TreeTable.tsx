'use client'

import {
  type ExpandedState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getSortedRowModel,
  type SortingState,
  type Row as TanStackRow,
  useReactTable,
} from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import { assignInlineVars } from '@vanilla-extract/dynamic'
import * as React from 'react'
import { IconButton } from '@/elements/button/IconButton'
import { Column, Flex } from '@/layouts/flex/Flex'
import { Grid } from '@/layouts/grid/Grid'
import { cn } from '@/lib/utils'
import type { TableSize } from '@/table/basic/table.props'
import {
  compareSharedTableCellValues,
  deriveEditorFromRenderer,
  getSharedTableColumnJustify,
  isTableCellEditable,
  READ_TABLE_CELL_MODE,
  renderTableCellValue,
  resolveTableCellEditorConfig,
  shouldActivateTableCellEditorOnFocus,
  TableCellModeToggle,
  TableCellModeToolbarActions,
  TableColumnHeaderContent,
  TableColumnResizeHandle,
  TableEditableCellContent,
  type TableEditableCellNavigation,
  type TableEditableCellNavigationOptions,
  type TableRowActionConfig,
  TableRowActions,
  useTableCellMode,
} from '@/table/shared'
import { editableCellMinHeightVar, editableCellWrapper } from '@/table/shared/table-editable-cell.css'
import { getTableRowIdFromKeyboardEvent, getTableRowKeyboardAction } from '@/table/shared/table-row-keyboard-actions'
import {
  tableBodyViewportClass,
  tableCellStructureClass,
  tableFixedLayoutClass,
  tableHeaderCellStructureClass,
  tableHeaderRowClass,
  tableHeaderViewportClass,
  tableVirtualBodyClass,
  tableVirtualRowClass,
} from '@/table/shared/table-structure'
import { tableSizeTokens } from '@/table/table.tokens'
import { semanticColorVar } from '@/theme/props/color.prop'
import { Text } from '@/typography/text/Text'
import {
  type TreeTablePendingRowFocus,
  type TreeTablePendingRowFocusAction,
  TreeTableProvider,
  useTreeTable,
} from './tree-table.context'
import {
  treeCellClass,
  treeResizeHandleActiveClass,
  treeResizeHandleClass,
  treeRowClass,
  treeSortButtonClass,
  treeSortIconActiveClass,
  treeStateTextClass,
  treeTableBorderColorVar,
  treeTableHoverColorVar,
  treeTablePrimaryColorVar,
  treeTableSelectedColorVar,
  treeTableShellVariant,
  treeTableSurfaceColorVar,
  treeTableTextColorVar,
  treeTheadCellClass,
  treeTheadClass,
  treeTheadVariant,
  treeToolbarClass,
} from './tree-table.css'
import type {
  TreeTableColumnMeta,
  TreeTableContentProps,
  TreeTableRootProps,
  TreeTableRowAction,
  TreeTableToolbarProps,
} from './tree-table.props'

// ─── Helpers ────────────────────────────────────────────────────────────────

function getColumnMeta<TData>(meta: unknown): TreeTableColumnMeta<TData> {
  return meta && typeof meta === 'object' && !Array.isArray(meta) ? (meta as TreeTableColumnMeta<TData>) : {}
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

function getAllTreeRowIds<TData>(
  rows: readonly TData[],
  getRowId: (row: TData) => string,
  getSubRows: (row: TData) => TData[] | undefined,
) {
  const rowIds = new Set<string>()
  const visit = (items: readonly TData[]) => {
    for (const item of items) {
      rowIds.add(getRowId(item))
      const subRows = getSubRows(item)
      if (subRows?.length) visit(subRows)
    }
  }

  visit(rows)
  return rowIds
}

// ─── Root ───────────────────────────────────────────────────────────────────

function TreeTableRoot<TData>({
  columns,
  data,
  getRowId,
  getSubRows,
  defaultSorting = [],
  defaultExpanded = true,
  isLoading,
  size = 'sm',
  variant = 'ghost',
  color = 'neutral',
  indentWidth = 24,
  editable = true,
  defaultCellMode = READ_TABLE_CELL_MODE,
  cellMode,
  onCellModeChange,
  allowedCellModes,
  onCellEdit,
  onAddChild,
  onAddSibling,
  onIndent,
  onOutdent,
  onMoveUp,
  onMoveDown,
  onRemove,
  onDuplicate,
  canAddChild,
  canAddSibling,
  canIndent,
  canOutdent,
  canMoveUp,
  canMoveDown,
  canRemove,
  canDuplicate,
  rowActionLabels,
  children,
}: TreeTableRootProps<TData>) {
  'use no memo'
  const [sorting, setSorting] = React.useState<SortingState>(defaultSorting)
  const [expanded, setExpanded] = React.useState<ExpandedState>(defaultExpanded)
  const pendingRowFocusRef = React.useRef<TreeTablePendingRowFocus | null>(null)
  const rowFocusRequestIdRef = React.useRef(0)
  const isTableEditable = editable !== false && Boolean(onCellEdit)
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

  const processedColumns = React.useMemo(() => {
    return columns.map(col => {
      const columnMeta = getColumnMeta<TData>(col.meta)
      if (columnMeta.renderer && !col.sortingFn) {
        return {
          ...col,
          sortingFn: (left: TanStackRow<TData>, right: TanStackRow<TData>, columnId: string) => {
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
  }, [columns])

  const table = useReactTable({
    data,
    columns: processedColumns,
    state: { sorting, expanded },
    onSortingChange: setSorting,
    onExpandedChange: setExpanded,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getSubRows: getSubRows as (row: TData) => TData[] | undefined,
    getRowId,
    columnResizeMode: 'onChange',
  })

  const requestRowActionFocus = React.useCallback(
    (action: TreeTablePendingRowFocusAction, sourceRowId: string) => {
      const requestId = rowFocusRequestIdRef.current + 1
      rowFocusRequestIdRef.current = requestId
      const pending: TreeTablePendingRowFocus = {
        action,
        beforeRowIds: getAllTreeRowIds(data, getRowId, getSubRows),
        requestId,
        sourceRowId,
      }
      pendingRowFocusRef.current = pending
      return requestId
    },
    [data, getRowId, getSubRows],
  )

  const clearPendingRowFocusRequest = React.useCallback((requestId: number) => {
    window.setTimeout(() => {
      if (pendingRowFocusRef.current?.requestId === requestId) {
        pendingRowFocusRef.current = null
      }
    }, 0)
  }, [])

  const contextValue = {
    table,
    expanded,
    size,
    variant,
    color,
    isLoading,
    indentWidth,
    cellMode: tableCellMode.cellMode,
    cellModeToggle,
    onCellEdit: isTableEditable ? onCellEdit : undefined,
    onAddChild,
    onAddSibling,
    onIndent,
    onOutdent,
    onMoveUp,
    onMoveDown,
    onRemove,
    onDuplicate,
    canAddChild,
    canAddSibling,
    canIndent,
    canOutdent,
    canMoveUp,
    canMoveDown,
    canRemove,
    canDuplicate,
    rowActionLabels,
    pendingRowFocusRef,
    requestRowActionFocus,
    clearPendingRowFocusRequest,
  }
  const treeTableStyle = React.useMemo(
    () => ({
      ...assignInlineVars({
        [treeTableBorderColorVar]: semanticColorVar(color, 'border'),
        [treeTableHoverColorVar]: semanticColorVar(color, 'soft'),
        [treeTableSelectedColorVar]: semanticColorVar(color, 'soft'),
        [treeTableSurfaceColorVar]: semanticColorVar(color, 'surface'),
        [treeTableTextColorVar]: semanticColorVar(color, 'text'),
        [treeTablePrimaryColorVar]: semanticColorVar(color, 'primary'),
        [editableCellMinHeightVar]: tableSizeTokens[size].editableMinHeight,
      }),
      fontSize: tableSizeTokens[size].fontSize,
      lineHeight: tableSizeTokens[size].lineHeight,
    }),
    [color, size],
  )

  return (
    <TreeTableProvider value={contextValue}>
      <Column
        className={cn('h-full min-h-0 w-full min-w-0 overflow-hidden', treeTableShellVariant[variant])}
        style={treeTableStyle}
      >
        {children}
      </Column>
    </TreeTableProvider>
  )
}

TreeTableRoot.displayName = 'TreeTable.Root'

// ─── Toolbar ────────────────────────────────────────────────────────────────

function TreeTableToolbar({ count, meta, actions }: TreeTableToolbarProps) {
  const { table, size, cellModeToggle } = useTreeTable()
  const totalCount = count ?? table.getRowCount()
  const tokens = tableSizeTokens[size]

  return (
    <Flex
      align="center"
      justify="between"
      className={cn('shrink-0 gap-2', treeToolbarClass)}
      style={{ paddingInline: tokens.paddingX, paddingBlock: tokens.paddingY }}
    >
      <Flex align="center" gap="2">
        <Text as="span" size={size} color="neutral">
          {totalCount} items
        </Text>
        {meta}
      </Flex>
      <TableCellModeToolbarActions toggle={cellModeToggle}>{actions}</TableCellModeToolbarActions>
    </Flex>
  )
}

TreeTableToolbar.displayName = 'TreeTable.Toolbar'

// ─── Editable cell navigation ──────────────────────────────────────────────

type EditableCellTarget = {
  id: string
  rowId: string
  rowIndex: number
  columnIndex: number
  activateOnFocus: boolean
}

type CellNavigationTarget = Omit<EditableCellTarget, 'activateOnFocus'>

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

// ─── Content ────────────────────────────────────────────────────────────────

function TreeTableContent({ className, estimateRowHeight, minBodyHeight, maxBodyHeight }: TreeTableContentProps) {
  const {
    table,
    size,
    variant,
    isLoading,
    indentWidth,
    onCellEdit,
    onAddChild,
    onAddSibling,
    onIndent,
    onOutdent,
    onMoveUp,
    onMoveDown,
    onRemove,
    onDuplicate,
    canIndent,
    canOutdent,
    canMoveUp,
    canMoveDown,
    canRemove,
    canDuplicate,
    pendingRowFocusRef,
    requestRowActionFocus,
    clearPendingRowFocusRequest,
    cellMode,
  } = useTreeTable()
  const containerRef = React.useRef<HTMLDivElement>(null)

  const { rows } = table.getRowModel()
  const rowHeight = estimateRowHeight ?? getEstimatedRowHeight(size)
  const [scrollLeft, setScrollLeft] = React.useState(0)

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => containerRef.current,
    estimateSize: () => rowHeight,
    overscan: 10,
  })

  const flatHeaders = table.getFlatHeaders()
  const columnSizeVars: Record<string, string> = {}
  for (const header of flatHeaders) {
    columnSizeVars[`--col-${header.column.id}-size`] = `${header.getSize()}px`
  }

  const cellStyle = getCellSizeStyle(size)
  const visibleColumns = table.getVisibleLeafColumns()
  const tableWidth = `${visibleColumns.reduce((sum, column) => sum + column.getSize(), 0)}px`
  const totalBodyHeight = virtualizer.getTotalSize()
  const tableBodyHeight = `${totalBodyHeight}px`
  const bodyViewportHeight =
    maxBodyHeight == null ? undefined : Math.min(maxBodyHeight, Math.max(minBodyHeight ?? 0, totalBodyHeight))
  const bodyViewportStyle: React.CSSProperties | undefined =
    minBodyHeight == null && bodyViewportHeight == null
      ? undefined
      : {
          ...(minBodyHeight == null ? undefined : { minHeight: `${minBodyHeight}px` }),
          ...(bodyViewportHeight == null ? undefined : { height: `${bodyViewportHeight}px` }),
        }

  const hasRowActions = Boolean(
    onAddChild || onAddSibling || onIndent || onOutdent || onMoveUp || onMoveDown || onRemove || onDuplicate,
  )

  // ── Editable cell navigation ────────────────────────────────────────────
  const tableInstanceId = React.useId()

  const getEditableCellReadViewId = React.useCallback(
    (rowId: string, columnId: string) => `${tableInstanceId}-tree-editable-${rowId}-${columnId}`,
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
  }, [editableCellTargets, focusEditableCell, onCellEdit, pendingRowFocusRef, rows])

  const handleScroll = React.useCallback((event: React.UIEvent<HTMLDivElement>) => {
    setScrollLeft(event.currentTarget.scrollLeft)
  }, [])

  const handleRowActionKeyboard = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      const action = getTableRowKeyboardAction(event)
      if (!action) return

      const rowId = getTableRowIdFromKeyboardEvent(event)
      const row = rowId ? rows.find(item => item.id === rowId) : undefined
      if (!row) return

      const rowData = row.original

      const isSupportedAction =
        (action === 'duplicate' && Boolean(onDuplicate)) ||
        (action === 'remove' && Boolean(onRemove)) ||
        (action === 'indent' && Boolean(onIndent)) ||
        (action === 'outdent' && Boolean(onOutdent)) ||
        (action === 'move-up' && Boolean(onMoveUp)) ||
        (action === 'move-down' && Boolean(onMoveDown))
      if (!isSupportedAction) return

      event.preventDefault()
      event.stopPropagation()

      if (action === 'duplicate' && onDuplicate) {
        if (!(canDuplicate?.(rowData) ?? true)) return
        const focusRequestId = requestRowActionFocus('duplicate', row.id)
        try {
          const result = onDuplicate(rowData)
          clearPendingRowFocusOnActionSettled(focusRequestId, result, clearPendingRowFocusRequest)
        } catch (error) {
          clearPendingRowFocusRequest(focusRequestId)
          throw error
        }
        return
      }

      if (action === 'remove' && onRemove) {
        if (!(canRemove?.(rowData) ?? true)) return
        onRemove(rowData)
        return
      }

      if (action === 'indent' && onIndent) {
        if (!(canIndent?.(rowData) ?? true)) return
        onIndent(rowData)
        return
      }

      if (action === 'outdent' && onOutdent) {
        if (!(canOutdent?.(rowData) ?? true)) return
        onOutdent(rowData)
        return
      }

      if (action === 'move-up' && onMoveUp) {
        if (!(canMoveUp?.(rowData) ?? true)) return
        onMoveUp(rowData)
        return
      }

      if (action === 'move-down' && onMoveDown) {
        if (!(canMoveDown?.(rowData) ?? true)) return
        onMoveDown(rowData)
      }
    },
    [
      canDuplicate,
      canIndent,
      canMoveDown,
      canMoveUp,
      canOutdent,
      canRemove,
      clearPendingRowFocusRequest,
      onDuplicate,
      onIndent,
      onMoveDown,
      onMoveUp,
      onOutdent,
      onRemove,
      requestRowActionFocus,
      rows,
    ],
  )

  return (
    <Grid
      rows="auto minmax(0, 1fr)"
      className={cn('w-full min-h-0 min-w-0 overflow-hidden', maxBodyHeight == null && 'flex-1', className)}
      style={columnSizeVars as React.CSSProperties}
    >
      <div className={tableHeaderViewportClass}>
        <table
          className={tableFixedLayoutClass}
          style={{ width: tableWidth, transform: `translateX(${-scrollLeft}px)` }}
        >
          <thead className={cn(treeTheadClass, treeTheadVariant[variant])}>
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
                      className={cn(tableHeaderCellStructureClass, treeTheadCellClass)}
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
                          className={treeSortButtonClass}
                          activeIconClassName={treeSortIconActiveClass}
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
                          className={treeResizeHandleClass}
                          activeClassName={treeResizeHandleActiveClass}
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
        style={bodyViewportStyle}
        onScroll={handleScroll}
        onKeyDownCapture={handleRowActionKeyboard}
      >
        {isLoading ? (
          <Flex align="center" justify="center" p="4" className={treeStateTextClass}>
            Loading...
          </Flex>
        ) : rows.length === 0 ? (
          <Flex align="center" justify="center" p="6" className={treeStateTextClass}>
            No items
          </Flex>
        ) : (
          <table className={tableFixedLayoutClass} style={{ width: tableWidth, height: tableBodyHeight }}>
            <tbody className={tableVirtualBodyClass} style={{ height: tableBodyHeight }}>
              {virtualizer.getVirtualItems().map(virtualRow => {
                const row = rows[virtualRow.index]
                if (!row) return null
                const depth = row.depth
                const canExpand = row.getCanExpand()
                const isExpanded = row.getIsExpanded()

                return (
                  <tr
                    key={row.id}
                    data-index={virtualRow.index}
                    data-table-row-id={row.id}
                    ref={virtualizer.measureElement}
                    className={cn(tableVirtualRowClass, treeRowClass, 'group/table-row')}
                    style={{ width: tableWidth, transform: `translateY(${virtualRow.start}px)` }}
                  >
                    {row.getVisibleCells().map((cell, cellIndex) => {
                      const columnMeta = getColumnMeta(cell.column.columnDef.meta)
                      const align = columnMeta.align ?? mapJustifyToAlign(getSharedTableColumnJustify(columnMeta))
                      const { verticalAlign } = columnMeta
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

                      const isFirstColumn = cellIndex === 0

                      const content = (
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
                          {rendered}
                        </TableEditableCellContent>
                      )

                      return (
                        <td
                          key={cell.id}
                          className={cn(
                            tableCellStructureClass,
                            'flex items-center',
                            treeCellClass,
                            (isEditable || isNavigable) && editableCellWrapper,
                          )}
                          style={{
                            width: `var(--col-${cell.column.id}-size)`,
                            ...cellStyle,
                            ...(align ? { textAlign: align } : undefined),
                          }}
                        >
                          {isFirstColumn ? (
                            <Grid
                              data-tree-first-cell-content
                              columns="auto auto minmax(0, 1fr) auto"
                              align={verticalAlign ?? 'center'}
                              gapX="1"
                              width="100%"
                              minWidth="0"
                              height="100%"
                              position="relative"
                            >
                              <span style={{ width: depth * indentWidth, flexShrink: 0 }} />
                              {canExpand ? (
                                <IconButton
                                  size="xs"
                                  variant="ghost"
                                  color="neutral"
                                  icon={isExpanded ? 'chevron-down' : 'chevron-right'}
                                  onClick={e => {
                                    e.stopPropagation()
                                    row.toggleExpanded()
                                  }}
                                  aria-label={isExpanded ? 'Collapse row' : 'Expand row'}
                                  aria-expanded={isExpanded}
                                />
                              ) : (
                                <span className="inline-block w-5 shrink-0" />
                              )}
                              <span data-tree-first-cell-value className="min-w-0 flex-1 overflow-hidden truncate">
                                {content}
                              </span>
                              {hasRowActions ? <TreeRowActions row={row} /> : null}
                            </Grid>
                          ) : (
                            <Flex
                              align={verticalAlign ?? 'center'}
                              justify={align === 'right' ? 'end' : align === 'center' ? 'center' : 'start'}
                              style={{ width: '100%', height: '100%' }}
                            >
                              {content}
                            </Flex>
                          )}
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
    </Grid>
  )
}

TreeTableContent.displayName = 'TreeTable.Content'

// ─── Row Actions ────────────────────────────────────────────────────────────

function TreeRowActions<TData>({ row }: { row: TanStackRow<TData> }) {
  const {
    onAddChild,
    onAddSibling,
    onIndent,
    onOutdent,
    onMoveUp,
    onMoveDown,
    onRemove,
    onDuplicate,
    canAddChild,
    canAddSibling,
    canIndent,
    canOutdent,
    canMoveUp,
    canMoveDown,
    canRemove,
    canDuplicate,
    rowActionLabels,
    requestRowActionFocus,
    clearPendingRowFocusRequest,
  } = useTreeTable<TData>()
  const rowData = row.original
  const showAddChild = Boolean(onAddChild && (canAddChild?.(rowData) ?? true))
  const showAddSibling = Boolean(onAddSibling && (canAddSibling?.(rowData) ?? true))
  const showIndent = Boolean(onIndent && (canIndent?.(rowData) ?? true))
  const showOutdent = Boolean(onOutdent && (canOutdent?.(rowData) ?? true))
  const showMoveUp = Boolean(onMoveUp && (canMoveUp?.(rowData) ?? true))
  const showMoveDown = Boolean(onMoveDown && (canMoveDown?.(rowData) ?? true))
  const showDuplicate = Boolean(onDuplicate && (canDuplicate?.(rowData) ?? true))
  const showRemove = Boolean(onRemove && (canRemove?.(rowData) ?? true))
  const actionItems: Array<TableRowActionConfig<TreeTableRowAction> | null> = [
    showAddChild
      ? {
          value: 'add-child',
          label: rowActionLabels?.['add-child'],
          onAction: () => {
            const focusRequestId = requestRowActionFocus('add-child', row.id)
            if (!row.getIsExpanded()) row.toggleExpanded(true)
            const result = onAddChild?.(rowData)
            clearPendingRowFocusOnActionSettled(focusRequestId, result, clearPendingRowFocusRequest)
          },
        }
      : null,
    showAddSibling
      ? {
          value: 'add-sibling',
          label: rowActionLabels?.['add-sibling'],
          onAction: () => {
            onAddSibling?.(rowData)
          },
        }
      : null,
    showMoveUp
      ? {
          value: 'move-up',
          label: rowActionLabels?.['move-up'],
          onAction: () => {
            onMoveUp?.(rowData)
          },
        }
      : null,
    showMoveDown
      ? {
          value: 'move-down',
          label: rowActionLabels?.['move-down'],
          onAction: () => {
            onMoveDown?.(rowData)
          },
        }
      : null,
    showIndent
      ? {
          value: 'indent',
          label: rowActionLabels?.indent,
          onAction: () => {
            onIndent?.(rowData)
          },
        }
      : null,
    showOutdent
      ? {
          value: 'outdent',
          label: rowActionLabels?.outdent,
          onAction: () => {
            onOutdent?.(rowData)
          },
        }
      : null,
    showDuplicate
      ? {
          value: 'duplicate',
          label: rowActionLabels?.duplicate,
          onAction: () => {
            const focusRequestId = requestRowActionFocus('duplicate', row.id)
            const result = onDuplicate?.(rowData)
            clearPendingRowFocusOnActionSettled(focusRequestId, result, clearPendingRowFocusRequest)
          },
        }
      : null,
    showRemove
      ? {
          value: 'remove',
          label: rowActionLabels?.remove,
          onAction: () => {
            onRemove?.(rowData)
          },
        }
      : null,
  ]
  const actions = actionItems.filter((action): action is TableRowActionConfig<TreeTableRowAction> => action != null)

  if (actions.length === 0) return null

  return <TableRowActions actions={actions} ariaLabel="Row actions" />
}

// ─── Compound Export ────────────────────────────────────────────────────────

export const TreeTable = {
  Root: TreeTableRoot,
  Toolbar: TreeTableToolbar,
  Content: TreeTableContent,
}
