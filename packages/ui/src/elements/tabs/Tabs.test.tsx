import '@testing-library/jest-dom/vitest'
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as React from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Tabs } from './Tabs'
import { partitionStackedPanels } from './tabs-children'
import { getMaxTransitionTime } from './tabs-transition'

afterEach(() => {
  vi.restoreAllMocks()
  cleanup()
})

function expectClassTokens(className: string | undefined, tokens: readonly string[]) {
  const classTokens = new Set((className ?? '').split(/\s+/).filter(Boolean))
  for (const token of tokens) {
    expect(classTokens).toContain(token)
  }
}

function expectNoClassToken(className: string | undefined, token: string) {
  const classTokens = new Set((className ?? '').split(/\s+/).filter(Boolean))
  expect(classTokens).not.toContain(token)
}

function mockTransitionStyle(transitionDuration: string, transitionDelay = '0s') {
  const originalGetComputedStyle = window.getComputedStyle.bind(window)

  return vi.spyOn(window, 'getComputedStyle').mockImplementation((element, pseudoElement) => {
    const style = originalGetComputedStyle(element, pseudoElement)
    return new Proxy(style, {
      get(target, property, receiver) {
        if (property === 'transitionDelay') return transitionDelay
        if (property === 'transitionDuration') return transitionDuration

        const value = Reflect.get(target, property, receiver)
        return typeof value === 'function' ? value.bind(target) : value
      },
    })
  })
}

describe('Tabs', () => {
  it('accounts for mismatched transition duration and delay lists', () => {
    const getComputedStyleSpy = mockTransitionStyle('50ms', '0ms, 250ms')

    expect(getMaxTransitionTime(document.createElement('div'))).toBe(300)
    getComputedStyleSpy.mockRestore()
  })

  it('normalizes whitespace around size, variant, and color', () => {
    render(
      <Tabs.Root defaultValue="a" size={' lg ' as any} variant={' surface ' as any} color={' info ' as any}>
        <Tabs.List data-testid="list">
          <Tabs.Trigger value="a">A</Tabs.Trigger>
        </Tabs.List>
      </Tabs.Root>,
    )

    const list = screen.getByTestId('list')
    expectClassTokens(list.className, ['h-10', 'p-0', 'gap-2.5'])
    const indicator = list.querySelector('[aria-hidden="true"]')
    expectClassTokens(indicator?.className, [
      '[background-color:var(--color-info-background)]',
      'border',
      'border-solid',
      'border-info',
    ])
  })

  it('falls back to defaults for invalid values', () => {
    render(
      <Tabs.Root defaultValue="a" size={'9' as any} variant={'bad' as any} color={'nope' as any}>
        <Tabs.List data-testid="list">
          <Tabs.Trigger value="a">A</Tabs.Trigger>
        </Tabs.List>
      </Tabs.Root>,
    )

    const list = screen.getByTestId('list')
    expectClassTokens(list.className, ['[height:calc(2rem_+_1px)]', 'gap-1', 'pb-px'])
    const indicator = list.querySelector('[aria-hidden="true"]')
    expectClassTokens(indicator?.className, ['bg-slate-solid'])
  })

  it('uses defaults when props are undefined', () => {
    render(
      <Tabs.Root defaultValue="a">
        <Tabs.List data-testid="list">
          <Tabs.Trigger value="a">A</Tabs.Trigger>
        </Tabs.List>
      </Tabs.Root>,
    )

    const list = screen.getByTestId('list')
    expectClassTokens(list.className, ['[height:calc(2rem_+_1px)]', 'gap-1', 'pb-px'])
    const indicator = list.querySelector('[aria-hidden="true"]')
    expectClassTokens(indicator?.className, ['bg-slate-solid'])
  })

  it('applies valid values and high-contrast styles', () => {
    render(
      <Tabs.Root defaultValue="a" size="xl" variant="surface" color="success" highContrast>
        <Tabs.List data-testid="list">
          <Tabs.Trigger value="a">A</Tabs.Trigger>
        </Tabs.List>
      </Tabs.Root>,
    )

    const list = screen.getByTestId('list')
    expectClassTokens(list.className, ['h-11', 'p-0', 'gap-[0.6875rem]'])
    const indicator = list.querySelector('[aria-hidden="true"]')
    expectClassTokens(indicator?.className, [
      '[background-color:var(--color-success-background)]',
      'border',
      'border-solid',
      'border-success',
    ])
    const trigger = screen.getByRole('tab', { name: 'A' })
    expectClassTokens(trigger.className, [
      'px-3.5',
      'h-11',
      '[padding-top:calc(0.5rem_+_2px)]',
      '[padding-bottom:calc(0.5rem_-_2px)]',
      'text-xl',
      'leading-7',
      '[color:var(--color-success-solid)]',
    ])
  })

  it('uses underline size classes for line variant triggers', () => {
    render(
      <Tabs.Root defaultValue="a" size="lg" variant="line">
        <Tabs.List>
          <Tabs.Trigger value="a">A</Tabs.Trigger>
        </Tabs.List>
      </Tabs.Root>,
    )

    const trigger = screen.getByRole('tab', { name: 'A' })
    expectClassTokens(trigger.className, [
      'px-3.5',
      '[padding-top:calc(0.4375rem_-_8px)]',
      'pb-2',
      'text-lg',
      'leading-[1.625rem]',
    ])
  })

  it('maps trigger sizing by variant consistently', () => {
    render(
      <>
        <Tabs.Root defaultValue="surface" size="md" variant="surface">
          <Tabs.List>
            <Tabs.Trigger value="surface">Surface Trigger</Tabs.Trigger>
          </Tabs.List>
        </Tabs.Root>
        <Tabs.Root defaultValue="line" size="md" variant="line">
          <Tabs.List>
            <Tabs.Trigger value="line">Line Trigger</Tabs.Trigger>
          </Tabs.List>
        </Tabs.Root>
      </>,
    )

    const surfaceTrigger = screen.getByRole('tab', { name: 'Surface Trigger' })
    const lineTrigger = screen.getByRole('tab', { name: 'Line Trigger' })

    expectClassTokens(surfaceTrigger.className, [
      'px-3',
      'h-8',
      '[padding-top:calc(0.25rem_+_2px)]',
      '[padding-bottom:calc(0.25rem_-_2px)]',
      'text-base',
      'leading-6',
    ])
    expectClassTokens(lineTrigger.className, [
      'px-3',
      '[padding-top:calc(0.25rem_-_8px)]',
      'pb-2',
      'text-base',
      'leading-6',
    ])
  })

  it('enables hover classes by default and allows disabling them', () => {
    const { rerender } = render(
      <Tabs.Root defaultValue="a">
        <Tabs.List>
          <Tabs.Trigger value="a">A</Tabs.Trigger>
          <Tabs.Trigger value="b">B</Tabs.Trigger>
        </Tabs.List>
      </Tabs.Root>,
    )

    const trigger = screen.getByRole('tab', { name: 'B' })
    expectClassTokens(trigger.className, ['enabled:hover:text-neutral'])
    expect(trigger.className).toContain('enabled:cursor-pointer')

    rerender(
      <Tabs.Root defaultValue="a" hover={false}>
        <Tabs.List>
          <Tabs.Trigger value="a">A</Tabs.Trigger>
          <Tabs.Trigger value="b">B</Tabs.Trigger>
        </Tabs.List>
      </Tabs.Root>,
    )

    expect(trigger.className).toContain('cursor-default')
    expectNoClassToken(trigger.className, 'enabled:hover:text-neutral')
  })

  it('renders configured icons and shows a tooltip for icon-only tabs', async () => {
    const user = userEvent.setup()

    render(
      <Tabs.Root
        defaultValue="phone"
        icons={{
          position: 'only',
          icons: [
            { value: 'phone', icon: 'phone' },
            { value: 'email', icon: 'mail' },
          ],
        }}
      >
        <Tabs.List>
          <Tabs.Trigger value="phone">Phone</Tabs.Trigger>
          <Tabs.Trigger value="email">Email</Tabs.Trigger>
        </Tabs.List>
      </Tabs.Root>,
    )

    const tab = screen.getByRole('tab', { name: 'Phone' })
    expect(tab).toHaveAttribute('aria-label', 'Phone')

    await waitFor(() => {
      expect(tab.querySelector('svg')).toBeInTheDocument()
    })

    await user.hover(tab)
    await waitFor(() => {
      expect(screen.getAllByText('Phone').length).toBeGreaterThan(1)
    })
  })

  it('keeps only active and exiting animated panels in a stable grid stack', async () => {
    const user = userEvent.setup()
    const getComputedStyleSpy = mockTransitionStyle('200ms')
    const { container } = render(
      <Tabs.Root animated defaultValue="a">
        <Tabs.List>
          <Tabs.Trigger value="a">A</Tabs.Trigger>
          <Tabs.Trigger value="b">B</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="a">A panel</Tabs.Content>
        <Tabs.Content value="b">B panel</Tabs.Content>
      </Tabs.Root>,
    )

    const getPanels = () => Array.from(container.querySelectorAll('[role="tabpanel"]'))
    expect(getPanels()).toHaveLength(1)
    expectClassTokens(getPanels()[0]?.parentElement?.className, ['grid', 'min-w-0'])
    expectClassTokens(getPanels()[0]?.className, ['col-start-1', 'row-start-1', 'opacity-100', 'z-0'])

    await user.click(screen.getByRole('tab', { name: 'B' }))

    const panels = getPanels()
    expect(panels).toHaveLength(2)
    expectClassTokens(panels[0]?.className, ['opacity-0', 'pointer-events-none', 'z-10'])
    expect(panels[0]).toHaveAttribute('aria-hidden', 'true')
    expectClassTokens(panels[1]?.className, ['opacity-100', 'z-0'])
    expect(panels[1]).not.toHaveAttribute('aria-hidden')

    fireEvent.transitionEnd(panels[0] as Element)
    expect(getPanels()).toHaveLength(1)
    expect(getPanels()[0]).toHaveTextContent('B panel')
    getComputedStyleSpy.mockRestore()
  })

  it('keeps animated inactive panel guards authoritative over caller props', async () => {
    const user = userEvent.setup()
    const getComputedStyleSpy = mockTransitionStyle('200ms')
    const unsafePanelProps = { 'aria-hidden': false, inert: false, tabIndex: 0 } as any
    const { container } = render(
      <Tabs.Root animated defaultValue="a">
        <Tabs.List>
          <Tabs.Trigger value="a">A</Tabs.Trigger>
          <Tabs.Trigger value="b">B</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="a" {...unsafePanelProps}>
          A panel
        </Tabs.Content>
        <Tabs.Content value="b">B panel</Tabs.Content>
      </Tabs.Root>,
    )

    await user.click(screen.getByRole('tab', { name: 'B' }))

    const exitingPanel = Array.from(container.querySelectorAll('[role="tabpanel"]'))[0]
    expect(exitingPanel).toHaveAttribute('aria-hidden', 'true')
    expect(exitingPanel).toHaveAttribute('inert')
    expect(exitingPanel).toHaveAttribute('tabindex', '-1')
    getComputedStyleSpy.mockRestore()
  })

  it('stacks animated content panels inside fragments', () => {
    const { container } = render(
      <Tabs.Root animated defaultValue="a">
        <Tabs.List>
          <Tabs.Trigger value="a">A</Tabs.Trigger>
          <Tabs.Trigger value="b">B</Tabs.Trigger>
        </Tabs.List>
        <>
          <Tabs.Content value="a">A panel</Tabs.Content>
          <Tabs.Content value="b">B panel</Tabs.Content>
        </>
      </Tabs.Root>,
    )

    const panels = Array.from(container.querySelectorAll('[role="tabpanel"]'))
    expect(panels).toHaveLength(1)
    expectClassTokens(panels[0]?.parentElement?.className, ['grid', 'min-w-0'])
    expectClassTokens(panels[0]?.className, ['col-start-1', 'row-start-1', 'opacity-100', 'z-0'])
  })

  it('scopes stacked panel keys inside separate fragments', () => {
    const { panels } = partitionStackedPanels(
      <>
        <>
          <Tabs.Content value="a">A panel</Tabs.Content>
        </>
        <>
          <Tabs.Content value="b">B panel</Tabs.Content>
        </>
      </>,
      Tabs.Content,
    )
    const keys = panels.map(panel => (React.isValidElement(panel) ? panel.key : null))

    expect(new Set(keys).size).toBe(keys.length)
  })

  it('does not apply animated stack classes to content hidden behind a wrapper component', async () => {
    const user = userEvent.setup()

    function WrappedPanels() {
      return (
        <>
          <Tabs.Content value="a">A panel</Tabs.Content>
          <Tabs.Content value="b">B panel</Tabs.Content>
        </>
      )
    }

    const { container } = render(
      <Tabs.Root animated defaultValue="a">
        <Tabs.List>
          <Tabs.Trigger value="a">A</Tabs.Trigger>
          <Tabs.Trigger value="b">B</Tabs.Trigger>
        </Tabs.List>
        <WrappedPanels />
      </Tabs.Root>,
    )

    const getPanels = () => Array.from(container.querySelectorAll('[role="tabpanel"]'))
    expect(getPanels()).toHaveLength(1)
    expectNoClassToken(getPanels()[0]?.className, 'col-start-1')
    expectNoClassToken(getPanels()[0]?.className, 'opacity-100')

    await user.click(screen.getByRole('tab', { name: 'B' }))

    expect(getPanels()).toHaveLength(1)
    expect(getPanels()[0]).toHaveTextContent('B panel')
    expectNoClassToken(getPanels()[0]?.className, 'col-start-1')
    expectNoClassToken(getPanels()[0]?.className, 'opacity-100')
  })

  it('cleans up animated panels when transitions are disabled', async () => {
    const user = userEvent.setup()
    const getComputedStyleSpy = mockTransitionStyle('0s')
    const { container } = render(
      <Tabs.Root animated defaultValue="a">
        <Tabs.List>
          <Tabs.Trigger value="a">A</Tabs.Trigger>
          <Tabs.Trigger value="b">B</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="a">A panel</Tabs.Content>
        <Tabs.Content value="b">B panel</Tabs.Content>
      </Tabs.Root>,
    )

    await user.click(screen.getByRole('tab', { name: 'B' }))

    await waitFor(() => {
      const panels = Array.from(container.querySelectorAll('[role="tabpanel"]'))
      expect(panels).toHaveLength(1)
      expect(panels[0]).toHaveTextContent('B panel')
    })
    getComputedStyleSpy.mockRestore()
  })
})
