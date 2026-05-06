import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { surfaceColorVariants } from '@/elements/surface/surface.css'
import { CreditCardInput } from './CreditCardInput'
import { textFieldSizeVariants } from './text-field.css'

afterEach(() => {
  cleanup()
})

describe('CreditCardInput', () => {
  it('renders accessible TextField controls for each credit card field', () => {
    render(<CreditCardInput showName />)

    expect(screen.getByRole('textbox', { name: 'Card number' })).toHaveAttribute('autocomplete', 'cc-number')
    expect(screen.getByRole('textbox', { name: 'Expiration date' })).toHaveAttribute('autocomplete', 'cc-exp')
    expect(screen.getByRole('textbox', { name: 'Security code' })).toHaveAttribute('autocomplete', 'cc-csc')
    expect(screen.getByRole('textbox', { name: 'Name on card' })).toHaveAttribute('autocomplete', 'cc-name')
  })

  it('keeps accessible field names independent from custom placeholder examples', () => {
    render(
      <CreditCardInput
        showName
        numberPlaceholder="1234 5678 9012 3456"
        expiryPlaceholder="01/30"
        cvvPlaceholder="123"
        namePlaceholder="JOHN DOE"
      />,
    )

    expect(screen.getByRole('textbox', { name: 'Card number' })).toHaveAttribute('placeholder', '1234 5678 9012 3456')
    expect(screen.getByRole('textbox', { name: 'Expiration date' })).toHaveAttribute('placeholder', '01/30')
    expect(screen.getByRole('textbox', { name: 'Security code' })).toHaveAttribute('placeholder', '123')
    expect(screen.getByRole('textbox', { name: 'Name on card' })).toHaveAttribute('placeholder', 'JOHN DOE')
  })

  it('uses TextField size and variant classes', () => {
    render(<CreditCardInput size="lg" variant="soft" />)

    const input = screen.getByRole('textbox', { name: 'Card number' })
    expect(input.closest('div')).toHaveClass(textFieldSizeVariants.lg)
    expect(input).toHaveClass(surfaceColorVariants.slate.soft)
  })

  it('applies disabled and error state to all card fields', () => {
    render(<CreditCardInput disabled error showName />)

    for (const input of screen.getAllByRole('textbox')) {
      expect(input).toBeDisabled()
      expect(input).toHaveAttribute('aria-invalid', 'true')
      expect(input).toHaveClass(surfaceColorVariants.error.outline)
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
