import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { Textarea } from './Textarea'
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

describe('Textarea floating variants', () => {
  it.each(floatingCases)('uses shared VE classes for %s', (variant, floatingStyle) => {
    const { container } = render(<Textarea data-testid="textarea" variant={variant} label="Notes" />)

    const textarea = screen.getByTestId('textarea')
    const label = getLabel(container)

    expect(textarea).toHaveClass(floatingInputStyleVariants[floatingStyle])
    expect(label).toHaveClass(floatingLabelStyleVariants[floatingStyle])
    expect(label).toHaveClass('absolute')
  })

  it('applies semantic floating color classes', () => {
    render(<Textarea data-testid="textarea" variant="floating-outlined" label="Notes" color="success" />)

    const textarea = screen.getByTestId('textarea')

    expect(textarea).toHaveClass(textFieldFloatingColorVariants.success.outlined)
    expect(textarea.parentElement).toHaveClass(textFieldFloatingWrapperColorVariants.success)
  })

  it('uses error color classes and invalid state when error is set', () => {
    render(<Textarea data-testid="textarea" variant="floating-outlined" label="Notes" color="success" error />)

    const textarea = screen.getByTestId('textarea')

    expect(textarea).toHaveAttribute('aria-invalid', 'true')
    expect(textarea).toHaveClass(textFieldFloatingColorVariants.error.outlined)
    expect(textarea.parentElement).toHaveClass(textFieldFloatingWrapperColorVariants.error)
  })
})
