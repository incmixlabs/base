import type { DateRangeValue } from '@/form/date'
import { isSameDay } from '@/utils/date'

export type DateFilterValue = Date | Date[] | DateRangeValue

function toDateValue(value: unknown): Date | null {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value
  }

  if (typeof value === 'string' || typeof value === 'number') {
    const parsed = new Date(value)
    return Number.isNaN(parsed.getTime()) ? null : parsed
  }

  return null
}

function isDateRangeValue(value: unknown): value is DateRangeValue {
  if (!value || typeof value !== 'object') return false

  const candidate = value as Partial<DateRangeValue>
  return candidate.from instanceof Date && candidate.to instanceof Date
}

export function matchesDateFilter(
  row: { getValue: (columnId: string) => unknown },
  columnId: string,
  filterValue?: DateFilterValue,
): boolean {
  if (!filterValue) return true

  const value = toDateValue(row.getValue(columnId))
  if (!value) return false

  if (filterValue instanceof Date) {
    return isSameDay(value, filterValue)
  }

  if (Array.isArray(filterValue)) {
    return filterValue.some(selectedDate => selectedDate instanceof Date && isSameDay(value, selectedDate))
  }

  if (isDateRangeValue(filterValue)) {
    const from = new Date(filterValue.from)
    from.setHours(0, 0, 0, 0)
    const to = new Date(filterValue.to)
    to.setHours(23, 59, 59, 999)
    const time = value.getTime()
    return time >= from.getTime() && time <= to.getTime()
  }

  return true
}
