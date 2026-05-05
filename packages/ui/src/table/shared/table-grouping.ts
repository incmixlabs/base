export type TableShape = 'flat' | 'tree'

export type TableGroupPathEntry = {
  columnId: string
  value: unknown
  label: string
}

export type TableGroupRowMetadata = {
  kind: 'group'
  columnId: string
  value: unknown
  label: string
  depth: number
  path: readonly TableGroupPathEntry[]
}

export type TableGroupRowFactoryContext<TRow> = {
  id: string
  columnId: string
  value: unknown
  label: string
  depth: number
  path: readonly TableGroupPathEntry[]
  rows: readonly TRow[]
}

export type GroupTableRowsOptions<TRow> = {
  rows: readonly TRow[]
  groupBy: readonly string[]
  getValue: (row: TRow, columnId: string) => unknown
  createGroupRow: (context: TableGroupRowFactoryContext<TRow>) => TRow
}

export type TableRowSubRowsGetter<TRow> = (row: TRow) => readonly TRow[] | undefined
export type TableRowSubRowsClearer<TRow> = (row: TRow) => TRow

function getObjectLabel(value: Record<string, unknown>) {
  for (const key of ['label', 'name', 'value', 'id']) {
    const item = value[key]
    if (typeof item === 'string' || typeof item === 'number' || typeof item === 'boolean') {
      return String(item)
    }
  }

  return undefined
}

function getObjectKey(value: Record<string, unknown>) {
  for (const key of ['id', 'value', 'label', 'name']) {
    const item = value[key]
    if (typeof item === 'string' || typeof item === 'number' || typeof item === 'boolean') {
      return String(item)
    }
  }

  return undefined
}

export function getTableGroupValueLabel(value: unknown) {
  if (value === null || value === undefined || value === '') return '(empty)'
  if (value instanceof Date) return value.toISOString()
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return String(value)

  if (typeof value === 'object' && !Array.isArray(value)) {
    const objectLabel = getObjectLabel(value as Record<string, unknown>)
    if (objectLabel) return objectLabel
  }

  try {
    return JSON.stringify(value)
  } catch {
    return String(value)
  }
}

export function getTableGroupValueKey(value: unknown) {
  if (value === null || value === undefined || value === '') return '(empty)'
  if (value instanceof Date) return value.toISOString()
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return String(value)

  if (typeof value === 'object' && !Array.isArray(value)) {
    const objectKey = getObjectKey(value as Record<string, unknown>)
    if (objectKey) return objectKey
  }

  try {
    return JSON.stringify(value)
  } catch {
    return String(value)
  }
}

export function getTableGroupRowId(path: readonly TableGroupPathEntry[]) {
  return `group:${path.map(entry => `${entry.columnId}:${encodeURIComponent(getTableGroupValueKey(entry.value))}`).join('/')}`
}

export function groupTableRows<TRow>({ rows, groupBy, getValue, createGroupRow }: GroupTableRowsOptions<TRow>): TRow[] {
  if (groupBy.length === 0) return [...rows]

  const groupLevel = (items: readonly TRow[], depth: number, parentPath: readonly TableGroupPathEntry[]): TRow[] => {
    const columnId = groupBy[depth]
    if (!columnId) return [...items]

    const grouped = new Map<string, { value: unknown; label: string; rows: TRow[] }>()

    for (const row of items) {
      const value = getValue(row, columnId)
      const label = getTableGroupValueLabel(value)
      const key = getTableGroupValueKey(value)
      const group = grouped.get(key)
      if (group) {
        group.rows.push(row)
      } else {
        grouped.set(key, { value, label, rows: [row] })
      }
    }

    return Array.from(grouped.values()).map(group => {
      const path = [...parentPath, { columnId, value: group.value, label: group.label }]
      const childRows = depth + 1 < groupBy.length ? groupLevel(group.rows, depth + 1, path) : [...group.rows]

      return createGroupRow({
        id: getTableGroupRowId(path),
        columnId,
        value: group.value,
        label: group.label,
        depth,
        path,
        rows: childRows,
      })
    })
  }

  return groupLevel(rows, 0, [])
}

export function hasNestedTableRows<TRow>(rows: readonly TRow[], getSubRows: TableRowSubRowsGetter<TRow>): boolean {
  for (const row of rows) {
    const subRows = getSubRows(row) ?? []
    if (subRows.length > 0 || hasNestedTableRows(subRows, getSubRows)) return true
  }

  return false
}

export function flattenTableRows<TRow>({
  rows,
  getSubRows,
  clearSubRows,
}: {
  rows: readonly TRow[]
  getSubRows: TableRowSubRowsGetter<TRow>
  clearSubRows: TableRowSubRowsClearer<TRow>
}): TRow[] {
  const flattened: TRow[] = []

  const walk = (items: readonly TRow[]) => {
    for (const row of items) {
      flattened.push(clearSubRows(row))
      const subRows = getSubRows(row)
      if (subRows?.length) {
        walk(subRows)
      }
    }
  }

  walk(rows)
  return flattened
}
