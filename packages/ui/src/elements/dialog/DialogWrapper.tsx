'use client'

import * as React from 'react'
import { useAutoFormRuntime } from '@/autoform/useAutoFormRuntime'
import { Button } from '@/elements/button/Button'
import { Checkbox } from '@/form/Checkbox'
import { Label } from '@/form/Label'
import { NumberInput, type NumberInputIconButtonProps } from '@/form/NumberInput'
import { Select, SelectItem } from '@/form/Select'
import { Textarea } from '@/form/Textarea'
import { TextField } from '@/form/TextField'
import { Flex } from '@/layouts/flex/Flex'
import { cn } from '@/lib/utils'
import { hasOwnProperty as hasOwnKey } from '@/theme/helpers/has-own-property'
import { Dialog } from './Dialog'
import type { DialogWrapperProps, DialogWrapperSchema, DialogWrapperSchemaProperty } from './dialog-wrapper.props'

export type {
  DialogWrapperProps,
  DialogWrapperRenderFieldArgs,
  DialogWrapperRenderFooterArgs,
  DialogWrapperSchema,
  DialogWrapperSchemaProperty,
  DialogWrapperSubmitHelpers,
} from './dialog-wrapper.props'

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
  validationSchema,
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
  const runtime = useAutoFormRuntime({
    initialValues,
    values: normalizedValues,
    onValuesChange: nextValues => {
      onValuesChange?.(normalizeDialogValues(schema, nextValues) ?? nextValues)
    },
    validationSchema,
    validateOnChange,
  })
  const resolvedValues = runtime.values

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

  const handleSubmit = React.useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      try {
        const result = await runtime.submit(async (nextValues, helpers, runtimeState) => {
          await onSubmit?.(nextValues, helpers, {
            errors: runtimeState.errors,
            formErrors: runtimeState.formErrors,
            submitCount: runtimeState.submitCount,
            isSubmitting: runtimeState.isSubmitting,
            isValid: runtimeState.isValid,
          })
        })
        if (result.success && closeOnSubmit) {
          handleOpenChange(false)
        }
      } catch (error) {
        onSubmitError?.(error)
        runtime.setFormErrors([submitErrorMessage])
      }
    },
    [closeOnSubmit, handleOpenChange, onSubmit, onSubmitError, runtime, submitErrorMessage],
  )

  const resolvedSubmitting = submitting || runtime.isSubmitting

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
        <form onSubmit={handleSubmit} noValidate={validationSchema !== undefined}>
          <Dialog.Body className={cn('space-y-4', bodyClassName)}>
            {fieldEntries.map(([fieldName, property]) => {
              const fieldErrors = runtime.errors[fieldName] ?? []
              const fieldError = runtime.submitCount > 0 || fieldErrors.length > 0 ? fieldErrors[0] : undefined
              const describedBy =
                [
                  property.description ? `dialog-field-${fieldName}-description` : undefined,
                  fieldError ? `dialog-field-${fieldName}-error` : undefined,
                ]
                  .filter(Boolean)
                  .join(' ') || undefined
              const defaultRender = renderField(
                fieldName,
                property,
                resolvedValues[fieldName],
                required.has(fieldName),
                fieldError,
                next => runtime.setValue(fieldName, normalizeDialogFieldValue(property, next, required.has(fieldName))),
              )

              return (
                <React.Fragment key={fieldName}>
                  {renderFieldOverride
                    ? renderFieldOverride(
                        {
                          name: fieldName,
                          schema: property,
                          value: resolvedValues[fieldName],
                          required: required.has(fieldName),
                          error: fieldError,
                          describedBy,
                          onChange: next =>
                            runtime.setValue(
                              fieldName,
                              normalizeDialogFieldValue(property, next, required.has(fieldName)),
                            ),
                        },
                        defaultRender,
                      )
                    : defaultRender}
                </React.Fragment>
              )
            })}
            {runtime.formErrors.length > 0 ? (
              <div
                role="alert"
                aria-live="polite"
                className="rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"
              >
                <div className="font-medium">Form errors</div>
                <ul className="mt-2 list-disc pl-5">
                  {runtime.formErrors.map((message, index) => (
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
