import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ColorMatrixPicker } from './ColorMatrixPicker'

afterEach(() => {
  cleanup()
})

describe('ColorMatrixPicker', () => {
  it('commits a selected color only after the dropdown closes', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const onCommit = vi.fn()

    render(<ColorMatrixPicker value="var(--orange-3)" onChange={onChange} onCommit={onCommit} />)

    await user.click(screen.getByRole('button', { name: 'Color' }))
    await user.click(await screen.findByRole('radio', { name: 'red 5' }))

    expect(onChange).toHaveBeenCalledWith('var(--red-5)')
    expect(onCommit).not.toHaveBeenCalled()

    await user.keyboard('{Escape}')

    await waitFor(() => {
      expect(onCommit).toHaveBeenCalledWith('var(--red-5)')
    })
  })

  it('renders at most nine recent colors as a separate section', async () => {
    const user = userEvent.setup()
    const recentColors = Array.from({ length: 12 }, (_, index) => `#00000${index.toString(16)}`)

    render(<ColorMatrixPicker value="#000000" onChange={() => {}} recentColors={recentColors} />)

    await user.click(screen.getByRole('button', { name: 'Color' }))

    expect(await screen.findByText('Recent')).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: /Recent color/ })).toHaveLength(9)
  })

  it('renders preferred colors before recent colors when both are provided', async () => {
    const user = userEvent.setup()

    render(
      <ColorMatrixPicker
        value="#000000"
        onChange={() => {}}
        preferredColors={['#111111']}
        recentColors={['#222222']}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Color' }))

    const preferredLabel = await screen.findByText('Preferred')
    const recentLabel = screen.getByText('Recent')

    expect(preferredLabel).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Preferred color 1' })).toBeInTheDocument()
    expect(recentLabel).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Recent color 1' })).toBeInTheDocument()
    expect(preferredLabel.compareDocumentPosition(recentLabel) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })
})
