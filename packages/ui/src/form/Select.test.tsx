import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { Select, SelectItem } from './Select'
import { splitClassNames } from './test-utils'
import {
  floatingInputStyleVariants,
  floatingLabelStyleVariants,
  textFieldEnhancementVariants,
  textFieldFloatingColorVariants,
  textFieldFloatingLabelColorVariants,
  textFieldSurfaceColorVariants,
} from './text-field.class'

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
  it.each(floatingCases)('uses shared floating classes for %s', (variant, floatingStyle) => {
    const { container } = render(
      <Select data-testid="select" variant={variant} label="Department">
        <SelectItem value="sales">Sales</SelectItem>
      </Select>,
    )

    const trigger = screen.getByTestId('select')
    const label = getLabel(container)

    expect(trigger).toHaveClass(floatingInputStyleVariants[floatingStyle])
    expect(label).toHaveClass(floatingLabelStyleVariants[floatingStyle])
    expect(label.className).toContain('peer-focus')
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
    const label = getLabel(document.body)

    expect(trigger).toHaveClass(textFieldFloatingColorVariants.success.outlined)
    expect(label).toHaveClass(textFieldFloatingLabelColorVariants.success)
  })

  it('uses error color classes and invalid state when error is set', () => {
    render(
      <Select data-testid="select" variant="floating-outlined" label="Department" color="success" error>
        <SelectItem value="sales">Sales</SelectItem>
      </Select>,
    )

    const trigger = screen.getByTestId('select')
    const label = getLabel(document.body)

    expect(trigger).toHaveAttribute('aria-invalid', 'true')
    expect(trigger).toHaveClass(textFieldFloatingColorVariants.error.outlined)
    expect(label).toHaveClass(textFieldFloatingLabelColorVariants.error)
  })

  it('maps regular trigger colors through the shared surface lanes', () => {
    render(
      <Select data-testid="select" variant="soft" color="success">
        <SelectItem value="sales">Sales</SelectItem>
      </Select>,
    )

    const trigger = screen.getByTestId('select')

    expect(trigger).toHaveClass(...splitClassNames(textFieldSurfaceColorVariants.success.soft))
    expect(trigger).toHaveClass(...splitClassNames(textFieldEnhancementVariants.success.soft))
    expect(trigger.className).not.toContain('form-color')
  })
})
