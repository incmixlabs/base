import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as React from 'react'
import { afterEach, describe, expect, it } from 'vitest'
import { CheckboxCards } from './CheckboxCards'

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
})
