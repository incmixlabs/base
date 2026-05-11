'use client'

import type { DateValue } from '@internationalized/date'
import { parseDate } from 'chrono-node'
import {
  format as formatDate,
  isAfter,
  isBefore,
  isValid as isValidDate,
  parse as parseFormattedDate,
  startOfMonth,
} from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import { type KeyboardEvent, useEffect, useId, useMemo, useState } from 'react'
import {
  Button as AriaButton,
  DatePicker as AriaDatePicker,
  DateInput,
  DateSegment,
  Dialog,
  Group,
  Popover,
} from 'react-aria-components'
import { useThemeRadius } from '@/elements/utils'
import { useFieldGroup } from '@/form/FieldGroupContext'
import { TextField } from '@/form/TextField'
import { KEYBOARD_KEYS } from '@/lib/keyboard-keys'
import { cn } from '@/lib/utils'
import type { Color, Radius, TextFieldVariant } from '@/theme/tokens'
import { getFloatingStyle, toBaseTextFieldVariant } from '../text-field-variant'
import { DateNextCalendarPanel } from './DateNextCalendarPanel'
import {
  datePickerCalendarButton,
  datePickerCalendarIcon,
  datePickerCalendarPopover,
  datePickerTriggerGroupBase,
  datePickerTriggerGroupRadiusStyles,
  datePickerTriggerGroupSizeStyles,
} from './DatePickerNext.css'
import { type DateNextSize, isDateNextSize } from './date-next.props'
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

export interface DatePickerNextProps {
  value?: Date
  defaultValue?: Date
  onChange?: (value: Date | undefined) => void
  placeholder?: string
  entryMode?: 'segmented' | 'text' | 'natural'
  enableNaturalLanguage?: boolean
  dateFormat?: string
  minValue?: Date
  maxValue?: Date
  disabledDates?: Date[]
  size?: DateNextSize
  /**
   * `@deprecated` Reserved for planned calendar-surface variant support.
   * Currently a no-op for trigger/input chrome (intentionally neutral).
   */
  variant?: TextFieldVariant
  label?: React.ReactNode
  /** Accent/selection color. */
  color?: Color
  radius?: Radius
  name?: string
  isDisabled?: boolean
  ariaLabel?: string
  className?: string
}

const ambiguousRelativePhrases = new Set(['next', 'last', 'this'])
const isAmbiguousNaturalPhrase = (value: string) => ambiguousRelativePhrases.has(value.trim().toLowerCase())

function parseDateStringInput(value: string, dateFormat: string): Date | undefined {
  const trimmedValue = value.trim()
  if (!trimmedValue) return undefined

  if (dateFormat === 'yyyy-MM-dd') {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmedValue)
    if (!match) return undefined

    const [, yearText, monthText, dayText] = match
    const year = Number(yearText)
    const month = Number(monthText)
    const day = Number(dayText)
    const parsed = new Date(year, month - 1, day)
    if (
      Number.isNaN(parsed.getTime()) ||
      parsed.getFullYear() !== year ||
      parsed.getMonth() !== month - 1 ||
      parsed.getDate() !== day
    ) {
      return undefined
    }
    return parsed
  }

  try {
    const parsed = parseFormattedDate(trimmedValue, dateFormat, new Date())
    if (!isValidDate(parsed)) return undefined
    return formatDate(parsed, dateFormat) === trimmedValue ? parsed : undefined
  } catch {
    return undefined
  }
}

/** Private spike component for Issue #179. */
export function DatePickerNext({
  value,
  defaultValue,
  onChange,
  placeholder = 'Pick a date',
  entryMode,
  enableNaturalLanguage = false,
  dateFormat = 'yyyy-MM-dd',
  minValue,
  maxValue,
  disabledDates,
  size: sizeProp,
  variant: variantProp,
  label,
  color = 'slate',
  radius: radiusProp,
  name,
  isDisabled,
  ariaLabel = 'Date',
  className,
}: DatePickerNextProps) {
  const fieldGroup = useFieldGroup()
  const inheritedSize = sizeProp ?? fieldGroup.size
  // TODO(date-next): keep date-next size scope capped at 2x; only revisit 3x-5x if product usage appears.
  const size: DateNextSize = isDateNextSize(inheritedSize) ? inheritedSize : 'md'
  const textFieldSize = size === 'xl' ? 'lg' : size
  const variant = variantProp ?? fieldGroup.variant
  const floatingStyle = getFloatingStyle(variant)
  const radius = useThemeRadius(radiusProp ?? fieldGroup.radius)
  const effectiveIsDisabled = isDisabled || fieldGroup.disabled
  const generatedLabelId = useId()
  const labelId = label ? generatedLabelId : undefined
  const [uncontrolledValue, setUncontrolledValue] = useState<Date | undefined>(defaultValue)
  const [inputValue, setInputValue] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const isControlled = value !== undefined
  const selectedDate = isControlled ? value : uncontrolledValue
  const resolvedEntryMode = entryMode ?? (enableNaturalLanguage ? 'natural' : 'segmented')
  const controlledValue = toDateValue(selectedDate)
  const [displayMonth, setDisplayMonth] = useState<Date>(() => startOfMonth(selectedDate ?? new Date()))

  const hiddenValue = useMemo(() => {
    if (!selectedDate) return ''
    try {
      return formatDate(selectedDate, dateFormat)
    } catch {
      return formatDate(selectedDate, 'yyyy-MM-dd')
    }
  }, [dateFormat, selectedDate])

  const unavailableDateKeys = useMemo(
    () => new Set((disabledDates ?? []).map(date => toDayKey(normalizeDay(date)))),
    [disabledDates],
  )
  const isDateUnavailable = useMemo(
    () => (unavailableDateKeys.size > 0 ? (date: DateValue) => unavailableDateKeys.has(date.toString()) : undefined),
    [unavailableDateKeys],
  )
  const minDay = minValue ? normalizeDay(minValue) : undefined
  const maxDay = maxValue ? normalizeDay(maxValue) : undefined

  useEffect(() => {
    if (resolvedEntryMode === 'segmented' || isOpen) return
    setInputValue(selectedDate ? hiddenValue : '')
  }, [hiddenValue, isOpen, resolvedEntryMode, selectedDate])

  const commitDate = (nextDate: Date) => {
    if (!isControlled) {
      setUncontrolledValue(nextDate)
    }
    onChange?.(nextDate)
    setIsOpen(false)
    if (resolvedEntryMode !== 'segmented') {
      try {
        setInputValue(formatDate(nextDate, dateFormat))
      } catch {
        setInputValue(formatDate(nextDate, 'yyyy-MM-dd'))
      }
    }
  }

  const isDayUnavailable = (day: Date) => {
    if (minDay && isBefore(day, minDay)) return true
    if (maxDay && isAfter(day, maxDay)) return true
    return unavailableDateKeys.has(toDayKey(day))
  }
  const isDateAllowed = (date: Date) => !isDayUnavailable(normalizeDay(date))
  const handleTextInputChange = (nextInput: string) => {
    setInputValue(nextInput)
    if (!nextInput.trim()) {
      if (!isControlled) setUncontrolledValue(undefined)
      onChange?.(undefined)
      return
    }
    const parsed =
      resolvedEntryMode === 'natural' && !isAmbiguousNaturalPhrase(nextInput)
        ? parseDate(nextInput)
        : parseDateStringInput(nextInput, dateFormat)
    if (!parsed) return
    const normalizedParsed = normalizeDay(parsed)
    if (!isDateAllowed(normalizedParsed)) return
    if (!isControlled) {
      setUncontrolledValue(normalizedParsed)
    }
    onChange?.(normalizedParsed)
    setDisplayMonth(startOfMonth(normalizedParsed))
  }
  const handleTextInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === KEYBOARD_KEYS.escape) {
      event.preventDefault()
      setIsOpen(false)
      return
    }
    if (event.key !== KEYBOARD_KEYS.arrowDown) return
    event.preventDefault()
    setDisplayMonth(startOfMonth(selectedDate ?? new Date()))
    setIsOpen(true)
  }

  const calendarPanel = (
    <DateNextCalendarPanel
      value={selectedDate}
      onChange={commitDate}
      minValue={minValue}
      maxValue={maxValue}
      disabledDates={disabledDates}
      isDisabled={effectiveIsDisabled}
      size={size}
      color={color}
      radius={radius}
      displayMonth={displayMonth}
      onDisplayMonthChange={setDisplayMonth}
    />
  )

  if (resolvedEntryMode !== 'segmented') {
    // Free-form text entry behaves like a standard text field rather than a segmented floating field.
    // Keep this path non-floating until a dedicated natural-language floating design exists.
    return (
      <DateNextFieldWrapper
        label={label}
        disabled={effectiveIsDisabled}
        floatingStyle={null}
        color={color}
        textFieldSize={textFieldSize}
        labelId={labelId}
        className={className}
      >
        <div className="flex w-full min-w-0 flex-col gap-2">
          <TextField
            type="text"
            name={name}
            value={inputValue}
            placeholder={placeholder}
            aria-label={label ? undefined : ariaLabel}
            aria-labelledby={labelId}
            disabled={effectiveIsDisabled}
            size={textFieldSize}
            color={color}
            radius={radius}
            variant={toBaseTextFieldVariant(variant)}
            className={datePickerTriggerGroupSizeStyles[size]}
            onChange={event => handleTextInputChange(event.currentTarget.value)}
            onKeyDown={handleTextInputKeyDown}
            rightElement={
              <button
                type="button"
                aria-label="Open calendar"
                disabled={effectiveIsDisabled}
                onClick={() => {
                  setIsOpen(true)
                  setDisplayMonth(startOfMonth(selectedDate ?? new Date()))
                }}
                className={cn(
                  datePickerCalendarButton,
                  'text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-50',
                )}
              >
                <CalendarIcon className={datePickerCalendarIcon} />
              </button>
            }
          />

          {isOpen ? (
            <div
              role="dialog"
              aria-label="Calendar"
              aria-modal="false"
              onKeyDown={event => {
                if (event.key === KEYBOARD_KEYS.escape) {
                  event.preventDefault()
                  setIsOpen(false)
                }
              }}
              className={cn(
                datePickerTriggerGroupSizeStyles[size],
                datePickerCalendarPopover,
                datePickerTriggerGroupRadiusStyles[radius],
                'z-50 max-h-[85vh] overflow-auto border border-border bg-popover text-popover-foreground shadow-md outline-none',
              )}
            >
              {calendarPanel}
            </div>
          ) : null}
        </div>
      </DateNextFieldWrapper>
    )
  }

  const picker = (
    <AriaDatePicker
      aria-label={label ? undefined : ariaLabel}
      aria-labelledby={labelId}
      granularity="day"
      value={controlledValue}
      minValue={toDateValue(minValue) ?? undefined}
      maxValue={toDateValue(maxValue) ?? undefined}
      isDateUnavailable={isDateUnavailable}
      isDisabled={effectiveIsDisabled}
      isOpen={isOpen}
      onOpenChange={nextOpen => {
        setIsOpen(nextOpen)
        if (nextOpen) {
          setDisplayMonth(startOfMonth(selectedDate ?? new Date()))
        }
      }}
      onChange={next => {
        const nextDate = fromDateValue(next)
        if (!isControlled) {
          setUncontrolledValue(nextDate)
        }
        onChange?.(nextDate)
      }}
      className="flex w-full min-w-0 flex-col gap-2"
    >
      {name ? <input type="text" hidden readOnly name={name} value={hiddenValue} /> : null}
      <Group
        className={cn(
          datePickerTriggerGroupBase,
          datePickerTriggerGroupSizeStyles[size],
          getDateNextFieldSurfaceClassName({ color, radius, variant, floatingStyle, textFieldSize }),
        )}
      >
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
        <AriaButton
          aria-label="Open calendar"
          className={cn(dateNextIconSlotClassName, dateNextGhostIconButtonClassName)}
        >
          <CalendarIcon className={datePickerCalendarIcon} />
        </AriaButton>
      </Group>

      <Popover
        isNonModal
        className={cn(
          datePickerTriggerGroupSizeStyles[size],
          datePickerCalendarPopover,
          datePickerTriggerGroupRadiusStyles[radius],
          'z-50 max-h-[85vh] overflow-auto border border-border bg-popover text-popover-foreground shadow-md outline-none',
          'data-[entering]:animate-in data-[exiting]:animate-out',
          'data-[entering]:fade-in-0 data-[exiting]:fade-out-0',
          'data-[entering]:zoom-in-95 data-[exiting]:zoom-out-95',
          'data-[placement=bottom]:data-[entering]:slide-in-from-top-2',
          'data-[placement=top]:data-[entering]:slide-in-from-bottom-2',
          'data-[placement=left]:data-[entering]:slide-in-from-right-2',
          'data-[placement=right]:data-[entering]:slide-in-from-left-2',
        )}
      >
        <Dialog aria-label="Calendar" className="outline-none">
          {calendarPanel}
        </Dialog>
      </Popover>
    </AriaDatePicker>
  )

  return (
    <DateNextFieldWrapper
      label={label}
      disabled={effectiveIsDisabled}
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
