'use client'

import type * as React from 'react'
import { TableEditableCell } from './TableEditableCell'
import type {
  TableCellMode,
  TableEditableCellNavigation,
  TableEditableCellNavigationOptions,
} from './table-editable-cell.props'
import type {
  TableCellEditCommitHandler,
  TableCellEditContext,
  TableCellEditor,
  TableCellEditValidator,
} from './table-editing'

export interface TableEditableCellContentProps<TRow, TValue = unknown> {
  isEditable: boolean
  context: TableCellEditContext<TRow, TValue> | null
  editor?: TableCellEditor<TValue>
  validateEdit?: TableCellEditValidator<TRow, TValue>
  onCommit?: TableCellEditCommitHandler<TRow, TValue>
  onNavigate?: (direction: TableEditableCellNavigation, options?: TableEditableCellNavigationOptions) => boolean
  onReadNavigate?: (direction: TableEditableCellNavigation, options?: TableEditableCellNavigationOptions) => boolean
  ariaLabel?: string
  readViewId?: string
  cellMode?: TableCellMode
  isNavigable?: boolean
  children: React.ReactNode
}

export function TableEditableCellContent<TRow, TValue = unknown>({
  isEditable,
  context,
  editor,
  validateEdit,
  onCommit,
  onNavigate,
  onReadNavigate,
  ariaLabel,
  readViewId,
  cellMode,
  isNavigable,
  children,
}: TableEditableCellContentProps<TRow, TValue>) {
  if (!isEditable || !context) {
    if (!isNavigable || !readViewId || !onReadNavigate) return <>{children}</>

    return (
      <TableEditableCell.ReadView
        id={readViewId}
        ariaLabel={ariaLabel}
        onNavigate={onReadNavigate}
        className="cursor-default"
      >
        {children}
      </TableEditableCell.ReadView>
    )
  }

  return (
    <TableEditableCell.Root
      context={context}
      editor={editor}
      validateEdit={validateEdit}
      onCommit={onCommit}
      onNavigate={onNavigate}
      onReadNavigate={onReadNavigate}
      ariaLabel={ariaLabel}
      readViewId={readViewId}
      cellMode={cellMode}
    >
      {children}
    </TableEditableCell.Root>
  )
}
