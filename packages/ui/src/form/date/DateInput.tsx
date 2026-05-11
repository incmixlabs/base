'use client'

import { DatePicker, type DatePickerProps } from './DatePicker'

export interface DateInputProps extends Omit<DatePickerProps, 'entryMode'> {
  entryMode?: 'text' | 'natural'
}

function getDateInputMask(dateFormat: string): DatePickerProps['inputMask'] | undefined {
  if (dateFormat === 'MM/dd/yyyy') return 'date'
  if (dateFormat === 'yyyy-MM-dd') return 'dateISO'
  return undefined
}

/** Calendar-backed text date input. */
export function DateInput({
  entryMode,
  enableNaturalLanguage,
  dateFormat = 'yyyy-MM-dd',
  inputMask,
  maskOptions,
  ...props
}: DateInputProps) {
  const resolvedEntryMode = entryMode ?? (enableNaturalLanguage ? 'natural' : 'text')
  const resolvedInputMask = inputMask ?? (resolvedEntryMode === 'text' ? getDateInputMask(dateFormat) : undefined)

  return (
    <DatePicker
      {...props}
      entryMode={resolvedEntryMode}
      enableNaturalLanguage={enableNaturalLanguage}
      dateFormat={dateFormat}
      inputMask={resolvedInputMask}
      maskOptions={maskOptions ?? (resolvedInputMask ? { clearIncomplete: false } : undefined)}
    />
  )
}
