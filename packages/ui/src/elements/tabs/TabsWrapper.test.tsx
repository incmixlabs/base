import '@testing-library/jest-dom/vitest'
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { TabsWrapper } from './TabsWrapper'

describe('TabsWrapper', () => {
  afterEach(() => cleanup())

  const data = [
    { value: 'overview', label: 'Overview', content: 'Overview content', active: true },
    { value: 'activity', label: 'Activity', content: 'Activity content' },
  ]

  it('renders tab triggers and content from data', () => {
    render(<TabsWrapper data={data} />)
    expect(screen.getByRole('tab', { name: 'Overview' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Activity' })).toBeInTheDocument()
    expect(screen.getByText('Overview content')).toBeInTheDocument()
  })

  it('calls onTabChange with selected item', () => {
    const onTabChange = vi.fn()
    render(<TabsWrapper data={data} onTabChange={onTabChange} />)
    fireEvent.click(screen.getByRole('tab', { name: 'Activity' }))
    expect(onTabChange).toHaveBeenCalledWith(expect.objectContaining({ value: 'activity' }), 'activity')
  })

  it('throws on duplicate values', () => {
    expect(() =>
      render(
        <TabsWrapper
          data={[
            { value: 'dup', label: 'One', content: 'A' },
            { value: 'dup', label: 'Two', content: 'B' },
          ]}
        />,
      ),
    ).toThrow('TabsWrapper data values must be unique')
  })

  it('passes icon configuration through to the underlying tabs root', async () => {
    render(<TabsWrapper data={data} icons={{ position: 'left', icons: [{ value: 'overview', icon: 'phone' }] }} />)

    const trigger = screen.getByRole('tab', { name: 'Overview' })

    await waitFor(() => {
      expect(trigger.querySelector('svg')).toBeInTheDocument()
    })
  })
})
