import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { MultiSelect } from './MultiSelect'

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
    expect(trigger.className).not.toContain('border-input')
    expect(trigger.className).not.toContain('bg-background')
  })
})
