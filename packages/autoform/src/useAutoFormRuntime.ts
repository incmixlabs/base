'use client'

import {
  type AutoFormRuntimeState,
  type AutoFormRuntimeValues,
  clearAutoFormServerError,
  clearAutoFormServerErrors,
  createAjvValidator,
  createAutoFormRuntimeState,
  type FieldErrorMap,
  getValueAtPath,
  incrementAutoFormSubmitCount,
  type JsonSchemaNode,
  resetAutoFormState,
  setAutoFormErrors,
  setAutoFormFormErrors,
  setAutoFormServerErrors,
  setAutoFormSubmitting,
  setAutoFormValue,
  setAutoFormValues,
  touchAutoFormField,
} from '@incmix/core'
import { useSelector } from '@xstate/react'
import * as React from 'react'
import { type AnyActorRef, assign, createActor, fromPromise, setup, waitFor } from 'xstate'

export interface UseAutoFormRuntimeOptions {
  initialValues: AutoFormRuntimeValues
  values?: AutoFormRuntimeValues
  onValuesChange?: (values: AutoFormRuntimeValues) => void
  validationSchema?: JsonSchemaNode
  customValidate?: (values: AutoFormRuntimeValues) => FieldErrorMap
  validateOnChange?: boolean
}

export interface AutoFormSubmitHelpers {
  setServerErrors: (errors: FieldErrorMap, formErrors?: string[]) => void
  setFormErrors: (formErrors: string[]) => void
  clearServerErrors: () => void
}

export interface AutoFormRuntimeSnapshot {
  values: AutoFormRuntimeValues
  errors: FieldErrorMap
  formErrors: string[]
  touched: Record<string, boolean>
  dirtyFields: Record<string, boolean>
  isDirty: boolean
  isValid: boolean
  isSubmitting: boolean
  submitCount: number
}

export interface UseAutoFormRuntimeResult {
  values: AutoFormRuntimeValues
  errors: FieldErrorMap
  formErrors: string[]
  touched: Record<string, boolean>
  dirtyFields: Record<string, boolean>
  isDirty: boolean
  isValid: boolean
  isSubmitting: boolean
  submitCount: number
  validationStatus: 'idle' | 'validating-field' | 'validating-form' | 'validating-submit'
  lastValidationResult: 'valid' | 'invalid' | null
  lastValidationScope: 'field' | 'form' | 'submit' | null
  lastValidatedPath: string | null
  getValue: (path: string) => unknown
  setValue: (path: string, nextValue: unknown) => void
  setValues: (nextValues: AutoFormRuntimeValues) => void
  touchField: (path: string) => void
  touchFields: (paths: string[]) => AutoFormRuntimeSnapshot
  reset: () => void
  setServerErrors: (errors: FieldErrorMap, formErrors?: string[]) => void
  setFormErrors: (formErrors: string[]) => void
  clearServerErrors: () => void
  validateSubmit: () => { success: boolean; state: AutoFormRuntimeSnapshot }
  submit: (
    onSubmit?: (
      values: AutoFormRuntimeValues,
      helpers: AutoFormSubmitHelpers,
      runtime: AutoFormRuntimeSnapshot,
    ) => void | Promise<void>,
  ) => Promise<{ success: boolean; state: AutoFormRuntimeSnapshot }>
}

type PendingSubmitOperation = {
  execute: () => Promise<void>
  resolve: () => void
  reject: (error: unknown) => void
}

type AutoFormLifecycleActorContext = {
  touched: Record<string, boolean>
  dirtyFields: Record<string, boolean>
  isDirty: boolean
  fieldEventCount: number
  touchEventCount: number
  validationEventCount: number
  validationStatus: 'idle' | 'validating-field' | 'validating-form' | 'validating-submit'
  lastValidationResult: 'valid' | 'invalid' | null
  lastValidationScope: 'field' | 'form' | 'submit' | null
  lastFieldChangePath: string | null
  lastTouchedFieldPath: string | null
  lastValidatedPath: string | null
}

type AutoFormFieldChangeEvent = {
  type: 'autoform.field.change'
  path: string
  dirtyFields: Record<string, boolean>
  isDirty: boolean
}

type AutoFormFieldTouchEvent = {
  type: 'autoform.field.touch'
  path: string
  touched: Record<string, boolean>
  dirtyFields: Record<string, boolean>
  isDirty: boolean
}

type AutoFormFieldValidationRequestEvent = {
  type: 'autoform.field.validate.request'
  path: string
}

type AutoFormFieldValidationCompleteEvent = {
  type: 'autoform.field.validate.complete'
  path: string
  result: 'valid' | 'invalid'
}

type AutoFormFormValidationRequestEvent = {
  type: 'autoform.form.validate.request'
  reason: 'change' | 'submit'
}

type AutoFormFormValidationCompleteEvent = {
  type: 'autoform.form.validate.complete'
  reason: 'change' | 'submit'
  result: 'valid' | 'invalid'
}

type AutoFormRuntimeTouchSyncEvent = {
  type: 'autoform.runtime.touch-sync'
  touched: Record<string, boolean>
  dirtyFields: Record<string, boolean>
  isDirty: boolean
}

type AutoFormSubmitRequestEvent = {
  type: 'autoform.submit.request'
}

type AutoFormLifecycleEvent =
  | AutoFormFieldChangeEvent
  | AutoFormFieldTouchEvent
  | AutoFormFieldValidationRequestEvent
  | AutoFormFieldValidationCompleteEvent
  | AutoFormFormValidationRequestEvent
  | AutoFormFormValidationCompleteEvent
  | AutoFormRuntimeTouchSyncEvent
  | AutoFormSubmitRequestEvent
  | { type: 'autoform.validation.reset' }

function createAutoFormLifecycleEventHandlers() {
  return {
    'autoform.field.change': {
      actions: assign(
        ({ context, event }: { context: AutoFormLifecycleActorContext; event: AutoFormFieldChangeEvent }) => {
          return {
            dirtyFields: event.dirtyFields,
            isDirty: event.isDirty,
            fieldEventCount: context.fieldEventCount + 1,
            lastFieldChangePath: event.path,
          }
        },
      ),
    },
    'autoform.field.touch': {
      actions: assign(
        ({ context, event }: { context: AutoFormLifecycleActorContext; event: AutoFormFieldTouchEvent }) => {
          return {
            touched: event.touched,
            dirtyFields: event.dirtyFields,
            isDirty: event.isDirty,
            touchEventCount: context.touchEventCount + 1,
            lastTouchedFieldPath: event.path,
          }
        },
      ),
    },
    'autoform.field.validate.request': {
      actions: assign(({ event }: { event: AutoFormFieldValidationRequestEvent }) => {
        return {
          validationStatus: 'validating-field' as const,
          lastValidationScope: 'field' as const,
          lastValidatedPath: event.path,
        }
      }),
    },
    'autoform.field.validate.complete': {
      actions: assign(
        ({
          context,
          event,
        }: {
          context: AutoFormLifecycleActorContext
          event: AutoFormFieldValidationCompleteEvent
        }) => {
          return {
            validationEventCount: context.validationEventCount + 1,
            validationStatus: 'idle' as const,
            lastValidationResult: event.result,
            lastValidationScope: 'field' as const,
            lastValidatedPath: event.path,
          }
        },
      ),
    },
    'autoform.form.validate.request': {
      actions: assign(({ event }: { event: AutoFormFormValidationRequestEvent }) => {
        return {
          validationStatus: event.reason === 'submit' ? ('validating-submit' as const) : ('validating-form' as const),
          lastValidationScope: event.reason === 'submit' ? ('submit' as const) : ('form' as const),
          lastValidatedPath: null,
        }
      }),
    },
    'autoform.form.validate.complete': {
      actions: assign(
        ({
          context,
          event,
        }: {
          context: AutoFormLifecycleActorContext
          event: AutoFormFormValidationCompleteEvent
        }) => {
          return {
            validationEventCount: context.validationEventCount + 1,
            validationStatus: 'idle' as const,
            lastValidationResult: event.result,
            lastValidationScope: event.reason === 'submit' ? ('submit' as const) : ('form' as const),
            lastValidatedPath: null,
          }
        },
      ),
    },
    'autoform.validation.reset': {
      actions: assign(() => {
        return {
          validationStatus: 'idle' as const,
          lastValidationResult: null,
          lastValidationScope: null,
          lastValidatedPath: null,
        }
      }),
    },
    'autoform.runtime.touch-sync': {
      actions: assign(({ event }: { event: AutoFormRuntimeTouchSyncEvent }) => {
        return {
          touched: event.touched,
          dirtyFields: event.dirtyFields,
          isDirty: event.isDirty,
        }
      }),
    },
  }
}

function createAutoFormLifecycleActor(
  initialTouchState: Pick<AutoFormLifecycleActorContext, 'touched' | 'dirtyFields' | 'isDirty'>,
  pendingSubmitRef: React.RefObject<PendingSubmitOperation | null>,
): AnyActorRef {
  const eventHandlers = createAutoFormLifecycleEventHandlers()

  return createActor(
    setup({
      types: {} as {
        context: AutoFormLifecycleActorContext
        events: AutoFormLifecycleEvent
      },
      actors: {
        autoFormSubmitRunner: fromPromise(async () => {
          const pendingSubmit = pendingSubmitRef.current
          if (!pendingSubmit) {
            return
          }

          try {
            await pendingSubmit.execute()
            pendingSubmit.resolve()
          } catch (error) {
            pendingSubmit.reject(error)
            throw error
          } finally {
            pendingSubmitRef.current = null
          }
        }),
      },
    }).createMachine({
      id: 'autoform.lifecycle',
      initial: 'ready',
      context: {
        touched: initialTouchState.touched,
        dirtyFields: initialTouchState.dirtyFields,
        isDirty: initialTouchState.isDirty,
        fieldEventCount: 0,
        touchEventCount: 0,
        validationEventCount: 0,
        validationStatus: 'idle',
        lastValidationResult: null,
        lastValidationScope: null,
        lastFieldChangePath: null,
        lastTouchedFieldPath: null,
        lastValidatedPath: null,
      },
      states: {
        ready: {
          on: {
            ...eventHandlers,
            'autoform.submit.request': 'submitting',
          },
        },
        submitting: {
          invoke: {
            src: 'autoFormSubmitRunner',
            onDone: {
              target: 'ready',
            },
            onError: {
              target: 'error',
            },
          },
          on: eventHandlers,
        },
        error: {
          on: {
            ...eventHandlers,
            'autoform.submit.request': 'submitting',
          },
        },
      },
    } as any),
  ) as AnyActorRef
}

function mergeFieldErrors(...maps: FieldErrorMap[]): FieldErrorMap {
  const merged: FieldErrorMap = {}

  for (const map of maps) {
    for (const [path, messages] of Object.entries(map)) {
      if (!merged[path]) {
        merged[path] = [...messages]
        continue
      }
      merged[path] = [...merged[path], ...messages]
    }
  }

  return merged
}

function filterFieldErrors(path: string, errors: FieldErrorMap): FieldErrorMap {
  const prefix = `${path}.`
  const filtered: FieldErrorMap = {}

  for (const [errorPath, messages] of Object.entries(errors)) {
    if (errorPath === path || errorPath.startsWith(prefix)) {
      filtered[errorPath] = messages
    }
  }

  return filtered
}

function getValidationResult(errors: FieldErrorMap) {
  return Object.keys(errors).length === 0 ? 'valid' : 'invalid'
}

function toAutoFormRuntimeSnapshot(state: AutoFormRuntimeState): AutoFormRuntimeSnapshot {
  return {
    values: state.values,
    errors: state.errors,
    formErrors: state.formErrors,
    touched: state.touched,
    dirtyFields: state.dirtyFields,
    isDirty: state.isDirty,
    isValid: state.isValid,
    isSubmitting: state.isSubmitting,
    submitCount: state.submitCount,
  }
}

export function hasSameTouchMetadata(
  left: Pick<AutoFormLifecycleActorContext, 'touched' | 'dirtyFields' | 'isDirty'>,
  right: Pick<AutoFormLifecycleActorContext, 'touched' | 'dirtyFields' | 'isDirty'>,
) {
  if (left.isDirty !== right.isDirty) {
    return false
  }

  const leftTouchedKeys = Object.keys(left.touched)
  const rightTouchedKeys = Object.keys(right.touched)
  if (leftTouchedKeys.length !== rightTouchedKeys.length) {
    return false
  }
  for (const key of leftTouchedKeys) {
    if (left.touched[key] !== right.touched[key]) {
      return false
    }
  }

  const leftDirtyKeys = Object.keys(left.dirtyFields)
  const rightDirtyKeys = Object.keys(right.dirtyFields)
  if (leftDirtyKeys.length !== rightDirtyKeys.length) {
    return false
  }
  for (const key of leftDirtyKeys) {
    if (left.dirtyFields[key] !== right.dirtyFields[key]) {
      return false
    }
  }

  return true
}

export function useAutoFormRuntime({
  initialValues,
  values,
  onValuesChange,
  validationSchema,
  customValidate,
  validateOnChange = true,
}: UseAutoFormRuntimeOptions): UseAutoFormRuntimeResult {
  'use no memo'
  const validator = React.useMemo(
    () => (validationSchema ? createAjvValidator(validationSchema) : undefined),
    [validationSchema],
  )
  const isControlled = values !== undefined
  const [state, setState] = React.useState<AutoFormRuntimeState>(() =>
    createAutoFormRuntimeState(initialValues, values ?? initialValues),
  )
  const stateRef = React.useRef(state)
  const pendingSubmitRef = React.useRef<PendingSubmitOperation | null>(null)
  const previousInitialValuesRef = React.useRef(initialValues)
  const initialTouchStateRef = React.useRef<Pick<AutoFormLifecycleActorContext, 'touched' | 'dirtyFields' | 'isDirty'>>(
    {
      touched: state.touched,
      dirtyFields: state.dirtyFields,
      isDirty: state.isDirty,
    },
  )
  const initialTouchState = initialTouchStateRef.current

  const lifecycleActorRef = React.useRef<ReturnType<typeof createAutoFormLifecycleActor> | null>(null)

  if (!lifecycleActorRef.current) {
    lifecycleActorRef.current = createAutoFormLifecycleActor(initialTouchState, pendingSubmitRef)
  }

  const lifecycleActor = lifecycleActorRef.current
  const runtimeIsSubmitting = useSelector(lifecycleActor, snapshot => snapshot.matches('submitting'))
  const syncRuntimeTouchMetadata = React.useCallback(
    (runtimeState: Pick<AutoFormRuntimeState, 'touched' | 'dirtyFields' | 'isDirty'>) => {
      const currentContext = lifecycleActor.getSnapshot().context as AutoFormLifecycleActorContext
      const nextMetadata = {
        touched: runtimeState.touched,
        dirtyFields: runtimeState.dirtyFields,
        isDirty: runtimeState.isDirty,
      }

      if (hasSameTouchMetadata(currentContext, nextMetadata)) {
        return
      }

      lifecycleActor.send({
        type: 'autoform.runtime.touch-sync',
        touched: nextMetadata.touched,
        dirtyFields: nextMetadata.dirtyFields,
        isDirty: nextMetadata.isDirty,
      })
    },
    [lifecycleActor],
  )

  React.useEffect(() => {
    lifecycleActor.start()
    return () => {
      lifecycleActor.stop()
    }
  }, [lifecycleActor])

  React.useEffect(() => {
    stateRef.current = state
  }, [state])

  const commitLocalState = React.useCallback((updater: (current: AutoFormRuntimeState) => AutoFormRuntimeState) => {
    const next = updater(stateRef.current)
    stateRef.current = next
    setState(next)
  }, [])

  const validateValues = React.useCallback(
    (runtimeValues: AutoFormRuntimeValues) => {
      const schemaErrors = validator?.validate(runtimeValues).errors ?? {}
      const customErrors = customValidate?.(runtimeValues) ?? {}
      return mergeFieldErrors(schemaErrors, customErrors)
    },
    [customValidate, validator],
  )

  const validateAll = React.useCallback(
    (runtimeState: AutoFormRuntimeState) => {
      const validationErrors = validateValues(runtimeState.values)
      return setAutoFormErrors(runtimeState, validationErrors)
    },
    [validateValues],
  )

  React.useEffect(() => {
    commitLocalState(current => {
      if (current.isSubmitting === runtimeIsSubmitting) {
        return current
      }
      return setAutoFormSubmitting(current, runtimeIsSubmitting)
    })
  }, [commitLocalState, runtimeIsSubmitting])

  React.useEffect(() => {
    const initialValuesChanged = previousInitialValuesRef.current !== initialValues
    previousInitialValuesRef.current = initialValues

    const nextState = isControlled
      ? {
          ...(validateOnChange
            ? validateAll(setAutoFormValues({ ...stateRef.current, initialValues }, values ?? initialValues))
            : setAutoFormValues({ ...stateRef.current, initialValues }, values ?? initialValues)),
          initialValues,
        }
      : {
          ...setAutoFormValues({ ...stateRef.current, initialValues }, stateRef.current.values),
          initialValues,
        }

    stateRef.current = nextState
    setState(nextState)
    syncRuntimeTouchMetadata(nextState)
    if (initialValuesChanged) {
      lifecycleActor.send({
        type: 'autoform.validation.reset',
      })
    }
  }, [initialValues, isControlled, lifecycleActor, syncRuntimeTouchMetadata, validateAll, validateOnChange, values])

  const runtimeTouched = useSelector(
    lifecycleActor,
    snapshot => (snapshot.context as AutoFormLifecycleActorContext).touched,
  )
  const runtimeDirtyFields = useSelector(
    lifecycleActor,
    snapshot => (snapshot.context as AutoFormLifecycleActorContext).dirtyFields,
  )
  const runtimeIsDirty = useSelector(
    lifecycleActor,
    snapshot => (snapshot.context as AutoFormLifecycleActorContext).isDirty,
  )

  const applyValues = React.useCallback(
    (updater: (current: AutoFormRuntimeState) => AutoFormRuntimeState) => {
      const next = updater(stateRef.current)
      const resolvedNext = isControlled
        ? {
            ...next,
            values: values ?? next.values,
          }
        : next

      stateRef.current = resolvedNext
      setState(resolvedNext)
      onValuesChange?.(next.values)
      return resolvedNext
    },
    [isControlled, onValuesChange, values],
  )

  const validatePath = React.useCallback(
    (runtimeState: AutoFormRuntimeState, path: string) => {
      const nextErrors: FieldErrorMap = { ...runtimeState.validationErrors }

      for (const key of Object.keys(nextErrors)) {
        if (key === path || key.startsWith(`${path}.`)) {
          delete nextErrors[key]
        }
      }

      const result = filterFieldErrors(path, validateValues(runtimeState.values))
      return setAutoFormErrors(runtimeState, {
        ...nextErrors,
        ...result,
      })
    },
    [validateValues],
  )

  const emitFieldValidation = React.useCallback(
    (path: string, runtimeState: AutoFormRuntimeState) => {
      lifecycleActor.send({
        type: 'autoform.field.validate.request',
        path,
      })
      lifecycleActor.send({
        type: 'autoform.field.validate.complete',
        path,
        result: getValidationResult(filterFieldErrors(path, runtimeState.errors)),
      })
    },
    [lifecycleActor],
  )

  const emitFormValidation = React.useCallback(
    (reason: 'change' | 'submit', runtimeState: AutoFormRuntimeState) => {
      lifecycleActor.send({
        type: 'autoform.form.validate.request',
        reason,
      })
      lifecycleActor.send({
        type: 'autoform.form.validate.complete',
        reason,
        result: runtimeState.isValid ? 'valid' : 'invalid',
      })
    },
    [lifecycleActor],
  )

  const setValue = React.useCallback(
    (path: string, nextValue: unknown) => {
      const nextState = applyValues(current => {
        let next = clearAutoFormServerError(setAutoFormValue(current, path, nextValue), path)
        if (validateOnChange) {
          next = validatePath(next, path)
        }
        return next
      })
      lifecycleActor.send({
        type: 'autoform.field.change',
        path,
        dirtyFields: nextState.dirtyFields,
        isDirty: nextState.isDirty,
      })
      if (validateOnChange) {
        emitFieldValidation(path, nextState)
      }
    },
    [applyValues, emitFieldValidation, lifecycleActor, validateOnChange, validatePath],
  )

  const touchField = React.useCallback(
    (path: string) => {
      const nextState = applyValues(current => validatePath(touchAutoFormField(current, path), path))
      lifecycleActor.send({
        type: 'autoform.field.touch',
        path,
        touched: nextState.touched,
        dirtyFields: nextState.dirtyFields,
        isDirty: nextState.isDirty,
      })
      emitFieldValidation(path, nextState)
    },
    [applyValues, emitFieldValidation, lifecycleActor, validatePath],
  )

  const touchFields = React.useCallback(
    (paths: string[]) => {
      let nextState = stateRef.current

      for (const path of paths) {
        nextState = validatePath(touchAutoFormField(nextState, path), path)
        lifecycleActor.send({
          type: 'autoform.field.touch',
          path,
          touched: nextState.touched,
          dirtyFields: nextState.dirtyFields,
          isDirty: nextState.isDirty,
        })
        emitFieldValidation(path, nextState)
      }

      stateRef.current = nextState
      setState(nextState)

      if (isControlled) {
        onValuesChange?.(nextState.values)
      }

      return toAutoFormRuntimeSnapshot(nextState)
    },
    [emitFieldValidation, isControlled, lifecycleActor, onValuesChange, validatePath],
  )

  const setValues = React.useCallback(
    (nextValues: AutoFormRuntimeValues) => {
      const nextState = applyValues(current => {
        const withValues = clearAutoFormServerErrors(setAutoFormValues(current, nextValues))
        return validateOnChange ? validateAll(withValues) : withValues
      })
      syncRuntimeTouchMetadata(nextState)
      if (validateOnChange) {
        emitFormValidation('change', nextState)
      }
    },
    [applyValues, emitFormValidation, syncRuntimeTouchMetadata, validateAll, validateOnChange],
  )

  const reset = React.useCallback(() => {
    const nextState = applyValues(current => resetAutoFormState(current, initialValues))
    syncRuntimeTouchMetadata(nextState)
    lifecycleActor.send({
      type: 'autoform.validation.reset',
    })
  }, [applyValues, initialValues, lifecycleActor, syncRuntimeTouchMetadata])

  const setServerErrors = React.useCallback(
    (errors: FieldErrorMap, formErrors: string[] = []) => {
      commitLocalState(current => setAutoFormServerErrors(current, errors, formErrors))
    },
    [commitLocalState],
  )

  const setFormErrors = React.useCallback(
    (formErrors: string[]) => {
      commitLocalState(current => setAutoFormFormErrors(current, formErrors))
    },
    [commitLocalState],
  )

  const clearServerErrors = React.useCallback(() => {
    commitLocalState(current => clearAutoFormServerErrors(current))
  }, [commitLocalState])

  const validateSubmit = React.useCallback(() => {
    const beforeSubmit = validateAll(clearAutoFormServerErrors(stateRef.current))
    emitFormValidation('submit', beforeSubmit)
    const withSubmitCount = incrementAutoFormSubmitCount(beforeSubmit)
    stateRef.current = withSubmitCount
    setState(withSubmitCount)

    return {
      success: withSubmitCount.isValid,
      state: toAutoFormRuntimeSnapshot(withSubmitCount),
    }
  }, [emitFormValidation, validateAll])

  const submit = React.useCallback(
    async (
      onSubmit?: (
        values: AutoFormRuntimeValues,
        helpers: AutoFormSubmitHelpers,
        runtime: AutoFormRuntimeSnapshot,
      ) => void | Promise<void>,
    ) => {
      const validationResult = validateSubmit()

      if (!validationResult.success) return validationResult

      const helpers: AutoFormSubmitHelpers = {
        setServerErrors: (errors, formErrors = []) => {
          commitLocalState(current => setAutoFormServerErrors(current, errors, formErrors))
        },
        setFormErrors: formErrors => {
          commitLocalState(current => setAutoFormFormErrors(current, formErrors))
        },
        clearServerErrors: () => {
          commitLocalState(current => clearAutoFormServerErrors(current))
        },
      }

      try {
        if (pendingSubmitRef.current || lifecycleActor.getSnapshot().matches('submitting')) {
          throw new Error('AutoForm submit already in progress')
        }

        const submitSnapshot = setAutoFormSubmitting(stateRef.current, true)
        stateRef.current = submitSnapshot

        await new Promise<void>((resolve, reject) => {
          pendingSubmitRef.current = {
            execute: async () => {
              await onSubmit?.(submitSnapshot.values, helpers, toAutoFormRuntimeSnapshot(submitSnapshot))
            },
            resolve,
            reject,
          }

          lifecycleActor.send({
            type: 'autoform.submit.request',
          })

          if (!lifecycleActor.getSnapshot().matches('submitting')) {
            pendingSubmitRef.current = null
            const rollbackState = setAutoFormSubmitting(stateRef.current, false)
            stateRef.current = rollbackState
            setState(rollbackState)
            reject(new Error('AutoForm lifecycle actor did not accept submit action'))
          }
        })

        await waitFor(lifecycleActor, snapshot => !snapshot.matches('submitting'))
        const completedState = setAutoFormSubmitting(stateRef.current, false)
        stateRef.current = completedState
        setState(completedState)
        return {
          success: completedState.isValid,
          state: toAutoFormRuntimeSnapshot(completedState),
        } as const
      } catch (error) {
        await waitFor(lifecycleActor, snapshot => !snapshot.matches('submitting'))
        throw error
      }
    },
    [commitLocalState, lifecycleActor, validateSubmit],
  )

  const runtimeValidationStatus = useSelector(
    lifecycleActor,
    snapshot => (snapshot.context as AutoFormLifecycleActorContext).validationStatus,
  )
  const runtimeLastValidationResult = useSelector(
    lifecycleActor,
    snapshot => (snapshot.context as AutoFormLifecycleActorContext).lastValidationResult,
  )
  const runtimeLastValidationScope = useSelector(
    lifecycleActor,
    snapshot => (snapshot.context as AutoFormLifecycleActorContext).lastValidationScope,
  )
  const runtimeLastValidatedPath = useSelector(
    lifecycleActor,
    snapshot => (snapshot.context as AutoFormLifecycleActorContext).lastValidatedPath,
  )

  return {
    values: state.values,
    errors: state.errors,
    formErrors: state.formErrors,
    touched: runtimeTouched,
    dirtyFields: runtimeDirtyFields,
    isDirty: runtimeIsDirty,
    isValid: state.isValid,
    isSubmitting: state.isSubmitting,
    submitCount: state.submitCount,
    validationStatus: runtimeValidationStatus,
    lastValidationResult: runtimeLastValidationResult,
    lastValidationScope: runtimeLastValidationScope,
    lastValidatedPath: runtimeLastValidatedPath,
    getValue: (path: string) => getValueAtPath(state.values, path),
    setValue,
    setValues,
    touchField,
    touchFields,
    reset,
    setServerErrors,
    setFormErrors,
    clearServerErrors,
    validateSubmit,
    submit,
  }
}
