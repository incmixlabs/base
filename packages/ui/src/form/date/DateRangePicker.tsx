import {
  addMonths,
  format as formatDate,
  isAfter,
  isBefore,
  isSameDay,
  isSameMonth,
  startOfMonth,
  subMonths,
} from 'date-fns'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react'
import type * as React from 'react'
import { useEffect, useId, useRef, useState } from 'react'
import {
  Button as AriaButton,
  DateRangePicker as AriaDateRangePicker,
  DateInput,
  DateSegment,
  Dialog,
  Group,
  Popover,
} from 'react-aria-components'
import { iconButtonBase, iconButtonColorVariants } from '@/elements/button/IconButton.css'
import { UpDownCaret } from '@/elements/menu/UpDownCaret'
import { useThemeRadius } from '@/elements/utils'
import { useFieldGroup } from '@/form/FieldGroupContext'
import { cn } from '@/lib/utils'
import type { Color, Radius, TextFieldVariant } from '@/theme/tokens'
import { getFloatingStyle } from '../text-field-variant'
import { DateCalendarPanel, type DayRenderState } from './DateCalendarPanel'
import {
  rangeCalendarButton,
  rangeCalendarCell,
  rangeCalendarDayInteractive,
  rangeCalendarDualHeader,
  rangeCalendarIcon,
  rangeCalendarMonthColumns,
  rangeCalendarMonthHeadingButton,
  rangeCalendarPopover,
  rangeCalendarSelectedColorStyles,
  rangeCalendarTypography,
  rangeDateInput,
  rangeInputSurface,
  rangeTriggerGroupBase,
  rangeTriggerGroupRadiusStyles,
  rangeTriggerGroupSizeStyles,
} from './DateRangePicker.css'
import { type DateSize, isDateSize } from './date.props'
import { normalizeDay, toDayKey } from './date-calendar-core'
import {
  DateFieldWrapper,
  dateGhostIconButtonClassName,
  dateIconSlotClassName,
  dateRangeInputSurfaceClassName,
  getDateFieldSurfaceClassName,
  getDateSegmentClassName,
} from './date-field-shell'
import { type DateRangeValue, fromDateRangeValue, toDateRangeValue } from './date-range-value-boundary'
import { dateCalendarNavButton, dateCalendarNavIcon } from './date-surface.shared.css'
import { toDateValue } from './date-value-boundary'
import { MonthYearPicker } from './MonthYearPicker'
import { useDateFormatters } from './useDateFormatters'

const normalizeDualMonths = (left: Date, right: Date) => {
  const normalizedLeft = startOfMonth(left)
  const normalizedRight = startOfMonth(right)
  if (isSameMonth(normalizedLeft, normalizedRight) || isAfter(normalizedLeft, normalizedRight)) {
    return { left: normalizedLeft, right: addMonths(normalizedLeft, 1) }
  }
  return { left: normalizedLeft, right: normalizedRight }
}

export interface DateRangePickerProps {
  value?: DateRangeValue
  defaultValue?: DateRangeValue
  onChange?: (next: DateRangeValue | undefined) => void
  minValue?: Date
  maxValue?: Date
  disabledDates?: Date[]
  isDisabled?: boolean
  size?: DateSize
  /**
   * `@deprecated` Reserved for planned calendar-surface variant support.
   * Currently a no-op for trigger/input chrome (intentionally neutral).
   */
  variant?: TextFieldVariant
  label?: React.ReactNode
  /** Accent/selection color. */
  color?: Color
  navButtonVariant?: 'soft' | 'outline' | 'ghost'
  radius?: Radius
  name?: string
  ariaLabel?: string
  className?: string
  dateFormat?: string
  visibleMonths?: 1 | 2
}

export function DateRangePicker({
  value,
  defaultValue,
  onChange,
  minValue,
  maxValue,
  disabledDates,
  isDisabled,
  size: sizeProp,
  variant: variantProp,
  label,
  color = 'slate',
  navButtonVariant = 'soft',
  radius: radiusProp,
  name,
  ariaLabel = 'Date range',
  className,
  dateFormat = 'yyyy-MM-dd',
  visibleMonths = 1,
}: DateRangePickerProps) {
  const fieldGroup = useFieldGroup()
  const inheritedSize = sizeProp ?? fieldGroup.size
  // TODO(date): keep date size scope capped at 2x; only revisit 3x-5x if product usage appears.
  const size: DateSize = isDateSize(inheritedSize) ? inheritedSize : 'md'
  const textFieldSize = size === 'xl' ? 'lg' : size
  const variant = variantProp ?? fieldGroup.variant
  const effectiveIsDisabled = isDisabled || fieldGroup.disabled
  const floatingStyle = getFloatingStyle(variant)
  const radius = useThemeRadius(radiusProp ?? fieldGroup.radius)
  const generatedLabelId = useId()
  const labelId = label ? generatedLabelId : undefined
  const isDual = visibleMonths === 2
  const isControlled = value !== undefined
  const [uncontrolledValue, setUncontrolledValue] = useState<DateRangeValue | undefined>(defaultValue)
  const [isOpen, setIsOpen] = useState(false)
  const selectedRange = isControlled ? value : uncontrolledValue

  /* ── Always controlled for AriaDateRangePicker (both modes use custom calendar) ── */
  const pickerValueProps = { value: toDateRangeValue(selectedRange) ?? undefined }

  /* ── Unavailable dates ── */
  const unavailableDateKeys = new Set((disabledDates ?? []).map(d => toDayKey(normalizeDay(d))))
  const isDateUnavailable =
    unavailableDateKeys.size > 0
      ? (date: { toString(): string }) => unavailableDateKeys.has(date.toString())
      : undefined

  /* ── Month state ── */
  const [leftMonth, setLeftMonth] = useState<Date>(() => startOfMonth(selectedRange?.from ?? new Date()))
  const [rightMonth, setRightMonth] = useState<Date>(() => {
    const left = startOfMonth(selectedRange?.from ?? new Date())
    const right = startOfMonth(selectedRange?.to ?? addMonths(new Date(), 1))
    return normalizeDualMonths(left, right).right
  })

  /* ── Range draft ── */
  const [rangeDraft, setRangeDraft] = useState<{ from?: Date; to?: Date } | undefined>(selectedRange)

  useEffect(() => {
    setRangeDraft(selectedRange)
    const nextLeftMonth = startOfMonth(selectedRange?.from ?? new Date())
    if (!isDual) {
      setLeftMonth(nextLeftMonth)
      return
    }
    const candidateRight = startOfMonth(selectedRange?.to ?? addMonths(nextLeftMonth, 1))
    const normalizedMonths = normalizeDualMonths(nextLeftMonth, candidateRight)
    setLeftMonth(normalizedMonths.left)
    setRightMonth(normalizedMonths.right)
  }, [selectedRange, isDual])

  /* ── Bounds checking ── */
  const minDay = minValue ? normalizeDay(minValue) : undefined
  const maxDay = maxValue ? normalizeDay(maxValue) : undefined
  const isDateDisabled = (date: Date) => {
    const day = normalizeDay(date)
    if (minDay && isBefore(day, minDay)) return true
    if (maxDay && isAfter(day, maxDay)) return true
    return unavailableDateKeys.has(toDayKey(day))
  }

  /* ── Range predicates ── */
  const activeRange = rangeDraft ?? selectedRange
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

  const emitRange = (nextRange: DateRangeValue) => {
    if (!isControlled) {
      setUncontrolledValue(nextRange)
    }
    onChange?.(nextRange)
  }

  /* ── Unified day click handler (both single and dual mode) ── */
  const onDayPress = (date: Date) => {
    if (isDateDisabled(date) || effectiveIsDisabled) return
    if (!rangeDraft?.from || rangeDraft.to) {
      setRangeDraft({ from: date })
      return
    }
    const start = isBefore(date, rangeDraft.from) ? date : rangeDraft.from
    const end = isAfter(date, rangeDraft.from) ? date : rangeDraft.from
    const nextRange = { from: start, to: end }
    setRangeDraft(nextRange)
    emitRange(nextRange)
    setIsOpen(false)
  }

  /* ── Formatters (needed for dual-month header) ── */
  const { monthHeadingFormatter } = useDateFormatters()

  /* ── Month/year picker state (dual mode — single mode uses panel's built-in picker) ── */
  const [monthYearPickerPanel, setMonthYearPickerPanel] = useState<0 | 1 | null>(null)
  const leftHeadingRef = useRef<HTMLButtonElement | null>(null)
  const rightHeadingRef = useRef<HTMLButtonElement | null>(null)

  const closeMonthYearPicker = () => {
    setMonthYearPickerPanel(null)
  }

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

  /* ── Navigation (dual mode — single mode uses panel's built-in nav) ── */
  const handlePrevMonth = () => {
    if (effectiveIsDisabled) return
    const normalizedMonths = normalizeDualMonths(subMonths(leftMonth, 1), rightMonth)
    setLeftMonth(normalizedMonths.left)
    setRightMonth(normalizedMonths.right)
  }
  const handleNextMonth = () => {
    if (effectiveIsDisabled) return
    const normalizedMonths = normalizeDualMonths(leftMonth, addMonths(rightMonth, 1))
    setLeftMonth(normalizedMonths.left)
    setRightMonth(normalizedMonths.right)
  }

  /* ── renderDay for range selection ── */
  const renderDay = (state: DayRenderState) => {
    const nonInteractive = state.outsideMonth || state.unavailable || effectiveIsDisabled
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

  /* ── Styling ── */
  const calendarNavButtonClass = cn(
    'inline-flex items-center justify-center shrink-0 select-none appearance-none cursor-pointer',
    'p-0 m-0 leading-none rounded-sm transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
    iconButtonBase,
    dateCalendarNavButton,
    iconButtonColorVariants[color][navButtonVariant],
  )

  const renderDateSegment = (segment: Parameters<React.ComponentProps<typeof DateInput>['children']>[0]) => (
    <DateSegment
      segment={segment}
      className={({ type, isPlaceholder, isFocused, isFocusVisible }) =>
        getDateSegmentClassName({ type, isPlaceholder, isFocused, isFocusVisible })
      }
    />
  )

  const hiddenFromValue =
    selectedRange?.from && !Number.isNaN(selectedRange.from.getTime()) ? formatDate(selectedRange.from, dateFormat) : ''
  const hiddenToValue =
    selectedRange?.to && !Number.isNaN(selectedRange.to.getTime()) ? formatDate(selectedRange.to, dateFormat) : ''
  const dateInputClassName = cn(
    floatingStyle
      ? 'flex min-w-0 flex-1 items-center gap-0 text-[var(--tf-font-size)] leading-[var(--tf-line-height)]'
      : rangeDateInput,
    'text-foreground',
  )

  const picker = (
    <AriaDateRangePicker
      aria-label={label ? undefined : ariaLabel}
      aria-labelledby={labelId}
      granularity="day"
      {...pickerValueProps}
      minValue={toDateValue(minValue) ?? undefined}
      maxValue={toDateValue(maxValue) ?? undefined}
      isDateUnavailable={isDateUnavailable}
      isDisabled={effectiveIsDisabled}
      isOpen={isOpen}
      onOpenChange={nextOpen => {
        setIsOpen(nextOpen)
        if (!nextOpen) {
          closeMonthYearPicker()
        }
      }}
      onChange={next => {
        if (!next?.start || !next?.end) return
        const nextRange = fromDateRangeValue(next)
        if (!nextRange) return
        setRangeDraft(nextRange)
        emitRange(nextRange)
      }}
      className="flex w-full min-w-0 flex-col gap-2"
    >
      {name ? (
        <>
          <input type="hidden" name={`${name}_from`} value={hiddenFromValue} />
          <input type="hidden" name={`${name}_to`} value={hiddenToValue} />
        </>
      ) : null}

      <Group
        className={cn(
          rangeTriggerGroupBase,
          rangeTriggerGroupSizeStyles[size],
          getDateFieldSurfaceClassName({ color, radius, variant, floatingStyle, textFieldSize }),
        )}
      >
        <div className={cn(floatingStyle ? dateRangeInputSurfaceClassName : rangeInputSurface)}>
          <DateInput slot="start" className={dateInputClassName}>
            {renderDateSegment}
          </DateInput>
          <span aria-hidden className="text-muted-foreground">
            -
          </span>
          <DateInput slot="end" className={dateInputClassName}>
            {renderDateSegment}
          </DateInput>
        </div>
        <AriaButton
          aria-label="Open calendar"
          className={cn(
            floatingStyle ? [dateIconSlotClassName, dateGhostIconButtonClassName] : rangeCalendarButton,
            'text-muted-foreground transition-colors hover:text-foreground',
          )}
        >
          <CalendarIcon className={rangeCalendarIcon} />
        </AriaButton>
      </Group>

      <Popover
        isNonModal
        shouldCloseOnInteractOutside={() => monthYearPickerPanel === null}
        className={cn(
          rangeTriggerGroupSizeStyles[size],
          'outline-none',
          'data-[entering]:animate-in data-[exiting]:animate-out',
          'data-[entering]:fade-in-0 data-[exiting]:fade-out-0',
          'data-[entering]:zoom-in-95 data-[exiting]:zoom-out-95',
          'data-[placement=bottom]:data-[entering]:slide-in-from-top-2',
          'data-[placement=top]:data-[entering]:slide-in-from-bottom-2',
          rangeCalendarPopover,
          'z-50 max-h-[85vh] overflow-auto border border-border bg-popover text-popover-foreground shadow-md',
          rangeTriggerGroupRadiusStyles[radius],
        )}
      >
        <Dialog className="outline-none">
          {isDual ? (
            <div className={cn('relative space-y-2', rangeCalendarTypography)}>
              {/* Dual-month custom header */}
              <header className={rangeCalendarDualHeader}>
                <button
                  type="button"
                  aria-label="Previous month"
                  className={calendarNavButtonClass}
                  onClick={handlePrevMonth}
                  disabled={effectiveIsDisabled}
                >
                  <ChevronLeft className={dateCalendarNavIcon} />
                </button>
                <button
                  ref={leftHeadingRef}
                  type="button"
                  aria-label={`Select month and year for left calendar: ${monthHeadingFormatter.format(leftMonth)}`}
                  aria-haspopup="dialog"
                  aria-expanded={monthYearPickerPanel === 0}
                  className={cn(
                    rangeCalendarMonthHeadingButton,
                    'inline-flex max-w-full items-center justify-center truncate font-medium select-none',
                    'cursor-pointer transition-colors hover:text-foreground/60',
                    'appearance-none border-0 bg-transparent p-0 m-0 text-inherit font-inherit',
                  )}
                  onClick={() => setMonthYearPickerPanel(0)}
                >
                  <span className="truncate font-medium">{monthHeadingFormatter.format(leftMonth)}</span>
                  <UpDownCaret />
                </button>
                <button
                  ref={rightHeadingRef}
                  type="button"
                  aria-label={`Select month and year for right calendar: ${monthHeadingFormatter.format(rightMonth)}`}
                  aria-haspopup="dialog"
                  aria-expanded={monthYearPickerPanel === 1}
                  className={cn(
                    rangeCalendarMonthHeadingButton,
                    'inline-flex max-w-full items-center justify-center truncate font-medium select-none',
                    'cursor-pointer transition-colors hover:text-foreground/60',
                    'appearance-none border-0 bg-transparent p-0 m-0 text-inherit font-inherit',
                  )}
                  onClick={() => setMonthYearPickerPanel(1)}
                >
                  <span className="truncate font-medium">{monthHeadingFormatter.format(rightMonth)}</span>
                  <UpDownCaret />
                </button>
                <button
                  type="button"
                  aria-label="Next month"
                  className={calendarNavButtonClass}
                  onClick={handleNextMonth}
                  disabled={effectiveIsDisabled}
                >
                  <ChevronRight className={dateCalendarNavIcon} />
                </button>
              </header>

              {/* Month/year wheel picker (dual mode) */}
              {monthYearPickerPanel !== null && (
                <MonthYearPicker
                  displayMonth={monthYearPickerPanel === 0 ? leftMonth : rightMonth}
                  onApply={handleMonthYearApply}
                  onClose={closeMonthYearPicker}
                  triggerRef={monthYearPickerPanel === 0 ? leftHeadingRef : rightHeadingRef}
                  locale={monthHeadingFormatter.resolvedOptions().locale}
                  minValue={minValue}
                  maxValue={maxValue}
                  size={size}
                  color={color}
                />
              )}

              {/* Two calendar panels side by side */}
              <div className={rangeCalendarMonthColumns}>
                <DateCalendarPanel
                  showHeader={false}
                  displayMonth={leftMonth}
                  onDisplayMonthChange={nextMonth => {
                    const normalizedLeft = startOfMonth(nextMonth)
                    setLeftMonth(normalizedLeft)
                    setRightMonth(prev => (isAfter(prev, normalizedLeft) ? prev : addMonths(normalizedLeft, 1)))
                  }}
                  minValue={minValue}
                  maxValue={maxValue}
                  disabledDates={disabledDates}
                  isDisabled={effectiveIsDisabled}
                  size={size}
                  color={color}
                  radius={radius}
                  renderDay={renderDay}
                />
                <DateCalendarPanel
                  showHeader={false}
                  displayMonth={rightMonth}
                  onDisplayMonthChange={nextMonth => {
                    const normalizedRight = startOfMonth(nextMonth)
                    setRightMonth(normalizedRight)
                    setLeftMonth(prev => (isBefore(prev, normalizedRight) ? prev : subMonths(normalizedRight, 1)))
                  }}
                  minValue={minValue}
                  maxValue={maxValue}
                  disabledDates={disabledDates}
                  isDisabled={effectiveIsDisabled}
                  size={size}
                  color={color}
                  radius={radius}
                  renderDay={renderDay}
                />
              </div>
            </div>
          ) : (
            /* Single-month mode — panel handles header, nav, MonthYearPicker */
            <DateCalendarPanel
              displayMonth={leftMonth}
              onDisplayMonthChange={setLeftMonth}
              minValue={minValue}
              maxValue={maxValue}
              disabledDates={disabledDates}
              isDisabled={effectiveIsDisabled}
              size={size}
              color={color}
              radius={radius}
              className={rangeCalendarTypography}
              renderDay={renderDay}
            />
          )}
        </Dialog>
      </Popover>
    </AriaDateRangePicker>
  )

  return (
    <DateFieldWrapper
      label={label}
      disabled={effectiveIsDisabled}
      floatingStyle={floatingStyle}
      color={color}
      textFieldSize={textFieldSize}
      labelId={labelId}
      className={className}
    >
      {picker}
    </DateFieldWrapper>
  )
}
