import { act, cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { CalendarWithPricing, type DayPrice } from './CalendarWithPricing'

const CALENDAR_WITH_PRICING_TEST_TIMEOUT_MS = 15_000

afterEach(() => {
  cleanup()
})

const march2026 = new Date(2026, 2, 1)

/**
 * Match aria-label like "Sunday, March 1, 2026, $100".
 * Uses negative lookahead after the day number to avoid "March 1" matching "March 10".
 */
const dayLabel = (day: number) => new RegExp(`March ${day}(?!\\d)`, 'i')

/** Build price entries for a fixed month so tests are deterministic. */
function buildPrices(overrides?: Partial<DayPrice>[]): DayPrice[] {
  const base: DayPrice[] = Array.from({ length: 31 }, (_, i) => ({
    date: new Date(2026, 2, i + 1),
    price: 100 + i * 5,
    isHighlighted: i < 3,
    available: true,
  }))
  if (overrides) {
    for (const override of overrides) {
      const index = base.findIndex(p => override.date && p.date.getDate() === override.date.getDate())
      if (index >= 0) Object.assign(base[index], override)
    }
  }
  return base
}

describe('CalendarWithPricing', () => {
  it(
    'renders price labels for days in the current month',
    () => {
      const prices = buildPrices()
      act(() => {
        render(<CalendarWithPricing value={march2026} prices={prices} />)
      })

      const day1Button = screen.getByRole('button', { name: dayLabel(1) })
      expect(day1Button.textContent).toContain('$100')
    },
    CALENDAR_WITH_PRICING_TEST_TIMEOUT_MS,
  )

  it('calls onChange when a day with price is clicked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const prices = buildPrices()

    act(() => {
      render(<CalendarWithPricing value={march2026} onChange={onChange} prices={prices} />)
    })

    const day10Button = screen.getByRole('button', { name: dayLabel(10) })
    await user.click(day10Button)

    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange.mock.calls[0][0].getDate()).toBe(10)
  })

  it('marks unavailable dates when available is false', () => {
    const prices = buildPrices([{ date: new Date(2026, 2, 15), available: false }])

    act(() => {
      render(<CalendarWithPricing value={march2026} prices={prices} />)
    })

    const day15Button = screen.getByRole('button', { name: dayLabel(15) })
    expect(day15Button).toHaveAttribute('data-unavailable')
    expect(day15Button).toBeDisabled()
  })

  it('does not call onChange for unavailable dates', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const prices = buildPrices([{ date: new Date(2026, 2, 15), available: false }])

    act(() => {
      render(<CalendarWithPricing value={march2026} onChange={onChange} prices={prices} />)
    })

    const day15Button = screen.getByRole('button', { name: dayLabel(15) })
    await user.click(day15Button)
    expect(onChange).not.toHaveBeenCalled()
  })

  it('respects minValue and maxValue constraints', () => {
    const prices = buildPrices()

    act(() => {
      render(
        <CalendarWithPricing
          value={march2026}
          prices={prices}
          minValue={new Date(2026, 2, 10)}
          maxValue={new Date(2026, 2, 20)}
        />,
      )
    })

    const day9 = screen.getByRole('button', { name: dayLabel(9) })
    const day10 = screen.getByRole('button', { name: dayLabel(10) })
    const day20 = screen.getByRole('button', { name: dayLabel(20) })
    const day21 = screen.getByRole('button', { name: dayLabel(21) })

    expect(day9).toHaveAttribute('data-unavailable')
    expect(day10).not.toHaveAttribute('data-unavailable')
    expect(day20).not.toHaveAttribute('data-unavailable')
    expect(day21).toHaveAttribute('data-unavailable')
  })

  it('marks highlighted prices with data-highlighted attribute', () => {
    const prices = buildPrices()

    act(() => {
      render(<CalendarWithPricing value={march2026} prices={prices} />)
    })

    // First 3 days are highlighted in our test data
    const day1 = screen.getByRole('button', { name: dayLabel(1) })
    const day4 = screen.getByRole('button', { name: dayLabel(4) })

    expect(day1).toHaveAttribute('data-highlighted')
    expect(day4).not.toHaveAttribute('data-highlighted')
  })

  it('uses custom formatPrice function', () => {
    const prices = buildPrices()

    act(() => {
      render(
        <CalendarWithPricing value={march2026} prices={prices} formatPrice={price => `€${(price / 100).toFixed(2)}`} />,
      )
    })

    const day1Button = screen.getByRole('button', { name: dayLabel(1) })
    expect(day1Button.textContent).toContain('€1.00')
  })

  it('uses custom currency symbol', () => {
    const prices = buildPrices()

    act(() => {
      render(<CalendarWithPricing value={march2026} prices={prices} currency="€" />)
    })

    const day1Button = screen.getByRole('button', { name: dayLabel(1) })
    expect(day1Button.textContent).toContain('€100')
  })

  it('marks selected date with data-selected', () => {
    const prices = buildPrices()

    act(() => {
      render(<CalendarWithPricing value={new Date(2026, 2, 15)} prices={prices} />)
    })

    const day15 = screen.getByRole('button', { name: dayLabel(15) })
    expect(day15).toHaveAttribute('data-selected')
  })

  it('disables all interactions when isDisabled is true', () => {
    const onChange = vi.fn()
    const prices = buildPrices()

    act(() => {
      render(<CalendarWithPricing value={march2026} onChange={onChange} prices={prices} isDisabled />)
    })

    const day10 = screen.getByRole('button', { name: dayLabel(10) })
    expect(day10).toBeDisabled()
  })

  it('includes price in aria-label', () => {
    const prices = buildPrices()

    act(() => {
      render(<CalendarWithPricing value={march2026} prices={prices} />)
    })

    const day1 = screen.getByRole('button', { name: /March 1, 2026.*\$100/i })
    expect(day1).toBeTruthy()
  })
})
