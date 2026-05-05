import type { AutoformChartAggregateKind, AutoformChartDef } from './chart-contract'

export type AutoformChartSeriesDatum<TRow = unknown> = {
  label: string
  value: number
  color?: string
  rows: readonly TRow[]
  raw: TRow | undefined
}

const DEFAULT_LABEL_FIELDS = ['label', 'name', 'title', 'id'] as const
const DEFAULT_VALUE_FIELD = 'value'

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

function readField(row: unknown, field: string | undefined): unknown {
  if (!field || !isRecord(row)) return undefined
  return row[field]
}

function readLabel(row: unknown, labelField: string | undefined, index: number): string {
  const explicitLabel = readField(row, labelField)

  if (explicitLabel != null && explicitLabel !== '') {
    return String(explicitLabel)
  }

  if (isRecord(row)) {
    for (const field of DEFAULT_LABEL_FIELDS) {
      const value = row[field]
      if (value != null && value !== '') return String(value)
    }
  }

  return `Row ${index + 1}`
}

function toNumber(value: unknown): number {
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0
  if (typeof value === 'boolean') return value ? 1 : 0
  if (typeof value === 'string') {
    const numeric = Number(value.replaceAll(',', ''))
    return Number.isFinite(numeric) ? numeric : 0
  }
  return 0
}

function readNumericValue(row: unknown, valueField: string | undefined): number {
  const value = readField(row, valueField) ?? readField(row, DEFAULT_VALUE_FIELD)
  return toNumber(value)
}

function aggregateValues<TRow>(
  aggregate: AutoformChartAggregateKind,
  rows: readonly TRow[],
  valueField: string | undefined,
): number {
  if (aggregate === 'count') return rows.length

  const values = rows.map(row => readNumericValue(row, valueField))

  if (aggregate === 'min') {
    return values.length ? values.reduce((min, value) => (value < min ? value : min), values[0] ?? 0) : 0
  }
  if (aggregate === 'max') {
    return values.length ? values.reduce((max, value) => (value > max ? value : max), values[0] ?? 0) : 0
  }

  const total = values.reduce((sum, value) => sum + value, 0)
  return aggregate === 'avg' ? total / Math.max(values.length, 1) : total
}

export function getAutoformChartRows<TRow>(chart: AutoformChartDef<TRow>, data?: readonly TRow[]): readonly TRow[] {
  if (data) return data
  return chart.dataSource.kind === 'inline' ? chart.dataSource.rows : []
}

export function createAutoformChartSeriesData<TRow>(
  chart: AutoformChartDef<TRow>,
  data?: readonly TRow[],
): AutoformChartSeriesDatum<TRow>[] {
  const rows = getAutoformChartRows(chart, data)
  const aggregate = chart.aggregate
  const labelField = chart.encodings?.label ?? chart.encodings?.x
  const valueField = chart.encodings?.y ?? DEFAULT_VALUE_FIELD
  const colorField = chart.encodings?.color

  if (!aggregate) {
    return rows.map((row, index) => ({
      label: readLabel(row, labelField, index),
      value: readNumericValue(row, valueField),
      color: readField(row, colorField) as string | undefined,
      rows: [row],
      raw: row,
    }))
  }

  const groupedRows = new Map<string, TRow[]>()

  rows.forEach((row, index) => {
    const label = readLabel(row, labelField, index)
    const group = groupedRows.get(label)
    if (group) {
      group.push(row)
    } else {
      groupedRows.set(label, [row])
    }
  })

  return Array.from(groupedRows.entries()).map(([label, group]) => ({
    label,
    value:
      typeof aggregate === 'function'
        ? toNumber(aggregate(group, valueField))
        : aggregateValues(aggregate, group, valueField),
    color: readField(group[0], colorField) as string | undefined,
    rows: group,
    raw: group[0],
  }))
}
