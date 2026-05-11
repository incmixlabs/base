'use client'

import { CircleCheckIcon } from 'lucide-react'
import { forwardRef, useEffect, useMemo, useState } from 'react'
import { Button } from '@/elements/button/Button'
import { ScrollArea } from '@/elements/scroll-area/ScrollArea'
import { cn } from '@/lib/utils'
import type { Color, Radius } from '@/theme/tokens'
import {
  appointmentPickerCheckIcon,
  appointmentPickerColorStyles,
  appointmentPickerFooterPadding,
  appointmentPickerFooterText,
  appointmentPickerRoot,
  appointmentPickerRootDisabled,
  appointmentPickerSizeStyles,
  appointmentPickerSlotContainer,
  appointmentPickerSlotGap,
  appointmentPickerSlotHeight,
  appointmentPickerSlotWidth,
  appointmentPickerTitle,
} from './AppointmentPicker.css'
import { DateCalendarPanel } from './DateCalendarPanel'
import { type DateSize, isDateSize } from './date.props'
import { mapDateSizeToButtonSize } from './date-size-maps'

export interface TimeSlot {
  /** Time value (e.g., "09:00", "09:15") */
  time: string
  /** Display label (defaults to time if not provided) */
  label?: string
  /** Whether the slot is available */
  available?: boolean
}

export interface AppointmentValue {
  /** Selected date */
  date: Date
  /** Selected time slot */
  time: string
}

/** Default time slots (15-minute intervals from 9am to 4:45pm) */
export const defaultTimeSlotsList: TimeSlot[] = [
  { time: '09:00', available: true },
  { time: '09:15', available: true },
  { time: '09:30', available: true },
  { time: '09:45', available: true },
  { time: '10:00', available: true },
  { time: '10:15', available: true },
  { time: '10:30', available: true },
  { time: '10:45', available: true },
  { time: '11:00', available: true },
  { time: '11:15', available: true },
  { time: '11:30', available: true },
  { time: '11:45', available: true },
  { time: '12:00', available: true },
  { time: '12:15', available: true },
  { time: '12:30', available: true },
  { time: '12:45', available: true },
  { time: '13:00', available: true },
  { time: '13:15', available: true },
  { time: '13:30', available: true },
  { time: '13:45', available: true },
  { time: '14:00', available: true },
  { time: '14:15', available: true },
  { time: '14:30', available: true },
  { time: '14:45', available: true },
  { time: '15:00', available: true },
  { time: '15:15', available: true },
  { time: '15:30', available: true },
  { time: '15:45', available: true },
  { time: '16:00', available: true },
  { time: '16:15', available: true },
  { time: '16:30', available: true },
  { time: '16:45', available: true },
]

export interface AppointmentPickerProps {
  /** Selected appointment value */
  value?: AppointmentValue
  /**
   * Callback when a complete appointment changes.
   * Selecting a date resets the time and emits `undefined` until a new time is selected.
   */
  onChange?: (value: AppointmentValue | undefined) => void
  /** Title displayed at the top */
  title?: string
  /** Available time slots for each day */
  getAvailableTimeSlots?: (date: Date) => TimeSlot[]
  /** Fallback slots used when getAvailableTimeSlots is not provided */
  defaultTimeSlots?: TimeSlot[]
  /** Meeting duration in minutes */
  meetingDurationMinutes?: number
  /** Callback when continue/confirm button is clicked */
  onConfirm?: (value: AppointmentValue) => void
  /** Text for the confirm button */
  confirmText?: string
  /** Whether to show the confirm button */
  showConfirmButton?: boolean
  /** Whether to show the confirmation message */
  showConfirmation?: boolean
  /** Custom booking message */
  bookingMessage?: (value: AppointmentValue, durationMinutes: number) => string
  /** Additional class names */
  className?: string
  /** Whether the picker is disabled */
  disabled?: boolean
  /** Minimum selectable date */
  minDate?: Date
  /** Maximum selectable date */
  maxDate?: Date
  /** Dates to disable */
  disabledDates?: Date[]
  /** Width of the time slots panel (overrides size default) */
  timeSlotWidth?: string
  /** Height of the time slots scroll area (overrides size default) */
  timeSlotHeight?: string
  /** Semantic color (passed to calendar panel and time slot buttons) */
  color?: Color
  /** Day cell border radius (passed to calendar panel) */
  radius?: Radius
  /** T-shirt size (passed to calendar panel and time slot buttons) */
  size?: DateSize
}

/** Date-next appointment picker with calendar + time slot selection. */
export const AppointmentPicker = forwardRef<HTMLDivElement, AppointmentPickerProps>(
  (
    {
      value,
      onChange,
      title = 'Book your appointment',
      getAvailableTimeSlots,
      defaultTimeSlots,
      meetingDurationMinutes = 60,
      onConfirm,
      confirmText = 'Continue',
      showConfirmButton = true,
      showConfirmation = true,
      bookingMessage,
      className,
      disabled = false,
      minDate,
      maxDate,
      disabledDates,
      timeSlotWidth,
      timeSlotHeight,
      color = 'slate',
      radius = 'full',
      size: sizeProp = 'md',
    },
    ref,
  ) => {
    const size: DateSize = isDateSize(sizeProp) ? sizeProp : 'md'

    const [selectedDate, setSelectedDate] = useState<Date | undefined>(value?.date)
    const [selectedTime, setSelectedTime] = useState<string | undefined>(value?.time)

    const locale = useMemo(
      () =>
        typeof document !== 'undefined' && document.documentElement.lang ? document.documentElement.lang : 'en-US',
      [],
    )
    const confirmDateFormatter = useMemo(
      () => new Intl.DateTimeFormat(locale, { weekday: 'long', month: 'long', day: 'numeric' }),
      [locale],
    )

    /* ── Sync external value (keyed on primitives to avoid object-identity churn) ── */
    const valueDateMs = value?.date?.getTime()
    const valueTime = value?.time
    useEffect(() => {
      setSelectedDate(valueDateMs != null ? new Date(valueDateMs) : undefined)
      setSelectedTime(valueTime)
    }, [valueDateMs, valueTime])

    /* ── Time slots ── */
    const availableSlots = useMemo(() => {
      if (getAvailableTimeSlots && selectedDate) {
        return getAvailableTimeSlots(selectedDate)
      }
      return defaultTimeSlots ?? defaultTimeSlotsList
    }, [selectedDate, defaultTimeSlots, getAvailableTimeSlots])

    /* ── Handlers ── */
    const handleDateSelect = (date: Date) => {
      if (disabled) return
      setSelectedDate(date)
      setSelectedTime(undefined)
      onChange?.(undefined)
    }

    const handleTimeSelect = (time: string) => {
      if (disabled || !selectedDate) return
      setSelectedTime(time)
      onChange?.({ date: selectedDate, time })
    }

    const handleConfirm = () => {
      if (selectedDate && selectedTime) {
        onConfirm?.({ date: selectedDate, time: selectedTime })
      }
    }

    const getConfirmationMessage = () => {
      if (!selectedDate || !selectedTime) return null
      if (bookingMessage) {
        return bookingMessage({ date: selectedDate, time: selectedTime }, meetingDurationMinutes)
      }
      return `Your meeting is booked for ${confirmDateFormatter.format(selectedDate)} at ${selectedTime} (${meetingDurationMinutes} min).`
    }

    const isComplete = selectedDate && selectedTime

    return (
      <div
        ref={ref}
        className={cn(
          appointmentPickerRoot,
          appointmentPickerSizeStyles[size],
          appointmentPickerColorStyles[color],
          'w-min rounded-lg overflow-hidden',
          disabled && appointmentPickerRootDisabled,
          className,
        )}
      >
        {/* Title bar */}
        {title && (
          <div className={cn('flex justify-center border-b', appointmentPickerFooterPadding)}>
            <h3 className={cn(appointmentPickerTitle, 'font-semibold')}>{title}</h3>
          </div>
        )}

        {/* Main content: Calendar + Time Slots */}
        <div className="flex gap-2">
          {/* Calendar panel — props passed through */}
          <div className="shrink-0 p-3">
            <DateCalendarPanel
              value={selectedDate}
              onChange={handleDateSelect}
              minValue={minDate}
              maxValue={maxDate}
              disabledDates={disabledDates}
              isDisabled={disabled}
              size={size}
              color={color}
              radius={radius}
            />
          </div>

          {/* Time slots */}
          <div
            className={cn('shrink-0 border-l', !timeSlotWidth && appointmentPickerSlotWidth)}
            style={timeSlotWidth ? { width: timeSlotWidth } : undefined}
          >
            <ScrollArea
              size="xs"
              thickness="thin"
              surfaceColor="neutral"
              className={!timeSlotHeight ? appointmentPickerSlotHeight : undefined}
              style={timeSlotHeight ? { height: timeSlotHeight } : undefined}
            >
              <div className={appointmentPickerSlotContainer}>
                {availableSlots.map(slot => {
                  const isSelected = selectedTime === slot.time
                  const isSlotDisabled = slot.available === false

                  return (
                    <Button
                      key={slot.time}
                      onClick={() => !isSlotDisabled && handleTimeSelect(slot.time)}
                      disabled={disabled || isSlotDisabled || !selectedDate}
                      variant={isSelected ? 'solid' : 'outline'}
                      size={mapDateSizeToButtonSize(size)}
                      color={isSelected ? color : undefined}
                      className={cn(
                        'w-full shadow-none',
                        appointmentPickerSlotGap,
                        !isSelected && 'hover:!bg-[var(--appt-slot-soft)] hover:!text-foreground',
                        isSlotDisabled && 'line-through opacity-50 cursor-not-allowed',
                        !selectedDate && 'opacity-50 cursor-not-allowed',
                      )}
                      style={{ display: 'flex' }}
                    >
                      {slot.label ?? slot.time}
                    </Button>
                  )
                })}
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Footer */}
        {(showConfirmation || showConfirmButton) && (
          <div className={cn('flex flex-col gap-4 border-t md:flex-row', appointmentPickerFooterPadding)}>
            {showConfirmation && (
              <div className="flex flex-1 items-center gap-2">
                {isComplete && (
                  <>
                    <CircleCheckIcon
                      className={appointmentPickerCheckIcon}
                      style={{ color: 'var(--color-success-primary)', marginRight: '0.5rem' }}
                    />
                    <span className={appointmentPickerFooterText}>{getConfirmationMessage()}</span>
                  </>
                )}
              </div>
            )}
            {showConfirmButton && (
              <Button
                variant="outline"
                size={mapDateSizeToButtonSize(size)}
                onClick={handleConfirm}
                disabled={disabled || !isComplete}
                className="w-full md:ml-auto md:w-auto"
              >
                {confirmText}
              </Button>
            )}
          </div>
        )}
      </div>
    )
  },
)

AppointmentPicker.displayName = 'AppointmentPicker'
