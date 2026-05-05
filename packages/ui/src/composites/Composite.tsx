'use client'

import { createAjvValidator, isJsonValue, type JsonSchemaNode, type JsonValue } from '@incmix/core'
import { importCode } from '@incmix/react-runner'
import * as React from 'react'
import { Icon } from '@/elements/button/Icon'
import { Card } from '@/elements/card/Card'
import { Box } from '@/layouts/box/Box'
import { Container } from '@/layouts/container/Container'
import { Flex } from '@/layouts/flex/Flex'
import { Grid } from '@/layouts/grid/Grid'
import { Text } from '@/typography/text/Text'
import { compactHorizontalChartCompositeDefinition } from './compact-horizontal-chart/definition'
import { compositeGlyphs, resolveCompositeGlyph } from './glyphs'
import { deriveCompositeJsonSchema } from './json-schema'
import { swotCompositeDefinition } from './swot/definition'

export type CompositeDefinition = {
  readonly name: string
  readonly sampleData: JsonValue
  readonly sampleProps?: JsonValue
  readonly jsonSchema?: JsonSchemaNode
  readonly propsSchema?: JsonSchemaNode
  readonly jsx?: string
  readonly renderDefinition?: CompositeRenderNode
  readonly runtimeScope?: Readonly<Record<string, unknown>>
}

export type CompositeProps = {
  name: string
  data: unknown
  props?: Readonly<Record<string, unknown>>
}

export type CompositeDataBinding = {
  readonly $data: string
}

export type CompositeRenderPropValue = JsonValue | CompositeDataBinding

export type CompositeRenderElement = {
  readonly component: string
  readonly props?: Readonly<Record<string, CompositeRenderPropValue>>
  readonly children?: CompositeRenderNode | readonly CompositeRenderNode[]
}

export type CompositeRenderNode =
  | string
  | number
  | boolean
  | null
  | CompositeDataBinding
  | CompositeRenderElement
  | readonly CompositeRenderNode[]

export type PersistedCompositeDefinition = Omit<
  CompositeDefinition,
  'jsonSchema' | 'jsx' | 'renderDefinition' | 'runtimeScope'
> & {
  readonly jsonSchema: JsonSchemaNode
  readonly renderDefinition: CompositeRenderNode
}

export const COMPOSITE_DEFINITIONS_STORAGE_KEY = 'incmix:composite-definitions'

type CompositeValidator = ReturnType<typeof createAjvValidator>
type CompositeTemplate = React.ComponentType<{ data: unknown; props?: Readonly<Record<string, unknown>> }>
type CachedCompositeTemplate = { Template: CompositeTemplate } | { error: Error }

export type { CompositeGlyphName } from './glyphs'
export { compositeGlyphs, resolveCompositeGlyph }

const frozenSwotCompositeDefinition = freezeCompositeDefinition(swotCompositeDefinition)
const frozenCompactHorizontalChartCompositeDefinition = freezeCompositeDefinition(
  compactHorizontalChartCompositeDefinition,
)
const localCompositeDefinitions = new Map<string, CompositeDefinition>([
  [frozenSwotCompositeDefinition.name, frozenSwotCompositeDefinition],
  [frozenCompactHorizontalChartCompositeDefinition.name, frozenCompactHorizontalChartCompositeDefinition],
])
const compositeDefinitionListeners = new Set<() => void>()
const compositeDataValidatorCache = new WeakMap<CompositeDefinition, CompositeValidator>()
const compositePropsValidatorCache = new WeakMap<CompositeDefinition, CompositeValidator>()
const compositeTemplateCache = new WeakMap<CompositeDefinition, CachedCompositeTemplate>()
let compositeDefinitionsVersion = 0

export function registerCompositeDefinition(definition: CompositeDefinition) {
  const frozenDefinition = freezeCompositeDefinition(definition)
  localCompositeDefinitions.set(frozenDefinition.name, frozenDefinition)
  emitCompositeDefinitionsChange()
}

export function unregisterCompositeDefinition(name: string) {
  if (localCompositeDefinitions.delete(name)) {
    emitCompositeDefinitionsChange()
  }
}

export function getCompositeDefinition(name: string): CompositeDefinition | undefined {
  return localCompositeDefinitions.get(name)
}

export function loadCompositeDefinitionsFromLocalStorage(
  key = COMPOSITE_DEFINITIONS_STORAGE_KEY,
): PersistedCompositeDefinition[] {
  if (!canUseLocalStorage()) return []

  try {
    const rawValue = window.localStorage.getItem(key)
    if (!rawValue) return []

    const parsed = JSON.parse(rawValue) as unknown
    if (Array.isArray(parsed)) return parsed.filter(isPersistedCompositeDefinition)

    if (isRecord(parsed) && Array.isArray(parsed.definitions)) {
      return parsed.definitions.filter(isPersistedCompositeDefinition)
    }
  } catch {
    return []
  }

  return []
}

export function registerLocalStorageCompositeDefinitions(key = COMPOSITE_DEFINITIONS_STORAGE_KEY) {
  const definitions = loadCompositeDefinitionsFromLocalStorage(key)
  for (const definition of definitions) {
    if (!localCompositeDefinitions.has(definition.name)) {
      registerCompositeDefinition(definition)
    }
  }

  return definitions
}

function subscribeCompositeDefinitions(listener: () => void) {
  compositeDefinitionListeners.add(listener)
  return () => {
    compositeDefinitionListeners.delete(listener)
  }
}

function getCompositeDefinitionsSnapshot() {
  return compositeDefinitionsVersion
}

function emitCompositeDefinitionsChange() {
  compositeDefinitionsVersion += 1
  for (const listener of compositeDefinitionListeners) {
    listener()
  }
}

const compositeRuntimeScope = {
  Box,
  Card,
  Container,
  Flex,
  Grid,
  Icon,
  Text,
  compositeGlyphs,
  resolveCompositeGlyph,
}

function freezeCompositeDefinition(definition: CompositeDefinition): CompositeDefinition {
  const sampleData = freezeJsonValue(cloneJsonValue(definition.sampleData))
  const sampleProps = freezeJsonValue(cloneJsonValue(definition.sampleProps ?? {}))
  const jsonSchema = freezeJsonValue(
    cloneJsonValue(
      definition.jsonSchema ?? deriveCompositeJsonSchema(sampleData, { title: `${definition.name} composite data` }),
    ),
  ) as JsonSchemaNode
  const propsSchema = freezeJsonValue(
    cloneJsonValue(
      definition.propsSchema ??
        (definition.sampleProps === undefined
          ? createOpenCompositePropsSchema(definition.name)
          : deriveCompositeJsonSchema(sampleProps, { title: `${definition.name} composite props` })),
    ),
  ) as JsonSchemaNode

  return Object.freeze({
    ...definition,
    sampleData,
    sampleProps,
    jsonSchema,
    propsSchema,
    renderDefinition:
      definition.renderDefinition !== undefined
        ? (freezeJsonValue(cloneJsonValue(definition.renderDefinition as JsonValue)) as CompositeRenderNode)
        : undefined,
    runtimeScope: definition.runtimeScope ? Object.freeze({ ...definition.runtimeScope }) : undefined,
  })
}

function createOpenCompositePropsSchema(name: string): JsonSchemaNode {
  return {
    title: `${name} composite props`,
    type: 'object',
    additionalProperties: true,
  }
}

function cloneJsonValue(value: JsonValue): JsonValue {
  if (value === null || typeof value !== 'object') return value

  if (Array.isArray(value)) {
    return value.map(item => cloneJsonValue(item))
  }

  return Object.fromEntries(
    Object.entries(value).map(([key, entryValue]) => [
      key,
      entryValue === undefined ? undefined : cloneJsonValue(entryValue),
    ]),
  ) as JsonValue
}

function freezeJsonValue(value: JsonValue): JsonValue {
  if (value === null || typeof value !== 'object') return value

  if (Array.isArray(value)) {
    for (const item of value) freezeJsonValue(item)
    return Object.freeze(value) as JsonValue
  }

  for (const entryValue of Object.values(value)) {
    if (entryValue !== undefined) freezeJsonValue(entryValue)
  }

  return Object.freeze(value) as JsonValue
}

function getCompositeDataValidator(definition: CompositeDefinition): CompositeValidator {
  const cached = compositeDataValidatorCache.get(definition)
  if (cached) return cached

  const validator = createAjvValidator(
    definition.jsonSchema ??
      deriveCompositeJsonSchema(definition.sampleData, { title: `${definition.name} composite data` }),
  )
  compositeDataValidatorCache.set(definition, validator)
  return validator
}

function getCompositePropsValidator(definition: CompositeDefinition): CompositeValidator {
  const cached = compositePropsValidatorCache.get(definition)
  if (cached) return cached

  const validator = createAjvValidator(
    definition.propsSchema ??
      deriveCompositeJsonSchema(definition.sampleProps ?? {}, { title: `${definition.name} composite props` }),
  )
  compositePropsValidatorCache.set(definition, validator)
  return validator
}

function getCompositeTemplate(definition: CompositeDefinition): CompositeTemplate {
  const cached = compositeTemplateCache.get(definition)
  if (cached) {
    if ('error' in cached) throw cached.error
    return cached.Template
  }

  try {
    let Template: unknown

    const renderDefinition = definition.renderDefinition
    if (renderDefinition !== undefined) {
      Template = function JsonCompositeTemplate({
        data,
      }: {
        data: unknown
        props?: Readonly<Record<string, unknown>>
      }) {
        return renderCompositeNode(renderDefinition, data, definition.name, definition.runtimeScope)
      }
    } else if (definition.jsx) {
      const exports = importCode(definition.jsx, {
        ...compositeRuntimeScope,
        ...definition.runtimeScope,
      })
      Template = exports.default
      if (typeof Template !== 'function') {
        throw new Error(`Composite "${definition.name}" did not export a render function.`)
      }
    } else {
      throw new Error(`Composite "${definition.name}" does not define jsx or renderDefinition.`)
    }

    const cachedTemplate = { Template: Template as CompositeTemplate }
    compositeTemplateCache.set(definition, cachedTemplate)
    return cachedTemplate.Template
  } catch (error) {
    const cachedError = error instanceof Error ? error : new Error(String(error))
    compositeTemplateCache.set(definition, { error: cachedError })
    throw cachedError
  }
}

function renderCompositeNode(
  node: CompositeRenderNode,
  data: unknown,
  definitionName: string,
  runtimeScope?: Readonly<Record<string, unknown>>,
): React.ReactNode {
  if (node === null || typeof node === 'string' || typeof node === 'number' || typeof node === 'boolean') return node

  if (Array.isArray(node)) {
    return node.map((child, index) => (
      <React.Fragment key={index}>{renderCompositeNode(child, data, definitionName, runtimeScope)}</React.Fragment>
    ))
  }

  if (isDataBinding(node)) {
    const value = getDataPathValue(data, node.$data)
    if (value === null || typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean')
      return value
    return value == null ? null : String(value)
  }

  const element = node as CompositeRenderElement
  const Component =
    (runtimeScope?.[element.component] as React.ElementType | undefined) ??
    compositeRuntimeScope[element.component as keyof typeof compositeRuntimeScope]
  if (!Component) {
    throw new Error(`Composite "${definitionName}" references unknown component "${element.component}".`)
  }

  const props = Object.fromEntries(
    Object.entries(element.props ?? {}).map(([key, value]) => [
      key,
      resolveRenderPropValue(value as CompositeRenderPropValue, data),
    ]),
  )

  return React.createElement(
    Component as React.ElementType,
    props,
    element.children === undefined
      ? undefined
      : renderCompositeNode(element.children, data, definitionName, runtimeScope),
  )
}

function resolveRenderPropValue(value: CompositeRenderPropValue, data: unknown): unknown {
  if (isDataBinding(value)) return getDataPathValue(data, value.$data)
  return value
}

function getDataPathValue(data: unknown, path: string): unknown {
  if (!path) return data

  let current = data
  for (const segment of path.split('.')) {
    if (current === null || current === undefined) return undefined
    if (typeof current !== 'object') return undefined
    current = (current as Record<string, unknown>)[segment]
  }

  return current
}

function canUseLocalStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isDataBinding(value: unknown): value is CompositeDataBinding {
  return isRecord(value) && typeof value.$data === 'string'
}

function isPersistedCompositeDefinition(value: unknown): value is PersistedCompositeDefinition {
  if (!isRecord(value)) return false
  if (typeof value.name !== 'string' || !value.name.trim()) return false
  if (!('sampleData' in value)) return false
  if (!('jsonSchema' in value)) return false
  if (!isJsonValue(value.sampleData)) return false
  if (value.sampleProps !== undefined && !isJsonValue(value.sampleProps)) return false
  if (value.propsSchema !== undefined && !isJsonValue(value.propsSchema)) return false
  if ('jsx' in value) return false
  return isCompositeRenderNode(value.renderDefinition)
}

function isCompositeRenderNode(value: unknown): value is CompositeRenderNode {
  if (value === null) return true
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return true
  if (Array.isArray(value)) return value.every(isCompositeRenderNode)
  if (isDataBinding(value)) return true
  if (!isRecord(value) || typeof value.component !== 'string') return false
  if (value.children !== undefined && !isCompositeRenderNode(value.children)) return false
  return value.props === undefined || isRecord(value.props)
}

function CompositeError({ message }: { message: string }) {
  return (
    <Card.Root color="error" variant="soft" className="max-w-xl">
      <Text color="error">{message}</Text>
    </Card.Root>
  )
}

function InvalidCompositeValue({
  label,
  name,
  errors,
}: {
  label: string
  name: string
  errors: Record<string, string[]>
}) {
  return (
    <Card.Root color="error" variant="soft" className="max-w-xl">
      <Flex direction="column" gap="2">
        <Text weight="bold" color="error">
          Invalid composite {label}: {name}
        </Text>
        {Object.entries(errors).map(([path, messages]) => (
          <Text key={path} size="sm" color="error">
            {path}: {messages.join(', ')}
          </Text>
        ))}
      </Flex>
    </Card.Root>
  )
}

export function Composite({ name, data, props }: CompositeProps) {
  const [storageLookupCompleteFor, setStorageLookupCompleteFor] = React.useState<string | null>(null)

  React.useSyncExternalStore(
    subscribeCompositeDefinitions,
    getCompositeDefinitionsSnapshot,
    getCompositeDefinitionsSnapshot,
  )

  const definition = getCompositeDefinition(name)

  React.useEffect(() => {
    if (!definition) registerLocalStorageCompositeDefinitions()
    setStorageLookupCompleteFor(name)
  }, [definition, name])

  if (!definition && storageLookupCompleteFor !== name) return null
  if (!definition) {
    return <CompositeError message={`Unknown composite: ${name}`} />
  }

  const dataResult = getCompositeDataValidator(definition).validate(data)
  if (!dataResult.valid) return <InvalidCompositeValue label="data" name={name} errors={dataResult.errors} />

  const resolvedProps = props ?? {}
  const propsResult = getCompositePropsValidator(definition).validate(resolvedProps)
  if (!propsResult.valid) return <InvalidCompositeValue label="props" name={name} errors={propsResult.errors} />

  try {
    const Template = getCompositeTemplate(definition)
    return React.createElement(Template, { data, props: resolvedProps })
  } catch (error) {
    return (
      <CompositeError
        message={error instanceof Error ? `Failed to render composite "${name}": ${error.message}` : String(error)}
      />
    )
  }
}
