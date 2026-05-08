import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { Select, SelectItem } from './Select'
import {
  floatingInputStyleVariants,
  floatingLabelStyleVariants,
  textFieldFloatingColorVariants,
  textFieldFloatingWrapperColorVariants,
} from './text-field.css'

afterEach(() => {
  cleanup()
})

const floatingCases = [
  ['floating-filled', 'filled'],
  ['floating-outlined', 'outlined'],
  ['floating-standard', 'standard'],
] as const

function getLabel(container: HTMLElement) {
  const label = container.querySelector('label')
  expect(label).not.toBeNull()
  return label as HTMLLabelElement
}

describe('Select floating variants', () => {
  it.each(floatingCases)('uses shared VE classes for %s', (variant, floatingStyle) => {
    const { container } = render(
      <Select data-testid="select" variant={variant} label="Department">
        <SelectItem value="sales">Sales</SelectItem>
      </Select>,
    )

    const trigger = screen.getByTestId('select')
    const label = getLabel(container)

    expect(trigger).toHaveClass(floatingInputStyleVariants[floatingStyle])
    expect(label).toHaveClass(floatingLabelStyleVariants[floatingStyle])
    expect(label.className).not.toContain('peer-data')
  })

  it('uses placeholder text as the floating label when label is omitted', () => {
    const { container } = render(
      <Select data-testid="select" variant="floating-outlined" placeholder="Department">
        <SelectItem value="sales">Sales</SelectItem>
      </Select>,
    )

    expect(getLabel(container)).toHaveTextContent('Department')
    expect(screen.getByTestId('select')).toHaveAttribute('data-placeholder')
  })

  it('uses selected and open state data attributes for shared label selectors', () => {
    render(
      <Select data-testid="select" variant="floating-outlined" label="Department" defaultValue="sales" defaultOpen>
        <SelectItem value="sales">Sales</SelectItem>
      </Select>,
    )

    const trigger = screen.getByTestId('select')

    expect(trigger).not.toHaveAttribute('data-placeholder')
    expect(trigger).toHaveAttribute('data-popup-open')
  })

  it('applies semantic floating color classes', () => {
    render(
      <Select data-testid="select" variant="floating-outlined" label="Department" color="success">
        <SelectItem value="sales">Sales</SelectItem>
      </Select>,
    )

    const trigger = screen.getByTestId('select')

    expect(trigger).toHaveClass(textFieldFloatingColorVariants.success.outlined)
    expect(trigger.parentElement).toHaveClass(textFieldFloatingWrapperColorVariants.success)
  })

  it('uses error color classes and invalid state when error is set', () => {
    render(
      <Select data-testid="select" variant="floating-outlined" label="Department" color="success" error>
        <SelectItem value="sales">Sales</SelectItem>
      </Select>,
    )

    const trigger = screen.getByTestId('select')

    expect(trigger).toHaveAttribute('aria-invalid', 'true')
    expect(trigger).toHaveClass(textFieldFloatingColorVariants.error.outlined)
    expect(trigger.parentElement).toHaveClass(textFieldFloatingWrapperColorVariants.error)
  })
})
