import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { NumberInput } from './NumberInput'

afterEach(() => {
  cleanup()
})

describe('NumberInput', () => {
  it('increments and decrements with the button variant', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()

    render(<NumberInput label="Guests" defaultValue={2} min={1} max={4} onValueChange={onValueChange} />)

    await user.click(screen.getByRole('button', { name: /increase guests/i }))
    await user.click(screen.getByRole('button', { name: /decrease guests/i }))

    expect(onValueChange).toHaveBeenNthCalledWith(1, 3)
    expect(onValueChange).toHaveBeenNthCalledWith(2, 2)
  })

  it('decrements from an empty value using max as the starting boundary', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()

    render(<NumberInput label="Count" max={100} onValueChange={onValueChange} />)

    await user.click(screen.getByRole('button', { name: /decrease count/i }))

    expect(onValueChange).toHaveBeenCalledWith(100)
    expect(screen.getByDisplayValue('100')).toBeInTheDocument()
  })

  it('increments from an empty value to min when step is greater than one', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()

    render(<NumberInput label="Count" min={5} step={2} onValueChange={onValueChange} />)

    await user.click(screen.getByRole('button', { name: /increase count/i }))

    expect(onValueChange).toHaveBeenCalledWith(5)
    expect(screen.getByDisplayValue('5')).toBeInTheDocument()
  })

  it('renders stacked icon controls inside the input for icon variant', () => {
    render(<NumberInput variant="icon" label="Quantity" defaultValue={3} />)

    expect(screen.getByRole('button', { name: /increase quantity/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /decrease quantity/i })).toBeInTheDocument()
  })

  it('normalizes typed values against min and max on blur', async () => {
    const user = userEvent.setup()

    render(<NumberInput label="Seats" defaultValue={2} min={1} max={5} allowDecimal={false} />)

    const input = screen.getByRole('textbox')
    await user.clear(input)
    await user.type(input, '8')
    await user.tab()

    expect(screen.getByDisplayValue('5')).toBeInTheDocument()
  })

  it('does not apply a native title when iconButton title is used for tooltip content', () => {
    render(<NumberInput label="Count" defaultValue={2} iconButton={{ title: 'Adjust count' }} />)

    expect(screen.getByRole('button', { name: /decrease count/i })).not.toHaveAttribute('title')
    expect(screen.getByRole('button', { name: /increase count/i })).not.toHaveAttribute('title')
  })

  it('defaults control button variant to soft', () => {
    render(<NumberInput label="Count" defaultValue={2} />)

    const buttons = screen.getAllByRole('button')
    for (const button of buttons) {
      expect(button.className).toContain('_soft')
    }
  })
})
