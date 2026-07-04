import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { AvatarPicker } from './AvatarPicker'
import { expectClassTokens, splitClassNames } from './test-utils'
import { highlightColorStyles, solidTextColorStyles } from './textFieldStyles'

afterEach(() => {
  cleanup()
})

describe('AvatarPicker', () => {
  it('shows identity details for selected single avatars when hover cards are enabled', async () => {
    const user = userEvent.setup()

    render(
      <AvatarPicker
        items={[
          { id: 'john', name: 'John Doe', description: 'john@example.com' },
          { id: 'jane', name: 'Jane Smith', description: 'jane@example.com' },
        ]}
        value="john"
        showHoverCard
      />,
    )

    await user.hover(screen.getByText('JD'))

    const hoverCard = await screen.findByRole('dialog')
    expect(hoverCard).toHaveTextContent('John Doe')
    expect(hoverCard).toHaveTextContent('john@example.com')
  })

  it('uses item hover card metadata', async () => {
    const user = userEvent.setup()

    render(
      <AvatarPicker
        items={[
          {
            id: 'john',
            name: 'John Doe',
            email: 'john@example.com',
            presence: 'online',
          },
        ]}
        value="john"
      />,
    )

    await user.hover(screen.getByText('JD'))

    const hoverCard = await screen.findByRole('dialog')
    expect(hoverCard).toHaveTextContent('John Doe')
    expect(hoverCard).toHaveTextContent('john@example.com')
    expect(within(hoverCard).getByRole('img', { name: 'Online' })).toBeInTheDocument()
  })

  it('preserves per-item hover card overrides for selected avatars in multi-select mode', async () => {
    const user = userEvent.setup()

    render(
      <AvatarPicker
        multiple
        value={['john']}
        items={[
          {
            id: 'john',
            name: 'John Doe',
            email: 'john@example.com',
            hoverCard: { title: 'Primary reviewer', presence: 'online' },
          },
        ]}
        showHoverCard
      />,
    )

    await user.hover(screen.getByText('JD'))

    const hoverCard = await screen.findByRole('dialog')
    expect(hoverCard).toHaveTextContent('Primary reviewer')
    expect(within(hoverCard).getByRole('img', { name: 'Online' })).toBeInTheDocument()
  })

  it('shows all selected identities from the trigger avatar group when hover cards are enabled', async () => {
    const user = userEvent.setup()

    render(
      <AvatarPicker
        multiple
        value={['john', 'jane', 'omar']}
        items={[
          { id: 'john', name: 'John Doe', description: 'john@example.com' },
          { id: 'jane', name: 'Jane Smith', description: 'jane@example.com' },
          { id: 'omar', name: 'Omar Bell', description: 'omar@example.com' },
        ]}
        showHoverCard
      />,
    )

    await user.hover(screen.getByText('JD'))

    const hoverCard = await screen.findByRole('dialog')
    expect(hoverCard).toHaveTextContent('People')
    expect(hoverCard).toHaveTextContent('John Doe')
    expect(hoverCard).toHaveTextContent('Jane Smith')
    expect(hoverCard).toHaveTextContent('Omar Bell')
  })

  it('renders configurable multi-select footer actions', async () => {
    const user = userEvent.setup()
    const onApply = vi.fn()
    const onCancel = vi.fn()

    render(
      <AvatarPicker
        multiple
        value={['john']}
        items={[
          { id: 'john', name: 'John Doe' },
          { id: 'jane', name: 'Jane Smith' },
        ]}
        onApply={onApply}
        onCancel={onCancel}
        applyLabel="Save"
        cancelLabel="Cancel"
        allowEmptyApply
      />,
    )

    const getPickerTrigger = () => {
      const trigger = screen.getAllByRole('button', { name: /John Doe/i })[0]
      expect(trigger).toBeInTheDocument()
      return trigger as HTMLElement
    }

    await user.click(getPickerTrigger())

    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(onCancel).toHaveBeenCalledTimes(1)

    await user.click(getPickerTrigger())
    await user.click(screen.getByRole('button', { name: 'Save' }))
    expect(onApply).toHaveBeenCalledTimes(1)
  })

  it('uses semantic lane classes for highlighted options and selected indicators', async () => {
    const user = userEvent.setup()

    render(
      <AvatarPicker
        value="john"
        highlightColor="success"
        items={[
          { id: 'john', name: 'John Doe' },
          { id: 'jane', name: 'Jane Smith' },
        ]}
      />,
    )

    await user.click(screen.getByRole('button', { name: /John Doe/i }))

    const selectedOption = await screen.findByRole('option', { name: /John Doe/i })
    const selectedIndicator = selectedOption.querySelector('svg')

    expectClassTokens(selectedOption.className, splitClassNames(highlightColorStyles.success))
    expect(selectedIndicator).not.toBeNull()
    expectClassTokens(selectedIndicator?.getAttribute('class') ?? undefined, [solidTextColorStyles.success])
    expect(selectedOption.className).not.toContain('form-color')
    expect(selectedIndicator?.getAttribute('class')).not.toContain('form-color')
  })
})
