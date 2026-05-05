import type { FieldErrorMap } from './ajv-validation'
import type { AutoFormNormalizedModel } from './ui-schema-normalization'

export type AutoFormRuntimeValues = Record<string, unknown>
export type AutoFormTouchedMap = Record<string, boolean>
export type AutoFormDirtyMap = Record<string, boolean>
export type AutoFormValueCoercion = 'identity' | 'string' | 'stringArray'
export type AutoFormStringOption = {
  value: string
  label?: string
  description?: string
  disabled?: boolean
}
export type AutoFormValueMappingEntry<TTarget extends object> =
  | string
  | {
      path: string
      coerce?: AutoFormValueCoercion
      joinWith?: string
      transform?: (value: unknown, context: AutoFormValueMappingContext<TTarget>) => unknown
    }
export type AutoFormValueMapping<TTarget extends object> = Record<string, AutoFormValueMappingEntry<TTarget>>
export type AutoFormValueMappingHint = {
  target?: string
  path?: string
  coerce?: AutoFormValueCoercion
  joinWith?: string
}

export interface AutoFormValueMappingContext<TTarget extends object> {
  values: AutoFormRuntimeValues
  current: TTarget
  path: string
}

export interface AutoFormDefinition<TTarget extends object = Record<string, unknown>> {
  model: AutoFormNormalizedModel
  values: AutoFormRuntimeValues
  valueMapping?: AutoFormValueMapping<TTarget>
}

export const AUTOFORM_VALUE_MAPPING_HINT = '$autoform:valueMapping'

export interface AutoFormRuntimeState {
  values: AutoFormRuntimeValues
  initialValues: AutoFormRuntimeValues
  errors: FieldErrorMap
  validationErrors: FieldErrorMap
  serverErrors: FieldErrorMap
  formErrors: string[]
  touched: AutoFormTouchedMap
  dirtyFields: AutoFormDirtyMap
  isDirty: boolean
  isValid: boolean
  isSubmitting: boolean
  submitCount: number
}

export function createAutoFormRuntimeState(
  initialValues: AutoFormRuntimeValues,
  values: AutoFormRuntimeValues = initialValues,
): AutoFormRuntimeState {
  const dirtyFields = collectDirtyFields(initialValues, values)

  return {
    values,
    initialValues,
    errors: {},
    validationErrors: {},
    serverErrors: {},
    formErrors: [],
    touched: {},
    dirtyFields,
    isDirty: Object.keys(dirtyFields).length > 0,
    isValid: true,
    isSubmitting: false,
    submitCount: 0,
  }
}

export function setAutoFormValue(state: AutoFormRuntimeState, path: string, nextValue: unknown): AutoFormRuntimeState {
  const nextValues = setValueAtPath(state.values, path, nextValue)
  const nextDirtyFields = collectDirtyFields(state.initialValues, nextValues)

  return {
    ...state,
    values: nextValues,
    dirtyFields: nextDirtyFields,
    isDirty: Object.keys(nextDirtyFields).length > 0,
  }
}

export function setAutoFormValues(
  state: AutoFormRuntimeState,
  nextValues: AutoFormRuntimeValues,
): AutoFormRuntimeState {
  const dirtyFields = collectDirtyFields(state.initialValues, nextValues)

  return {
    ...state,
    values: nextValues,
    dirtyFields,
    isDirty: Object.keys(dirtyFields).length > 0,
  }
}

export function touchAutoFormField(state: AutoFormRuntimeState, path: string): AutoFormRuntimeState {
  if (state.touched[path]) return state
  return {
    ...state,
    touched: {
      ...state.touched,
      [path]: true,
    },
  }
}

export function setAutoFormErrors(state: AutoFormRuntimeState, errors: FieldErrorMap): AutoFormRuntimeState {
  const validationErrors = normalizeFieldErrorMap(errors)
  const mergedErrors = mergeFieldErrors(validationErrors, state.serverErrors)
  return {
    ...state,
    errors: mergedErrors,
    validationErrors,
    isValid: isAutoFormRuntimeStateValid(mergedErrors, state.formErrors),
  }
}

export function setAutoFormServerErrors(
  state: AutoFormRuntimeState,
  serverErrors: FieldErrorMap,
  formErrors: string[] = [],
): AutoFormRuntimeState {
  const normalizedServerErrors = normalizeFieldErrorMap(serverErrors)
  const mergedErrors = mergeFieldErrors(state.validationErrors, normalizedServerErrors)

  return {
    ...state,
    errors: mergedErrors,
    serverErrors: normalizedServerErrors,
    formErrors,
    isValid: isAutoFormRuntimeStateValid(mergedErrors, formErrors),
  }
}

export function clearAutoFormServerErrors(state: AutoFormRuntimeState): AutoFormRuntimeState {
  const validationErrors = mergeFieldErrors(state.validationErrors, {})
  return {
    ...state,
    errors: validationErrors,
    serverErrors: {},
    formErrors: [],
    isValid: isAutoFormRuntimeStateValid(validationErrors, []),
  }
}

export function clearAutoFormServerError(state: AutoFormRuntimeState, path: string): AutoFormRuntimeState {
  const normalizedPath = normalizePath(path)

  if (
    !state.serverErrors[normalizedPath] &&
    !Object.keys(state.serverErrors).some(key => key.startsWith(`${normalizedPath}.`))
  ) {
    return state
  }

  const nextServerErrors = Object.fromEntries(
    Object.entries(state.serverErrors).filter(
      ([key]) => key !== normalizedPath && !key.startsWith(`${normalizedPath}.`),
    ),
  )

  const mergedErrors = mergeFieldErrors(state.validationErrors, nextServerErrors)

  return {
    ...state,
    errors: mergedErrors,
    serverErrors: nextServerErrors,
    isValid: isAutoFormRuntimeStateValid(mergedErrors, state.formErrors),
  }
}

export function setAutoFormFormErrors(state: AutoFormRuntimeState, formErrors: string[]): AutoFormRuntimeState {
  return {
    ...state,
    formErrors,
    isValid: isAutoFormRuntimeStateValid(state.errors, formErrors),
  }
}

export function setAutoFormSubmitting(state: AutoFormRuntimeState, isSubmitting: boolean): AutoFormRuntimeState {
  return {
    ...state,
    isSubmitting,
  }
}

export function incrementAutoFormSubmitCount(state: AutoFormRuntimeState): AutoFormRuntimeState {
  return {
    ...state,
    submitCount: state.submitCount + 1,
  }
}

export function resetAutoFormState(
  state: AutoFormRuntimeState,
  nextInitialValues: AutoFormRuntimeValues = state.initialValues,
): AutoFormRuntimeState {
  return {
    values: nextInitialValues,
    initialValues: nextInitialValues,
    errors: {},
    validationErrors: {},
    serverErrors: {},
    formErrors: [],
    touched: {},
    dirtyFields: {},
    isDirty: false,
    isValid: true,
    isSubmitting: false,
    submitCount: 0,
  }
}

export function getValueAtPath(values: AutoFormRuntimeValues, path: string) {
  return parsePath(path).reduce<unknown>((current, segment) => {
    if (current === null || current === undefined) return undefined

    if (Array.isArray(current)) {
      return typeof segment === 'number' ? current[segment] : undefined
    }

    if (typeof current !== 'object') return undefined
    return (current as Record<string, unknown>)[String(segment)]
  }, values)
}

export function getAutoFormStringValue(values: AutoFormRuntimeValues, path: string) {
  const value = getValueAtPath(values, path)
  return typeof value === 'string' ? value : ''
}

export function getAutoFormStringArrayValue(values: AutoFormRuntimeValues, path: string) {
  const value = getValueAtPath(values, path)
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : []
}

export function createAutoFormStringOptions(...sources: ReadonlyArray<ReadonlyArray<string | AutoFormStringOption>>) {
  const optionByValue = new Map<
    string,
    Required<Pick<AutoFormStringOption, 'value' | 'label'>> & Pick<AutoFormStringOption, 'description' | 'disabled'>
  >()

  for (const source of sources) {
    for (const item of source) {
      const option =
        typeof item === 'string' ? { value: item, label: item } : { ...item, label: item.label ?? item.value }
      if (!optionByValue.has(option.value)) {
        optionByValue.set(option.value, option)
      }
    }
  }

  return Array.from(optionByValue.values())
}

export function mapAutoFormValuesToTarget<TTarget extends object>(
  values: AutoFormRuntimeValues,
  current: TTarget,
  mapping: AutoFormValueMapping<TTarget>,
): TTarget {
  let next = { ...(current as Record<string, unknown>) }

  for (const [targetKey, entry] of Object.entries(mapping)) {
    const path = typeof entry === 'string' ? entry : entry.path
    const rawValue = getValueAtPath(values, path)
    const value = typeof entry === 'string' ? rawValue : coerceAutoFormValue(rawValue, entry.coerce, entry.joinWith)
    next = setValueAtPath(
      next,
      targetKey,
      typeof entry === 'string' ? value : entry.transform ? entry.transform(value, { values, current, path }) : value,
    )
  }

  return next as TTarget
}

export function createAutoFormValueMappingFromModel<TTarget extends object>(
  model: AutoFormNormalizedModel,
  overrides: AutoFormValueMapping<TTarget> = {},
): AutoFormValueMapping<TTarget> {
  return {
    ...collectAutoFormValueMappingFromNodes<TTarget>(model.nodes),
    ...overrides,
  }
}

export function mapAutoFormDefinitionValues<TTarget extends object>(
  definition: Pick<AutoFormDefinition<TTarget>, 'valueMapping'>,
  values: AutoFormRuntimeValues,
  current: TTarget,
): TTarget {
  if (definition.valueMapping == null) return current
  return mapAutoFormValuesToTarget(values, current, definition.valueMapping)
}

function collectAutoFormValueMappingFromNodes<TTarget extends object>(
  nodes: AutoFormNormalizedModel['nodes'],
): AutoFormValueMapping<TTarget> {
  const mapping: AutoFormValueMapping<TTarget> = {}

  for (const node of nodes) {
    if (node.kind === 'section') {
      Object.assign(mapping, collectAutoFormValueMappingFromNodes<TTarget>(node.nodes))
      continue
    }

    const hint = normalizeAutoFormValueMappingHint(node.hints[AUTOFORM_VALUE_MAPPING_HINT])
    if (hint != null) {
      mapping[hint.target ?? node.path] = {
        path: hint.path ?? node.path,
        coerce: hint.coerce,
        joinWith: hint.joinWith,
      }
    }

    if (node.kind === 'object-group') {
      Object.assign(mapping, collectAutoFormValueMappingFromNodes<TTarget>(node.nodes))
    }

    if (node.kind === 'array' && node.itemNode.kind === 'object-group') {
      Object.assign(mapping, collectAutoFormValueMappingFromNodes<TTarget>(node.itemNode.nodes))
    }
  }

  return mapping
}

function normalizeAutoFormValueMappingHint(value: unknown): AutoFormValueMappingHint | null {
  if (value == null || typeof value !== 'object' || Array.isArray(value)) return null

  const hint = value as Record<string, unknown>
  const coerce = hint.coerce

  return {
    target: typeof hint.target === 'string' && hint.target.length > 0 ? hint.target : undefined,
    path: typeof hint.path === 'string' && hint.path.length > 0 ? hint.path : undefined,
    coerce: coerce === 'identity' || coerce === 'string' || coerce === 'stringArray' ? coerce : undefined,
    joinWith: typeof hint.joinWith === 'string' ? hint.joinWith : undefined,
  }
}

function coerceAutoFormValue(value: unknown, coercion: AutoFormValueCoercion = 'identity', joinWith?: string) {
  if (coercion === 'string') {
    return typeof value === 'string' ? value : ''
  }

  if (coercion === 'stringArray') {
    const strings = Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : []
    return joinWith === undefined ? strings : strings.join(joinWith)
  }

  return value
}

export function setValueAtPath(values: AutoFormRuntimeValues, path: string, nextValue: unknown) {
  const segments = parsePath(path)
  if (segments.length === 0) return values
  return setValueAtSegments(values, segments, nextValue) as AutoFormRuntimeValues
}

function collectDirtyFields(initialValues: AutoFormRuntimeValues, values: AutoFormRuntimeValues) {
  const dirtyFields: AutoFormDirtyMap = {}

  for (const path of new Set([...flattenPaths(initialValues), ...flattenPaths(values)])) {
    if (!areValuesEqual(getValueAtPath(initialValues, path), getValueAtPath(values, path))) {
      dirtyFields[path] = true
    }
  }

  return dirtyFields
}

function flattenPaths(values: AutoFormRuntimeValues, prefix = ''): string[] {
  const paths: string[] = []

  const entries = Array.isArray(values)
    ? Array.from(values.entries(), ([index, value]) => [String(index), value] as const)
    : Object.entries(values)

  for (const [key, value] of entries) {
    const path = prefix ? `${prefix}.${key}` : key
    paths.push(path)

    if (Array.isArray(value)) {
      paths.push(...flattenPaths(value as unknown as AutoFormRuntimeValues, path))
      continue
    }

    if (value && typeof value === 'object') {
      paths.push(...flattenPaths(value as AutoFormRuntimeValues, path))
    }
  }

  return paths
}

function parsePath(path: string): Array<string | number> {
  return path
    .replaceAll('[*]', '.*')
    .replace(/\[(\d+)\]/g, '.$1')
    .split('.')
    .filter(Boolean)
    .map(segment => {
      if (/^\d+$/.test(segment)) return Number(segment)
      return segment
    })
}

function normalizePath(path: string) {
  return parsePath(path)
    .filter(segment => segment !== '*')
    .map(String)
    .join('.')
}

function setValueAtSegments(current: unknown, segments: Array<string | number>, nextValue: unknown): unknown {
  const [segment, ...rest] = segments
  if (segment === undefined) {
    return current
  }
  const isLeaf = rest.length === 0

  if (typeof segment === 'number') {
    const source = Array.isArray(current) ? [...current] : []
    if (isLeaf) {
      source[segment] = nextValue
      return source
    }

    source[segment] = setValueAtSegments(source[segment], rest, nextValue)
    return source
  }

  const source =
    current && typeof current === 'object' && !Array.isArray(current) ? { ...(current as Record<string, unknown>) } : {}
  if (isLeaf) {
    source[segment] = nextValue
    return source
  }

  source[segment] = setValueAtSegments(source[segment], rest, nextValue)
  return source
}

function areValuesEqual(a: unknown, b: unknown) {
  return JSON.stringify(a) === JSON.stringify(b)
}

function mergeFieldErrors(validationErrors: FieldErrorMap, serverErrors: FieldErrorMap): FieldErrorMap {
  const merged: FieldErrorMap = {}

  for (const key of new Set([...Object.keys(validationErrors), ...Object.keys(serverErrors)])) {
    const validationMessages = validationErrors[key] ?? []
    const serverMessages = serverErrors[key] ?? []
    const messages = [...validationMessages, ...serverMessages]
    if (messages.length > 0) {
      merged[key] = messages
    }
  }

  return merged
}

function normalizeFieldErrorMap(errors: FieldErrorMap): FieldErrorMap {
  const normalized: FieldErrorMap = {}

  for (const [path, messages] of Object.entries(errors)) {
    const normalizedPath = normalizePath(path)
    if (!normalizedPath) continue
    const nextMessages = messages.filter(Boolean)
    if (nextMessages.length === 0) continue
    normalized[normalizedPath] = [...(normalized[normalizedPath] ?? []), ...nextMessages]
  }

  return normalized
}

function isAutoFormRuntimeStateValid(errors: FieldErrorMap, formErrors: string[]) {
  return Object.keys(errors).length === 0 && formErrors.length === 0
}
