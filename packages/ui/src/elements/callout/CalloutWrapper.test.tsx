import '@testing-library/jest-dom/vitest'
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { CalloutWrapper } from './CalloutWrapper'

describe('CalloutWrapper', () => {
  afterEach(() => cleanup())

  it('renders title, message, and actions from data', async () => {
    render(
      <CalloutWrapper
        data={{
          title: 'Storage warning',
          message: 'You are close to your quota.',
          icon: 'alert-triangle',
          actions: [{ id: 'upgrade', label: 'Upgrade' }],
        }}
      />,
    )

    expect(screen.getByText('Storage warning')).toBeInTheDocument()
    expect(screen.getByText('You are close to your quota.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Upgrade' })).toBeInTheDocument()
    await waitFor(() => {
      expect(document.querySelector('[data-slot="callout-icon"] svg')).not.toBeNull()
    })
  })

  it('calls onActionSelect and action.onSelect when an action is clicked', () => {
    const onActionSelect = vi.fn()
    const onSelect = vi.fn()

    render(
      <CalloutWrapper
        onActionSelect={onActionSelect}
        data={{
          message: 'Sync failed.',
          actions: [{ id: 'retry', label: 'Retry', onSelect }],
        }}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Retry' }))

    expect(onSelect).toHaveBeenCalledTimes(1)
    expect(onActionSelect).toHaveBeenCalledWith(expect.objectContaining({ id: 'retry' }))
  })

  it('supports renderAction overrides', () => {
    render(
      <CalloutWrapper
        data={{
          message: 'Deployment queued.',
          actions: [{ id: 'view', label: 'View logs' }],
        }}
        renderAction={(action, defaultRender) =>
          action.id === 'view' ? <span data-testid="custom-action">Custom view logs</span> : defaultRender
        }
      />,
    )

    expect(screen.getByTestId('custom-action')).toHaveTextContent('Custom view logs')
  })
})
