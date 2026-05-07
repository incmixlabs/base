import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { RadioGroup } from './RadioGroup'
import { radioColorVariants, radioHighContrastByVariant } from './radio-group.css'

afterEach(() => {
  cleanup()
})

describe('RadioGroup', () => {
  it('uses local checked-state color maps with shared high-contrast classes', () => {
    render(
      <RadioGroup.Root color="success" variant="classic" highContrast>
        <RadioGroup.Item value="standard">Standard</RadioGroup.Item>
      </RadioGroup.Root>,
    )

    const radio = screen.getByRole('radio')

    expect(radio).toHaveClass(radioColorVariants.success.classic)
    expect(radio).toHaveClass('af-high-contrast')
    expect(radio).toHaveClass(radioHighContrastByVariant.classic)
  })
})
