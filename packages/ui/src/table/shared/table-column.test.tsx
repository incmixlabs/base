import '@testing-library/jest-dom/vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { TableColumnHeaderContent } from './table-column'

afterEach(() => cleanup())

describe('TableColumnHeaderContent', () => {
  it('renders nothing for placeholder headers', () => {
    render(<TableColumnHeaderContent isPlaceholder>Service</TableColumnHeaderContent>)

    expect(screen.queryByText('Service')).not.toBeInTheDocument()
  })

  it('renders plain content when sorting is unavailable', () => {
    render(<TableColumnHeaderContent sortDirection={false}>Service</TableColumnHeaderContent>)

    expect(screen.getByText('Service')).toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('renders sortable content through the shared sort button', () => {
    const onSort = vi.fn()

    render(
      <TableColumnHeaderContent sortable sortDirection="asc" onSort={onSort}>
        Service
      </TableColumnHeaderContent>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Service' }))

    expect(onSort).toHaveBeenCalledTimes(1)
  })
})
