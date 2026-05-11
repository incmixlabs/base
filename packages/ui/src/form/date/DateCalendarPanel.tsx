'use client'

import { isSameMonth, startOfMonth } from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { type KeyboardEvent, type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  iconButtonBase,
  iconButtonColorVariants,
  iconButtonSizeIconScope,
  iconButtonSizeVariants,
} from '@/elements/button/IconButton.css'
import { UpDownCaret } from '@/elements/menu/UpDownCaret'
import { cn } from '@/lib/utils'
import type { Color, Radius } from '@/theme/tokens'
import {
  datePickerCalendarCell,
  datePickerCalendarCellRadiusStyles,
  datePickerCalendarCellSizeStyles,
  datePickerCalendarDayGrid,
  datePickerCalendarDayInteractive,
  datePickerCalendarGridSizeStyles,
  datePickerCalendarHeadingButton,
  datePickerCalendarHeadingSizeStyles,
  datePickerCalendarIconSizeStyles,
  datePickerCalendarSelectedColorStyles,
  datePickerCalendarWeekdayGrid,
  datePickerNavButton,
  datePickerNavButtonSizeStyles,
} from './DatePicker.css'
import type { WeekStartsOn } from './date.props'
import { type DateSize, isDateSize } from './date.props'
import { normalizeDay, toDayKey } from './date-calendar-core'
import { calendarArrowKeyMoves, isCalendarArrowKey } from './date-keyboard'
import { mapDateSizeToButtonSize } from './date-size-maps'
import { dateElementRadiusStyles } from './date-surface.shared.css'
import { MonthYearPicker } from './MonthYearPicker'
import { useDateCalendar } from './useDateCalendar'

/** Day state passed to the `renderDay` render prop. */
export interface DayRenderState {
  /** Midnight-normalized date. */
  normalized: Date
  /** Stable key string (YYYY-MM-DD) — use as React key and `data-day-key` attribute. */
  dayKey: string
  unavailable: boolean
  outsideMonth: boolean
  selected: boolean
  today: boolean
  /** Whether this day should be the tab entry point (tabIndex=0) in the roving tabIndex pattern. */
  isFocusTarget: boolean
  dayNumberFormatter: Intl.NumberFormat
  dayLabelFormatter: Intl.DateTimeFormat
}

export interface DateCalendarPanelProps {
  value?: Date
  onChange?: (date: Date) => void
  minValue?: Date
  maxValue?: Date
  disabledDates?: Date[]
  isDisabled?: boolean
  size?: DateSize
  color?: Color
  radius?: Radius
  className?: string

  /** External control of the displayed month. When provided, panel does not own displayMonth state. */
  displayMonth?: Date
  onDisplayMonthChange?: (month: Date) => void

  /** Override computed days (e.g., pass 7 days for a single-week view). */
  days?: Date[]

  /** Whether to show the default month navigation header. Default true. */
  showHeader?: boolean

  /** Custom header render prop. When provided, replaces the default nav header. */
  renderHeader?: (props: {
    displayMonth: Date
    onPrevMonth: () => void
    onNextMonth: () => void
    setDisplayMonth: (month: Date) => void
    locale: string
    isDisabled: boolean
    monthHeadingFormatter: Intl.DateTimeFormat
  }) => ReactNode

  /** Custom day cell render prop. Element must include `data-day-key={state.dayKey}` and be focusable for keyboard nav. */
  renderDay?: (state: DayRenderState) => ReactNode

  /** Whether to highlight today's date with data-today attribute. Default true. */
  highlightToday?: boolean

  /** Whether to show the month/year wheel picker in the default header. Default true. */
  enableMonthYearPicker?: boolean

  /** Override the locale-derived week start day. */
  weekStartsOn?: WeekStartsOn
}

/**
 * Shared calendar panel for date components.
 * Renders month navigation + weekday labels + day grid.
 * Used by DatePicker, AppointmentPicker, MiniCalendar,
 * CalendarWithPricing, and CalendarWithPresets.
 */
export function DateCalendarPanel({
  value,
  onChange,
  minValue,
  maxValue,
  disabledDates,
  isDisabled = false,
  size: sizeProp = 'md',
  color = 'slate',
  radius = 'full',
  className,
  displayMonth: displayMonthProp,
  onDisplayMonthChange,
  days: daysProp,
  showHeader = true,
  renderHeader,
  renderDay,
  highlightToday = true,
  enableMonthYearPicker = true,
  weekStartsOn: weekStartsOnProp,
}: DateCalendarPanelProps) {
  const size: DateSize = isDateSize(sizeProp) ? sizeProp : 'md'

  const {
    displayMonth,
    days: calendarDays,
    weekDayLabels,
    handlePrevMonth,
    handleNextMonth,
    setDisplayMonth,
    isDayUnavailable,
    isDaySelected,
    isDayToday,
    isDayOutsideMonth,
    locale,
    monthHeadingFormatter,
    dayNumberFormatter,
    dayLabelFormatter,
  } = useDateCalendar({
    value,
    minValue,
    maxValue,
    disabledDates,
    isDisabled,
    displayMonth: displayMonthProp,
    onDisplayMonthChange,
    days: daysProp,
    highlightToday,
    weekStartsOn: weekStartsOnProp,
  })

  /* ── Month/year picker state ── */
  const [showMonthYearPicker, setShowMonthYearPicker] = useState(false)
  const headingTriggerRef = useRef<HTMLButtonElement | null>(null)

  const handleMonthYearApply = useCallback(
    (month: Date) => {
      setDisplayMonth(month)
      setShowMonthYearPicker(false)
    },
    [setDisplayMonth],
  )

  /* ── Keyboard nav: roving tabIndex ── */
  const [focusedDayKey, setFocusedDayKey] = useState<string | null>(null)
  const focusedDayKeyRef = useRef(focusedDayKey)
  useEffect(() => {
    focusedDayKeyRef.current = focusedDayKey
  }, [focusedDayKey])
  const gridRef = useRef<HTMLDivElement | null>(null)

  const handleDayGridKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (!isCalendarArrowKey(event.key)) return

      const activeCell = (event.target as HTMLElement).closest<HTMLElement>('[data-day-key]')
      const currentDayKey = activeCell?.getAttribute('data-day-key')
      if (!currentDayKey) return

      // Parse current date from key (YYYY-MM-DD)
      const parts = currentDayKey.split('-').map(Number)
      const currentDate = new Date(parts[0] ?? 0, (parts[1] ?? 1) - 1, parts[2] ?? 1)
      const nextDate = calendarArrowKeyMoves[event.key](currentDate)
      const nextKey = toDayKey(normalizeDay(nextDate))

      // If the target day is in a different month, navigate there
      if (!isSameMonth(nextDate, displayMonth)) {
        setDisplayMonth(startOfMonth(nextDate))
        setFocusedDayKey(nextKey)
        event.preventDefault()
        return
      }

      const grid = gridRef.current
      if (!grid) return
      const target = grid.querySelector<HTMLElement>(`[data-day-key="${nextKey}"]`)
      const isTargetDisabled =
        target?.getAttribute('aria-disabled') === 'true' || (target instanceof HTMLButtonElement && target.disabled)
      if (target && !isTargetDisabled) {
        setFocusedDayKey(nextKey)
        target.focus()
        event.preventDefault()
      }
    },
    [displayMonth, setDisplayMonth],
  )

  /* Focus the remembered day after month navigation (value-based comparison to avoid reference churn). */
  const displayMonthKey = `${displayMonth.getFullYear()}-${displayMonth.getMonth()}`
  // biome-ignore lint/correctness/useExhaustiveDependencies: displayMonthKey is the intentional trigger for re-focusing after month navigation
  useEffect(() => {
    const key = focusedDayKeyRef.current
    if (!key) return
    const grid = gridRef.current
    if (!grid) return
    const target = grid.querySelector<HTMLElement>(`[data-day-key="${key}"]`)
    const isTargetDisabled =
      target?.getAttribute('aria-disabled') === 'true' || (target instanceof HTMLButtonElement && target.disabled)
    if (target && !isTargetDisabled) {
      target.focus()
    } else {
      const firstAvailable = grid.querySelector<HTMLElement>(
        '[data-day-key]:not([aria-disabled="true"]):not(:disabled):not([data-outside-month])',
      )
      if (firstAvailable) {
        setFocusedDayKey(firstAvailable.getAttribute('data-day-key'))
        firstAvailable.focus()
      }
    }
  }, [displayMonthKey])

  /* ── Nav button class ── */
  const calendarNavButtonClass = cn(
    'inline-flex items-center justify-center shrink-0 select-none appearance-none cursor-pointer',
    'p-0 m-0 leading-none rounded-sm transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
    iconButtonBase,
    iconButtonSizeVariants[mapDateSizeToButtonSize(size)],
    iconButtonSizeIconScope,
    iconButtonColorVariants.slate.outline,
  )

  /* ── Header ── */
  const headerContent = (() => {
    if (!showHeader && !renderHeader) return null
    if (renderHeader)
      return renderHeader({
        displayMonth,
        onPrevMonth: handlePrevMonth,
        onNextMonth: handleNextMonth,
        setDisplayMonth: (month: Date) => setDisplayMonth(month),
        locale,
        isDisabled,
        monthHeadingFormatter,
      })
    return (
      <header className="relative flex items-center justify-between">
        <button
          type="button"
          aria-label="Previous month"
          className={cn(calendarNavButtonClass, datePickerNavButton, datePickerNavButtonSizeStyles[size])}
          onClick={handlePrevMonth}
          disabled={isDisabled}
        >
          <ChevronLeft className={cn(datePickerCalendarIconSizeStyles[size])} aria-hidden="true" />
        </button>
        {enableMonthYearPicker ? (
          <button
            ref={headingTriggerRef}
            type="button"
            aria-label={`Select month and year: ${monthHeadingFormatter.format(displayMonth)}`}
            aria-haspopup="dialog"
            aria-expanded={showMonthYearPicker}
            disabled={isDisabled}
            className={cn(
              datePickerCalendarHeadingSizeStyles[size],
              datePickerCalendarHeadingButton,
              'inline-flex items-center justify-center font-medium text-foreground select-none',
              'cursor-pointer transition-colors hover:text-foreground/60',
              'appearance-none border-0 bg-transparent p-0 m-0 text-inherit font-inherit',
              'disabled:pointer-events-none disabled:opacity-50',
            )}
            onClick={() => setShowMonthYearPicker(true)}
          >
            <span>{monthHeadingFormatter.format(displayMonth)}</span>
            <UpDownCaret />
          </button>
        ) : (
          <span
            className={cn(datePickerCalendarHeadingSizeStyles[size], 'font-medium text-foreground select-none')}
            role="heading"
            aria-level={2}
          >
            {monthHeadingFormatter.format(displayMonth)}
          </span>
        )}
        <button
          type="button"
          aria-label="Next month"
          className={cn(calendarNavButtonClass, datePickerNavButton, datePickerNavButtonSizeStyles[size])}
          onClick={handleNextMonth}
          disabled={isDisabled}
        >
          <ChevronRight className={cn(datePickerCalendarIconSizeStyles[size])} aria-hidden="true" />
        </button>

        {/* Month/year wheel picker */}
        {enableMonthYearPicker && showMonthYearPicker && !isDisabled && (
          <MonthYearPicker
            displayMonth={displayMonth}
            onApply={handleMonthYearApply}
            onClose={() => setShowMonthYearPicker(false)}
            triggerRef={headingTriggerRef}
            locale={monthHeadingFormatter.resolvedOptions().locale}
            minValue={minValue}
            maxValue={maxValue}
            size={size}
            color={color}
          />
        )}
      </header>
    )
  })()

  /* ── Compute the single day that should be tabbable (roving tabIndex) ── */
  const defaultFocusableDayKey = useMemo(() => {
    if (focusedDayKey) return focusedDayKey
    const selectedDay = calendarDays.find(d => isDaySelected(normalizeDay(d)) && !isDayUnavailable(normalizeDay(d)))
    if (selectedDay) return toDayKey(normalizeDay(selectedDay))
    const todayDay = calendarDays.find(d => isDayToday(normalizeDay(d)) && !isDayUnavailable(normalizeDay(d)))
    if (todayDay) return toDayKey(normalizeDay(todayDay))
    const firstInMonth = calendarDays.find(d => {
      const n = normalizeDay(d)
      return !isDayOutsideMonth(n) && !isDayUnavailable(n)
    })
    return firstInMonth ? toDayKey(normalizeDay(firstInMonth)) : null
  }, [focusedDayKey, calendarDays, isDaySelected, isDayUnavailable, isDayToday, isDayOutsideMonth])

  return (
    <div className={cn('space-y-2', dateElementRadiusStyles[radius], className)}>
      {headerContent}
      <div
        className={cn(
          datePickerCalendarWeekdayGrid,
          datePickerCalendarGridSizeStyles[size],
          'text-center text-muted-foreground',
        )}
      >
        {weekDayLabels.map((label, index) => (
          <div key={`${label}-${index}`} className={cn(datePickerCalendarHeadingSizeStyles[size], 'font-medium')}>
            {label}
          </div>
        ))}
      </div>
      <div
        ref={gridRef}
        role="grid"
        className={cn(datePickerCalendarDayGrid, datePickerCalendarGridSizeStyles[size])}
        onKeyDown={handleDayGridKeyDown}
      >
        {calendarDays.map(day => {
          const normalized = normalizeDay(day)
          const dayKey = toDayKey(normalized)
          const unavailable = isDayUnavailable(normalized)
          const outsideMonth = isDayOutsideMonth(normalized)
          const selected = isDaySelected(normalized)
          const today = isDayToday(normalized)

          const isFocusTarget = dayKey === defaultFocusableDayKey

          if (renderDay) {
            return renderDay({
              normalized,
              dayKey,
              unavailable,
              outsideMonth,
              selected,
              today,
              isFocusTarget,
              dayNumberFormatter,
              dayLabelFormatter,
            })
          }

          return (
            <button
              key={dayKey}
              type="button"
              aria-label={`${dayLabelFormatter.format(normalized)}${selected ? ', selected' : ''}`}
              aria-disabled={unavailable}
              aria-current={today ? 'date' : undefined}
              disabled={isDisabled || unavailable}
              data-unavailable={unavailable ? '' : undefined}
              data-outside-month={outsideMonth ? '' : undefined}
              data-selected={selected ? '' : undefined}
              data-today={today ? '' : undefined}
              data-day-key={dayKey}
              tabIndex={isFocusTarget ? 0 : -1}
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
                if (unavailable || isDisabled) return
                onChange?.(normalized)
              }}
              onFocus={() => setFocusedDayKey(dayKey)}
            >
              {dayNumberFormatter.format(normalized.getDate())}
            </button>
          )
        })}
      </div>
    </div>
  )
}
