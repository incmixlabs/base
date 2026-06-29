import { cleanup, render } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { Filter } from './Filter'
import type { FilterField, FilterState } from './filter.props'

afterEach(() => {
  cleanup()
})

function hasClassTokens(className: unknown, tokens: readonly string[]) {
  if (typeof className !== 'string') return false
  const classTokens = new Set(className.split(/\s+/).filter(Boolean))
  return tokens.every(token => classTokens.has(token))
}

function findElementWithClassTokens(container: HTMLElement, tokens: readonly string[]) {
  return Array.from(container.querySelectorAll<HTMLElement>('*')).find(element =>
    hasClassTokens(element.className, tokens),
  )
}

describe('Filter', () => {
  it('renders the utility class contract without legacy global filter classes', () => {
    const fields: FilterField<Record<string, unknown>>[] = [
      {
        id: 'latency',
        label: 'Latency',
        type: 'slider',
        min: 0,
        max: 100,
        defaultOpen: true,
      },
    ]
    const value: FilterState = [{ id: 'latency', value: [10, 90] }]

    const { container } = render(
      <Filter filterFields={fields} value={value} onValueChange={() => undefined} applyMode="manual" />,
    )

    expect(findElementWithClassTokens(container, ['border-b', 'border-solid', 'border-neutral', 'pb-3'])).toBeTruthy()
    expect(findElementWithClassTokens(container, ['border-b', 'border-solid', 'border-neutral', 'py-3'])).toBeTruthy()
    expect(
      findElementWithClassTokens(container, ['min-h-0', 'overflow-x-hidden', 'overflow-y-auto', 'py-1']),
    ).toBeTruthy()
    expect(
      findElementWithClassTokens(container, [
        'mt-auto',
        'border-t',
        'border-solid',
        'border-neutral',
        'bg-neutral-surface',
        'pt-3',
      ]),
    ).toBeTruthy()
    expect(
      findElementWithClassTokens(container, ['text-xs', 'leading-4', 'text-neutral', 'opacity-[0.72]']),
    ).toBeTruthy()
    expect(container.innerHTML).not.toContain('af-filter-')
  })
})
