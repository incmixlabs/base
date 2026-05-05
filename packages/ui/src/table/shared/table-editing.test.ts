import { describe, expect, it } from 'vitest'
import type { TableCellEditor } from './table-editing'
import {
  getDefaultTableCellEditor,
  isTableCellEditable,
  resolveTableCellEditor,
  validateTableCellEdit,
} from './table-editing'

type Row = {
  id: string
  values: {
    name: string
    quantity: number
    active: boolean
  }
}

const row: Row = {
  id: 'row-1',
  values: {
    name: 'Camera',
    quantity: 2,
    active: true,
  },
}

describe('shared table editing model', () => {
  it('selects a default editor from the value type', () => {
    expect(getDefaultTableCellEditor('Camera')).toEqual({ type: 'text' })
    expect(getDefaultTableCellEditor(2)).toEqual({ type: 'number' })
    expect(getDefaultTableCellEditor(true)).toEqual({ type: 'checkbox' })
  })

  it('prefers explicit editor metadata over value-derived defaults', () => {
    expect(
      resolveTableCellEditor({ type: 'select', options: [{ label: 'Camera', value: 'camera' }] }, 'Camera'),
    ).toEqual({
      type: 'select',
      options: [{ label: 'Camera', value: 'camera' }],
    })
  })

  it('preserves non-string select option values', () => {
    const editor: TableCellEditor<number> = {
      type: 'select',
      options: [{ label: 'Two', value: 2 }],
    }

    expect(resolveTableCellEditor(editor, 2)).toEqual(editor)
  })

  it('resolves editability from static and contextual metadata', () => {
    const context = { row, rowId: row.id, columnId: 'quantity', value: row.values.quantity }

    expect(isTableCellEditable({ editor: { type: 'number' }, context })).toBe(true)
    expect(isTableCellEditable({ editable: false, editor: { type: 'number' }, context })).toBe(false)
    expect(isTableCellEditable({ editable: () => true, editor: { type: 'readonly' }, context })).toBe(false)
    expect(
      isTableCellEditable({
        editable: input => input.row.values.active,
        context,
      }),
    ).toBe(true)
  })

  it('runs edit validation with the shared context shape', () => {
    const message = validateTableCellEdit({
      context: { row, rowId: row.id, columnId: 'quantity', value: 0 },
      validate: input => (input.value > 0 ? undefined : 'Quantity must be positive'),
    })

    expect(message).toBe('Quantity must be positive')
  })
})
