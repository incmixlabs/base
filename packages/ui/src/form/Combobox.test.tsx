import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import { Combobox } from './Combobox'

afterEach(() => {
  cleanup()
})

function expectClassTokens(className: string | undefined, tokens: readonly string[]) {
  const classTokens = new Set((className ?? '').split(/\s+/).filter(Boolean))
  for (const token of tokens) {
    expect(classTokens).toContain(token)
  }
}

describe('Combobox', () => {
  const frameworkOptions = [
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue' },
    { value: 'angular', label: 'Angular' },
  ]

  it('renders options inside the shared picker popup surface', async () => {
    const user = userEvent.setup()

    render(
      <Combobox
        ariaLabelledby="framework-label"
        options={[
          { value: 'react', label: 'React' },
          { value: 'vue', label: 'Vue' },
        ]}
        placeholder="Search frameworks..."
      />,
    )

    await user.click(screen.getByRole('combobox'))

    const listbox = await screen.findByRole('listbox')
    const popup = listbox.parentElement
    const reactOption = screen.getByRole('option', { name: 'React' })
    const vueOption = screen.getByRole('option', { name: 'Vue' })

    expectClassTokens(popup?.className, [
      'border',
      'border-neutral',
      'bg-neutral-surface',
      'text-neutral',
      '[box-shadow:var(--shadow-2)]',
    ])
    expectClassTokens(listbox.className, [
      'overflow-y-auto',
      'max-h-[var(--af-picker-popup-size-md-viewport-max-height,13.5rem)]',
      'p-[var(--af-picker-popup-size-md-popup-padding,0.25rem)]',
    ])
    expectClassTokens(reactOption.className, [
      'appearance-none',
      'border-0',
      'bg-accent-soft',
      'text-accent',
      'hover:bg-accent-soft',
      'focus:bg-accent-soft',
    ])
    expectClassTokens(vueOption.className, ['appearance-none', 'border-0', 'bg-transparent'])

    expect(popup?.className).not.toContain('bg-popover')
    expect(popup?.className).not.toContain('text-popover-foreground')
    expect(reactOption.className).not.toContain('border-input')
  })

  it('opens the full option list from a selected value and marks the selection', async () => {
    const user = userEvent.setup()

    render(<Combobox ariaLabelledby="framework-label" options={frameworkOptions} value="vue" />)

    const input = screen.getByRole('combobox')
    expect(input).toHaveValue('Vue')
    expect(input).toHaveAttribute('autocomplete', 'off')

    await user.click(screen.getByRole('button', { name: 'Show options' }))

    expect(await screen.findByRole('option', { name: 'React' })).toBeInTheDocument()
    const selectedOption = screen.getByRole('option', { name: 'Vue' })
    expect(screen.getByRole('option', { name: 'Angular' })).toBeInTheDocument()
    expect(selectedOption).toHaveAttribute('aria-selected', 'true')
    expectClassTokens(selectedOption.className, ['bg-accent-soft', 'text-accent'])
    expect(selectedOption.querySelector('svg')).toBeInTheDocument()

    await user.clear(input)
    await user.type(input, 'ang')

    expect(screen.queryByRole('option', { name: 'React' })).not.toBeInTheDocument()
    expect(screen.queryByRole('option', { name: 'Vue' })).not.toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Angular' })).toBeInTheDocument()
  })
})
