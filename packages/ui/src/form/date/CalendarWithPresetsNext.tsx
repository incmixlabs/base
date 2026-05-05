'use client'

import {
  addDays,
  addMonths,
  endOfDay,
  endOfMonth,
  endOfYear,
  isAfter,
  isBefore,
  isSameDay,
  isSameMonth,
  startOfDay,
  startOfMonth,
  startOfYear,
  subDays,
  subMonths,
  subYears,
} from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { forwardRef, useEffect, useMemo, useRef, useState } from 'react'
import { Button } from '@/elements/button/Button'
import {
  iconButtonBase,
  iconButtonColorVariants,
  iconButtonSizeIconScope,
  iconButtonSizeVariants,
} from '@/elements/button/IconButton.css'
import { UpDownCaret } from '@/elements/menu/UpDownCaret'
import { cn } from '@/lib/utils'
import type { Color, Radius } from '@/theme/tokens'
import { DateNextCalendarPanel, type DayRenderState } from './DateNextCalendarPanel'
import {
  datePickerCalendarCellSizeStyles,
  datePickerCalendarHeadingSizeStyles,
  datePickerCalendarIconSizeStyles,
  datePickerNavButton,
  datePickerNavButtonSizeStyles,
} from './DatePickerNext.css'
import {
  rangeCalendarCell,
  rangeCalendarDayInteractive,
  rangeCalendarSelectedColorStyles,
} from './DateRangePickerNext.css'
import type { WeekStartsOn } from './date-next.props'
import { type DateNextSize, isDateNextSize } from './date-next.props'
import { normalizeDay, toDayKey } from './date-next-calendar-core'
import { mapDateNextSizeToButtonSize } from './date-next-size-maps'
import { dateNextElementRadiusStyles } from './date-next-surface.shared.css'
import { MonthYearPicker } from './MonthYearPicker'
import { useDateNextFormatters } from './useDateNextFormatters'

export interface DateRangePresetNext {
  /** Label displayed on the button */
  label: string
  /** Function that returns the date range */
  getValue: () => { from?: Date; to?: Date }
}

/** Default presets for common date ranges. */
export const defaultPresetsNext: DateRangePresetNext[] = [
  {
    label: 'Today',
    getValue: () => {
      const today = startOfDay(new Date())
      return { from: today, to: today }
    },
  },
  {
    label: 'Yesterday',
    getValue: () => {
      const yesterday = startOfDay(subDays(new Date(), 1))
      return { from: yesterday, to: yesterday }
    },
  },
  {
    label: 'Tomorrow',
    getValue: () => {
      const tomorrow = startOfDay(addDays(new Date(), 1))
      return { from: tomorrow, to: tomorrow }
    },
  },
  {
    label: 'Last 7 days',
    getValue: () => {
      const today = endOfDay(new Date())
      const from = startOfDay(subDays(new Date(), 6))
      return { from, to: today }
    },
  },
  {
    label: 'Next 7 days',
    getValue: () => {
      const today = startOfDay(new Date())
      const to = endOfDay(addDays(new Date(), 6))
      return { from: today, to }
    },
  },
  {
    label: 'Last 30 days',
    getValue: () => {
      const today = endOfDay(new Date())
      const from = startOfDay(subDays(new Date(), 29))
      return { from, to: today }
    },
  },
  {
    label: 'Month to date',
    getValue: () => {
      const today = endOfDay(new Date())
      const from = startOfMonth(new Date())
      return { from, to: today }
    },
  },
  {
    label: 'Last month',
    getValue: () => {
      const lastMonth = subMonths(new Date(), 1)
      return { from: startOfMonth(lastMonth), to: endOfMonth(lastMonth) }
    },
  },
  {
    label: 'Next month',
    getValue: () => {
      const nextMonth = addMonths(new Date(), 1)
      return { from: startOfMonth(nextMonth), to: endOfMonth(nextMonth) }
    },
  },
  {
    label: 'Year to date',
    getValue: () => {
      const today = endOfDay(new Date())
      const from = startOfYear(new Date())
      return { from, to: today }
    },
  },
  {
    label: 'Last year',
    getValue: () => {
      const lastYear = subYears(new Date(), 1)
      return { from: startOfYear(lastYear), to: endOfYear(lastYear) }
    },
  },
]

export interface CalendarWithPresetsNextProps {
  /** Selected date range */
  value?: { from?: Date; to?: Date }
  /** Callback when date range changes */
  onChange?: (range: { from?: Date; to?: Date } | undefined) => void
  /** Custom presets (uses defaultPresetsNext if not provided) */
  presets?: DateRangePresetNext[]
  /** Whether to show the calendar */
  showCalendar?: boolean
  /** Number of months to display */
  visibleMonths?: 1 | 2
  /** Layout direction */
  layout?: 'vertical' | 'horizontal'
  /** Whether the picker is disabled */
  isDisabled?: boolean
  /** Minimum selectable date */
  minValue?: Date
  /** Maximum selectable date */
  maxValue?: Date
  /** Specific dates to disable */
  disabledDates?: Date[]
  /** Size variant */
  size?: DateNextSize
  /** Color variant */
  color?: Color
  /** Border radius */
  radius?: Radius
  /** Additional class names */
  className?: string
  /** First day of week override */
  weekStartsOn?: WeekStartsOn
}

export const CalendarWithPresetsNext = forwardRef<HTMLDivElement, CalendarWithPresetsNextProps>(
  (
    {
      value,
      onChange,
      presets = defaultPresetsNext,
      showCalendar = true,
      visibleMonths = 1,
      layout = 'vertical',
      isDisabled = false,
      minValue,
      maxValue,
      disabledDates,
      size: sizeProp = 'md',
      color = 'slate',
      radius = 'md',
      className,
      weekStartsOn: weekStartsOnProp,
    },
    ref,
  ) => {
    const size: DateNextSize = isDateNextSize(sizeProp) ? sizeProp : 'md'
    const isDual = visibleMonths === 2

    /* ── Formatters for dual-month header ── */
    const { monthHeadingFormatter } = useDateNextFormatters()

    /* ── Month/year picker state (dual mode only — single mode uses panel's built-in picker) ── */
    const [monthYearPickerPanel, setMonthYearPickerPanel] = useState<0 | 1 | null>(null)
    const leftHeadingRef = useRef<HTMLButtonElement | null>(null)
    const rightHeadingRef = useRef<HTMLButtonElement | null>(null)

    /* ── Range selection state ── */
    const [rangeDraft, setRangeDraft] = useState<{ from?: Date; to?: Date } | undefined>(value)

    useEffect(() => {
      setRangeDraft(value)
    }, [value])

    const activeRange = rangeDraft ?? value

    /* ── Left/right month state ── */
    const [leftMonth, setLeftMonth] = useState<Date>(() => startOfMonth(value?.from ?? new Date()))
    const [rightMonth, setRightMonth] = useState<Date>(() => {
      const left = startOfMonth(value?.from ?? new Date())
      const right = startOfMonth(value?.to ?? addMonths(new Date(), 1))
      return isSameMonth(left, right) || isAfter(left, right) ? addMonths(left, 1) : right
    })

    useEffect(() => {
      if (value?.from) {
        setLeftMonth(startOfMonth(value.from))
        if (isDual) {
          const candidateRight = value.to ? startOfMonth(value.to) : addMonths(startOfMonth(value.from), 1)
          setRightMonth(
            isSameMonth(startOfMonth(value.from), candidateRight) || isAfter(startOfMonth(value.from), candidateRight)
              ? addMonths(startOfMonth(value.from), 1)
              : candidateRight,
          )
        }
      }
    }, [value?.from, value?.to, isDual])

    /* ── Unavailable set for range logic ── */
    const unavailableDateKeys = useMemo(
      () => new Set((disabledDates ?? []).map(d => toDayKey(normalizeDay(d)))),
      [disabledDates],
    )
    const minDay = useMemo(() => (minValue ? normalizeDay(minValue) : undefined), [minValue])
    const maxDay = useMemo(() => (maxValue ? normalizeDay(maxValue) : undefined), [maxValue])
    const isDateDisabled = (date: Date) => {
      const day = normalizeDay(date)
      if (minDay && isBefore(day, minDay)) return true
      if (maxDay && isAfter(day, maxDay)) return true
      return unavailableDateKeys.has(toDayKey(day))
    }

    /* ── Range predicates ── */
    const isSelectedDay = (date: Date) => {
      const day = normalizeDay(date)
      const from = activeRange?.from ? normalizeDay(activeRange.from) : undefined
      const to = activeRange?.to ? normalizeDay(activeRange.to) : undefined
      if (from && to) return day >= from && day <= to
      if (from && !to) return isSameDay(day, from)
      return false
    }
    const isSelectionStart = (date: Date) =>
      activeRange?.from ? isSameDay(normalizeDay(date), normalizeDay(activeRange.from)) : false
    const isSelectionEnd = (date: Date) =>
      activeRange?.to ? isSameDay(normalizeDay(date), normalizeDay(activeRange.to)) : false

    /* ── Day click handler ── */
    const onDayPress = (date: Date) => {
      if (isDateDisabled(date) || isDisabled) return
      if (!rangeDraft?.from || rangeDraft.to) {
        setRangeDraft({ from: date })
        return
      }
      const start = isBefore(date, rangeDraft.from) ? date : rangeDraft.from
      const end = isAfter(date, rangeDraft.from) ? date : rangeDraft.from
      const nextRange = { from: start, to: end }
      setRangeDraft(nextRange)
      onChange?.(nextRange)
    }

    /* ── Preset click handler ── */
    const handlePresetClick = (preset: DateRangePresetNext) => {
      if (isDisabled) return
      const range = preset.getValue()

      const clampToBounds = (date?: Date) => {
        if (!date) return date
        let next = date
        if (minValue && isBefore(next, minValue)) next = minValue
        if (maxValue && isAfter(next, maxValue)) next = maxValue
        return next
      }

      const clampedFrom = clampToBounds(range.from)
      const clampedTo = clampToBounds(range.to)

      if (clampedFrom && clampedTo && isAfter(clampedFrom, clampedTo)) return

      const clampedRange = { from: clampedFrom, to: clampedTo }
      if (
        (clampedRange.from && isDateDisabled(clampedRange.from)) ||
        (clampedRange.to && isDateDisabled(clampedRange.to))
      ) {
        return
      }
      setRangeDraft(clampedRange)
      onChange?.(clampedRange)

      if (clampedRange.from) {
        setLeftMonth(startOfMonth(clampedRange.from))
        if (isDual && clampedRange.to) {
          const candidateRight = startOfMonth(clampedRange.to)
          setRightMonth(
            isSameMonth(startOfMonth(clampedRange.from), candidateRight)
              ? addMonths(startOfMonth(clampedRange.from), 1)
              : candidateRight,
          )
        }
      }
    }

    /* ── Navigation (dual mode — single mode uses panel's built-in nav) ── */
    const handlePrevMonth = () => {
      if (isDisabled) return
      setLeftMonth(prev => subMonths(prev, 1))
      setRightMonth(prev => subMonths(prev, 1))
    }
    const handleNextMonth = () => {
      if (isDisabled) return
      setLeftMonth(prev => addMonths(prev, 1))
      setRightMonth(prev => addMonths(prev, 1))
    }

    /* ── Month/year picker handlers (dual mode) ── */
    const handleMonthYearApply = (month: Date) => {
      if (monthYearPickerPanel === 0) {
        setLeftMonth(month)
        if (isSameMonth(month, rightMonth) || isAfter(month, rightMonth)) {
          setRightMonth(addMonths(month, 1))
        }
      } else if (monthYearPickerPanel === 1) {
        if (isSameMonth(month, leftMonth) || isBefore(month, leftMonth)) {
          setRightMonth(addMonths(leftMonth, 1))
        } else {
          setRightMonth(month)
        }
      }
      setMonthYearPickerPanel(null)
    }

    /* ── renderDay for range selection ── */
    const makeRenderDay = () => (state: DayRenderState) => {
      const nonInteractive = state.outsideMonth || state.unavailable || isDisabled
      const selected = isSelectedDay(state.normalized)
      const selStart = isSelectionStart(state.normalized)
      const selEnd = isSelectionEnd(state.normalized)

      return (
        <button
          key={state.dayKey}
          type="button"
          aria-label={`${state.dayLabelFormatter.format(state.normalized)}${selected ? ', selected' : ''}`}
          aria-disabled={nonInteractive}
          aria-current={state.today ? 'date' : undefined}
          disabled={nonInteractive}
          data-unavailable={state.unavailable ? '' : undefined}
          data-outside-month={state.outsideMonth ? '' : undefined}
          data-selected={selected ? '' : undefined}
          data-selection-start={selStart ? '' : undefined}
          data-selection-end={selEnd ? '' : undefined}
          data-today={state.today ? '' : undefined}
          data-day-key={state.dayKey}
          tabIndex={state.isFocusTarget ? 0 : -1}
          className={cn(
            rangeCalendarCell,
            datePickerCalendarCellSizeStyles[size],
            rangeCalendarDayInteractive,
            rangeCalendarSelectedColorStyles[color],
            'text-foreground',
            'data-[outside-month]:text-muted-foreground/60',
          )}
          onClick={() => {
            if (nonInteractive) return
            onDayPress(state.normalized)
          }}
        >
          {state.dayNumberFormatter.format(state.normalized.getDate())}
        </button>
      )
    }

    const renderDay = makeRenderDay()

    /* ── Nav button class (dual-month header only) ── */
    const calendarNavButtonClass = isDual
      ? cn(
          'inline-flex items-center justify-center shrink-0 select-none appearance-none cursor-pointer',
          'p-0 m-0 leading-none rounded-sm transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',
          iconButtonBase,
          iconButtonSizeVariants[mapDateNextSizeToButtonSize(size)],
          iconButtonSizeIconScope,
          iconButtonColorVariants.slate.outline,
        )
      : ''

    const isHorizontal = layout === 'horizontal'

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-lg border bg-background p-4',
          isHorizontal ? 'flex gap-4' : 'flex flex-col gap-4',
          isDisabled && 'opacity-50 pointer-events-none',
          dateNextElementRadiusStyles[radius],
          className,
        )}
      >
        {showCalendar && (
          <div className={cn('relative', isHorizontal && 'border-r pr-4')}>
            {isDual ? (
              <>
                {/* Dual-month custom header */}
                <header className="flex items-center justify-between mb-2">
                  <button
                    type="button"
                    aria-label="Previous month"
                    className={cn(calendarNavButtonClass, datePickerNavButton, datePickerNavButtonSizeStyles[size])}
                    onClick={handlePrevMonth}
                    disabled={isDisabled}
                  >
                    <ChevronLeft className={cn(datePickerCalendarIconSizeStyles[size])} aria-hidden="true" />
                  </button>
                  <div className="flex gap-8">
                    <button
                      ref={leftHeadingRef}
                      type="button"
                      aria-label={`Select month and year: ${monthHeadingFormatter.format(leftMonth)}`}
                      aria-haspopup="dialog"
                      aria-expanded={monthYearPickerPanel === 0}
                      className={cn(
                        datePickerCalendarHeadingSizeStyles[size],
                        'inline-flex items-center justify-center gap-1 font-medium text-foreground select-none',
                        'cursor-pointer transition-colors hover:text-foreground/60',
                        'appearance-none border-0 bg-transparent p-0 m-0 text-inherit font-inherit',
                      )}
                      onClick={() => setMonthYearPickerPanel(0)}
                    >
                      <span>{monthHeadingFormatter.format(leftMonth)}</span>
                      <UpDownCaret />
                    </button>
                    <button
                      ref={rightHeadingRef}
                      type="button"
                      aria-label={`Select month and year: ${monthHeadingFormatter.format(rightMonth)}`}
                      aria-haspopup="dialog"
                      aria-expanded={monthYearPickerPanel === 1}
                      className={cn(
                        datePickerCalendarHeadingSizeStyles[size],
                        'inline-flex items-center justify-center gap-1 font-medium text-foreground select-none',
                        'cursor-pointer transition-colors hover:text-foreground/60',
                        'appearance-none border-0 bg-transparent p-0 m-0 text-inherit font-inherit',
                      )}
                      onClick={() => setMonthYearPickerPanel(1)}
                    >
                      <span>{monthHeadingFormatter.format(rightMonth)}</span>
                      <UpDownCaret />
                    </button>
                  </div>
                  <button
                    type="button"
                    aria-label="Next month"
                    className={cn(calendarNavButtonClass, datePickerNavButton, datePickerNavButtonSizeStyles[size])}
                    onClick={handleNextMonth}
                    disabled={isDisabled}
                  >
                    <ChevronRight className={cn(datePickerCalendarIconSizeStyles[size])} aria-hidden="true" />
                  </button>
                </header>

                {/* Month/year wheel picker (dual mode) */}
                {monthYearPickerPanel !== null && (
                  <MonthYearPicker
                    displayMonth={monthYearPickerPanel === 0 ? leftMonth : rightMonth}
                    onApply={handleMonthYearApply}
                    onClose={() => setMonthYearPickerPanel(null)}
                    triggerRef={monthYearPickerPanel === 0 ? leftHeadingRef : rightHeadingRef}
                    locale={monthHeadingFormatter.resolvedOptions().locale}
                    minValue={minValue}
                    maxValue={maxValue}
                    size={size}
                    color={color}
                  />
                )}

                {/* Two calendar panels side by side */}
                <div className="flex gap-4">
                  <DateNextCalendarPanel
                    showHeader={false}
                    displayMonth={leftMonth}
                    onDisplayMonthChange={nextMonth => {
                      const normalizedLeft = startOfMonth(nextMonth)
                      setLeftMonth(normalizedLeft)
                      setRightMonth(prevRight =>
                        isAfter(prevRight, normalizedLeft) ? prevRight : addMonths(normalizedLeft, 1),
                      )
                    }}
                    minValue={minValue}
                    maxValue={maxValue}
                    disabledDates={disabledDates}
                    isDisabled={isDisabled}
                    size={size}
                    color={color}
                    radius={radius}
                    weekStartsOn={weekStartsOnProp}
                    renderDay={renderDay}
                  />
                  <DateNextCalendarPanel
                    showHeader={false}
                    displayMonth={rightMonth}
                    onDisplayMonthChange={nextMonth => {
                      const normalizedRight = startOfMonth(nextMonth)
                      setRightMonth(normalizedRight)
                      setLeftMonth(prevLeft =>
                        isBefore(prevLeft, normalizedRight) ? prevLeft : subMonths(normalizedRight, 1),
                      )
                    }}
                    minValue={minValue}
                    maxValue={maxValue}
                    disabledDates={disabledDates}
                    isDisabled={isDisabled}
                    size={size}
                    color={color}
                    radius={radius}
                    weekStartsOn={weekStartsOnProp}
                    renderDay={renderDay}
                  />
                </div>
              </>
            ) : (
              /* Single-month mode — panel handles header, nav, MonthYearPicker */
              <DateNextCalendarPanel
                displayMonth={leftMonth}
                onDisplayMonthChange={setLeftMonth}
                minValue={minValue}
                maxValue={maxValue}
                disabledDates={disabledDates}
                isDisabled={isDisabled}
                size={size}
                color={color}
                radius={radius}
                weekStartsOn={weekStartsOnProp}
                renderDay={renderDay}
              />
            )}
          </div>
        )}

        {/* Preset buttons */}
        <div
          className={cn(isHorizontal && showCalendar && 'border-t-0', !isHorizontal && showCalendar && 'border-t pt-4')}
        >
          <div className="flex flex-wrap gap-2">
            {presets.map((preset, index) => (
              <Button
                key={`${preset.label}-${index}`}
                variant="outline"
                size="sm"
                onClick={() => handlePresetClick(preset)}
                disabled={isDisabled}
                className="text-xs"
              >
                {preset.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    )
  },
)

CalendarWithPresetsNext.displayName = 'CalendarWithPresetsNext'
