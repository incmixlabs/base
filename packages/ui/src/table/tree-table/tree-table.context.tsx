'use client'

import type { ExpandedState, Table as TanStackTable } from '@tanstack/react-table'
import * as React from 'react'
import type { TableSize, TableVariant } from '@/table/basic/Table'
import type { TableCellMode } from '@/table/shared/table-editable-cell.props'
import type { TableCellEditCommitHandler } from '@/table/shared/table-editing'
import type { Color } from '@/theme/tokens'
import type { TreeTableRowActionLabels } from './tree-table.props'

export type TreeTablePendingRowFocusAction = 'add-child' | 'duplicate'

export type TreeTablePendingRowFocus = {
  action: TreeTablePendingRowFocusAction
  beforeRowIds: Set<string>
  requestId: number
  sourceRowId: string
}

export interface TreeTableContextValue<TData = unknown> {
  table: TanStackTable<TData>
  expanded: ExpandedState
  size: TableSize
  variant: TableVariant
  color: Color
  isLoading?: boolean
  indentWidth: number
  cellMode: TableCellMode
  cellModeToggle?: React.ReactNode
  onCellEdit?: TableCellEditCommitHandler<TData>
  onAddChild?: (parentRow: TData) => void | Promise<void>
  onAddSibling?: (row: TData) => void
  onIndent?: (row: TData) => void
  onOutdent?: (row: TData) => void
  onMoveUp?: (row: TData) => void
  onMoveDown?: (row: TData) => void
  onRemove?: (row: TData) => void
  onDuplicate?: (row: TData) => void | Promise<void>
  canAddChild?: (row: TData) => boolean
  canAddSibling?: (row: TData) => boolean
  canIndent?: (row: TData) => boolean
  canOutdent?: (row: TData) => boolean
  canMoveUp?: (row: TData) => boolean
  canMoveDown?: (row: TData) => boolean
  canRemove?: (row: TData) => boolean
  canDuplicate?: (row: TData) => boolean
  rowActionLabels?: TreeTableRowActionLabels
  pendingRowFocusRef: React.MutableRefObject<TreeTablePendingRowFocus | null>
  requestRowActionFocus: (action: TreeTablePendingRowFocusAction, sourceRowId: string) => number
  clearPendingRowFocusRequest: (requestId: number) => void
}

const TreeTableContext = React.createContext<TreeTableContextValue | null>(null)

export function TreeTableProvider<TData>({
  value,
  children,
}: {
  value: TreeTableContextValue<TData>
  children: React.ReactNode
}) {
  return <TreeTableContext.Provider value={value as TreeTableContextValue}>{children}</TreeTableContext.Provider>
}

export function useTreeTable<TData = unknown>() {
  const context = React.useContext(TreeTableContext)
  if (!context) throw new Error('useTreeTable must be used within TreeTable.Root')
  return context as TreeTableContextValue<TData>
}
