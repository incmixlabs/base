import '@testing-library/jest-dom/vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { type TableRowActionConfig, TableRowActions } from './TableRowActions'

describe('TableRowActions', () => {
  afterEach(() => cleanup())

  it('renders command actions with labels and click isolation', () => {
    const onDuplicate = vi.fn()
    const onRemove = vi.fn()
    const onParentClick = vi.fn()
    const actions: TableRowActionConfig[] = [
      { value: 'duplicate', onAction: onDuplicate },
      { value: 'remove', label: 'Delete row', onAction: onRemove },
    ]

    render(
      <div role="presentation" onClick={onParentClick}>
        Row
        <TableRowActions actions={actions} />
      </div>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Duplicate row' }))
    fireEvent.click(screen.getByRole('button', { name: 'Delete row' }))

    expect(onDuplicate).toHaveBeenCalledTimes(1)
    expect(onRemove).toHaveBeenCalledTimes(1)
    expect(onParentClick).not.toHaveBeenCalled()
    expect(screen.queryByRole('button', { name: 'Indent' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Add child' })).not.toBeInTheDocument()
  })
})
