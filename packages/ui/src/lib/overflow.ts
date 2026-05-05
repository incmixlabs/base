export interface OverflowPartitionOptions {
  reserveOverflowSlot?: boolean
}

export interface OverflowPartitionResult<T> {
  visibleItems: T[]
  overflowItems: T[]
  visibleCount: number
  overflowCount: number
  hasOverflow: boolean
}

export function partitionVisibleOverflow<T>(
  items: T[],
  max: number | undefined,
  options: OverflowPartitionOptions = {},
): OverflowPartitionResult<T> {
  const { reserveOverflowSlot = false } = options

  if (max === undefined) {
    return {
      visibleItems: items,
      overflowItems: [],
      visibleCount: items.length,
      overflowCount: 0,
      hasOverflow: false,
    }
  }

  const normalizedMax = Number.isNaN(max) ? 0 : Math.max(0, Math.floor(max))
  const hasOverflow = items.length > normalizedMax
  const visibleCount = hasOverflow ? Math.max(0, normalizedMax - (reserveOverflowSlot ? 1 : 0)) : items.length
  const visibleItems = items.slice(0, visibleCount)
  const overflowItems = items.slice(visibleCount)

  return {
    visibleItems,
    overflowItems,
    visibleCount,
    overflowCount: overflowItems.length,
    hasOverflow,
  }
}
