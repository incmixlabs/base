import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { FieldGroupProvider, useFieldGroup, useFieldGroupOptional } from './FieldGroupContext'

afterEach(() => {
  cleanup()
})

function ReadFieldGroup() {
  const value = useFieldGroup()
  return <div data-testid="field-group-value">{JSON.stringify(value)}</div>
}

function ReadOptionalFieldGroup() {
  const value = useFieldGroupOptional()
  return <div data-testid="field-group-optional">{value ? JSON.stringify(value) : 'none'}</div>
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

  it('returns null from the optional hook when no provider is present', () => {
    render(<ReadOptionalFieldGroup />)

    expect(screen.getByTestId('field-group-optional')).toHaveTextContent('none')
  })

  it('resolves defaults from the optional hook when a provider is present', () => {
    render(
      <FieldGroupProvider value={{ layout: 'grid' }}>
        <ReadOptionalFieldGroup />
      </FieldGroupProvider>,
    )

    expect(screen.getByTestId('field-group-optional')).toHaveTextContent(
      JSON.stringify({ size: 'md', variant: 'outline', layout: 'grid' }),
    )
  })
})
