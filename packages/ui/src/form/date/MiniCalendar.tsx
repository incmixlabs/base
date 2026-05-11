'use client'

import { addDays, addWeeks, startOfDay, startOfWeek, subWeeks } from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { cn } from '@/lib/utils'
import type { Color, Radius } from '@/theme/tokens'
import { DateCalendarHeader } from './DateCalendarHeader'
import { DateCalendarPanel } from './DateCalendarPanel'
import { type DateNavButtonVariant, type DateSize, isDateSize } from './date.props'
import {
  miniCalendarBody,
  miniCalendarDayColorStyles,
  miniCalendarHeader,
  miniCalendarHeaderTitle,
  miniCalendarNavButton,
  miniCalendarNavIcon,
  miniCalendarRadiusStyles,
  miniCalendarRoot,
  miniCalendarRootDisabled,
  miniCalendarSizeStyles,
} from './MiniCalendar.css'
import { useDateFormatters } from './useDateFormatters'

export interface MiniCalendarProps {
  value?: Date
  onChange?: (date: Date) => void
  minDate?: Date
  maxDate?: Date
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6
  disabled?: boolean
  className?: string
  showHeader?: boolean
  size?: DateSize
  color?: Color
  radius?: Radius
  navButtonBordered?: boolean
  navButtonVariant?: DateNavButtonVariant
}

/** Date-next mini calendar (single-week) component. */
export function MiniCalendar({
  value,
  onChange,
  minDate,
  maxDate,
  weekStartsOn: weekStartsOnProp,
  disabled = false,
  className,
  showHeader = true,
  size = 'md',
  color = 'slate',
  radius = 'md',
  navButtonBordered = false,
  navButtonVariant = navButtonBordered ? 'outline' : 'soft',
}: MiniCalendarProps) {
  const resolvedSize: DateSize = isDateSize(size) ? size : 'md'
  const isControlled = value !== undefined
  const [selectedDateState, setSelectedDateState] = useState<Date>(value ?? new Date())
  const selectedDate = isControlled ? value : selectedDateState
  const [currentDate, setCurrentDate] = useState<Date>(selectedDate ?? new Date())
  const { locale, weekStartsOn: localeWeekStartsOn, monthHeadingFormatter } = useDateFormatters()
  const weekStartsOn = weekStartsOnProp ?? localeWeekStartsOn

  const weekDays = useMemo(() => {
    const start = startOfWeek(currentDate, { weekStartsOn })
    return Array.from({ length: 7 }, (_, index) => addDays(start, index))
  }, [currentDate, weekStartsOn])
  const title = monthHeadingFormatter.format(currentDate)

  useEffect(() => {
    if (value === undefined) return
    setSelectedDateState(value)
    setCurrentDate(value)
  }, [value])

  const isDateDisabled = (date: Date) => {
    const normalized = startOfDay(date)
    if (minDate && normalized < startOfDay(minDate)) return true
    if (maxDate && normalized > startOfDay(maxDate)) return true
    return false
  }

  const handleDateSelect = (date: Date) => {
    if (!isControlled) {
      setSelectedDateState(date)
    }
    setCurrentDate(date)
    onChange?.(date)
  }

  const hasSelectableDayInWeek = (anchor: Date) => {
    const start = startOfWeek(anchor, { weekStartsOn })
    return Array.from({ length: 7 }, (_, index) => addDays(start, index)).some(day => !isDateDisabled(day))
  }
  const canGoPrevious = hasSelectableDayInWeek(subWeeks(currentDate, 1))
  const canGoNext = hasSelectableDayInWeek(addWeeks(currentDate, 1))

  return (
    <div
      className={cn(
        miniCalendarRoot,
        miniCalendarSizeStyles[resolvedSize],
        miniCalendarRadiusStyles[radius],
        miniCalendarDayColorStyles[color],
        disabled && miniCalendarRootDisabled,
        className,
      )}
    >
      <div className={miniCalendarBody}>
        {showHeader ? (
          <DateCalendarHeader
            title={title}
            titleClassName={miniCalendarHeaderTitle}
            className={miniCalendarHeader}
            navButtonClassName={miniCalendarNavButton}
            color={color}
            radius={radius}
            navButtonVariant={navButtonVariant}
            navButtonBordered={navButtonBordered}
            accentColor="var(--mini-cal-accent)"
            softColor="var(--mini-cal-soft)"
            foregroundColor="var(--mini-cal-fg)"
            previousAriaLabel="Previous week"
            nextAriaLabel="Next week"
            previousIcon={<ChevronLeft className={miniCalendarNavIcon} />}
            nextIcon={<ChevronRight className={miniCalendarNavIcon} />}
            onPrevious={() => {
              if (canGoPrevious) setCurrentDate(prev => subWeeks(prev, 1))
            }}
            onNext={() => {
              if (canGoNext) setCurrentDate(prev => addWeeks(prev, 1))
            }}
            previousDisabled={disabled || !canGoPrevious}
            nextDisabled={disabled || !canGoNext}
            displayedMonth={currentDate}
            onMonthYearChange={date => setCurrentDate(date)}
            localeCode={locale}
          />
        ) : null}

        <DateCalendarPanel
          value={selectedDate}
          onChange={handleDateSelect}
          minValue={minDate}
          maxValue={maxDate}
          isDisabled={disabled}
          size={resolvedSize}
          color={color}
          radius={radius}
          days={weekDays}
          weekStartsOn={weekStartsOn}
          showHeader={false}
          highlightToday
        />
      </div>
    </div>
  )
}
