import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { MultiSelect } from './MultiSelect'
import { splitClassNames } from './test-utils'
import { textFieldEnhancementVariants, textFieldSurfaceColorVariants } from './text-field.class'

const options = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
]

afterEach(() => {
  cleanup()
})

describe('MultiSelect', () => {
  it('uses the shared form-control border frame for the trigger', () => {
    render(<MultiSelect options={options} placeholder="Select skills..." />)

    const trigger = screen.getByRole('button', { name: 'Select skills...' })

    expect(trigger).toHaveClass('box-border', 'border', 'border-solid')
    expect(trigger.className).toContain('rounded-[var(--element-border-radius,var(--radius-md))]')
    expect(trigger.className).toContain('text-slate')
    expect(trigger.className).toContain('border-slate')
    expect(trigger.className).toContain('bg-transparent')
  })

  it('keeps the error text color class on the trigger', () => {
    render(<MultiSelect options={options} placeholder="Select skills..." error />)

    const trigger = screen.getByRole('button', { name: 'Select skills...' })

    expect(trigger.className).toContain('border-error')
    expect(trigger.className).toContain('text-error')
  })

  it('maps trigger colors through the shared surface lanes', () => {
    render(<MultiSelect options={options} placeholder="Select skills..." variant="soft" color="success" />)

    const trigger = screen.getByRole('button', { name: 'Select skills...' })

    expect(trigger).toHaveClass(...splitClassNames(textFieldSurfaceColorVariants.success.soft))
    expect(trigger).toHaveClass(...splitClassNames(textFieldEnhancementVariants.success.soft))
    expect(trigger.className).not.toContain('form-color')
  })
})
