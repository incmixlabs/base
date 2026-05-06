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
      <FieldGroupProvider value={{ size: 'lg', radius: 'lg', variant: 'soft', layout: 'grid' }}>
        <FieldGroupProvider value={{ layout: 'stacked' }}>
          <ReadFieldGroup />
        </FieldGroupProvider>
      </FieldGroupProvider>,
    )

    expect(screen.getByTestId('field-group-value')).toHaveTextContent(
      JSON.stringify({
        size: 'lg',
        radius: 'lg',
        variant: 'soft',
        layout: 'stacked',
        disabled: false,
        readOnly: false,
      }),
    )
  })

  it('falls back to defaults when no provider is present', () => {
    render(<ReadFieldGroup />)

    expect(screen.getByTestId('field-group-value')).toHaveTextContent(
      JSON.stringify({ size: 'md', variant: 'outline', layout: 'stacked', disabled: false, readOnly: false }),
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
      JSON.stringify({ size: 'md', variant: 'outline', layout: 'grid', disabled: false, readOnly: false }),
    )
  })

  it('inherits disabled and readOnly from parent providers', () => {
    render(
      <FieldGroupProvider value={{ radius: 'full', disabled: true, readOnly: true }}>
        <FieldGroupProvider value={{ layout: 'grid', disabled: false, readOnly: false }}>
          <ReadFieldGroup />
        </FieldGroupProvider>
      </FieldGroupProvider>,
    )

    expect(screen.getByTestId('field-group-value')).toHaveTextContent(
      JSON.stringify({
        size: 'md',
        radius: 'full',
        variant: 'outline',
        layout: 'grid',
        disabled: true,
        readOnly: true,
      }),
    )
  })
})
