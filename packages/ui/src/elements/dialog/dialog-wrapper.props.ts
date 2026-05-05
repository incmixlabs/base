import type { FieldErrorMap, JsonSchemaNode, JsonValue } from '@incmix/core'
import type * as React from 'react'
import type { DialogContentAlign, DialogContentSize } from './dialog.props'

export type DialogWrapperSchemaProperty = {
  type: 'string' | 'number' | 'integer' | 'boolean'
  title?: string
  description?: string
  default?: string | number | boolean
  enum?: string[]
  format?: 'email' | 'password' | 'url' | 'textarea'
  placeholder?: string
  minimum?: number
  maximum?: number
  multipleOf?: number
  minLength?: number
  maxLength?: number
  pattern?: string
  readOnly?: boolean
  widget?: string
  widgetProps?: Record<string, JsonValue>
}

export type DialogWrapperSchema = {
  type: 'object'
  title?: string
  description?: string
  required?: string[]
  properties: Record<string, DialogWrapperSchemaProperty>
}

export type DialogWrapperRenderFieldArgs = {
  name: string
  schema: DialogWrapperSchemaProperty
  value: unknown
  required: boolean
  error?: string
  describedBy?: string
  onChange: (value: unknown) => void
}

export type DialogWrapperSubmitHelpers = {
  setServerErrors: (errors: FieldErrorMap, formErrors?: string[]) => void
  setFormErrors: (formErrors: string[]) => void
  clearServerErrors: () => void
}

export type DialogWrapperRenderFooterArgs = {
  submitting: boolean
  values: Record<string, unknown>
  close: () => void
}

export type DialogWrapperProps = {
  schema: DialogWrapperSchema
  trigger?: React.ReactNode
  submitLabel?: React.ReactNode
  cancelLabel?: React.ReactNode
  showCancel?: boolean
  closeOnSubmit?: boolean
  submitting?: boolean
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onCancel?: () => void
  values?: Record<string, unknown>
  defaultValues?: Record<string, unknown>
  onValuesChange?: (values: Record<string, unknown>) => void
  validationSchema?: JsonSchemaNode
  validateOnChange?: boolean
  submitErrorMessage?: string
  onSubmitError?: (error: unknown) => void
  size?: DialogContentSize
  align?: DialogContentAlign
  className?: string
  bodyClassName?: string
  renderField?: (args: DialogWrapperRenderFieldArgs, defaultRender: React.ReactNode) => React.ReactNode
  renderFooter?: (args: DialogWrapperRenderFooterArgs, defaultRender: React.ReactNode) => React.ReactNode
  onSubmit?: (
    values: Record<string, unknown>,
    helpers: DialogWrapperSubmitHelpers,
    runtime: {
      errors: Record<string, string[]>
      formErrors: string[]
      submitCount: number
      isSubmitting: boolean
      isValid: boolean
    },
  ) => void | Promise<void>
}
