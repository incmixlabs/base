import '@testing-library/jest-dom/vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { AccordionSchemaWrapper } from './AccordionSchemaWrapper'

describe('AccordionSchemaWrapper', () => {
  afterEach(() => cleanup())

  const schema = {
    items: [
      {
        value: 'item-a',
        title: 'Item A',
        content: 'Content A',
        meta: [{ id: 'm1', label: 'Status', value: 'Ready' }],
        actions: [{ id: 'a1', label: 'Open' }],
        open: true,
      },
      {
        value: 'item-b',
        title: 'Item B',
        content: 'Content B',
      },
    ],
  }

  it('renders schema title/description and item content', () => {
    render(<AccordionSchemaWrapper schema={{ ...schema, title: 'FAQ', description: 'desc' }} />)
    expect(screen.getByText('FAQ')).toBeInTheDocument()
    expect(screen.getByText('desc')).toBeInTheDocument()
    expect(screen.getByText('Content A')).toBeInTheDocument()
    expect(screen.getByText('Status')).toBeInTheDocument()
  })

  it('calls onActionSelect when action button clicked', () => {
    const onActionSelect = vi.fn()
    render(<AccordionSchemaWrapper schema={schema} onActionSelect={onActionSelect} />)
    fireEvent.click(screen.getByRole('button', { name: 'Open' }))
    expect(onActionSelect).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'a1' }),
      expect.objectContaining({ value: 'item-a' }),
    )
  })

  it('throws on duplicate item values', () => {
    expect(() =>
      render(
        <AccordionSchemaWrapper
          schema={{
            items: [
              { value: 'dup', title: 'One', content: 'A' },
              { value: 'dup', title: 'Two', content: 'B' },
            ],
          }}
        />,
      ),
    ).toThrow('AccordionSchemaWrapper item values must be unique')
  })
})
