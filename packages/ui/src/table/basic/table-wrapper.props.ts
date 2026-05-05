import type * as React from 'react'
import type {
  SharedTableColumnMeta,
  TableAvatarCellValue,
  TableAvatarGroupCellValue,
  TableCellEditability,
  TableCellEditCommitHandler,
  TableCellEditor,
  TableCellEditValidator,
  TableCellModeProps,
  TableCellRender,
  TableCellRenderer,
  TableCellValue,
  TableCheckboxCellValue,
  TableGroupRowMetadata,
  TableLabelCellValue,
  TablePriorityCellValue,
  TableShape,
  TableSparklineCellValue,
  TableStatusCellValue,
  TableTimelineCellValue,
} from '@/table/shared'
import type { TableRootProps } from './Table'
import type { TableOwnProps as TablePropDefs } from './table.props'
export type TableWrapperCellRenderer = TableCellRenderer
export type TableWrapperLabelCellValue = TableLabelCellValue
export type TableWrapperAvatarCellValue = TableAvatarCellValue
export type TableWrapperAvatarGroupCellValue = TableAvatarGroupCellValue
export type TableWrapperCheckboxCellValue = TableCheckboxCellValue
export type TableWrapperTimelineCellValue = TableTimelineCellValue
export type TableWrapperSparklineCellValue = TableSparklineCellValue
export type TableWrapperPriorityCellValue = TablePriorityCellValue
export type TableWrapperStatusCellValue = TableStatusCellValue
export type TableWrapperCellValue = TableCellValue
export type TableRenderCell = TableCellRender

export type TableWrapperColumn = SharedTableColumnMeta<
  TableWrapperRow,
  TableWrapperCellValue,
  TablePropDefs['Cell']['justify']
> & {
  id: string
  header: React.ReactNode
  align?: 'left' | 'center' | 'right'
  justify?: TablePropDefs['Cell']['justify']
  width?: TablePropDefs['Cell']['width']
  minWidth?: TablePropDefs['Cell']['minWidth']
  maxWidth?: TablePropDefs['Cell']['maxWidth']
  editor?: TableCellEditor<TableWrapperCellValue>
  editable?: TableCellEditability<TableWrapperRow, TableWrapperCellValue>
  validateEdit?: TableCellEditValidator<TableWrapperRow, TableWrapperCellValue>
}

export type TableWrapperRow = {
  id: string
  values: Record<string, TableWrapperCellValue>
  align?: TablePropDefs['Row']['align']
  selected?: boolean
  grouping?: TableGroupRowMetadata
  subRows?: TableWrapperRow[]
}

export type TableWrapperData = {
  caption?: React.ReactNode
  columns: TableWrapperColumn[]
  rows: TableWrapperRow[]
}

export type TableWrapperRenderCell = (
  row: TableWrapperRow,
  column: TableWrapperColumn,
  defaultRender: React.ReactNode,
) => React.ReactNode

export type TableWrapperRenderRow = (row: TableWrapperRow, defaultRender: React.ReactNode) => React.ReactNode

export type TableWrapperRowAction = 'duplicate' | 'remove'

export type TableWrapperRowActionLabels = Partial<Record<TableWrapperRowAction, string>>

export type TableWrapperRowActions = {
  onDuplicate?: (row: TableWrapperRow) => void | Promise<void>
  onRemove?: (row: TableWrapperRow) => void
  canDuplicate?: (row: TableWrapperRow) => boolean
  canRemove?: (row: TableWrapperRow) => boolean
  labels?: TableWrapperRowActionLabels
}

export type TableWrapperProps = Omit<TableRootProps, 'children'> &
  TableCellModeProps & {
    data: TableWrapperData
    onRowSelect?: (row: TableWrapperRow) => void
    onCellEdit?: TableCellEditCommitHandler<TableWrapperRow, TableWrapperCellValue>
    rowActions?: TableWrapperRowActions
    gridLines?: boolean
    renderCell?: TableWrapperRenderCell
    renderRow?: TableWrapperRenderRow
    expandAll?: boolean
    groupBy?: readonly string[]
    defaultGroupBy?: readonly string[]
    shape?: TableShape
    defaultShape?: TableShape
    meta?: React.ReactNode
    toolbarActions?: React.ReactNode
    totalRows?: number
    filteredRows?: number
    activeFilterCount?: number
    onReset?: () => void
  }
