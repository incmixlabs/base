'use client'

import { startOfMonth } from 'date-fns'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Button } from '@/elements/button/Button'
import type { WheelPickerOption } from '@/elements/wheel-picker/wheel-picker'
import { WheelPicker, WheelPickerWrapper } from '@/elements/wheel-picker/wheel-picker'
import { Flex } from '@/layouts/flex/Flex'
import { KEYBOARD_KEYS } from '@/lib/keyboard-keys'
import { semanticColorVar } from '@/theme/props/color.prop'
import type { Color } from '@/theme/tokens'
import { type DateSize, dateCalendarDaySizeBySize, dateControlFontSizeBySize, dateHeaderGapBySize } from './date.props'
import { buttonSizeByDateSize } from './time-wheel-utils'

function buildMonthOptions(
  localeCode: string,
  year: number,
  startMonth?: Date,
  endMonth?: Date,
): WheelPickerOption<number>[] {
  const formatter = new Intl.DateTimeFormat(localeCode, { month: 'long' })
  const minMonth = startMonth && year === startMonth.getFullYear() ? startMonth.getMonth() : 0
  const maxMonth = endMonth && year === endMonth.getFullYear() ? endMonth.getMonth() : 11

  return Array.from({ length: 12 }, (_, index) => ({
    value: index,
    label: formatter.format(new Date(2000, index, 1)),
    disabled: index < minMonth || index > maxMonth,
  }))
}

function buildYearOptions(startYear: number, endYear: number): WheelPickerOption<number>[] {
  const options: WheelPickerOption<number>[] = []
  for (let year = startYear; year <= endYear; year += 1) {
    options.push({ value: year, label: String(year) })
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

export interface MonthYearPickerProps {
  /** Current display month. */
  displayMonth: Date
  /** Called with the resolved start-of-month Date when user confirms. */
  onApply: (month: Date) => void
  /** Called when user cancels or clicks outside. */
  onClose: () => void
  /** Ref to the trigger element for focus restoration on close. */
  triggerRef?: React.RefObject<HTMLElement | null>
  /** Locale for month name formatting. */
  locale: string
  /** Minimum selectable month. */
  minValue?: Date
  /** Maximum selectable month. */
  maxValue?: Date
  /** Size variant — controls width, font size, and top offset. */
  size?: DateSize
  /** Color variant — controls highlight and button colors. */
  color?: Color
}

/** Inline month/year wheel-picker dialog. */
export function MonthYearPicker({
  displayMonth,
  onApply,
  onClose,
  triggerRef,
  locale,
  minValue,
  maxValue,
  size = 'md',
  color = 'slate',
}: MonthYearPickerProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null)

  const closeAndRestoreFocus = useCallback(() => {
    onClose()
    triggerRef?.current?.focus()
  }, [onClose, triggerRef])

  const minMonthBound = minValue ? startOfMonth(minValue) : undefined
  const maxMonthBound = maxValue ? startOfMonth(maxValue) : undefined

  const [pickerMonth, setPickerMonth] = useState(displayMonth.getMonth())
  const [pickerYear, setPickerYear] = useState(displayMonth.getFullYear())
  const snapshotRef = useRef({ month: displayMonth.getMonth(), year: displayMonth.getFullYear() })

  const rawStartYear = minMonthBound?.getFullYear() ?? displayMonth.getFullYear() - 100
  const rawEndYear = maxMonthBound?.getFullYear() ?? displayMonth.getFullYear() + 100
  const startYear = Math.min(rawStartYear, rawEndYear)
  const endYear = Math.max(rawStartYear, rawEndYear)

  const monthOptions = buildMonthOptions(locale, pickerYear, minMonthBound, maxMonthBound)
  const yearOptions = buildYearOptions(startYear, endYear)

  const handleMonthChange = (value: number) => {
    const clamped = clampMonth(value, pickerYear, minMonthBound, maxMonthBound)
    setPickerMonth(clamped)
  }

  const handleYearChange = (value: number) => {
    setPickerYear(value)
    setPickerMonth(prev => clampMonth(prev, value, minMonthBound, maxMonthBound))
  }

  const handleApply = () => {
    onApply(startOfMonth(new Date(pickerYear, pickerMonth, 1)))
    closeAndRestoreFocus()
  }

  const handleCancel = () => {
    const snap = snapshotRef.current
    onApply(startOfMonth(new Date(snap.year, snap.month, 1)))
    closeAndRestoreFocus()
  }

  /* ── Keyboard: Escape closes ── */
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === KEYBOARD_KEYS.escape) {
        event.stopPropagation()
        closeAndRestoreFocus()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [closeAndRestoreFocus])

  /* ── Focus first element on mount ── */
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    const firstFocusable = dialog.querySelector<HTMLElement>(
      'button:not([disabled]):not([data-focus-guard]), [tabindex]:not([tabindex="-1"]):not([data-focus-guard])',
    )
    firstFocusable?.focus()
  }, [])

  const focusEdge = (edge: 'first' | 'last') => {
    const dialog = dialogRef.current
    if (!dialog) return
    const focusable = Array.from(
      dialog.querySelectorAll<HTMLElement>(
        'button:not([disabled]):not([data-focus-guard]), [tabindex]:not([tabindex="-1"]):not([data-focus-guard])',
      ),
    )
    if (focusable.length === 0) return
    if (edge === 'first') focusable[0]?.focus()
    else focusable[focusable.length - 1]?.focus()
  }

  const cellSize = dateCalendarDaySizeBySize[size]
  const fontSize = dateControlFontSizeBySize[size]
  const gap = dateHeaderGapBySize[size]
  const buttonSize = buttonSizeByDateSize[size]

  return (
    <>
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close month and year picker"
        tabIndex={-1}
        className="absolute inset-0 z-40 cursor-default border-0 bg-transparent p-0"
        onClick={closeAndRestoreFocus}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-label="Select month and year"
        aria-modal="true"
        className="absolute z-50 left-1/2 -translate-x-1/2 overflow-hidden rounded-md border border-border bg-popover p-1 shadow-md"
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
          if (event.key !== KEYBOARD_KEYS.tab) return
          const dialog = event.currentTarget
          const focusable = Array.from(
            dialog.querySelectorAll<HTMLElement>(
              'button:not([disabled]):not([data-focus-guard]), [tabindex]:not([tabindex="-1"]):not([data-focus-guard])',
            ),
          ).filter(el => !el.hasAttribute('disabled'))
          if (focusable.length === 0) return
          const first = focusable[0]
          const last = focusable[focusable.length - 1]
          const active = document.activeElement as HTMLElement | null
          if (!event.shiftKey && (!active || active === last)) {
            event.preventDefault()
            first?.focus()
            return
          }
          if (event.shiftKey && (!active || active === first)) {
            event.preventDefault()
            last?.focus()
          }
        }}
      >
        <button type="button" data-focus-guard tabIndex={0} className="sr-only" onFocus={() => focusEdge('last')} />
        <WheelPickerWrapper
          className="!border-0 !rounded-none !bg-transparent !p-0 !shadow-none"
          style={{ width: `calc(${cellSize} * 6)` }}
        >
          <WheelPicker<number>
            options={monthOptions}
            value={pickerMonth}
            onValueChange={handleMonthChange}
            classNames={{
              highlightWrapper: '!font-semibold',
            }}
          />
          <WheelPicker<number>
            options={yearOptions}
            value={pickerYear}
            onValueChange={handleYearChange}
            classNames={{
              highlightWrapper: '!font-semibold',
            }}
          />
        </WheelPickerWrapper>
        <Flex align="center" justify="center" gap="2" className="border-t border-border" px="2" py="1">
          <Button type="button" variant="ghost" size={buttonSize} onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="button" variant="solid" size={buttonSize} onClick={handleApply}>
            Apply
          </Button>
        </Flex>
        <button type="button" data-focus-guard tabIndex={0} className="sr-only" onFocus={() => focusEdge('first')} />
      </div>
    </>
  )
}
