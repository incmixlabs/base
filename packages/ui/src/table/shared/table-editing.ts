import type * as React from 'react'
import type { IconProps } from '@/elements'
import type { TableCellRenderer } from './table-cell.props'
import { getRendererEditorOptions } from './table-cell-renderers'

export type TableCellEditorOption<TValue = string> = {
  avatar?: { src?: string; name?: string }
  color?: IconProps['color']
  data?: unknown
  icon?: string
  iconColor?: IconProps['color']
  iconProps?: Record<string, unknown>
  label: React.ReactNode
  value: TValue
  variant?: 'solid' | 'soft' | 'surface' | 'outline'
}

export type TableCellEditor<TValue = unknown> =
  | {
      type: 'text'
      placeholder?: string
    }
  | {
      type: 'number'
      min?: number
      max?: number
      step?: number
      default?: number
      decimal?: number
      pattern?: string
      formatter?: (value: number) => string
    }
  | {
      type: 'select'
      options: Array<TableCellEditorOption<TValue>>
    }
  | {
      type: 'checkbox'
    }
  | {
      type: 'multi-select'
      options: Array<TableCellEditorOption<TValue>>
    }
  | {
      type: 'readonly'
    }

export type TableCellEditContext<TRow, TValue = unknown> = {
  row: TRow
  rowId: string
  columnId: string
  value: TValue
}

export type TableCellEditorResolver<TRow, TValue = unknown> = (
  context: TableCellEditContext<TRow, TValue>,
) => TableCellEditor<TValue> | undefined

export type TableCellEditability<TRow, TValue = unknown> =
  | boolean
  | ((context: TableCellEditContext<TRow, TValue>) => boolean)

export type TableCellEditValidator<TRow, TValue = unknown> = (
  context: TableCellEditContext<TRow, TValue>,
) => string | undefined

export type TableCellEditCommitContext<TRow, TValue = unknown> = TableCellEditContext<TRow, TValue> & {
  previousValue: TValue
}

export type TableCellEditCommitHandler<TRow, TValue = unknown> = (
  context: TableCellEditCommitContext<TRow, TValue>,
) => void

export type TableEditableColumnMeta<TRow, TValue = unknown> = {
  editable?: TableCellEditability<TRow, TValue>
  editor?: TableCellEditor<TValue> | TableCellEditorResolver<TRow, TValue>
  validateEdit?: TableCellEditValidator<TRow, TValue>
}

export function resolveTableCellEditorConfig<TRow, TValue = unknown>(
  editor: TableEditableColumnMeta<TRow, TValue>['editor'],
  context: TableCellEditContext<TRow, TValue>,
): TableCellEditor<TValue> | undefined {
  return typeof editor === 'function' ? editor(context) : editor
}

export function getDefaultTableCellEditor<TValue = unknown>(value: TValue): TableCellEditor<TValue> {
  if (typeof value === 'number') return { type: 'number' }
  if (typeof value === 'boolean') return { type: 'checkbox' }
  return { type: 'text' }
}

export function resolveTableCellEditor<TValue = unknown>(
  editor: TableCellEditor<TValue> | undefined,
  value: TValue,
): TableCellEditor<TValue> {
  return editor ?? getDefaultTableCellEditor(value)
}

export function isTableCellEditable<TRow, TValue = unknown>({
  editable,
  editor,
  context,
}: {
  editable?: TableCellEditability<TRow, TValue>
  editor?: TableEditableColumnMeta<TRow, TValue>['editor']
  context: TableCellEditContext<TRow, TValue>
}): boolean {
  const resolvedEditor = resolveTableCellEditorConfig(editor, context)
  if (resolvedEditor?.type === 'readonly') return false
  if (typeof editable === 'function') return editable(context)
  if (typeof editable === 'boolean') return editable
  return Boolean(resolvedEditor)
}

export function shouldActivateTableCellEditorOnFocus(editor?: TableCellEditor): boolean {
  return editor?.type === 'text' || editor?.type === 'number'
}

export function validateTableCellEdit<TRow, TValue = unknown>({
  validate,
  editor,
  context,
}: {
  validate?: TableCellEditValidator<TRow, TValue>
  editor?: TableCellEditor<TValue>
  context: TableCellEditContext<TRow, TValue>
}): string | undefined {
  if (editor?.type === 'number') {
    const num = Number(context.value)
    if (Number.isNaN(num)) return 'Must be a number'
    if (editor.min != null && num < editor.min) return `Must be at least ${editor.min}`
    if (editor.max != null && num > editor.max) return `Must be at most ${editor.max}`
  }
  return validate?.(context)
}

export function deriveEditorFromRenderer<TValue = unknown>(
  renderer?: TableCellRenderer,
): TableCellEditor<TValue> | undefined {
  if (!renderer) return undefined

  if (renderer.type === 'checkbox') {
    return { type: 'checkbox' } as TableCellEditor<TValue>
  }

  const options = getRendererEditorOptions(renderer)
  if (options?.length) {
    const mappedOptions = options.map(o => ({
      value: o.value as TValue,
      label: o.label,
      avatar: o.avatar,
      data: o.data,
      icon: o.icon,
      iconColor: o.iconColor,
      iconProps: o.iconProps,
      color: o.color,
      variant: o.variant,
    }))

    if (renderer.type === 'avatar-group') {
      return { type: 'multi-select', options: mappedOptions } as TableCellEditor<TValue>
    }

    return { type: 'select', options: mappedOptions } as TableCellEditor<TValue>
  }

  return undefined
}
