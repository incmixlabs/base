import type * as React from 'react'
import type {
  TableCellEditCommitHandler,
  TableCellEditContext,
  TableCellEditor,
  TableCellEditValidator,
} from './table-editing'

export type TableEditableCellNavigation = 'next' | 'previous' | 'up' | 'down'
export type TableCellMode = 'read' | 'edit'
export type TableCellModeChangeHandler = (mode: TableCellMode) => void

export type TableCellModeProps = {
  editable?: boolean
  defaultCellMode?: TableCellMode
  cellMode?: TableCellMode
  onCellModeChange?: TableCellModeChangeHandler
  allowedCellModes?: readonly TableCellMode[]
}

export type TableEditableCellNavigationOptions = {
  activate?: boolean
  probe?: boolean
}

export type TableEditableCellProps<TRow, TValue = unknown> = {
  context: TableCellEditContext<TRow, TValue>
  editor?: TableCellEditor<TValue>
  validateEdit?: TableCellEditValidator<TRow, TValue>
  onCommit?: TableCellEditCommitHandler<TRow, TValue>
  onNavigate?: (direction: TableEditableCellNavigation, options?: TableEditableCellNavigationOptions) => boolean
  onReadNavigate?: (direction: TableEditableCellNavigation, options?: TableEditableCellNavigationOptions) => boolean
  children: React.ReactNode
  ariaLabel?: string
  readViewId?: string
  cellMode?: TableCellMode
}
