'use client'

import {
  addDays,
  addMonths,
  isAfter,
  isBefore,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  subMonths,
} from 'date-fns'
import { useEffect, useMemo, useState } from 'react'
import type { WeekStartsOn } from './date-next.props'
import { getDaysForMonth, normalizeDay, toDayKey } from './date-next-calendar-core'
import { useDateNextFormatters } from './useDateNextFormatters'

export interface UseDateNextCalendarOptions {
  /** Selected date value (for isDaySelected computation). */
  value?: Date
  /** Minimum selectable date. */
  minValue?: Date
  /** Maximum selectable date. */
  maxValue?: Date
  /** Specific dates to disable. */
  disabledDates?: Date[]
  /** When true, navigation handlers become no-ops. */
  isDisabled?: boolean
  /** Controlled display month. When provided, the hook does not own displayMonth state. */
  displayMonth?: Date
  /** Callback when display month changes (for controlled mode). */
  onDisplayMonthChange?: (month: Date) => void
  /** Override computed day grid (e.g., 7 days for MiniCalendarNext week view). */
  days?: Date[]
  /** Whether isDayToday returns true for today's date. Default true. */
  highlightToday?: boolean
  /** Override locale-derived week start day. */
  weekStartsOn?: WeekStartsOn
}

export interface UseDateNextCalendarReturn {
  /** Current display month (start-of-month normalized). */
  displayMonth: Date
  /** Flat array of day dates for the grid (35–42 for full month, or custom). */
  days: Date[]
  /** Weekday labels derived from the grid. 7 labels for standard grids; fewer when custom `days` has < 7 entries. */
  weekDayLabels: string[]
  /** Navigate to previous month. No-op when isDisabled. */
  handlePrevMonth: () => void
  /** Navigate to next month. No-op when isDisabled. */
  handleNextMonth: () => void
  /** Programmatically set display month. */
  setDisplayMonth: (month: Date | ((prev: Date) => Date)) => void
  /** Check if a day is unavailable (outside min/max or in disabledDates). */
  isDayUnavailable: (day: Date) => boolean
  /** Check if a day matches the current value. */
  isDaySelected: (day: Date) => boolean
  /** Check if a day is today (respects highlightToday option). */
  isDayToday: (day: Date) => boolean
  /** Check if a day falls outside the current display month. */
  isDayOutsideMonth: (day: Date) => boolean
  /** Resolved locale string. */
  locale: string
  /** Resolved weekStartsOn value. */
  weekStartsOn: WeekStartsOn
  /** Locale-aware formatters. */
  monthHeadingFormatter: Intl.DateTimeFormat
  weekDayFormatter: Intl.DateTimeFormat
  dayNumberFormatter: Intl.NumberFormat
  dayLabelFormatter: Intl.DateTimeFormat
}

/** Headless calendar hook — provides calendar state, navigation, and day predicates without any UI. */
export function useDateNextCalendar({
  value,
  minValue,
  maxValue,
  disabledDates,
  isDisabled = false,
  displayMonth: displayMonthProp,
  onDisplayMonthChange,
  days: daysProp,
  highlightToday = true,
  weekStartsOn: weekStartsOnProp,
}: UseDateNextCalendarOptions = {}): UseDateNextCalendarReturn {
  /* ── Display month: controlled or internal (always start-of-month) ── */
  const [internalDisplayMonth, setInternalDisplayMonth] = useState<Date>(() => startOfMonth(value ?? new Date()))
  const isDisplayMonthControlled = displayMonthProp !== undefined
  const displayMonth = startOfMonth(displayMonthProp ?? internalDisplayMonth)

  /* Sync internal month when value changes externally and displayMonth is uncontrolled */
  useEffect(() => {
    if (isDisplayMonthControlled) return
    if (value) setInternalDisplayMonth(startOfMonth(value))
  }, [isDisplayMonthControlled, value])

  const setDisplayMonth = (next: Date | ((prev: Date) => Date)) => {
    if (isDisplayMonthControlled) {
      const resolved = startOfMonth(typeof next === 'function' ? next(displayMonth) : next)
      onDisplayMonthChange?.(resolved)
      return
    }

    setInternalDisplayMonth(prev => {
      const resolved = startOfMonth(typeof next === 'function' ? next(prev) : next)
      onDisplayMonthChange?.(resolved)
      return resolved
    })
  }

  /* ── Formatters ── */
  const {
    locale,
    weekStartsOn: localeWeekStartsOn,
    weekDayFormatter,
    dayNumberFormatter,
    dayLabelFormatter,
    monthHeadingFormatter,
  } = useDateNextFormatters()
  const weekStartsOn = weekStartsOnProp ?? localeWeekStartsOn

  /* ── Day computation ── */
  const calendarDays = useMemo(
    () => daysProp ?? getDaysForMonth(displayMonth, weekStartsOn),
    [daysProp, displayMonth, weekStartsOn],
  )
  const weekDayLabels = useMemo(() => {
    if (calendarDays.length < 7) {
      return calendarDays.map(day => weekDayFormatter.format(day))
    }
    const baseStart = calendarDays[0] ?? new Date()
    return Array.from({ length: 7 }, (_, index) => weekDayFormatter.format(addDays(baseStart, index)))
  }, [calendarDays, weekDayFormatter])

  /* ── Availability ── */
  const normalizedSelectedDay = value ? normalizeDay(value) : undefined

  const unavailableDateKeys = useMemo(
    () => new Set((disabledDates ?? []).map(date => toDayKey(normalizeDay(date)))),
    [disabledDates],
  )
  const minDay = minValue ? normalizeDay(minValue) : undefined
  const maxDay = maxValue ? normalizeDay(maxValue) : undefined

  const isDayUnavailable = (day: Date) => {
    const normalizedDay = normalizeDay(day)
    if (minDay && isBefore(normalizedDay, minDay)) return true
    if (maxDay && isAfter(normalizedDay, maxDay)) return true
    return unavailableDateKeys.has(toDayKey(normalizedDay))
  }

  /* ── Predicates ── */
  const isDaySelected = (day: Date) => (normalizedSelectedDay ? isSameDay(day, normalizedSelectedDay) : false)
  const isDayToday = (day: Date) => (highlightToday ? isToday(day) : false)
  const isDayOutsideMonth = (day: Date) => !isSameMonth(day, displayMonth)

  /* ── Navigation ── */
  const handlePrevMonth = () => {
    if (isDisabled) return
    setDisplayMonth(prev => subMonths(prev, 1))
  }
  const handleNextMonth = () => {
    if (isDisabled) return
    setDisplayMonth(prev => addMonths(prev, 1))
  }

  return {
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
    weekStartsOn,
    monthHeadingFormatter,
    weekDayFormatter,
    dayNumberFormatter,
    dayLabelFormatter,
  }
}
