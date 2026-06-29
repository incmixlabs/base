import '@testing-library/jest-dom/vitest'
import { cleanup, render } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { InputOTP } from './InputOTP'

afterEach(() => {
  cleanup()
})

describe('InputOTP', () => {
  it('uses shared form-control tokens for default outline slots', () => {
    const { container } = render(<InputOTP />)

    const slots = [...container.querySelectorAll('div')].filter(element => element.className.includes('h-12 w-10'))

    expect(slots).toHaveLength(6)

    for (const slot of slots) {
      expect(slot).toHaveClass('box-border', 'border', 'border-solid')
      expect(slot.className).toContain('rounded-[var(--element-border-radius,var(--radius-md))]')
      expect(slot.className).toContain('[border-color:var(--color-neutral-border-subtle)]')
      expect(slot.className).toContain('[background-color:var(--color-neutral-background)]')
      expect(slot.className).not.toContain('border-input')
      expect(slot.className).not.toContain('bg-background')
    }
  })
})
