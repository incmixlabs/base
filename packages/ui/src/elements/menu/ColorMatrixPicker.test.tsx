import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { HUE_NAMES, HUE_STEPS } from '@/theme/tokens'
import { COLOR_MATRIX_ROW_LENGTH, ColorMatrixPicker } from './ColorMatrixPicker'

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
    const recentColors = Array.from(
      { length: COLOR_MATRIX_ROW_LENGTH + 3 },
      (_, index) => `#00000${index.toString(16)}`,
    )

    render(<ColorMatrixPicker value="#000000" onChange={() => {}} recentColors={recentColors} />)

    await user.click(screen.getByRole('button', { name: 'Color' }))

    expect(await screen.findByText('Recent')).toBeInTheDocument()
    expect(screen.getAllByRole('radio', { name: /Recent color/ })).toHaveLength(COLOR_MATRIX_ROW_LENGTH)
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
    const preferredSwatch = screen.getByRole('radio', { name: /Preferred color 1/ })
    const recentSwatch = screen.getByRole('radio', { name: /Recent color 1/ })

    expect(preferredLabel).toBeInTheDocument()
    expect(preferredSwatch).toHaveAttribute('aria-checked', 'false')
    expect(recentLabel).toBeInTheDocument()
    expect(recentSwatch).toHaveAttribute('aria-checked', 'false')
    expect(preferredLabel.compareDocumentPosition(recentLabel) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })

  it('supports keyboard navigation across preferred, recent, and matrix swatches', async () => {
    const user = userEvent.setup()
    const firstMatrixStep = HUE_STEPS.find(step => {
      const numericStep = Number(step)
      return Number.isInteger(numericStep) && numericStep >= 3 && numericStep <= 11
    })

    render(
      <ColorMatrixPicker
        value="#111111"
        onChange={() => {}}
        preferredColors={['#111111']}
        recentColors={['#222222']}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Color' }))

    const preferredSwatch = await screen.findByRole('radio', { name: /Preferred color 1/ })
    const recentSwatch = screen.getByRole('radio', { name: /Recent color 1/ })
    const firstMatrixSwatch = screen.getByRole('radio', { name: `${HUE_NAMES[0]} ${firstMatrixStep}` })

    expect(preferredSwatch).toHaveAttribute('aria-checked', 'true')

    preferredSwatch.focus()
    expect(preferredSwatch).toHaveFocus()

    await user.keyboard('{ArrowDown}')
    expect(recentSwatch).toHaveFocus()

    await user.keyboard('{ArrowDown}')
    expect(firstMatrixSwatch).toHaveFocus()

    await user.keyboard('{ArrowUp}')
    expect(recentSwatch).toHaveFocus()
  })
})
