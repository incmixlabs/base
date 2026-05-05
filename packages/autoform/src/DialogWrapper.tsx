'use client'

import { Button, Dialog } from '@incmix/ui/elements'
import {
  Checkbox,
  Label,
  NumberInput,
  type NumberInputIconButtonProps,
  Select,
  SelectItem,
  Textarea,
  TextField,
} from '@incmix/ui/form'
import { Flex } from '@incmix/ui/layouts'
import { cn } from '@incmix/ui/lib/utils'
import * as React from 'react'
import { Controller, type FieldError, type FieldErrors, type Resolver, useForm, useWatch } from 'react-hook-form'
import type {
  DialogWrapperFieldErrorMap,
  DialogWrapperProps,
  DialogWrapperSchema,
  DialogWrapperSchemaProperty,
  DialogWrapperSubmitHelpers,
} from './dialog-wrapper.props'

export type {
  DialogWrapperFieldErrorMap,
  DialogWrapperJsonValue,
  DialogWrapperProps,
  DialogWrapperRenderFieldArgs,
  DialogWrapperRenderFooterArgs,
  DialogWrapperSchema,
  DialogWrapperSchemaProperty,
  DialogWrapperSubmitHelpers,
} from './dialog-wrapper.props'

function hasOwnKey(object: unknown, key: PropertyKey): boolean {
  return object !== null && object !== undefined && Object.hasOwn(Object(object), key)
}

function getInitialValues(schema: DialogWrapperSchema, defaultValues?: Record<string, unknown>) {
  const values: Record<string, unknown> = {}

  for (const [name, property] of Object.entries(schema.properties)) {
    if (defaultValues && hasOwnKey(defaultValues, name)) {
      values[name] = defaultValues[name]
      continue
    }

    if (property.default !== undefined) {
      values[name] = property.default
      continue
    }

    if (property.type === 'boolean') {
      values[name] = false
      continue
    }

    values[name] = schema.required?.includes(name) ? '' : undefined
  }

  return values
}

function normalizeDialogFieldValue(
  property: DialogWrapperSchemaProperty,
  nextValue: unknown,
  required: boolean,
): unknown {
  if (property.type === 'boolean') return Boolean(nextValue)

  if (property.type === 'integer' || property.type === 'number') {
    return nextValue === '' && !required ? undefined : nextValue
  }

  if (typeof nextValue === 'string' && nextValue === '' && !required) {
    return undefined
  }

  return nextValue
}

function normalizeDialogValues(
  schema: DialogWrapperSchema,
  values: Record<string, unknown> | undefined,
): Record<string, unknown> | undefined {
  if (!values) return values

  const required = new Set(schema.required ?? [])
  const nextValues: Record<string, unknown> = {}

  for (const [name, value] of Object.entries(values)) {
    const property = schema.properties[name]
    nextValues[name] = property ? normalizeDialogFieldValue(property, value, required.has(name)) : value
  }

  return nextValues
}

type DialogWrapperRuntimeValues = Record<string, unknown>

type DialogWrapperRuntimeSnapshot = {
  values: DialogWrapperRuntimeValues
  errors: DialogWrapperFieldErrorMap
  formErrors: string[]
  submitCount: number
  isSubmitting: boolean
  isValid: boolean
}

function mergeFieldErrors(...maps: DialogWrapperFieldErrorMap[]): DialogWrapperFieldErrorMap {
  const merged: DialogWrapperFieldErrorMap = {}

  for (const map of maps) {
    for (const [path, messages] of Object.entries(map)) {
      merged[path] = [...(merged[path] ?? []), ...messages]
    }
  }

  return merged
}

function hasFieldErrors(errors: DialogWrapperFieldErrorMap) {
  return Object.keys(errors).length > 0
}

function isDialogWrapperSnapshotValid(errors: DialogWrapperFieldErrorMap, formErrors: string[]) {
  return Object.keys(errors).length === 0 && formErrors.length === 0
}

function toDialogRuntimeSnapshot({
  values,
  errors,
  formErrors,
  submitCount,
  isSubmitting,
}: {
  values: DialogWrapperRuntimeValues
  errors: DialogWrapperFieldErrorMap
  formErrors: string[]
  submitCount: number
  isSubmitting: boolean
}): DialogWrapperRuntimeSnapshot {
  return {
    values,
    errors,
    formErrors,
    submitCount,
    isSubmitting,
    isValid: isDialogWrapperSnapshotValid(errors, formErrors),
  }
}

function clearDialogWrapperServerError(
  serverErrors: DialogWrapperFieldErrorMap,
  path: string,
): DialogWrapperFieldErrorMap {
  return Object.fromEntries(Object.entries(serverErrors).filter(([key]) => key !== path && !key.startsWith(`${path}.`)))
}

function normalizeFieldErrorMap(errors: DialogWrapperFieldErrorMap): DialogWrapperFieldErrorMap {
  const normalized: DialogWrapperFieldErrorMap = {}

  for (const [path, messages] of Object.entries(errors)) {
    const nextMessages = messages.filter(Boolean)
    if (nextMessages.length === 0) continue
    normalized[path] = [...(normalized[path] ?? []), ...nextMessages]
  }

  return normalized
}

function toHookFormErrors(errors: DialogWrapperFieldErrorMap): FieldErrors<DialogWrapperRuntimeValues> {
  const hookFormErrors: Record<string, FieldError> = {}

  for (const [path, messages] of Object.entries(errors)) {
    const message = messages[0]
    if (!message) continue
    hookFormErrors[path] = { type: 'validate', message }
  }

  return hookFormErrors as FieldErrors<DialogWrapperRuntimeValues>
}

function getHookFormErrorMessages(error: unknown): string[] {
  if (!isPlainObject(error)) return []

  const messages: string[] = []
  if (typeof error.message === 'string') {
    messages.push(error.message)
  }

  if (isPlainObject(error.types)) {
    for (const value of Object.values(error.types)) {
      if (typeof value === 'string') {
        messages.push(value)
      }
      if (Array.isArray(value)) {
        messages.push(...value.filter((item): item is string => typeof item === 'string'))
      }
    }
  }

  return messages
}

function toDialogWrapperFieldErrors(errors: FieldErrors<DialogWrapperRuntimeValues>): DialogWrapperFieldErrorMap {
  const fieldErrors: DialogWrapperFieldErrorMap = {}

  for (const [path, error] of Object.entries(errors)) {
    const messages = getHookFormErrorMessages(error)
    if (messages.length > 0) {
      fieldErrors[path] = messages
    }
  }

  return fieldErrors
}

function createDialogWrapperResolver(schema: DialogWrapperSchema): Resolver<DialogWrapperRuntimeValues> {
  return async values => {
    const normalizedValues = normalizeDialogValues(schema, values) ?? {}
    const errors = validateDialogWrapperValues(schema, normalizedValues)

    if (hasFieldErrors(errors)) {
      return {
        values: {},
        errors: toHookFormErrors(errors),
      }
    }

    return {
      values: normalizedValues,
      errors: {},
    }
  }
}

function addValidationError(errors: DialogWrapperFieldErrorMap, path: string, message: string) {
  errors[path] = [...(errors[path] ?? []), message]
}

function validateDialogWrapperValues(
  schema: DialogWrapperSchema,
  values: DialogWrapperRuntimeValues,
): DialogWrapperFieldErrorMap {
  const errors: DialogWrapperFieldErrorMap = {}
  const required = new Set(schema.required ?? [])

  for (const [path, property] of Object.entries(schema.properties)) {
    const value = values[path]
    const isMissing = value === undefined || value === null || value === ''

    if (required.has(path) && isMissing) {
      addValidationError(errors, path, 'must have required property')
      continue
    }

    if (isMissing) continue

    if (property.const !== undefined && value !== property.const) {
      addValidationError(errors, path, 'must be equal to constant')
      continue
    }

    if (property.enum?.length && typeof value === 'string' && !property.enum.includes(value)) {
      addValidationError(errors, path, 'must be equal to one of the allowed values')
    }

    if (property.type === 'string') {
      if (typeof value !== 'string') {
        addValidationError(errors, path, 'must be string')
        continue
      }
      validateStringDialogValue(errors, path, property, value)
      continue
    }

    if (property.type === 'integer' || property.type === 'number') {
      if (typeof value !== 'number' || Number.isNaN(value)) {
        addValidationError(errors, path, property.type === 'integer' ? 'must be integer' : 'must be number')
        continue
      }
      if (property.type === 'integer' && !Number.isInteger(value)) {
        addValidationError(errors, path, 'must be integer')
      }
      if (property.minimum !== undefined && value < property.minimum) {
        addValidationError(errors, path, `must be >= ${property.minimum}`)
      }
      if (property.maximum !== undefined && value > property.maximum) {
        addValidationError(errors, path, `must be <= ${property.maximum}`)
      }
      continue
    }

    if (property.type === 'boolean' && typeof value !== 'boolean') {
      addValidationError(errors, path, 'must be boolean')
    }
  }

  return errors
}

function validateStringDialogValue(
  errors: DialogWrapperFieldErrorMap,
  path: string,
  property: DialogWrapperSchemaProperty,
  value: string,
) {
  if (property.minLength !== undefined && value.length < property.minLength) {
    addValidationError(errors, path, `must NOT have fewer than ${property.minLength} characters`)
  }
  if (property.maxLength !== undefined && value.length > property.maxLength) {
    addValidationError(errors, path, `must NOT have more than ${property.maxLength} characters`)
  }
  if (property.pattern) {
    try {
      if (!new RegExp(property.pattern).test(value)) {
        addValidationError(errors, path, `must match pattern "${property.pattern}"`)
      }
    } catch {
      addValidationError(errors, path, `invalid pattern "${property.pattern}"`)
    }
  }
  if (property.format === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    addValidationError(errors, path, 'must match format "email"')
  }
  if (property.format === 'url') {
    try {
      new URL(value)
    } catch {
      addValidationError(errors, path, 'must match format "url"')
    }
  }
}

function isTextareaField(property: DialogWrapperSchemaProperty) {
  return property.format === 'textarea'
}

function getInputType(property: DialogWrapperSchemaProperty) {
  if (property.type === 'integer' || property.type === 'number') return 'number'
  if (property.format === 'email') return 'email'
  if (property.format === 'password') return 'password'
  if (property.format === 'url') return 'url'
  return 'text'
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function getNumberInputProps(property: DialogWrapperSchemaProperty): Partial<React.ComponentProps<typeof NumberInput>> {
  const props = isPlainObject(property.widgetProps) ? property.widgetProps : undefined
  const iconButton = props && isPlainObject(props.iconButton) ? props.iconButton : undefined

  return {
    variant: props?.variant === 'button' || props?.variant === 'icon' ? props.variant : undefined,
    step: typeof props?.step === 'number' && Number.isFinite(props.step) ? props.step : property.multipleOf,
    min: typeof props?.min === 'number' && Number.isFinite(props.min) ? props.min : property.minimum,
    max: typeof props?.max === 'number' && Number.isFinite(props.max) ? props.max : property.maximum,
    allowDecimal: typeof props?.allowDecimal === 'boolean' ? props.allowDecimal : property.type !== 'integer',
    iconButton: getDialogNumberInputIconButtonProps(iconButton),
  }
}

function getDialogNumberInputIconButtonProps(
  value: Record<string, unknown> | undefined,
): NumberInputIconButtonProps | undefined {
  if (!value) return undefined

  return {
    className: typeof value.className === 'string' ? value.className : undefined,
    color: isNumberInputIconButtonColor(value.color) ? value.color : undefined,
    highContrast: typeof value.highContrast === 'boolean' ? value.highContrast : undefined,
    radius: isNumberInputIconButtonRadius(value.radius) ? value.radius : undefined,
    size:
      value.size === 'xs' || value.size === 'sm' || value.size === 'md' || value.size === 'lg' || value.size === 'xl'
        ? value.size
        : undefined,
    title: typeof value.title === 'string' ? value.title : undefined,
    variant:
      value.variant === 'solid' || value.variant === 'soft' || value.variant === 'outline' || value.variant === 'ghost'
        ? value.variant
        : undefined,
  }
}

function isNumberInputIconButtonColor(value: unknown): value is NumberInputIconButtonProps['color'] {
  return (
    value === 'light' ||
    value === 'slate' ||
    value === 'primary' ||
    value === 'secondary' ||
    value === 'accent' ||
    value === 'neutral' ||
    value === 'info' ||
    value === 'success' ||
    value === 'warning' ||
    value === 'error' ||
    value === 'inverse' ||
    value === 'dark'
  )
}

function isNumberInputIconButtonRadius(value: unknown): value is NumberInputIconButtonProps['radius'] {
  return (
    value === 'none' ||
    value === 'xs' ||
    value === 'sm' ||
    value === 'md' ||
    value === 'lg' ||
    value === 'xl' ||
    value === 'full'
  )
}

function renderField(
  name: string,
  property: DialogWrapperSchemaProperty,
  value: unknown,
  required: boolean,
  error: string | undefined,
  onChange: (next: unknown) => void,
) {
  const id = `dialog-field-${name}`
  const descriptionId = property.description ? `${id}-description` : undefined
  const errorId = error ? `${id}-error` : undefined
  const describedBy = [descriptionId, errorId].filter(Boolean).join(' ') || undefined
  const label = property.title ?? name
  const description = property.description

  if (property.type === 'boolean') {
    return (
      <Flex direction="column" gap="1">
        <Flex align="center" gap="2">
          <Checkbox
            id={id}
            checked={Boolean(value)}
            disabled={property.readOnly}
            aria-describedby={describedBy}
            aria-invalid={Boolean(error) || undefined}
            onCheckedChange={checked => onChange(Boolean(checked))}
          />
          <Label htmlFor={id}>{label}</Label>
        </Flex>
        {description ? (
          <p id={descriptionId} className="text-xs text-muted-foreground">
            {description}
          </p>
        ) : null}
        {error ? (
          <p id={errorId} className="text-xs text-destructive">
            {error}
          </p>
        ) : null}
      </Flex>
    )
  }

  if (property.enum && property.enum.length > 0) {
    return (
      <Flex direction="column" gap="2">
        <Label htmlFor={id}>{label}</Label>
        <Select
          id={id}
          value={typeof value === 'string' ? value : ''}
          disabled={property.readOnly}
          error={Boolean(error)}
          aria-describedby={describedBy}
          aria-invalid={Boolean(error) || undefined}
          placeholder={property.placeholder ?? `Select ${label.toLowerCase()}`}
          onValueChange={next => onChange(next)}
        >
          {property.enum.map(option => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </Select>
        {description ? (
          <p id={descriptionId} className="text-xs text-muted-foreground">
            {description}
          </p>
        ) : null}
        {error ? (
          <p id={errorId} className="text-xs text-destructive">
            {error}
          </p>
        ) : null}
      </Flex>
    )
  }

  if (isTextareaField(property)) {
    return (
      <Flex direction="column" gap="2">
        <Label htmlFor={id}>{label}</Label>
        <Textarea
          id={id}
          value={typeof value === 'string' ? value : ''}
          required={required}
          disabled={property.readOnly}
          error={Boolean(error)}
          aria-describedby={describedBy}
          placeholder={property.placeholder}
          minLength={property.minLength}
          maxLength={property.maxLength}
          onChange={event => onChange(event.target.value)}
        />
        {description ? (
          <p id={descriptionId} className="text-xs text-muted-foreground">
            {description}
          </p>
        ) : null}
        {error ? (
          <p id={errorId} className="text-xs text-destructive">
            {error}
          </p>
        ) : null}
      </Flex>
    )
  }

  const isNumber = property.type === 'integer' || property.type === 'number'

  if (property.widget === 'number-input' && isNumber) {
    const numberInputProps = getNumberInputProps(property)

    return (
      <Flex direction="column" gap="2">
        <Label htmlFor={id}>{label}</Label>
        <NumberInput
          id={id}
          value={typeof value === 'number' ? value : ''}
          required={required}
          disabled={property.readOnly}
          error={Boolean(error)}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={describedBy}
          placeholder={property.placeholder}
          onValueChange={next => onChange(next)}
          {...numberInputProps}
        />
        {description ? (
          <p id={descriptionId} className="text-xs text-muted-foreground">
            {description}
          </p>
        ) : null}
        {error ? (
          <p id={errorId} className="text-xs text-destructive">
            {error}
          </p>
        ) : null}
      </Flex>
    )
  }

  return (
    <Flex direction="column" gap="2">
      <Label htmlFor={id}>{label}</Label>
      <TextField
        id={id}
        type={getInputType(property)}
        value={isNumber ? (value ?? '').toString() : typeof value === 'string' ? value : ''}
        required={required}
        disabled={property.readOnly}
        error={Boolean(error)}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={describedBy}
        placeholder={property.placeholder}
        min={property.minimum}
        max={property.maximum}
        step={property.multipleOf ?? (property.type === 'integer' ? 1 : undefined)}
        minLength={property.minLength}
        maxLength={property.maxLength}
        pattern={property.pattern}
        onChange={event => {
          if (!isNumber) {
            onChange(event.target.value)
            return
          }

          const raw = event.target.value
          if (raw === '') {
            onChange('')
            return
          }
          const parsed = Number(raw)
          onChange(Number.isNaN(parsed) ? '' : parsed)
        }}
      />
      {description ? (
        <p id={descriptionId} className="text-xs text-muted-foreground">
          {description}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="text-xs text-destructive">
          {error}
        </p>
      ) : null}
    </Flex>
  )
}

export function DialogWrapper({
  schema,
  trigger,
  submitLabel = 'Submit',
  cancelLabel = 'Cancel',
  showCancel = true,
  closeOnSubmit = true,
  submitting = false,
  defaultOpen,
  open,
  onOpenChange,
  onSubmit,
  onCancel,
  values,
  defaultValues,
  onValuesChange,
  validateOnChange = true,
  submitErrorMessage = 'Something went wrong. Please try again.',
  onSubmitError,
  size = 'md',
  align = 'center',
  className,
  bodyClassName,
  renderField: renderFieldOverride,
  renderFooter,
}: DialogWrapperProps) {
  'use no memo'
  const isOpenControlled = open !== undefined
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen ?? false)
  const resolvedOpen = isOpenControlled ? open : uncontrolledOpen

  const initialValues = React.useMemo(
    () => normalizeDialogValues(schema, getInitialValues(schema, defaultValues)) ?? {},
    [defaultValues, schema],
  )
  const normalizedValues = React.useMemo(() => normalizeDialogValues(schema, values), [schema, values])
  const resolver = React.useMemo(() => createDialogWrapperResolver(schema), [schema])
  const form = useForm<DialogWrapperRuntimeValues>({
    defaultValues: initialValues,
    resolver,
    mode: validateOnChange ? 'onChange' : 'onSubmit',
    reValidateMode: validateOnChange ? 'onChange' : 'onSubmit',
  })
  const watchedValues = (useWatch({ control: form.control }) ?? form.getValues()) as DialogWrapperRuntimeValues
  const resolvedValues = React.useMemo(
    () => normalizeDialogValues(schema, watchedValues) ?? {},
    [schema, watchedValues],
  )
  const validationErrors = React.useMemo(
    () => toDialogWrapperFieldErrors(form.formState.errors),
    [form.formState.errors],
  )
  const [serverErrors, setServerErrors] = React.useState<DialogWrapperFieldErrorMap>({})
  const serverErrorsRef = React.useRef(serverErrors)
  const [formErrors, setFormErrors] = React.useState<string[]>([])
  const formErrorsRef = React.useRef(formErrors)
  const [submitCount, setSubmitCount] = React.useState(0)
  const submitCountRef = React.useRef(0)
  const resolvedErrors = React.useMemo(
    () => mergeFieldErrors(validationErrors, serverErrors),
    [serverErrors, validationErrors],
  )

  React.useEffect(() => {
    form.reset(normalizedValues ?? initialValues)
  }, [form, initialValues, normalizedValues])

  const updateServerErrors = React.useCallback((nextServerErrors: DialogWrapperFieldErrorMap) => {
    const normalized = normalizeFieldErrorMap(nextServerErrors)
    serverErrorsRef.current = normalized
    setServerErrors(normalized)
  }, [])

  const updateFormErrors = React.useCallback((nextFormErrors: string[]) => {
    const normalized = nextFormErrors.filter(Boolean)
    formErrorsRef.current = normalized
    setFormErrors(normalized)
  }, [])

  const clearSubmitErrors = React.useCallback(() => {
    serverErrorsRef.current = {}
    formErrorsRef.current = []
    setServerErrors({})
    setFormErrors([])
    form.clearErrors()
  }, [form])

  const submitHelpers = React.useMemo<DialogWrapperSubmitHelpers>(
    () => ({
      setServerErrors: (errors, nextFormErrors = []) => {
        updateServerErrors(errors)
        updateFormErrors(nextFormErrors)
      },
      setFormErrors: updateFormErrors,
      clearServerErrors: () => {
        updateServerErrors({})
        updateFormErrors([])
        form.clearErrors()
      },
    }),
    [form, updateFormErrors, updateServerErrors],
  )

  const handleOpenChange = React.useCallback(
    (next: boolean) => {
      if (!isOpenControlled) {
        setUncontrolledOpen(next)
      }
      onOpenChange?.(next)
    },
    [isOpenControlled, onOpenChange],
  )

  const required = React.useMemo(() => new Set(schema.required ?? []), [schema.required])

  const fieldEntries = React.useMemo(() => Object.entries(schema.properties), [schema.properties])

  const handleFieldChange = React.useCallback(
    (fieldName: string, property: DialogWrapperSchemaProperty, isRequired: boolean, next: unknown) => {
      const normalizedValue = normalizeDialogFieldValue(property, next, isRequired)
      const nextValues = {
        ...form.getValues(),
        [fieldName]: normalizedValue,
      }

      form.setValue(fieldName, normalizedValue, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: validateOnChange,
      })
      onValuesChange?.(normalizeDialogValues(schema, nextValues) ?? nextValues)
      updateServerErrors(clearDialogWrapperServerError(serverErrorsRef.current, fieldName))
    },
    [form, onValuesChange, schema, updateServerErrors, validateOnChange],
  )

  const handleValidSubmit = React.useCallback(
    async (nextValues: DialogWrapperRuntimeValues) => {
      const normalizedSubmitValues = normalizeDialogValues(schema, nextValues) ?? {}
      const runtimeSnapshot = toDialogRuntimeSnapshot({
        values: normalizedSubmitValues,
        errors: {},
        formErrors: [],
        submitCount: submitCountRef.current,
        isSubmitting: true,
      })

      try {
        await onSubmit?.(normalizedSubmitValues, submitHelpers, runtimeSnapshot)
        const helperErrors = mergeFieldErrors(serverErrorsRef.current)
        if (isDialogWrapperSnapshotValid(helperErrors, formErrorsRef.current) && closeOnSubmit) {
          handleOpenChange(false)
        }
      } catch (error) {
        onSubmitError?.(error)
        updateFormErrors([submitErrorMessage])
      }
    },
    [
      closeOnSubmit,
      handleOpenChange,
      onSubmit,
      onSubmitError,
      schema,
      submitErrorMessage,
      submitHelpers,
      updateFormErrors,
    ],
  )

  const handleSubmit = React.useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      submitCountRef.current += 1
      setSubmitCount(submitCountRef.current)
      clearSubmitErrors()

      try {
        await form.handleSubmit(handleValidSubmit)(event)
      } catch (error) {
        onSubmitError?.(error)
        updateFormErrors([submitErrorMessage])
      }
    },
    [clearSubmitErrors, form, handleValidSubmit, onSubmitError, submitErrorMessage, updateFormErrors],
  )

  const resolvedSubmitting = submitting || form.formState.isSubmitting

  const defaultFooter = (
    <>
      {showCancel ? (
        <Dialog.Close asChild>
          <Button
            variant="outline"
            onClick={() => {
              onCancel?.()
            }}
          >
            {cancelLabel}
          </Button>
        </Dialog.Close>
      ) : null}
      <Button type="submit" color="primary" disabled={resolvedSubmitting}>
        {resolvedSubmitting ? 'Submitting...' : submitLabel}
      </Button>
    </>
  )

  const resolvedFooter = renderFooter
    ? renderFooter(
        { submitting: resolvedSubmitting, values: resolvedValues, close: () => handleOpenChange(false) },
        defaultFooter,
      )
    : defaultFooter

  return (
    <Dialog.Root open={resolvedOpen} onOpenChange={handleOpenChange} defaultOpen={defaultOpen}>
      {trigger ? <Dialog.Trigger>{trigger}</Dialog.Trigger> : null}
      <Dialog.Content size={size} align={align} className={className}>
        <Dialog.Close />
        <Dialog.Header>
          {schema.title ? <Dialog.Title>{schema.title}</Dialog.Title> : null}
          {schema.description ? <Dialog.Description>{schema.description}</Dialog.Description> : null}
        </Dialog.Header>
        <form onSubmit={handleSubmit} noValidate>
          <Dialog.Body className={cn('space-y-4', bodyClassName)}>
            {fieldEntries.map(([fieldName, property]) => {
              const isRequired = required.has(fieldName)

              return (
                <Controller
                  key={fieldName}
                  control={form.control}
                  name={fieldName}
                  render={({ field }) => {
                    const value = resolvedValues[fieldName] ?? field.value
                    const fieldErrors = resolvedErrors[fieldName] ?? []
                    const fieldError = submitCount > 0 || fieldErrors.length > 0 ? fieldErrors[0] : undefined
                    const describedBy =
                      [
                        property.description ? `dialog-field-${fieldName}-description` : undefined,
                        fieldError ? `dialog-field-${fieldName}-error` : undefined,
                      ]
                        .filter(Boolean)
                        .join(' ') || undefined
                    const defaultRender = renderField(fieldName, property, value, isRequired, fieldError, next =>
                      handleFieldChange(fieldName, property, isRequired, next),
                    )

                    return (
                      <>
                        {renderFieldOverride
                          ? renderFieldOverride(
                              {
                                name: fieldName,
                                schema: property,
                                value,
                                required: isRequired,
                                error: fieldError,
                                describedBy,
                                onChange: next => handleFieldChange(fieldName, property, isRequired, next),
                              },
                              defaultRender,
                            )
                          : defaultRender}
                      </>
                    )
                  }}
                />
              )
            })}
            {formErrors.length > 0 ? (
              <div
                role="alert"
                aria-live="polite"
                className="rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"
              >
                <div className="font-medium">Form errors</div>
                <ul className="mt-2 list-disc pl-5">
                  {formErrors.map((message, index) => (
                    <li key={index}>{message}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </Dialog.Body>
          <Dialog.Footer>{resolvedFooter}</Dialog.Footer>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  )
}

DialogWrapper.displayName = 'DialogWrapper'
