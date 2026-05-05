'use client'

import type {
  AutoFormAvatarItemProps,
  AutoFormComboboxWidgetProps,
  AutoFormConditionState,
  AutoFormFieldLayout,
  AutoFormFileUploadWidgetProps,
  AutoFormHoverCardProps,
  AutoFormLabelPlacement,
  AutoFormMentionItemProps,
  AutoFormMentionTriggerProps,
  AutoFormMultiSelectOptionProps,
  AutoFormNormalizedArrayNode,
  AutoFormNormalizedDynamicBranch,
  AutoFormNormalizedFieldNode,
  AutoFormNormalizedModel,
  AutoFormNormalizedObjectGroupNode,
  AutoFormNormalizedRenderableNode,
  AutoFormNormalizedResponsiveValue,
  AutoFormNormalizedSection,
  AutoFormNormalizedStep,
  AutoFormRuntimeValues,
  AutoFormSectionLayout,
  AutoFormTreeLeafSelectOptionProps,
  FieldErrorMap,
  JsonSchemaNode,
} from '@incmix/core'
import {
  evaluateAutoFormConditionState,
  getAutoFormAvatarPickerWidgetProps,
  getAutoFormComboboxWidgetProps,
  getAutoFormCountryPickerWidgetProps,
  getAutoFormDatePickerWidgetProps,
  getAutoFormDateTimePickerWidgetProps,
  getAutoFormFileUploadWidgetProps,
  getAutoFormMentionTextareaWidgetProps,
  getAutoFormMultiSelectWidgetProps,
  getAutoFormTimePickerWidgetProps,
  getAutoFormTreeLeafSelectWidgetProps,
  getValueAtPath,
  resolveAutoFormDateBounds,
  setValueAtPath,
  validateAutoFormDateRules,
} from '@incmix/core'
import * as React from 'react'
import type { AvatarHoverCardData } from '@/elements/avatar/Avatar'
import { Button, type ButtonProps } from '@/elements/button/Button'
import { Icon } from '@/elements/button/Icon'
import { Dialog } from '@/elements/dialog/Dialog'
import { DirtyGuardDialog, type DirtyGuardDialogProps } from '@/elements/dialog/DirtyGuardDialog'
import { type PopoverContentVariant, popoverContentVariants } from '@/elements/popover/popover.props'
import { Stepper } from '@/elements/stepper/Stepper'
import type { ToastNotifyOptions } from '@/elements/toast/Toast'
import { Toast } from '@/elements/toast/toast.namespace'
import { type TreeDataItem, TreeView } from '@/elements/tree-view/TreeView'
import { AutoFormMentionTextarea, type AutoFormMentionTextareaConfig } from '@/form/AutoFormMentionTextarea'
import { type AvatarItem, AvatarPicker } from '@/form/AvatarPicker'
import { Checkbox } from '@/form/Checkbox'
import { Combobox, type ComboboxOption } from '@/form/Combobox'
import { DatePickerNext, DateTimePickerNext, TimePickerNext, type TimeValueNext } from '@/form/date'
import { FieldGroup } from '@/form/FieldGroup'
import { Fieldset } from '@/form/Fieldset'
import { FileUpload, type UploadedFile, uploadedFileStatuses } from '@/form/FileUpload'
import { Label } from '@/form/Label'
import { LocationInput } from '@/form/LocationInput'
import { MultiSelect, type MultiSelectOption } from '@/form/MultiSelect'
import { NumberInput } from '@/form/NumberInput'
import { Select, SelectItem } from '@/form/Select'
import { Textarea } from '@/form/Textarea'
import { TextField } from '@/form/TextField'
import { useDirtyGuard } from '@/hooks'
import { Flex } from '@/layouts/flex/Flex'
import { cn } from '@/lib/utils'
import { colorPropDef } from '@/theme/props/color.prop'
import { normalizeEnumPropValue } from '@/theme/props/prop-def'
import { radiusPropDef } from '@/theme/props/radius.prop'
import {
  type Color,
  type GridColumns,
  possibleSizes,
  type Radius,
  type Size,
  type Spacing,
  type TextFieldVariant,
  textFieldTokens,
} from '@/theme/tokens'
import {
  autoFormActionSlot,
  autoFormBooleanInlineLabelClasses,
  autoFormBooleanSpacerLabelClasses,
  autoFormBooleanTopLabelClasses,
  autoFormColumnSpanClasses,
  autoFormFieldBodyPlacementClasses,
  autoFormFieldLabelPlacementClasses,
  autoFormFieldWrapperLayoutClasses,
  autoFormResponsiveContainer,
} from './AutoFormModelRenderer.css'
import {
  getAddArrayItemButtonText,
  getAddArrayItemLabel,
  getArrayItemHeading,
  getArrayItemLabel,
  getEmptyArrayStateText,
  getRepeaterItemScopeKey,
  getRepeaterStoreKey,
} from './autoform-repeater.utils'
import { type AutoFormSubmitHelpers, useAutoFormRuntime } from './useAutoFormRuntime'

type AutoFormModelRendererValues = AutoFormRuntimeValues
type AutoFormActionButtonProps = Pick<ButtonProps, 'size' | 'variant' | 'color' | 'radius' | 'highContrast'>
type AutoFormSectionChrome = 'fieldset' | 'none'
type AutoFormDirtyGuardAction = 'cancel' | 'close'
export interface AutoFormDirtyGuardContext {
  action: AutoFormDirtyGuardAction
  values: AutoFormModelRendererValues
  dirtyFields: Record<string, boolean>
}
export type AutoFormDirtyGuardOptions = Pick<
  DirtyGuardDialogProps<AutoFormDirtyGuardContext>,
  'title' | 'description' | 'cancelLabel' | 'confirmLabel' | 'confirmColor' | 'size' | 'onConfirmError'
> & {
  enabled?: boolean
}
type AutoFormSubmitSuccessToast =
  | ToastNotifyOptions
  | ((values: AutoFormModelRendererValues) => ToastNotifyOptions | null | undefined)

type AutoFormWidgetProps = Record<string, unknown>
export interface AutoFormModelRendererProps {
  model: AutoFormNormalizedModel
  values?: AutoFormModelRendererValues
  defaultValues?: AutoFormModelRendererValues
  validationSchema?: JsonSchemaNode
  customValidate?: (values: AutoFormModelRendererValues) => FieldErrorMap
  validateOnChange?: boolean
  onValuesChange?: (values: AutoFormModelRendererValues) => void
  // `runtime` is a submit-start snapshot. Submit helpers update internal state, but do not mutate this object.
  // Return `false` to suppress success handling (success toast/callback and optional dialog close).
  // Any other return value is ignored by the renderer.
  onSubmit?: (
    values: AutoFormModelRendererValues,
    helpers: AutoFormSubmitHelpers,
    runtime: {
      errors: Record<string, string[]>
      formErrors: string[]
      submitCount: number
      isSubmitting: boolean
      isValid: boolean
    },
  ) => unknown | Promise<unknown>
  submitSuccessToast?: AutoFormSubmitSuccessToast
  submitLabel?: string
  cancelLabel?: string
  submitButtonProps?: AutoFormActionButtonProps
  cancelButtonProps?: AutoFormActionButtonProps
  submitDisabled?: boolean
  cancelDisabled?: boolean
  submitMode?: 'submit' | 'button'
  onCancel?: () => void
  showActions?: boolean
  renderActions?: (actions: React.ReactNode) => React.ReactNode
  sectionChrome?: AutoFormSectionChrome
  closeOnSubmit?: boolean
  dirtyGuard?: boolean | AutoFormDirtyGuardOptions
  trigger?: React.ReactNode
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  surface?: 'auto' | 'inline'
  fieldSize?: Size
  fieldVariant?: TextFieldVariant
  fieldGap?: Spacing
  stepperAllowStepSelect?: boolean
  className?: string
  bodyClassName?: string
  renderField?: (
    node: AutoFormNormalizedFieldNode,
    defaultRender: React.ReactNode,
    values: AutoFormModelRendererValues,
  ) => React.ReactNode
}

type AutoFormModelRendererContentProps = Omit<AutoFormModelRendererProps, 'submitSuccessToast'> & {
  onSubmitSuccess?: (values: AutoFormModelRendererValues) => void
}

export function AutoFormModelRenderer(props: AutoFormModelRendererProps) {
  const { submitSuccessToast, ...contentProps } = props

  if (submitSuccessToast == null) {
    return <AutoFormModelRendererContent {...contentProps} />
  }

  return (
    <Toast.Provider>
      <AutoFormModelRendererWithToast {...contentProps} submitSuccessToast={submitSuccessToast} />
      <Toast.Viewport side="bottom" />
    </Toast.Provider>
  )
}

function AutoFormModelRendererWithToast({
  submitSuccessToast,
  ...props
}: AutoFormModelRendererContentProps & { submitSuccessToast: AutoFormSubmitSuccessToast }) {
  const { notify } = Toast.useToast()
  const notifySubmitSuccess = React.useCallback(
    (values: AutoFormModelRendererValues) => {
      const options = typeof submitSuccessToast === 'function' ? submitSuccessToast(values) : submitSuccessToast
      if (options != null) notify(options)
    },
    [notify, submitSuccessToast],
  )

  return <AutoFormModelRendererContent {...props} onSubmitSuccess={notifySubmitSuccess} />
}

function AutoFormModelRendererContent({
  model,
  values,
  defaultValues,
  validationSchema,
  customValidate,
  validateOnChange = true,
  onValuesChange,
  onSubmit,
  submitLabel = 'Submit',
  cancelLabel = 'Cancel',
  submitButtonProps,
  cancelButtonProps,
  submitDisabled = false,
  cancelDisabled = false,
  submitMode = 'submit',
  onCancel,
  showActions = true,
  renderActions,
  sectionChrome = 'fieldset',
  closeOnSubmit = false,
  dirtyGuard,
  trigger,
  defaultOpen,
  open,
  onOpenChange,
  surface = 'auto',
  fieldSize = 'md',
  fieldVariant = 'outline',
  fieldGap = '4',
  stepperAllowStepSelect = true,
  className,
  bodyClassName,
  renderField,
  onSubmitSuccess,
}: AutoFormModelRendererContentProps) {
  const repeaterRowIdCounterRef = React.useRef(0)
  const repeaterRowIdsRef = React.useRef<Record<string, string[]>>({})
  const initialValues = React.useMemo(() => buildInitialValues(model, defaultValues), [defaultValues, model])
  const validateValues = React.useCallback(
    (nextValues: AutoFormModelRendererValues) =>
      mergeAutoFormFieldErrors(validateAutoFormDateRuleErrors(model, nextValues), customValidate?.(nextValues) ?? {}),
    [customValidate, model],
  )
  const runtime = useAutoFormRuntime({
    initialValues,
    values,
    onValuesChange,
    validationSchema,
    customValidate: validateValues,
    validateOnChange,
  })
  const resolvedValues = runtime.values
  const isDialog = surface !== 'inline' && model.wrapper === 'dialog'
  const conditionState = React.useMemo(
    () => evaluateAutoFormConditionState(model, resolvedValues ?? {}),
    [model, resolvedValues],
  )
  const effectiveNodes = React.useMemo(
    () => buildEffectiveRenderNodes(model.nodes, conditionState.activeBranches),
    [conditionState.activeBranches, model.nodes],
  )
  const formErrors = React.useMemo(
    () =>
      getFormLevelErrors(
        effectiveNodes,
        runtime.errors,
        model.dynamicBranches,
        conditionState.activeBranchIds,
        runtime.formErrors,
      ),
    [conditionState.activeBranchIds, effectiveNodes, model.dynamicBranches, runtime.errors, runtime.formErrors],
  )
  const isOpenControlled = open !== undefined
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen ?? false)
  const resolvedOpen = isOpenControlled ? open : uncontrolledOpen
  const formId = React.useId()
  const [activeStepIndex, setActiveStepIndex] = React.useState(0)
  const [actionSubmitPending, setActionSubmitPending] = React.useState(false)
  const actionSubmitPendingRef = React.useRef(false)
  const dirtyGuardOptions = typeof dirtyGuard === 'object' ? dirtyGuard : undefined
  const dirtyGuardEnabled = dirtyGuard === true || (dirtyGuardOptions != null && dirtyGuardOptions.enabled !== false)
  const formDirtyGuard = useDirtyGuard<AutoFormDirtyGuardContext>({ isDirty: () => runtime.isDirty })
  const steps = model.steps ?? []
  const stepFieldPaths = React.useMemo(
    () => buildStepFieldPaths(effectiveNodes, model.steps),
    [effectiveNodes, model.steps],
  )

  const applyOpenChange = React.useCallback(
    (next: boolean) => {
      if (!isOpenControlled) {
        setUncontrolledOpen(next)
      }
      onOpenChange?.(next)
    },
    [isOpenControlled, onOpenChange],
  )

  const getDirtyGuardContext = React.useCallback(
    (action: AutoFormDirtyGuardAction): AutoFormDirtyGuardContext => ({
      action,
      values: runtime.values,
      dirtyFields: runtime.dirtyFields,
    }),
    [runtime.dirtyFields, runtime.values],
  )

  const handleOpenChange = React.useCallback(
    (next: boolean) => {
      if (next || !dirtyGuardEnabled) {
        applyOpenChange(next)
        return
      }

      void formDirtyGuard.confirmOrRun(() => applyOpenChange(false), getDirtyGuardContext('close'))
    },
    [applyOpenChange, dirtyGuardEnabled, formDirtyGuard, getDirtyGuardContext],
  )

  const handleCancel = React.useCallback(() => {
    const cancelAction = () => {
      onCancel?.()
      if (isDialog) {
        applyOpenChange(false)
      }
    }

    if (!dirtyGuardEnabled) {
      cancelAction()
      return
    }

    void formDirtyGuard.confirmOrRun(cancelAction, getDirtyGuardContext('cancel'))
  }, [applyOpenChange, dirtyGuardEnabled, formDirtyGuard, getDirtyGuardContext, isDialog, onCancel])

  const handleSubmit = React.useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      let submittedValues: AutoFormModelRendererValues | null = null
      let submitResult: boolean | undefined
      const result = await runtime.submit(async (nextValues, helpers, runtimeState) => {
        const prunedValues = pruneInactiveDynamicBranchValues(
          nextValues,
          model.dynamicBranches,
          conditionState.activeBranchIds,
        )
        submittedValues = prunedValues
        const nextSubmitResult = await onSubmit?.(prunedValues, helpers, {
          errors: runtimeState.errors,
          formErrors: runtimeState.formErrors,
          submitCount: runtimeState.submitCount,
          isSubmitting: runtimeState.isSubmitting,
          isValid: runtimeState.isValid,
        })
        submitResult = typeof nextSubmitResult === 'boolean' ? nextSubmitResult : undefined
      })
      if (result.success && submitResult !== false) {
        onSubmitSuccess?.(
          submittedValues ??
            pruneInactiveDynamicBranchValues(
              result.state.values,
              model.dynamicBranches,
              conditionState.activeBranchIds,
            ),
        )
      }
      if (result.success && isDialog && closeOnSubmit) {
        applyOpenChange(false)
      }
    },
    [
      applyOpenChange,
      closeOnSubmit,
      conditionState.activeBranchIds,
      isDialog,
      model.dynamicBranches,
      onSubmit,
      onSubmitSuccess,
      runtime,
    ],
  )
  const handleActionSubmit = React.useCallback(async () => {
    if (actionSubmitPendingRef.current) return

    const result = runtime.validateSubmit()
    if (!result.success) return

    actionSubmitPendingRef.current = true
    setActionSubmitPending(true)
    try {
      const prunedValues = pruneInactiveDynamicBranchValues(
        result.state.values,
        model.dynamicBranches,
        conditionState.activeBranchIds,
      )
      const submitResult = await onSubmit?.(
        prunedValues,
        {
          setServerErrors: runtime.setServerErrors,
          setFormErrors: runtime.setFormErrors,
          clearServerErrors: runtime.clearServerErrors,
        },
        {
          errors: result.state.errors,
          formErrors: result.state.formErrors,
          submitCount: result.state.submitCount,
          isSubmitting: true,
          isValid: result.state.isValid,
        },
      )
      if (submitResult !== false) {
        onSubmitSuccess?.(prunedValues)
      }
      if (isDialog && closeOnSubmit) {
        applyOpenChange(false)
      }
    } finally {
      actionSubmitPendingRef.current = false
      setActionSubmitPending(false)
    }
  }, [
    closeOnSubmit,
    conditionState.activeBranchIds,
    applyOpenChange,
    isDialog,
    model.dynamicBranches,
    onSubmit,
    onSubmitSuccess,
    runtime,
  ])

  const validateStep = React.useCallback(
    (stepIndex: number) => {
      const step = steps[stepIndex]
      if (!step) return true
      const stepPaths = stepFieldPaths[step.id] ?? []
      const nextState = runtime.touchFields(stepPaths)
      return stepPaths.every(path => !nextState.errors[path]?.length)
    },
    [runtime, stepFieldPaths, steps],
  )

  const handleStepChange = React.useCallback(
    (nextIndex: number) => {
      if (steps.length === 0) return
      if (nextIndex <= activeStepIndex) {
        setActiveStepIndex(nextIndex)
        return
      }
      if (validateStep(activeStepIndex)) {
        setActiveStepIndex(nextIndex)
      }
    },
    [activeStepIndex, steps.length, validateStep],
  )

  React.useEffect(() => {
    if (steps.length === 0) {
      setActiveStepIndex(0)
      return
    }

    setActiveStepIndex(current => Math.min(current, steps.length - 1))
  }, [steps])

  const actionButtons =
    showActions && steps.length === 0 ? (
      <Flex justify="end" gap="2" wrap="wrap" className={autoFormActionSlot}>
        {isDialog ? (
          <Button
            type="button"
            size={cancelButtonProps?.size}
            variant={cancelButtonProps?.variant ?? 'outline'}
            color={cancelButtonProps?.color}
            radius={cancelButtonProps?.radius}
            highContrast={cancelButtonProps?.highContrast}
            disabled={cancelDisabled || runtime.isSubmitting || actionSubmitPending}
            onClick={handleCancel}
          >
            {cancelLabel}
          </Button>
        ) : onCancel ? (
          <Button
            type="button"
            size={cancelButtonProps?.size}
            variant={cancelButtonProps?.variant ?? 'outline'}
            color={cancelButtonProps?.color}
            radius={cancelButtonProps?.radius}
            highContrast={cancelButtonProps?.highContrast}
            disabled={cancelDisabled || runtime.isSubmitting || actionSubmitPending}
            onClick={handleCancel}
          >
            {cancelLabel}
          </Button>
        ) : null}
        <Button
          type={submitMode === 'button' ? 'button' : 'submit'}
          form={submitMode === 'submit' ? formId : undefined}
          color={submitButtonProps?.color ?? 'primary'}
          size={submitButtonProps?.size}
          variant={submitButtonProps?.variant}
          radius={submitButtonProps?.radius}
          highContrast={submitButtonProps?.highContrast}
          disabled={submitDisabled || runtime.isSubmitting || actionSubmitPending}
          onClick={submitMode === 'button' ? handleActionSubmit : undefined}
        >
          {runtime.isSubmitting || actionSubmitPending ? 'Submitting...' : submitLabel}
        </Button>
      </Flex>
    ) : null
  const placedActions = actionButtons && renderActions ? renderActions(actionButtons) : null
  const dirtyGuardDialog = dirtyGuardEnabled ? (
    <DirtyGuardDialog
      guard={formDirtyGuard}
      title={dirtyGuardOptions?.title}
      description={dirtyGuardOptions?.description}
      cancelLabel={dirtyGuardOptions?.cancelLabel}
      confirmLabel={dirtyGuardOptions?.confirmLabel}
      confirmColor={dirtyGuardOptions?.confirmColor}
      size={dirtyGuardOptions?.size}
      onConfirmError={dirtyGuardOptions?.onConfirmError}
    />
  ) : null

  const formContent = (
    <form id={formId} className={cn(autoFormResponsiveContainer, bodyClassName)} onSubmit={handleSubmit} noValidate>
      {steps.length > 0 ? (
        <Stepper
          steps={steps.map(step => ({
            id: step.id,
            title: step.title,
            description: step.description,
            content: (
              <FieldGroup size={fieldSize} variant={fieldVariant} layout="stacked" gap={fieldGap}>
                {renderNodes(
                  getStepNodes(effectiveNodes, step),
                  resolvedValues ?? {},
                  runtime.errors,
                  runtime.submitCount,
                  runtime.setValue,
                  runtime.touchField,
                  repeaterRowIdsRef,
                  repeaterRowIdCounterRef,
                  conditionState,
                  renderField,
                  fieldGap,
                  fieldSize,
                  fieldVariant,
                  sectionChrome,
                )}
              </FieldGroup>
            ),
          }))}
          value={activeStepIndex}
          onValueChange={next => handleStepChange(next)}
          allowStepSelect={stepperAllowStepSelect}
          showControls
          renderFooter={({ activeIndex, canGoNext, canGoPrevious, goNext, goPrevious, steps }) => (
            <Flex justify="between" align="center" gap="3" wrap="wrap">
              <div className="text-sm text-muted-foreground">
                Step {activeIndex + 1} of {steps.length}
              </div>
              <Flex gap="2" wrap="wrap">
                <Button type="button" variant="outline" onClick={goPrevious} disabled={!canGoPrevious}>
                  Back
                </Button>
                {canGoNext ? (
                  <Button
                    type="button"
                    onClick={() => {
                      if (validateStep(activeIndex)) {
                        goNext()
                      }
                    }}
                    disabled={runtime.isSubmitting}
                  >
                    Next
                  </Button>
                ) : null}
                {!canGoNext ? (
                  <Button
                    type="submit"
                    color={submitButtonProps?.color ?? 'primary'}
                    size={submitButtonProps?.size}
                    variant={submitButtonProps?.variant}
                    radius={submitButtonProps?.radius}
                    highContrast={submitButtonProps?.highContrast}
                    disabled={submitDisabled || runtime.isSubmitting}
                  >
                    {runtime.isSubmitting ? 'Submitting...' : submitLabel}
                  </Button>
                ) : null}
              </Flex>
            </Flex>
          )}
          className="w-full"
        />
      ) : (
        <>
          <FieldGroup size={fieldSize} variant={fieldVariant} layout="stacked" gap={fieldGap}>
            {renderNodes(
              effectiveNodes,
              resolvedValues ?? {},
              runtime.errors,
              runtime.submitCount,
              runtime.setValue,
              runtime.touchField,
              repeaterRowIdsRef,
              repeaterRowIdCounterRef,
              conditionState,
              renderField,
              fieldGap,
              fieldSize,
              fieldVariant,
              sectionChrome,
            )}
          </FieldGroup>
          {renderActions ? null : actionButtons}
        </>
      )}
      {formErrors.length > 0 ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          <div className="font-medium">Form errors</div>
          <ul className="mt-2 list-disc pl-5">
            {formErrors.map(({ key, message }) => (
              <li key={`${key}-${message}`}>{message}</li>
            ))}
          </ul>
        </div>
      ) : null}
      {showActions && steps.length > 0 && isDialog ? (
        <Flex justify="end" gap="2" wrap="wrap">
          <Button
            type="button"
            size={cancelButtonProps?.size}
            variant={cancelButtonProps?.variant ?? 'outline'}
            color={cancelButtonProps?.color}
            radius={cancelButtonProps?.radius}
            highContrast={cancelButtonProps?.highContrast}
            disabled={cancelDisabled || runtime.isSubmitting}
            onClick={handleCancel}
          >
            {cancelLabel}
          </Button>
        </Flex>
      ) : null}
    </form>
  )

  if (!isDialog) {
    return (
      <div className={className}>
        {formContent}
        {placedActions}
        {dirtyGuardDialog}
      </div>
    )
  }

  return (
    <Dialog.Root open={resolvedOpen} onOpenChange={handleOpenChange} defaultOpen={defaultOpen}>
      {trigger ? <Dialog.Trigger>{trigger}</Dialog.Trigger> : null}
      <Dialog.Content className={className}>
        <Dialog.Close />
        {(model.title || model.description) && (
          <Dialog.Header>
            {model.title ? <Dialog.Title>{model.title}</Dialog.Title> : null}
            {model.description ? <Dialog.Description>{model.description}</Dialog.Description> : null}
          </Dialog.Header>
        )}
        <Dialog.Body>{formContent}</Dialog.Body>
        {placedActions}
        {dirtyGuardDialog}
      </Dialog.Content>
    </Dialog.Root>
  )
}

function buildEffectiveRenderNodes(
  nodes: Array<AutoFormNormalizedSection | AutoFormNormalizedRenderableNode>,
  activeBranches: AutoFormNormalizedDynamicBranch[],
): Array<AutoFormNormalizedSection | AutoFormNormalizedRenderableNode> {
  if (activeBranches.length === 0) return nodes

  const branchesByBasePath = groupDynamicBranchesByBasePath(activeBranches)
  const rootBranches = activeBranches.filter(branch => branch.basePath.length === 0)
  const rootSectionBranches = rootBranches.filter(branch => branch.sectionId)
  const unsectionedRootNodes = rootBranches.filter(branch => !branch.sectionId).flatMap(branch => branch.nodes)

  const effectiveNodes: Array<AutoFormNormalizedSection | AutoFormNormalizedRenderableNode> = []

  for (const node of nodes) {
    if (node.kind === 'section') {
      const sectionBranchNodes = rootSectionBranches
        .filter(branch => branch.sectionId === node.id)
        .flatMap(branch => branch.nodes)

      effectiveNodes.push({
        ...node,
        nodes: sortRenderableNodes([
          ...node.nodes.map(child => materializeDynamicNodes(child, branchesByBasePath)),
          ...sectionBranchNodes,
        ]),
      })
    } else {
      effectiveNodes.push(materializeDynamicNodes(node, branchesByBasePath))
    }
  }

  if (unsectionedRootNodes.length === 0) {
    return effectiveNodes
  }

  return [...effectiveNodes, ...sortRenderableNodes(unsectionedRootNodes)]
}

function materializeDynamicNodes(
  node: AutoFormNormalizedRenderableNode,
  branchesByBasePath: Map<string, AutoFormNormalizedRenderableNode[]>,
): AutoFormNormalizedRenderableNode {
  if (node.kind === 'array') {
    return {
      ...node,
      itemNode:
        node.itemNode.kind === 'object-group'
          ? materializeDynamicObjectGroupNode(node.itemNode, branchesByBasePath)
          : node.itemNode,
    }
  }

  if (node.kind === 'object-group') {
    return materializeDynamicObjectGroupNode(node, branchesByBasePath)
  }

  return node
}

function materializeDynamicObjectGroupNode(
  node: AutoFormNormalizedObjectGroupNode,
  branchesByBasePath: Map<string, AutoFormNormalizedRenderableNode[]>,
): AutoFormNormalizedObjectGroupNode {
  const dynamicChildren = branchesByBasePath.get(node.path) ?? []

  return {
    ...node,
    nodes: sortRenderableNodes([
      ...node.nodes.map(child => materializeDynamicNodes(child, branchesByBasePath)),
      ...dynamicChildren,
    ]),
  }
}

function groupDynamicBranchesByBasePath(activeBranches: AutoFormNormalizedDynamicBranch[]) {
  const branchesByBasePath = new Map<string, AutoFormNormalizedRenderableNode[]>()

  for (const branch of activeBranches) {
    if (branch.basePath.length === 0) continue

    const existing = branchesByBasePath.get(branch.basePath) ?? []
    branchesByBasePath.set(branch.basePath, sortRenderableNodes([...existing, ...branch.nodes]))
  }

  return branchesByBasePath
}

function sortRenderableNodes(nodes: AutoFormNormalizedRenderableNode[]) {
  return [...nodes].sort((a, b) => {
    const orderA = a.order ?? Number.MAX_SAFE_INTEGER
    const orderB = b.order ?? Number.MAX_SAFE_INTEGER

    if (orderA !== orderB) {
      return orderA - orderB
    }

    return a.path.localeCompare(b.path)
  })
}

function getStepNodes(
  nodes: Array<AutoFormNormalizedSection | AutoFormNormalizedRenderableNode>,
  step: AutoFormNormalizedStep,
) {
  return nodes.filter(node => node.kind === 'section' && step.sectionIds.includes(node.id))
}

function buildStepFieldPaths(
  nodes: Array<AutoFormNormalizedSection | AutoFormNormalizedRenderableNode>,
  steps: AutoFormNormalizedStep[] | undefined,
) {
  if (!steps?.length) return {}

  const sectionMap = new Map(
    nodes.filter((node): node is AutoFormNormalizedSection => node.kind === 'section').map(node => [node.id, node]),
  )

  return Object.fromEntries(
    steps.map(step => [
      step.id,
      step.sectionIds.flatMap(sectionId => collectRenderableFieldPaths(sectionMap.get(sectionId)?.nodes ?? [])),
    ]),
  ) satisfies Record<string, string[]>
}

function collectRenderableFieldPaths(nodes: AutoFormNormalizedRenderableNode[]): string[] {
  return nodes.flatMap(node => {
    if (node.kind === 'field') return [node.path]
    if (node.kind === 'array') return [node.path]
    return collectRenderableFieldPaths(node.nodes)
  })
}

function renderNodes(
  nodes: Array<AutoFormNormalizedSection | AutoFormNormalizedRenderableNode>,
  values: AutoFormModelRendererValues,
  errors: Record<string, string[]>,
  submitCount: number,
  setFieldValue: (path: string, nextValue: unknown) => void,
  touchField: (path: string) => void,
  repeaterRowIdsRef: React.MutableRefObject<Record<string, string[]>>,
  repeaterRowIdCounterRef: React.MutableRefObject<number>,
  conditionState: AutoFormConditionState,
  renderField: AutoFormModelRendererProps['renderField'],
  fieldGap: Spacing,
  fieldSize: Size,
  fieldVariant: TextFieldVariant,
  sectionChrome: AutoFormSectionChrome,
  repeaterScopeKey?: string,
) {
  return nodes.map((node, index) => {
    if (node.kind === 'section') {
      const visibleChildren = node.nodes.filter(child => hasVisibleContent(child, conditionState))
      if (visibleChildren.length === 0) {
        return null
      }

      const sectionContent = (
        <FieldGroup
          size={fieldSize}
          variant={fieldVariant}
          layout={usesGridLayout(node.columns) ? 'grid' : 'stacked'}
          columns={resolveGridColumns(node.columns)}
          gap={fieldGap}
        >
          {visibleChildren.map(child =>
            renderRenderableNode(
              child,
              values,
              errors,
              submitCount,
              setFieldValue,
              touchField,
              repeaterRowIdsRef,
              repeaterRowIdCounterRef,
              conditionState,
              renderField,
              fieldGap,
              fieldSize,
              fieldVariant,
              repeaterScopeKey,
              node.layout,
              node.labelPlacement,
            ),
          )}
        </FieldGroup>
      )

      if (sectionChrome === 'none') {
        return (
          <div key={node.id} className={cn('min-w-0', index > 0 ? 'mt-2' : undefined)}>
            {sectionContent}
          </div>
        )
      }

      return (
        <Fieldset key={node.id} legend={node.title} className={cn(index > 0 ? 'mt-2' : undefined)}>
          {sectionContent}
        </Fieldset>
      )
    }

    if (isNodeHidden(node, conditionState)) {
      return null
    }

    return renderRenderableNode(
      node,
      values,
      errors,
      submitCount,
      setFieldValue,
      touchField,
      repeaterRowIdsRef,
      repeaterRowIdCounterRef,
      conditionState,
      renderField,
      fieldGap,
      fieldSize,
      fieldVariant,
      repeaterScopeKey,
      undefined,
      undefined,
    )
  })
}

function renderRenderableNode(
  node: AutoFormNormalizedRenderableNode,
  values: AutoFormModelRendererValues,
  errors: Record<string, string[]>,
  submitCount: number,
  setFieldValue: (path: string, nextValue: unknown) => void,
  touchField: (path: string) => void,
  repeaterRowIdsRef: React.MutableRefObject<Record<string, string[]>>,
  repeaterRowIdCounterRef: React.MutableRefObject<number>,
  conditionState: AutoFormConditionState,
  renderField: AutoFormModelRendererProps['renderField'],
  fieldGap: Spacing,
  fieldSize: Size,
  fieldVariant: TextFieldVariant,
  repeaterScopeKey?: string,
  sectionLayout?: AutoFormNormalizedResponsiveValue<AutoFormSectionLayout>,
  sectionLabelPlacement?: AutoFormNormalizedResponsiveValue<AutoFormLabelPlacement>,
) {
  if (node.kind === 'field') {
    const defaultRender = renderFieldNode(
      node,
      values,
      errors,
      submitCount,
      setFieldValue,
      touchField,
      conditionState,
      sectionLayout,
      sectionLabelPlacement,
    )
    return (
      <div key={node.path} className={cn('min-w-0', getColumnClassName(node.colSpan))}>
        {renderField ? renderField(node, defaultRender, values) : defaultRender}
      </div>
    )
  }

  if (node.kind === 'object-group') {
    if (!hasVisibleContent(node, conditionState)) {
      return null
    }

    const visibleChildren = node.nodes.filter(child => hasVisibleContent(child, conditionState))
    const objectGroupColumns = resolveObjectGroupColumns(visibleChildren)
    const objectGroupUsesGrid = objectGroupColumns !== '1'

    return (
      <Fieldset
        key={node.path}
        legend={node.label ?? node.key}
        description={node.description}
        className={cn('bg-muted/20', getColumnClassName(node.colSpan))}
      >
        <FieldGroup
          size={fieldSize}
          variant={fieldVariant}
          layout={objectGroupUsesGrid ? 'grid' : 'stacked'}
          columns={objectGroupUsesGrid ? objectGroupColumns : undefined}
          gap={fieldGap}
        >
          {visibleChildren.map(child =>
            renderRenderableNode(
              child,
              values,
              errors,
              submitCount,
              setFieldValue,
              touchField,
              repeaterRowIdsRef,
              repeaterRowIdCounterRef,
              conditionState,
              renderField,
              fieldGap,
              fieldSize,
              fieldVariant,
              repeaterScopeKey,
              sectionLayout,
              sectionLabelPlacement,
            ),
          )}
        </FieldGroup>
      </Fieldset>
    )
  }

  return renderArrayNode(
    node,
    values,
    errors,
    submitCount,
    setFieldValue,
    touchField,
    repeaterRowIdsRef,
    repeaterRowIdCounterRef,
    conditionState,
    renderField,
    fieldGap,
    fieldSize,
    fieldVariant,
    repeaterScopeKey,
    sectionLayout,
    sectionLabelPlacement,
  )
}

function renderFieldNode(
  node: AutoFormNormalizedFieldNode,
  values: AutoFormModelRendererValues,
  errors: Record<string, string[]>,
  submitCount: number,
  setFieldValue: (path: string, nextValue: unknown) => void,
  touchField: (path: string) => void,
  conditionState: AutoFormConditionState,
  sectionLayout?: AutoFormNormalizedResponsiveValue<AutoFormSectionLayout>,
  sectionLabelPlacement?: AutoFormNormalizedResponsiveValue<AutoFormLabelPlacement>,
) {
  const value = getValueAtPath(values, node.path)
  const fieldId = `autoform-model-field-${node.path.replace(/\./g, '-')}`
  const fieldErrors = errors[node.path] ?? []
  const showErrors = submitCount > 0 || fieldErrors.length > 0
  const fieldError = showErrors ? fieldErrors[0] : undefined
  const mergedLayout = mergeResponsiveValue(sectionLayout, node.layout) as
    | AutoFormNormalizedResponsiveValue<AutoFormFieldLayout>
    | undefined
  const mergedLabelPlacement = mergeResponsiveValue(sectionLabelPlacement, node.labelPlacement)
  const booleanLayout = normalizeBooleanFieldLayout(mergedLayout)

  if (node.fieldType === 'boolean') {
    const isDisabled = Boolean(conditionState.disabled[node.path])
    const isReadOnly = Boolean(conditionState.readOnly[node.path])
    const isUnavailable = isDisabled || isReadOnly

    return (
      <div className="space-y-2">
        <div className={getResponsiveBooleanLabelClasses(booleanLayout, 'top')}>
          <Label htmlFor={fieldId} disabled={isUnavailable}>
            {node.label ?? node.key}
          </Label>
        </div>
        {/* Reserve vertical space to align checkbox rows with labeled fields in grid layout. */}
        <div aria-hidden="true" className={getResponsiveBooleanLabelClasses(booleanLayout, 'spacer')}>
          <Label>{node.label ?? node.key}</Label>
        </div>
        <Flex align="center" gap="2">
          <Checkbox
            id={fieldId}
            checked={Boolean(value)}
            disabled={isUnavailable}
            onCheckedChange={checked => {
              touchField(node.path)
              setFieldValue(node.path, Boolean(checked))
            }}
          />
          <Label
            htmlFor={fieldId}
            disabled={isUnavailable}
            className={getResponsiveBooleanLabelClasses(booleanLayout, 'inline')}
          >
            {node.label ?? node.key}
          </Label>
        </Flex>
        {node.help ? (
          <p className={cn('text-sm text-muted-foreground', isUnavailable && 'opacity-70')}>{node.help}</p>
        ) : null}
        {fieldError ? <p className="text-sm text-destructive">{fieldError}</p> : null}
      </div>
    )
  }

  const fieldWrapperClassName = getResponsiveFieldWrapperClassName(mergedLayout)
  const fieldLabelClassName = getResponsiveFieldLabelClassName(mergedLayout, mergedLabelPlacement)
  const fieldBodyClassName = getResponsiveFieldBodyClassName(mergedLayout, mergedLabelPlacement)
  const labelId = `${fieldId}-label`

  return (
    <div className={fieldWrapperClassName}>
      <Label id={labelId} htmlFor={fieldId} className={fieldLabelClassName}>
        {node.label ?? node.key}
      </Label>
      <div className={fieldBodyClassName}>
        {renderFieldInput(node, fieldId, labelId, value, fieldError, setFieldValue, touchField, conditionState)}
        {node.help ? <p className="text-sm text-muted-foreground">{node.help}</p> : null}
        {fieldError ? <p className="text-sm text-destructive">{fieldError}</p> : null}
      </div>
    </div>
  )
}

function renderArrayNode(
  node: AutoFormNormalizedArrayNode,
  values: AutoFormModelRendererValues,
  errors: Record<string, string[]>,
  submitCount: number,
  setFieldValue: (path: string, nextValue: unknown) => void,
  touchField: (path: string) => void,
  repeaterRowIdsRef: React.MutableRefObject<Record<string, string[]>>,
  repeaterRowIdCounterRef: React.MutableRefObject<number>,
  conditionState: AutoFormConditionState,
  renderField: AutoFormModelRendererProps['renderField'],
  fieldGap: Spacing,
  fieldSize: Size,
  fieldVariant: TextFieldVariant,
  repeaterScopeKey?: string,
  sectionLayout?: AutoFormNormalizedResponsiveValue<AutoFormSectionLayout>,
  sectionLabelPlacement?: AutoFormNormalizedResponsiveValue<AutoFormLabelPlacement>,
) {
  const value = getValueAtPath(values, node.path)
  const items = Array.isArray(value) ? value : []
  const repeaterStoreKey = getRepeaterStoreKey(node, repeaterScopeKey)
  const rowIds = getRepeaterRowIds(repeaterStoreKey, items.length, repeaterRowIdsRef, repeaterRowIdCounterRef)
  const fieldId = `autoform-model-field-${node.path.replace(/\./g, '-')}`
  const labelId = `${fieldId}-label`
  const mergedLayout = mergeResponsiveValue(sectionLayout, node.layout) as
    | AutoFormNormalizedResponsiveValue<AutoFormFieldLayout>
    | undefined
  const mergedLabelPlacement = mergeResponsiveValue(sectionLabelPlacement, node.labelPlacement)
  const arraySelectionInput = renderArraySelectionInput(
    node,
    fieldId,
    labelId,
    items,
    errors[node.path]?.[0],
    setFieldValue,
    touchField,
    conditionState,
  )

  if (arraySelectionInput) {
    const fieldErrors = errors[node.path] ?? []
    const showErrors = submitCount > 0 || fieldErrors.length > 0
    const fieldError = showErrors ? fieldErrors[0] : undefined
    const fieldWrapperClassName = getResponsiveFieldWrapperClassName(mergedLayout)
    const fieldLabelClassName = getResponsiveFieldLabelClassName(mergedLayout, mergedLabelPlacement)
    const fieldBodyClassName = getResponsiveFieldBodyClassName(mergedLayout, mergedLabelPlacement)

    return (
      <div key={node.path} className={cn(getColumnClassName(node.colSpan), fieldWrapperClassName)}>
        <Label id={labelId} className={fieldLabelClassName}>
          {node.label ?? node.key}
        </Label>
        <div className={fieldBodyClassName}>
          {arraySelectionInput}
          {node.help ? <p className="text-sm text-muted-foreground">{node.help}</p> : null}
          {fieldError ? <p className="text-sm text-destructive">{fieldError}</p> : null}
        </div>
      </div>
    )
  }

  const minItems = node.minItems ?? 0
  const maxItems = node.maxItems
  const canAddItems = maxItems === undefined || items.length < maxItems
  const fieldErrors = errors[node.path] ?? []
  const showErrors = submitCount > 0 || fieldErrors.length > 0
  const fieldError = showErrors ? fieldErrors[0] : undefined

  return (
    <div key={node.path} className={cn('space-y-3', getColumnClassName(node.colSpan))}>
      <Flex align="center" justify="between" gap="3" wrap="wrap">
        <div className="space-y-1">
          <div className="text-sm font-medium text-foreground">{node.label ?? node.key}</div>
          {node.help ? <p className="text-sm text-muted-foreground">{node.help}</p> : null}
        </div>
        <Button
          type="button"
          variant="outline"
          aria-label={getAddArrayItemLabel(node)}
          disabled={!canAddItems}
          onClick={() => {
            touchField(node.path)
            insertRepeaterRowId(repeaterStoreKey, items.length, repeaterRowIdsRef, repeaterRowIdCounterRef)
            setFieldValue(node.path, [...items, buildArrayItemDefaultValue(node.itemNode)])
          }}
        >
          {getAddArrayItemButtonText(node)}
        </Button>
      </Flex>

      {minItems > 0 || maxItems !== undefined ? (
        <p className="text-sm text-muted-foreground">
          {formatRepeaterConstraintHint(items.length, minItems, maxItems)}
        </p>
      ) : null}

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-muted/20 p-4 text-sm text-muted-foreground">
          {getEmptyArrayStateText(node)}
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((itemValue, index) => {
            const itemNode = materializeArrayItemNode(node.itemNode, index, node)
            const canMoveUp = index > 0
            const canMoveDown = index < items.length - 1
            const canRemoveItem = items.length > minItems
            const canDuplicateItem = maxItems === undefined || items.length < maxItems
            const itemLabel = getArrayItemLabel(node, index)

            return (
              <div
                key={rowIds[index] ?? `${node.path}-${index}`}
                className="rounded-2xl border border-border bg-background p-4 shadow-sm"
              >
                <Flex align="center" justify="between" gap="3" wrap="wrap">
                  <div className="text-sm font-medium text-foreground">
                    {getArrayItemHeading(node, index, itemValue)}
                  </div>
                  <Flex align="center" gap="2" wrap="wrap">
                    <Button
                      type="button"
                      variant="ghost"
                      aria-label={`Move ${itemLabel} up`}
                      disabled={!canMoveUp}
                      onClick={() => {
                        touchField(node.path)
                        moveRepeaterRowId(repeaterStoreKey, index, index - 1, repeaterRowIdsRef)
                        setFieldValue(node.path, moveArrayItem(items, index, index - 1))
                      }}
                    >
                      Move up
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      aria-label={`Move ${itemLabel} down`}
                      disabled={!canMoveDown}
                      onClick={() => {
                        touchField(node.path)
                        moveRepeaterRowId(repeaterStoreKey, index, index + 1, repeaterRowIdsRef)
                        setFieldValue(node.path, moveArrayItem(items, index, index + 1))
                      }}
                    >
                      Move down
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      aria-label={`Duplicate ${itemLabel}`}
                      disabled={!canDuplicateItem}
                      onClick={() => {
                        touchField(node.path)
                        insertRepeaterRowId(repeaterStoreKey, index + 1, repeaterRowIdsRef, repeaterRowIdCounterRef)
                        setFieldValue(node.path, duplicateArrayItem(items, index))
                      }}
                    >
                      Duplicate
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      aria-label={`Remove ${itemLabel}`}
                      disabled={!canRemoveItem}
                      onClick={() => {
                        touchField(node.path)
                        removeRepeaterRowId(repeaterStoreKey, index, repeaterRowIdsRef)
                        setFieldValue(
                          node.path,
                          items.filter((_, itemIndex) => itemIndex !== index),
                        )
                      }}
                    >
                      Remove
                    </Button>
                  </Flex>
                </Flex>

                <div className="mt-4">
                  {itemNode.kind === 'field'
                    ? renderField
                      ? renderField(
                          itemNode,
                          renderFieldNode(
                            itemNode,
                            values,
                            errors,
                            submitCount,
                            setFieldValue,
                            touchField,
                            conditionState,
                            sectionLayout,
                            sectionLabelPlacement,
                          ),
                          values,
                        )
                      : renderFieldNode(
                          itemNode,
                          values,
                          errors,
                          submitCount,
                          setFieldValue,
                          touchField,
                          conditionState,
                          sectionLayout,
                          sectionLabelPlacement,
                        )
                    : renderRenderableNode(
                        itemNode,
                        values,
                        errors,
                        submitCount,
                        setFieldValue,
                        touchField,
                        repeaterRowIdsRef,
                        repeaterRowIdCounterRef,
                        conditionState,
                        renderField,
                        fieldGap,
                        fieldSize,
                        fieldVariant,
                        getRepeaterItemScopeKey(repeaterStoreKey, rowIds[index] ?? `${index}`),
                        sectionLayout,
                        sectionLabelPlacement,
                      )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {fieldError ? <p className="text-sm text-destructive">{fieldError}</p> : null}
    </div>
  )
}

function moveArrayItem(items: unknown[], fromIndex: number, toIndex: number) {
  if (fromIndex === toIndex) return items
  if (fromIndex < 0 || fromIndex >= items.length) return items
  if (toIndex < 0 || toIndex >= items.length) return items

  const next = [...items]
  const [moved] = next.splice(fromIndex, 1)
  next.splice(toIndex, 0, moved)
  return next
}

function duplicateArrayItem(items: unknown[], index: number) {
  if (index < 0 || index >= items.length) return items

  const next = [...items]
  next.splice(index + 1, 0, cloneArrayItemValue(items[index]))
  return next
}

function cloneArrayItemValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(item => cloneArrayItemValue(item))
  if (isPlainObject(value)) {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, cloneArrayItemValue(item)]))
  }
  return value
}

function getRepeaterRowIds(
  path: string,
  length: number,
  rowIdsRef: React.MutableRefObject<Record<string, string[]>>,
  counterRef: React.MutableRefObject<number>,
) {
  const existing = rowIdsRef.current[path] ?? []
  if (existing.length === length) return existing

  const next = [...existing]
  while (next.length < length) {
    next.push(createRepeaterRowId(counterRef))
  }
  if (next.length > length) {
    next.length = length
  }

  rowIdsRef.current[path] = next
  return next
}

function insertRepeaterRowId(
  path: string,
  index: number,
  rowIdsRef: React.MutableRefObject<Record<string, string[]>>,
  counterRef: React.MutableRefObject<number>,
) {
  const next = [...(rowIdsRef.current[path] ?? [])]
  next.splice(index, 0, createRepeaterRowId(counterRef))
  rowIdsRef.current[path] = next
}

function removeRepeaterRowId(path: string, index: number, rowIdsRef: React.MutableRefObject<Record<string, string[]>>) {
  const next = [...(rowIdsRef.current[path] ?? [])]
  next.splice(index, 1)
  rowIdsRef.current[path] = next
}

function moveRepeaterRowId(
  path: string,
  fromIndex: number,
  toIndex: number,
  rowIdsRef: React.MutableRefObject<Record<string, string[]>>,
) {
  const next = [...(rowIdsRef.current[path] ?? [])]
  if (fromIndex < 0 || fromIndex >= next.length) return
  if (toIndex < 0 || toIndex >= next.length) return
  const [moved] = next.splice(fromIndex, 1)
  if (moved === undefined) return
  next.splice(toIndex, 0, moved)
  rowIdsRef.current[path] = next
}

function createRepeaterRowId(counterRef: React.MutableRefObject<number>) {
  counterRef.current += 1
  return `autoform-repeater-row-${counterRef.current}`
}

function formatRepeaterConstraintHint(itemCount: number, minItems: number, maxItems: number | undefined) {
  if (maxItems === undefined) {
    return `Minimum ${minItems} item${minItems === 1 ? '' : 's'} required; currently ${itemCount}.`
  }

  if (minItems === 0) {
    return `Maximum ${maxItems} item${maxItems === 1 ? '' : 's'}; currently ${itemCount}.`
  }

  return `Requires ${minItems}-${maxItems} item${maxItems === 1 ? '' : 's'}; currently ${itemCount}.`
}

function renderFieldInput(
  node: AutoFormNormalizedFieldNode,
  fieldId: string,
  labelId: string,
  value: unknown,
  error: string | undefined,
  setFieldValue: (path: string, nextValue: unknown) => void,
  touchField: (path: string) => void,
  conditionState: AutoFormConditionState,
) {
  const isDisabled = Boolean(conditionState.disabled[node.path])
  const isReadOnly = Boolean(conditionState.readOnly[node.path])
  const isRequired = node.required || Boolean(conditionState.required[node.path])
  const widgetProps = getWidgetProps(node.props)

  if (node.widget === 'mention-textarea') {
    const mentionTextareaConfig = getMentionTextareaWidgetConfig(widgetProps)

    return (
      <AutoFormMentionTextarea
        id={fieldId}
        value={typeof value === 'string' ? value : ''}
        placeholder={node.placeholder}
        required={isRequired}
        disabled={isDisabled}
        readOnly={isReadOnly}
        error={Boolean(error)}
        aria-invalid={error ? true : undefined}
        aria-labelledby={labelId}
        onBlur={() => touchField(node.path)}
        onValueChange={next => setFieldValue(node.path, next)}
        config={mentionTextareaConfig}
      />
    )
  }

  if (node.widget === 'avatar-picker') {
    const avatarPickerProps = getAvatarPickerWidgetProps(widgetProps)

    return (
      <AvatarPicker
        id={fieldId}
        ariaLabelledby={labelId}
        items={avatarPickerProps.items ?? []}
        value={typeof value === 'string' ? value : ''}
        onValueChange={next => {
          touchField(node.path)
          setFieldValue(node.path, Array.isArray(next) ? (next[0] ?? '') : next)
        }}
        placeholder={node.placeholder ?? avatarPickerProps.placeholder}
        searchPlaceholder={avatarPickerProps.searchPlaceholder}
        disabled={isDisabled || isReadOnly}
        error={Boolean(error)}
        searchable={avatarPickerProps.searchable}
        noResultsText={avatarPickerProps.noResultsText}
        maxHeight={avatarPickerProps.maxHeight}
      />
    )
  }

  if (node.widget === 'textarea') {
    return (
      <Textarea
        id={fieldId}
        value={typeof value === 'string' ? value : ''}
        placeholder={node.placeholder}
        required={isRequired}
        disabled={isDisabled}
        readOnly={isReadOnly}
        error={Boolean(error)}
        onChange={event => setFieldValue(node.path, event.target.value)}
        onBlur={() => touchField(node.path)}
      />
    )
  }

  if (node.widget === 'country-picker') {
    const countryPickerProps = getCountryPickerWidgetProps(widgetProps)

    return (
      <LocationInput
        label={countryPickerProps.label}
        size={countryPickerProps.size}
        variant={countryPickerProps.variant}
        color={countryPickerProps.color}
        radius={countryPickerProps.radius}
        value={typeof value === 'string' && value ? { countryCode: value } : undefined}
        defaultCountry={countryPickerProps.defaultCountry}
        showStateSelector={countryPickerProps.showStateSelector ?? false}
        countryPlaceholder={node.placeholder ?? countryPickerProps.countryPlaceholder ?? 'Select country'}
        statePlaceholder={countryPickerProps.statePlaceholder}
        disabled={isDisabled || isReadOnly}
        error={Boolean(error)}
        onChange={next => {
          touchField(node.path)
          setFieldValue(node.path, next.countryCode ?? '')
        }}
      />
    )
  }

  if (node.widget === 'tree-leaf-select' && node.fieldType === 'string') {
    const treeLeafSelectProps = getAutoFormTreeLeafSelectWidgetProps(widgetProps)

    return (
      <AutoFormTreeLeafSelect
        value={typeof value === 'string' ? value : ''}
        options={treeLeafSelectProps.options ?? []}
        pathSeparator={treeLeafSelectProps.pathSeparator}
        expandAll={treeLeafSelectProps.expandAll}
        showSelectedPath={treeLeafSelectProps.showSelectedPath}
        showDescription={treeLeafSelectProps.showDescription}
        disabled={isDisabled || isReadOnly}
        onChange={next => {
          touchField(node.path)
          setFieldValue(node.path, next)
        }}
      />
    )
  }

  if (node.widget === 'date-picker' || node.format === 'date') {
    const dateBounds = getDateRuleBounds(node, isDisabled, isReadOnly)
    const datePickerProps = getDatePickerWidgetProps(widgetProps)

    return (
      <DatePickerNext
        value={coerceDateValue(value, node.format)}
        minValue={dateBounds.minValue}
        maxValue={dateBounds.maxValue}
        isDisabled={dateBounds.isDisabled}
        placeholder={node.placeholder ?? datePickerProps.placeholder}
        enableNaturalLanguage={datePickerProps.enableNaturalLanguage}
        dateFormat={datePickerProps.dateFormat}
        size={datePickerProps.size}
        variant={datePickerProps.variant}
        color={datePickerProps.color}
        radius={datePickerProps.radius}
        onChange={next => {
          touchField(node.path)
          setFieldValue(node.path, next ? serializeDateValue(next, node.format) : '')
        }}
        ariaLabel={node.label ?? node.key}
      />
    )
  }

  if (node.widget === 'date-time-picker' || node.format === 'date-time') {
    const dateBounds = getDateRuleBounds(node, isDisabled, isReadOnly)
    const dateTimePickerProps = getDateTimePickerWidgetProps(widgetProps)

    return (
      <DateTimePickerNext
        value={coerceDateValue(value, node.format)}
        minValue={dateBounds.minValue}
        maxValue={dateBounds.maxValue}
        isDisabled={dateBounds.isDisabled}
        size={dateTimePickerProps.size}
        variant={dateTimePickerProps.variant}
        color={dateTimePickerProps.color}
        radius={dateTimePickerProps.radius}
        showSeconds={dateTimePickerProps.showSeconds}
        minuteStep={dateTimePickerProps.minuteStep}
        onChange={next => {
          touchField(node.path)
          setFieldValue(node.path, next ? serializeDateValue(next, node.format) : '')
        }}
        ariaLabel={node.label ?? node.key}
      />
    )
  }

  if (node.widget === 'time-picker' || node.format === 'time' || node.fieldType === 'time') {
    const timePickerProps = getTimePickerWidgetProps(widgetProps)

    return (
      <TimePickerNext
        value={coerceTimeValue(value)}
        isDisabled={isDisabled || isReadOnly}
        placeholder={node.placeholder ?? timePickerProps.placeholder}
        size={timePickerProps.size}
        color={timePickerProps.color}
        radius={timePickerProps.radius}
        showSeconds={timePickerProps.showSeconds}
        use12HourFormat={timePickerProps.use12HourFormat}
        minuteStep={timePickerProps.minuteStep}
        onChange={next => {
          touchField(node.path)
          setFieldValue(node.path, next ? serializeTimeValue(next, timePickerProps.showSeconds) : '')
        }}
        ariaLabel={node.label ?? node.key}
      />
    )
  }

  if (node.widget === 'combobox' || node.widget === 'autocomplete') {
    const comboboxProps = getComboboxWidgetProps(widgetProps)
    const enumOptions = mapStringEnumOptions(node.enumValues)

    return (
      <Combobox
        id={fieldId}
        ariaLabelledby={labelId}
        aria-invalid={error ? true : undefined}
        options={comboboxProps.options ?? enumOptions}
        value={typeof value === 'string' ? value : ''}
        placeholder={node.placeholder ?? comboboxProps.placeholder}
        noResultsText={comboboxProps.noResultsText}
        creatable={comboboxProps.creatable}
        disabled={isDisabled}
        readOnly={isReadOnly}
        error={Boolean(error)}
        size={comboboxProps.size}
        variant={comboboxProps.variant}
        color={comboboxProps.color}
        radius={comboboxProps.radius}
        onValueChange={next => {
          touchField(node.path)
          setFieldValue(node.path, next)
        }}
      />
    )
  }

  if (Array.isArray(node.enumValues) && node.enumValues.every(option => typeof option === 'string')) {
    return (
      <Select
        id={fieldId}
        value={typeof value === 'string' ? value : ''}
        placeholder={node.placeholder ?? `Select ${(node.label ?? node.key).toLowerCase()}`}
        disabled={isDisabled || isReadOnly}
        error={Boolean(error)}
        onValueChange={next => {
          touchField(node.path)
          setFieldValue(node.path, next)
        }}
      >
        {node.enumValues.map(option => (
          <SelectItem key={option} value={option}>
            {option}
          </SelectItem>
        ))}
      </Select>
    )
  }

  if (
    (node.fieldType === 'number' || node.fieldType === 'integer') &&
    (node.widget === undefined || node.widget === 'number-input')
  ) {
    const numberInputProps = getNumberInputWidgetProps(widgetProps)

    return (
      <NumberInput
        id={fieldId}
        value={coerceNumberInputValue(value)}
        placeholder={node.placeholder}
        required={isRequired}
        disabled={isDisabled}
        readOnly={isReadOnly}
        error={Boolean(error)}
        min={numberInputProps.min}
        max={numberInputProps.max}
        step={numberInputProps.step}
        variant={numberInputProps.variant}
        allowDecimal={numberInputProps.allowDecimal ?? node.fieldType !== 'integer'}
        size={numberInputProps.size}
        inputVariant={numberInputProps.inputVariant}
        color={numberInputProps.color}
        radius={numberInputProps.radius}
        iconButton={numberInputProps.iconButton}
        onBlur={() => touchField(node.path)}
        onValueChange={next => {
          setFieldValue(node.path, next)
        }}
      />
    )
  }

  return (
    <TextField
      id={fieldId}
      type={resolveInputType(node)}
      value={coerceTextValue(value, node.fieldType)}
      placeholder={node.placeholder}
      required={isRequired}
      disabled={isDisabled}
      readOnly={isReadOnly}
      error={Boolean(error)}
      onBlur={() => touchField(node.path)}
      onChange={event => {
        if (node.fieldType === 'number' || node.fieldType === 'integer') {
          const raw = event.target.value
          setFieldValue(node.path, raw === '' ? '' : Number(raw))
          return
        }
        setFieldValue(node.path, event.target.value)
      }}
    />
  )
}

function renderArraySelectionInput(
  node: AutoFormNormalizedArrayNode,
  fieldId: string,
  labelId: string,
  value: unknown[],
  error: string | undefined,
  setFieldValue: (path: string, nextValue: unknown) => void,
  touchField: (path: string) => void,
  conditionState: AutoFormConditionState,
) {
  const widgetProps = getArrayWidgetProps(node)
  const isDisabled = Boolean(conditionState.disabled[node.path])
  const isReadOnly = Boolean(conditionState.readOnly[node.path])
  const isRequired = node.required || Boolean(conditionState.required[node.path])

  if (node.widget === 'file-upload') {
    const fileUploadProps = getFileUploadWidgetProps(widgetProps)

    return (
      <FileUpload
        id={fieldId}
        aria-labelledby={labelId}
        aria-required={isRequired}
        value={value.filter(isUploadedFileValue)}
        onChange={next => {
          touchField(node.path)
          setFieldValue(node.path, next)
        }}
        accept={fileUploadProps.accept}
        maxSize={fileUploadProps.maxSize}
        maxFiles={typeof node.maxItems === 'number' ? node.maxItems : fileUploadProps.maxFiles}
        multiple={fileUploadProps.multiple ?? node.maxItems !== 1}
        disabled={isDisabled || isReadOnly}
        error={Boolean(error)}
        placeholder={node.placeholder ?? fileUploadProps.placeholder}
        description={fileUploadProps.description}
        variant={fileUploadProps.variant}
        size={fileUploadProps.size}
        radius={fileUploadProps.radius}
        showFileList={fileUploadProps.showFileList}
        showStatusSections={fileUploadProps.showStatusSections}
      />
    )
  }

  if (isStringArraySelectionNode(node)) {
    const multiSelectProps = getMultiSelectWidgetProps(widgetProps)
    const enumOptions = node.itemNode.kind === 'field' ? mapStringEnumOptions(node.itemNode.enumValues) : []

    return (
      <MultiSelect
        id={fieldId}
        ariaLabelledby={labelId}
        options={multiSelectProps.options ?? enumOptions}
        value={value.filter((item): item is string => typeof item === 'string')}
        onChange={next => {
          touchField(node.path)
          setFieldValue(node.path, next)
        }}
        placeholder={node.placeholder ?? multiSelectProps.placeholder}
        maxSelected={typeof node.maxItems === 'number' ? node.maxItems : multiSelectProps.maxSelected}
        error={Boolean(error)}
        searchable={multiSelectProps.searchable}
        searchPlaceholder={multiSelectProps.searchPlaceholder}
        maxSelectedText={multiSelectProps.maxSelectedText}
        showBadges={multiSelectProps.showBadges}
        maxVisibleBadges={multiSelectProps.maxVisibleBadges}
        creatable={multiSelectProps.creatable ?? enumOptions.length === 0}
      />
    )
  }

  return null
}

function AutoFormTreeLeafSelect({
  value,
  options,
  pathSeparator = '/',
  expandAll = true,
  showSelectedPath = true,
  showDescription = true,
  disabled,
  onChange,
}: {
  value: string
  options: AutoFormTreeLeafSelectOptionProps[]
  pathSeparator?: string
  expandAll?: boolean
  showSelectedPath?: boolean
  showDescription?: boolean
  disabled?: boolean
  onChange: (value: string) => void
}) {
  const treeData = React.useMemo(
    () => buildTreeLeafSelectData(options, pathSeparator, disabled),
    [disabled, options, pathSeparator],
  )
  const selectedItemId = value ? getTreeLeafSelectItemId(value) : undefined
  const selectedOption = options.find(option => option.value === value)
  const selectedPath = value
    ? value
        .split(pathSeparator)
        .map(segment => formatTreeLeafSegment(segment))
        .join(' -> ')
    : ''

  return (
    <div className="grid min-w-0 gap-2">
      <div className="rounded-md border border-[var(--color-neutral-border)] bg-background p-2">
        <TreeView.Root
          data={treeData}
          size="sm"
          expandAll={expandAll}
          autoExpandSelected={false}
          selectedItemId={selectedItemId}
          onSelectChange={item => {
            if (disabled || !item?.id.startsWith('tree-leaf-select:')) return
            onChange(item.id.slice('tree-leaf-select:'.length))
          }}
          renderItem={params => {
            const checked = params.item.id === selectedItemId
            const icon = params.isOpen ? 'list' : 'shapes'
            return (
              <>
                {params.isLeaf ? (
                  <span
                    aria-hidden="true"
                    className="flex size-4 shrink-0 items-center justify-center rounded-full border bg-background"
                    style={{
                      borderColor: checked ? 'var(--color-primary-primary)' : 'var(--color-neutral-border)',
                    }}
                  >
                    {checked ? (
                      <span
                        className="size-2 rounded-full"
                        style={{ backgroundColor: 'var(--color-primary-primary)' }}
                      />
                    ) : null}
                  </span>
                ) : (
                  <Icon icon={icon} size="xs" style={{ color: 'currentColor' }} />
                )}
                <span className="min-w-0 flex-1 truncate">{params.item.name}</span>
              </>
            )
          }}
        />
      </div>
      {showSelectedPath && selectedPath ? <p className="text-xs font-medium text-foreground">{selectedPath}</p> : null}
      {showDescription && selectedOption?.description ? (
        <p className="text-xs text-muted-foreground">{selectedOption.description}</p>
      ) : null}
    </div>
  )
}

function buildTreeLeafSelectData(
  options: AutoFormTreeLeafSelectOptionProps[],
  pathSeparator: string,
  disabled: boolean | undefined,
): TreeDataItem[] {
  const roots: TreeDataItem[] = []
  const groups = new Map<string, TreeDataItem>()

  function getGroup(path: string[]): TreeDataItem {
    const id = `tree-leaf-select-group:${path.join(pathSeparator)}`
    const existing = groups.get(id)
    if (existing != null) return existing

    const group: TreeDataItem = {
      id,
      name: formatTreeLeafSegment(path.at(-1) ?? 'Items'),
      children: [],
    }
    groups.set(id, group)

    if (path.length === 1) {
      roots.push(group)
    } else {
      const parent = getGroup(path.slice(0, -1))
      parent.children = [...(parent.children ?? []), group]
    }

    return group
  }

  for (const option of options) {
    const path = option.value
      .split(pathSeparator)
      .map(segment => segment.trim())
      .filter(Boolean)
    const parentPath = path.slice(0, -1)
    const item: TreeDataItem = {
      id: getTreeLeafSelectItemId(option.value),
      name: option.label,
      disabled: disabled || option.disabled,
      className: 'data-[selected]:!bg-transparent data-[selected]:!text-inherit',
    }

    if (parentPath.length === 0) {
      roots.push(item)
      continue
    }

    const parent = getGroup(parentPath)
    parent.children = [...(parent.children ?? []), item]
  }

  return roots
}

function getTreeLeafSelectItemId(value: string) {
  return `tree-leaf-select:${value}`
}

function formatTreeLeafSegment(segment: string) {
  return segment
    .split('-')
    .map(part => (part ? `${part[0]?.toUpperCase() ?? ''}${part.slice(1)}` : part))
    .join(' ')
}

function getWidgetProps(props: Record<string, unknown> | undefined): AutoFormWidgetProps {
  return isPlainObject(props) ? props : {}
}

function getArrayWidgetProps(node: AutoFormNormalizedArrayNode) {
  const props = (node as AutoFormNormalizedArrayNode & { props?: Record<string, unknown> }).props
  return getWidgetProps(props)
}

function isStringArraySelectionNode(node: AutoFormNormalizedArrayNode) {
  return (
    node.itemNode.kind === 'field' &&
    node.itemNode.fieldType === 'string' &&
    (node.widget === undefined || node.widget === 'multi-select' || node.widget === 'tag-input')
  )
}

function getMentionTextareaWidgetConfig(props: AutoFormWidgetProps): AutoFormMentionTextareaConfig {
  const parsed = getAutoFormMentionTextareaWidgetProps(props)

  return {
    mentions: mapMentionItems(parsed.mentions),
    trigger: parsed.trigger,
    triggers: mapMentionTriggers(parsed.triggers),
    maxItems: parsed.maxItems,
    noMatchesText: parsed.noMatchesText,
    toolbar: parsed.toolbar,
    autoSize: parsed.autoSize,
    rows: parsed.rows,
    minRows: parsed.minRows,
    maxRows: parsed.maxRows,
  }
}

function getAvatarPickerWidgetProps(props: AutoFormWidgetProps): {
  items: AvatarItem[]
  placeholder?: string
  searchPlaceholder?: string
  searchable?: boolean
  noResultsText?: string
  maxHeight?: number
} {
  const parsed = getAutoFormAvatarPickerWidgetProps(props)

  return {
    items: mapAvatarItems(parsed.items),
    placeholder: parsed.placeholder,
    searchPlaceholder: parsed.searchPlaceholder,
    searchable: parsed.searchable,
    noResultsText: parsed.noResultsText,
    maxHeight: parsed.maxHeight,
  }
}

function getMultiSelectWidgetProps(props: AutoFormWidgetProps): {
  options: MultiSelectOption[]
  placeholder?: string
  searchable?: boolean
  searchPlaceholder?: string
  maxSelected?: number
  maxSelectedText?: string
  showBadges?: boolean
  maxVisibleBadges?: number
  creatable?: boolean
} {
  const parsed = getAutoFormMultiSelectWidgetProps(props)

  return {
    options: mapMultiSelectOptions(parsed.options),
    placeholder: parsed.placeholder,
    searchable: parsed.searchable,
    searchPlaceholder: parsed.searchPlaceholder,
    maxSelected: parsed.maxSelected,
    maxSelectedText: parsed.maxSelectedText,
    showBadges: parsed.showBadges,
    maxVisibleBadges: parsed.maxVisibleBadges,
    creatable: parsed.creatable,
  }
}

function getFileUploadWidgetProps(props: AutoFormWidgetProps): AutoFormFileUploadWidgetProps {
  return getAutoFormFileUploadWidgetProps(props)
}

function getCountryPickerWidgetProps(props: AutoFormWidgetProps): {
  label?: React.ReactNode
  size?: Size
  variant?: TextFieldVariant
  color?: Color
  radius?: Radius
  defaultCountry?: string
  countryPlaceholder?: string
  statePlaceholder?: string
  showStateSelector?: boolean
} {
  const parsed = getAutoFormCountryPickerWidgetProps(props)

  return {
    label: parsed.label,
    size: mapSize(parsed.size),
    variant: mapTextFieldVariant(parsed.variant),
    color: mapColor(parsed.color),
    radius: mapRadius(parsed.radius),
    defaultCountry: parsed.defaultCountry,
    countryPlaceholder: parsed.countryPlaceholder,
    statePlaceholder: parsed.statePlaceholder,
    showStateSelector: parsed.showStateSelector,
  }
}

function getDatePickerWidgetProps(props: AutoFormWidgetProps): {
  placeholder?: string
  enableNaturalLanguage?: boolean
  dateFormat?: string
  size?: React.ComponentProps<typeof DatePickerNext>['size']
  variant?: TextFieldVariant
  color?: Color
  radius?: Radius
} {
  const parsed = getAutoFormDatePickerWidgetProps(props)

  return {
    placeholder: parsed.placeholder,
    enableNaturalLanguage: parsed.enableNaturalLanguage,
    dateFormat: parsed.dateFormat,
    size: mapDateNextSize(parsed.size),
    variant: mapTextFieldVariant(parsed.variant),
    color: mapColor(parsed.color),
    radius: mapRadius(parsed.radius),
  }
}

function getDateTimePickerWidgetProps(props: AutoFormWidgetProps): {
  size?: React.ComponentProps<typeof DateTimePickerNext>['size']
  variant?: TextFieldVariant
  color?: Color
  radius?: Radius
  showSeconds?: boolean
  minuteStep?: number
} {
  const parsed = getAutoFormDateTimePickerWidgetProps(props)

  return {
    size: mapDateNextSize(parsed.size),
    variant: mapTextFieldVariant(parsed.variant),
    color: mapColor(parsed.color),
    radius: mapRadius(parsed.radius),
    showSeconds: parsed.showSeconds,
    minuteStep: parsed.minuteStep,
  }
}

function getTimePickerWidgetProps(props: AutoFormWidgetProps): {
  placeholder?: string
  size?: React.ComponentProps<typeof TimePickerNext>['size']
  color?: Color
  radius?: Radius
  showSeconds?: boolean
  use12HourFormat?: boolean
  minuteStep?: number
} {
  const parsed = getAutoFormTimePickerWidgetProps(props)

  return {
    placeholder: parsed.placeholder,
    size: mapDateNextSize(parsed.size),
    color: mapColor(parsed.color),
    radius: mapRadius(parsed.radius),
    showSeconds: parsed.showSeconds,
    use12HourFormat: parsed.use12HourFormat,
    minuteStep: parsed.minuteStep,
  }
}

function getComboboxWidgetProps(props: AutoFormWidgetProps): {
  options?: ComboboxOption[]
  placeholder?: string
  noResultsText?: string
  creatable?: boolean
  size?: Size
  variant?: TextFieldVariant
  color?: Color
  radius?: Radius
} {
  const parsed: AutoFormComboboxWidgetProps = getAutoFormComboboxWidgetProps(props)

  return {
    options: mapMultiSelectOptions(parsed.options),
    placeholder: parsed.placeholder ?? parsed.searchPlaceholder,
    noResultsText: parsed.noResultsText,
    creatable: parsed.creatable,
    size: mapSize(parsed.size),
    variant: mapTextFieldVariant(parsed.variant),
    color: mapColor(parsed.color),
    radius: mapRadius(parsed.radius),
  }
}

function getNumberInputWidgetProps(props: AutoFormWidgetProps): {
  variant?: React.ComponentProps<typeof NumberInput>['variant']
  step?: number
  min?: number
  max?: number
  allowDecimal?: boolean
  size?: Size
  inputVariant?: TextFieldVariant
  color?: Color
  radius?: Radius
  iconButton?: React.ComponentProps<typeof NumberInput>['iconButton']
} {
  const iconButton = isPlainObject(props.iconButton) ? props.iconButton : undefined

  return {
    variant: props.variant === 'button' || props.variant === 'icon' ? props.variant : undefined,
    step: typeof props.step === 'number' && Number.isFinite(props.step) ? props.step : undefined,
    min: typeof props.min === 'number' && Number.isFinite(props.min) ? props.min : undefined,
    max: typeof props.max === 'number' && Number.isFinite(props.max) ? props.max : undefined,
    allowDecimal: typeof props.allowDecimal === 'boolean' ? props.allowDecimal : undefined,
    size: typeof props.size === 'string' ? mapSize(props.size) : undefined,
    inputVariant: typeof props.inputVariant === 'string' ? mapTextFieldVariant(props.inputVariant) : undefined,
    color: typeof props.color === 'string' ? mapColor(props.color) : undefined,
    radius: typeof props.radius === 'string' ? mapRadius(props.radius) : undefined,
    iconButton: iconButton
      ? {
          className: typeof iconButton.className === 'string' ? iconButton.className : undefined,
          color: typeof iconButton.color === 'string' ? mapColor(iconButton.color) : undefined,
          highContrast: typeof iconButton.highContrast === 'boolean' ? iconButton.highContrast : undefined,
          radius: typeof iconButton.radius === 'string' ? mapRadius(iconButton.radius) : undefined,
          size: typeof iconButton.size === 'string' ? mapControlButtonSize(iconButton.size) : undefined,
          title: typeof iconButton.title === 'string' ? iconButton.title : undefined,
          variant:
            typeof iconButton.variant === 'string' &&
            (iconButton.variant === 'solid' ||
              iconButton.variant === 'soft' ||
              iconButton.variant === 'outline' ||
              iconButton.variant === 'ghost')
              ? iconButton.variant
              : undefined,
        }
      : undefined,
  }
}

function mapMentionTriggers(
  value: AutoFormMentionTriggerProps[] | undefined,
): AutoFormMentionTextareaConfig['triggers'] | undefined {
  if (!value?.length) return undefined

  return value.map(item => ({
    trigger: item.trigger,
    picker: item.picker,
    items: mapMentionItems(item.items),
    avatarItems: mapAvatarItems(item.avatarItems),
    options: mapMultiSelectOptions(item.options),
    searchable: item.searchable,
    searchPlaceholder: item.searchPlaceholder,
    placeholder: item.placeholder,
    noResultsText: item.noResultsText,
    maxSelected: item.maxSelected,
    maxSelectedText: item.maxSelectedText,
    showBadges: item.showBadges,
    maxVisibleBadges: item.maxVisibleBadges,
  }))
}

function mapMentionItems(value: AutoFormMentionItemProps[] | undefined): AutoFormMentionTextareaConfig['mentions'] {
  if (!value?.length) return undefined

  return value.map(item => ({
    id: item.id,
    label: item.label,
    value: item.value,
    description: item.description,
    avatar: item.avatar,
    hoverCard: mapHoverCard(item.hoverCard),
    disabled: item.disabled,
  }))
}

function mapAvatarItems(value: AutoFormAvatarItemProps[] | undefined): AvatarItem[] {
  if (!value?.length) return []

  return value.map(item => ({
    id: item.id,
    name: item.name,
    description: item.description,
    avatar: item.avatar,
    hoverCard: mapHoverCard(item.hoverCard),
    disabled: item.disabled,
  }))
}

function mapMultiSelectOptions(value: AutoFormMultiSelectOptionProps[] | undefined): MultiSelectOption[] {
  if (!value?.length) return []

  return value.map(item => ({
    value: item.value,
    label: item.label,
    disabled: item.disabled,
  }))
}

function mapStringEnumOptions(values: readonly unknown[] | undefined): ComboboxOption[] {
  if (!values?.length) return []

  return values.flatMap(value => {
    if (typeof value !== 'string') return []
    return [{ value, label: value }]
  })
}

function mapHoverCard(value: boolean | AutoFormHoverCardProps | undefined): boolean | AvatarHoverCardData | undefined {
  if (typeof value === 'boolean' || value === undefined) return value
  const hoverValue = value as AutoFormHoverCardProps & {
    email?: string
    presence?: string
    managerId?: string
  }

  const hoverCard: AvatarHoverCardData = {
    title: hoverValue.title,
    email: hoverValue.email,
    presence: hoverValue.presence as AvatarHoverCardData['presence'],
    managerId: hoverValue.managerId,
    color: mapColor(hoverValue.color),
    variant: mapPopoverVariant(hoverValue.variant),
    highContrast: hoverValue.highContrast,
    radius: mapRadius(hoverValue.radius),
  }

  return Object.values(hoverCard).some(entry => entry !== undefined) ? hoverCard : undefined
}

function mapColor(value: string | undefined): Color | undefined {
  return normalizeEnumPropValue(colorPropDef.color, value) as Color | undefined
}

function mapRadius(value: string | undefined): Radius | undefined {
  return normalizeEnumPropValue(radiusPropDef.radius, value) as Radius | undefined
}

function mapPopoverVariant(value: string | undefined): PopoverContentVariant | undefined {
  return normalizeEnumPropValue({ type: 'enum', values: popoverContentVariants } as const, value) as
    | PopoverContentVariant
    | undefined
}

function mapTextFieldVariant(value: string | undefined): TextFieldVariant | undefined {
  return normalizeEnumPropValue({ type: 'enum', values: textFieldTokens.variant } as const, value) as
    | TextFieldVariant
    | undefined
}

function mapSize(value: string | undefined): Size | undefined {
  return normalizeEnumPropValue({ type: 'enum', values: Object.values(possibleSizes) } as const, value) as
    | Size
    | undefined
}

function mapDateNextSize(
  value: string | undefined,
):
  | React.ComponentProps<typeof DatePickerNext>['size']
  | React.ComponentProps<typeof DateTimePickerNext>['size']
  | React.ComponentProps<typeof TimePickerNext>['size'] {
  return normalizeEnumPropValue({ type: 'enum', values: Object.values(possibleSizes) } as const, value) as
    | React.ComponentProps<typeof DatePickerNext>['size']
    | React.ComponentProps<typeof DateTimePickerNext>['size']
    | React.ComponentProps<typeof TimePickerNext>['size']
}

function mapControlButtonSize(
  value: string | undefined,
): NonNullable<React.ComponentProps<typeof NumberInput>['iconButton']>['size'] {
  return value === 'xs' || value === 'sm' || value === 'md' || value === 'lg' || value === 'xl' ? value : undefined
}

function isUploadedFileValue(value: unknown): value is UploadedFile {
  if (!isPlainObject(value)) return false

  return (
    typeof value.id === 'string' &&
    value.file instanceof File &&
    typeof value.progress === 'number' &&
    typeof value.status === 'string' &&
    uploadedFileStatuses.some(status => status === value.status)
  )
}

function resolveInputType(node: AutoFormNormalizedFieldNode) {
  if (node.fieldType === 'integer' || node.fieldType === 'number') return 'number'
  if (node.fieldType === 'email' || node.format === 'email') return 'email'
  if (node.format === 'password') return 'password'
  if (node.fieldType === 'url' || node.format === 'url' || node.format === 'uri' || node.format === 'uri-reference') {
    return 'url'
  }
  return 'text'
}

function coerceTextValue(value: unknown, fieldType: string) {
  if (value === undefined || value === null) return ''
  if (fieldType === 'integer' || fieldType === 'number') {
    return typeof value === 'number' ? String(value) : typeof value === 'string' ? value : ''
  }
  return typeof value === 'string' ? value : ''
}

function coerceNumberInputValue(value: unknown): number | '' {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : ''
  }
  return ''
}

function coerceTimeValue(value: unknown): TimeValueNext | undefined {
  if (isPlainObject(value)) {
    const hours = Number(value.hours)
    const minutes = Number(value.minutes)
    const seconds = value.seconds === undefined ? undefined : Number(value.seconds)

    if (isValidTimePart(hours, 0, 23) && isValidTimePart(minutes, 0, 59)) {
      return isValidTimePart(seconds, 0, 59) ? { hours, minutes, seconds } : { hours, minutes }
    }
  }

  if (typeof value !== 'string' || value.trim() === '') return undefined

  const match = /^(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(value.trim())
  if (!match) return undefined

  const hours = Number(match[1])
  const minutes = Number(match[2])
  const seconds = match[3] === undefined ? undefined : Number(match[3])

  if (!isValidTimePart(hours, 0, 23) || !isValidTimePart(minutes, 0, 59)) return undefined
  if (seconds !== undefined && !isValidTimePart(seconds, 0, 59)) return undefined

  return seconds === undefined ? { hours, minutes } : { hours, minutes, seconds }
}

function serializeTimeValue(value: TimeValueNext, includeSeconds?: boolean) {
  const hours = String(value.hours).padStart(2, '0')
  const minutes = String(value.minutes).padStart(2, '0')
  if (includeSeconds || value.seconds !== undefined) {
    return `${hours}:${minutes}:${String(value.seconds ?? 0).padStart(2, '0')}`
  }
  return `${hours}:${minutes}`
}

function isValidTimePart(value: unknown, min: number, max: number): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= min && value <= max
}

function coerceDateValue(value: unknown, format?: string) {
  if (value instanceof Date) return value
  if (typeof value !== 'string' || value.length === 0) return undefined

  if (format === 'date' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split('-').map(Number)
    if (year === undefined || month === undefined || day === undefined) return undefined
    const parsed = new Date(year, month - 1, day)
    return Number.isNaN(parsed.getTime()) ? undefined : parsed
  }

  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? undefined : parsed
}

function serializeDateValue(value: Date, format?: string) {
  if (format === 'date') {
    const year = String(value.getFullYear()).padStart(4, '0')
    const month = String(value.getMonth() + 1).padStart(2, '0')
    const day = String(value.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  return value.toISOString()
}

function validateAutoFormDateRuleErrors(
  model: AutoFormNormalizedModel,
  values: AutoFormModelRendererValues,
): FieldErrorMap {
  const conditionState = evaluateAutoFormConditionState(model, values)
  const effectiveNodes = buildEffectiveRenderNodes(model.nodes, conditionState.activeBranches)
  const errors: FieldErrorMap = {}

  for (const node of flattenRenderableNodes(effectiveNodes)) {
    collectDateRuleErrors(node, values, errors)
  }

  return errors
}

function mergeAutoFormFieldErrors(...maps: FieldErrorMap[]) {
  const merged: FieldErrorMap = {}
  for (const map of maps) {
    for (const [path, messages] of Object.entries(map)) {
      if (messages.length === 0) continue
      merged[path] = [...(merged[path] ?? []), ...messages]
    }
  }
  return merged
}

function collectDateRuleErrors(
  node: AutoFormNormalizedRenderableNode,
  values: AutoFormModelRendererValues,
  errors: FieldErrorMap,
) {
  if (node.kind === 'field') {
    const messages = validateFieldDateRules(node, getValueAtPath(values, node.path))
    if (messages.length > 0) {
      errors[node.path] = messages
    }
    return
  }

  if (node.kind === 'object-group') {
    for (const child of node.nodes) {
      collectDateRuleErrors(child, values, errors)
    }
    return
  }

  const itemValue = getValueAtPath(values, node.path)
  if (!Array.isArray(itemValue)) return

  for (let index = 0; index < itemValue.length; index += 1) {
    const itemNode = materializeArrayItemNode(node.itemNode, index, node)
    if (itemNode.kind === 'field') {
      const messages = validateFieldDateRules(itemNode, getValueAtPath(values, itemNode.path))
      if (messages.length > 0) {
        errors[itemNode.path] = messages
      }
      continue
    }

    for (const child of itemNode.nodes) {
      collectDateRuleErrors(child, values, errors)
    }
  }
}

function validateFieldDateRules(node: AutoFormNormalizedFieldNode, value: unknown) {
  if (!node.dateRules) return []
  if (node.format !== 'date' && node.format !== 'date-time') return []
  return validateAutoFormDateRules(value, node.format, node.dateRules)
}

function getDateRuleBounds(node: AutoFormNormalizedFieldNode, isDisabled: boolean, isReadOnly: boolean) {
  const bounds = resolveAutoFormDateBounds(node.format, node.dateRules)
  return {
    minValue: bounds.minValue,
    maxValue: bounds.maxValue,
    isDisabled: isDisabled || isReadOnly,
  }
}

function buildInitialValues(
  model: AutoFormNormalizedModel,
  defaultValues?: AutoFormModelRendererValues,
): AutoFormModelRendererValues {
  let values = defaultValues ? { ...defaultValues } : {}

  for (const node of flattenRenderableNodes(model.nodes)) {
    if (node.kind === 'array') {
      const existing = getValueAtPath(values, node.path)
      const nextItems = Array.isArray(existing)
        ? [...existing]
        : Array.isArray(node.defaultValue)
          ? [...node.defaultValue]
          : []
      const isSelectionArrayWidget = node.widget === 'file-upload' || isStringArraySelectionNode(node)

      if (!isSelectionArrayWidget) {
        while (nextItems.length < (node.minItems ?? 0)) {
          nextItems.push(buildArrayItemDefaultValue(node.itemNode))
        }
      }

      values = setValueAtPath(values, node.path, nextItems)
      continue
    }

    if (node.kind !== 'field') {
      continue
    }

    const existing = getValueAtPath(values, node.path)
    if (existing !== undefined) continue

    if (node.defaultValue !== undefined) {
      values = setValueAtPath(values, node.path, node.defaultValue)
      continue
    }

    if (node.fieldType === 'boolean') {
      values = setValueAtPath(values, node.path, false)
    }
  }

  return values
}

function pruneInactiveDynamicBranchValues(
  values: AutoFormModelRendererValues,
  dynamicBranches: AutoFormNormalizedDynamicBranch[],
  activeBranchIds: string[],
) {
  let nextValues = values

  for (const branch of dynamicBranches) {
    if (activeBranchIds.includes(branch.id)) continue

    for (const path of flattenControlTemplates(branch.nodes)) {
      for (const concretePath of expandTemplatePaths(nextValues, path)) {
        nextValues = removeValueAtPath(nextValues, concretePath)
      }
    }
  }

  return nextValues
}

function expandTemplatePaths(values: AutoFormRuntimeValues, template: string): string[] {
  if (!template.includes('[*]')) return [template]

  const segments = template
    .replace(/\[\*\]/g, '.[*]')
    .split('.')
    .filter(Boolean)

  return expandTemplateSegments(values, segments)
}

function expandTemplateSegments(value: unknown, segments: string[], prefix: string[] = []): string[] {
  if (segments.length === 0) {
    return prefix.length > 0 ? [prefix.join('.')] : []
  }

  const [segment, ...rest] = segments
  if (segment === undefined) return []

  if (segment === '[*]') {
    if (!Array.isArray(value)) return []

    return value.flatMap((item, index) => expandTemplateSegments(item, rest, [...prefix, String(index)]))
  }

  if (Array.isArray(value)) {
    const index = Number(segment)
    if (!Number.isInteger(index) || index < 0 || index >= value.length) return []
    return expandTemplateSegments(value[index], rest, [...prefix, segment])
  }

  if (!isPlainObject(value)) {
    return []
  }

  return expandTemplateSegments(value[segment], rest, [...prefix, segment])
}

function removeValueAtPath(values: AutoFormRuntimeValues, path: string): AutoFormRuntimeValues {
  const segments = path.split('.').filter(Boolean)
  if (segments.length === 0) return values

  const nextValue = removeValueAtSegments(values, segments)
  return isPlainObject(nextValue) ? nextValue : {}
}

function removeValueAtSegments(value: unknown, segments: string[]): unknown {
  if (segments.length === 0) return value

  const [segment, ...rest] = segments

  if (Array.isArray(value)) {
    const index = Number(segment)
    if (!Number.isInteger(index) || index < 0 || index >= value.length) return value
    const next = [...value]
    if (rest.length === 0) {
      // Current branch-pruning usage removes nested fields inside array items.
      // If this path is ever used to remove multiple array elements directly,
      // callers need to account for index shifting between deletions.
      next.splice(index, 1)
      return next
    }
    next[index] = removeValueAtSegments(next[index], rest)
    return next
  }

  if (!isPlainObject(value)) {
    return value
  }

  const next = { ...value }
  if (segment === undefined) return next
  if (!(segment in next)) return next

  if (rest.length === 0) {
    delete next[segment]
    return next
  }

  next[segment] = removeValueAtSegments(next[segment], rest)

  if (isPlainObject(next[segment]) && Object.keys(next[segment]).length === 0) {
    delete next[segment]
  }

  if (Array.isArray(next[segment]) && next[segment].length === 0) {
    delete next[segment]
  }

  return next
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function flattenControlTemplates(nodes: Array<AutoFormNormalizedSection | AutoFormNormalizedRenderableNode>): string[] {
  const paths: string[] = []

  for (const node of nodes) {
    if (node.kind === 'section') {
      paths.push(...flattenControlTemplates(node.nodes))
      continue
    }

    if (node.kind === 'field' || node.kind === 'array') {
      paths.push(node.path)
    }

    if (node.kind === 'object-group') {
      paths.push(...flattenControlTemplates(node.nodes))
      continue
    }

    if (node.kind === 'array') {
      paths.push(...flattenArrayItemFieldTemplates(node.itemNode))
    }
  }

  return paths
}

function flattenRenderableNodes(
  nodes: Array<AutoFormNormalizedSection | AutoFormNormalizedRenderableNode>,
): AutoFormNormalizedRenderableNode[] {
  const renderableNodes: AutoFormNormalizedRenderableNode[] = []

  for (const node of nodes) {
    if (node.kind === 'section') {
      renderableNodes.push(...flattenRenderableNodes(node.nodes))
      continue
    }

    renderableNodes.push(node)

    if (node.kind === 'object-group') {
      renderableNodes.push(...flattenRenderableNodes(node.nodes))
    }
  }

  return renderableNodes
}

function materializeArrayItemNode(
  node:
    | AutoFormNormalizedFieldNode
    | Exclude<AutoFormNormalizedRenderableNode, AutoFormNormalizedArrayNode | AutoFormNormalizedFieldNode>,
  index: number,
  arrayNode: AutoFormNormalizedArrayNode,
):
  | AutoFormNormalizedFieldNode
  | Exclude<AutoFormNormalizedRenderableNode, AutoFormNormalizedArrayNode | AutoFormNormalizedFieldNode> {
  const concretePath = materializeArrayPath(node.path, index)

  if (node.kind === 'field') {
    const isPrimitiveArrayItem = arrayNode.itemNode.kind === 'field' && node.path === arrayNode.itemNode.path

    return {
      ...node,
      path: concretePath,
      key: `${node.key}-${index}`,
      label: isPrimitiveArrayItem ? getArrayItemLabel(arrayNode, index) : node.label,
    }
  }

  return {
    ...node,
    path: concretePath,
    key: `${node.key}-${index}`,
    label: node.label ?? getArrayItemLabel(arrayNode, index),
    nodes: node.nodes.map(child => materializeArrayRenderableNode(child, index, arrayNode)),
  }
}

function materializeArrayRenderableNode(
  node: AutoFormNormalizedRenderableNode,
  index: number,
  arrayNode: AutoFormNormalizedArrayNode,
): AutoFormNormalizedRenderableNode {
  if (node.kind === 'field') {
    return {
      ...node,
      path: materializeArrayPath(node.path, index),
      key: `${node.key}-${index}`,
    }
  }

  if (node.kind === 'object-group') {
    return {
      ...node,
      path: materializeArrayPath(node.path, index),
      key: `${node.key}-${index}`,
      nodes: node.nodes.map(child => materializeArrayRenderableNode(child, index, arrayNode)),
    }
  }

  return {
    ...node,
    path: materializeArrayPath(node.path, index),
    key: `${node.key}-${index}`,
    itemNode: materializeArrayItemNode(node.itemNode, index, arrayNode),
  }
}

function materializeArrayPath(path: string, index: number) {
  return path.replace(/\[\*\]/, `.${index}`)
}

function flattenArrayItemFieldTemplates(
  node:
    | AutoFormNormalizedFieldNode
    | Exclude<AutoFormNormalizedRenderableNode, AutoFormNormalizedArrayNode | AutoFormNormalizedFieldNode>,
): string[] {
  if (node.kind === 'field') {
    return [node.path]
  }

  return node.nodes.flatMap(child => {
    if (child.kind === 'field') {
      return [child.path]
    }

    if (child.kind === 'object-group') {
      return flattenArrayItemFieldTemplates(child)
    }

    if (child.kind === 'array') {
      return [child.path, ...flattenArrayItemFieldTemplates(child.itemNode)]
    }

    return []
  })
}

function buildArrayItemDefaultValue(
  node:
    | AutoFormNormalizedFieldNode
    | Exclude<AutoFormNormalizedRenderableNode, AutoFormNormalizedArrayNode | AutoFormNormalizedFieldNode>,
) {
  if (node.kind === 'field') {
    if (node.defaultValue !== undefined) return node.defaultValue
    if (node.fieldType === 'boolean') return false
    return ''
  }

  const objectValue: Record<string, unknown> = {}

  for (const child of node.nodes) {
    if (child.kind === 'array') {
      objectValue[child.key] = Array.isArray(child.defaultValue) ? child.defaultValue : []
      continue
    }

    if (child.kind === 'object-group') {
      objectValue[child.key] = buildArrayItemDefaultValue(child)
      continue
    }

    if (child.defaultValue !== undefined) {
      objectValue[child.key] = child.defaultValue
      continue
    }

    if (child.fieldType === 'boolean') {
      objectValue[child.key] = false
      continue
    }

    objectValue[child.key] = ''
  }

  return objectValue
}
function getFormLevelErrors(
  nodes: Array<AutoFormNormalizedSection | AutoFormNormalizedRenderableNode>,
  errors: Record<string, string[]>,
  dynamicBranches: AutoFormNormalizedDynamicBranch[],
  activeBranchIds: string[],
  formErrors: string[],
) {
  const controlTemplates = flattenControlTemplates(nodes)
  const inactiveDynamicTemplates = dynamicBranches
    .filter(branch => !activeBranchIds.includes(branch.id))
    .flatMap(branch => flattenControlTemplates(branch.nodes))

  const fieldlessErrors = Object.entries(errors).flatMap(([key, messages]) => {
    if (controlTemplates.some(template => matchesTemplatePath(template, key))) return []
    if (inactiveDynamicTemplates.some(template => matchesTemplatePath(template, key))) return []
    return messages.map(message => ({ key, message }))
  })

  return [...fieldlessErrors, ...formErrors.map(message => ({ key: '$form', message }))]
}

function matchesTemplatePath(template: string, path: string) {
  if (template === path) return true

  const pattern = `^${template.replace(/\./g, '\\.').replace(/\[\*\]/g, '\\.\\d+')}$`
  return new RegExp(pattern).test(path)
}

function isNodeHidden(node: AutoFormNormalizedRenderableNode, conditionState: AutoFormConditionState) {
  return Boolean(conditionState.hidden[node.path])
}

function hasVisibleContent(node: AutoFormNormalizedRenderableNode, conditionState: AutoFormConditionState): boolean {
  if (isNodeHidden(node, conditionState)) return false
  if (node.kind !== 'object-group') return true
  return node.nodes.some(child => hasVisibleContent(child, conditionState))
}

const GRID_COLUMN_LOOKUP: Record<number, GridColumns> = {
  1: '1',
  2: '2',
  3: '3',
  4: '4',
  6: '6',
  12: '12',
}

const responsiveBreakpoints = ['initial', 'xs', 'sm', 'md', 'lg', 'xl'] as const
type AutoFormRendererResponsiveBreakpoint = (typeof responsiveBreakpoints)[number]

function usesGridLayout(columns: AutoFormNormalizedResponsiveValue<number> | undefined) {
  if (columns === undefined) return false
  if (typeof columns === 'number') return columns > 1

  return Object.values(columns).some(value => typeof value === 'number' && value > 1)
}

function resolveGridColumns(
  columns: AutoFormNormalizedResponsiveValue<number> | undefined,
): GridColumns | Partial<Record<AutoFormRendererResponsiveBreakpoint, GridColumns>> {
  if (columns === undefined) return '1'
  if (typeof columns === 'number') return GRID_COLUMN_LOOKUP[columns] ?? '1'

  const responsive: Partial<Record<AutoFormRendererResponsiveBreakpoint, GridColumns>> = {}

  for (const [breakpoint, value] of Object.entries(columns) as Array<
    [AutoFormRendererResponsiveBreakpoint, number | undefined]
  >) {
    if (typeof value !== 'number') continue
    responsive[breakpoint] = GRID_COLUMN_LOOKUP[value] ?? '1'
  }

  return Object.keys(responsive).length > 0 ? responsive : '1'
}

function resolveObjectGroupColumns(
  nodes: AutoFormNormalizedRenderableNode[],
): GridColumns | Partial<Record<AutoFormRendererResponsiveBreakpoint, GridColumns>> {
  const maxColSpan: Partial<Record<AutoFormRendererResponsiveBreakpoint, number>> = {}

  for (const child of nodes) {
    if (child.colSpan === undefined) continue

    if (typeof child.colSpan === 'number') {
      maxColSpan.initial = Math.max(maxColSpan.initial ?? 1, child.colSpan)
      continue
    }

    for (const [breakpoint, value] of Object.entries(child.colSpan) as Array<
      [AutoFormRendererResponsiveBreakpoint, number | undefined]
    >) {
      if (typeof value !== 'number') continue
      maxColSpan[breakpoint] = Math.max(maxColSpan[breakpoint] ?? 1, value)
    }
  }

  return resolveGridColumns(Object.keys(maxColSpan).length > 0 ? maxColSpan : 1)
}

function getColumnClassName(colSpan: AutoFormNormalizedResponsiveValue<number> | undefined) {
  if (colSpan === undefined) return undefined
  if (typeof colSpan === 'number') {
    return colSpan > 1
      ? autoFormColumnSpanClasses.initial[String(colSpan) as keyof typeof autoFormColumnSpanClasses.initial]
      : undefined
  }

  const classNames = (Object.entries(colSpan) as Array<[AutoFormRendererResponsiveBreakpoint, number | undefined]>)
    .flatMap(([breakpoint, value]) => {
      if (!value) return []
      if (value <= 1 && breakpoint === 'initial') return []
      const spanClass =
        autoFormColumnSpanClasses[breakpoint][
          String(value) as keyof (typeof autoFormColumnSpanClasses)[typeof breakpoint]
        ]
      return spanClass ? [spanClass] : []
    })
    .join(' ')

  return classNames || undefined
}

function mergeResponsiveValue<T>(
  inherited: AutoFormNormalizedResponsiveValue<T> | undefined,
  local: AutoFormNormalizedResponsiveValue<T> | undefined,
): AutoFormNormalizedResponsiveValue<T> | undefined {
  if (local === undefined) return inherited
  if (typeof local !== 'object' || local === null) return local
  if (inherited === undefined) return local
  if (typeof inherited !== 'object' || inherited === null) {
    return {
      initial: inherited,
      ...local,
    }
  }

  return {
    ...inherited,
    ...local,
  }
}

function toResponsiveObject<T>(value: AutoFormNormalizedResponsiveValue<T> | undefined) {
  if (value === undefined) return {}
  if (typeof value !== 'object' || value === null) {
    return { initial: value }
  }
  return value
}

function getResponsiveFieldWrapperClassName(
  layout: AutoFormNormalizedResponsiveValue<AutoFormFieldLayout> | undefined,
) {
  return cn('space-y-2', getResponsiveLayoutClasses(layout))
}

function getResponsiveFieldLabelClassName(
  layout: AutoFormNormalizedResponsiveValue<AutoFormFieldLayout> | undefined,
  labelPlacement: AutoFormNormalizedResponsiveValue<AutoFormLabelPlacement> | undefined,
) {
  return cn(getResponsiveHorizontalPlacementClasses(layout, labelPlacement, 'label'))
}

function getResponsiveFieldBodyClassName(
  layout: AutoFormNormalizedResponsiveValue<AutoFormFieldLayout> | undefined,
  labelPlacement: AutoFormNormalizedResponsiveValue<AutoFormLabelPlacement> | undefined,
) {
  return cn('space-y-2', getResponsiveHorizontalPlacementClasses(layout, labelPlacement, 'body'))
}

function getResponsiveHorizontalPlacementClasses(
  layout: AutoFormNormalizedResponsiveValue<AutoFormFieldLayout> | undefined,
  labelPlacement: AutoFormNormalizedResponsiveValue<AutoFormLabelPlacement> | undefined,
  slot: 'label' | 'body',
) {
  const resolvedLayout = toResponsiveObject(layout)
  const resolvedPlacement = toResponsiveObject(labelPlacement)

  return responsiveBreakpoints
    .flatMap(breakpoint => {
      const currentLayout = resolvedLayout[breakpoint] ?? resolvedLayout.initial ?? 'stacked'
      if (currentLayout !== 'horizontal') {
        return slot === 'label'
          ? autoFormFieldLabelPlacementClasses[breakpoint].stacked
          : autoFormFieldBodyPlacementClasses[breakpoint].stacked
      }

      const currentPlacement = resolvedPlacement[breakpoint] ?? resolvedPlacement.initial ?? 'start'
      const horizontalPlacement = currentPlacement === 'end' ? 'end' : 'start'
      if (slot === 'label') {
        return autoFormFieldLabelPlacementClasses[breakpoint][horizontalPlacement]
      }

      return autoFormFieldBodyPlacementClasses[breakpoint][horizontalPlacement]
    })
    .join(' ')
}

function getResponsiveLayoutClasses(value: AutoFormNormalizedResponsiveValue<AutoFormFieldLayout> | undefined) {
  const resolvedValue = toResponsiveObject(value)

  return responsiveBreakpoints
    .flatMap(breakpoint => {
      const current = resolvedValue[breakpoint] ?? resolvedValue.initial ?? 'stacked'
      return autoFormFieldWrapperLayoutClasses[breakpoint][current === 'horizontal' ? 'horizontal' : 'stacked']
    })
    .join(' ')
}

function getResponsiveBooleanLabelClasses(
  value: AutoFormNormalizedResponsiveValue<'checkbox-row' | 'stacked'> | undefined,
  slot: 'top' | 'spacer' | 'inline',
) {
  const resolvedValue = toResponsiveObject(value)

  return responsiveBreakpoints
    .map(breakpoint => {
      const current = resolvedValue[breakpoint] ?? resolvedValue.initial ?? 'checkbox-row'
      const variant = current === 'stacked' ? 'stacked' : 'row'

      if (slot === 'top') {
        return autoFormBooleanTopLabelClasses[breakpoint][variant]
      }

      if (slot === 'spacer') {
        return autoFormBooleanSpacerLabelClasses[breakpoint][variant]
      }

      return autoFormBooleanInlineLabelClasses[breakpoint][variant]
    })
    .join(' ')
}

function normalizeBooleanFieldLayout(
  layout: AutoFormNormalizedResponsiveValue<AutoFormFieldLayout> | undefined,
): AutoFormNormalizedResponsiveValue<'checkbox-row' | 'stacked'> | undefined {
  if (layout === undefined) return undefined
  if (typeof layout === 'string') {
    return layout === 'stacked' ? 'stacked' : 'checkbox-row'
  }

  return Object.fromEntries(
    Object.entries(layout).map(([breakpoint, value]) => [breakpoint, value === 'stacked' ? 'stacked' : 'checkbox-row']),
  ) as AutoFormNormalizedResponsiveValue<'checkbox-row' | 'stacked'>
}
