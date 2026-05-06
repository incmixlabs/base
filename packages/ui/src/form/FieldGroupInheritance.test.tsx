import { cleanup, render, screen } from '@testing-library/react'
import * as React from 'react'
import { afterEach, describe, expect, it } from 'vitest'
import type { Radius, Size, TextFieldVariant } from '@/theme/tokens'
import { FieldGroupProvider } from './FieldGroupContext'
import { MultiSelect } from './MultiSelect'
import { Select, SelectItem } from './Select'
import { Switch } from './Switch'
import { TextField } from './TextField'
import { textFieldColorVariants, textFieldSizeVariants } from './text-field.css'
import { withFieldGroup } from './withFieldGroup'

afterEach(() => {
  cleanup()
})

interface DemoControlProps {
  label: string
  size?: Size
  radius?: Radius
  variant?: TextFieldVariant
  disabled?: boolean
}

const DemoControl = React.forwardRef<HTMLDivElement, DemoControlProps>(
  ({ label, size, radius, variant, disabled }, ref) => (
    <div
      ref={ref}
      data-testid={label}
      data-size={size ?? 'unset'}
      data-radius={radius ?? 'unset'}
      data-variant={variant ?? 'unset'}
      data-disabled={disabled === undefined ? 'unset' : String(disabled)}
    />
  ),
)
DemoControl.displayName = 'DemoControl'

const FieldGroupDemoControl = withFieldGroup(DemoControl)

describe('FieldGroup inheritance', () => {
  it('uses resolved FieldGroup defaults for direct controls outside a provider', () => {
    render(<TextField aria-label="Name" />)

    const input = screen.getByRole('textbox', { name: 'Name' })
    expect(input.closest('div')).toHaveClass(textFieldSizeVariants.md)
    expect(input).toHaveClass(textFieldColorVariants.slate.outline)
  })

  it('applies FieldGroup values to direct controls inside a provider', () => {
    render(
      <FieldGroupProvider value={{ size: 'lg', radius: 'lg', variant: 'soft', disabled: true }}>
        <TextField aria-label="Name" />
      </FieldGroupProvider>,
    )

    const input = screen.getByRole('textbox', { name: 'Name' })
    expect(input.closest('div')).toHaveClass(textFieldSizeVariants.lg)
    expect(input.closest('div')).toHaveStyle({ '--element-border-radius': '0.5rem' })
    expect(input).toHaveClass(textFieldColorVariants.slate.soft)
    expect(input).toBeDisabled()
  })

  it('applies inherited disabled state consistently across interactive controls', () => {
    render(
      <FieldGroupProvider value={{ disabled: true }}>
        <TextField aria-label="Name" />
        <Select aria-label="Status">
          <SelectItem value="open">Open</SelectItem>
        </Select>
        <MultiSelect ariaLabelledby="tags-label" options={[{ value: 'urgent', label: 'Urgent' }]} />
        <Switch aria-label="Notifications" />
      </FieldGroupProvider>,
    )

    expect(screen.getByRole('textbox', { name: 'Name' })).toBeDisabled()
    expect(screen.getByRole('combobox', { name: 'Status' })).toBeDisabled()
    expect(screen.getByRole('button')).toHaveAttribute('aria-disabled', 'true')
    expect(screen.getByRole('button')).toHaveAttribute('tabindex', '-1')
    expect(screen.getByRole('switch', { name: 'Notifications' })).toHaveAttribute('aria-disabled', 'true')
    expect(screen.getByRole('switch', { name: 'Notifications' })).toHaveAttribute('tabindex', '-1')
  })

  it('does not inject FieldGroup defaults into wrapped controls outside a provider', () => {
    render(<FieldGroupDemoControl label="wrapped-outside" />)

    const control = screen.getByTestId('wrapped-outside')
    expect(control).toHaveAttribute('data-size', 'unset')
    expect(control).toHaveAttribute('data-radius', 'unset')
    expect(control).toHaveAttribute('data-variant', 'unset')
    expect(control).toHaveAttribute('data-disabled', 'unset')
  })

  it('preserves direct props on wrapped controls outside a provider', () => {
    render(<FieldGroupDemoControl label="wrapped-direct" size="sm" radius="sm" variant="ghost" disabled />)

    const control = screen.getByTestId('wrapped-direct')
    expect(control).toHaveAttribute('data-size', 'sm')
    expect(control).toHaveAttribute('data-radius', 'sm')
    expect(control).toHaveAttribute('data-variant', 'ghost')
    expect(control).toHaveAttribute('data-disabled', 'true')
  })

  it('injects resolved values into wrapped controls inside a provider', () => {
    render(
      <FieldGroupProvider value={{ size: 'lg', radius: 'lg', variant: 'soft', disabled: true }}>
        <FieldGroupDemoControl label="wrapped-inside" />
      </FieldGroupProvider>,
    )

    const control = screen.getByTestId('wrapped-inside')
    expect(control).toHaveAttribute('data-size', 'lg')
    expect(control).toHaveAttribute('data-radius', 'lg')
    expect(control).toHaveAttribute('data-variant', 'soft')
    expect(control).toHaveAttribute('data-disabled', 'true')
  })

  it('keeps direct props ahead of provider values while preserving inherited disabled', () => {
    render(
      <FieldGroupProvider value={{ size: 'lg', radius: 'lg', variant: 'soft', disabled: true }}>
        <FieldGroupDemoControl label="wrapped-override" size="sm" radius="sm" variant="ghost" disabled={false} />
      </FieldGroupProvider>,
    )

    const control = screen.getByTestId('wrapped-override')
    expect(control).toHaveAttribute('data-size', 'sm')
    expect(control).toHaveAttribute('data-radius', 'sm')
    expect(control).toHaveAttribute('data-variant', 'ghost')
    expect(control).toHaveAttribute('data-disabled', 'true')
  })
})
