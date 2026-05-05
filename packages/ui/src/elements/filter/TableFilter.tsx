'use client'

import type { ColumnFiltersState, Table as TanStackTable } from '@tanstack/react-table'
import type { TableSize } from '@/table/basic/Table'
import type { Color } from '@/theme/tokens'
import { Filter } from './Filter'
import type { FilterApplyMode, FilterField, FilterOption } from './filter.props'

export interface TableFilterProps<TData> {
  table: TanStackTable<TData>
  filterFields: FilterField<TData>[]
  columnFilters: ColumnFiltersState
  size?: TableSize
  color?: Color
  applyMode?: FilterApplyMode
  className?: string
}

function getResolvedFieldOptions<TData>(table: TanStackTable<TData>, field: FilterField<TData>): FilterField<TData> {
  if (field.type !== 'checkbox' || field.options) return field

  const column = table.getColumn(field.id)
  if (!column) return field

  const options: FilterOption[] = Array.from(column.getFacetedUniqueValues().keys()).map(optionValue => ({
    label: String(optionValue),
    value: String(optionValue),
    count: column.getFacetedUniqueValues().get(optionValue),
  }))

  return { ...field, options }
}

export function TableFilter<TData>({
  table,
  filterFields,
  columnFilters,
  size = 'sm',
  color = 'primary',
  applyMode = 'immediate',
  className,
}: TableFilterProps<TData>) {
  const resolvedFields = filterFields.map(field => getResolvedFieldOptions(table, field))

  return (
    <Filter
      filterFields={resolvedFields}
      value={columnFilters}
      onValueChange={nextValue => table.setColumnFilters(nextValue)}
      size={size}
      color={color}
      applyMode={applyMode}
      className={className}
    />
  )
}

TableFilter.displayName = 'TableFilter'
