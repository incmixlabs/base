'use client'
import type { ColumnDef } from '@tanstack/react-table'
import type { ReactNode } from 'react'
import type { AvatarListItem } from '@/elements/avatar/avatar-list.props'
import type { BadgeProps } from '@/elements/badge/Badge'
import type { FilterField, FilterState } from '@/elements/filter/filter.props'
import type { DateRangeValue } from '@/form/date'
import type { StatusPageProps } from '@/status-page'
import { StatusPage } from '@/status-page'
import { TableWrapper } from '@/table/basic'
import type { TableWrapperProps } from '@/table/basic/table-wrapper.props'
import { InfiniteTable } from '@/table/infinite'
import type { InfiniteTableRootProps, InfiniteTableSummaryChartColumn } from '@/table/infinite/infinite-table.props'
import { type TableHeaderAppliedFilter, TableLabel } from '@/table/shared'
import { matchesDateFilter } from '@/table/shared/filtering'
import type { Color } from '@/theme/tokens'

export type InfiniteTableViewSpec<TData> = {
  type: 'infinite-table'
  props?: Pick<InfiniteTableRootProps<TData>, 'size' | 'variant' | 'color'>
  summary?: boolean | readonly (keyof TData & string)[]
}

export type BasicTableViewSpec = {
  type: 'basic-table'
  props?: Pick<TableWrapperProps, 'size' | 'variant' | 'layout' | 'striped'>
}

type StatusViewDeclarativeProps = {
  className?: string
  id?: string
}

export type StatusViewSpec = {
  type: 'status'
  props?: StatusViewDeclarativeProps
}

export type ComposedViewSpec<TData> = InfiniteTableViewSpec<TData> | BasicTableViewSpec | StatusViewSpec

type FilterFieldKey<TData, TValue> = {
  [TKey in keyof TData]-?: NonNullable<TData[TKey]> extends TValue ? TKey : never
}[keyof TData] &
  string

type ComposedFilterFieldBase<TData, TKey extends keyof TData & string = keyof TData & string> = {
  id: TKey
  label: string
  defaultOpen?: boolean
}

type ComposedCheckboxOption = {
  label: string
  value: string
  count?: number
}

export type ComposedFilterSpec<TData, TSourceKey extends string = string> =
  | (ComposedFilterFieldBase<TData, FilterFieldKey<TData, Date | string | number>> & {
      type: 'calendar'
      minDate?: Date
      maxDate?: Date
      display?: 'mini' | 'full'
      mode?: 'single' | 'multiple' | 'range'
    })
  | (ComposedFilterFieldBase<TData, FilterFieldKey<TData, string>> & { type: 'avatar-list'; source: TSourceKey })
  | (ComposedFilterFieldBase<TData, FilterFieldKey<TData, string>> & { type: 'input' })
  | (ComposedFilterFieldBase<TData, FilterFieldKey<TData, number>> & {
      type: 'slider'
      min?: number
      max?: number
      step?: number
    })
  | (ComposedFilterFieldBase<TData, FilterFieldKey<TData, string | number | boolean>> & {
      type: 'checkbox'
      options: readonly ComposedCheckboxOption[]
    })

type ComposedMappedValue = {
  value: string | number
  label?: string | number
  color?: Color
  variant?: BadgeProps['variant']
}

export type ComposedColumnCellSpec =
  | { type: 'date' }
  | { type: 'suffix'; suffix: string }
  | {
      type: 'lookup'
      values: readonly ComposedMappedValue[]
      fallbackToValue?: boolean
    }
  | {
      type: 'label'
      values?: readonly ComposedMappedValue[]
      color?: Color
      variant?: BadgeProps['variant']
    }

export type ComposedColumnSpec<TData> = {
  accessorKey: keyof TData & string
  header: string
  size: number
  cell?: ComposedColumnCellSpec
}

export type ComposedFilterSources<TSourceKey extends string> = Record<TSourceKey, readonly AvatarListItem[]>

type InfiniteTableViewProps<TData> = {
  view: InfiniteTableViewSpec<TData>
  table: Pick<
    InfiniteTableRootProps<TData>,
    'columns' | 'data' | 'isLoading' | 'isFetching' | 'totalRows' | 'filterRows' | 'activeFilterCount'
  > & {
    footer?: ReactNode
  }
  filters?: FilterState
  filterFields?: readonly ComposedFilterSpec<TData, string>[]
}

type BasicTableViewProps = {
  view: BasicTableViewSpec
  table: Pick<TableWrapperProps, 'data' | 'onRowSelect' | 'renderCell' | 'renderRow' | 'expandAll'>
}

type StatusContentProps = Pick<StatusPageProps, 'title' | 'description' | 'action' | 'children'>

type StatusOnlyViewProps = {
  view: StatusViewSpec
  status: StatusContentProps
}

export type ComposedViewProps<TData> = InfiniteTableViewProps<TData> | BasicTableViewProps | StatusOnlyViewProps

export function buildFilterFields<TData, TSourceKey extends string>(
  filters: readonly ComposedFilterSpec<TData, TSourceKey>[],
  sources: ComposedFilterSources<TSourceKey>,
): FilterField<TData>[] {
  return filters.map(field => {
    if (field.type === 'checkbox') {
      return { ...field, options: [...field.options] }
    }

    if (field.type !== 'avatar-list') return field

    const items = sources[field.source]
    if (!items) {
      throw new Error(`buildFilterFields: missing avatar-list source "${field.source}"`)
    }

    return { ...field, items: [...items] }
  })
}

export function buildColumns<TData>(columns: readonly ComposedColumnSpec<TData>[]): ColumnDef<TData>[] {
  return columns.map(({ cell, ...column }) => ({
    ...column,
    ...(cell ? { cell: buildColumnCellRenderer<TData>(cell) } : null),
    ...(cell?.type === 'label'
      ? { meta: { fullCell: true, summaryValues: cell.values } }
      : cell?.type === 'lookup'
        ? { meta: { summaryValues: cell.values } }
        : null),
  }))
}

function buildColumnCellRenderer<TData>(cellSpec: ComposedColumnCellSpec): NonNullable<ColumnDef<TData>['cell']> {
  switch (cellSpec.type) {
    case 'date':
      return ({ getValue }) => {
        const value = getValue<unknown>()
        if (value == null || value === '') return ''
        const date =
          value instanceof Date
            ? value
            : typeof value === 'string' || typeof value === 'number'
              ? new Date(value)
              : null
        return date && !Number.isNaN(date.getTime()) ? date.toLocaleDateString() : String(value)
      }
    case 'suffix':
      return ({ getValue }) => {
        const value = getValue<unknown>()
        return value == null || value === '' ? '' : `${String(value)}${cellSpec.suffix}`
      }
    case 'lookup':
      // TODO(table-performance): Pre-index mapped values once per column renderer instead of scanning on every cell render.
      return ({ getValue }) => {
        const value = getValue<string | number | null | undefined>()
        const match = cellSpec.values.find(item => String(item.value) === String(value))
        if (match?.label !== undefined) return match.label
        return cellSpec.fallbackToValue === false ? '' : String(value ?? '')
      }
    case 'label':
      // TODO(table-performance): Pre-index mapped values once per column renderer instead of scanning on every cell render.
      return ({ getValue }) => {
        const value = getValue<string | number | null | undefined>()
        const match = cellSpec.values?.find(item => String(item.value) === String(value))
        if (match == null && (value == null || value === '')) return ''
        const color = match?.color ?? cellSpec.color ?? 'slate'
        const variant = match?.variant ?? cellSpec.variant ?? 'solid'
        const label = match?.label ?? String(value ?? '')

        return (
          <TableLabel color={color} variant={variant}>
            {label}
          </TableLabel>
        )
      }
    default:
      return assertNever(cellSpec)
  }
}

export function applyFilters<TData, TSourceKey extends string>(
  rows: readonly TData[],
  filters: FilterState,
  fieldSpecs: readonly ComposedFilterSpec<TData, TSourceKey>[],
): TData[] {
  const filtersById = new Map(filters.map(filter => [filter.id, filter]))

  return rows.filter(row =>
    fieldSpecs.every(field => {
      const activeFilter = filtersById.get(field.id)
      if (!activeFilter) return true

      const rowValue = row[field.id]

      switch (field.type) {
        case 'calendar':
          return matchesDateFilter(
            { getValue: () => rowValue },
            field.id,
            activeFilter.value as Date | Date[] | DateRangeValue | undefined,
          )
        case 'avatar-list':
        case 'checkbox':
          return Array.isArray(activeFilter.value) && activeFilter.value.length > 0
            ? activeFilter.value.includes(String(rowValue))
            : true
        case 'input':
          return typeof activeFilter.value === 'string' && activeFilter.value.length > 0
            ? String(rowValue ?? '')
                .toLowerCase()
                .includes(activeFilter.value.toLowerCase())
            : true
        case 'slider': {
          if (!Array.isArray(activeFilter.value) || activeFilter.value.length < 2) return true

          const numericRowValue = Number(rowValue)
          if (Number.isNaN(numericRowValue)) return true

          return numericRowValue >= Number(activeFilter.value[0]) && numericRowValue <= Number(activeFilter.value[1])
        }
        default:
          return true
      }
    }),
  )
}

export function formatFilterValue(value: unknown): string {
  if (Array.isArray(value)) return value.map(entry => formatFilterValue(entry)).join(', ')
  if (value instanceof Date) return value.toLocaleDateString()
  if (value && typeof value === 'object' && 'from' in value && 'to' in value) {
    const range = value as { from?: unknown; to?: unknown }
    if (range.from instanceof Date && range.to instanceof Date) {
      return `${range.from.toLocaleDateString()} - ${range.to.toLocaleDateString()}`
    }
    if (range.from instanceof Date) return `${range.from.toLocaleDateString()} -`
    if (range.to instanceof Date) return `- ${range.to.toLocaleDateString()}`
    return ''
  }
  return String(value)
}

function assertNever(value: never): never {
  throw new Error(`ComposedView: unsupported view type ${JSON.stringify(value)}`)
}

function buildInfiniteTableSummary<TData>(
  rows: readonly TData[],
  columns: Pick<InfiniteTableRootProps<TData>, 'columns'>['columns'],
  summary: InfiniteTableViewSpec<TData>['summary'],
): InfiniteTableSummaryChartColumn[] {
  if (!summary) return []

  const summaryColumns =
    summary === true
      ? columns.filter(column => {
          const meta = (column.meta as { summaryValues?: readonly ComposedMappedValue[] } | undefined) ?? {}
          return Array.isArray(meta.summaryValues) && meta.summaryValues.length > 0
        })
      : summary.map(summaryKey => {
          const column = columns.find(candidate => {
            const accessorKey = 'accessorKey' in candidate ? candidate.accessorKey : undefined
            return typeof accessorKey === 'string' && accessorKey === summaryKey
          })

          if (!column) {
            throw new Error(`ComposedView: summary column "${summaryKey}" was not found in the view columns`)
          }

          const meta = (column.meta as { summaryValues?: readonly ComposedMappedValue[] } | undefined) ?? {}
          if (!Array.isArray(meta.summaryValues) || meta.summaryValues.length === 0) {
            throw new Error(
              `ComposedView: summary column "${summaryKey}" does not provide summary values. Use a mapped lookup/label cell or omit it from summary.`,
            )
          }

          return column
        })

  if (summaryColumns.length === 0) return []

  return summaryColumns.flatMap(column => {
    const accessorKey = ('accessorKey' in column ? column.accessorKey : undefined) as (keyof TData & string) | undefined
    if (!accessorKey) return []

    const meta = (column.meta as { summaryValues?: readonly ComposedMappedValue[] } | undefined) ?? {}
    const summaryValues = meta.summaryValues
    if (!summaryValues || summaryValues.length === 0) return []

    // TODO(table-performance): Pre-count row values in a single pass per summary column instead of filtering rows per segment.
    const segments = summaryValues.map(summaryValue => ({
      label: String(summaryValue.label ?? summaryValue.value),
      value: rows.filter(row => String(row[accessorKey]) === String(summaryValue.value)).length,
      color: summaryValue.color ?? 'slate',
    }))

    return [{ columnId: accessorKey, segments }]
  })
}

function buildAppliedFilters<TData>(
  filters: FilterState | undefined,
  filterFields: readonly ComposedFilterSpec<TData, string>[] | undefined,
): TableHeaderAppliedFilter[] | undefined {
  if (!filters) return undefined

  return filters.map(filter => ({
    id: filter.id,
    label: filterFields?.find(field => field.id === filter.id)?.label ?? filter.id,
    value: formatFilterValue(filter.value),
  }))
}

export function ComposedView<TData>(props: ComposedViewProps<TData>) {
  switch (props.view.type) {
    case 'infinite-table': {
      const { view, table, filters, filterFields } = props as InfiniteTableViewProps<TData>
      const { footer, ...tableProps } = table
      const summaryColumns = buildInfiniteTableSummary(tableProps.data, tableProps.columns, view.summary)
      const appliedFilters = buildAppliedFilters(filters, filterFields)
      return (
        <InfiniteTable.Root<TData> {...tableProps} {...view.props}>
          <InfiniteTable.Toolbar appliedFilters={appliedFilters} />
          <InfiniteTable.Content />
          {summaryColumns.length > 0 ? <InfiniteTable.SummaryChart columns={summaryColumns} /> : null}
          {footer ? <InfiniteTable.Footer>{footer}</InfiniteTable.Footer> : null}
        </InfiniteTable.Root>
      )
    }
    case 'basic-table': {
      const { view, table } = props as BasicTableViewProps
      return <TableWrapper {...view.props} {...table} />
    }
    case 'status': {
      const { view, status } = props as StatusOnlyViewProps
      return <StatusPage {...view.props} {...status} />
    }
    default:
      return assertNever(props.view as never)
  }
}
