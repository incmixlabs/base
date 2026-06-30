import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { CheckboxGroup } from './CheckboxGroup'

afterEach(() => {
  cleanup()
})

describe('CheckboxGroup', () => {
  it('normalizes item disabled before merging with root disabled state', () => {
    render(
      <CheckboxGroup.Root disabled={'false' as any}>
        <CheckboxGroup.Item value="updates" label="Updates" disabled={'false' as any} />
      </CheckboxGroup.Root>,
    )

    expect(screen.getByRole('checkbox')).not.toBeDisabled()
  })

  it('uses direct checkbox group item gap classes', () => {
    render(
      <CheckboxGroup.Root size="lg">
        <CheckboxGroup.Item value="updates" label="Updates" />
      </CheckboxGroup.Root>,
    )

    const itemClassName = screen.getByRole('checkbox').parentElement?.className

    expect(itemClassName).toContain('gap-2')
    expect(itemClassName).not.toContain('--af-checkbox-group')
    expect(itemClassName).not.toContain('--component-checkbox-group')
  })
})
