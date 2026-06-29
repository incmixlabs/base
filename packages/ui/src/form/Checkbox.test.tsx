import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { Checkbox } from './Checkbox'
import { checkboxColorVariants, checkboxHighContrastByVariant } from './checkbox.class'

afterEach(() => {
  cleanup()
})

describe('Checkbox', () => {
  it('uses local checked-state color maps with shared high-contrast classes', () => {
    render(<Checkbox color="success" variant="soft" highContrast data-testid="checkbox" />)

    const checkbox = screen.getByTestId('checkbox')

    expect(checkbox).toHaveClass(checkboxColorVariants.success.soft)
    expect(checkbox).toHaveClass('data-[checked]:[background-color:var(--color-success-soft-hover)]')
    expect(checkbox).toHaveClass('af-high-contrast')
    expect(checkbox).toHaveClass(checkboxHighContrastByVariant.soft)
  })

  it('renders visible checked and indeterminate indicators from component state', () => {
    const { rerender } = render(<Checkbox checked data-testid="checkbox" onCheckedChange={() => undefined} />)

    const checkbox = screen.getByTestId('checkbox')
    expect(checkbox.querySelector('path')).toBeInTheDocument()
    expect(checkbox.querySelector('line')).not.toBeInTheDocument()

    rerender(<Checkbox checked={false} indeterminate data-testid="checkbox" onCheckedChange={() => undefined} />)

    expect(checkbox.querySelector('line')).toBeInTheDocument()
    expect(checkbox.querySelector('path')).not.toBeInTheDocument()
  })
})
