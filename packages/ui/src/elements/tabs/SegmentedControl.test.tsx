import '@testing-library/jest-dom/vitest'
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { expectClassTokens, expectNoClassToken } from '@/test/class-name-utils'
import { SegmentedControl } from './SegmentedControl'

afterEach(() => {
  vi.restoreAllMocks()
  cleanup()
})

function mockTransitionStyle(transitionDuration: string) {
  const originalGetComputedStyle = window.getComputedStyle.bind(window)

  return vi.spyOn(window, 'getComputedStyle').mockImplementation((element, pseudoElement) => {
    const style = originalGetComputedStyle(element, pseudoElement)
    return new Proxy(style, {
      get(target, property, receiver) {
        if (property === 'transitionDelay') return '0s'
        if (property === 'transitionDuration') return transitionDuration

        const value = Reflect.get(target, property, receiver)
        return typeof value === 'function' ? value.bind(target) : value
      },
    })
  })
}

describe('SegmentedControl', () => {
  it('normalizes whitespace around size, variant, and color', () => {
    render(
      <SegmentedControl.Root
        data-testid="segmented"
        value="a"
        size={' xl ' as any}
        variant={' underline ' as any}
        color={' info ' as any}
      >
        <SegmentedControl.Item value="a">A</SegmentedControl.Item>
        <SegmentedControl.Item value="b">B</SegmentedControl.Item>
      </SegmentedControl.Root>,
    )

    const root = screen.getByTestId('segmented')
    expectClassTokens(root.className, ['[height:calc(2.75rem_+_1px)]', 'gap-[0.6875rem]', 'pb-px'])
    const indicator = root.querySelector('[aria-hidden="true"]')
    expectClassTokens(indicator?.className, ['bg-info-solid'])
  })

  it('falls back to defaults for invalid values', () => {
    render(
      <SegmentedControl.Root
        data-testid="segmented"
        value="a"
        size={'9' as any}
        radius={'bad' as any}
        variant={'bad' as any}
        color={'nope' as any}
      >
        <SegmentedControl.Item value="a">A</SegmentedControl.Item>
        <SegmentedControl.Item value="b">B</SegmentedControl.Item>
      </SegmentedControl.Root>,
    )

    const root = screen.getByTestId('segmented')
    expectClassTokens(root.className, ['h-8', 'p-0', 'gap-2', 'rounded-none'])
    const indicator = root.querySelector('[aria-hidden="true"]')
    expectClassTokens(indicator?.className, [
      'rounded-none',
      '[background-color:var(--color-slate-background)]',
      'border',
      'border-solid',
      'border-slate',
    ])
    expectClassTokens(screen.getByRole('radio', { name: 'A' }).className, ['rounded-none'])
  })

  it('uses no radius by default for the surface root, indicator, and items', () => {
    render(
      <SegmentedControl.Root data-testid="segmented" value="a">
        <SegmentedControl.Item value="a">A</SegmentedControl.Item>
        <SegmentedControl.Item value="b">B</SegmentedControl.Item>
      </SegmentedControl.Root>,
    )

    const root = screen.getByTestId('segmented')
    expectClassTokens(root.className, ['rounded-none'])
    expectClassTokens(root.querySelector('[aria-hidden="true"]')?.className, ['rounded-none'])
    expectClassTokens(screen.getByRole('radio', { name: 'A' }).className, ['rounded-none'])
    expectClassTokens(screen.getByRole('radio', { name: 'B' }).className, ['rounded-none'])
  })

  it('applies the same explicit surface radius to the root, indicator, and items', () => {
    render(
      <SegmentedControl.Root data-testid="segmented" value="a" radius="lg">
        <SegmentedControl.Item value="a">A</SegmentedControl.Item>
        <SegmentedControl.Item value="b">B</SegmentedControl.Item>
      </SegmentedControl.Root>,
    )

    const root = screen.getByTestId('segmented')
    expectClassTokens(root.className, ['rounded-lg'])
    expectClassTokens(root.querySelector('[aria-hidden="true"]')?.className, ['rounded-lg'])
    expectClassTokens(screen.getByRole('radio', { name: 'A' }).className, ['rounded-lg'])
    expectClassTokens(screen.getByRole('radio', { name: 'B' }).className, ['rounded-lg'])
  })

  it('applies high-contrast styles for selected items', () => {
    render(
      <SegmentedControl.Root data-testid="segmented" value="a" color="success" highContrast>
        <SegmentedControl.Item value="a">A</SegmentedControl.Item>
        <SegmentedControl.Item value="b">B</SegmentedControl.Item>
      </SegmentedControl.Root>,
    )

    const selected = screen.getByRole('radio', { name: 'A' })
    expectClassTokens(selected.className, ['[color:var(--color-success-solid)]'])
  })

  it('enables hover classes by default and allows disabling them', () => {
    const { rerender } = render(
      <SegmentedControl.Root value="a">
        <SegmentedControl.Item value="a">A</SegmentedControl.Item>
        <SegmentedControl.Item value="b">B</SegmentedControl.Item>
      </SegmentedControl.Root>,
    )

    const item = screen.getByRole('radio', { name: 'B' })
    expectClassTokens(item.className, ['enabled:hover:bg-neutral-soft'])
    expect(item.className).toContain('enabled:cursor-pointer')

    rerender(
      <SegmentedControl.Root value="a" hover={false}>
        <SegmentedControl.Item value="a">A</SegmentedControl.Item>
        <SegmentedControl.Item value="b">B</SegmentedControl.Item>
      </SegmentedControl.Root>,
    )

    expect(item.className).toContain('cursor-default')
    expectNoClassToken(item.className, 'enabled:hover:bg-neutral-soft')
  })

  it('renders configured icons and shows a tooltip for icon-only items', async () => {
    const user = userEvent.setup()

    render(
      <SegmentedControl.Root
        value="phone"
        icons={{
          position: 'only',
          icons: [
            { value: 'phone', icon: 'phone' },
            { value: 'email', icon: 'mail' },
          ],
        }}
      >
        <SegmentedControl.Item value="phone">Phone</SegmentedControl.Item>
        <SegmentedControl.Item value="email">Email</SegmentedControl.Item>
      </SegmentedControl.Root>,
    )

    const phoneItem = screen.getByRole('radio', { name: 'Phone' })
    expect(phoneItem).toHaveAttribute('aria-label', 'Phone')

    await waitFor(() => {
      expect(phoneItem.querySelector('svg')).toBeInTheDocument()
    })

    await user.hover(phoneItem)
    await waitFor(() => {
      expect(screen.getAllByText('Phone').length).toBeGreaterThan(1)
    })
  })

  it('keeps only active and exiting animated content panels in a stable grid stack', async () => {
    const user = userEvent.setup()
    const getComputedStyleSpy = mockTransitionStyle('200ms')
    const { container } = render(
      <SegmentedControl.Root animated defaultValue="a">
        <SegmentedControl.Item value="a">A</SegmentedControl.Item>
        <SegmentedControl.Item value="b">B</SegmentedControl.Item>
        <SegmentedControl.Content value="a">A panel</SegmentedControl.Content>
        <SegmentedControl.Content value="b">B panel</SegmentedControl.Content>
      </SegmentedControl.Root>,
    )

    const getPanels = () => Array.from(container.querySelectorAll('[role="tabpanel"]'))
    expect(getPanels()).toHaveLength(1)
    expectClassTokens(getPanels()[0]?.parentElement?.className, ['grid', 'min-w-0'])
    expectClassTokens(getPanels()[0]?.className, ['col-start-1', 'row-start-1', 'opacity-100', 'z-0'])

    await user.click(screen.getByRole('radio', { name: 'B' }))

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
      <SegmentedControl.Root animated defaultValue="a">
        <SegmentedControl.Item value="a">A</SegmentedControl.Item>
        <SegmentedControl.Item value="b">B</SegmentedControl.Item>
        <SegmentedControl.Content value="a" {...unsafePanelProps}>
          A panel
        </SegmentedControl.Content>
        <SegmentedControl.Content value="b">B panel</SegmentedControl.Content>
      </SegmentedControl.Root>,
    )

    await user.click(screen.getByRole('radio', { name: 'B' }))

    const exitingPanel = Array.from(container.querySelectorAll('[role="tabpanel"]'))[0]
    expect(exitingPanel).toHaveAttribute('aria-hidden', 'true')
    expect(exitingPanel).toHaveAttribute('inert')
    expect(exitingPanel).toHaveAttribute('tabindex', '-1')
    getComputedStyleSpy.mockRestore()
  })

  it('stacks animated content panels inside fragments', () => {
    const { container } = render(
      <SegmentedControl.Root animated defaultValue="a">
        <SegmentedControl.Item value="a">A</SegmentedControl.Item>
        <SegmentedControl.Item value="b">B</SegmentedControl.Item>
        <>
          <SegmentedControl.Content value="a">A panel</SegmentedControl.Content>
          <SegmentedControl.Content value="b">B panel</SegmentedControl.Content>
        </>
      </SegmentedControl.Root>,
    )

    const panels = Array.from(container.querySelectorAll('[role="tabpanel"]'))
    expect(panels).toHaveLength(1)
    expectClassTokens(panels[0]?.parentElement?.className, ['grid', 'min-w-0'])
    expectClassTokens(panels[0]?.className, ['col-start-1', 'row-start-1', 'opacity-100', 'z-0'])
  })

  it('does not apply animated stack classes to content hidden behind a wrapper component', async () => {
    const user = userEvent.setup()

    function WrappedPanels() {
      return (
        <>
          <SegmentedControl.Content value="a">A panel</SegmentedControl.Content>
          <SegmentedControl.Content value="b">B panel</SegmentedControl.Content>
        </>
      )
    }

    const { container } = render(
      <SegmentedControl.Root animated defaultValue="a">
        <SegmentedControl.Item value="a">A</SegmentedControl.Item>
        <SegmentedControl.Item value="b">B</SegmentedControl.Item>
        <WrappedPanels />
      </SegmentedControl.Root>,
    )

    const getPanels = () => Array.from(container.querySelectorAll('[role="tabpanel"]'))
    expect(getPanels()).toHaveLength(1)
    expectNoClassToken(getPanels()[0]?.className, 'col-start-1')
    expectNoClassToken(getPanels()[0]?.className, 'opacity-100')

    await user.click(screen.getByRole('radio', { name: 'B' }))

    expect(getPanels()).toHaveLength(1)
    expect(getPanels()[0]).toHaveTextContent('B panel')
    expectNoClassToken(getPanels()[0]?.className, 'col-start-1')
    expectNoClassToken(getPanels()[0]?.className, 'opacity-100')
  })

  it('cleans up animated content panels when transitions are disabled', async () => {
    const user = userEvent.setup()
    const getComputedStyleSpy = mockTransitionStyle('0s')
    const { container } = render(
      <SegmentedControl.Root animated defaultValue="a">
        <SegmentedControl.Item value="a">A</SegmentedControl.Item>
        <SegmentedControl.Item value="b">B</SegmentedControl.Item>
        <SegmentedControl.Content value="a">A panel</SegmentedControl.Content>
        <SegmentedControl.Content value="b">B panel</SegmentedControl.Content>
      </SegmentedControl.Root>,
    )

    await user.click(screen.getByRole('radio', { name: 'B' }))

    await waitFor(() => {
      const panels = Array.from(container.querySelectorAll('[role="tabpanel"]'))
      expect(panels).toHaveLength(1)
      expect(panels[0]).toHaveTextContent('B panel')
    })
    getComputedStyleSpy.mockRestore()
  })
})
