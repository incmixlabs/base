import { CalendarDate } from '@internationalized/date'
import { describe, expect, it } from 'vitest'
import { fromDateRangeValue, toDateRangeValue } from './date-range-value-boundary'

describe('date-range-value-boundary', () => {
  it('maps a valid Date range to DateValue range', () => {
    const result = toDateRangeValue({
      from: new Date(2026, 0, 15),
      to: new Date(2026, 0, 20),
    })

    expect(result).not.toBeNull()
  })

  it('returns null for reversed range in toDateRangeValue', () => {
    const result = toDateRangeValue({
      from: new Date(2026, 0, 20),
      to: new Date(2026, 0, 15),
    })

    expect(result).toBeNull()
  })

  it('returns undefined for reversed range in fromDateRangeValue', () => {
    const result = fromDateRangeValue({
      start: new CalendarDate(2026, 1, 20),
      end: new CalendarDate(2026, 1, 15),
    })

    expect(result).toBeUndefined()
  })

  it('returns undefined for null input in fromDateRangeValue', () => {
    expect(fromDateRangeValue(null)).toBeUndefined()
  })
})
