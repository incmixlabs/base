import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { CreditCardInput } from './CreditCardInput'
import { textFieldColorVariants, textFieldSizeVariants } from './text-field.css'

const surfaceClass = (className: string) => className.split(' ')[0]

afterEach(() => {
  cleanup()
})

describe('CreditCardInput', () => {
  it('renders accessible TextField controls for each credit card field', () => {
    render(<CreditCardInput showName />)

    expect(screen.getByRole('textbox', { name: 'Card number' })).toHaveAttribute('autocomplete', 'cc-number')
    expect(screen.getByRole('textbox', { name: 'MM/YY' })).toHaveAttribute('autocomplete', 'cc-exp')
    expect(screen.getByRole('textbox', { name: 'CVV' })).toHaveAttribute('autocomplete', 'cc-csc')
    expect(screen.getByRole('textbox', { name: 'Name on card' })).toHaveAttribute('autocomplete', 'cc-name')
  })

  it('uses TextField size and variant classes', () => {
    render(<CreditCardInput size="lg" variant="soft" />)

    const input = screen.getByRole('textbox', { name: 'Card number' })
    expect(input.closest('div')).toHaveClass(textFieldSizeVariants.lg)
    expect(input).toHaveClass(surfaceClass(textFieldColorVariants.slate.soft))
  })

  it('applies disabled and error state to all card fields', () => {
    render(<CreditCardInput disabled error showName />)

    for (const input of screen.getAllByRole('textbox')) {
      expect(input).toBeDisabled()
      expect(input).toHaveAttribute('aria-invalid', 'true')
      expect(input).toHaveClass(surfaceClass(textFieldColorVariants.error.outline))
    }
  })

  it('keeps formatting and card type detection when TextField handles the input surface', () => {
    const handleChange = vi.fn()
    render(<CreditCardInput onChange={handleChange} />)

    fireEvent.change(screen.getByRole('textbox', { name: 'Card number' }), {
      target: { value: '4111111111111111' },
    })

    expect(screen.getByRole('textbox', { name: 'Card number' })).toHaveValue('4111 1111 1111 1111')
    expect(handleChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        number: '4111 1111 1111 1111',
        rawNumber: '4111111111111111',
        cardType: 'visa',
      }),
    )
  })
})
