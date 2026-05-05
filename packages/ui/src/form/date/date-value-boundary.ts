import { CalendarDate, type DateValue, getLocalTimeZone } from '@internationalized/date'

export function toDateValue(value?: Date): DateValue | null {
  if (!value || Number.isNaN(value.getTime())) return null
  return new CalendarDate(value.getFullYear(), value.getMonth() + 1, value.getDate())
}

export function fromDateValue(value: DateValue | null): Date | undefined {
  if (!value) return undefined
  const next = value.toDate(getLocalTimeZone())
  next.setHours(0, 0, 0, 0)
  return next
}
