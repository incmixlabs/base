'use client'

import * as React from 'react'
import { DatePicker, type DatePickerProps } from './DatePicker'

export interface DateInputProps extends Omit<DatePickerProps, 'entryMode' | 'inputRef'> {
  entryMode?: 'text' | 'natural'
}

function getDateInputMask(dateFormat: string): DatePickerProps['inputMask'] | undefined {
  if (dateFormat === 'MM/dd/yyyy') return 'date'
  if (dateFormat === 'yyyy-MM-dd') return 'dateISO'
  return undefined
}

/** Calendar-backed text date input. */
export const DateInput = React.forwardRef<HTMLInputElement, DateInputProps>(function DateInput(
  { entryMode, enableNaturalLanguage, dateFormat = 'yyyy-MM-dd', inputMask, maskOptions, ...props },
  ref,
) {
  const resolvedEntryMode = entryMode ?? (enableNaturalLanguage ? 'natural' : 'text')
  const resolvedInputMask = inputMask ?? (resolvedEntryMode === 'text' ? getDateInputMask(dateFormat) : undefined)

  return (
    <DatePicker
      {...props}
      inputRef={ref}
      entryMode={resolvedEntryMode}
      enableNaturalLanguage={enableNaturalLanguage}
      dateFormat={dateFormat}
      inputMask={resolvedInputMask}
      maskOptions={maskOptions ?? (resolvedInputMask ? { clearIncomplete: false } : undefined)}
    />
  )
})

DateInput.displayName = 'DateInput'
