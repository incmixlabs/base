import { getLabel, type ParsedField } from '@bwalkt/core'
import type React from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { ArrayField } from './ArrayField'
import { useAutoForm } from './context'
import { ObjectField } from './ObjectField'
import type { AutoFormFieldProps } from './types'
import { getPathInObject } from './utils'

export const AutoFormField: React.FC<{
  field: ParsedField
  path: string[]
}> = ({ field, path }) => {
  const { formComponents, uiComponents } = useAutoForm()
  const {
    register,
    formState: { errors },
    control,
  } = useFormContext()

  const fullPath = path.join('.')
  const error = getPathInObject(errors, path)?.message as string | undefined
  const value = useWatch({ control, name: fullPath })

  const FieldWrapper = field.fieldConfig?.fieldWrapper || uiComponents.FieldWrapper

  let FieldComponent: React.ComponentType<AutoFormFieldProps> = () => (
    <uiComponents.ErrorMessage
      error={`[AutoForm Configuration Error] No component found for type "${field.type}" nor a fallback`}
    />
  )

  if (field.type === 'array') {
    FieldComponent = ArrayField
  } else if (field.type === 'object') {
    FieldComponent = ObjectField
  } else if (field.type in formComponents) {
    const component = formComponents[field.type as keyof typeof formComponents]
    if (component) {
      FieldComponent = component
    }
  } else if ('fallback' in formComponents) {
    FieldComponent = formComponents.fallback
  }

  return (
    <FieldWrapper label={getLabel(field)} error={error} id={fullPath} field={field}>
      <FieldComponent
        label={getLabel(field)}
        field={field}
        value={value}
        error={error}
        id={fullPath}
        key={fullPath}
        path={path}
        inputProps={{
          required: field.required,
          error: error,
          key: `${fullPath}-input`,
          ...field.fieldConfig?.inputProps,
          ...register(fullPath),
        }}
      />
    </FieldWrapper>
  )
}
