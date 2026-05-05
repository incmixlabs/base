import type { DateValue } from '@internationalized/date'
import { fromDateValue, toDateValue } from './date-value-boundary'

export interface DateRangeValue {
  from: Date
  to: Date
}

/**
 * Converts domain range (`Date`) to picker range (`DateValue`).
 * Returns `null` when input is absent or invalid.
 */
export function toDateRangeValue(value?: DateRangeValue): { start: DateValue; end: DateValue } | null {
  if (!value) return null
  if (value.from.getTime() > value.to.getTime()) return null
  const start = toDateValue(value.from)
  const end = toDateValue(value.to)
  if (!start || !end) return null
  return { start, end }
}

/**
 * Converts picker range (`DateValue`) back to domain range (`Date`).
 * Returns `undefined` when input is absent or invalid.
 */
export function fromDateRangeValue(value: { start: DateValue; end: DateValue } | null): DateRangeValue | undefined {
  if (!value) return undefined
  const from = fromDateValue(value.start)
  const to = fromDateValue(value.end)
  if (!from || !to) return undefined
  if (from.getTime() > to.getTime()) return undefined
  return { from, to }
}
