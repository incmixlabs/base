import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { Theme } from '@/theme/ThemeProvider'
import { designTokens } from '@/theme/tokens'
import {
  floatingInputStyleVariants,
  floatingInputWithLeftIconCls,
  floatingLabelStyleVariants,
  floatingLabelWithLeftIconCls,
  textFieldFloatingColorVariants,
  textFieldIconContainerCls,
} from './text-field.class'
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
    expect(input).toHaveClass('border-solid')
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

  it('keeps both shared floating layout and color classes', () => {
    render(<TextField aria-label="Email" variant="floating-outlined" label="Email" color="success" />)

    const input = screen.getByRole('textbox', { name: 'Email' })

    expect(input).toHaveClass(floatingInputStyleVariants.outlined)
    expect(input).toHaveClass(textFieldFloatingColorVariants.success.outlined)
  })

  it('centers floating input icon slots in the input surface', () => {
    const { container } = render(
      <TextField aria-label="Email" variant="floating-outlined" label="Email" leftIcon="mail" />,
    )

    const iconSlot = container.querySelector('svg')?.closest('div')

    expect(iconSlot).toHaveStyle({ top: '50%' })
    expect(iconSlot).toHaveClass(textFieldIconContainerCls)
  })

  it('renders regular inputs with both icon slots and centered slot classes', () => {
    const { container } = render(<TextField aria-label="Password" leftIcon="lock" rightIcon="eye" />)

    const icons = container.querySelectorAll('svg')

    expect(icons).toHaveLength(2)
    expect(icons[0]?.closest('div')).toHaveClass(textFieldIconContainerCls)
    expect(icons[1]?.closest('div')).toHaveClass(textFieldIconContainerCls)
  })

  it('uses variable hooks for floating icon input and label offsets', () => {
    const { container } = render(
      <TextField aria-label="Email" variant="floating-outlined" label="Email" leftIcon="mail" />,
    )

    const input = screen.getByRole('textbox', { name: 'Email' })
    const label = container.querySelector('label')

    expect(input).toHaveClass(floatingInputWithLeftIconCls)
    expect(label).toHaveClass(floatingLabelWithLeftIconCls)
    expect(label).toHaveClass(floatingLabelStyleVariants.outlined)
    expect(floatingInputStyleVariants.outlined).toContain('[padding-left:var(--af-text-field-input-padding-left')
    expect(floatingLabelStyleVariants.outlined).toContain('[left:var(--af-text-field-label-left')
    expect(floatingLabelStyleVariants.outlined).toContain('bg-[var(--color-neutral-background)]')
    expect(floatingLabelStyleVariants.outlined).not.toContain('var(--background)')
  })
})
