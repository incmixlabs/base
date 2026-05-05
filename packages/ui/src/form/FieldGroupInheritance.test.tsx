import { cleanup, render, screen } from '@testing-library/react'
import * as React from 'react'
import { afterEach, describe, expect, it } from 'vitest'
import type { Size, TextFieldVariant } from '@/theme/tokens'
import { FieldGroupProvider } from './FieldGroupContext'
import { TextField } from './TextField'
import { textFieldColorVariants, textFieldSizeVariants } from './text-field.css'
import { withFieldGroup } from './withFieldGroup'

afterEach(() => {
  cleanup()
})

interface DemoControlProps {
  label: string
  size?: Size
  variant?: TextFieldVariant
}

const DemoControl = React.forwardRef<HTMLDivElement, DemoControlProps>(({ label, size, variant }, ref) => (
  <div ref={ref} data-testid={label} data-size={size ?? 'unset'} data-variant={variant ?? 'unset'} />
))
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
      <FieldGroupProvider value={{ size: 'lg', variant: 'soft' }}>
        <TextField aria-label="Name" />
      </FieldGroupProvider>,
    )

    const input = screen.getByRole('textbox', { name: 'Name' })
    expect(input.closest('div')).toHaveClass(textFieldSizeVariants.lg)
    expect(input).toHaveClass(textFieldColorVariants.slate.soft)
  })

  it('does not inject FieldGroup defaults into wrapped controls outside a provider', () => {
    render(<FieldGroupDemoControl label="wrapped-outside" />)

    const control = screen.getByTestId('wrapped-outside')
    expect(control).toHaveAttribute('data-size', 'unset')
    expect(control).toHaveAttribute('data-variant', 'unset')
  })

  it('preserves direct props on wrapped controls outside a provider', () => {
    render(<FieldGroupDemoControl label="wrapped-direct" size="sm" variant="ghost" />)

    const control = screen.getByTestId('wrapped-direct')
    expect(control).toHaveAttribute('data-size', 'sm')
    expect(control).toHaveAttribute('data-variant', 'ghost')
  })

  it('injects resolved values into wrapped controls inside a provider', () => {
    render(
      <FieldGroupProvider value={{ size: 'lg', variant: 'soft' }}>
        <FieldGroupDemoControl label="wrapped-inside" />
      </FieldGroupProvider>,
    )

    const control = screen.getByTestId('wrapped-inside')
    expect(control).toHaveAttribute('data-size', 'lg')
    expect(control).toHaveAttribute('data-variant', 'soft')
  })

  it('keeps direct props ahead of provider values on wrapped controls', () => {
    render(
      <FieldGroupProvider value={{ size: 'lg', variant: 'soft' }}>
        <FieldGroupDemoControl label="wrapped-override" size="sm" variant="ghost" />
      </FieldGroupProvider>,
    )

    const control = screen.getByTestId('wrapped-override')
    expect(control).toHaveAttribute('data-size', 'sm')
    expect(control).toHaveAttribute('data-variant', 'ghost')
  })
})
