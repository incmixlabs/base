import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { Theme } from '@/theme/ThemeProvider'
import { designTokens } from '@/theme/tokens'
import {
  floatingInputStyleVariants,
  floatingInputWithLeftElementSizeVariants,
  floatingInputWithLeftIconSizeVariants,
  floatingLabelSizeVariants,
  floatingLabelStyleVariants,
  floatingLabelWithLeftElementSizeVariants,
  floatingLabelWithLeftIconSizeVariants,
  textFieldEnhancementVariants,
  textFieldFloatingColorVariants,
  textFieldFloatingLabelColorVariants,
  textFieldIconContainerCls,
  textFieldSurfaceColorVariants,
} from './text-field.class'
import { formControlNeutralBackground } from './form-control.class'
import { splitClassNames } from './test-utils'
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

  it('maps regular semantic colors through the shared surface lanes', () => {
    render(<TextField aria-label="Status" variant="soft" color="success" />)

    const input = screen.getByRole('textbox', { name: 'Status' })

    expect(input).toHaveClass(...splitClassNames(textFieldSurfaceColorVariants.success.soft))
    expect(input).toHaveClass(...splitClassNames(textFieldEnhancementVariants.success.soft))
    expect(textFieldSurfaceColorVariants.success.soft).toContain(
      '[background-color:var(--color-success-surface-subtle)]',
    )
    expect(textFieldSurfaceColorVariants.success.soft).toContain('[border-color:var(--color-success-border-subtle)]')
    expect(textFieldSurfaceColorVariants.success.soft).not.toContain('bg-success-soft')
    expect(textFieldEnhancementVariants.success.soft).not.toContain('background-color')
    expect(input.className).not.toContain('form-color')
  })

  it('centers floating input icon slots in the input surface', () => {
    const { container } = render(
      <TextField aria-label="Email" variant="floating-outlined" label="Email" leftIcon="mail" />,
    )

    const iconSlot = container.querySelector('svg')?.closest('div')

    expect(iconSlot).toHaveClass(textFieldIconContainerCls)
  })

  it('renders regular inputs with both icon slots and centered slot classes', () => {
    const { container } = render(<TextField aria-label="Password" leftIcon="lock" rightIcon="eye" />)

    const icons = container.querySelectorAll('svg')

    expect(icons).toHaveLength(2)
    expect(icons[0]?.closest('div')).toHaveClass(textFieldIconContainerCls)
    expect(icons[1]?.closest('div')).toHaveClass(textFieldIconContainerCls)
  })

  it('uses direct token offsets for floating icon input and label offsets', () => {
    const { container } = render(
      <TextField aria-label="Email" variant="floating-outlined" label="Email" leftIcon="mail" />,
    )

    const input = screen.getByRole('textbox', { name: 'Email' })
    const label = container.querySelector('label')

    expect(input).toHaveClass(floatingInputWithLeftIconSizeVariants.md)
    expect(floatingInputWithLeftElementSizeVariants.md).toBe(floatingInputWithLeftIconSizeVariants.md)
    expect(label).toHaveClass(floatingLabelStyleVariants.outlined)
    expect(label).not.toHaveClass(floatingLabelSizeVariants.md.outlined)
    expect(label).toHaveClass(floatingLabelWithLeftIconSizeVariants.md.outlined)
    expect(label).toHaveClass(textFieldFloatingLabelColorVariants.slate)
    expect(floatingInputWithLeftIconSizeVariants.md).not.toContain('--af-text-field-left-slot-width')
    expect(floatingLabelSizeVariants.md.outlined).not.toContain('--af-text-field-left-slot-width')
    expect(floatingLabelWithLeftIconSizeVariants.md.outlined).not.toContain('--af-text-field-left-slot-width')
    expect(floatingLabelWithLeftIconSizeVariants.md.standard).not.toContain('left-0')
    expect(floatingLabelWithLeftIconSizeVariants.md.standard).toContain('[left:')
    expect(floatingInputWithLeftElementSizeVariants.md).not.toContain('--af-text-field-left-slot-width')
    expect(floatingLabelStyleVariants.outlined).toContain(formControlNeutralBackground)
    expect(floatingLabelStyleVariants.outlined).not.toContain('var(--background)')
  })

  it('reserves explicit custom element width without TextField CSS variables', () => {
    const { container } = render(
      <TextField aria-label="Phone" leftElement={<span data-testid="prefix">+1</span>} leftElementWidth="8.75rem" />,
    )

    const input = screen.getByRole('textbox', { name: 'Phone' })
    const slot = container.querySelector('[data-testid="prefix"]')?.parentElement

    expect(input).toHaveStyle({ paddingLeft: '8.75rem' })
    expect(slot).toHaveStyle({ width: '8.75rem' })
    expect(input.getAttribute('style') ?? '').not.toContain('--af-text-field')
    expect(slot?.getAttribute('style') ?? '').not.toContain('--af-text-field')
  })

  it('uses explicit custom element width for floating labels', () => {
    const { container } = render(
      <TextField
        aria-label="Phone"
        variant="floating-outlined"
        label="Phone"
        leftElement={<span data-testid="prefix">+1</span>}
        leftElementWidth="8.75rem"
      />,
    )

    const input = screen.getByRole('textbox', { name: 'Phone' })
    const label = container.querySelector('label')
    const slot = container.querySelector('[data-testid="prefix"]')?.parentElement

    expect(input).toHaveStyle({ paddingLeft: '8.75rem' })
    expect(slot).toHaveStyle({ width: '8.75rem' })
    expect(label).toHaveClass(floatingLabelWithLeftElementSizeVariants.md.outlined)
    expect(floatingLabelWithLeftElementSizeVariants.md.outlined).not.toContain('[left:')
    expect(floatingLabelWithLeftElementSizeVariants.md.outlined).not.toContain('max-width')
    expect(label).toHaveStyle({ left: '8.75rem' })
    expect(label?.getAttribute('style') ?? '').toContain('max-width: calc(100% - (8.75rem +')
  })
})
