'use client'

import {
  type ColumnDef,
  type ExpandedState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from '@tanstack/react-table'
import { ChevronDown, ChevronRight } from 'lucide-react'
import * as React from 'react'
import { IconButton } from '@/elements/button/IconButton'
import { cn } from '@/lib/utils'
import { TableEditableCellContent } from '@/table/shared/TableEditableCellContent'
import { TableHeader } from '@/table/shared/TableHeader'
import { type TableRowActionConfig, TableRowActions } from '@/table/shared/TableRowActions'
import {
  READ_TABLE_CELL_MODE,
  TableCellModeToggle,
  TableCellModeToolbarActions,
  useTableCellMode,
} from '@/table/shared/table-cell-mode'
import { isFullCellRenderer, renderTableCellValue } from '@/table/shared/table-cell-renderers'
import { TableColumnHeaderContent } from '@/table/shared/table-column'
import { compareSharedTableCellValues, getSharedTableColumnJustify } from '@/table/shared/table-column.shared'
import { editableCellWrapper } from '@/table/shared/table-editable-cell.css'
import type {
  TableEditableCellNavigation,
  TableEditableCellNavigationOptions,
} from '@/table/shared/table-editable-cell.props'
import {
  deriveEditorFromRenderer,
  isTableCellEditable,
  resolveTableCellEditorConfig,
  shouldActivateTableCellEditorOnFocus,
} from '@/table/shared/table-editing'
import { flattenTableRows, groupTableRows, hasNestedTableRows, type TableShape } from '@/table/shared/table-grouping'
import { getTableRowIdFromKeyboardEvent, getTableRowKeyboardAction } from '@/table/shared/table-row-keyboard-actions'
import { normalizeEnumPropValue } from '@/theme/props/prop-def'
import { Table, type TableSize } from './Table'
import { tableWrapperEditableGrid } from './TableWrapper.css'
import { tablePropDefs } from './table.props'
import type {
  TableRenderCell,
  TableWrapperCellRenderer,
  TableWrapperCellValue,
  TableWrapperColumn,
  TableWrapperData,
  TableWrapperProps,
  TableWrapperRenderCell,
  TableWrapperRenderRow,
  TableWrapperRow,
  TableWrapperRowAction,
  TableWrapperRowActions,
} from './table-wrapper.props'

const EXPAND_BUTTON_WIDTH_REM = 1.75
const DEFAULT_TABLE_SHAPE: TableShape = 'flat'

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

function getTableWrapperColumnJustify(column: TableWrapperColumn) {
  if (column.align === 'left') return 'start'
  if (column.align === 'center') return 'center'
  if (column.align === 'right') return 'end'

  return getSharedTableColumnJustify({
    justify: typeof column.justify === 'string' ? column.justify : undefined,
    rowHeader: column.rowHeader,
    renderer: column.renderer,
  })
}

export function TableWrapper({
  data,
  onRowSelect,
  editable = true,
  defaultCellMode = READ_TABLE_CELL_MODE,
  cellMode,
  onCellModeChange,
  allowedCellModes,
  onCellEdit,
  rowActions,
  gridLines = false,
  renderCell,
  renderRow,
  expandAll = false,
  groupBy,
  defaultGroupBy = [],
  shape,
  defaultShape,
  meta,
  toolbarActions,
  totalRows,
  filteredRows,
  activeFilterCount,
  onReset,
  ...rootProps
}: TableWrapperProps) {
  'use no memo'
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [expanded, setExpanded] = React.useState<ExpandedState>({})
  const [uncontrolledGroupBy] = React.useState(() => [...defaultGroupBy])
  const [uncontrolledShape] = React.useState<TableShape | undefined>(defaultShape)
  const pendingRowFocusRef = React.useRef<PendingRowFocus | null>(null)
  const rowFocusRequestIdRef = React.useRef(0)
  const tableInstanceId = React.useId()
  const safeSize = (normalizeEnumPropValue(tablePropDefs.Root.size, rootProps.size) ??
    tablePropDefs.Root.size.default) as TableSize
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
  const resolvedToolbarActions = (
    <TableCellModeToolbarActions toggle={cellModeToggle}>{toolbarActions}</TableCellModeToolbarActions>
  )
  const resolvedGroupBy = groupBy ?? uncontrolledGroupBy
  const hasGroupedRows = resolvedGroupBy.length > 0
  const rowHeaderColumnId = React.useMemo(
    () => data.columns.find(column => column.rowHeader)?.id ?? data.columns[0]?.id,
    [data.columns],
  )
  const groupedRows = React.useMemo(() => {
    if (!hasGroupedRows) return data.rows

    return groupTableRows<TableWrapperRow>({
      rows: data.rows,
      groupBy: resolvedGroupBy,
      getValue: (row, columnId) => row.values[columnId],
      createGroupRow: ({ id, columnId, value, label, depth, path, rows }) => {
        const values: Record<string, TableWrapperCellValue> = {}
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
          subRows: [...rows],
        }
      },
    })
  }, [data.rows, hasGroupedRows, resolvedGroupBy, rowHeaderColumnId])
  const nestedGroupedRows = React.useMemo(() => hasNestedTableRows(groupedRows, row => row.subRows), [groupedRows])
  const resolvedShape: TableShape = shape ?? uncontrolledShape ?? (nestedGroupedRows ? 'tree' : DEFAULT_TABLE_SHAPE)
  const tableRows = React.useMemo(() => {
    if (resolvedShape === 'tree') return groupedRows

    return flattenTableRows({
      rows: groupedRows,
      getSubRows: row => row.subRows,
      clearSubRows: row => (row.subRows ? { ...row, subRows: undefined } : row),
    })
  }, [groupedRows, resolvedShape])
  const hasHierarchicalRows = React.useMemo(
    () => resolvedShape === 'tree' && hasNestedTableRows(tableRows, row => row.subRows),
    [resolvedShape, tableRows],
  )
  const hasRowActions = Boolean(rowActions?.onDuplicate || rowActions?.onRemove)

  React.useEffect(() => {
    if (!expandAll) {
      setExpanded({})
      return
    }

    const nextExpanded: Record<string, boolean> = {}
    const walk = (rows: TableWrapperRow[]) => {
      for (const row of rows) {
        if (row.subRows?.length) {
          nextExpanded[row.id] = true
          walk(row.subRows)
        }
      }
    }

    walk(tableRows)
    setExpanded(nextExpanded)
  }, [tableRows, expandAll])

  const renderSafeCell = React.useCallback(
    (
      row: TableWrapperRow,
      column: TableWrapperColumn,
      defaultCell: React.ReactElement,
      override?: TableWrapperRenderCell,
    ) => {
      const rendered = override?.(row, column, defaultCell) ?? defaultCell
      if (!React.isValidElement(rendered)) {
        return React.cloneElement(defaultCell, undefined, rendered)
      }
      const elementType = rendered.type
      const isTableCellLike =
        elementType === 'td' ||
        elementType === 'th' ||
        elementType === Table.Cell ||
        elementType === Table.RowHeaderCell
      return isTableCellLike ? rendered : React.cloneElement(defaultCell, undefined, rendered)
    },
    [],
  )

  const handleRowClick = React.useCallback(
    (event: React.MouseEvent<HTMLTableRowElement>, row: TableWrapperRow) => {
      if (!onRowSelect) return
      const target = event.target as Element | null
      if (target?.closest('a,button,input,select,textarea,[role="button"],[role="link"]')) return
      onRowSelect(row)
    },
    [onRowSelect],
  )

  const handleRowKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLTableRowElement>, row: TableWrapperRow) => {
      if (!onRowSelect) return
      if (event.key !== 'Enter' && event.key !== ' ') return
      const target = event.target as Element | null
      if (target?.closest('a,button,input,select,textarea,[role="button"],[role="link"]')) return
      event.preventDefault()
      onRowSelect(row)
    },
    [onRowSelect],
  )

  const getCellEditLabel = React.useCallback((column: TableWrapperColumn) => {
    if (typeof column.header === 'string') return `Edit ${column.header}`
    return `Edit ${column.id}`
  }, [])

  const columns = React.useMemo<ColumnDef<TableWrapperRow>[]>(
    () =>
      data.columns.map(column => ({
        id: column.id,
        header: () => column.header,
        accessorFn: (row: TableWrapperRow) => row.values[column.id],
        enableSorting: column.sortable ?? true,
        sortingFn: (left: { original: TableWrapperRow }, right: { original: TableWrapperRow }) => {
          return compareSharedTableCellValues({
            leftValue: left.original.values[column.id],
            rightValue: right.original.values[column.id],
            column,
          })
        },
        meta: column,
      })),
    [data.columns],
  )
  const columnById = React.useMemo(() => new Map(data.columns.map(column => [column.id, column])), [data.columns])

  const table = useReactTable({
    data: tableRows,
    columns,
    state: {
      sorting,
      expanded,
    },
    onSortingChange: setSorting,
    onExpandedChange: updater => {
      setExpanded(current => (typeof updater === 'function' ? updater(current) : updater))
    },
    getRowId: row => row.id,
    getSubRows: resolvedShape === 'tree' ? row => row.subRows : undefined,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  const getEditableCellReadViewId = React.useCallback(
    (rowId: string, columnId: string) => `${tableInstanceId}-editable-${rowId}-${columnId}`,
    [tableInstanceId],
  )

  const buildEditContext = React.useCallback((rowData: TableWrapperRow, column: TableWrapperColumn) => {
    return {
      row: rowData,
      rowId: rowData.id,
      columnId: column.id,
      value: rowData.values[column.id],
    }
  }, [])

  const tableRowModelRows = table.getRowModel().rows

  const editableCellTargets = React.useMemo<EditableCellTarget[]>(() => {
    if (!isTableEditable) return []
    const targets: EditableCellTarget[] = []

    for (const [rowIndex, row] of tableRowModelRows.entries()) {
      for (const [columnIndex, cell] of row.getVisibleCells().entries()) {
        const column = columnById.get(cell.column.id) ?? (cell.column.columnDef.meta as TableWrapperColumn)
        if (row.original.grouping?.kind === 'group') continue
        const context = buildEditContext(row.original, column)
        const editor =
          resolveTableCellEditorConfig(column.editor, context) ??
          deriveEditorFromRenderer<TableWrapperCellValue>(column.renderer)
        if (!isTableCellEditable({ editable: column.editable, editor, context })) continue

        targets.push({
          id: getEditableCellReadViewId(row.original.id, column.id),
          rowId: row.original.id,
          rowIndex,
          columnIndex,
          activateOnFocus: shouldActivateTableCellEditorOnFocus(editor),
        })
      }
    }

    return targets
  }, [isTableEditable, getEditableCellReadViewId, tableRowModelRows, buildEditContext, columnById])

  const cellNavigationTargets = React.useMemo<CellNavigationTarget[]>(() => {
    const targets: CellNavigationTarget[] = []

    for (const [rowIndex, row] of tableRowModelRows.entries()) {
      for (const [columnIndex, cell] of row.getVisibleCells().entries()) {
        targets.push({
          id: getEditableCellReadViewId(row.original.id, cell.column.id),
          rowId: row.original.id,
          rowIndex,
          columnIndex,
        })
      }
    }

    return targets
  }, [getEditableCellReadViewId, tableRowModelRows])

  const editableCellTargetsRef = React.useRef<EditableCellTarget[]>(editableCellTargets)
  const cellNavigationTargetsRef = React.useRef<CellNavigationTarget[]>(cellNavigationTargets)

  React.useLayoutEffect(() => {
    editableCellTargetsRef.current = editableCellTargets
  }, [editableCellTargets])

  React.useLayoutEffect(() => {
    cellNavigationTargetsRef.current = cellNavigationTargets
  }, [cellNavigationTargets])

  const focusEditableCell = React.useCallback((id: string, options?: TableEditableCellNavigationOptions) => {
    window.setTimeout(() => {
      const target = document.getElementById(id)
      target?.focus()
      if (options?.activate) {
        target?.click()
      }
    }, 0)
  }, [])

  const navigateEditableCell = React.useCallback(
    (
      currentId: string,
      direction: TableEditableCellNavigation,
      options?: TableEditableCellNavigationOptions,
    ): boolean => {
      const targets = editableCellTargetsRef.current
      const currentIndex = targets.findIndex(target => target.id === currentId)
      if (currentIndex < 0) return false

      if (direction === 'next' || direction === 'previous') {
        const offset = direction === 'next' ? 1 : -1
        const nextTarget = targets[currentIndex + offset]
        if (!nextTarget) return false
        if (!options?.probe) {
          focusEditableCell(nextTarget.id, {
            ...options,
            activate: options?.activate === true && nextTarget.activateOnFocus,
          })
        }
        return true
      }

      const currentTarget = targets[currentIndex]
      if (!currentTarget) return false

      const candidates = targets.filter(target => target.columnIndex === currentTarget.columnIndex)
      const currentColumnIndex = candidates.findIndex(target => target.id === currentId)
      const offset = direction === 'down' ? 1 : -1
      const nextTarget = candidates[currentColumnIndex + offset]
      if (!nextTarget) return false
      if (!options?.probe) {
        focusEditableCell(nextTarget.id, {
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
      const currentIndex = targets.findIndex(target => target.id === currentId)
      if (currentIndex < 0) return false

      if (direction === 'next' || direction === 'previous') {
        const offset = direction === 'next' ? 1 : -1
        const nextTarget = targets[currentIndex + offset]
        if (!nextTarget) return false
        if (!options?.probe) focusEditableCell(nextTarget.id, options)
        return true
      }

      const currentTarget = targets[currentIndex]
      if (!currentTarget) return false

      const candidates = targets.filter(target => target.columnIndex === currentTarget.columnIndex)
      const currentColumnIndex = candidates.findIndex(target => target.id === currentId)
      const offset = direction === 'down' ? 1 : -1
      const nextTarget = candidates[currentColumnIndex + offset]
      if (!nextTarget) return false
      if (!options?.probe) focusEditableCell(nextTarget.id, options)
      return true
    },
    [focusEditableCell],
  )

  const requestRowActionFocus = React.useCallback(
    (sourceRowId: string) => {
      const requestId = rowFocusRequestIdRef.current + 1
      rowFocusRequestIdRef.current = requestId
      pendingRowFocusRef.current = {
        beforeRowIds: new Set(tableRowModelRows.map(row => row.original.id)),
        requestId,
        sourceRowId,
      }
      return requestId
    },
    [tableRowModelRows],
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
      const row = rowId ? tableRowModelRows.find(item => item.original.id === rowId) : undefined
      if (!row || row.original.grouping?.kind === 'group') return

      const isSupportedAction =
        (action === 'duplicate' && Boolean(rowActions.onDuplicate)) ||
        (action === 'remove' && Boolean(rowActions.onRemove))
      if (!isSupportedAction) return

      event.preventDefault()
      event.stopPropagation()

      if (action === 'duplicate' && rowActions.onDuplicate) {
        if (!(rowActions.canDuplicate?.(row.original) ?? true)) return
        const focusRequestId = requestRowActionFocus(row.original.id)
        const result = rowActions.onDuplicate(row.original)
        clearPendingRowFocusOnActionSettled(focusRequestId, result, clearPendingRowFocusRequest)
        return
      }

      if (action === 'remove' && rowActions.onRemove) {
        if (!(rowActions.canRemove?.(row.original) ?? true)) return
        rowActions.onRemove(row.original)
      }
    },
    [clearPendingRowFocusRequest, requestRowActionFocus, rowActions, tableRowModelRows],
  )

  React.useLayoutEffect(() => {
    const pending = pendingRowFocusRef.current
    if (!pending || !onCellEdit) return

    const editableRowIds = new Set(editableCellTargets.map(target => target.rowId))
    const indexedRows = tableRowModelRows.map((row, rowIndex) => ({ row, rowIndex }))
    const addedRows = indexedRows.filter(({ row }) => !pending.beforeRowIds.has(row.original.id))
    if (addedRows.length === 0) return

    const editableAddedRows = addedRows.filter(({ row }) => editableRowIds.has(row.original.id))
    if (editableAddedRows.length === 0) {
      pendingRowFocusRef.current = null
      return
    }

    const sourceRowIndex = indexedRows.find(({ row }) => row.original.id === pending.sourceRowId)?.rowIndex ?? -1
    const targetRow =
      editableAddedRows.find(({ rowIndex }) => sourceRowIndex < 0 || rowIndex > sourceRowIndex) ?? editableAddedRows[0]
    const target = editableCellTargets
      .filter(cellTarget => cellTarget.rowId === targetRow?.row.original.id)
      .sort((left, right) => left.columnIndex - right.columnIndex)[0]

    pendingRowFocusRef.current = null
    if (!target) return
    focusEditableCell(target.id, { activate: target.activateOnFocus })
  }, [editableCellTargets, focusEditableCell, onCellEdit, tableRowModelRows])

  return (
    <div className="flex h-full w-full flex-col overflow-hidden" onKeyDownCapture={handleRowActionKeyboard}>
      <TableHeader
        meta={meta}
        actions={resolvedToolbarActions}
        totalRows={totalRows ?? data.rows.length}
        filteredRows={filteredRows ?? data.rows.length}
        activeFilterCount={activeFilterCount}
        onReset={onReset}
      />
      <Table.Root {...rootProps} className={cn(gridLines ? tableWrapperEditableGrid : null, rootProps.className)}>
        {data.caption ? <Table.Caption>{data.caption}</Table.Caption> : null}
        <Table.Header>
          {table.getHeaderGroups().map(headerGroup => (
            <Table.Row key={headerGroup.id}>
              {headerGroup.headers.map(header => {
                const column = header.column.columnDef.meta as TableWrapperColumn
                const toggleSortingHandler = header.column.getToggleSortingHandler()

                return (
                  <Table.ColumnHeaderCell
                    key={header.id}
                    justify={getTableWrapperColumnJustify(column)}
                    width={column.width}
                    minWidth={column.minWidth}
                    maxWidth={column.maxWidth}
                  >
                    <TableColumnHeaderContent
                      isPlaceholder={header.isPlaceholder}
                      sortable={header.column.getCanSort()}
                      sortDirection={header.column.getIsSorted()}
                      onSort={toggleSortingHandler}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </TableColumnHeaderContent>
                  </Table.ColumnHeaderCell>
                )
              })}
            </Table.Row>
          ))}
        </Table.Header>
        <Table.Body>
          {table.getRowModel().rows.map(row => {
            const rowData = row.original
            const defaultRow = (
              <Table.Row
                className={hasRowActions ? 'group/table-row' : undefined}
                align={rowData.align}
                data-state={rowData.selected ? 'selected' : undefined}
                data-table-row-id={rowData.id}
                aria-selected={rowData.selected || undefined}
                tabIndex={onRowSelect ? 0 : undefined}
                onClick={onRowSelect ? event => handleRowClick(event, rowData) : undefined}
                onKeyDown={onRowSelect ? event => handleRowKeyDown(event, rowData) : undefined}
              >
                {row.getVisibleCells().map((cell, cellIndex) => {
                  const column = cell.column.columnDef.meta as TableWrapperColumn
                  const cellValue = rowData.values[column.id]
                  const renderedValue = renderTableCellValue(cellValue, column.renderer, safeSize)
                  const editContext =
                    isTableEditable && rowData.grouping?.kind !== 'group' ? buildEditContext(rowData, column) : null
                  const resolvedEditor = editContext
                    ? resolveTableCellEditorConfig(column.editor, editContext)
                    : undefined
                  const effectiveEditor =
                    resolvedEditor ?? deriveEditorFromRenderer<TableWrapperCellValue>(column.renderer)
                  const isEditable =
                    editContext != null &&
                    isTableCellEditable({
                      editable: column.editable,
                      editor: effectiveEditor,
                      context: editContext,
                    })
                  const isFullCell = isFullCellRenderer(column.renderer)
                  const readViewId = getEditableCellReadViewId(rowData.id, column.id)
                  const isNavigable = true
                  const rowActionsElement =
                    hasRowActions && cellIndex === 0 && rowData.grouping?.kind !== 'group' ? (
                      <TableWrapperRowActionMenu
                        row={rowData}
                        rowActions={rowActions}
                        onDuplicateAction={() => requestRowActionFocus(rowData.id)}
                        onDuplicateSettled={clearPendingRowFocusRequest}
                      />
                    ) : null
                  const editableContent = (
                    <TableEditableCellContent
                      isEditable={isEditable}
                      context={editContext}
                      editor={effectiveEditor}
                      validateEdit={column.validateEdit}
                      onCommit={onCellEdit}
                      onNavigate={(direction, options) => navigateEditableCell(readViewId, direction, options)}
                      onReadNavigate={(direction, options) => navigateCell(readViewId, direction, options)}
                      ariaLabel={getCellEditLabel(column)}
                      readViewId={readViewId}
                      cellMode={tableCellMode.cellMode}
                      isNavigable={isNavigable}
                    >
                      {renderedValue}
                    </TableEditableCellContent>
                  )
                  const cellContent =
                    column.rowHeader && row.getCanExpand() ? (
                      <div className="flex items-center gap-2" style={{ paddingInlineStart: `${row.depth}rem` }}>
                        <IconButton
                          variant="ghost"
                          color="slate"
                          size="sm"
                          onClick={event => {
                            event.stopPropagation()
                            row.toggleExpanded()
                          }}
                          aria-label={row.getIsExpanded() ? `Collapse ${rowData.id}` : `Expand ${rowData.id}`}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          {row.getIsExpanded() ? (
                            <ChevronDown className="h-4 w-4" aria-hidden="true" />
                          ) : (
                            <ChevronRight className="h-4 w-4" aria-hidden="true" />
                          )}
                        </IconButton>
                        <span className="min-w-0 flex-1">{editableContent}</span>
                        {rowActionsElement}
                      </div>
                    ) : column.rowHeader ? (
                      rowActionsElement ? (
                        <div
                          className="flex items-center gap-2"
                          style={{
                            paddingInlineStart: `${
                              row.depth + (hasHierarchicalRows && !row.getCanExpand() ? EXPAND_BUTTON_WIDTH_REM : 0)
                            }rem`,
                          }}
                        >
                          <span className="min-w-0 flex-1">{editableContent}</span>
                          {rowActionsElement}
                        </div>
                      ) : (
                        <div
                          style={{
                            paddingInlineStart: `${
                              row.depth + (hasHierarchicalRows && !row.getCanExpand() ? EXPAND_BUTTON_WIDTH_REM : 0)
                            }rem`,
                          }}
                        >
                          {editableContent}
                        </div>
                      )
                    ) : rowActionsElement ? (
                      <div className="flex items-center gap-2">
                        <span className="min-w-0 flex-1">{editableContent}</span>
                        {rowActionsElement}
                      </div>
                    ) : (
                      editableContent
                    )
                  const fullCellProps = isFullCell
                    ? {
                        className: 'relative overflow-hidden',
                        style: { padding: 0 } as React.CSSProperties,
                      }
                    : undefined

                  const editableCellClass = isEditable || isNavigable ? editableCellWrapper : undefined
                  const defaultCell = column.rowHeader ? (
                    <Table.RowHeaderCell
                      key={column.id}
                      justify={getTableWrapperColumnJustify(column)}
                      width={column.width}
                      minWidth={column.minWidth}
                      maxWidth={column.maxWidth}
                      {...fullCellProps}
                      className={cn(editableCellClass, fullCellProps?.className)}
                    >
                      {cellContent}
                    </Table.RowHeaderCell>
                  ) : (
                    <Table.Cell
                      key={column.id}
                      justify={getTableWrapperColumnJustify(column)}
                      width={column.width}
                      minWidth={column.minWidth}
                      maxWidth={column.maxWidth}
                      {...fullCellProps}
                      className={cn(editableCellClass, fullCellProps?.className)}
                    >
                      {cellContent}
                    </Table.Cell>
                  )
                  const renderedCell = renderSafeCell(rowData, column, defaultCell, renderCell)
                  return <React.Fragment key={column.id}>{renderedCell}</React.Fragment>
                })}
              </Table.Row>
            )

            const rendered = renderRow?.(rowData, defaultRow) ?? defaultRow
            return <React.Fragment key={row.id}>{rendered}</React.Fragment>
          })}
        </Table.Body>
      </Table.Root>
    </div>
  )
}

export namespace TableWrapper {
  export type Column = TableWrapperColumn
  export type Data = TableWrapperData
  export type Props = TableWrapperProps
  export type RenderCell = TableWrapperRenderCell
  export type RenderRow = TableWrapperRenderRow
  export type Row = TableWrapperRow
  export type RowAction = TableWrapperRowAction
  export type RowActions = TableWrapperRowActions
  export type CellRenderer = TableWrapperCellRenderer
  export type CellValue = TableWrapperCellValue
}

export type { TableRenderCell }

function TableWrapperRowActionMenu({
  row,
  rowActions,
  onDuplicateAction,
  onDuplicateSettled,
}: {
  row: TableWrapperRow
  rowActions?: TableWrapperRowActions
  onDuplicateAction?: () => number
  onDuplicateSettled?: (requestId: number) => void
}) {
  if (!rowActions) return null

  const showDuplicate = Boolean(rowActions.onDuplicate && (rowActions.canDuplicate?.(row) ?? true))
  const showRemove = Boolean(rowActions.onRemove && (rowActions.canRemove?.(row) ?? true))
  const actionItems: Array<TableRowActionConfig<TableWrapperRowAction> | null> = [
    showDuplicate
      ? {
          value: 'duplicate',
          label: rowActions.labels?.duplicate,
          onAction: () => {
            const focusRequestId = onDuplicateAction?.()
            const result = rowActions.onDuplicate?.(row)
            clearPendingRowFocusOnActionSettled(focusRequestId, result, onDuplicateSettled ?? (() => undefined))
          },
        }
      : null,
    showRemove
      ? {
          value: 'remove',
          label: rowActions.labels?.remove,
          onAction: () => {
            rowActions.onRemove?.(row)
          },
        }
      : null,
  ]
  const actions = actionItems.filter((action): action is TableRowActionConfig<TableWrapperRowAction> => action != null)

  if (actions.length === 0) return null

  return <TableRowActions actions={actions} ariaLabel="Row actions" />
}
