import { describe, expect, it } from 'vitest'
import { formatDate, formatDurationMs } from './date'

describe('date utilities', () => {
  it('formats durations in minutes and seconds', () => {
    expect(formatDurationMs(undefined)).toBe('-')
    expect(formatDurationMs(Number.NaN)).toBe('-')
    expect(formatDurationMs(Number.POSITIVE_INFINITY)).toBe('-')
    expect(formatDurationMs(-1)).toBe('-')
    expect(formatDurationMs(0)).toBe('0:00')
    expect(formatDurationMs(61_000)).toBe('1:01')
  })

  it('returns a fallback for empty or invalid dates', () => {
    expect(formatDate(undefined)).toBe('-')
    expect(formatDate('')).toBe('-')
    expect(formatDate('not-a-date')).toBe('not-a-date')
  })

  it('formats valid date-time values', () => {
    const value = '2026-07-22T15:30:00.000Z'
    const expected = new Intl.DateTimeFormat(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(Date.parse(value)))

    expect(formatDate(value)).toBe(expected)
  })

  it('formats date-only values as local calendar dates', () => {
    const expected = new Intl.DateTimeFormat(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(2026, 6, 22))

    expect(formatDate('2026-07-22')).toBe(expected)
  })
})
