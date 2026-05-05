import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { Accordion } from './Accordion'
import { accordionContentBase, accordionSizeVars } from './Accordion.css'

afterEach(() => {
  cleanup()
})

describe('Accordion', () => {
  it('does not render fill content while the item is closed', () => {
    render(
      <Accordion.Root>
        <Accordion.Item value="details">
          <Accordion.Trigger>Details</Accordion.Trigger>
          <Accordion.Content fill data-testid="fill-panel">
            Panel content
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>,
    )

    expect(screen.queryByTestId('fill-panel')).not.toBeInTheDocument()
  })

  it('renders fill content with fill-specific classes while the item is open', () => {
    render(
      <Accordion.Root defaultValue={['details']} size="sm">
        <Accordion.Item value="details">
          <Accordion.Trigger>Details</Accordion.Trigger>
          <Accordion.Content fill data-testid="fill-panel">
            Panel content
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>,
    )

    const panel = screen.getByTestId('fill-panel')
    expect(panel).toHaveClass(accordionContentBase, 'flex', 'h-full', 'min-h-0', 'flex-1', 'flex-col')
    expect(panel).toHaveTextContent('Panel content')
    expect(panel.firstElementChild).toHaveClass(accordionSizeVars.sm, 'flex', 'h-full', 'min-h-0', 'flex-1', 'flex-col')
  })

  it('does not apply fill classes on the animated content path', () => {
    render(
      <Accordion.Root defaultValue={['details']} size="sm">
        <Accordion.Item value="details">
          <Accordion.Trigger>Details</Accordion.Trigger>
          <Accordion.Content data-testid="animated-panel">Panel content</Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>,
    )

    const panel = screen.getByTestId('animated-panel')
    expect(panel).toHaveClass(accordionContentBase)
    expect(panel).not.toHaveClass('flex')
    expect(panel).not.toHaveClass('h-full')
    expect(panel).not.toHaveClass('flex-1')
    expect(panel).not.toHaveClass('flex-col')
    expect(panel.firstElementChild).toHaveClass(accordionSizeVars.sm)
    expect(panel.firstElementChild).not.toHaveClass('flex')
    expect(panel.firstElementChild).not.toHaveClass('h-full')
    expect(panel.firstElementChild).not.toHaveClass('flex-1')
    expect(panel.firstElementChild).not.toHaveClass('flex-col')
  })
})
