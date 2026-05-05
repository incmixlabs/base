'use client'

import type { DateValue } from '@internationalized/date'
import { setHours, setMinutes, setSeconds, startOfMonth } from 'date-fns'
import { CalendarClock, Clock } from 'lucide-react'
import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import {
  Button as AriaButton,
  DatePicker as AriaDatePicker,
  DateInput,
  DateSegment,
  Dialog,
  Group,
  Popover,
} from 'react-aria-components'
import { Button } from '@/elements/button/Button'
import {
  iconButtonBase,
  iconButtonColorVariants,
  iconButtonSizeIconScope,
  iconButtonSizeVariants,
} from '@/elements/button/IconButton.css'
import { useThemeRadius } from '@/elements/utils'
import { WheelPicker, WheelPickerWrapper } from '@/elements/wheel-picker/wheel-picker'
import { useFieldGroup } from '@/form/FieldGroupContext'
import type { TextFieldSize } from '@/form/text-field.css'
import { getFloatingStyle } from '@/form/text-field-variant'
import { Flex } from '@/layouts/flex/Flex'
import { KEYBOARD_KEYS } from '@/lib/keyboard-keys'
import { cn } from '@/lib/utils'
import { semanticColorVar } from '@/theme/props/color.prop'
import type { Color, Radius, TextFieldVariant } from '@/theme/tokens'
import { DateNextCalendarPanel } from './DateNextCalendarPanel'
import { datePickerTriggerGroupRadiusStyles, datePickerTriggerGroupSizeStyles } from './DatePickerNext.css'
import {
  type DateNextSize,
  dateNextCalendarDaySizeBySize,
  dateNextControlFontSizeBySize,
  dateNextControlGapBySize,
  isDateNextSize,
} from './date-next.props'
import { normalizeDay, toDayKey } from './date-next-calendar-core'
import {
  DateNextFieldWrapper,
  dateNextGhostIconButtonClassName,
  dateNextIconSlotClassName,
  dateNextSegmentInputClassName,
  getDateNextFieldSurfaceClassName,
  getDateNextSegmentClassName,
} from './date-next-field-shell'
import { fromDateValue, toDateValue } from './date-value-boundary'
import {
  buildHourOptions,
  buildMinuteOptions,
  buildSecondOptions,
  buttonSizeByDateNextSize,
  normalizeMinuteStep,
  snapMinute,
} from './time-wheel-utils'

export interface DateTimePickerNextProps {
  /** Selected date and time */
  value?: Date
  /** Callback when date/time changes */
  onChange?: (date: Date | undefined) => void
  /** Minimum selectable date */
  minValue?: Date
  /** Maximum selectable date */
  maxValue?: Date
  /** Disabled dates */
  disabledDates?: Date[]
  /** Whether the picker is disabled */
  isDisabled?: boolean
  /** Size variant */
  size?: DateNextSize
  /** Accent/selection color. */
  color?: Color
  /** Border radius */
  radius?: Radius
  /** Shared field variant */
  variant?: TextFieldVariant
  /** Field label */
  label?: React.ReactNode
  /** Whether to show seconds wheel */
  showSeconds?: boolean
  /** Step in minutes for the picker */
  minuteStep?: number
  /** Additional class names */
  className?: string
  /** Name for form submission */
  name?: string
  /** Accessible label */
  ariaLabel?: string
}

export function DateTimePickerNext({
  value,
  onChange,
  minValue,
  maxValue,
  disabledDates,
  isDisabled = false,
  size: sizeProp,
  color = 'slate',
  radius: radiusProp,
  variant: variantProp,
  label,
  showSeconds = false,
  minuteStep: rawMinuteStep = 1,
  className,
  name,
  ariaLabel = 'Date and time',
}: DateTimePickerNextProps) {
  const fieldGroup = useFieldGroup()
  const inheritedSize = sizeProp ?? fieldGroup.size
  const size: DateNextSize = isDateNextSize(inheritedSize) ? inheritedSize : 'md'
  const variant = variantProp ?? fieldGroup.variant
  const floatingStyle = getFloatingStyle(variant)
  const radius = useThemeRadius(radiusProp)
  const buttonSize = buttonSizeByDateNextSize[size]
  const textFieldSize: TextFieldSize = size === 'xl' ? 'lg' : size
  const minuteStep = useMemo(() => normalizeMinuteStep(rawMinuteStep), [rawMinuteStep])
  const generatedLabelId = useId()
  const labelId = label ? generatedLabelId : undefined

  const [isOpen, setIsOpen] = useState(false)
  const [displayMonth, setDisplayMonth] = useState<Date>(() => startOfMonth(value ?? new Date()))
  const [showTimePicker, setShowTimePicker] = useState(false)
  const clockTriggerRef = useRef<HTMLButtonElement | null>(null)
  const timeSnapshotRef = useRef<{ hours: number; minutes: number; seconds: number }>({
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  /* ── Time state ── */
  const [hours, setHoursState] = useState(value?.getHours() ?? 0)
  const [minutes, setMinutesState] = useState(value?.getMinutes() ?? 0)
  const [seconds, setSecondsState] = useState(value?.getSeconds() ?? 0)

  useEffect(() => {
    if (value) {
      setHoursState(value.getHours())
      setMinutesState(value.getMinutes())
      setSecondsState(value.getSeconds())
    } else {
      setHoursState(0)
      setMinutesState(0)
      setSecondsState(0)
    }
  }, [value])

  /* ── Reset time picker when popover closes ── */
  useEffect(() => {
    if (!isOpen) setShowTimePicker(false)
  }, [isOpen])

  const openTimePicker = useCallback(() => {
    timeSnapshotRef.current = { hours, minutes, seconds }
    setShowTimePicker(true)
  }, [hours, minutes, seconds])

  const cancelTimePicker = useCallback(() => {
    const snap = timeSnapshotRef.current
    setHoursState(snap.hours)
    setMinutesState(snap.minutes)
    setSecondsState(snap.seconds)
    // Revert the value if a date is selected
    if (value) {
      let reverted = setHours(new Date(value), snap.hours)
      reverted = setMinutes(reverted, snap.minutes)
      if (showSeconds) reverted = setSeconds(reverted, snap.seconds)
      onChange?.(reverted)
    }
    setShowTimePicker(false)
    clockTriggerRef.current?.focus()
  }, [value, showSeconds, onChange])

  /* ── Date selection ── */
  const unavailableDateKeys = useMemo(
    () => new Set((disabledDates ?? []).map(date => toDayKey(normalizeDay(date)))),
    [disabledDates],
  )
  const isDateUnavailable = useMemo(
    () => (unavailableDateKeys.size > 0 ? (date: DateValue) => unavailableDateKeys.has(date.toString()) : undefined),
    [unavailableDateKeys],
  )

  const commitDate = useCallback(
    (date: Date) => {
      let combined = setHours(date, hours)
      combined = setMinutes(combined, snapMinute(minutes, minuteStep))
      if (showSeconds) combined = setSeconds(combined, seconds)
      onChange?.(combined)
    },
    [hours, minutes, seconds, showSeconds, onChange, minuteStep],
  )

  /* ── Time changes (local state only, no emit) ── */
  const handleTimeChange = useCallback((type: 'hours' | 'minutes' | 'seconds', val: number) => {
    if (type === 'hours') setHoursState(val)
    if (type === 'minutes') setMinutesState(val)
    if (type === 'seconds') setSecondsState(val)
  }, [])

  const applyTimePicker = useCallback(() => {
    if (value) {
      let newDate = setHours(new Date(value), hours)
      newDate = setMinutes(newDate, snapMinute(minutes, minuteStep))
      if (showSeconds) newDate = setSeconds(newDate, seconds)
      onChange?.(newDate)
    }
    setShowTimePicker(false)
    clockTriggerRef.current?.focus()
  }, [value, hours, minutes, seconds, minuteStep, showSeconds, onChange])

  /* ── Options ── */
  const hourOptions = useMemo(() => buildHourOptions(), [])
  const minuteOptions = useMemo(() => buildMinuteOptions(minuteStep), [minuteStep])
  const secondOptions = useMemo(() => buildSecondOptions(), [])

  /* ── Hidden value ── */
  const hiddenValue = useMemo(() => {
    if (!value) return ''
    return value.toISOString()
  }, [value])

  const controlledValue = toDateValue(value)

  /* ── Wheel sizing ── */
  const cellSize = dateNextCalendarDaySizeBySize[size]
  const fontSize = dateNextControlFontSizeBySize[size]
  const gap = dateNextControlGapBySize[size]

  /* ── Time display string ── */
  const timeDisplay = useMemo(() => {
    const h = String(hours).padStart(2, '0')
    const m = String(minutes).padStart(2, '0')
    if (showSeconds) {
      const s = String(seconds).padStart(2, '0')
      return `${h}:${m}:${s}`
    }
    return `${h}:${m}`
  }, [hours, minutes, seconds, showSeconds])

  const picker = (
    <AriaDatePicker
      aria-label={label ? undefined : ariaLabel}
      aria-labelledby={labelId}
      granularity="day"
      value={controlledValue}
      minValue={toDateValue(minValue) ?? undefined}
      maxValue={toDateValue(maxValue) ?? undefined}
      isDateUnavailable={isDateUnavailable}
      isDisabled={isDisabled}
      isOpen={isOpen}
      onOpenChange={nextOpen => {
        setIsOpen(nextOpen)
        if (nextOpen) {
          setDisplayMonth(startOfMonth(value ?? new Date()))
        }
      }}
      onChange={next => {
        const nextDate = fromDateValue(next)
        if (nextDate) commitDate(nextDate)
      }}
      className="flex w-full min-w-0 flex-col gap-2"
    >
      {name ? <input type="text" hidden readOnly name={name} value={hiddenValue} /> : null}
      <Group className={getDateNextFieldSurfaceClassName({ color, radius, variant, floatingStyle, textFieldSize })}>
        <DateInput className={dateNextSegmentInputClassName}>
          {segment => (
            <DateSegment
              segment={segment}
              className={({ type, isPlaceholder, isFocused, isFocusVisible }) =>
                getDateNextSegmentClassName({ type, isPlaceholder, isFocused, isFocusVisible })
              }
            />
          )}
        </DateInput>
        <div className={dateNextIconSlotClassName}>
          <AriaButton
            aria-label="Open calendar and time picker"
            className={cn(
              'inline-flex items-center justify-center',
              dateNextGhostIconButtonClassName,
              iconButtonBase,
              iconButtonColorVariants.slate.ghost,
              iconButtonSizeVariants[buttonSize === 'md' ? 'sm' : buttonSize],
              iconButtonSizeIconScope,
            )}
          >
            <CalendarClock />
          </AriaButton>
        </div>
      </Group>

      <Popover
        isNonModal
        className={cn(
          datePickerTriggerGroupSizeStyles[size],
          'z-50 border border-border bg-popover p-3 text-popover-foreground shadow-md outline-none',
          datePickerTriggerGroupRadiusStyles[radius],
          'data-[entering]:animate-in data-[exiting]:animate-out',
          'data-[entering]:fade-in-0 data-[exiting]:fade-out-0',
          'data-[entering]:zoom-in-95 data-[exiting]:zoom-out-95',
          'data-[placement=bottom]:data-[entering]:slide-in-from-top-2',
          'data-[placement=top]:data-[entering]:slide-in-from-bottom-2',
          'data-[placement=left]:data-[entering]:slide-in-from-right-2',
          'data-[placement=right]:data-[entering]:slide-in-from-left-2',
        )}
      >
        <Dialog aria-label="Calendar and time picker" className="outline-none">
          <div className="relative">
            <DateNextCalendarPanel
              value={value ? normalizeDay(value) : undefined}
              onChange={commitDate}
              minValue={minValue}
              maxValue={maxValue}
              disabledDates={disabledDates}
              isDisabled={isDisabled}
              size={size}
              color={color}
              radius={radius}
              displayMonth={displayMonth}
              onDisplayMonthChange={setDisplayMonth}
            />

            {/* Clock trigger footer */}
            <Flex align="center" justify="center" className="border-t border-border mt-2 pt-2">
              <Button
                ref={clockTriggerRef}
                type="button"
                variant="ghost"
                size={buttonSize}
                style={{ fontSize }}
                aria-label="Open time picker"
                aria-haspopup="dialog"
                aria-expanded={showTimePicker}
                onClick={openTimePicker}
              >
                <Clock style={{ width: fontSize, height: fontSize }} />
                {timeDisplay}
              </Button>
            </Flex>

            {/* Time picker overlay (same pattern as MonthYearPicker) */}
            {showTimePicker && (
              <>
                <button
                  type="button"
                  aria-label="Close time picker"
                  tabIndex={-1}
                  className="absolute inset-0 z-40 cursor-default border-0 bg-transparent p-0"
                  onClick={cancelTimePicker}
                />
                <div
                  role="dialog"
                  aria-label="Select time"
                  className={cn(
                    'absolute inset-x-0 z-50 flex flex-col items-center overflow-hidden border border-border bg-popover p-1 shadow-md',
                    datePickerTriggerGroupRadiusStyles[radius],
                  )}
                  style={
                    {
                      top: `calc(${cellSize} + ${gap})`,
                      fontSize,
                      '--wheel-picker-highlight-bg': semanticColorVar(color, 'soft'),
                      '--wheel-picker-highlight-text': semanticColorVar(color, 'text'),
                      '--wheel-picker-highlight-border': semanticColorVar(color, 'border'),
                    } as React.CSSProperties
                  }
                  onKeyDown={event => {
                    if (event.key === KEYBOARD_KEYS.escape) {
                      event.stopPropagation()
                      cancelTimePicker()
                    }
                  }}
                >
                  <WheelPickerWrapper
                    className="!border-0 !rounded-none !bg-transparent !p-0 !shadow-none"
                    style={{ width: `calc(${cellSize} * ${showSeconds ? 6 : 4})` }}
                  >
                    <WheelPicker<number>
                      options={hourOptions}
                      value={hours}
                      onValueChange={val => handleTimeChange('hours', val)}
                      classNames={{ highlightWrapper: '!font-semibold' }}
                    />
                    <WheelPicker<number>
                      options={minuteOptions}
                      value={snapMinute(minutes, minuteStep)}
                      onValueChange={val => handleTimeChange('minutes', val)}
                      classNames={{ highlightWrapper: '!font-semibold' }}
                    />
                    {showSeconds && (
                      <WheelPicker<number>
                        options={secondOptions}
                        value={seconds}
                        onValueChange={val => handleTimeChange('seconds', val)}
                        classNames={{ highlightWrapper: '!font-semibold' }}
                      />
                    )}
                  </WheelPickerWrapper>
                  <Flex align="center" justify="center" gap="2" className="border-t border-border" px="2" py="1">
                    <Button type="button" variant="ghost" size={buttonSize} onClick={cancelTimePicker}>
                      Cancel
                    </Button>
                    <Button type="button" variant="solid" size={buttonSize} onClick={applyTimePicker}>
                      Apply
                    </Button>
                  </Flex>
                </div>
              </>
            )}
          </div>
        </Dialog>
      </Popover>
    </AriaDatePicker>
  )

  return (
    <DateNextFieldWrapper
      label={label}
      disabled={isDisabled}
      floatingStyle={floatingStyle}
      color={color}
      textFieldSize={textFieldSize}
      labelId={labelId}
      className={className}
    >
      {picker}
    </DateNextFieldWrapper>
  )
}
