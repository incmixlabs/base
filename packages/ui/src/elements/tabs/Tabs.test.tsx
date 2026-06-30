import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import { Tabs } from './Tabs'

afterEach(() => {
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

describe('Tabs', () => {
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
      '[color:var(--color-success-primary)]',
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
})
