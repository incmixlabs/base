import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { PhoneInput } from './PhoneInput'
import { textFieldColorVariants, textFieldSizeVariants } from './text-field.css'

const surfaceClass = (className: string) => className.split(' ')[0]

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

  it('uses TextField size and variant classes', () => {
    render(<PhoneInput size="lg" variant="soft" />)

    const input = screen.getByRole('textbox', { name: 'Phone number' })
    expect(input.closest('div')).toHaveClass(textFieldSizeVariants.lg)
    expect(input).toHaveClass(surfaceClass(textFieldColorVariants.slate.soft))
  })

  it('keeps the accessible field name independent from custom placeholder examples', () => {
    render(<PhoneInput phonePlaceholder="(555) 123-4567" />)

    expect(screen.getByRole('textbox', { name: 'Phone number' })).toHaveAttribute('placeholder', '(555) 123-4567')
  })

  it('applies disabled and error state to the TextField input and country selector', () => {
    render(<PhoneInput disabled error />)

    const input = screen.getByRole('textbox', { name: 'Phone number' })
    expect(input).toBeDisabled()
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input).toHaveClass(surfaceClass(textFieldColorVariants.error.outline))
    expect(screen.getByRole('button', { name: /change country code/i })).toBeDisabled()
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
