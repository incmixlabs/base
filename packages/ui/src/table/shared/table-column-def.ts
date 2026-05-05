import type { ColumnDef as TanStackColumnDef } from '@tanstack/react-table'
import type * as React from 'react'
import type { TableCellRenderer } from './table-cell.props'
import type { SharedTableColumnJustify, SharedTableColumnMeta } from './table-column.shared'
import type {
  TableCellEditability,
  TableCellEditContext,
  TableCellEditor,
  TableCellEditorResolver,
  TableCellEditValidator,
} from './table-editing'

export type TableColumnAlign = 'left' | 'center' | 'right'
export type TableColumnVerticalAlign = 'start' | 'center' | 'end'

export type TableCellFormat<TRow = unknown, TValue = unknown> = {
  renderer?: TableCellRenderer
  align?: TableColumnAlign
  verticalAlign?: TableColumnVerticalAlign
  fullCell?: boolean
  hoverCard?: (value: TValue, row: TRow) => React.ReactNode
  detail?: (value: TValue, row: TRow) => React.ReactNode
}

export type TableColumnDef<TRow, TValue = unknown, TMeta extends Record<string, unknown> = Record<string, unknown>> = {
  id: string
  header?: React.ReactNode
  accessorKey?: Extract<keyof TRow, string>
  accessor?: (row: TRow) => TValue
  width?: number | string
  minWidth?: number | string
  maxWidth?: number | string
  sortable?: boolean
  resizable?: boolean
  rowHeader?: boolean
  format?: TableCellFormat<TRow, TValue>
  editable?: TableCellEditability<TRow, TValue>
  readOnly?: boolean
  editor?: TableCellEditor<TValue> | TableCellEditorResolver<TRow, TValue>
  validateEdit?: TableCellEditValidator<TRow, TValue>
  meta?: TMeta
}

export type TableColumnRuntimeMeta<TRow = unknown, TValue = unknown> = SharedTableColumnMeta<TRow, TValue> & {
  align?: TableColumnAlign
  verticalAlign?: TableColumnVerticalAlign
  fullCell?: boolean
  hoverCard?: (value: TValue, row: TRow) => React.ReactNode
  detail?: (value: TValue, row: TRow) => React.ReactNode
}

export type FlatTableColumnDef<
  TRow,
  TValue = unknown,
  TMeta extends Record<string, unknown> = Record<string, unknown>,
> = TableColumnRuntimeMeta<TRow, TValue> &
  TMeta & {
    id: string
    header?: React.ReactNode
    width?: number | string
    minWidth?: number | string
    maxWidth?: number | string
  }

export type TanStackTableColumnDef<
  TRow,
  TValue = unknown,
  TMeta extends Record<string, unknown> = Record<string, unknown>,
> = TanStackColumnDef<TRow, TValue> & {
  meta?: TableColumnRuntimeMeta<TRow, TValue> & TMeta
}

function numericSize(value: number | string | undefined): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined
}

function getTanStackColumnHeader(header: React.ReactNode) {
  return typeof header === 'string' ? header : () => header
}

export function mapTableColumnAlignToJustify(
  align: TableColumnAlign | undefined,
): SharedTableColumnJustify | undefined {
  if (align === 'left') return 'start'
  if (align === 'right') return 'end'
  return align
}

export function getTableColumnEditability<TRow, TValue>(
  column: Pick<TableColumnDef<TRow, TValue>, 'editable' | 'readOnly'>,
): TableCellEditability<TRow, TValue> | undefined {
  return column.readOnly ? false : column.editable
}

export function getTableColumnRuntimeMeta<
  TRow,
  TValue = unknown,
  TMeta extends Record<string, unknown> = Record<string, unknown>,
>(column: TableColumnDef<TRow, TValue, TMeta>): TableColumnRuntimeMeta<TRow, TValue> & TMeta {
  const format = column.format

  return {
    ...(column.meta as TMeta | undefined),
    id: column.id,
    header: column.header,
    rowHeader: column.rowHeader,
    sortable: column.sortable,
    renderer: format?.renderer,
    justify: mapTableColumnAlignToJustify(format?.align),
    align: format?.align,
    verticalAlign: format?.verticalAlign,
    fullCell: format?.fullCell,
    hoverCard: format?.hoverCard,
    detail: format?.detail,
    editable: getTableColumnEditability(column),
    editor: column.readOnly ? { type: 'readonly' } : column.editor,
    validateEdit: column.validateEdit,
  } as TableColumnRuntimeMeta<TRow, TValue> & TMeta
}

export function toFlatTableColumnDef<
  TRow,
  TValue = unknown,
  TMeta extends Record<string, unknown> = Record<string, unknown>,
>(column: TableColumnDef<TRow, TValue, TMeta>): FlatTableColumnDef<TRow, TValue, TMeta> {
  return {
    ...getTableColumnRuntimeMeta(column),
    id: column.id,
    header: column.header,
    width: column.width,
    minWidth: column.minWidth,
    maxWidth: column.maxWidth,
  }
}

export function toFlatTableColumnDefs<
  TRow,
  TValue = unknown,
  TMeta extends Record<string, unknown> = Record<string, unknown>,
>(columns: readonly TableColumnDef<TRow, TValue, TMeta>[]): FlatTableColumnDef<TRow, TValue, TMeta>[] {
  return columns.map(column => toFlatTableColumnDef(column))
}

export function toTanStackTableColumnDef<
  TRow,
  TValue = unknown,
  TMeta extends Record<string, unknown> = Record<string, unknown>,
>(column: TableColumnDef<TRow, TValue, TMeta>): TanStackTableColumnDef<TRow, TValue, TMeta> {
  const tanstackColumn: TanStackColumnDef<TRow, TValue> = {
    id: column.id,
    header: getTanStackColumnHeader(column.header),
    enableSorting: column.sortable,
    enableResizing: column.resizable,
    size: numericSize(column.width),
    minSize: numericSize(column.minWidth),
    maxSize: numericSize(column.maxWidth),
    meta: getTableColumnRuntimeMeta(column),
  }

  if (column.accessor) {
    return {
      ...tanstackColumn,
      accessorFn: column.accessor,
    } as TanStackTableColumnDef<TRow, TValue, TMeta>
  }

  return {
    ...tanstackColumn,
    accessorKey: column.accessorKey ?? column.id,
  } as TanStackTableColumnDef<TRow, TValue, TMeta>
}

export function toTanStackTableColumnDefs<
  TRow,
  TValue = unknown,
  TMeta extends Record<string, unknown> = Record<string, unknown>,
>(columns: readonly TableColumnDef<TRow, TValue, TMeta>[]): TanStackTableColumnDef<TRow, TValue, TMeta>[] {
  return columns.map(column => toTanStackTableColumnDef(column))
}

export type TableColumnEditContext<TRow, TValue = unknown> = TableCellEditContext<TRow, TValue>
