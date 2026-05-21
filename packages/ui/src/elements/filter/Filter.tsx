'use client'

import { isAfter, isBefore, isSameDay } from 'date-fns'
import * as React from 'react'
import { Accordion } from '@/elements/accordion/Accordion'
import { AvatarList } from '@/elements/avatar/AvatarList'
import { Badge } from '@/elements/badge/Badge'
import { Button } from '@/elements/button/Button'
import { IconButton } from '@/elements/button/IconButton'
import { Checkbox } from '@/form/Checkbox'
import { DateCalendarPanel, type DateRangeValue, MiniCalendar } from '@/form/date'
import {
  datePickerCalendarCell,
  datePickerCalendarCellRadiusStyles,
  datePickerCalendarCellSizeStyles,
  datePickerCalendarDayInteractive,
  datePickerCalendarSelectedColorStyles,
} from '@/form/date/DatePicker.css'
import {
  rangeCalendarCell,
  rangeCalendarDayInteractive,
  rangeCalendarSelectedColorStyles,
} from '@/form/date/DateRangePicker.css'
import { normalizeDay } from '@/form/date/date-calendar-core'
import { NumberInput } from '@/form/NumberInput'
import { Select, SelectItem } from '@/form/Select'
import { Slider } from '@/form/Slider'
import { TextField } from '@/form/TextField'
import { Box } from '@/layouts/box/Box'
import { Column, Row } from '@/layouts/flex/Flex'
import { cn } from '@/lib/utils'
import { controlSizeTokens } from '@/theme/token-maps'
import type { Color } from '@/theme/tokens'
import { Text } from '@/typography/text/Text'
import {
  filterAppliedClass,
  filterBodyClass,
  filterFooterClass,
  filterHeaderClass,
  filterSliderValueRowClass,
} from './Filter.css'
import type {
  FilterApplyMode,
  FilterCalendarMode,
  FilterCalendarValue,
  FilterField,
  FilterJsonSchema,
  FilterNumberValue,
  FilterOperator,
  FilterOption,
  FilterSchemaOptions,
  FilterState,
} from './filter.props'
import { filterOperatorLabels } from './filter.props'
import { getFilterFieldsFromSchema } from './filter-schema'

export type FilterSize = 'xs' | 'sm' | 'md' | 'lg'

export interface FilterProps<TData = Record<string, unknown>> {
  filterFields?: FilterField<TData>[]
  schema?: FilterJsonSchema
  schemaOptions?: FilterSchemaOptions<TData>
  value: FilterState
  onValueChange: (value: FilterState) => void
  title?: React.ReactNode
  description?: React.ReactNode
  size?: FilterSize
  color?: Color
  applyMode?: FilterApplyMode
  showAppliedFilters?: boolean
  addFilterLabel?: React.ReactNode
  onAddFilter?: () => void
  className?: string
}

function normalizeFilterValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return [...value].map(entry => normalizeFilterValue(entry)).sort()
  }

  if (value instanceof Date) {
    return value.getTime()
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, entryValue]) => [key, normalizeFilterValue(entryValue)]),
    )
  }

  return value
}

function areFilterStatesEqual(a: FilterState, b: FilterState) {
  if (a.length !== b.length) return false

  const normalizedA = [...a]
    .map(filter => ({ id: filter.id, operator: filter.operator, value: normalizeFilterValue(filter.value) }))
    .sort((left, right) => left.id.localeCompare(right.id))
  const normalizedB = [...b]
    .map(filter => ({ id: filter.id, operator: filter.operator, value: normalizeFilterValue(filter.value) }))
    .sort((left, right) => left.id.localeCompare(right.id))

  return JSON.stringify(normalizedA) === JSON.stringify(normalizedB)
}

function hasFilterValue(value: unknown): boolean {
  if (value == null) return false
  if (typeof value === 'string') return value.trim().length > 0
  if (Array.isArray(value)) return value.some(entry => hasFilterValue(entry))
  if (value && typeof value === 'object' && 'from' in value) {
    const range = value as { from?: unknown; to?: unknown }
    return hasFilterValue(range.from) || hasFilterValue(range.to)
  }
  return true
}

function getFilterItem(filterState: FilterState, id: string) {
  return filterState.find(filter => filter.id === id)
}

function getFilterValue(filterState: FilterState, id: string) {
  return getFilterItem(filterState, id)?.value
}

function getDefaultOperator<TData>(field: FilterField<TData>) {
  return field.defaultOperator ?? field.operators?.[0]
}

function getFilterOperator<TData>(
  filterState: FilterState,
  field: FilterField<TData>,
  operatorDraft: Record<string, FilterOperator | undefined>,
) {
  return getFilterItem(filterState, field.id)?.operator ?? operatorDraft[field.id] ?? getDefaultOperator(field)
}

function setFilterStateValue(filterState: FilterState, id: string, value: unknown, operator?: FilterOperator) {
  const existing = getFilterItem(filterState, id)
  const next = filterState.filter(filter => filter.id !== id)
  return hasFilterValue(value) ? [...next, { id, operator: operator ?? existing?.operator, value }] : next
}

function setFilterStateOperator(filterState: FilterState, id: string, operator: FilterOperator) {
  return filterState.map(filter => (filter.id === id ? { ...filter, operator } : filter))
}

function formatFilterDisplayValue(value: unknown): string {
  if (value instanceof Date) return value.toLocaleDateString()
  if (Array.isArray(value)) return value.map(formatFilterDisplayValue).join(', ')
  if (value && typeof value === 'object' && 'from' in value) {
    const range = value as { from?: Date | string; to?: Date | string }
    const from = range.from ? formatFilterDisplayValue(new Date(range.from)) : ''
    const to = range.to ? formatFilterDisplayValue(new Date(range.to)) : ''
    return [from, to].filter(Boolean).join(' to ')
  }

  return String(value)
}

function formatFilterDisplayValueForField<TData>(field: FilterField<TData> | undefined, value: unknown): string {
  if (!field) return formatFilterDisplayValue(value)

  if ((field.type === 'checkbox' || field.type === 'select') && field.options) {
    const labelForValue = (optionValue: unknown) =>
      field.options?.find(option => option.value === optionValue)?.label ?? formatFilterDisplayValue(optionValue)

    if (Array.isArray(value)) return value.map(labelForValue).join(', ')
    return labelForValue(value)
  }

  return formatFilterDisplayValue(value)
}

function formatAppliedFilterLabel<TData>(field: FilterField<TData> | undefined, operator?: FilterOperator) {
  const label = field?.label ?? ''
  if (!operator || operator === 'equals') return label
  return `${label} ${filterOperatorLabels[operator].toLowerCase()}`
}

function FilterCheckboxField<TData>({
  field,
  filterValue,
  onChange,
  size,
  color,
}: {
  field: Extract<FilterField<TData>, { type: 'checkbox' }>
  filterValue: string[]
  onChange: (value: string[] | undefined) => void
  size: FilterSize
  color: Color
}) {
  const options: FilterOption[] = field.options ?? []

  const handleToggle = (value: string) => {
    const next = filterValue.includes(value) ? filterValue.filter(v => v !== value) : [...filterValue, value]
    onChange(next.length > 0 ? next : undefined)
  }

  return (
    <Column gap="1" py="1">
      {options.map(option => (
        <Row
          key={option.value}
          asChild
          align="center"
          gap="2"
          py="1"
          style={{ cursor: 'pointer', minHeight: '1.75rem' }}
        >
          <label>
            <Checkbox
              checked={filterValue.includes(option.value)}
              onCheckedChange={() => handleToggle(option.value)}
              size={size}
              color={color}
            />
            {option.icon ?? null}
            <Box flexGrow="1" minWidth="0">
              <Text size="sm" color="slate" truncate>
                {option.label}
              </Text>
            </Box>
            {option.count != null ? (
              <Badge size="xs" variant="soft" color="slate">
                {option.count}
              </Badge>
            ) : null}
          </label>
        </Row>
      ))}
    </Column>
  )
}

function FilterSelectField<TData>({
  field,
  filterValue,
  onChange,
  size,
  color,
}: {
  field: Extract<FilterField<TData>, { type: 'select' }>
  filterValue?: string
  onChange: (value: string | undefined) => void
  size: FilterSize
  color: Color
}) {
  const options: FilterOption[] = field.options ?? []

  return (
    <Column gap="1" py="1">
      <Select
        size={size}
        color={color}
        value={filterValue}
        placeholder={field.placeholder ?? `Select ${field.label}...`}
        onValueChange={value => onChange(value || undefined)}
      >
        {options.map(option => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </Select>
    </Column>
  )
}

function FilterOperatorSelect<TData>({
  field,
  operator,
  onChange,
  size,
  color,
}: {
  field: FilterField<TData>
  operator?: FilterOperator
  onChange: (operator: FilterOperator) => void
  size: FilterSize
  color: Color
}) {
  const operators = field.operators ?? []
  if (operators.length <= 1) return null

  return (
    <Select
      size={size}
      color={color}
      value={operator ?? operators[0]}
      placeholder="Rule"
      onValueChange={value => onChange(value as FilterOperator)}
    >
      {operators.map(operatorValue => (
        <SelectItem key={operatorValue} value={operatorValue}>
          {filterOperatorLabels[operatorValue]}
        </SelectItem>
      ))}
    </Select>
  )
}

function FilterInputField<TData>({
  field,
  filterValue,
  onChange,
  size,
  color,
}: {
  field: Extract<FilterField<TData>, { type: 'input' }>
  filterValue: string
  onChange: (value: string | undefined) => void
  size: FilterSize
  color: Color
}) {
  return (
    <Column gap="1" py="1">
      <TextField
        size={size}
        color={color}
        placeholder={field.placeholder ?? `Filter ${field.label}...`}
        value={filterValue}
        onChange={event => onChange(event.target.value || undefined)}
      />
    </Column>
  )
}

function FilterNumberField<TData>({
  field,
  filterValue,
  operator,
  onChange,
  size,
  color,
}: {
  field: Extract<FilterField<TData>, { type: 'number' }>
  filterValue?: FilterNumberValue
  operator?: FilterOperator
  onChange: (value: FilterNumberValue | undefined) => void
  size: FilterSize
  color: Color
}) {
  const min = field.min
  const max = field.max
  const step = field.step ?? 1
  const allowDecimal = field.allowDecimal ?? true
  const isBetween = operator === 'between'

  if (isBetween) {
    const [from, to] = Array.isArray(filterValue) ? filterValue : [undefined, undefined]
    const updateRange = (nextFrom: number | undefined, nextTo: number | undefined) => {
      onChange(nextFrom == null && nextTo == null ? undefined : [nextFrom, nextTo])
    }

    return (
      <Row gap="2" py="1">
        <NumberInput
          variant="icon"
          size={size}
          color={color}
          label="Min"
          min={min}
          max={max}
          step={step}
          allowDecimal={allowDecimal}
          value={from ?? ''}
          onValueChange={value => updateRange(value === '' ? undefined : value, to)}
        />
        <NumberInput
          variant="icon"
          size={size}
          color={color}
          label="Max"
          min={min}
          max={max}
          step={step}
          allowDecimal={allowDecimal}
          value={to ?? ''}
          onValueChange={value => updateRange(from, value === '' ? undefined : value)}
        />
      </Row>
    )
  }

  return (
    <Column gap="1" py="1">
      <NumberInput
        variant="icon"
        size={size}
        color={color}
        label="Value"
        min={min}
        max={max}
        step={step}
        allowDecimal={allowDecimal}
        value={typeof filterValue === 'number' ? filterValue : ''}
        placeholder={field.placeholder}
        onValueChange={value => onChange(value === '' ? undefined : value)}
      />
    </Column>
  )
}

function FilterSliderField<TData>({
  field,
  filterValue,
  onChange,
  size,
  color,
}: {
  field: Extract<FilterField<TData>, { type: 'slider' }>
  filterValue: [number, number]
  onChange: (value: [number, number] | undefined) => void
  size: FilterSize
  color: Color
}) {
  const min = field.min ?? 0
  const max = field.max ?? 100

  return (
    <Column gap="2" py="1">
      <Slider
        size={size}
        color={color}
        min={min}
        max={max}
        step={field.step ?? 1}
        value={filterValue}
        onValueChange={value => {
          const [start, end] = value
          if (start === undefined || end === undefined) return
          const nextValue: [number, number] = [start, end]
          onChange(nextValue[0] === min && nextValue[1] === max ? undefined : nextValue)
        }}
      />
      <Row justify="between" className={filterSliderValueRowClass}>
        <Text size="xs" color="slate">
          {filterValue[0]}
        </Text>
        <Text size="xs" color="slate">
          {filterValue[1]}
        </Text>
      </Row>
    </Column>
  )
}

function FilterAvatarListField<TData>({
  field,
  filterValue,
  onChange,
  size,
}: {
  field: Extract<FilterField<TData>, { type: 'avatar-list' }>
  filterValue: string[]
  onChange: (value: string[] | undefined) => void
  size: FilterSize
}) {
  return (
    <Column gap="1" py="1">
      <AvatarList
        items={field.items}
        size={size === 'lg' ? 'sm' : 'xs'}
        selectable
        selectedIds={filterValue}
        onSelectedIdsChange={value => onChange(value.length > 0 ? value : undefined)}
      />
    </Column>
  )
}

function FilterCalendarField<TData>({
  field,
  filterValue,
  operator,
  onChange,
  color,
}: {
  field: Extract<FilterField<TData>, { type: 'calendar' }>
  filterValue?: FilterCalendarValue
  operator?: FilterOperator
  onChange: (value: FilterCalendarValue | undefined) => void
  color: Color
}) {
  const mode: FilterCalendarMode = operator ? (operator === 'between' ? 'range' : 'single') : (field.mode ?? 'single')
  const display = field.display ?? 'mini'
  const showMiniCalendar = display === 'mini' && mode === 'single'
  const size = 'xs'
  const radius = 'md'
  const normalizeRangeValue = React.useCallback(
    (value: DateRangeValue | { from: Date; to?: Date } | undefined) =>
      value?.from
        ? {
            from: normalizeDay(value.from),
            ...(value.to ? { to: normalizeDay(value.to) } : null),
          }
        : undefined,
    [],
  )
  const [rangeDraft, setRangeDraft] = React.useState<DateRangeValue | { from: Date; to?: Date } | undefined>(
    mode === 'range' && filterValue && !Array.isArray(filterValue) && 'from' in filterValue
      ? normalizeRangeValue(filterValue)
      : undefined,
  )

  React.useEffect(() => {
    if (mode !== 'range') return
    if (filterValue && !Array.isArray(filterValue) && 'from' in filterValue && 'to' in filterValue) {
      setRangeDraft(normalizeRangeValue(filterValue))
      return
    }
    setRangeDraft(undefined)
  }, [filterValue, mode, normalizeRangeValue])

  if (showMiniCalendar) {
    return (
      <Column gap="1" py="1">
        <MiniCalendar
          value={filterValue instanceof Date ? filterValue : undefined}
          onChange={date => onChange(date)}
          minDate={field.minDate}
          maxDate={field.maxDate}
          color={color}
          radius={radius}
          size={size}
        />
      </Column>
    )
  }

  const handleSingleChange = (date: Date) => {
    onChange(date)
  }

  const handleMultipleChange = (date: Date) => {
    const current = Array.isArray(filterValue) ? filterValue : []
    const next = current.some(selectedDate => isSameDay(selectedDate, date))
      ? current.filter(selectedDate => !isSameDay(selectedDate, date))
      : [...current, date]
    onChange(next.length > 0 ? next : undefined)
  }

  const handleRangeChange = (date: Date) => {
    const normalizedDate = normalizeDay(date)
    if (!rangeDraft?.from || rangeDraft.to) {
      setRangeDraft({ from: normalizedDate })
      return
    }

    const start = isBefore(normalizedDate, rangeDraft.from) ? normalizedDate : rangeDraft.from
    const end = isAfter(normalizedDate, rangeDraft.from) ? normalizedDate : rangeDraft.from
    const nextRange = { from: start, to: end }
    setRangeDraft(nextRange)
    onChange(nextRange)
  }

  const currentRange = mode === 'range' && rangeDraft && 'from' in rangeDraft ? rangeDraft : undefined

  return (
    <Column gap="1" py="1">
      <DateCalendarPanel
        value={filterValue instanceof Date ? filterValue : undefined}
        onChange={handleSingleChange}
        minValue={field.minDate}
        maxValue={field.maxDate}
        color={color}
        radius={radius}
        size={size}
        highlightToday
        renderDay={
          mode === 'single'
            ? undefined
            : state => {
                const nonInteractive = state.outsideMonth || state.unavailable

                if (mode === 'multiple') {
                  const selectedDates = Array.isArray(filterValue) ? filterValue : []
                  const isSelected = selectedDates.some(selectedDate => isSameDay(selectedDate, state.normalized))

                  return (
                    <button
                      key={state.dayKey}
                      type="button"
                      aria-label={`${state.dayLabelFormatter.format(state.normalized)}${isSelected ? ', selected' : ''}`}
                      aria-disabled={nonInteractive}
                      aria-current={state.today ? 'date' : undefined}
                      disabled={nonInteractive}
                      data-unavailable={state.unavailable ? '' : undefined}
                      data-outside-month={state.outsideMonth ? '' : undefined}
                      data-selected={isSelected ? '' : undefined}
                      data-today={state.today ? '' : undefined}
                      data-day-key={state.dayKey}
                      tabIndex={state.isFocusTarget ? 0 : -1}
                      className={cn(
                        datePickerCalendarCell,
                        datePickerCalendarCellSizeStyles[size],
                        datePickerCalendarCellRadiusStyles[radius],
                        datePickerCalendarDayInteractive,
                        datePickerCalendarSelectedColorStyles[color],
                        'text-foreground',
                        'data-[outside-month]:text-muted-foreground/60',
                      )}
                      onClick={() => {
                        if (nonInteractive) return
                        handleMultipleChange(state.normalized)
                      }}
                    >
                      {state.dayNumberFormatter.format(state.normalized.getDate())}
                    </button>
                  )
                }

                const rangeFrom = currentRange?.from
                const rangeTo = currentRange?.to
                const isSelected =
                  rangeFrom && rangeTo
                    ? state.normalized.getTime() >= rangeFrom.getTime() &&
                      state.normalized.getTime() <= rangeTo.getTime()
                    : rangeFrom
                      ? isSameDay(state.normalized, rangeFrom)
                      : false
                const isSelectionStart = rangeFrom ? isSameDay(state.normalized, rangeFrom) : false
                const isSelectionEnd = rangeTo ? isSameDay(state.normalized, rangeTo) : false

                return (
                  <button
                    key={state.dayKey}
                    type="button"
                    aria-label={`${state.dayLabelFormatter.format(state.normalized)}${isSelected ? ', selected' : ''}`}
                    aria-disabled={nonInteractive}
                    aria-current={state.today ? 'date' : undefined}
                    disabled={nonInteractive}
                    data-unavailable={state.unavailable ? '' : undefined}
                    data-outside-month={state.outsideMonth ? '' : undefined}
                    data-selected={isSelected ? '' : undefined}
                    data-selection-start={isSelectionStart ? '' : undefined}
                    data-selection-end={isSelectionEnd ? '' : undefined}
                    data-today={state.today ? '' : undefined}
                    data-day-key={state.dayKey}
                    tabIndex={state.isFocusTarget ? 0 : -1}
                    className={cn(
                      rangeCalendarCell,
                      rangeCalendarDayInteractive,
                      rangeCalendarSelectedColorStyles[color],
                      'text-foreground',
                      'data-[outside-month]:text-muted-foreground/60',
                    )}
                    onClick={() => {
                      if (nonInteractive) return
                      handleRangeChange(state.normalized)
                    }}
                  >
                    {state.dayNumberFormatter.format(state.normalized.getDate())}
                  </button>
                )
              }
        }
      />
    </Column>
  )
}

function FilterAppliedFilters<TData>({
  filters,
  filterFields,
  color,
  onRemove,
}: {
  filters: FilterState
  filterFields: FilterField<TData>[]
  color: Color
  onRemove: (fieldId: string) => void
}) {
  const visibleFilters = filters.filter(filter => hasFilterValue(filter.value))

  if (visibleFilters.length === 0) {
    return (
      <Text size="xs" color="slate" variant="muted">
        No applied filters
      </Text>
    )
  }

  return (
    <Row wrap="wrap" gap="2">
      {visibleFilters.map(filter => {
        const field = filterFields.find(candidate => candidate.id === filter.id)
        const label = field ? formatAppliedFilterLabel(field, filter.operator) : filter.id
        return (
          <Badge
            key={filter.id}
            size="sm"
            variant="soft"
            color={color}
            radius="full"
            onDelete={() => onRemove(filter.id)}
            deleteLabel={`Remove ${label} filter`}
          >
            {label}: {formatFilterDisplayValueForField(field, filter.value)}
          </Badge>
        )
      })}
    </Row>
  )
}

function FilterFieldComponent<TData>({
  field,
  value,
  operator,
  onFilterChange,
  onOperatorChange,
  size,
  color,
}: {
  field: FilterField<TData>
  value: FilterState
  operator?: FilterOperator
  onFilterChange: (fieldId: string, value: unknown) => void
  onOperatorChange: (fieldId: string, operator: FilterOperator) => void
  size: FilterSize
  color: Color
}) {
  const control = (() => {
    switch (field.type) {
      case 'checkbox':
        return (
          <FilterCheckboxField
            field={field}
            filterValue={(getFilterValue(value, field.id) as string[]) ?? []}
            onChange={nextValue => onFilterChange(field.id, nextValue)}
            size={size}
            color={color}
          />
        )
      case 'input':
        return (
          <FilterInputField
            field={field}
            filterValue={(getFilterValue(value, field.id) as string) ?? ''}
            onChange={nextValue => onFilterChange(field.id, nextValue)}
            size={size}
            color={color}
          />
        )
      case 'select':
        return (
          <FilterSelectField
            field={field}
            filterValue={getFilterValue(value, field.id) as string | undefined}
            onChange={nextValue => onFilterChange(field.id, nextValue)}
            size={size}
            color={color}
          />
        )
      case 'number':
        return (
          <FilterNumberField
            field={field}
            filterValue={getFilterValue(value, field.id) as FilterNumberValue | undefined}
            operator={operator}
            onChange={nextValue => onFilterChange(field.id, nextValue)}
            size={size}
            color={color}
          />
        )
      case 'slider':
        return (
          <FilterSliderField
            field={field}
            filterValue={(getFilterValue(value, field.id) as [number, number]) ?? [field.min ?? 0, field.max ?? 100]}
            onChange={nextValue => onFilterChange(field.id, nextValue)}
            size={size}
            color={color}
          />
        )
      case 'avatar-list':
        return (
          <FilterAvatarListField
            field={field}
            filterValue={(getFilterValue(value, field.id) as string[]) ?? []}
            onChange={nextValue => onFilterChange(field.id, nextValue)}
            size={size}
          />
        )
      case 'calendar':
        return (
          <FilterCalendarField
            field={field}
            filterValue={getFilterValue(value, field.id) as FilterCalendarValue | undefined}
            operator={operator}
            onChange={nextValue => onFilterChange(field.id, nextValue)}
            color={color}
          />
        )
      default:
        return null
    }
  })()

  return (
    <Column gap="2">
      <FilterOperatorSelect
        field={field}
        operator={operator}
        onChange={nextOperator => onOperatorChange(field.id, nextOperator)}
        size={size}
        color={color}
      />
      {control}
    </Column>
  )
}

export function Filter<TData>({
  filterFields,
  schema,
  schemaOptions,
  value,
  onValueChange,
  title = 'Filters',
  description,
  size = 'sm',
  color = 'primary',
  applyMode = 'immediate',
  showAppliedFilters = true,
  addFilterLabel = 'Add filter',
  onAddFilter,
  className,
}: FilterProps<TData>) {
  const isManual = applyMode === 'manual'
  const resolvedFilterFields = React.useMemo(
    () => filterFields ?? (schema ? getFilterFieldsFromSchema<TData>(schema, schemaOptions) : []),
    [filterFields, schema, schemaOptions],
  )
  const [draftValue, setDraftValue] = React.useState<FilterState>(value)
  const [operatorDraft, setOperatorDraft] = React.useState<Record<string, FilterOperator | undefined>>({})

  React.useEffect(() => {
    setDraftValue(value)
  }, [value])

  React.useEffect(() => {
    setOperatorDraft(
      Object.fromEntries(value.flatMap(filter => (filter.operator ? [[filter.id, filter.operator]] : []))),
    )
  }, [value])

  const displayedValue = isManual ? draftValue : value
  const hasFilters = displayedValue.some(filter => hasFilterValue(filter.value))
  const hasDraftChanges = isManual && !areFilterStatesEqual(draftValue, value)
  const canResetAll = hasFilters
  const hasHeader = title != null || description != null || onAddFilter
  const defaultOpenItems = resolvedFilterFields.filter(f => f.defaultOpen !== false).map(f => f.id)

  const handleFilterChange = React.useCallback(
    (fieldId: string, nextValue: unknown) => {
      const field = resolvedFilterFields.find(candidate => candidate.id === fieldId)
      const operator = field ? getFilterOperator(displayedValue, field, operatorDraft) : operatorDraft[fieldId]

      if (isManual) {
        setDraftValue(current => setFilterStateValue(current, fieldId, nextValue, operator))
        return
      }

      onValueChange(setFilterStateValue(value, fieldId, nextValue, operator))
    },
    [displayedValue, isManual, onValueChange, operatorDraft, resolvedFilterFields, value],
  )

  const handleOperatorChange = React.useCallback(
    (fieldId: string, nextOperator: FilterOperator) => {
      setOperatorDraft(current => ({ ...current, [fieldId]: nextOperator }))

      if (!hasFilterValue(getFilterValue(displayedValue, fieldId))) return

      if (isManual) {
        setDraftValue(current => setFilterStateOperator(current, fieldId, nextOperator))
        return
      }

      onValueChange(setFilterStateOperator(value, fieldId, nextOperator))
    },
    [displayedValue, isManual, onValueChange, value],
  )

  const handleResetAll = React.useCallback(() => {
    if (isManual) {
      setDraftValue([])
      return
    }

    onValueChange([])
  }, [isManual, onValueChange])

  const handleApply = React.useCallback(() => {
    onValueChange(draftValue)
  }, [draftValue, onValueChange])

  if (resolvedFilterFields.length === 0) return null

  return (
    <Column
      height="100%"
      minHeight="0"
      gap="3"
      className={className}
      style={{ fontSize: controlSizeTokens[size].fontSize }}
    >
      {hasHeader ? (
        <Column gap="3" className={filterHeaderClass}>
          <Row align="start" justify="between" gap="3">
            <Column gap="1" minWidth="0">
              {title != null ? (
                <Text size="sm" weight="bold" color="slate">
                  {title}
                </Text>
              ) : null}
              {description ? (
                <Text size="xs" color="slate" variant="muted">
                  {description}
                </Text>
              ) : null}
            </Column>
            {onAddFilter ? (
              <Button type="button" variant="soft" color={color} size="xs" iconStart="plus" onClick={onAddFilter}>
                {addFilterLabel}
              </Button>
            ) : null}
          </Row>
        </Column>
      ) : null}

      {showAppliedFilters ? (
        <Column gap="2" className={filterAppliedClass}>
          <Row align="center" justify="between" gap="2">
            <Text size="xs" weight="bold" color="slate">
              Applied
            </Text>
            {!isManual ? (
              <Button
                type="button"
                variant="ghost"
                color="slate"
                size="xs"
                onClick={handleResetAll}
                disabled={!canResetAll}
              >
                Reset all
              </Button>
            ) : null}
          </Row>
          <FilterAppliedFilters
            filters={displayedValue}
            filterFields={resolvedFilterFields}
            color={color}
            onRemove={fieldId => handleFilterChange(fieldId, undefined)}
          />
        </Column>
      ) : null}

      <Column flexGrow="1" flexBasis="0" minHeight="0" gap="3" className={filterBodyClass}>
        <Accordion.Root
          multiple
          size="xs"
          border={false}
          triggerPadding={false}
          contentPadding={false}
          defaultValue={defaultOpenItems}
        >
          {resolvedFilterFields.map((field, index) => {
            const hasValue = hasFilterValue(getFilterValue(displayedValue, field.id))
            const operator = getFilterOperator(displayedValue, field, operatorDraft)
            return (
              <Box
                key={field.id}
                asChild
                color="neutral"
                variant={index % 2 === 0 ? 'surface' : 'soft'}
                text="text"
                borderColor="neutral-border"
                radius="md"
                p="3"
              >
                <Accordion.Item value={field.id}>
                  <Row align="center" width="100%" gap="2">
                    <Accordion.Trigger style={{ flex: 1 }}>
                      <Text size="sm" weight="bold" color="slate">
                        {field.label}
                      </Text>
                    </Accordion.Trigger>
                    {hasValue ? (
                      <IconButton
                        type="button"
                        variant="ghost"
                        color="slate"
                        size="xs"
                        icon="close"
                        title={`Reset ${field.label} filter`}
                        onClick={event => {
                          event.stopPropagation()
                          handleFilterChange(field.id, undefined)
                        }}
                      />
                    ) : null}
                  </Row>
                  <Accordion.Content>
                    <FilterFieldComponent
                      field={field}
                      value={displayedValue}
                      operator={operator}
                      onFilterChange={handleFilterChange}
                      onOperatorChange={handleOperatorChange}
                      size={size}
                      color={color}
                    />
                  </Accordion.Content>
                </Accordion.Item>
              </Box>
            )
          })}
        </Accordion.Root>
      </Column>

      {isManual ? (
        <Row justify="end" gap="2" className={filterFooterClass}>
          <Button
            type="button"
            variant="ghost"
            color="slate"
            size="xs"
            onClick={handleResetAll}
            disabled={!canResetAll}
          >
            Reset all
          </Button>
          <Button
            type="button"
            variant="solid"
            color={color}
            size="xs"
            onClick={handleApply}
            disabled={!hasDraftChanges}
          >
            Apply
          </Button>
        </Row>
      ) : null}
    </Column>
  )
}

Filter.displayName = 'Filter'
