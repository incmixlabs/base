'use client'

import { isAfter, isBefore, isSameDay } from 'date-fns'
import { X } from 'lucide-react'
import * as React from 'react'
import { Accordion } from '@/elements/accordion/Accordion'
import { AvatarList } from '@/elements/avatar/AvatarList'
import { Badge } from '@/elements/badge/Badge'
import { Button } from '@/elements/button/Button'
import { Checkbox } from '@/form/Checkbox'
import { DateNextCalendarPanel, type DateRangeValue, MiniCalendarNext } from '@/form/date'
import {
  datePickerCalendarCell,
  datePickerCalendarCellRadiusStyles,
  datePickerCalendarCellSizeStyles,
  datePickerCalendarDayInteractive,
  datePickerCalendarSelectedColorStyles,
} from '@/form/date/DatePickerNext.css'
import {
  rangeCalendarCell,
  rangeCalendarDayInteractive,
  rangeCalendarSelectedColorStyles,
} from '@/form/date/DateRangePickerNext.css'
import { normalizeDay } from '@/form/date/date-next-calendar-core'
import { Slider } from '@/form/Slider'
import { TextField } from '@/form/TextField'
import { Flex } from '@/layouts/flex/Flex'
import { cn } from '@/lib/utils'
import { controlSizeTokens } from '@/theme/token-maps'
import type { Color } from '@/theme/tokens'
import { filterHeaderClass, filterSliderValueRowClass } from './Filter.css'
import type {
  FilterApplyMode,
  FilterCalendarMode,
  FilterCalendarValue,
  FilterField,
  FilterOption,
  FilterState,
} from './filter.props'

export type FilterSize = 'xs' | 'sm' | 'md' | 'lg'

export interface FilterProps<TData> {
  filterFields: FilterField<TData>[]
  value: FilterState
  onValueChange: (value: FilterState) => void
  size?: FilterSize
  color?: Color
  applyMode?: FilterApplyMode
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
    .map(filter => ({ id: filter.id, value: normalizeFilterValue(filter.value) }))
    .sort((left, right) => left.id.localeCompare(right.id))
  const normalizedB = [...b]
    .map(filter => ({ id: filter.id, value: normalizeFilterValue(filter.value) }))
    .sort((left, right) => left.id.localeCompare(right.id))

  return JSON.stringify(normalizedA) === JSON.stringify(normalizedB)
}

function getFilterValue(filterState: FilterState, id: string) {
  return filterState.find(filter => filter.id === id)?.value
}

function setFilterStateValue(filterState: FilterState, id: string, value: unknown) {
  const next = filterState.filter(filter => filter.id !== id)
  return value == null ? next : [...next, { id, value }]
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
    <Flex direction="column" style={{ gap: '0.125rem', padding: '0.25rem 0' }}>
      {options.map(option => (
        <label key={option.value}>
          <Flex as="span" align="center" gap="2" py="1" className="cursor-pointer">
            <Checkbox
              checked={filterValue.includes(option.value)}
              onCheckedChange={() => handleToggle(option.value)}
              size={size}
              color={color}
            />
            {option.icon ?? null}
            <span>{option.label}</span>
            {option.count != null ? (
              <Badge size="xs" variant="soft" color="slate" className="ml-auto tabular-nums">
                {option.count}
              </Badge>
            ) : null}
          </Flex>
        </label>
      ))}
    </Flex>
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
    <Flex direction="column" style={{ gap: '0.125rem', padding: '0.25rem 0' }}>
      <TextField
        size={size}
        color={color}
        placeholder={`Filter ${field.label}...`}
        value={filterValue}
        onChange={event => onChange(event.target.value || undefined)}
      />
    </Flex>
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
    <Flex direction="column" style={{ gap: '0.125rem', padding: '0.25rem 0' }}>
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
      <Flex justify="between" className={filterSliderValueRowClass}>
        <span>{filterValue[0]}</span>
        <span>{filterValue[1]}</span>
      </Flex>
    </Flex>
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
    <Flex direction="column" style={{ gap: '0.125rem', padding: '0.25rem 0' }}>
      <AvatarList
        items={field.items}
        size={size === 'lg' ? 'sm' : 'xs'}
        selectable
        selectedIds={filterValue}
        onSelectedIdsChange={value => onChange(value.length > 0 ? value : undefined)}
      />
    </Flex>
  )
}

function FilterCalendarField<TData>({
  field,
  filterValue,
  onChange,
  color,
}: {
  field: Extract<FilterField<TData>, { type: 'calendar' }>
  filterValue?: FilterCalendarValue
  onChange: (value: FilterCalendarValue | undefined) => void
  color: Color
}) {
  const mode: FilterCalendarMode = field.mode ?? 'single'
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
      <Flex direction="column" style={{ gap: '0.125rem', padding: '0.25rem 0' }}>
        <MiniCalendarNext
          value={filterValue instanceof Date ? filterValue : undefined}
          onChange={date => onChange(date)}
          minDate={field.minDate}
          maxDate={field.maxDate}
          color={color}
          radius={radius}
          size={size}
        />
      </Flex>
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
    <Flex direction="column" style={{ gap: '0.125rem', padding: '0.25rem 0' }}>
      <DateNextCalendarPanel
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
    </Flex>
  )
}

function FilterFieldComponent<TData>({
  field,
  value,
  onFilterChange,
  size,
  color,
}: {
  field: FilterField<TData>
  value: FilterState
  onFilterChange: (fieldId: string, value: unknown) => void
  size: FilterSize
  color: Color
}) {
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
          onChange={nextValue => onFilterChange(field.id, nextValue)}
          color={color}
        />
      )
    default:
      return null
  }
}

export function Filter<TData>({
  filterFields,
  value,
  onValueChange,
  size = 'sm',
  color = 'primary',
  applyMode = 'immediate',
  className,
}: FilterProps<TData>) {
  const isManual = applyMode === 'manual'
  const [draftValue, setDraftValue] = React.useState<FilterState>(value)

  React.useEffect(() => {
    setDraftValue(value)
  }, [value])

  const displayedValue = isManual ? draftValue : value
  const hasFilters = value.length > 0
  const hasDraftChanges = isManual && !areFilterStatesEqual(draftValue, value)
  const canResetAll = isManual ? hasDraftChanges : hasFilters
  const defaultOpenItems = filterFields.filter(f => f.defaultOpen !== false).map(f => f.id)

  const handleFilterChange = React.useCallback(
    (fieldId: string, nextValue: unknown) => {
      if (isManual) {
        setDraftValue(current => setFilterStateValue(current, fieldId, nextValue))
        return
      }

      onValueChange(setFilterStateValue(value, fieldId, nextValue))
    },
    [isManual, onValueChange, value],
  )

  const handleResetAll = React.useCallback(() => {
    if (isManual) {
      setDraftValue(value)
      return
    }

    onValueChange([])
  }, [isManual, onValueChange, value])

  const handleApply = React.useCallback(() => {
    onValueChange(draftValue)
  }, [draftValue, onValueChange])

  if (filterFields.length === 0) return null

  return (
    <div className={className} style={{ fontSize: controlSizeTokens[size].fontSize }}>
      <Flex align="center" justify="between" gap="3" className={filterHeaderClass}>
        <span>Filters</span>
        {isManual ? (
          <Flex align="center" gap="2">
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
              color="primary"
              size="xs"
              onClick={handleApply}
              disabled={!hasDraftChanges}
            >
              Apply
            </Button>
          </Flex>
        ) : hasFilters ? (
          <Button type="button" variant="ghost" color="slate" size="sm" onClick={handleResetAll}>
            Reset all
          </Button>
        ) : null}
      </Flex>
      <Accordion.Root
        multiple
        size="xs"
        border={false}
        triggerPadding={false}
        contentPadding={false}
        defaultValue={defaultOpenItems}
      >
        {filterFields.map(field => {
          const hasValue = getFilterValue(displayedValue, field.id) != null
          return (
            <Accordion.Item key={field.id} value={field.id}>
              <Flex align="center" width="100%">
                <Accordion.Trigger style={{ flex: 1 }}>{field.label}</Accordion.Trigger>
                {hasValue ? (
                  <Button
                    type="button"
                    variant="ghost"
                    color="slate"
                    size="sm"
                    onClick={event => {
                      event.stopPropagation()
                      handleFilterChange(field.id, undefined)
                    }}
                    aria-label={`Reset ${field.label} filter`}
                    style={{ paddingInline: '0.5rem', flexShrink: 0 }}
                  >
                    <X style={{ width: '0.75rem', height: '0.75rem' }} />
                  </Button>
                ) : null}
              </Flex>
              <Accordion.Content>
                <FilterFieldComponent
                  field={field}
                  value={displayedValue}
                  onFilterChange={handleFilterChange}
                  size={size}
                  color={color}
                />
              </Accordion.Content>
            </Accordion.Item>
          )
        })}
      </Accordion.Root>
    </div>
  )
}

Filter.displayName = 'Filter'
