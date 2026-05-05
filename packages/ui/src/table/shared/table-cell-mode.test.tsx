import '@testing-library/jest-dom/vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { normalizeAllowedTableCellModes, resolveTableCellMode, TableCellModeToggle } from './table-cell-mode'

describe('table cell mode helpers', () => {
  afterEach(() => cleanup())

  it('normalizes allowed cell modes with fallback coverage', () => {
    expect(normalizeAllowedTableCellModes(['edit', 'edit'], 'read')).toEqual(['edit'])
    expect(normalizeAllowedTableCellModes([], 'read')).toEqual(['read'])
  })

  it('forces read mode when table editing is disabled', () => {
    expect(resolveTableCellMode({ editable: false, requestedMode: 'edit', allowedModes: ['edit'] })).toBe('read')
  })

  it('emits the selected mode from the shared toggle', () => {
    const onCellModeChange = vi.fn()

    render(
      <TableCellModeToggle cellMode="read" allowedCellModes={['read', 'edit']} onCellModeChange={onCellModeChange} />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Edit mode' }))

    expect(onCellModeChange).toHaveBeenCalledWith('edit')
  })
})
