import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { Divider } from './Divider'
import {
  dividerAlignStart,
  dividerColorVariants,
  dividerHorizontal,
  dividerSizeVariants,
  dividerVertical,
  dividerWithContent,
} from './divider.css'

afterEach(() => {
  cleanup()
})

describe('Divider', () => {
  it('renders a horizontal divider by default', () => {
    render(<Divider data-testid="divider" />)

    const divider = screen.getByTestId('divider')

    expect(divider).toHaveAttribute('data-orientation', 'horizontal')
    expect(divider.className).toContain(dividerHorizontal)
    expect(divider.className).toContain(dividerSizeVariants.sm)
    expect(divider.className).not.toContain(dividerWithContent)
  })

  it('renders children as divider label content', () => {
    render(<Divider data-testid="divider">OR</Divider>)

    const divider = screen.getByTestId('divider')

    expect(screen.getByText('OR')).toBeInTheDocument()
    expect(divider.className).toContain(dividerWithContent)
  })

  it('applies vertical orientation and visual variants', () => {
    render(
      <Divider data-testid="divider" orientation="vertical" size="lg" color="primary" align="start">
        OR
      </Divider>,
    )

    const divider = screen.getByTestId('divider')

    expect(divider).toHaveAttribute('data-orientation', 'vertical')
    expect(divider.className).toContain(dividerVertical)
    expect(divider.className).toContain(dividerSizeVariants.lg)
    expect(divider.className).toContain(dividerColorVariants.primary)
    expect(divider.className).toContain(dividerAlignStart)
  })
})
