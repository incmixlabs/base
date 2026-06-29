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

  it('uses the af checkbox group item-gap token', () => {
    render(
      <CheckboxGroup.Root size="lg">
        <CheckboxGroup.Item value="updates" label="Updates" />
      </CheckboxGroup.Root>,
    )

    expect(screen.getByRole('checkbox').parentElement?.className).toContain(
      'gap-[var(--af-checkbox-group-item-gap,0.5rem)]',
    )
    expect(screen.getByRole('checkbox').parentElement?.className).not.toContain('--component-checkbox-group')
  })
})
