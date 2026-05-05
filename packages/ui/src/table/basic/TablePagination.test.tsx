import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { TablePagination } from './TablePagination'

afterEach(() => {
  cleanup()
})

describe('TablePagination', () => {
  it('renders icon-only boundary controls by default', () => {
    render(<TablePagination page={2} totalPages={5} onPageChange={vi.fn()} />)

    expect(screen.getByRole('button', { name: 'Previous page' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Next page' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'First page' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Last page' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Current page, page 2' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('button', { name: 'Current page, page 2' })).toHaveAttribute('data-pressed', '')
  })

  it('renders labeled prev/next controls when labels are provided', () => {
    render(<TablePagination page={2} totalPages={5} prevLabel="Previous" nextLabel="Next" onPageChange={vi.fn()} />)

    expect(screen.getByRole('button', { name: 'Previous' })).toHaveTextContent('Previous')
    expect(screen.getByRole('button', { name: 'Next' })).toHaveTextContent('Next')
  })

  it('uses provided labels as accessible names for internationalized controls', () => {
    render(<TablePagination page={2} totalPages={5} prevLabel="Zuruck" nextLabel="Weiter" onPageChange={vi.fn()} />)

    expect(screen.getByRole('button', { name: 'Zuruck' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Weiter' })).toBeInTheDocument()
  })

  it('calls onPageChange for number and boundary buttons', () => {
    const onPageChange = vi.fn()
    render(<TablePagination page={2} totalPages={5} onPageChange={onPageChange} />)

    fireEvent.click(screen.getByRole('button', { name: 'Go to page 4' }))
    fireEvent.click(screen.getByRole('button', { name: 'Next page' }))

    expect(onPageChange).toHaveBeenNthCalledWith(1, 4)
    expect(onPageChange).toHaveBeenNthCalledWith(2, 3)
  })

  it('navigates to first and last page with boundary buttons', () => {
    const onPageChange = vi.fn()
    render(<TablePagination page={3} totalPages={10} onPageChange={onPageChange} />)

    fireEvent.click(screen.getByRole('button', { name: 'First page' }))
    expect(onPageChange).toHaveBeenCalledWith(1)

    fireEvent.click(screen.getByRole('button', { name: 'Last page' }))
    expect(onPageChange).toHaveBeenCalledWith(10)
  })

  it('renders ellipsis for larger page counts', () => {
    render(<TablePagination page={8} totalPages={18} onPageChange={vi.fn()} />)

    expect(screen.getAllByText('...')).toHaveLength(2)
  })

  it('disables previous/first buttons on first page', () => {
    render(<TablePagination page={1} totalPages={5} onPageChange={vi.fn()} />)

    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'First page' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Next page' })).not.toBeDisabled()
    expect(screen.getByRole('button', { name: 'Last page' })).not.toBeDisabled()
  })

  it('disables next/last buttons on last page', () => {
    render(<TablePagination page={5} totalPages={5} onPageChange={vi.fn()} />)

    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Last page' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Previous page' })).not.toBeDisabled()
    expect(screen.getByRole('button', { name: 'First page' })).not.toBeDisabled()
  })

  it('hides boundary buttons when showBoundary is false', () => {
    render(<TablePagination page={2} totalPages={5} showBoundary={false} onPageChange={vi.fn()} />)

    expect(screen.queryByRole('button', { name: 'First page' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Last page' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Next page' })).toBeInTheDocument()
  })

  it('clamps to a single disabled page when totalPages is 1', () => {
    render(<TablePagination page={1} totalPages={1} onPageChange={vi.fn()} />)

    expect(screen.getByRole('button', { name: 'Current page, page 1' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'First page' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Last page' })).toBeDisabled()
  })

  it('clamps negative and zero page values to page 1', () => {
    const { rerender } = render(<TablePagination page={0} totalPages={5} onPageChange={vi.fn()} />)

    expect(screen.getByRole('button', { name: 'Current page, page 1' })).toHaveAttribute('aria-current', 'page')

    rerender(<TablePagination page={-1} totalPages={5} onPageChange={vi.fn()} />)

    expect(screen.getByRole('button', { name: 'Current page, page 1' })).toHaveAttribute('aria-current', 'page')
  })

  it('clamps zero totalPages to a single disabled page', () => {
    render(<TablePagination page={3} totalPages={0} onPageChange={vi.fn()} />)

    expect(screen.getByRole('button', { name: 'Current page, page 1' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled()
  })

  it('normalizes siblingCount to a non-negative integer', () => {
    const { rerender } = render(<TablePagination page={5} totalPages={10} siblingCount={-2} onPageChange={vi.fn()} />)

    expect(screen.getAllByText('...')).toHaveLength(2)

    rerender(<TablePagination page={5} totalPages={10} siblingCount={1.8} onPageChange={vi.fn()} />)

    expect(screen.getAllByText('...')).toHaveLength(2)
  })
})
