import { getDefaultValues, type ParsedField, parseSchema, removeEmptyValues } from '@incmix/core'
import { useEffect } from 'react'
import { type DefaultValues, FormProvider, useForm } from 'react-hook-form'
import { AutoFormField } from './AutoFormField'
import { AutoFormProvider } from './context'
import type { AutoFormProps } from './types'

export function AutoForm<T extends Record<string, unknown>>({
  schema,
  onSubmit = () => {},
  defaultValues,
  values,
  children,
  uiComponents,
  formComponents,
  withSubmit = false,
  onFormInit = () => {},
  formProps = {},
}: AutoFormProps<T>) {
  const parsedSchema = parseSchema(schema)
  const methods = useForm<T>({
    defaultValues: {
      ...(getDefaultValues(schema) as Partial<T>),
      ...defaultValues,
    } as DefaultValues<T>,
    values: values as T,
  })

  useEffect(() => {
    if (onFormInit) {
      onFormInit(methods)
    }
  }, [onFormInit, methods])

  const handleSubmit = async (dataRaw: T) => {
    const data = removeEmptyValues(dataRaw)
    const validationResult = schema.validateSchema(data as T)
    if (validationResult.success) {
      await onSubmit(validationResult.data as T, methods)
    } else {
      methods.clearErrors()
      let isFocused: boolean = false
      for (const error of validationResult.errors || []) {
        const path = error.path.join('.')
        methods.setError(
          path as any,
          {
            type: 'custom',
            message: error.message,
          },
          { shouldFocus: !isFocused },
        )

        isFocused = true

        // Some schema adapters repeat the final path segment for custom errors.
        const correctedPath = error.path?.slice?.(0, -1)
        if (correctedPath?.length > 0) {
          methods.setError(correctedPath.join('.') as any, {
            type: 'custom',
            message: error.message,
          })
        }
      }
    }
  }

  return (
    <FormProvider {...methods}>
      <AutoFormProvider
        value={{
          schema: parsedSchema,
          uiComponents,
          formComponents,
        }}
      >
        <uiComponents.Form onSubmit={methods.handleSubmit(handleSubmit)} {...formProps}>
          {parsedSchema.fields.map((field: ParsedField) => (
            <AutoFormField key={field.key} field={field} path={[field.key]} />
          ))}
          {withSubmit && <uiComponents.SubmitButton>Submit</uiComponents.SubmitButton>}
          {children}
        </uiComponents.Form>
      </AutoFormProvider>
    </FormProvider>
  )
}
