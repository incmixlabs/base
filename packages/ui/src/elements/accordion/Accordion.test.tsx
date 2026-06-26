import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { Accordion } from './Accordion'
import {
  accordionContentBase,
  accordionContentPaddingless,
  accordionContentSizeVariants,
  accordionRootBorderless,
  accordionTextSizeVariants,
  accordionTriggerPaddingless,
  accordionTriggerSizeVariants,
} from './accordion.class'
import { accordionRootPropDefs } from './accordion.props'

afterEach(() => {
  cleanup()
})

describe('Accordion', () => {
  const compactSize = accordionRootPropDefs.size.values[1]

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
      <Accordion.Root defaultValue={['details']} size={compactSize}>
        <Accordion.Item value="details">
          <Accordion.Trigger>Details</Accordion.Trigger>
          <Accordion.Content fill data-testid="fill-panel">
            Panel content
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>,
    )

    const panel = screen.getByTestId('fill-panel')
    expect(panel).toHaveClass(
      accordionContentBase,
      accordionTextSizeVariants[compactSize],
      'flex',
      'h-full',
      'min-h-0',
      'flex-1',
      'flex-col',
    )
    expect(panel).toHaveTextContent('Panel content')
    expect(panel.firstElementChild).toHaveClass(
      accordionContentSizeVariants[compactSize],
      'flex',
      'h-full',
      'min-h-0',
      'flex-1',
      'flex-col',
    )
  })

  it('does not apply fill classes on the animated content path', () => {
    render(
      <Accordion.Root defaultValue={['details']} size={compactSize}>
        <Accordion.Item value="details">
          <Accordion.Trigger>Details</Accordion.Trigger>
          <Accordion.Content data-testid="animated-panel">Panel content</Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>,
    )

    const panel = screen.getByTestId('animated-panel')
    expect(panel).toHaveClass(accordionContentBase, accordionTextSizeVariants[compactSize])
    expect(panel).not.toHaveClass('flex')
    expect(panel).not.toHaveClass('h-full')
    expect(panel).not.toHaveClass('flex-1')
    expect(panel).not.toHaveClass('flex-col')
    expect(panel.firstElementChild).toHaveClass(accordionContentSizeVariants[compactSize])
    expect(panel.firstElementChild).not.toHaveClass('flex')
    expect(panel.firstElementChild).not.toHaveClass('h-full')
    expect(panel.firstElementChild).not.toHaveClass('flex-1')
    expect(panel.firstElementChild).not.toHaveClass('flex-col')
  })

  it('uses prop-def size maps for trigger and content spacing', () => {
    render(
      <Accordion.Root defaultValue={['details']} size={compactSize}>
        <Accordion.Item value="details">
          <Accordion.Trigger>Details</Accordion.Trigger>
          <Accordion.Content data-testid="panel">Panel content</Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>,
    )

    expect(screen.getByRole('button', { name: 'Details' })).toHaveClass(
      accordionTextSizeVariants[compactSize],
      accordionTriggerSizeVariants[compactSize],
    )
    expect(screen.getByTestId('panel').firstElementChild).toHaveClass(accordionContentSizeVariants[compactSize])
  })

  it('applies borderless and paddingless utility classes from root props', () => {
    render(
      <Accordion.Root
        border={false}
        triggerPadding={false}
        contentPadding={false}
        defaultValue={['details']}
        data-testid="accordion-root"
      >
        <Accordion.Item value="details">
          <Accordion.Trigger>Details</Accordion.Trigger>
          <Accordion.Content data-testid="panel">Panel content</Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>,
    )

    expect(screen.getByTestId('accordion-root')).toHaveClass(
      'overflow-hidden',
      'rounded-[var(--element-border-radius)]',
      'border-neutral',
      'bg-neutral-surface',
      accordionRootBorderless,
    )
    expect(screen.getByRole('button', { name: 'Details' })).toHaveClass(accordionTriggerPaddingless)
    expect(screen.getByTestId('panel').firstElementChild).toHaveClass(accordionContentPaddingless)
  })
})
