import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { Theme } from '@/theme/ThemeProvider'
import { designTokens } from '@/theme/tokens'
import { floatingInputStyleVariants, textFieldFloatingColorVariants } from './text-field.css'
import { TextField } from './TextField'

afterEach(() => {
  cleanup()
})

describe('TextField', () => {
  it('uses the ThemeProvider radius for regular inputs', () => {
    render(
      <Theme radius="lg">
        <TextField aria-label="Name" />
      </Theme>,
    )

    const input = screen.getByRole('textbox', { name: 'Name' })
    expect(input.closest('div')).toHaveStyle({ '--element-border-radius': designTokens.radius.lg })
  })

  it('uses the ThemeProvider radius for floating inputs', () => {
    render(
      <Theme radius="lg">
        <TextField aria-label="Email" variant="floating-outlined" label="Email" />
      </Theme>,
    )

    const input = screen.getByRole('textbox', { name: 'Email' })
    expect(input.closest('div')).toHaveStyle({ '--element-border-radius': designTokens.radius.lg })
  })

  it('exposes invalid state for floating inputs', () => {
    render(<TextField aria-label="Email" variant="floating-outlined" label="Email" error />)

    expect(screen.getByRole('textbox', { name: 'Email' })).toHaveAttribute('aria-invalid', 'true')
  })

  it('keeps both shared floating VE layout and color classes', () => {
    render(<TextField aria-label="Email" variant="floating-outlined" label="Email" color="success" />)

    const input = screen.getByRole('textbox', { name: 'Email' })

    expect(input).toHaveClass(floatingInputStyleVariants.outlined)
    expect(input).toHaveClass(textFieldFloatingColorVariants.success.outlined)
  })
})
