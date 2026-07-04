import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { Textarea } from './Textarea'
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

describe('Textarea floating variants', () => {
  it.each(floatingCases)('uses shared floating classes for %s', (variant, floatingStyle) => {
    const { container } = render(<Textarea data-testid="textarea" variant={variant} label="Notes" />)

    const textarea = screen.getByTestId('textarea')
    const label = getLabel(container)

    expect(textarea).toHaveClass(floatingInputStyleVariants[floatingStyle])
    expect(label).toHaveClass(floatingLabelStyleVariants[floatingStyle])
    expect(label).toHaveClass('absolute')
  })

  it('applies semantic floating color classes', () => {
    const { container } = render(
      <Textarea data-testid="textarea" variant="floating-outlined" label="Notes" color="success" />,
    )

    const textarea = screen.getByTestId('textarea')
    const label = getLabel(container)

    expect(textarea).toHaveClass(textFieldFloatingColorVariants.success.outlined)
    expect(label).toHaveClass(textFieldFloatingLabelColorVariants.success)
  })

  it('uses error color classes and invalid state when error is set', () => {
    const { container } = render(
      <Textarea data-testid="textarea" variant="floating-outlined" label="Notes" color="success" error />,
    )

    const textarea = screen.getByTestId('textarea')
    const label = getLabel(container)

    expect(textarea).toHaveAttribute('aria-invalid', 'true')
    expect(textarea).toHaveClass(textFieldFloatingColorVariants.error.outlined)
    expect(label).toHaveClass(textFieldFloatingLabelColorVariants.error)
  })

  it('maps regular semantic colors through the shared surface lanes', () => {
    render(<Textarea data-testid="textarea" variant="soft" color="success" />)

    const textarea = screen.getByTestId('textarea')

    expect(textarea).toHaveClass(...splitClassNames(textFieldSurfaceColorVariants.success.soft))
    expect(textarea).toHaveClass(...splitClassNames(textFieldEnhancementVariants.success.soft))
    expect(textarea.className).not.toContain('form-color')
  })
})
