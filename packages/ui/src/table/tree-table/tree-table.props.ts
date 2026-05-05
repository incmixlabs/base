import type { ColumnDef, ExpandedState, SortingState } from '@tanstack/react-table'
import type * as React from 'react'
import { type TableSize, type TableVariant, tablePropDefs } from '@/table/basic/table.props'
import type { SharedTableColumnMeta } from '@/table/shared'
import type { TableCellModeProps } from '@/table/shared/table-editable-cell.props'
import type { TableCellEditCommitHandler } from '@/table/shared/table-editing'
import { colorPropDef } from '@/theme/props/color.prop'
import type { PropDef } from '@/theme/props/prop-def'
import type { Color } from '@/theme/tokens'

export type TreeTableColumnMeta<TData = unknown, TValue = unknown> = SharedTableColumnMeta<TData, TValue> & {
  align?: 'left' | 'center' | 'right'
  verticalAlign?: 'start' | 'center' | 'end'
}

export type TreeTableColumnDef<TData, TValue = unknown> = ColumnDef<TData, TValue> & {
  meta?: TreeTableColumnMeta<TData, TValue>
}

export type TreeTableRowAction =
  | 'add-child'
  | 'add-sibling'
  | 'move-up'
  | 'move-down'
  | 'indent'
  | 'outdent'
  | 'duplicate'
  | 'remove'

export type TreeTableRowActionLabels = Partial<Record<TreeTableRowAction, string>>

export type TreeTableRootProps<TData> = TableCellModeProps & {
  columns: TreeTableColumnDef<TData>[]
  data: TData[]

  getRowId: (row: TData) => string
  getSubRows: (row: TData) => TData[] | undefined

  defaultSorting?: SortingState
  defaultExpanded?: ExpandedState

  isLoading?: boolean

  size?: TableSize
  variant?: TableVariant
  color?: Color

  indentWidth?: number

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

  children?: React.ReactNode
}

export type TreeTableToolbarProps = {
  count?: number
  meta?: React.ReactNode
  actions?: React.ReactNode
}

export type TreeTableContentProps = {
  className?: string
  estimateRowHeight?: number
  minBodyHeight?: number
  maxBodyHeight?: number
}

const treeTableRootPropDefs = {
  columns: {
    type: 'string',
    required: true,
  },
  data: {
    type: 'string',
    required: true,
  },
  getRowId: {
    type: 'callback',
    typeFullName: '(row: TData) => string',
    required: true,
  },
  getSubRows: {
    type: 'callback',
    typeFullName: '(row: TData) => TData[] | undefined',
    required: true,
  },
  defaultSorting: {
    type: 'string',
  },
  defaultExpanded: {
    type: 'boolean',
    default: true,
  },
  isLoading: {
    type: 'boolean',
    default: false,
  },
  size: tablePropDefs.Root.size,
  variant: tablePropDefs.Root.variant,
  color: {
    ...colorPropDef.color,
    default: 'neutral',
  },
  indentWidth: {
    type: 'number',
    default: 24,
  },
  editable: {
    type: 'boolean',
    default: true,
  },
  defaultCellMode: {
    type: 'enum',
    values: ['read', 'edit'],
    default: 'read',
  },
  cellMode: {
    type: 'enum',
    values: ['read', 'edit'],
  },
  allowedCellModes: {
    type: 'object',
    typeFullName: "readonly ('read' | 'edit')[]",
  },
  onCellModeChange: {
    type: 'callback',
    typeFullName: "(mode: 'read' | 'edit') => void",
  },
  onCellEdit: {
    type: 'callback',
    typeFullName: 'TableCellEditCommitHandler<TData>',
  },
  onAddChild: {
    type: 'callback',
    typeFullName: '(parentRow: TData) => void | Promise<void>',
  },
  onAddSibling: {
    type: 'callback',
    typeFullName: '(row: TData) => void',
  },
  onIndent: {
    type: 'callback',
    typeFullName: '(row: TData) => void',
  },
  onOutdent: {
    type: 'callback',
    typeFullName: '(row: TData) => void',
  },
  onMoveUp: {
    type: 'callback',
    typeFullName: '(row: TData) => void',
  },
  onMoveDown: {
    type: 'callback',
    typeFullName: '(row: TData) => void',
  },
  onRemove: {
    type: 'callback',
    typeFullName: '(row: TData) => void',
  },
  onDuplicate: {
    type: 'callback',
    typeFullName: '(row: TData) => void | Promise<void>',
  },
  canAddChild: {
    type: 'callback',
    typeFullName: '(row: TData) => boolean',
  },
  canAddSibling: {
    type: 'callback',
    typeFullName: '(row: TData) => boolean',
  },
  canIndent: {
    type: 'callback',
    typeFullName: '(row: TData) => boolean',
  },
  canOutdent: {
    type: 'callback',
    typeFullName: '(row: TData) => boolean',
  },
  canMoveUp: {
    type: 'callback',
    typeFullName: '(row: TData) => boolean',
  },
  canMoveDown: {
    type: 'callback',
    typeFullName: '(row: TData) => boolean',
  },
  canRemove: {
    type: 'callback',
    typeFullName: '(row: TData) => boolean',
  },
  canDuplicate: {
    type: 'callback',
    typeFullName: '(row: TData) => boolean',
  },
  rowActionLabels: {
    type: 'object',
    typeFullName: 'Partial<Record<TreeTableRowAction, string>>',
  },
  children: {
    type: 'ReactNode',
  },
} satisfies Record<string, PropDef>

const treeTableToolbarPropDefs = {
  count: {
    type: 'number',
  },
  meta: {
    type: 'ReactNode',
  },
  actions: {
    type: 'ReactNode',
  },
} satisfies Record<string, PropDef>

const treeTableContentPropDefs = {
  className: {
    type: 'string',
  },
  estimateRowHeight: {
    type: 'number',
  },
  minBodyHeight: {
    type: 'number',
  },
  maxBodyHeight: {
    type: 'number',
  },
} satisfies Record<string, PropDef>

export const treeTablePropDefs = {
  Root: treeTableRootPropDefs,
  Toolbar: treeTableToolbarPropDefs,
  Content: treeTableContentPropDefs,
} as const

export namespace TreeTableProps {
  export type Root<TData> = TreeTableRootProps<TData>
  export type Toolbar = TreeTableToolbarProps
  export type Content = TreeTableContentProps
}
