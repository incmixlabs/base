import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { ScrollAreaWrapper } from './ScrollAreaWrapper'

describe('ScrollAreaWrapper', () => {
  afterEach(() => cleanup())

  it('renders structured items from data', () => {
    render(
      <ScrollAreaWrapper
        className="h-64"
        data={[
          {
            id: 'alpha',
            title: 'Primary region',
            description: 'Wrapper title and description',
            content: 'Wrapper body content',
            trailing: 'Now',
          },
        ]}
      />,
    )

    expect(screen.getByText('Primary region')).toBeInTheDocument()
    expect(screen.getByText('Wrapper title and description')).toBeInTheDocument()
    expect(screen.getByText('Wrapper body content')).toBeInTheDocument()
    expect(screen.getByText('Now')).toBeInTheDocument()
  })

  it('supports renderItem overrides', () => {
    render(
      <ScrollAreaWrapper
        className="h-64"
        data={[
          {
            id: 'beta',
            title: 'Original title',
            content: 'Original content',
          },
        ]}
        renderItem={(item, defaults) =>
          item.id === 'beta'
            ? {
                title: <span data-testid="custom-title">Custom title</span>,
                content: <div data-testid="custom-content">Custom content</div>,
              }
            : defaults
        }
      />,
    )

    expect(screen.getByTestId('custom-title')).toHaveTextContent('Custom title')
    expect(screen.getByTestId('custom-content')).toHaveTextContent('Custom content')
  })

  it('allows renderItem to suppress default slots', () => {
    render(
      <ScrollAreaWrapper
        className="h-64"
        data={[
          {
            id: 'gamma',
            title: 'Hidden title',
            content: 'Hidden content',
          },
        ]}
        renderItem={() => ({
          title: null,
          content: null,
        })}
      />,
    )

    expect(screen.queryByText('Hidden title')).not.toBeInTheDocument()
    expect(screen.queryByText('Hidden content')).not.toBeInTheDocument()
  })
})
