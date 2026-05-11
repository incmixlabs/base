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
import {
  type ChangeEvent,
  type CSSProperties,
  type KeyboardEvent,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  Button as AriaButton,
  DatePicker as AriaDatePicker,
  DateInput,
  DateSegment,
  Dialog,
  Group,
  Popover,
} from 'react-aria-components'
import { createPortal } from 'react-dom'
import { useThemeRadius } from '@/elements/utils'
import { useFieldGroup } from '@/form/FieldGroupContext'
import { InputMask, type InputMaskProps } from '@/form/InputMask'
import { TextField } from '@/form/TextField'
import { KEYBOARD_KEYS } from '@/lib/keyboard-keys'
import { cn } from '@/lib/utils'
import { useThemePortalContainer } from '@/theme/theme-provider.context'
import type { Color, Radius, TextFieldVariant } from '@/theme/tokens'
import { getFloatingStyle, toBaseTextFieldVariant } from '../text-field-variant'
import { DateCalendarPanel } from './DateCalendarPanel'
import {
  datePickerCalendarButton,
  datePickerCalendarIcon,
  datePickerCalendarPopover,
  datePickerTriggerGroupBase,
  datePickerTriggerGroupRadiusStyles,
  datePickerTriggerGroupSizeStyles,
} from './DatePicker.css'
import { type DateSize, isDateSize } from './date.props'
import { normalizeDay, toDayKey } from './date-calendar-core'
import {
  DateFieldWrapper,
  dateGhostIconButtonClassName,
  dateIconSlotClassName,
  dateSegmentInputClassName,
  getDateFieldSurfaceClassName,
  getDateSegmentClassName,
} from './date-field-shell'
import { fromDateValue, toDateValue } from './date-value-boundary'

export interface DatePickerProps {
  value?: Date
  defaultValue?: Date
  onChange?: (value: Date | undefined) => void
  placeholder?: string
  entryMode?: 'segmented' | 'text' | 'natural'
  enableNaturalLanguage?: boolean
  dateFormat?: string
  inputMask?: InputMaskProps['mask']
  maskOptions?: InputMaskProps['maskOptions']
  minValue?: Date
  maxValue?: Date
  disabledDates?: Date[]
  size?: DateSize
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

type TextCalendarPopoverPosition = {
  side: 'top' | 'bottom'
  offset: number
  left: number
  maxHeight: number
}

function isPotentialDatePrefix(value: string, dateFormat: string) {
  const trimmedValue = value.trim()
  if (!trimmedValue) return true

  if (dateFormat === 'yyyy-MM-dd') {
    return /^\d{0,4}(?:-\d{0,2}(?:-\d{0,2})?)?$/.test(trimmedValue) && trimmedValue.length < dateFormat.length
  }

  if (dateFormat === 'MM/dd/yyyy') {
    return /^\d{0,2}(?:\/\d{0,2}(?:\/\d{0,4})?)?$/.test(trimmedValue) && trimmedValue.length < dateFormat.length
  }

  return false
}

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
export function DatePicker({
  value,
  defaultValue,
  onChange,
  placeholder = 'Pick a date',
  entryMode,
  enableNaturalLanguage = false,
  dateFormat = 'yyyy-MM-dd',
  inputMask,
  maskOptions,
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
}: DatePickerProps) {
  const fieldGroup = useFieldGroup()
  const inheritedSize = sizeProp ?? fieldGroup.size
  // TODO(date): keep date size scope capped at 2x; only revisit 3x-5x if product usage appears.
  const size: DateSize = isDateSize(inheritedSize) ? inheritedSize : 'md'
  const textFieldSize = size === 'xl' ? 'lg' : size
  const variant = variantProp ?? fieldGroup.variant
  const floatingStyle = getFloatingStyle(variant)
  const radius = useThemeRadius(radiusProp ?? fieldGroup.radius)
  const effectiveIsDisabled = isDisabled || fieldGroup.disabled
  const generatedLabelId = useId()
  const labelId = label ? generatedLabelId : undefined
  const generatedErrorId = useId()
  const textInputAnchorRef = useRef<HTMLDivElement | null>(null)
  const [uncontrolledValue, setUncontrolledValue] = useState<Date | undefined>(defaultValue)
  const [inputValue, setInputValue] = useState('')
  const [inputValidationError, setInputValidationError] = useState<string | undefined>()
  const [isOpen, setIsOpen] = useState(false)
  const [textCalendarPosition, setTextCalendarPosition] = useState<TextCalendarPopoverPosition | null>(null)
  const isControlled = value !== undefined
  const selectedDate = isControlled ? value : uncontrolledValue
  const resolvedEntryMode = entryMode ?? (enableNaturalLanguage ? 'natural' : 'segmented')
  const controlledValue = toDateValue(selectedDate)
  const [displayMonth, setDisplayMonth] = useState<Date>(() => startOfMonth(selectedDate ?? new Date()))
  const portalContainer = useThemePortalContainer()

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

  const updateTextCalendarPosition = useCallback(() => {
    if (resolvedEntryMode === 'segmented' || typeof window === 'undefined') return
    const anchor = textInputAnchorRef.current
    if (!anchor) return

    const viewportPadding = 8
    const anchorOffset = 4
    const calendarWidthEstimate = 340
    const rect = anchor.getBoundingClientRect()
    const left = Math.min(
      Math.max(rect.left, viewportPadding),
      Math.max(viewportPadding, window.innerWidth - calendarWidthEstimate - viewportPadding),
    )
    const spaceBelow = window.innerHeight - rect.bottom - viewportPadding
    const spaceAbove = rect.top - viewportPadding
    const side: TextCalendarPopoverPosition['side'] = spaceBelow >= 280 || spaceBelow >= spaceAbove ? 'bottom' : 'top'
    const availableSpace = Math.max(180, side === 'bottom' ? spaceBelow : spaceAbove)

    setTextCalendarPosition({
      side,
      offset: side === 'bottom' ? rect.bottom + anchorOffset : window.innerHeight - rect.top + anchorOffset,
      left,
      maxHeight: Math.min(360, availableSpace),
    })
  }, [resolvedEntryMode])

  useEffect(() => {
    if (!isOpen || resolvedEntryMode === 'segmented') {
      setTextCalendarPosition(null)
      return
    }

    updateTextCalendarPosition()
    window.addEventListener('resize', updateTextCalendarPosition)
    window.addEventListener('scroll', updateTextCalendarPosition, true)

    return () => {
      window.removeEventListener('resize', updateTextCalendarPosition)
      window.removeEventListener('scroll', updateTextCalendarPosition, true)
    }
  }, [isOpen, resolvedEntryMode, updateTextCalendarPosition])

  const commitDate = (nextDate: Date) => {
    if (!isControlled) {
      setUncontrolledValue(nextDate)
    }
    onChange?.(nextDate)
    setInputValidationError(undefined)
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
  const getDateUnavailableMessage = (date: Date) => {
    if (minDay && isBefore(date, minDay)) {
      return `Date must be on or after ${formatDate(minDay, dateFormat)}.`
    }
    if (maxDay && isAfter(date, maxDay)) {
      return `Date must be on or before ${formatDate(maxDay, dateFormat)}.`
    }
    return 'Date is not available.'
  }
  const handleTextInputChange = (nextInput: string) => {
    setInputValue(nextInput)
    if (!nextInput.trim()) {
      if (!isControlled) setUncontrolledValue(undefined)
      onChange?.(undefined)
      setInputValidationError(undefined)
      return
    }
    if (resolvedEntryMode === 'natural' && isAmbiguousNaturalPhrase(nextInput)) {
      setInputValidationError(undefined)
      return
    }
    const parsed = resolvedEntryMode === 'natural' ? parseDate(nextInput) : parseDateStringInput(nextInput, dateFormat)
    if (!parsed) {
      if (resolvedEntryMode === 'text' && isPotentialDatePrefix(nextInput, dateFormat)) {
        setInputValidationError(undefined)
        return
      }
      setInputValidationError(`Enter a valid date in ${dateFormat.toUpperCase()} format.`)
      return
    }
    const normalizedParsed = normalizeDay(parsed)
    if (!isDateAllowed(normalizedParsed)) {
      setInputValidationError(getDateUnavailableMessage(normalizedParsed))
      return
    }
    if (!isControlled) {
      setUncontrolledValue(normalizedParsed)
    }
    onChange?.(normalizedParsed)
    setInputValidationError(undefined)
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
    <DateCalendarPanel
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
    const inputErrorId = inputValidationError ? generatedErrorId : undefined
    const calendarButton = (
      <button
        type="button"
        aria-label="Open calendar"
        data-date-picker-calendar-button=""
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
    )
    const textInputProps = {
      type: 'text',
      name,
      value: inputValue,
      placeholder,
      'aria-label': label ? undefined : ariaLabel,
      'aria-labelledby': labelId,
      'aria-describedby': inputErrorId,
      disabled: effectiveIsDisabled,
      size: textFieldSize,
      color,
      radius,
      variant: toBaseTextFieldVariant(variant),
      error: Boolean(inputValidationError),
      className: datePickerTriggerGroupSizeStyles[size],
      onChange: (event: ChangeEvent<HTMLInputElement>) => handleTextInputChange(event.currentTarget.value),
      onKeyDown: handleTextInputKeyDown,
      rightElement: calendarButton,
    } satisfies Omit<InputMaskProps, 'mask'>
    const calendarPopoverStyle: CSSProperties | undefined = textCalendarPosition
      ? {
          position: 'fixed',
          left: textCalendarPosition.left,
          width: 'max-content',
          maxWidth: 'calc(100vw - 1rem)',
          maxHeight: textCalendarPosition.maxHeight,
          ...(textCalendarPosition.side === 'bottom'
            ? { top: textCalendarPosition.offset }
            : { bottom: textCalendarPosition.offset }),
        }
      : undefined
    const textCalendarPopover =
      isOpen && textCalendarPosition && typeof document !== 'undefined'
        ? createPortal(
            <div
              role="dialog"
              aria-label="Calendar"
              aria-modal="false"
              data-date-picker-popover=""
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
                'z-50 overflow-auto border border-border bg-popover text-popover-foreground shadow-md outline-none',
              )}
              style={calendarPopoverStyle}
            >
              {calendarPanel}
            </div>,
            portalContainer ?? document.body,
          )
        : null

    // Free-form text entry behaves like a standard text field rather than a segmented floating field.
    // Keep this path non-floating until a dedicated natural-language floating design exists.
    return (
      <DateFieldWrapper
        label={label}
        disabled={effectiveIsDisabled}
        floatingStyle={null}
        color={color}
        textFieldSize={textFieldSize}
        labelId={labelId}
        className={className}
      >
        <div className="flex w-full min-w-0 flex-col gap-2">
          <div ref={textInputAnchorRef} className="w-full min-w-0">
            {inputMask ? (
              <InputMask {...textInputProps} mask={inputMask} maskOptions={maskOptions} />
            ) : (
              <TextField {...textInputProps} />
            )}
          </div>
          {inputValidationError ? (
            <p id={generatedErrorId} className="text-sm text-destructive">
              {inputValidationError}
            </p>
          ) : null}

          {textCalendarPopover}
        </div>
      </DateFieldWrapper>
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
          getDateFieldSurfaceClassName({ color, radius, variant, floatingStyle, textFieldSize }),
        )}
      >
        <DateInput className={dateSegmentInputClassName}>
          {segment => (
            <DateSegment
              segment={segment}
              className={({ type, isPlaceholder, isFocused, isFocusVisible }) =>
                getDateSegmentClassName({ type, isPlaceholder, isFocused, isFocusVisible })
              }
            />
          )}
        </DateInput>
        <AriaButton aria-label="Open calendar" className={cn(dateIconSlotClassName, dateGhostIconButtonClassName)}>
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
