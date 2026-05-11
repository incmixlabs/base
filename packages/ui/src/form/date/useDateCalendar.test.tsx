import { act, cleanup, renderHook } from '@testing-library/react'
import { isSameMonth } from 'date-fns'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { UseDateCalendarOptions } from './useDateCalendar'
import { useDateCalendar } from './useDateCalendar'

afterEach(() => {
  cleanup()
})

/** Helper that renders the hook and flushes effects. */
function setup(options: UseDateCalendarOptions = {}) {
  let hookReturn!: ReturnType<typeof renderHook<ReturnType<typeof useDateCalendar>, UseDateCalendarOptions>>
  act(() => {
    hookReturn = renderHook(props => useDateCalendar(props), { initialProps: options })
  })
  return hookReturn
}

describe('useDateCalendar', () => {
  /* ── Display month ── */

  it('defaults displayMonth to start of value month when value is provided', () => {
    const value = new Date(2026, 2, 15)
    const { result } = setup({ value })

    expect(isSameMonth(result.current.displayMonth, value)).toBe(true)
    expect(result.current.displayMonth.getDate()).toBe(1)
  })

  it('defaults displayMonth to current month when no value is provided', () => {
    const { result } = setup()
    expect(isSameMonth(result.current.displayMonth, new Date())).toBe(true)
  })

  it('syncs displayMonth when value changes externally (uncontrolled)', () => {
    const initial = new Date(2026, 0, 15)
    const { result, rerender } = setup({ value: initial })

    expect(result.current.displayMonth.getMonth()).toBe(0)

    act(() => rerender({ value: new Date(2026, 5, 10) }))
    expect(result.current.displayMonth.getMonth()).toBe(5)
  })

  it('uses controlled displayMonth when provided', () => {
    const { result } = setup({
      value: new Date(2026, 2, 15),
      displayMonth: new Date(2026, 8, 1),
    })

    expect(result.current.displayMonth.getMonth()).toBe(8)
  })

  it('calls onDisplayMonthChange when navigating in controlled mode', () => {
    const onChange = vi.fn()
    const { result } = setup({
      displayMonth: new Date(2026, 5, 1),
      onDisplayMonthChange: onChange,
    })

    act(() => result.current.handleNextMonth())
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange.mock.calls[0][0].getMonth()).toBe(6)
  })

  /* ── Day grid ── */

  it('returns 35-42 days for a standard month grid', () => {
    const { result } = setup({ value: new Date(2026, 2, 1) })
    expect(result.current.days.length).toBeGreaterThanOrEqual(35)
    expect(result.current.days.length).toBeLessThanOrEqual(42)
  })

  it('returns exactly the provided days when days override is given', () => {
    const customDays = [new Date(2026, 2, 9), new Date(2026, 2, 10), new Date(2026, 2, 11)]
    const { result } = setup({ days: customDays })
    expect(result.current.days).toHaveLength(3)
    expect(result.current.days).toBe(customDays)
  })

  it('returns 7 weekday labels', () => {
    const { result } = setup({ value: new Date(2026, 2, 1) })
    expect(result.current.weekDayLabels).toHaveLength(7)
    for (const label of result.current.weekDayLabels) {
      expect(typeof label).toBe('string')
      expect(label.length).toBeGreaterThan(0)
    }
  })

  /* ── Availability ── */

  it('isDayUnavailable returns true for dates before minValue', () => {
    const { result } = setup({
      value: new Date(2026, 2, 15),
      minValue: new Date(2026, 2, 10),
    })

    expect(result.current.isDayUnavailable(new Date(2026, 2, 9))).toBe(true)
    expect(result.current.isDayUnavailable(new Date(2026, 2, 10))).toBe(false)
  })

  it('isDayUnavailable returns true for dates after maxValue', () => {
    const { result } = setup({
      value: new Date(2026, 2, 15),
      maxValue: new Date(2026, 2, 20),
    })

    expect(result.current.isDayUnavailable(new Date(2026, 2, 21))).toBe(true)
    expect(result.current.isDayUnavailable(new Date(2026, 2, 20))).toBe(false)
  })

  it('isDayUnavailable returns true for dates in disabledDates', () => {
    const { result } = setup({
      value: new Date(2026, 2, 15),
      disabledDates: [new Date(2026, 2, 12)],
    })

    expect(result.current.isDayUnavailable(new Date(2026, 2, 12))).toBe(true)
    expect(result.current.isDayUnavailable(new Date(2026, 2, 13))).toBe(false)
  })

  it('treats min/max checks as day-level even when day includes a time', () => {
    const { result } = setup({
      minValue: new Date(2026, 2, 10),
      maxValue: new Date(2026, 2, 20),
    })

    expect(result.current.isDayUnavailable(new Date(2026, 2, 10, 23, 59))).toBe(false)
    expect(result.current.isDayUnavailable(new Date(2026, 2, 20, 12, 0))).toBe(false)
  })

  it('matches disabledDates by calendar day even when day includes a time', () => {
    const { result } = setup({
      disabledDates: [new Date(2026, 2, 12)],
    })

    expect(result.current.isDayUnavailable(new Date(2026, 2, 12, 18, 30))).toBe(true)
  })

  /* ── Predicates ── */

  it('isDaySelected returns true when day matches value', () => {
    const { result } = setup({ value: new Date(2026, 2, 15, 14, 30) })

    expect(result.current.isDaySelected(new Date(2026, 2, 15))).toBe(true)
    expect(result.current.isDaySelected(new Date(2026, 2, 16))).toBe(false)
  })

  it('isDaySelected returns false when no value is provided', () => {
    const { result } = setup()
    expect(result.current.isDaySelected(new Date())).toBe(false)
  })

  it('isDayToday returns true for today', () => {
    const { result } = setup()
    expect(result.current.isDayToday(new Date())).toBe(true)
  })

  it('isDayToday returns false when highlightToday is false', () => {
    const { result } = setup({ highlightToday: false })
    expect(result.current.isDayToday(new Date())).toBe(false)
  })

  it('isDayOutsideMonth returns true for days not in the display month', () => {
    const { result } = setup({ value: new Date(2026, 2, 15) })

    expect(result.current.isDayOutsideMonth(new Date(2026, 1, 28))).toBe(true)
    expect(result.current.isDayOutsideMonth(new Date(2026, 2, 15))).toBe(false)
  })

  /* ── Navigation ── */

  it('handlePrevMonth decrements displayMonth by 1 month', () => {
    const { result } = setup({ value: new Date(2026, 5, 15) })

    expect(result.current.displayMonth.getMonth()).toBe(5)
    act(() => result.current.handlePrevMonth())
    expect(result.current.displayMonth.getMonth()).toBe(4)
  })

  it('handleNextMonth increments displayMonth by 1 month', () => {
    const { result } = setup({ value: new Date(2026, 5, 15) })

    expect(result.current.displayMonth.getMonth()).toBe(5)
    act(() => result.current.handleNextMonth())
    expect(result.current.displayMonth.getMonth()).toBe(6)
  })

  it('navigation is no-op when isDisabled is true', () => {
    const { result } = setup({ value: new Date(2026, 5, 15), isDisabled: true })

    const initialMonth = result.current.displayMonth.getMonth()
    act(() => result.current.handleNextMonth())
    expect(result.current.displayMonth.getMonth()).toBe(initialMonth)
    act(() => result.current.handlePrevMonth())
    expect(result.current.displayMonth.getMonth()).toBe(initialMonth)
  })

  it('setDisplayMonth updates the display month directly', () => {
    const { result } = setup({ value: new Date(2026, 0, 15) })

    act(() => result.current.setDisplayMonth(new Date(2026, 11, 1)))
    expect(result.current.displayMonth.getMonth()).toBe(11)
  })

  /* ── weekStartsOn ── */

  it('uses explicit weekStartsOn override when provided', () => {
    const { result } = setup({
      value: new Date(2026, 2, 15),
      weekStartsOn: 1,
    })

    expect(result.current.weekStartsOn).toBe(1)
  })

  /* ── Formatters ── */

  it('exposes locale-aware formatters', () => {
    const { result } = setup()

    expect(result.current.monthHeadingFormatter).toBeInstanceOf(Intl.DateTimeFormat)
    expect(result.current.weekDayFormatter).toBeInstanceOf(Intl.DateTimeFormat)
    expect(result.current.dayNumberFormatter).toBeInstanceOf(Intl.NumberFormat)
    expect(result.current.dayLabelFormatter).toBeInstanceOf(Intl.DateTimeFormat)
    expect(typeof result.current.locale).toBe('string')
  })
})
