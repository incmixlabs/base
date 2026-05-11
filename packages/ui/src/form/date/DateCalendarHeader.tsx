'use client'

import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import * as React from 'react'
import { createPortal } from 'react-dom'
import type { WheelPickerOption } from '@/elements/wheel-picker/wheel-picker'
import { WheelPicker, WheelPickerWrapper } from '@/elements/wheel-picker/wheel-picker'
import { cn } from '@/lib/utils'
import type { Color, Radius } from '@/theme/tokens'
import { DateCalendarNavButton } from './DateCalendarNavButton'

export interface DateCalendarHeaderProps {
  title: React.ReactNode
  color: Color
  radius: Radius
  navButtonVariant: 'soft' | 'outline' | 'ghost'
  navButtonBordered: boolean
  accentColor: string
  softColor: string
  foregroundColor: string
  onPrevious: () => void
  onNext: () => void
  previousDisabled?: boolean
  nextDisabled?: boolean
  previousAriaLabel?: string
  nextAriaLabel?: string
  previousIcon?: React.ReactNode
  nextIcon?: React.ReactNode
  className?: string
  titleClassName?: string
  navClassName?: string
  navButtonClassName?: string
  displayedMonth?: Date
  onMonthYearChange?: (date: Date) => void
  localeCode?: string
  startMonth?: Date
  endMonth?: Date
  arrowPosition?: 'left' | 'right' | 'both' | 'none'
}

function buildMonthOptions(
  localeCode: string,
  year: number,
  startMonth?: Date,
  endMonth?: Date,
): WheelPickerOption<number>[] {
  const formatter = new Intl.DateTimeFormat(localeCode, { month: 'long' })
  const minMonth = startMonth && year === startMonth.getFullYear() ? startMonth.getMonth() : 0
  const maxMonth = endMonth && year === endMonth.getFullYear() ? endMonth.getMonth() : 11

  return Array.from({ length: 12 }, (_, i) => ({
    value: i,
    label: formatter.format(new Date(2000, i, 1)),
    disabled: i < minMonth || i > maxMonth,
  }))
}

function buildYearOptions(startYear: number, endYear: number): WheelPickerOption<number>[] {
  const options: WheelPickerOption<number>[] = []
  for (let y = startYear; y <= endYear; y++) {
    options.push({ value: y, label: String(y) })
  }
  return options
}

function clampMonth(month: number, year: number, startMonth?: Date, endMonth?: Date): number {
  if (startMonth && year === startMonth.getFullYear() && month < startMonth.getMonth()) {
    return startMonth.getMonth()
  }
  if (endMonth && year === endMonth.getFullYear() && month > endMonth.getMonth()) {
    return endMonth.getMonth()
  }
  return month
}

export function DateCalendarHeader({
  title,
  color,
  radius,
  navButtonVariant,
  navButtonBordered,
  accentColor,
  softColor,
  foregroundColor,
  onPrevious,
  onNext,
  previousDisabled = false,
  nextDisabled = false,
  previousAriaLabel = 'Previous',
  nextAriaLabel = 'Next',
  previousIcon,
  nextIcon,
  className,
  titleClassName,
  navClassName,
  navButtonClassName,
  displayedMonth,
  onMonthYearChange,
  localeCode = 'en-US',
  startMonth,
  endMonth,
  arrowPosition = 'both',
}: DateCalendarHeaderProps) {
  const fallbackPrevIcon = <ChevronLeftIcon className="!text-current !opacity-100" width={14} height={14} />
  const fallbackNextIcon = <ChevronRightIcon className="!text-current !opacity-100" width={14} height={14} />

  const [pickerOpen, setPickerOpen] = React.useState(false)
  const [portalPos, setPortalPos] = React.useState({ top: 0, left: 0 })
  const titleRef = React.useRef<HTMLElement>(null)
  const overlayRef = React.useRef<HTMLDivElement>(null)
  const pickerDialogId = React.useId()
  const hasMonthYearPicker = Boolean(onMonthYearChange)

  const currentMonth = displayedMonth?.getMonth() ?? new Date().getMonth()
  const currentYear = displayedMonth?.getFullYear() ?? new Date().getFullYear()

  const [selectedMonth, setSelectedMonth] = React.useState(currentMonth)
  const [selectedYear, setSelectedYear] = React.useState(currentYear)

  React.useEffect(() => {
    setSelectedMonth(currentMonth)
    setSelectedYear(currentYear)
  }, [currentMonth, currentYear])

  const startYear = startMonth?.getFullYear() ?? currentYear - 100
  const endYear = endMonth?.getFullYear() ?? currentYear + 100

  const monthOptions = React.useMemo(
    () => buildMonthOptions(localeCode, selectedYear, startMonth, endMonth),
    [localeCode, selectedYear, startMonth, endMonth],
  )
  const yearOptions = React.useMemo(() => buildYearOptions(startYear, endYear), [startYear, endYear])

  React.useEffect(() => {
    if (!pickerOpen) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setPickerOpen(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [pickerOpen])

  React.useEffect(() => {
    if (pickerOpen) {
      overlayRef.current?.focus()
    }
  }, [pickerOpen])

  const handleTitleClick = () => {
    if (!hasMonthYearPicker) return
    if (pickerOpen) {
      setPickerOpen(false)
      return
    }
    if (titleRef.current) {
      const rect = titleRef.current.getBoundingClientRect()
      setPortalPos({ top: rect.bottom + 4, left: rect.left })
    }
    setPickerOpen(true)
  }

  const handleMonthChange = React.useCallback(
    (value: number) => {
      const clampedMonth = clampMonth(value, selectedYear, startMonth, endMonth)
      setSelectedMonth(clampedMonth)
      onMonthYearChange?.(new Date(selectedYear, clampedMonth, 1))
    },
    [selectedYear, onMonthYearChange, startMonth, endMonth],
  )

  const handleYearChange = React.useCallback(
    (value: number) => {
      setSelectedYear(value)
      const clampedMonth = clampMonth(selectedMonth, value, startMonth, endMonth)
      setSelectedMonth(clampedMonth)
      onMonthYearChange?.(new Date(value, clampedMonth, 1))
    },
    [selectedMonth, onMonthYearChange, startMonth, endMonth],
  )

  const showPreviousArrow = arrowPosition === 'both' || arrowPosition === 'left'
  const showNextArrow = arrowPosition === 'both' || arrowPosition === 'right'

  return (
    <div className={cn('flex h-(--cell-size) items-center gap-2', className)}>
      <div className={cn('flex h-(--cell-size) w-(--cell-size) items-center justify-start', navClassName)}>
        {showPreviousArrow ? (
          <DateCalendarNavButton
            color={color}
            radius={radius}
            variant={navButtonVariant}
            bordered={navButtonBordered}
            accentColor={accentColor}
            softColor={softColor}
            foregroundColor={foregroundColor}
            className={navButtonClassName}
            aria-label={previousAriaLabel}
            onClick={onPrevious}
            disabled={previousDisabled}
          >
            {previousIcon ?? fallbackPrevIcon}
          </DateCalendarNavButton>
        ) : null}
      </div>
      <div className="min-w-0 flex-1 text-center">
        {hasMonthYearPicker ? (
          <button
            ref={node => {
              titleRef.current = node
            }}
            type="button"
            aria-haspopup="dialog"
            aria-expanded={pickerOpen}
            aria-controls={pickerOpen ? pickerDialogId : undefined}
            onClick={handleTitleClick}
            className={cn(
              'inline-flex max-w-full items-center justify-center gap-1 truncate text-sm font-medium select-none',
              'cursor-pointer transition-colors hover:text-foreground/60',
              'appearance-none border-0 bg-transparent p-0 m-0 text-inherit font-inherit',
              titleClassName,
            )}
          >
            {title}
            <ChevronDownIcon
              className={cn('shrink-0 transition-transform', pickerOpen && 'rotate-180')}
              width={14}
              height={14}
            />
          </button>
        ) : (
          <span
            ref={node => {
              titleRef.current = node
            }}
            className={cn('inline-block max-w-full truncate text-center text-sm font-medium', titleClassName)}
          >
            {title}
          </span>
        )}
      </div>
      <div className={cn('flex h-(--cell-size) w-(--cell-size) items-center justify-end', navClassName)}>
        {showNextArrow ? (
          <DateCalendarNavButton
            color={color}
            radius={radius}
            variant={navButtonVariant}
            bordered={navButtonBordered}
            accentColor={accentColor}
            softColor={softColor}
            foregroundColor={foregroundColor}
            className={navButtonClassName}
            aria-label={nextAriaLabel}
            onClick={onNext}
            disabled={nextDisabled}
          >
            {nextIcon ?? fallbackNextIcon}
          </DateCalendarNavButton>
        ) : null}
      </div>

      {pickerOpen && hasMonthYearPicker && typeof document !== 'undefined'
        ? createPortal(
            <div
              ref={overlayRef}
              id={pickerDialogId}
              role="dialog"
              aria-modal="true"
              tabIndex={-1}
              className="fixed inset-0 z-50"
              onMouseDown={event => {
                if (event.target === event.currentTarget) {
                  setPickerOpen(false)
                }
              }}
            >
              <div className="absolute" style={{ top: portalPos.top, left: portalPos.left }}>
                <WheelPickerWrapper>
                  <div className="flex gap-2 rounded-md border bg-background p-2 shadow-lg">
                    <WheelPicker
                      options={monthOptions}
                      value={selectedMonth}
                      onValueChange={handleMonthChange}
                      aria-label="Select month"
                    />
                    <WheelPicker
                      options={yearOptions}
                      value={selectedYear}
                      onValueChange={handleYearChange}
                      aria-label="Select year"
                    />
                  </div>
                </WheelPickerWrapper>
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  )
}
