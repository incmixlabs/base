import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { Checkbox } from './Checkbox'
import { checkboxColorVariants, checkboxHighContrastByVariant } from './checkbox.css'

afterEach(() => {
  cleanup()
})

describe('Checkbox', () => {
  it('uses local checked-state color maps with shared high-contrast classes', () => {
    render(<Checkbox color="success" variant="soft" highContrast data-testid="checkbox" />)

    const checkbox = screen.getByTestId('checkbox')

    expect(checkbox).toHaveClass(checkboxColorVariants.success.soft)
    expect(checkbox).toHaveClass('af-high-contrast')
    expect(checkbox).toHaveClass(checkboxHighContrastByVariant.soft)
  })
})
