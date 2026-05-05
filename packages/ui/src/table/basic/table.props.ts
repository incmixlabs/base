import type * as React from 'react'
import { paddingPropDefs } from '@/theme/props/padding.props'
import type { GetPropDefTypes, PropDef } from '@/theme/props/prop-def'
import { sizesXsToLg, variantsSurfaceGhost } from '@/theme/props/scales'
import { widthPropDefs } from '@/theme/props/width.props'

const sizes = sizesXsToLg
const variants = variantsSurfaceGhost
const layoutValues = ['auto', 'fixed'] as const
const rowAlign = ['start', 'center', 'end', 'baseline'] as const
const justifyValues = ['start', 'center', 'end'] as const

export type TableSize = (typeof sizes)[number]
export type TableVariant = (typeof variants)[number]
export type TableLayout = (typeof layoutValues)[number]
export type TableRowAlign = (typeof rowAlign)[number]
export type TableCellJustify = (typeof justifyValues)[number]

const tableRootPropDefs = {
  size: {
    type: 'enum',
    values: sizes,
    default: 'sm',
    responsive: true,
  },
  variant: {
    type: 'enum',
    values: variants,
    default: 'ghost',
  },
  layout: {
    type: 'enum',
    values: layoutValues,
    default: 'auto',
    responsive: true,
  },
  striped: {
    type: 'boolean',
    default: false,
  },
  compact: {
    type: 'boolean',
    default: false,
  },
} satisfies {
  size: PropDef<(typeof sizes)[number]>
  variant: PropDef<(typeof variants)[number]>
  layout: PropDef<(typeof layoutValues)[number]>
  striped: PropDef<boolean>
  compact: PropDef<boolean>
}

const tableRowPropDefs = {
  align: {
    type: 'enum',
    values: rowAlign,
    responsive: true,
  },
} satisfies {
  align: PropDef<(typeof rowAlign)[number]>
}

const tableCellPropDefs = {
  justify: {
    type: 'enum',
    values: justifyValues,
    responsive: true,
  },
  ...widthPropDefs,
  ...paddingPropDefs,
} satisfies Record<string, PropDef>

type TableRootOwnProps = GetPropDefTypes<typeof tableRootPropDefs>
type TableRowOwnProps = GetPropDefTypes<typeof tableRowPropDefs>
type TableCellOwnProps = GetPropDefTypes<typeof tableCellPropDefs>
type TableOwnProps = {
  Root: TableRootOwnProps
  Row: TableRowOwnProps
  Cell: TableCellOwnProps
}

export type TableRootProps = React.TableHTMLAttributes<HTMLTableElement> & TableRootOwnProps
export interface TableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {}
export interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {}
export interface TableFooterProps extends React.HTMLAttributes<HTMLTableSectionElement> {}
export type TableRowProps = React.HTMLAttributes<HTMLTableRowElement> & TableRowOwnProps
export type TableHeadProps = Omit<React.ThHTMLAttributes<HTMLTableCellElement>, 'width'> & TableCellOwnProps
export type TableCellProps = Omit<React.TdHTMLAttributes<HTMLTableCellElement>, 'width'> & TableCellOwnProps
export interface TableCaptionProps extends React.HTMLAttributes<HTMLTableCaptionElement> {}
export type TableRowHeaderCellProps = Omit<React.ThHTMLAttributes<HTMLTableCellElement>, 'width'> & TableCellOwnProps
export type TableColumnHeaderCellProps = Omit<React.ThHTMLAttributes<HTMLTableCellElement>, 'width'> & TableCellOwnProps

export type TableComponentProps = {
  Root: TableProps.Root
  Header: TableProps.Header
  Body: TableProps.Body
  Footer: TableProps.Footer
  Row: TableProps.Row
  Head: TableProps.Head
  Cell: TableProps.Cell
  Caption: TableProps.Caption
  RowHeaderCell: TableProps.RowHeaderCell
  ColumnHeaderCell: TableProps.ColumnHeaderCell
}

export namespace TableProps {
  export type Root = TableRootProps
  export type Header = TableHeaderProps
  export type Body = TableBodyProps
  export type Footer = TableFooterProps
  export type Row = TableRowProps
  export type Head = TableHeadProps
  export type Cell = TableCellProps
  export type Caption = TableCaptionProps
  export type RowHeaderCell = TableRowHeaderCellProps
  export type ColumnHeaderCell = TableColumnHeaderCellProps
  export type Component = TableComponentProps
  export type Own = TableOwnProps
  export type Size = TableSize
  export type Variant = TableVariant
  export type Layout = TableLayout
  export type RowAlign = TableRowAlign
  export type CellJustify = TableCellJustify
}

const tablePropDefs = {
  Root: tableRootPropDefs,
  Row: tableRowPropDefs,
  Cell: tableCellPropDefs,
} as const

export type { TableOwnProps }
export { sizes as tableSizes, tablePropDefs, variants as tableVariants }
