export const TABLE_COLUMN_RESIZE_DEFAULT_MIN_SIZE = 20
export const TABLE_COLUMN_RESIZE_DEFAULT_MAX_SIZE = 1000
export const TABLE_COLUMN_RESIZE_KEYBOARD_STEP = 12
export const TABLE_COLUMN_RESIZE_KEYBOARD_LARGE_STEP = 24

export type TableColumnResizeDirection = 'decrease' | 'increase'

export type TableColumnResizeBounds = {
  minSize: number
  maxSize: number
}

function resolveFiniteSize(value: number | undefined, fallback: number) {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback
}

export function resolveTableColumnResizeBounds({
  minSize,
  maxSize,
}: {
  minSize?: number
  maxSize?: number
}): TableColumnResizeBounds {
  const resolvedMinSize = resolveFiniteSize(minSize, TABLE_COLUMN_RESIZE_DEFAULT_MIN_SIZE)
  const resolvedMaxSize = resolveFiniteSize(maxSize, TABLE_COLUMN_RESIZE_DEFAULT_MAX_SIZE)

  return {
    minSize: resolvedMinSize,
    maxSize: Math.max(resolvedMinSize, resolvedMaxSize),
  }
}

export function getNextTableColumnResizeSize({
  currentSize,
  direction,
  shiftKey = false,
  minSize,
  maxSize,
}: TableColumnResizeBounds & {
  currentSize: number
  direction: TableColumnResizeDirection
  shiftKey?: boolean
}) {
  const step = shiftKey ? TABLE_COLUMN_RESIZE_KEYBOARD_LARGE_STEP : TABLE_COLUMN_RESIZE_KEYBOARD_STEP
  const delta = direction === 'increase' ? step : -step
  return Math.min(maxSize, Math.max(minSize, currentSize + delta))
}
