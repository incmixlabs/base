import { getPrioritySortValue } from '@/elements/priority-icon/priority-icon.shared'

export function getTableSortableValue(value: unknown, fallbackText?: string): string | number {
  if (typeof value === 'number') return value
  if (typeof value === 'string') return value.toLowerCase()
  if (typeof value === 'boolean') return value ? 1 : 0
  if (value instanceof Date) return value.getTime()
  return String(fallbackText ?? value ?? '').toLowerCase()
}

export function comparePrioritySortableValues(
  leftValue: unknown,
  rightValue: unknown,
  options?: {
    leftFallbackText?: string
    rightFallbackText?: string
  },
): number {
  const leftPriority = getPrioritySortValue(leftValue)
  const rightPriority = getPrioritySortValue(rightValue)

  if (leftPriority !== null && rightPriority !== null) {
    if (leftPriority < rightPriority) return -1
    if (leftPriority > rightPriority) return 1
    return 0
  }

  const leftSortable = getTableSortableValue(leftValue, options?.leftFallbackText)
  const rightSortable = getTableSortableValue(rightValue, options?.rightFallbackText)

  if (leftSortable < rightSortable) return -1
  if (leftSortable > rightSortable) return 1
  return 0
}

export { getPrioritySortValue }
