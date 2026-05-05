import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { FieldGroupProvider, useFieldGroup } from './FieldGroupContext'

afterEach(() => {
  cleanup()
})

function ReadFieldGroup() {
  const value = useFieldGroup()
  return <div data-testid="field-group-value">{JSON.stringify(value)}</div>
}

describe('FieldGroupContext', () => {
  it('inherits parent values when nested providers omit them', () => {
    render(
      <FieldGroupProvider value={{ size: 'lg', variant: 'soft', layout: 'grid' }}>
        <FieldGroupProvider value={{ layout: 'stacked' }}>
          <ReadFieldGroup />
        </FieldGroupProvider>
      </FieldGroupProvider>,
    )

    expect(screen.getByTestId('field-group-value')).toHaveTextContent(
      JSON.stringify({ size: 'lg', variant: 'soft', layout: 'stacked' }),
    )
  })

  it('falls back to defaults when no provider is present', () => {
    render(<ReadFieldGroup />)

    expect(screen.getByTestId('field-group-value')).toHaveTextContent(
      JSON.stringify({ size: 'md', variant: 'outline', layout: 'stacked' }),
    )
  })
})
