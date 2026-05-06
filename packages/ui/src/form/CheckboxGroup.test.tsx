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
})
