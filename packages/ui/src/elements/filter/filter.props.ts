import type * as React from 'react'
import type { AvatarListItem } from '@/elements/avatar/avatar-list.props'
import type { DateRangeValue } from '@/form/date'

export type FilterOperator =
  | 'contains'
  | 'equals'
  | 'startsWith'
  | 'includesAny'
  | 'includesAll'
  | 'between'
  | 'greaterThan'
  | 'lessThan'
  | 'before'
  | 'after'

export type FilterStateItem = {
  id: string
  operator?: FilterOperator
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
export type FilterFieldType = 'checkbox' | 'select' | 'input' | 'number' | 'slider' | 'avatar-list' | 'calendar'
export type FilterCalendarDisplay = 'mini' | 'full'
export type FilterCalendarMode = 'single' | 'multiple' | 'range'
export type FilterCalendarValue = Date | Date[] | DateRangeValue
export type FilterNumberValue = number | [number | undefined, number | undefined]

/** Shared base for all filter field types */
export type FilterFieldBase<TData> = {
  id: (keyof TData & string) | string
  label: string
  description?: React.ReactNode
  defaultOpen?: boolean
  operators?: FilterOperator[]
  defaultOperator?: FilterOperator
}

/** Declarative filter field configuration (discriminated union by `type`) */
export type FilterField<TData> =
  | (FilterFieldBase<TData> & { type: 'checkbox'; options?: FilterOption[] })
  | (FilterFieldBase<TData> & { type: 'select'; options?: FilterOption[]; placeholder?: string })
  | (FilterFieldBase<TData> & { type: 'input'; placeholder?: string })
  | (FilterFieldBase<TData> & {
      type: 'number'
      min?: number
      max?: number
      step?: number
      allowDecimal?: boolean
      placeholder?: string
    })
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

export type FilterJsonSchemaEnumValue = string | number | boolean | null
export type FilterJsonSchemaType = 'string' | 'number' | 'integer' | 'boolean' | 'array' | 'object' | 'null'

export type FilterJsonSchemaEnumOption = {
  const?: FilterJsonSchemaEnumValue
  enum?: FilterJsonSchemaEnumValue[]
  title?: string
  description?: string
}

export type FilterJsonSchemaProperty = {
  type?: FilterJsonSchemaType | FilterJsonSchemaType[]
  title?: string
  description?: string
  enum?: FilterJsonSchemaEnumValue[]
  enumNames?: string[]
  oneOf?: FilterJsonSchemaEnumOption[]
  anyOf?: FilterJsonSchemaEnumOption[]
  items?: FilterJsonSchemaProperty
  format?: 'date' | 'date-time' | 'time' | 'email' | 'uri' | string
  minimum?: number
  maximum?: number
  exclusiveMinimum?: number | boolean
  exclusiveMaximum?: number | boolean
  multipleOf?: number
  readOnly?: boolean
  writeOnly?: boolean
  'x-filter'?: boolean | FilterSchemaFieldOverride<unknown>
  'x-filter-hidden'?: boolean
  'x-filter-order'?: number
}

export type FilterJsonSchema = {
  type?: 'object' | string
  title?: string
  description?: string
  properties?: Record<string, FilterJsonSchemaProperty>
  required?: string[]
}

export type FilterSchemaFieldOverride<TData> = {
  label?: string
  description?: React.ReactNode
  hidden?: boolean
  order?: number
  type?: FilterFieldType
  defaultOpen?: boolean
  operators?: FilterOperator[]
  defaultOperator?: FilterOperator
  options?: FilterOption[]
  placeholder?: string
  min?: number
  max?: number
  step?: number
  allowDecimal?: boolean
  calendarDisplay?: FilterCalendarDisplay
  calendarMode?: FilterCalendarMode
  field?: Partial<FilterField<TData>>
}

export type FilterSchemaOptions<TData> = {
  include?: string[]
  exclude?: string[]
  fields?: Record<string, FilterSchemaFieldOverride<TData>>
}

export const filterOperatorLabels: Record<FilterOperator, string> = {
  contains: 'Contains',
  equals: 'Equals',
  startsWith: 'Starts with',
  includesAny: 'Includes any',
  includesAll: 'Includes all',
  between: 'Between',
  greaterThan: 'Greater than',
  lessThan: 'Less than',
  before: 'Before',
  after: 'After',
}
