import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as React from 'react'
import { afterEach, describe, expect, it } from 'vitest'
import { CheckboxCards } from './CheckboxCards'
import { expectClassTokens } from './test-utils'

afterEach(cleanup)

function ControlledCheckboxCards({ showCheckbox = true }: { showCheckbox?: boolean }) {
  const [values, setValues] = React.useState<string[]>([])

  return (
    <>
      <CheckboxCards.Root value={values} onValueChange={setValues} showCheckbox={showCheckbox}>
        <CheckboxCards.Item value="widgets">Widgets</CheckboxCards.Item>
        <CheckboxCards.Item value="blocks">Blocks</CheckboxCards.Item>
      </CheckboxCards.Root>
      <output data-testid="selected">{values.join(',')}</output>
    </>
  )
}

describe('CheckboxCards', () => {
  it('toggles multiple cards from card-body clicks', async () => {
    const user = userEvent.setup()
    render(<ControlledCheckboxCards />)

    await user.click(screen.getByText('Widgets'))
    expect(screen.getByTestId('selected')).toHaveTextContent('widgets')

    await user.click(screen.getByText('Blocks'))
    expect(screen.getByTestId('selected')).toHaveTextContent('widgets,blocks')
  })

  it('toggles the third card in an uncontrolled group', async () => {
    const user = userEvent.setup()
    render(
      <CheckboxCards.Root defaultValue={['1']} columns="3" color="inverse">
        <CheckboxCards.Item value="1">Selected</CheckboxCards.Item>
        <CheckboxCards.Item value="2">Unselected</CheckboxCards.Item>
        <CheckboxCards.Item value="3">Unchecked</CheckboxCards.Item>
      </CheckboxCards.Root>,
    )

    const checkboxes = screen.getAllByRole('checkbox')

    expect(checkboxes[2]).toHaveAttribute('aria-checked', 'false')

    await user.click(screen.getByText('Unchecked'))

    expect(checkboxes[2]).toHaveAttribute('aria-checked', 'true')
  })

  it('can visually hide the checkbox control while keeping card selection working', async () => {
    const user = userEvent.setup()
    render(<ControlledCheckboxCards showCheckbox={false} />)

    const checkboxes = screen.getAllByRole('checkbox')
    checkboxes.forEach(checkbox => {
      expect(checkbox).toHaveClass('sr-only')
    })

    await user.click(screen.getByText('Widgets'))
    expect(screen.getByTestId('selected')).toHaveTextContent('widgets')
  })

  it('preserves custom grid-template column strings', () => {
    render(
      <CheckboxCards.Root columns="repeat(5, minmax(0, 1fr))">
        <CheckboxCards.Item value="widgets">Widgets</CheckboxCards.Item>
      </CheckboxCards.Root>,
    )

    const root = screen.getByRole('group')
    expect(root).toHaveStyle({ gridTemplateColumns: 'repeat(5, minmax(0, 1fr))' })
  })

  it('keeps the columns prop authoritative over inline grid-template styles', () => {
    render(
      <CheckboxCards.Root columns={3} style={{ gridTemplateColumns: 'repeat(9, minmax(0, 1fr))' }}>
        <CheckboxCards.Item value="widgets">Widgets</CheckboxCards.Item>
      </CheckboxCards.Root>,
    )

    const root = screen.getByRole('group')
    expect(root).toHaveStyle({ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' })
  })

  it('keeps item labels associated with their internal checkbox controls', () => {
    render(
      <CheckboxCards.Root>
        <CheckboxCards.Item value="widgets" htmlFor="external-control">
          Widgets
        </CheckboxCards.Item>
      </CheckboxCards.Root>,
    )

    const label = screen.getByText('Widgets').closest('label')
    const targetId = label?.getAttribute('for')

    expect(targetId).toBeTruthy()
    expect(targetId).not.toBe('external-control')
    expect(document.getElementById(targetId ?? '')).not.toBeNull()
  })

  it('uses direct checkbox-card spacing and control size classes', () => {
    render(
      <CheckboxCards.Root size="md" defaultValue={['widgets']}>
        <CheckboxCards.Item value="widgets">Widgets</CheckboxCards.Item>
      </CheckboxCards.Root>,
    )

    const label = screen.getByText('Widgets').closest('label')
    const checkbox = screen.getByRole('checkbox')
    const indicator = checkbox.firstElementChild

    expectClassTokens(label?.className, ['p-4', 'gap-3', 'text-base'])
    expectClassTokens(checkbox.className, ['box-border', 'h-5', 'w-5', 'rounded-[0.25rem]'])
    expectClassTokens(indicator?.className, ['h-4', 'w-4'])
    expect(label?.className).not.toContain('--af-radio-checkbox-card')
    expect(checkbox.className).not.toContain('--af-checkbox-card')
    expect(indicator?.className).not.toContain('--af-checkbox-card')
  })

  it('keeps the default sm card and checkbox on the shared form scale', () => {
    render(
      <CheckboxCards.Root defaultValue={['widgets']}>
        <CheckboxCards.Item value="widgets">Widgets</CheckboxCards.Item>
      </CheckboxCards.Root>,
    )

    const label = screen.getByText('Widgets').closest('label')
    const checkbox = screen.getByRole('checkbox')

    expectClassTokens(label?.className, ['p-3', 'gap-2', 'text-base', 'leading-6'])
    expectClassTokens(checkbox.className, ['box-border', 'h-4', 'w-4', 'rounded-[0.25rem]'])
  })

  it('uses the shared surface token classes for the card shell border', () => {
    render(
      <CheckboxCards.Root size="md" defaultValue={['widgets']}>
        <CheckboxCards.Item value="widgets">Widgets</CheckboxCards.Item>
      </CheckboxCards.Root>,
    )

    const label = screen.getByText('Widgets').closest('label')
    const shell = label?.querySelector('span[aria-hidden="true"]')

    expectClassTokens(shell?.className, [
      '[border-width:1px]',
      'border-solid',
      'border-neutral',
      'bg-neutral-surface',
      'text-neutral',
      'hover:bg-[var(--color-neutral-surface-hover)]',
    ])
    const shellTokens = new Set((shell?.className ?? '').split(/\s+/).filter(Boolean))
    expect(shellTokens).not.toContain('surface-color-neutral')
    expect(shellTokens).not.toContain('surface-variant-surface')
  })

  it('applies semantic text color to the visible card content', () => {
    render(
      <CheckboxCards.Root color="inverse" defaultValue={['widgets']}>
        <CheckboxCards.Item value="widgets">Widgets</CheckboxCards.Item>
      </CheckboxCards.Root>,
    )

    const content = screen.getByText('Widgets')

    expectClassTokens(content.className, ['text-inverse'])
  })

  it('uses the semantic contrast text lane for high-contrast card content', () => {
    render(
      <CheckboxCards.Root color="inverse" highContrast defaultValue={['widgets']}>
        <CheckboxCards.Item value="widgets">Widgets</CheckboxCards.Item>
      </CheckboxCards.Root>,
    )

    const content = screen.getByText('Widgets')

    expectClassTokens(content.className, ['text-inverse-contrast'])
  })
})
