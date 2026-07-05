import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { expectClassTokens } from '@/test/class-name-utils'
import { Timeline } from './Timeline'

afterEach(() => {
  cleanup()
})

function renderTimeline() {
  return render(
    <Timeline.Root value={2} color="success" size="md" variant="outline">
      <Timeline.Item step={1} data-testid="timeline-item-1">
        <Timeline.Indicator />
        <Timeline.Separator />
        <Timeline.Header>
          <Timeline.Title>Order placed</Timeline.Title>
          <Timeline.Date>Jan 12, 2026</Timeline.Date>
        </Timeline.Header>
        <Timeline.Content>Confirmed.</Timeline.Content>
      </Timeline.Item>
      <Timeline.Item step={2} data-testid="timeline-item-2">
        <Timeline.Indicator />
        <Timeline.Separator />
        <Timeline.Header>
          <Timeline.Title>Payment confirmed</Timeline.Title>
          <Timeline.Date>Jan 12, 2026</Timeline.Date>
        </Timeline.Header>
        <Timeline.Content>Paid.</Timeline.Content>
      </Timeline.Item>
      <Timeline.Item step={3} data-testid="timeline-item-3">
        <Timeline.Indicator />
        <Timeline.Separator />
        <Timeline.Header>
          <Timeline.Title>Shipped</Timeline.Title>
          <Timeline.Date>Jan 14, 2026</Timeline.Date>
        </Timeline.Header>
        <Timeline.Content>In transit.</Timeline.Content>
      </Timeline.Item>
    </Timeline.Root>,
  )
}

describe('Timeline', () => {
  it('renders the utility class contract for vertical timeline items', () => {
    const { container } = renderTimeline()

    const root = container.firstElementChild
    const firstItem = screen.getByTestId('timeline-item-1')
    const activeItem = screen.getByTestId('timeline-item-2')
    const indicators = Array.from(container.querySelectorAll('[data-state]'))
    const separators = Array.from(container.querySelectorAll('[data-timeline-separator]'))

    expectClassTokens(root?.className, ['flex', 'flex-col', '[&>*:last-child>[data-timeline-separator]]:hidden'])
    expectClassTokens(firstItem.className, [
      '[margin-inline-start:2.25rem]',
      '[padding-block-end:1.5rem]',
      'last:[padding-block-end:0]',
      'gap-1',
    ])
    expectClassTokens(indicators[0]?.className, [
      'absolute',
      'inline-flex',
      'rounded-full',
      'border-2',
      'border-success',
      'text-success',
      'bg-transparent',
      'h-[1.125rem]',
      'w-[1.125rem]',
      'left-[-2.25rem]',
      'top-0.5',
      'translate-x-1/2',
    ])
    expect(indicators[0]).toHaveAttribute('data-state', 'completed')
    expect(indicators[1]).toHaveAttribute('data-state', 'active')
    expect(activeItem).toHaveAttribute('aria-current', 'step')
    expectClassTokens(separators[0]?.className, [
      'absolute',
      'bottom-0',
      'left-[calc(-2.25rem_+_1.125rem_-_1px)]',
      'top-[1.375rem]',
      'w-0.5',
      'bg-success-solid',
    ])
    expectClassTokens(separators[1]?.className, ['bg-[var(--color-neutral-border)]'])
    expect(root?.className).not.toContain('Timeline_')
  })

  it('renders horizontal size geometry from class maps', () => {
    const { container } = render(
      <Timeline.Root value={1} orientation="horizontal" size="xs">
        <Timeline.Item step={1} data-testid="timeline-item">
          <Timeline.Indicator />
          <Timeline.Separator />
          <Timeline.Title>Placed</Timeline.Title>
        </Timeline.Item>
      </Timeline.Root>,
    )

    const root = container.firstElementChild
    const item = screen.getByTestId('timeline-item')
    const indicator = container.querySelector('[data-state]')
    const separator = container.querySelector('[data-timeline-separator]')

    expectClassTokens(root?.className, ['flex-row'])
    expectClassTokens(item.className, ['flex-1', '[margin-block-start:1.75rem]', '[padding-inline-end:2rem]'])
    expectClassTokens(indicator?.className, ['h-3', 'w-3', 'left-0', 'top-[-1.75rem]', 'translate-y-1/2'])
    expectClassTokens(separator?.className, ['h-0.5', 'left-4', 'right-0'])
  })
})
