import { CalendarDate } from '@internationalized/date'
import { describe, expect, it } from 'vitest'
import { fromDateValue, toDateValue } from './date-value-boundary'

describe('date-value-boundary', () => {
  it('maps undefined date input to null date value', () => {
    expect(toDateValue(undefined)).toBeNull()
  })

  it('maps invalid Date input to null date value', () => {
    expect(toDateValue(new Date('invalid'))).toBeNull()
  })

  it('maps Date input to calendar date using year/month/day only', () => {
    const value = toDateValue(new Date(2026, 0, 16, 18, 45, 10))
    expect(value).not.toBeNull()
    expect(value?.toString()).toBe('2026-01-16')
  })

  it('maps null date value to undefined', () => {
    expect(fromDateValue(null)).toBeUndefined()
  })

  it('maps calendar date to local Date at midnight', () => {
    const next = fromDateValue(new CalendarDate(2026, 1, 16))
    expect(next).toBeDefined()
    expect(next?.getFullYear()).toBe(2026)
    expect(next?.getMonth()).toBe(0)
    expect(next?.getDate()).toBe(16)
    expect(next?.getHours()).toBe(0)
    expect(next?.getMinutes()).toBe(0)
    expect(next?.getSeconds()).toBe(0)
    expect(next?.getMilliseconds()).toBe(0)
  })
})
