'use client'

import { Clock } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Group } from 'react-aria-components'
import { Button } from '@/elements/button/Button'
import { useThemeRadius } from '@/elements/utils'
import type { WheelPickerOption } from '@/elements/wheel-picker/wheel-picker'
import { WheelPicker, WheelPickerWrapper } from '@/elements/wheel-picker/wheel-picker'
import { useFieldGroup } from '@/form/FieldGroupContext'
import { Flex } from '@/layouts/flex/Flex'
import { KEYBOARD_KEYS } from '@/lib/keyboard-keys'
import { cn } from '@/lib/utils'
import { semanticColorVar } from '@/theme/props/color.prop'
import type { Color, Radius } from '@/theme/tokens'
import {
  datePickerCalendarButton,
  datePickerCalendarIcon,
  datePickerInput,
  datePickerTriggerGroupBase,
  datePickerTriggerGroupRadiusStyles,
  datePickerTriggerGroupSizeStyles,
} from './DatePicker.css'
import { type DateSize, dateCalendarDaySizeBySize, dateControlFontSizeBySize, isDateSize } from './date.props'
import {
  buildHourOptions,
  buildMinuteOptions,
  buildSecondOptions,
  buttonSizeByDateSize,
  normalizeMinuteStep,
  snapMinute,
} from './time-wheel-utils'

export interface TimeValue {
  hours: number // 0-23
  minutes: number // 0-59
  seconds?: number // 0-59
}

export interface TimePickerProps {
  /** Selected time value (24-hour internal format) */
  value?: TimeValue
  /** Callback when time changes */
  onChange?: (time: TimeValue | undefined) => void
  /** Placeholder text */
  placeholder?: string
  /** Whether the picker is disabled */
  isDisabled?: boolean
  /** Size variant */
  size?: DateSize
  /** Accent/selection color. */
  color?: Color
  /** Border radius */
  radius?: Radius
  /** Whether to show seconds wheel */
  showSeconds?: boolean
  /** Use 12-hour format with AM/PM */
  use12HourFormat?: boolean
  /** Step in minutes for the picker */
  minuteStep?: number
  /** Additional class names */
  className?: string
  /** Name for form submission */
  name?: string
  /** Accessible label */
  ariaLabel?: string
}

const amPmOptions: WheelPickerOption<string>[] = [
  { value: 'AM', label: 'AM' },
  { value: 'PM', label: 'PM' },
]

/* ── Conversions ── */

/** Convert 24h internal hours to 12h display hour. */
function to12Hour(hours24: number): number {
  const h = hours24 % 12
  return h === 0 ? 12 : h
}

/** Convert 12h display hour + period to 24h. */
function to24Hour(displayHour: number, period: 'AM' | 'PM'): number {
  if (period === 'AM') return displayHour === 12 ? 0 : displayHour
  return displayHour === 12 ? 12 : displayHour + 12
}

/* ── Component ── */

export function TimePicker({
  value,
  onChange,
  placeholder = 'Select time',
  isDisabled = false,
  size: sizeProp,
  color = 'slate',
  radius: radiusProp,
  showSeconds = false,
  use12HourFormat = false,
  minuteStep: rawMinuteStep = 1,
  className,
  name,
  ariaLabel = 'Time',
}: TimePickerProps) {
  const fieldGroup = useFieldGroup()
  const inheritedSize = sizeProp ?? fieldGroup.size
  const size: DateSize = isDateSize(inheritedSize) ? inheritedSize : 'md'
  const radius = useThemeRadius(radiusProp ?? fieldGroup.radius)
  const effectiveIsDisabled = isDisabled || fieldGroup.disabled
  const buttonSize = buttonSizeByDateSize[size]
  const minuteStep = useMemo(() => normalizeMinuteStep(rawMinuteStep), [rawMinuteStep])

  const [isOpen, setIsOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const snapshotRef = useRef<TimeValue | undefined>(undefined)

  /* ── Internal state (always 24h) ── */
  const [hours, setHours] = useState(value?.hours ?? 0)
  const [minutes, setMinutes] = useState(value?.minutes ?? 0)
  const [seconds, setSeconds] = useState(value?.seconds ?? 0)
  const [period, setPeriod] = useState<'AM' | 'PM'>(value && value.hours >= 12 ? 'PM' : 'AM')

  useEffect(() => {
    if (value) {
      setHours(value.hours)
      setMinutes(value.minutes)
      setSeconds(value.seconds ?? 0)
      setPeriod(value.hours >= 12 ? 'PM' : 'AM')
    } else {
      setHours(0)
      setMinutes(0)
      setSeconds(0)
      setPeriod('AM')
    }
  }, [value])

  useEffect(() => {
    if (effectiveIsDisabled) {
      setIsOpen(false)
    }
  }, [effectiveIsDisabled])

  const openPicker = useCallback(() => {
    snapshotRef.current = value ? { ...value } : undefined
    setIsOpen(true)
  }, [value])

  const cancelPicker = useCallback(() => {
    const snap = snapshotRef.current
    if (snap) {
      setHours(snap.hours)
      setMinutes(snap.minutes)
      setSeconds(snap.seconds ?? 0)
      setPeriod(snap.hours >= 12 ? 'PM' : 'AM')
    }
    onChange?.(snap)
    setIsOpen(false)
    triggerRef.current?.focus()
  }, [onChange])

  /* ── Escape key ── */
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === KEYBOARD_KEYS.escape) {
        e.stopPropagation()
        cancelPicker()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, cancelPicker])

  /* ── Options ── */
  const hourOptions = useMemo(() => buildHourOptions(use12HourFormat), [use12HourFormat])
  const minuteOptions = useMemo(() => buildMinuteOptions(minuteStep), [minuteStep])
  const secondOptions = useMemo(() => buildSecondOptions(), [])

  /* ── Wheel change handlers (local state only, no emit) ── */
  const handleHourChange = useCallback(
    (val: number) => {
      const h24 = use12HourFormat ? to24Hour(val, period) : val
      setHours(h24)
    },
    [use12HourFormat, period],
  )

  const handleMinuteChange = useCallback((val: number) => {
    setMinutes(val)
  }, [])

  const handleSecondChange = useCallback((val: number) => {
    setSeconds(val)
  }, [])

  const handlePeriodChange = useCallback(
    (val: string) => {
      const p = val as 'AM' | 'PM'
      setPeriod(p)
      const displayHour = to12Hour(hours)
      const h24 = to24Hour(displayHour, p)
      setHours(h24)
    },
    [hours],
  )

  const applyPicker = useCallback(() => {
    const snapped = snapMinute(minutes, minuteStep)
    const tv: TimeValue = { hours, minutes: snapped }
    if (showSeconds) tv.seconds = seconds
    onChange?.(tv)
    setIsOpen(false)
    triggerRef.current?.focus()
  }, [hours, minutes, seconds, minuteStep, showSeconds, onChange])

  /* ── Display ── */
  const formatTimeDisplay = (): string => {
    if (!value) return ''
    let displayHours = value.hours
    let suffix = ''
    if (use12HourFormat) {
      suffix = value.hours >= 12 ? ' PM' : ' AM'
      displayHours = to12Hour(value.hours)
    }
    const h = String(displayHours).padStart(2, '0')
    const m = String(value.minutes).padStart(2, '0')
    if (showSeconds && value.seconds !== undefined) {
      const s = String(value.seconds).padStart(2, '0')
      return `${h}:${m}:${s}${suffix}`
    }
    return `${h}:${m}${suffix}`
  }

  const hiddenValue = useMemo(() => {
    if (!value) return ''
    const h = String(value.hours).padStart(2, '0')
    const m = String(value.minutes).padStart(2, '0')
    if (showSeconds && value.seconds !== undefined) {
      const s = String(value.seconds).padStart(2, '0')
      return `${h}:${m}:${s}`
    }
    return `${h}:${m}`
  }, [value, showSeconds])

  /* ── Wheel picker sizing ── */
  const cellSize = dateCalendarDaySizeBySize[size]
  const fontSize = dateControlFontSizeBySize[size]

  const displayText = formatTimeDisplay()

  return (
    <div className={cn('relative inline-flex flex-col gap-2', className)}>
      {name ? <input type="text" hidden readOnly name={name} value={hiddenValue} /> : null}
      <Group
        className={cn(
          datePickerTriggerGroupBase,
          datePickerTriggerGroupSizeStyles[size],
          datePickerTriggerGroupRadiusStyles[radius],
        )}
      >
        <button
          ref={triggerRef}
          type="button"
          aria-label={ariaLabel}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          disabled={effectiveIsDisabled}
          onClick={() => (isOpen ? cancelPicker() : openPicker())}
          className={cn(
            datePickerInput,
            'w-full text-left outline-none cursor-pointer',
            'disabled:cursor-not-allowed disabled:opacity-50',
            displayText ? 'text-foreground' : 'text-muted-foreground',
          )}
        >
          {displayText || placeholder}
        </button>
        <button
          type="button"
          aria-label="Open time picker"
          disabled={effectiveIsDisabled}
          onClick={() => (isOpen ? cancelPicker() : openPicker())}
          className={cn(datePickerCalendarButton, 'text-muted-foreground transition-colors hover:text-foreground')}
        >
          <Clock className={datePickerCalendarIcon} />
        </button>
      </Group>

      {isOpen && !effectiveIsDisabled && (
        <>
          {/* Backdrop — closes on click (same pattern as MonthYearPicker) */}
          <button
            type="button"
            aria-label="Close time picker"
            tabIndex={-1}
            className="fixed inset-0 z-40 cursor-default border-0 bg-transparent p-0"
            onClick={cancelPicker}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Time picker"
            className={cn(
              'absolute left-0 top-full z-50 mt-1 flex flex-col items-center overflow-hidden border border-border bg-popover p-1 shadow-md',
              datePickerTriggerGroupRadiusStyles[radius],
            )}
            style={
              {
                fontSize,
                '--wheel-picker-highlight-bg': semanticColorVar(color, 'soft'),
                '--wheel-picker-highlight-text': semanticColorVar(color, 'text'),
                '--wheel-picker-highlight-border': semanticColorVar(color, 'border'),
              } as React.CSSProperties
            }
          >
            <WheelPickerWrapper
              className="!border-0 !rounded-none !bg-transparent !p-0 !shadow-none"
              style={{
                width: `calc(${cellSize} * ${showSeconds ? (use12HourFormat ? 8 : 6) : use12HourFormat ? 6 : 4})`,
              }}
            >
              <WheelPicker<number>
                options={hourOptions}
                value={use12HourFormat ? to12Hour(hours) : hours}
                onValueChange={handleHourChange}
                classNames={{ highlightWrapper: '!font-semibold' }}
              />
              <WheelPicker<number>
                options={minuteOptions}
                value={snapMinute(minutes, minuteStep)}
                onValueChange={handleMinuteChange}
                classNames={{ highlightWrapper: '!font-semibold' }}
              />
              {showSeconds && (
                <WheelPicker<number>
                  options={secondOptions}
                  value={seconds}
                  onValueChange={handleSecondChange}
                  classNames={{ highlightWrapper: '!font-semibold' }}
                />
              )}
              {use12HourFormat && (
                <WheelPicker<string>
                  options={amPmOptions}
                  value={period}
                  onValueChange={handlePeriodChange}
                  classNames={{ highlightWrapper: '!font-semibold' }}
                />
              )}
            </WheelPickerWrapper>
            <Flex align="center" justify="center" gap="2" className="w-full border-t border-border" px="2" py="1">
              <Button type="button" variant="ghost" size={buttonSize} onClick={cancelPicker}>
                Cancel
              </Button>
              <Button type="button" variant="solid" size={buttonSize} onClick={applyPicker}>
                Apply
              </Button>
            </Flex>
          </div>
        </>
      )}
    </div>
  )
}
