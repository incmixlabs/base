'use client'

import { addDays, addWeeks, startOfDay, startOfWeek, subWeeks } from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { cn } from '@/lib/utils'
import type { Color, Radius } from '@/theme/tokens'
import { DateNextCalendarHeader } from './DateNextCalendarHeader'
import { DateNextCalendarPanel } from './DateNextCalendarPanel'
import { type DateNextNavButtonVariant, type DateNextSize, isDateNextSize } from './date-next.props'
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
} from './MiniCalendarNext.css'
import { useDateNextFormatters } from './useDateNextFormatters'

export interface MiniCalendarNextProps {
  value?: Date
  onChange?: (date: Date) => void
  minDate?: Date
  maxDate?: Date
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6
  disabled?: boolean
  className?: string
  showHeader?: boolean
  size?: DateNextSize
  color?: Color
  radius?: Radius
  navButtonBordered?: boolean
  navButtonVariant?: DateNextNavButtonVariant
}

/** Date-next mini calendar (single-week) component. */
export function MiniCalendarNext({
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
}: MiniCalendarNextProps) {
  const resolvedSize: DateNextSize = isDateNextSize(size) ? size : 'md'
  const isControlled = value !== undefined
  const [selectedDateState, setSelectedDateState] = useState<Date>(value ?? new Date())
  const selectedDate = isControlled ? value : selectedDateState
  const [currentDate, setCurrentDate] = useState<Date>(selectedDate ?? new Date())
  const { locale, weekStartsOn: localeWeekStartsOn, monthHeadingFormatter } = useDateNextFormatters()
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
          <DateNextCalendarHeader
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

        <DateNextCalendarPanel
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
