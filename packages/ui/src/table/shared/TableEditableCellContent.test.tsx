import '@testing-library/jest-dom/vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { TableEditableCellContent } from './TableEditableCellContent'

afterEach(() => cleanup())

type TestRow = {
  id: string
  name: string
}

const context = {
  row: { id: 'row-1', name: 'Premium support' },
  rowId: 'row-1',
  columnId: 'name',
  value: 'Premium support',
}

describe('TableEditableCellContent', () => {
  it('renders children directly when the cell is not editable', () => {
    render(
      <TableEditableCellContent<TestRow>
        isEditable={false}
        context={context}
        editor={{ type: 'text' }}
        readViewId="cell-row-1-name"
      >
        Premium support
      </TableEditableCellContent>,
    )

    expect(screen.getByText('Premium support')).toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('wraps children with the editable read view when editing is enabled', () => {
    render(
      <TableEditableCellContent<TestRow>
        isEditable
        context={context}
        editor={{ type: 'text' }}
        readViewId="cell-row-1-name"
        ariaLabel="Edit Service"
      >
        Premium support
      </TableEditableCellContent>,
    )

    expect(screen.getByRole('button', { name: 'Edit Service' })).toHaveAttribute('id', 'cell-row-1-name')
  })

  it('keeps editable behavior when readViewId is omitted', () => {
    render(
      <TableEditableCellContent<TestRow>
        isEditable
        context={context}
        editor={{ type: 'text' }}
        ariaLabel="Edit Service"
      >
        Premium support
      </TableEditableCellContent>,
    )

    expect(screen.getByRole('button', { name: 'Edit Service' })).toBeInTheDocument()
  })

  it('renders focusable read content when navigation is enabled without editability', () => {
    const onReadNavigate = vi.fn(() => true)

    render(
      <TableEditableCellContent<TestRow>
        isEditable={false}
        context={null}
        readViewId="cell-row-1-name"
        isNavigable
        onReadNavigate={onReadNavigate}
        ariaLabel="Read Service"
      >
        Premium support
      </TableEditableCellContent>,
    )

    const cell = screen.getByRole('gridcell', { name: 'Read Service' })
    cell.focus()
    fireEvent.keyDown(cell, { key: 'ArrowRight' })

    expect(cell).toHaveAttribute('id', 'cell-row-1-name')
    expect(onReadNavigate).toHaveBeenCalledWith('next', { probe: true })
    expect(onReadNavigate).toHaveBeenCalledWith('next')
  })
})
