import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { surfaceColorVariants } from '@/elements/surface/surface.css'
import { PhoneInput } from './PhoneInput'
import { textFieldSizeVariants } from './text-field.css'

afterEach(() => {
  cleanup()
})

describe('PhoneInput', () => {
  it('renders an accessible phone field and country selector', () => {
    render(<PhoneInput countries={['US', 'CA']} />)

    expect(screen.getByRole('textbox', { name: 'Phone number' })).toHaveAttribute('type', 'tel')
    expect(
      screen.getByRole('button', { name: /change country code, current country united states \+1/i }),
    ).toBeEnabled()
  })

  it('uses an associated label instead of the fallback accessible name', () => {
    render(
      <div>
        <label htmlFor="mobile-phone">Mobile phone</label>
        <PhoneInput id="mobile-phone" />
      </div>,
    )

    expect(screen.getByRole('textbox', { name: 'Mobile phone' })).toHaveAttribute('type', 'tel')
  })

  it('uses aria-labelledby instead of the fallback accessible name', () => {
    render(
      <div>
        <span id="emergency-phone-label">Emergency phone</span>
        <PhoneInput aria-labelledby="emergency-phone-label" />
      </div>,
    )

    expect(screen.getByRole('textbox', { name: 'Emergency phone' })).toHaveAttribute('type', 'tel')
  })

  it('uses TextField size and variant classes', () => {
    render(<PhoneInput size="lg" variant="soft" />)

    const input = screen.getByRole('textbox', { name: 'Phone number' })
    expect(input.closest('div')).toHaveClass(textFieldSizeVariants.lg)
    expect(input).toHaveClass(surfaceColorVariants.slate.soft)
  })

  it('keeps the accessible field name independent from custom placeholders', () => {
    render(<PhoneInput placeholder="(555) 123-4567" />)

    expect(screen.getByRole('textbox', { name: 'Phone number' })).toHaveAttribute('placeholder', '(555) 123-4567')
  })

  it('keeps legacy phonePlaceholder as a fallback', () => {
    render(<PhoneInput phonePlaceholder="(555) 987-6543" />)

    expect(screen.getByRole('textbox', { name: 'Phone number' })).toHaveAttribute('placeholder', '(555) 987-6543')
  })

  it('applies disabled and error state to the TextField input and country selector', () => {
    render(<PhoneInput disabled error />)

    const input = screen.getByRole('textbox', { name: 'Phone number' })
    expect(input).toBeDisabled()
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input).toHaveClass(surfaceColorVariants.error.outline)
    expect(screen.getByRole('button', { name: /change country code/i })).toBeDisabled()
  })

  it('closes the country selector when disabled after opening', () => {
    const handleChange = vi.fn()
    const { rerender } = render(<PhoneInput countries={['US', 'CA']} onChange={handleChange} />)

    fireEvent.click(screen.getByRole('button', { name: /change country code/i }))
    expect(screen.getByRole('option', { name: /Canada/ })).toBeInTheDocument()

    rerender(<PhoneInput countries={['US', 'CA']} disabled onChange={handleChange} />)

    expect(screen.getByRole('button', { name: /change country code/i })).toBeDisabled()
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    expect(handleChange).not.toHaveBeenCalled()
  })

  it('keeps phone formatting behavior when TextField handles the input surface', () => {
    const handleChange = vi.fn()
    render(<PhoneInput onChange={handleChange} />)

    fireEvent.change(screen.getByRole('textbox', { name: 'Phone number' }), { target: { value: 'abc123-()' } })

    expect(screen.getByRole('textbox', { name: 'Phone number' })).toHaveValue('123-()')
    expect(handleChange).toHaveBeenLastCalledWith({
      countryCode: 'US',
      phoneCode: '+1',
      number: '123-()',
      fullNumber: '+1123-()',
    })
  })
})
