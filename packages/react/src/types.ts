import type {
  FieldConfig as BaseFieldConfig,
  ParsedField,
  ParsedSchema,
  Renderable,
  SchemaProvider,
} from '@bwalkt/core'
import type { ReactNode } from 'react'
import type { FieldValues, UseFormReturn } from 'react-hook-form'

export interface AutoFormProps<T extends FieldValues> {
  schema: SchemaProvider<T>
  onSubmit?: (values: T, form: UseFormReturn<T, unknown, T>) => void | Promise<void>

  defaultValues?: Partial<T>
  values?: Partial<T>

  children?: ReactNode
  uiComponents: AutoFormUIComponents
  formComponents: AutoFormFieldComponents
  withSubmit?: boolean
  onFormInit?: (form: UseFormReturn<T, unknown, T>) => void
  formProps?: React.ComponentProps<'form'> | Record<string, unknown>
}

export type ExtendableAutoFormProps<T extends FieldValues> = Omit<
  AutoFormProps<T>,
  'uiComponents' | 'formComponents'
> & {
  uiComponents?: Partial<AutoFormUIComponents>
  formComponents?: Partial<AutoFormFieldComponents>
}

export interface AutoFormUIComponents {
  Form: React.ComponentType<React.ComponentProps<'form'>>
  FieldWrapper: React.ComponentType<FieldWrapperProps>
  ErrorMessage: React.ComponentType<{ error: string }>
  SubmitButton: React.ComponentType<{ children: ReactNode }>
  ObjectWrapper: React.ComponentType<ObjectWrapperProps>
  ArrayWrapper: React.ComponentType<ArrayWrapperProps>
  ArrayElementWrapper: React.ComponentType<ArrayElementWrapperProps>
}

export interface AutoFormFieldComponents {
  [key: string]: React.ComponentType<AutoFormFieldProps>
}

export interface FieldWrapperProps {
  label: Renderable<ReactNode>
  error?: Renderable<ReactNode>
  children: ReactNode
  id: string
  field: ParsedField
}

export interface ArrayWrapperProps {
  label: Renderable<ReactNode>
  children: ReactNode
  field: ParsedField
  onAddItem: () => void
}

export interface ArrayElementWrapperProps {
  children: ReactNode
  onRemove: () => void
  index: number
}

export interface ObjectWrapperProps {
  label: Renderable<ReactNode>
  children: ReactNode
  field: ParsedField
}

export interface AutoFormFieldProps {
  label: Renderable<ReactNode>
  field: ParsedField
  value: unknown
  error?: string
  id: string
  path: string[]
  inputProps: Record<string, unknown>
}

export interface AutoFormContextType {
  schema: ParsedSchema
  uiComponents: AutoFormUIComponents
  formComponents: AutoFormFieldComponents
}

export type FieldConfig<FieldTypes = string, CustomData = Record<string, unknown>> = BaseFieldConfig<
  ReactNode,
  FieldTypes,
  React.ComponentType<FieldWrapperProps>,
  CustomData
>
