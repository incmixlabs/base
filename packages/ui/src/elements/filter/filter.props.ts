import type * as React from 'react'
import type { AvatarListItem } from '@/elements/avatar/avatar-list.props'
import type { DateRangeValue } from '@/form/date'

export type FilterStateItem = {
  id: string
  value: unknown
}

export type FilterState = FilterStateItem[]

/** Individual filter option for checkbox-style filters */
export type FilterOption = {
  label: string
  value: string
  count?: number
  icon?: React.ReactNode
}

/** Supported filter field types */
export type FilterFieldType = 'checkbox' | 'input' | 'slider' | 'avatar-list' | 'calendar'
export type FilterCalendarDisplay = 'mini' | 'full'
export type FilterCalendarMode = 'single' | 'multiple' | 'range'
export type FilterCalendarValue = Date | Date[] | DateRangeValue

/** Shared base for all filter field types */
type FilterFieldBase<TData> = {
  id: keyof TData & string
  label: string
  defaultOpen?: boolean
}

/** Declarative filter field configuration (discriminated union by `type`) */
export type FilterField<TData> =
  | (FilterFieldBase<TData> & { type: 'checkbox'; options?: FilterOption[] })
  | (FilterFieldBase<TData> & { type: 'input' })
  | (FilterFieldBase<TData> & { type: 'slider'; min?: number; max?: number; step?: number })
  | (FilterFieldBase<TData> & { type: 'avatar-list'; items: AvatarListItem[] })
  | (FilterFieldBase<TData> & {
      type: 'calendar'
      minDate?: Date
      maxDate?: Date
      display?: FilterCalendarDisplay
      mode?: FilterCalendarMode
    })

/** Filter application behavior */
export type FilterApplyMode = 'immediate' | 'manual'
