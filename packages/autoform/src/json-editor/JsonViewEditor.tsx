'use client'

import {
  Button,
  DropdownMenu,
  IconButton,
  type TreeDataItem,
  type TreeRenderItemParams,
  TreeView,
} from '@incmix/ui/elements'
import { Checkbox, Select, SelectItem, Textarea, TextField } from '@incmix/ui/form'
import { Flex } from '@incmix/ui/layouts'
import { cn } from '@incmix/ui/lib/utils'
import { Text } from '@incmix/ui/typography'
import { Braces, Brackets, Hash, Layers3, Quote, Search, ToggleLeft } from 'lucide-react'
import * as React from 'react'
import {
  jsonViewEditorActions,
  jsonViewEditorCheckboxWrap,
  jsonViewEditorEmptyState,
  jsonViewEditorIssueText,
  jsonViewEditorKeyField,
  jsonViewEditorKeyText,
  jsonViewEditorManagedHint,
  jsonViewEditorRecentAction,
  jsonViewEditorRefSummary,
  jsonViewEditorRoot,
  jsonViewEditorRow,
  jsonViewEditorRowError,
  jsonViewEditorRowStacked,
  jsonViewEditorSummary,
  jsonViewEditorTextField,
  jsonViewEditorToolbar,
  jsonViewEditorTree,
  jsonViewEditorValue,
  jsonViewEditorValueStack,
  jsonViewEditorValueStacked,
} from './JsonViewEditor.css'
import type { JsonObject, JsonPrimitive, JsonValue } from './json-value.types'

export type { JsonObject, JsonPrimitive, JsonValue } from './json-value.types'

type JsonPathSegment = string | number
const schemaUserDefinedEntryParentKeys = [
  'properties',
  '$defs',
  'definitions',
  'patternProperties',
  'dependentSchemas',
] as const
type SchemaUserDefinedEntryParentKey = (typeof schemaUserDefinedEntryParentKeys)[number]

function isSchemaUserDefinedEntryParentKey(
  value: JsonPathSegment | undefined,
): value is SchemaUserDefinedEntryParentKey {
  return (
    typeof value === 'string' && schemaUserDefinedEntryParentKeys.includes(value as SchemaUserDefinedEntryParentKey)
  )
}
type JsonPath = JsonPathSegment[]
type JsonNodeType = 'object' | 'array' | 'string' | 'number' | 'boolean' | 'null'
type JsonAddValueKind = JsonNodeType
type JsonEditorMode = 'generic' | 'schema'
type SchemaItemType = JsonNodeType
const schemaFormatOptions = [
  'date',
  'date-time',
  'email',
  'hostname',
  'ipv4',
  'ipv6',
  'regex',
  'time',
  'uri',
  'uuid',
] as const
const schemaItemTypeOptions = ['string', 'number', 'boolean', 'object', 'array', 'null'] as const

type JsonTreeItem = TreeDataItem & {
  jsonPath: JsonPath
  jsonValue: JsonValue
  jsonType: JsonNodeType
  insideReferenceContainer: boolean
  combinatorKind?: 'oneOf' | 'anyOf' | 'allOf'
  syntheticKind?: 'selectedOneOfBranch' | 'externalSchemasRoot' | 'externalSchemaDocument' | 'externalSchemaNode'
  syntheticLabel?: string
  externalSchemaRef?: string
}

type CombinatorSelectionState = Record<string, number>
export type JsonViewEditorCombinatorSelections = Record<string, number>
export type JsonViewEditorExternalSchemas = Record<string, JsonValue>

function isJsonCombinatorKey(key: string): key is 'oneOf' | 'anyOf' | 'allOf' {
  return key === 'oneOf' || key === 'anyOf' || key === 'allOf'
}

function jsonPathEquals(left: JsonPath, right: JsonPath): boolean {
  return left.length === right.length && left.every((segment, index) => segment === right[index])
}

function getParentPath(path: JsonPath): JsonPath {
  return path.slice(0, -1)
}

export interface JsonViewEditorProps {
  value: JsonValue
  onChange?: (value: JsonValue) => void
  editable?: boolean
  issues?: Record<string, string[]>
  mode?: JsonEditorMode
  searchable?: boolean
  defaultExpandAll?: boolean
  className?: string
  name?: string
  externalSchemas?: JsonViewEditorExternalSchemas
  combinatorSelections?: JsonViewEditorCombinatorSelections
  onCombinatorSelectionsChange?: (selections: JsonViewEditorCombinatorSelections) => void
}

function getJsonType(value: JsonValue): JsonNodeType {
  if (value === null) return 'null'
  if (Array.isArray(value)) return 'array'
  switch (typeof value) {
    case 'string':
      return 'string'
    case 'number':
      return 'number'
    case 'boolean':
      return 'boolean'
    default:
      return 'object'
  }
}

function isJsonArray(value: JsonValue | undefined): value is JsonValue[] {
  return Array.isArray(value)
}

function isJsonObject(value: JsonValue | undefined): value is JsonObject {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

function getSummary(value: JsonValue): string {
  if (value === null) return 'null'
  if (Array.isArray(value)) return `${value.length} item${value.length === 1 ? '' : 's'}`
  if (typeof value === 'object') return `${Object.keys(value).length} key${Object.keys(value).length === 1 ? '' : 's'}`
  if (typeof value === 'string') return value.length === 0 ? 'empty string' : `"${value}"`
  return String(value)
}

function getTypeIcon(type: JsonNodeType) {
  switch (type) {
    case 'object':
      return Braces
    case 'array':
      return Brackets
    case 'number':
      return Hash
    case 'boolean':
      return ToggleLeft
    default:
      return Quote
  }
}

function getTypeColor(type: JsonNodeType): React.ComponentProps<typeof Text>['color'] {
  switch (type) {
    case 'object':
      return 'info'
    case 'array':
      return 'secondary'
    case 'string':
      return 'primary'
    default:
      return 'slate'
  }
}

function getItemIcon(item: JsonTreeItem) {
  if (item.combinatorKind) return Layers3
  return getTypeIcon(item.jsonType)
}

function getDisplayTypeLabel(type: JsonNodeType, isReferenceContainer: boolean): string {
  if (isReferenceContainer) return 'reference'
  return type
}

function getItemTypeLabel(item: JsonTreeItem, isReferenceContainer: boolean): string {
  if (item.combinatorKind) return item.combinatorKind
  return getDisplayTypeLabel(item.jsonType, isReferenceContainer)
}

function isSchemaManagedEditorRow(item: JsonTreeItem, mode: JsonEditorMode): boolean {
  if (mode !== 'schema' || isSchemaUserDefinedEntryNode(item, mode)) return false
  return (
    item.name === 'type' ||
    item.name === 'title' ||
    item.name === 'description' ||
    item.name === 'format' ||
    item.name === 'default'
  )
}

function getSchemaManagedEditorHint(item: JsonTreeItem, mode: JsonEditorMode): string | null {
  if (!isSchemaManagedEditorRow(item, mode)) return null

  switch (item.name) {
    case 'type':
      return 'Edit schema type'
    case 'title':
      return 'Edit title'
    case 'description':
      return 'Edit help text'
    case 'format':
      return 'Select string format'
    case 'default':
      return 'Edit default preview value'
    default:
      return null
  }
}

function isPrimitiveValue(value: JsonValue | undefined): value is JsonPrimitive {
  return value === null || typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean'
}

function isPrimitiveOnlyEnumArray(item: JsonTreeItem): item is JsonTreeItem & { jsonValue: JsonValue[] } {
  return (
    item.name === 'enum' &&
    item.jsonType === 'array' &&
    isJsonArray(item.jsonValue) &&
    item.jsonValue.every(isPrimitiveValue)
  )
}

function isSchemaRequiredStringArray(item: JsonTreeItem): item is JsonTreeItem & { jsonValue: string[] } {
  return (
    item.name === 'required' &&
    item.jsonType === 'array' &&
    isJsonArray(item.jsonValue) &&
    item.jsonValue.every(value => typeof value === 'string')
  )
}

function isSchemaKeywordItemNode(item: JsonTreeItem): boolean {
  if (item.name !== 'items') return false
  const parentKey = item.jsonPath[item.jsonPath.length - 2]
  return !isSchemaUserDefinedEntryParentKey(parentKey)
}

function isSchemaItemsObject(item: JsonTreeItem): item is JsonTreeItem & { jsonValue: JsonObject } {
  return isSchemaKeywordItemNode(item) && item.jsonType === 'object' && isJsonObject(item.jsonValue)
}

function isSchemaTupleItemsArray(item: JsonTreeItem): item is JsonTreeItem & { jsonValue: JsonValue[] } {
  return isSchemaKeywordItemNode(item) && item.jsonType === 'array' && isJsonArray(item.jsonValue)
}

function getSchemaItemType(value: JsonObject): SchemaItemType | undefined {
  const rawType = Array.isArray(value.type)
    ? (value.type.find((entry): entry is string => typeof entry === 'string' && entry !== 'null') ?? value.type[0])
    : value.type
  if (rawType === 'integer') return 'number'
  return typeof rawType === 'string' && schemaItemTypeOptions.includes(rawType as SchemaItemType)
    ? (rawType as SchemaItemType)
    : undefined
}

function getSchemaObjectItemsSummary(value: JsonObject): string {
  if (typeof value.$ref === 'string') {
    return 'reference item schema'
  }

  if (isJsonArray(value.oneOf)) {
    return `oneOf item schema (${value.oneOf.length} option${value.oneOf.length === 1 ? '' : 's'})`
  }

  if (isJsonArray(value.anyOf)) {
    return `anyOf item schema (${value.anyOf.length} option${value.anyOf.length === 1 ? '' : 's'})`
  }

  if (isJsonArray(value.allOf)) {
    return `allOf item schema (${value.allOf.length} option${value.allOf.length === 1 ? '' : 's'})`
  }

  const itemType = getSchemaItemType(value)
  if (itemType === 'string' && typeof value.format === 'string' && value.format.trim().length > 0) {
    return `${itemType} item schema (${value.format})`
  }

  if (itemType) {
    return `${itemType} item schema`
  }

  return 'item schema'
}

function getSchemaDefaultSummary(value: JsonValue): string {
  if (isJsonObject(value)) {
    const keyCount = Object.keys(value).length
    return `default object (${keyCount} key${keyCount === 1 ? '' : 's'})`
  }

  if (isJsonArray(value)) {
    return `default array (${value.length} item${value.length === 1 ? '' : 's'})`
  }

  return `default ${getSummary(value)}`
}

function getCombinatorBranchLabel(branch: JsonValue, index: number): string {
  if (isJsonObject(branch) && typeof branch.title === 'string' && branch.title.trim().length > 0) {
    return branch.title
  }

  if (isJsonObject(branch) && isJsonObject(branch.properties)) {
    for (const [key, value] of Object.entries(branch.properties)) {
      if (isJsonObject(value) && typeof value.const === 'string' && value.const.trim().length > 0) {
        return value.const
      }

      if (isJsonObject(value) && typeof value.title === 'string' && value.title.trim().length > 0) {
        return value.title
      }

      if (key.trim().length > 0) {
        return key
      }
    }
  }

  return `Option ${index + 1}`
}

function getCombinatorBranchOptions(branches: JsonValue[]) {
  const labels = branches.map((branch, index) => getCombinatorBranchLabel(branch, index))
  const usedValues = new Set<string>()

  return branches.map((branch, index) => {
    const label = labels[index] ?? getCombinatorBranchLabel(branch, index)
    let value = label
    let collisionIndex = 1

    while (usedValues.has(value)) {
      value = `${label} [branch ${index + 1}${collisionIndex > 1 ? `:${collisionIndex}` : ''}]`
      collisionIndex += 1
    }

    usedValues.add(value)

    return {
      branch,
      index,
      label,
      value,
    }
  })
}

function getItemSummary(item: JsonTreeItem, mode: JsonEditorMode): string {
  if (item.syntheticKind === 'selectedOneOfBranch') {
    return item.syntheticLabel ?? getSummary(item.jsonValue)
  }

  if (mode === 'schema' && isSchemaItemsObject(item)) {
    return getSchemaObjectItemsSummary(item.jsonValue)
  }

  if (mode === 'schema' && isSchemaTupleItemsArray(item)) {
    return `tuple item schema (${item.jsonValue.length} entr${item.jsonValue.length === 1 ? 'y' : 'ies'})`
  }

  if (mode === 'schema' && item.name === 'default') {
    return getSchemaDefaultSummary(item.jsonValue)
  }

  if (isPrimitiveOnlyEnumArray(item)) {
    return item.jsonValue.map(getSummary).join(', ')
  }

  if (isSchemaRequiredStringArray(item)) {
    return item.jsonValue.length === 0 ? 'no required fields' : item.jsonValue.join(', ')
  }

  if (item.combinatorKind && isJsonArray(item.jsonValue)) {
    return `${item.jsonValue.length} option${item.jsonValue.length === 1 ? '' : 's'}`
  }

  return getSummary(item.jsonValue)
}

function getSeedValueForPath(path: JsonPath, nextValue: JsonValue): JsonValue {
  if (path.length === 0) return nextValue
  return typeof path[0] === 'number' ? [] : {}
}

function setValueAtPath(current: JsonValue, path: JsonPath, nextValue: JsonValue): JsonValue {
  if (path.length === 0) return nextValue

  const [head, ...rest] = path

  if (isJsonArray(current)) {
    const next = current.slice()
    const index = head as number
    const existing = next[index] ?? getSeedValueForPath(rest, nextValue)
    next[index] = setValueAtPath(existing, rest, nextValue)
    return next
  }

  if (!isJsonObject(current)) {
    return nextValue
  }

  const key = String(head)

  return {
    ...current,
    [key]: setValueAtPath(current[key] ?? getSeedValueForPath(rest, nextValue), rest, nextValue),
  }
}

function removeValueAtPath(current: JsonValue, path: JsonPath): JsonValue {
  if (path.length === 0) return current

  const [head, ...rest] = path

  if (rest.length === 0) {
    if (isJsonArray(current)) {
      return current.filter((_, index) => index !== Number(head))
    }

    if (isJsonObject(current)) {
      const next = { ...current }
      delete next[String(head)]
      return next
    }

    return current
  }

  if (isJsonArray(current)) {
    const next = current.slice()
    const index = Number(head)
    const existing = next[index] ?? getSeedValueForPath(rest, current)
    next[index] = removeValueAtPath(existing, rest)
    return next
  }

  if (isJsonObject(current)) {
    const key = String(head)
    return {
      ...current,
      [key]: removeValueAtPath(current[key] ?? getSeedValueForPath(rest, current), rest),
    }
  }

  return current
}

function renameObjectKeyAtPath(current: JsonValue, path: JsonPath, nextKey: string): JsonValue {
  if (path.length === 0) return current

  const parentPath = path.slice(0, -1)
  const currentKey = String(path[path.length - 1])

  function renameAt(node: JsonValue, segments: JsonPath): JsonValue {
    if (segments.length === 0) {
      if (
        !isJsonObject(node) ||
        nextKey.length === 0 ||
        nextKey === currentKey ||
        // biome-ignore lint/suspicious/noPrototypeBuiltins: Object.hasOwn not available with current tsconfig target
        Object.prototype.hasOwnProperty.call(node, nextKey)
      ) {
        return node
      }

      const entries = Object.entries(node)
      const targetIndex = entries.findIndex(([key]) => key === currentKey)
      if (targetIndex === -1) return node

      const nextEntries = entries.map(([key, value]) => [key === currentKey ? nextKey : key, value] as const)
      return Object.fromEntries(nextEntries)
    }

    const [head, ...rest] = segments

    if (isJsonArray(node)) {
      const index = Number(head)
      const existing = node[index] ?? getSeedValueForPath(rest, node)
      const child = renameAt(existing, rest)
      if (child === existing) return node
      const next = node.slice()
      next[index] = child
      return next
    }

    if (isJsonObject(node)) {
      const key = String(head)
      const existing = node[key] ?? getSeedValueForPath(rest, node)
      const child = renameAt(existing, rest)
      if (child === existing) return node
      return {
        ...node,
        [key]: child,
      }
    }

    return node
  }

  return renameAt(current, parentPath)
}

function createValueByKind(kind: JsonAddValueKind): JsonValue {
  switch (kind) {
    case 'number':
      return 0
    case 'boolean':
      return false
    case 'object':
      return {}
    case 'array':
      return []
    case 'null':
      return null
    case 'string':
      return ''
    default:
      return ''
  }
}

function cloneJsonValue(value: JsonValue): JsonValue {
  if (value === null || typeof value !== 'object') return value
  if (Array.isArray(value)) {
    return value.map(entry => cloneJsonValue(entry))
  }

  return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, cloneJsonValue(entry)]))
}

function addChildAtPath(current: JsonValue, path: JsonPath, kind: JsonAddValueKind): JsonValue {
  function addAt(node: JsonValue, segments: JsonPath): JsonValue {
    if (segments.length === 0) {
      if (isJsonArray(node)) {
        return [...node, createValueByKind(kind)]
      }

      if (isJsonObject(node)) {
        let suffix = 1
        let candidate = 'newKey'
        while (
          // biome-ignore lint/suspicious/noPrototypeBuiltins: Object.hasOwn not available with current tsconfig target
          Object.prototype.hasOwnProperty.call(node, candidate)
        ) {
          suffix += 1
          candidate = `newKey${suffix}`
        }

        return {
          ...node,
          [candidate]: createValueByKind(kind),
        }
      }

      return node
    }

    const [head, ...rest] = segments

    if (isJsonArray(node)) {
      const next = node.slice()
      const index = Number(head)
      const existing = next[index] ?? getSeedValueForPath(rest, node)
      next[index] = addAt(existing, rest)
      return next
    }

    if (isJsonObject(node)) {
      const key = String(head)
      return {
        ...node,
        [key]: addAt(node[key] ?? getSeedValueForPath(rest, node), rest),
      }
    }

    return node
  }

  return addAt(current, path)
}

function cloneValueAtPathWithResult(
  current: JsonValue,
  path: JsonPath,
): { value: JsonValue; clonedPath: JsonPath | null } {
  if (path.length === 0) {
    return {
      value: cloneJsonValue(current),
      clonedPath: [],
    }
  }

  const parentPath = getParentPath(path)
  const targetKey = path[path.length - 1]
  let clonedPath: JsonPath | null = null

  function cloneAt(node: JsonValue, segments: JsonPath): JsonValue {
    if (segments.length === 0) {
      if (isJsonArray(node)) {
        const index = Number(targetKey)
        if (!Number.isInteger(index) || index < 0 || index >= node.length) return node
        const next = node.slice()
        const insertedIndex = index + 1
        const sourceValue = node[index]
        if (sourceValue === undefined) return node
        next.splice(insertedIndex, 0, cloneJsonValue(sourceValue))
        clonedPath = [...parentPath, insertedIndex]
        return next
      }

      if (isJsonObject(node)) {
        const sourceKey = String(targetKey)
        if (
          // biome-ignore lint/suspicious/noPrototypeBuiltins: Object.hasOwn not available with current tsconfig target
          !Object.prototype.hasOwnProperty.call(node, sourceKey)
        ) {
          return node
        }

        let suffix = 1
        let candidate = `${sourceKey}Copy`
        while (
          // biome-ignore lint/suspicious/noPrototypeBuiltins: Object.hasOwn not available with current tsconfig target
          Object.prototype.hasOwnProperty.call(node, candidate)
        ) {
          suffix += 1
          candidate = `${sourceKey}Copy${suffix}`
        }

        const entries = Object.entries(node)
        const targetIndex = entries.findIndex(([key]) => key === sourceKey)
        if (targetIndex === -1) return node

        const nextEntries = entries.slice()
        const sourceValue = node[sourceKey]
        if (sourceValue === undefined) return node
        nextEntries.splice(targetIndex + 1, 0, [candidate, cloneJsonValue(sourceValue)])
        clonedPath = [...parentPath, candidate]
        return Object.fromEntries(nextEntries)
      }

      return node
    }

    const [head, ...rest] = segments

    if (isJsonArray(node)) {
      const index = Number(head)
      if (!Number.isInteger(index) || index < 0 || index >= node.length) return node
      const existing = node[index]
      if (existing === undefined) return node
      const child = cloneAt(existing, rest)
      if (child === existing) return node
      const next = node.slice()
      next[index] = child
      return next
    }

    if (isJsonObject(node)) {
      const key = String(head)
      if (
        // biome-ignore lint/suspicious/noPrototypeBuiltins: Object.hasOwn not available with current tsconfig target
        !Object.prototype.hasOwnProperty.call(node, key)
      ) {
        return node
      }
      const existing = node[key]
      if (existing === undefined) return node
      const child = cloneAt(existing, rest)
      if (child === existing) return node
      return {
        ...node,
        [key]: child,
      }
    }

    return node
  }

  return {
    value: cloneAt(current, parentPath),
    clonedPath,
  }
}

function reorderChildrenAtPath(current: JsonValue, sourcePath: JsonPath, targetPath: JsonPath): JsonValue {
  if (sourcePath.length === 0 || targetPath.length === 0) return current

  const sourceParentPath = getParentPath(sourcePath)
  const targetParentPath = getParentPath(targetPath)
  if (!jsonPathEquals(sourceParentPath, targetParentPath)) return current

  const sourceKey = sourcePath[sourcePath.length - 1]
  const targetKey = targetPath[targetPath.length - 1]

  function reorderAt(node: JsonValue, segments: JsonPath): JsonValue {
    if (segments.length === 0) {
      if (isJsonArray(node)) {
        const sourceIndex = Number(sourceKey)
        const targetIndex = Number(targetKey)
        if (
          !Number.isInteger(sourceIndex) ||
          !Number.isInteger(targetIndex) ||
          sourceIndex < 0 ||
          targetIndex < 0 ||
          sourceIndex >= node.length ||
          targetIndex >= node.length ||
          sourceIndex === targetIndex
        ) {
          return node
        }

        const next = node.slice()
        const moved = next[sourceIndex]
        if (moved === undefined) return node
        next.splice(sourceIndex, 1)
        const insertionIndex = sourceIndex < targetIndex ? targetIndex - 1 : targetIndex
        next.splice(insertionIndex, 0, moved)
        return next
      }

      if (isJsonObject(node)) {
        const sourceObjectKey = String(sourceKey)
        const targetObjectKey = String(targetKey)
        if (sourceObjectKey === targetObjectKey) return node

        const entries = Object.entries(node)
        const sourceIndex = entries.findIndex(([key]) => key === sourceObjectKey)
        const targetIndex = entries.findIndex(([key]) => key === targetObjectKey)
        if (sourceIndex === -1 || targetIndex === -1) return node

        const nextEntries = entries.slice()
        const movedEntry = nextEntries[sourceIndex]
        if (!movedEntry) return node
        const [movedKey, movedValue] = movedEntry
        nextEntries.splice(sourceIndex, 1)
        const insertionIndex = sourceIndex < targetIndex ? targetIndex - 1 : targetIndex
        nextEntries.splice(insertionIndex, 0, [movedKey, movedValue])
        return Object.fromEntries(nextEntries)
      }

      return node
    }

    const [head, ...rest] = segments

    if (isJsonArray(node)) {
      const index = Number(head)
      const existing = node[index] ?? getSeedValueForPath(rest, node)
      const child = reorderAt(existing, rest)
      if (child === existing) return node
      const next = node.slice()
      next[index] = child
      return next
    }

    if (isJsonObject(node)) {
      const key = String(head)
      const existing = node[key] ?? getSeedValueForPath(rest, node)
      const child = reorderAt(existing, rest)
      if (child === existing) return node
      return {
        ...node,
        [key]: child,
      }
    }

    return node
  }

  return reorderAt(current, sourceParentPath)
}

export function getTreeItemId(path: JsonPath): string {
  return ['root', ...path.map(segment => encodeURIComponent(String(segment)))].join('/')
}

function getExternalSchemaTreeItemId(ref: string, path: JsonPath = []): string {
  return ['external', encodeURIComponent(ref), ...path.map(segment => encodeURIComponent(String(segment)))].join('/')
}

function getSyntheticSelectedBranchId(path: JsonPath): string {
  return `${getTreeItemId(path)}/selected-branch`
}

function getExternalSchemasRootId() {
  return 'external-schemas'
}

function toTreeData(
  value: JsonValue,
  path: JsonPath = [],
  key = 'root',
  insideReferenceContainer = false,
): JsonTreeItem {
  const jsonType = getJsonType(value)
  const isReferenceContainer = isReferenceContainerValue(value)
  const nextInsideReferenceContainer = insideReferenceContainer || isReferenceContainer
  const isMutableNode = path.length > 0 && !nextInsideReferenceContainer
  const combinatorKind = typeof key === 'string' && isJsonCombinatorKey(key) && isJsonArray(value) ? key : undefined

  if (isJsonArray(value)) {
    return {
      id: getTreeItemId(path),
      name: key,
      jsonPath: path,
      jsonType,
      jsonValue: value,
      insideReferenceContainer: nextInsideReferenceContainer,
      combinatorKind,
      draggable: isMutableNode,
      droppable: isMutableNode,
      children: isJsonArray(value)
        ? value.map((entry, index) => toTreeData(entry, [...path, index], `[${index}]`, nextInsideReferenceContainer))
        : [],
    }
  }

  if (jsonType === 'object') {
    return {
      id: getTreeItemId(path),
      name: key,
      jsonPath: path,
      jsonType,
      jsonValue: value,
      insideReferenceContainer: nextInsideReferenceContainer,
      combinatorKind,
      draggable: isMutableNode,
      droppable: isMutableNode,
      children: isJsonObject(value)
        ? Object.entries(value).map(([childKey, childValue]) =>
            toTreeData(childValue, [...path, childKey], childKey, nextInsideReferenceContainer),
          )
        : [],
    }
  }

  return {
    id: getTreeItemId(path),
    name: key,
    jsonPath: path,
    jsonType,
    jsonValue: value,
    insideReferenceContainer: nextInsideReferenceContainer,
    combinatorKind,
    draggable: isMutableNode,
    droppable: isMutableNode,
  }
}

function getExternalSchemaLabel(ref: string, schema: JsonValue): string {
  if (isJsonObject(schema) && typeof schema.title === 'string' && schema.title.trim().length > 0) {
    return schema.title
  }

  return ref
}

function toExternalSchemaTreeData(ref: string, value: JsonValue, path: JsonPath = [], key = 'root'): JsonTreeItem {
  const jsonType = getJsonType(value)
  const isMutableNode = false
  const combinatorKind = typeof key === 'string' && isJsonCombinatorKey(key) && isJsonArray(value) ? key : undefined
  const syntheticKind = path.length === 0 ? 'externalSchemaDocument' : 'externalSchemaNode'

  if (isJsonArray(value)) {
    return {
      id: getExternalSchemaTreeItemId(ref, path),
      name: key,
      jsonPath: path,
      jsonType,
      jsonValue: value,
      insideReferenceContainer: false,
      combinatorKind,
      syntheticKind,
      syntheticLabel: ref,
      externalSchemaRef: ref,
      draggable: isMutableNode,
      droppable: isMutableNode,
      children: value.map((entry: JsonValue, index: number) =>
        toExternalSchemaTreeData(ref, entry, [...path, index], `[${index}]`),
      ),
    }
  }

  if (isJsonObject(value)) {
    return {
      id: getExternalSchemaTreeItemId(ref, path),
      name: path.length === 0 && isJsonObject(value) ? getExternalSchemaLabel(ref, value) : key,
      jsonPath: path,
      jsonType,
      jsonValue: value,
      insideReferenceContainer: false,
      combinatorKind,
      syntheticKind,
      syntheticLabel: ref,
      externalSchemaRef: ref,
      draggable: isMutableNode,
      droppable: isMutableNode,
      children: Object.entries(value).map(([childKey, childValue]) =>
        toExternalSchemaTreeData(ref, childValue, [...path, childKey], childKey),
      ),
    }
  }

  return {
    id: getExternalSchemaTreeItemId(ref, path),
    name: key,
    jsonPath: path,
    jsonType,
    jsonValue: value,
    insideReferenceContainer: false,
    combinatorKind,
    syntheticKind,
    syntheticLabel: ref,
    externalSchemaRef: ref,
    draggable: isMutableNode,
    droppable: isMutableNode,
  }
}

function attachExternalSchemaChildren(
  root: JsonTreeItem,
  externalSchemas?: JsonViewEditorExternalSchemas,
): JsonTreeItem {
  if (!externalSchemas || Object.keys(externalSchemas).length === 0) return root

  const externalChildren = Object.entries(externalSchemas).map(([ref, schema]) => toExternalSchemaTreeData(ref, schema))
  if (externalChildren.length === 0) return root

  const externalSchemasRoot: JsonTreeItem = {
    id: getExternalSchemasRootId(),
    name: 'External schemas',
    jsonPath: [],
    jsonType: 'object',
    jsonValue: externalSchemas,
    insideReferenceContainer: false,
    syntheticKind: 'externalSchemasRoot',
    draggable: false,
    droppable: false,
    children: externalChildren,
  }

  return {
    ...root,
    children: [...(root.children ?? []), externalSchemasRoot],
  }
}

function formatJsonPath(path: JsonPath): string {
  return path.reduce<string>((acc, segment) => {
    if (typeof segment === 'number') return `${acc}[${segment}]`
    return acc ? `${acc}.${segment}` : segment
  }, '')
}

function formatFieldPath(path: JsonPath): string {
  return path.length === 0 ? '$root' : path.map(segment => String(segment)).join('.')
}

function getValueAtPath(current: JsonValue, path: JsonPath): JsonValue | undefined {
  let node: JsonValue | undefined = current

  for (const segment of path) {
    if (node === undefined) return undefined
    if (typeof segment === 'number') {
      if (!isJsonArray(node) || segment < 0 || segment >= node.length) return undefined
      node = node[segment]
      continue
    }

    if (
      !isJsonObject(node) ||
      // biome-ignore lint/suspicious/noPrototypeBuiltins: Object.hasOwn not available with current tsconfig target
      !Object.prototype.hasOwnProperty.call(node, segment)
    ) {
      return undefined
    }
    node = node[segment]
  }

  return node
}

function getSchemaRequiredOptions(root: JsonValue, item: JsonTreeItem): string[] {
  if (item.name !== 'required' || item.jsonType !== 'array') return []

  const parentNode = getValueAtPath(root, getParentPath(item.jsonPath))
  if (!isJsonObject(parentNode) || !isJsonObject(parentNode.properties)) return []

  return Object.keys(parentNode.properties)
}

function isSchemaManagedMetadataKeyword(item: JsonTreeItem, mode: JsonEditorMode): boolean {
  return mode === 'schema' && (item.name === 'title' || item.name === 'description' || item.name === 'default')
}

function isSchemaUserDefinedEntryNode(item: JsonTreeItem, mode: JsonEditorMode): boolean {
  if (mode !== 'schema' || item.jsonPath.length === 0 || typeof item.jsonPath[item.jsonPath.length - 1] !== 'string') {
    return false
  }

  const parentKey = item.jsonPath[item.jsonPath.length - 2]
  return isSchemaUserDefinedEntryParentKey(parentKey)
}

function getSchemaDefaultOptions(
  root: JsonValue,
  item: JsonTreeItem,
): Array<{ label: string; value: string; jsonValue: JsonPrimitive }> {
  if (item.name !== 'default') return []

  const parentNode = getValueAtPath(root, getParentPath(item.jsonPath))
  if (!isJsonObject(parentNode)) return []

  const rawOptions = isJsonArray(parentNode.enum)
    ? parentNode.enum.filter(isPrimitiveValue)
    : isPrimitiveValue(parentNode.const)
      ? [parentNode.const]
      : []

  return rawOptions.map(option => ({
    label: option === null ? 'null' : String(option),
    value: JSON.stringify(option),
    jsonValue: option,
  }))
}

function hideSchemaManagedChildren(
  item: JsonTreeItem,
  mode: JsonEditorMode,
  combinatorSelections: CombinatorSelectionState,
): JsonTreeItem {
  if (mode === 'schema' && isSchemaRequiredStringArray(item)) {
    return {
      ...item,
      children: undefined,
    }
  }

  if (mode === 'schema' && item.combinatorKind === 'oneOf' && isJsonArray(item.jsonValue)) {
    const selectedIndex = combinatorSelections[getTreeItemId(item.jsonPath)] ?? 0
    const selectedBranchValue = item.jsonValue[selectedIndex]
    if (selectedBranchValue === undefined) {
      return {
        ...item,
        children: undefined,
      }
    }

    const selectedBranchItem = toTreeData(
      selectedBranchValue,
      [...item.jsonPath, selectedIndex],
      'Selected branch',
      item.insideReferenceContainer,
    )

    const normalizedSelectedBranch = hideSchemaManagedChildren(selectedBranchItem, mode, combinatorSelections)

    const syntheticSelectedBranch: JsonTreeItem = {
      ...normalizedSelectedBranch,
      id: getSyntheticSelectedBranchId(item.jsonPath),
      name: 'Selected branch',
      syntheticKind: 'selectedOneOfBranch',
      syntheticLabel: getCombinatorBranchLabel(selectedBranchValue, selectedIndex),
      draggable: false,
      droppable: false,
    }

    return {
      ...item,
      children: [syntheticSelectedBranch],
    }
  }

  if (!item.children?.length) return item

  return {
    ...item,
    children: item.children.map(child => hideSchemaManagedChildren(child as JsonTreeItem, mode, combinatorSelections)),
  }
}

function isLocalJsonRef(item: JsonTreeItem): item is JsonTreeItem & { jsonValue: string } {
  return item.name === '$ref' && typeof item.jsonValue === 'string' && item.jsonValue.startsWith('#')
}

function isReferenceContainerValue(value: JsonValue): value is JsonObject & { $ref: string } {
  return isJsonObject(value) && typeof value.$ref === 'string'
}

function decodeJsonPointerSegment(segment: string): string {
  return segment.split('~1').join('/').split('~0').join('~')
}

function resolveLocalJsonRefPath(root: JsonValue, ref: string): JsonPath | null {
  if (ref === '#') return []
  if (!ref.startsWith('#/')) return null

  let pointer: string
  try {
    pointer = decodeURIComponent(ref.slice(2))
  } catch {
    return null
  }

  const rawSegments = pointer.split('/').map(decodeJsonPointerSegment)
  const resolvedPath: JsonPath = []
  let current: JsonValue = root

  for (const segment of rawSegments) {
    if (isJsonArray(current)) {
      const index = Number(segment)
      if (!Number.isInteger(index) || index < 0 || index >= current.length) return null
      resolvedPath.push(index)
      const nextValue = current[index]
      if (nextValue === undefined) return null
      current = nextValue
      continue
    }

    if (isJsonObject(current)) {
      if (
        // biome-ignore lint/suspicious/noPrototypeBuiltins: Object.hasOwn not available with current tsconfig target
        !Object.prototype.hasOwnProperty.call(current, segment)
      ) {
        return null
      }
      resolvedPath.push(segment)
      const nextValue = current[segment]
      if (nextValue === undefined) return null
      current = nextValue
      continue
    }

    return null
  }

  return resolvedPath
}

function splitExternalRef(ref: string): { documentRef: string; pointerRef: string } {
  const hashIndex = ref.indexOf('#')
  if (hashIndex === -1) {
    return { documentRef: ref, pointerRef: '#' }
  }

  return {
    documentRef: ref.slice(0, hashIndex),
    pointerRef: `#${ref.slice(hashIndex + 1)}`,
  }
}

function resolveExternalJsonRefPath(
  externalSchemas: JsonViewEditorExternalSchemas | undefined,
  ref: string,
): { documentRef: string; registryRef: string; path: JsonPath } | null {
  if (!externalSchemas) return null

  const { documentRef, pointerRef } = splitExternalRef(ref)
  const documentRoot = externalSchemas[documentRef]
  if (documentRoot) {
    const resolvedPath = resolveLocalJsonRefPath(documentRoot, pointerRef)
    if (resolvedPath === null) return null

    return { documentRef, registryRef: documentRef, path: resolvedPath }
  }

  const exactTarget = externalSchemas[ref]
  if (!exactTarget) return null

  return { documentRef, registryRef: ref, path: [] }
}

function getRefResolutionContext(
  root: JsonValue,
  item: JsonTreeItem,
  externalSchemas?: JsonViewEditorExternalSchemas,
): { root: JsonValue; toId: (path: JsonPath) => string } {
  if (!item.externalSchemaRef || !externalSchemas) {
    return { root, toId: getTreeItemId }
  }

  const { documentRef } = splitExternalRef(item.externalSchemaRef)
  const registryRef = externalSchemas[documentRef] ? documentRef : item.externalSchemaRef

  return {
    root: externalSchemas[registryRef] ?? root,
    toId: (path: JsonPath) => getExternalSchemaTreeItemId(registryRef, path),
  }
}

function getRefTargetId(
  root: JsonValue,
  item: JsonTreeItem,
  externalSchemas?: JsonViewEditorExternalSchemas,
): string | null {
  const context = getRefResolutionContext(root, item, externalSchemas)

  if (isLocalJsonRef(item)) {
    const path = resolveLocalJsonRefPath(context.root, item.jsonValue)
    return path ? context.toId(path) : item.jsonValue === '#' ? context.toId([]) : null
  }

  if (item.name === '$ref' && typeof item.jsonValue === 'string' && !item.jsonValue.startsWith('#')) {
    const externalTarget = resolveExternalJsonRefPath(externalSchemas, item.jsonValue)
    return externalTarget ? getExternalSchemaTreeItemId(externalTarget.registryRef, externalTarget.path) : null
  }

  return null
}

function getRefTargetSummary(
  root: JsonValue,
  item: JsonTreeItem,
  externalSchemas?: JsonViewEditorExternalSchemas,
): string | null {
  const context = getRefResolutionContext(root, item, externalSchemas)

  if (isLocalJsonRef(item)) {
    const path = resolveLocalJsonRefPath(context.root, item.jsonValue)
    return path !== null ? formatJsonPath(path) : null
  }

  const rawRef = item.name === '$ref' && typeof item.jsonValue === 'string' ? item.jsonValue : null

  if (!rawRef) return null

  const externalTarget = resolveExternalJsonRefPath(externalSchemas, rawRef)
  if (!externalTarget) return null

  const suffix = formatJsonPath(externalTarget.path)
  return suffix ? `${externalTarget.documentRef}#${suffix}` : externalTarget.documentRef
}

function matchesQuery(item: JsonTreeItem, normalizedQuery: string): boolean {
  const haystack = [item.name, formatJsonPath(item.jsonPath), item.jsonType, getSummary(item.jsonValue)]

  if (typeof item.jsonValue === 'string') {
    haystack.push(item.jsonValue)
  }

  return haystack.some(part => part.toLocaleLowerCase().includes(normalizedQuery))
}

function filterTreeData(item: JsonTreeItem, query: string): JsonTreeItem | null {
  const normalizedQuery = query.trim().toLocaleLowerCase()
  if (!normalizedQuery) return item

  const selfMatches = matchesQuery(item, normalizedQuery)
  if (!item.children?.length) {
    return selfMatches ? item : null
  }

  if (selfMatches) return item

  const filteredChildren = item.children
    .map(child => filterTreeData(child as JsonTreeItem, normalizedQuery))
    .filter((child): child is JsonTreeItem => child !== null)

  if (filteredChildren.length === 0) return null

  return {
    ...item,
    children: filteredChildren,
  }
}

function stopTreeEvent(event: React.SyntheticEvent) {
  event.stopPropagation()
}

function PrimitiveValueEditor({
  item,
  editable,
  mode,
  rootValue,
  selectedCombinatorIndex,
  onSelectCombinatorIndex,
  onCommit,
}: {
  item: JsonTreeItem
  editable: boolean
  mode: JsonEditorMode
  rootValue: JsonValue
  selectedCombinatorIndex?: number
  onSelectCombinatorIndex?: (index: number) => void
  onCommit: (path: JsonPath, value: JsonValue) => void
}) {
  const { jsonType, jsonValue, jsonPath } = item
  const [draft, setDraft] = React.useState(() => (jsonType === 'number' ? String(jsonValue) : ''))
  const formatOptions =
    typeof jsonValue === 'string' &&
    jsonValue.length > 0 &&
    !schemaFormatOptions.includes(jsonValue as (typeof schemaFormatOptions)[number])
      ? [jsonValue, ...schemaFormatOptions]
      : schemaFormatOptions
  const schemaDefaultOptions = mode === 'schema' ? getSchemaDefaultOptions(rootValue, item) : []

  React.useEffect(() => {
    if (jsonType === 'number') {
      setDraft(String(jsonValue))
    }
  }, [jsonType, jsonValue])

  if (!editable) {
    return <span className={jsonViewEditorSummary}>{getItemSummary(item, mode)}</span>
  }

  if (mode === 'schema' && item.combinatorKind === 'oneOf' && isJsonArray(item.jsonValue)) {
    const branchOptions = getCombinatorBranchOptions(item.jsonValue)
    const selectedOption =
      branchOptions.find(option => option.index === (selectedCombinatorIndex ?? 0)) ?? branchOptions[0]

    return (
      <Select
        size="xs"
        value={selectedOption?.value}
        onValueChange={nextValue => {
          const nextOption = branchOptions.find(option => option.value === nextValue)
          if (nextOption) {
            onSelectCombinatorIndex?.(nextOption.index)
          }
        }}
        placeholder="Select branch"
        aria-label={`${item.name} branch`}
      >
        {branchOptions.map(option => (
          <SelectItem key={option.index} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </Select>
    )
  }

  if (mode === 'schema' && isSchemaRequiredStringArray(item)) {
    const options = getSchemaRequiredOptions(rootValue, item)
    if (options.length === 0) {
      return <span className={jsonViewEditorSummary}>{getItemSummary(item, mode)}</span>
    }

    const selected = new Set(item.jsonValue)
    return (
      <Flex align="center" gap="2" wrap="wrap" className="min-w-0">
        {options.map(option => (
          <label key={option} className={jsonViewEditorCheckboxWrap} onClick={stopTreeEvent} onKeyDown={stopTreeEvent}>
            <Checkbox
              size="xs"
              checked={selected.has(option)}
              onCheckedChange={checked => {
                const nextValue = checked
                  ? Array.from(new Set([...item.jsonValue, option]))
                  : item.jsonValue.filter(value => value !== option)
                onCommit(jsonPath, nextValue)
              }}
            />
            <span className={jsonViewEditorSummary}>{option}</span>
          </label>
        ))}
      </Flex>
    )
  }

  if (mode === 'schema' && isSchemaItemsObject(item)) {
    const itemsValue: JsonObject = item.jsonValue
    return (
      <Select
        size="xs"
        value={getSchemaItemType(itemsValue)}
        onValueChange={nextValue => onCommit(jsonPath, { ...itemsValue, type: nextValue as SchemaItemType })}
        placeholder="Select item type"
        aria-label={`${item.name} type`}
      >
        {schemaItemTypeOptions.map(type => (
          <SelectItem key={type} value={type}>
            {type}
          </SelectItem>
        ))}
      </Select>
    )
  }

  if (mode === 'schema' && item.name === 'format' && jsonType === 'string') {
    return (
      <Select
        size="xs"
        value={String(jsonValue)}
        onValueChange={nextValue => onCommit(jsonPath, nextValue)}
        placeholder="Select format"
        aria-label={`${item.name} value`}
      >
        {formatOptions.map(format => (
          <SelectItem key={format} value={format}>
            {format}
          </SelectItem>
        ))}
      </Select>
    )
  }

  if (mode === 'schema' && item.name === 'default' && isPrimitiveValue(jsonValue) && schemaDefaultOptions.length > 0) {
    return (
      <Select
        size="xs"
        value={JSON.stringify(jsonValue)}
        onValueChange={nextValue => {
          const nextOption = schemaDefaultOptions.find(option => option.value === nextValue)
          if (nextOption) {
            onCommit(jsonPath, nextOption.jsonValue)
          }
        }}
        placeholder="Select default"
        aria-label={`${item.name} value`}
      >
        {schemaDefaultOptions.map(option => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </Select>
    )
  }

  if (mode === 'schema' && item.name === 'description' && jsonType === 'string') {
    return (
      <Textarea
        size="xs"
        autoSize
        minRows={1}
        maxRows={6}
        value={String(jsonValue)}
        onClick={stopTreeEvent}
        onKeyDown={event => {
          event.stopPropagation()
        }}
        onChange={event => onCommit(jsonPath, event.target.value)}
        className={jsonViewEditorTextField}
        aria-label={`${item.name} value`}
      />
    )
  }

  if (jsonType === 'boolean') {
    return (
      <label className={jsonViewEditorCheckboxWrap} onClick={stopTreeEvent} onKeyDown={stopTreeEvent}>
        <Checkbox size="xs" checked={Boolean(jsonValue)} onCheckedChange={checked => onCommit(jsonPath, checked)} />
        <span className={jsonViewEditorSummary}>{jsonValue ? 'true' : 'false'}</span>
      </label>
    )
  }

  if (jsonType === 'number') {
    return (
      <TextField
        size="xs"
        value={draft}
        onClick={stopTreeEvent}
        onKeyDown={event => {
          if (event.key === 'Enter') event.preventDefault()
          event.stopPropagation()
          if (event.key === 'Enter') {
            const normalized = draft.trim()
            const next = Number(normalized)
            if (normalized !== '' && Number.isFinite(next)) onCommit(jsonPath, next)
          }
        }}
        onChange={event => setDraft(event.target.value)}
        onBlur={() => {
          const normalized = draft.trim()
          const next = Number(normalized)
          if (normalized !== '' && Number.isFinite(next)) {
            onCommit(jsonPath, next)
          } else {
            setDraft(String(jsonValue))
          }
        }}
        className={jsonViewEditorTextField}
        aria-label={`${item.name} value`}
      />
    )
  }

  if (jsonType === 'null') {
    return <span className={jsonViewEditorSummary}>null</span>
  }

  return (
    <TextField
      size="xs"
      value={String(jsonValue)}
      onClick={stopTreeEvent}
      onKeyDown={event => {
        if (event.key === 'Enter') event.preventDefault()
        event.stopPropagation()
      }}
      onChange={event => onCommit(jsonPath, event.target.value)}
      className={jsonViewEditorTextField}
      aria-label={`${item.name} value`}
    />
  )
}

function JsonTreeRow({
  item,
  isLeaf,
  editable,
  mode,
  rootValue,
  isReferenceContainer,
  issues,
  refTargetId,
  refTargetSummary,
  selectedCombinatorIndex,
  onJumpToRef,
  onSelectCombinatorIndex,
  onCommit,
  onRemove,
  onAddChild,
  onClone,
  onRenameKey,
  recentActionLabel,
}: {
  item: JsonTreeItem
  isLeaf: boolean
  editable: boolean
  mode: JsonEditorMode
  rootValue: JsonValue
  isReferenceContainer: boolean
  issues?: string[]
  refTargetId: string | null
  refTargetSummary: string | null
  selectedCombinatorIndex?: number
  onJumpToRef: (itemId: string) => void
  onSelectCombinatorIndex?: (path: JsonPath, index: number) => void
  onCommit: (path: JsonPath, value: JsonValue) => void
  onRemove: (path: JsonPath) => void
  onAddChild: (path: JsonPath, kind: JsonAddValueKind) => void
  onClone: (path: JsonPath) => void
  onRenameKey: (path: JsonPath, nextKey: string) => boolean
  recentActionLabel?: string | null
}) {
  const Icon = getItemIcon(item)
  const [isEditingKey, setIsEditingKey] = React.useState(false)
  const [draftKey, setDraftKey] = React.useState(item.name)

  React.useEffect(() => {
    setDraftKey(item.name)
  }, [item.name])

  const isSyntheticSelectedBranch = item.syntheticKind === 'selectedOneOfBranch'
  const isExternalSynthetic =
    item.syntheticKind === 'externalSchemasRoot' ||
    item.syntheticKind === 'externalSchemaDocument' ||
    item.syntheticKind === 'externalSchemaNode'
  const isSchemaOneOfRow = mode === 'schema' && item.combinatorKind === 'oneOf' && isJsonArray(item.jsonValue)
  const isSchemaManagedMetadataRow = isSchemaManagedMetadataKeyword(item, mode)
  const canEditSchemaKey = mode !== 'schema' || isSchemaUserDefinedEntryNode(item, mode)
  const canRename =
    !isSyntheticSelectedBranch &&
    !isExternalSynthetic &&
    !isSchemaOneOfRow &&
    !isSchemaManagedMetadataRow &&
    canEditSchemaKey &&
    editable &&
    item.jsonPath.length > 0 &&
    typeof item.jsonPath[item.jsonPath.length - 1] === 'string'
  const canRemove =
    !isSyntheticSelectedBranch && !isExternalSynthetic && !isSchemaOneOfRow && editable && item.jsonPath.length > 0
  const canClone =
    !isSyntheticSelectedBranch &&
    !isExternalSynthetic &&
    !isSchemaOneOfRow &&
    !isSchemaManagedMetadataRow &&
    canEditSchemaKey &&
    editable &&
    item.jsonPath.length > 0
  const isPrimitiveEnumArray = mode === 'schema' && isPrimitiveOnlyEnumArray(item)
  const isSchemaRequiredArray = mode === 'schema' && isSchemaRequiredStringArray(item)
  const isSchemaItemsObjectRow = mode === 'schema' && isSchemaItemsObject(item)
  const canAddChild =
    !isSyntheticSelectedBranch &&
    !isExternalSynthetic &&
    !isSchemaOneOfRow &&
    editable &&
    (item.jsonType === 'object' || item.jsonType === 'array')
  const canJumpToRef = refTargetId !== null
  const hasIssues = (issues?.length ?? 0) > 0
  const referenceSummary = isReferenceContainerValue(item.jsonValue) ? item.jsonValue.$ref : null
  const showSchemaManagedEditorAffordance = editable && isSchemaManagedEditorRow(item, mode)
  const useStackedLayout = showSchemaManagedEditorAffordance
  const schemaManagedEditorHint = showSchemaManagedEditorAffordance ? getSchemaManagedEditorHint(item, mode) : null

  const commitRename = () => {
    const nextKey = draftKey
    setIsEditingKey(false)
    if (canRename && nextKey.trim().length > 0 && nextKey !== item.name) {
      if (!onRenameKey(item.jsonPath, nextKey)) {
        setDraftKey(item.name)
      }
    } else {
      setDraftKey(item.name)
    }
  }

  const actions =
    editable || canJumpToRef ? (
      <span className={jsonViewEditorActions}>
        {canJumpToRef ? (
          <Button
            size="xs"
            variant="ghost"
            className="h-6 shrink-0 px-2 text-[0.6875rem]"
            aria-label={`Jump to ${item.name} target`}
            title="Jump to $ref target"
            onClick={event => {
              stopTreeEvent(event)
              if (refTargetId) {
                onJumpToRef(refTargetId)
              }
            }}
          >
            Jump
          </Button>
        ) : null}
        {canRename ? (
          <IconButton
            size="xs"
            variant="ghost"
            icon="pencil"
            title={`Rename ${item.name}`}
            aria-label={`Rename ${item.name}`}
            onClick={event => {
              stopTreeEvent(event)
              setIsEditingKey(true)
            }}
          />
        ) : null}
        {canAddChild && !isSchemaRequiredArray ? (
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
              <IconButton
                size="xs"
                variant="ghost"
                icon="plus"
                title={`Add child to ${item.name}`}
                aria-label={`Add child to ${item.name}`}
                onClick={event => {
                  stopTreeEvent(event)
                }}
              />
            </DropdownMenu.Trigger>
            <DropdownMenu.Content size="sm" align="end" sideOffset={6}>
              <DropdownMenu.Item onClick={() => onAddChild(item.jsonPath, 'string')}>
                {isPrimitiveEnumArray ? 'Enum string' : 'String'}
              </DropdownMenu.Item>
              <DropdownMenu.Item onClick={() => onAddChild(item.jsonPath, 'number')}>
                {isPrimitiveEnumArray ? 'Enum number' : 'Number'}
              </DropdownMenu.Item>
              <DropdownMenu.Item onClick={() => onAddChild(item.jsonPath, 'boolean')}>
                {isPrimitiveEnumArray ? 'Enum boolean' : 'Boolean'}
              </DropdownMenu.Item>
              {!isPrimitiveEnumArray ? (
                <DropdownMenu.Item onClick={() => onAddChild(item.jsonPath, 'object')}>Object</DropdownMenu.Item>
              ) : null}
              {!isPrimitiveEnumArray ? (
                <DropdownMenu.Item onClick={() => onAddChild(item.jsonPath, 'array')}>Array</DropdownMenu.Item>
              ) : null}
              <DropdownMenu.Item onClick={() => onAddChild(item.jsonPath, 'null')}>
                {isPrimitiveEnumArray ? 'Enum null' : 'Null'}
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        ) : null}
        {canClone ? (
          <IconButton
            size="xs"
            variant="ghost"
            icon="clipboard-copy"
            title={`Clone ${item.name}`}
            aria-label={`Clone ${item.name}`}
            onClick={event => {
              stopTreeEvent(event)
              onClone(item.jsonPath)
            }}
          />
        ) : null}
        {canRemove ? (
          <IconButton
            size="xs"
            variant="ghost"
            icon="trash-2"
            title={`Remove ${item.name}`}
            aria-label={`Remove ${item.name}`}
            onClick={event => {
              stopTreeEvent(event)
              onRemove(item.jsonPath)
            }}
          />
        ) : null}
      </span>
    ) : null

  return (
    <div
      className={cn(
        jsonViewEditorRow,
        useStackedLayout && jsonViewEditorRowStacked,
        hasIssues && jsonViewEditorRowError,
      )}
      aria-invalid={hasIssues ? true : undefined}
      data-has-issues={hasIssues ? 'true' : undefined}
    >
      <Flex align="center" justify="between" gap="2" className="min-w-0 overflow-hidden">
        <Flex align="center" gap="2" className="min-w-0 overflow-hidden">
          <Icon className="h-3.5 w-3.5 text-muted-foreground" />
          {editable && isEditingKey ? (
            <TextField
              size="xs"
              value={draftKey}
              onClick={stopTreeEvent}
              onChange={event => setDraftKey(event.target.value)}
              onBlur={commitRename}
              onKeyDown={event => {
                if (event.key === 'Enter') event.preventDefault()
                event.stopPropagation()
                if (event.key === 'Enter') {
                  commitRename()
                } else if (event.key === 'Escape') {
                  setDraftKey(item.name)
                  setIsEditingKey(false)
                }
              }}
              aria-label={`${item.name} key`}
              className={jsonViewEditorKeyField}
              autoFocus
            />
          ) : (
            <span className={jsonViewEditorKeyText}>{item.name}</span>
          )}
          {!useStackedLayout ? (
            <Text size="xs" color={getTypeColor(item.jsonType)} wrap="nowrap">
              {getItemTypeLabel(item, isReferenceContainer)}
            </Text>
          ) : null}
          {recentActionLabel ? <span className={jsonViewEditorRecentAction}>{recentActionLabel}</span> : null}
        </Flex>
        {useStackedLayout ? actions : null}
      </Flex>
      <div className={cn(jsonViewEditorValueStack, useStackedLayout && jsonViewEditorValueStacked)}>
        {schemaManagedEditorHint ? <Text className={jsonViewEditorManagedHint}>{schemaManagedEditorHint}</Text> : null}
        <div className={jsonViewEditorValue}>
          {isLeaf || isSchemaRequiredArray || isSchemaItemsObjectRow || isSchemaOneOfRow ? (
            <PrimitiveValueEditor
              item={item}
              editable={editable}
              mode={mode}
              rootValue={rootValue}
              selectedCombinatorIndex={selectedCombinatorIndex}
              onSelectCombinatorIndex={index => onSelectCombinatorIndex?.(item.jsonPath, index)}
              onCommit={onCommit}
            />
          ) : (
            <span className={jsonViewEditorSummary}>{getItemSummary(item, mode)}</span>
          )}
          {referenceSummary ? <span className={jsonViewEditorRefSummary}>{referenceSummary}</span> : null}
          {canJumpToRef && refTargetSummary ? (
            <span className={jsonViewEditorRefSummary}>{refTargetSummary}</span>
          ) : null}
          {!useStackedLayout ? actions : null}
        </div>
        {hasIssues
          ? issues?.map((issue, index) => (
              <Text key={`${item.id}-issue-${index}`} size="xs" className={jsonViewEditorIssueText}>
                {issue}
              </Text>
            ))
          : null}
      </div>
    </div>
  )
}

export function JsonViewEditor({
  value,
  onChange,
  editable = true,
  issues,
  mode = 'generic',
  searchable = false,
  defaultExpandAll = true,
  className,
  name = 'root',
  externalSchemas,
  combinatorSelections: combinatorSelectionsProp,
  onCombinatorSelectionsChange,
}: JsonViewEditorProps) {
  const isEditable = editable && typeof onChange === 'function'
  const [query, setQuery] = React.useState('')
  const [selectedItemId, setSelectedItemId] = React.useState<string | undefined>(undefined)
  const [recentActionItemId, setRecentActionItemId] = React.useState<string | undefined>(undefined)
  const [recentActionLabel, setRecentActionLabel] = React.useState<string | null>(null)
  const [uncontrolledCombinatorSelections, setUncontrolledCombinatorSelections] =
    React.useState<CombinatorSelectionState>({})
  const combinatorSelections = combinatorSelectionsProp ?? uncontrolledCombinatorSelections
  const treeRootRef = React.useRef<HTMLDivElement | null>(null)
  const recentActionTimeoutRef = React.useRef<number | null>(null)
  const treeData = React.useMemo(
    () =>
      attachExternalSchemaChildren(
        hideSchemaManagedChildren(toTreeData(value, [], name), mode, combinatorSelections),
        externalSchemas,
      ),
    [combinatorSelections, externalSchemas, mode, name, value],
  )
  const filteredTreeData = React.useMemo(() => filterTreeData(treeData, query), [treeData, query])
  const content = searchable ? filteredTreeData : treeData

  React.useEffect(() => {
    if (!selectedItemId) return
    const target = Array.from(treeRootRef.current?.querySelectorAll<HTMLElement>('[data-tree-item-id]') ?? []).find(
      node => node.dataset.treeItemId === selectedItemId,
    )
    if (typeof target?.focus === 'function') {
      target.focus()
    }
    if (typeof target?.scrollIntoView === 'function') {
      target.scrollIntoView({ block: 'nearest' })
    }
  }, [selectedItemId])

  React.useEffect(() => {
    return () => {
      if (recentActionTimeoutRef.current !== null) {
        window.clearTimeout(recentActionTimeoutRef.current)
      }
    }
  }, [])

  const clearRecentAction = React.useCallback(() => {
    if (recentActionTimeoutRef.current !== null) {
      window.clearTimeout(recentActionTimeoutRef.current)
      recentActionTimeoutRef.current = null
    }
    setRecentActionItemId(undefined)
    setRecentActionLabel(null)
  }, [])

  const showRecentAction = React.useCallback((itemId: string, label: string) => {
    if (recentActionTimeoutRef.current !== null) {
      window.clearTimeout(recentActionTimeoutRef.current)
    }
    setRecentActionItemId(itemId)
    setRecentActionLabel(label)
    recentActionTimeoutRef.current = window.setTimeout(() => {
      setRecentActionItemId(undefined)
      setRecentActionLabel(null)
      recentActionTimeoutRef.current = null
    }, 2200)
  }, [])

  const handleCommit = React.useCallback(
    (path: JsonPath, nextValue: JsonValue) => {
      clearRecentAction()
      onChange?.(setValueAtPath(value, path, nextValue))
    },
    [clearRecentAction, onChange, value],
  )

  const handleRemove = React.useCallback(
    (path: JsonPath) => {
      clearRecentAction()
      onChange?.(removeValueAtPath(value, path))
    },
    [clearRecentAction, onChange, value],
  )

  const handleAddChild = React.useCallback(
    (path: JsonPath, kind: JsonAddValueKind) => {
      clearRecentAction()
      onChange?.(addChildAtPath(value, path, kind))
    },
    [clearRecentAction, onChange, value],
  )

  const handleRenameKey = React.useCallback(
    (path: JsonPath, nextKey: string) => {
      const nextValue = renameObjectKeyAtPath(value, path, nextKey)
      if (nextValue !== value && onChange) {
        clearRecentAction()
        onChange(nextValue)
        return true
      }
      return false
    },
    [clearRecentAction, onChange, value],
  )

  const handleClone = React.useCallback(
    (path: JsonPath) => {
      const result = cloneValueAtPathWithResult(value, path)
      if (result.value !== value) {
        onChange?.(result.value)
        if (result.clonedPath) {
          const clonedItemId = getTreeItemId(result.clonedPath)
          setSelectedItemId(clonedItemId)
          showRecentAction(clonedItemId, 'Duplicated')
        }
      }
    },
    [onChange, showRecentAction, value],
  )

  const handleItemDrag = React.useCallback(
    (sourceItem: TreeDataItem, targetItem: TreeDataItem) => {
      const sourceJsonItem = sourceItem as JsonTreeItem
      const targetJsonItem = targetItem as JsonTreeItem
      if (sourceJsonItem.insideReferenceContainer || targetJsonItem.insideReferenceContainer) return

      const sourcePath = sourceJsonItem.jsonPath
      const targetPath = targetJsonItem.jsonPath
      const nextValue = reorderChildrenAtPath(value, sourcePath, targetPath)
      if (nextValue !== value) {
        clearRecentAction()
        onChange?.(nextValue)
      }
    },
    [clearRecentAction, onChange, value],
  )

  const handleJumpToRef = React.useCallback(
    (itemId: string) => {
      if (searchable) {
        setQuery('')
      }
      setSelectedItemId(itemId)
    },
    [searchable],
  )

  const handleSelectCombinatorIndex = React.useCallback(
    (path: JsonPath, index: number) => {
      const pathKey = getTreeItemId(path)
      const nextSelections = { ...combinatorSelections, [pathKey]: index }
      if (combinatorSelectionsProp === undefined) {
        setUncontrolledCombinatorSelections(nextSelections)
      }
      onCombinatorSelectionsChange?.(nextSelections)
    },
    [combinatorSelections, combinatorSelectionsProp, onCombinatorSelectionsChange],
  )

  const renderItem = React.useCallback(
    ({ item, isLeaf }: TreeRenderItemParams) => {
      const jsonItem = item as JsonTreeItem
      const isReferenceContainer = isReferenceContainerValue(jsonItem.jsonValue)
      const refTargetId = getRefTargetId(value, jsonItem, externalSchemas)
      const refTargetSummary = getRefTargetSummary(value, jsonItem, externalSchemas)
      const itemEditable =
        isEditable &&
        !jsonItem.insideReferenceContainer &&
        jsonItem.syntheticKind !== 'externalSchemasRoot' &&
        jsonItem.syntheticKind !== 'externalSchemaDocument' &&
        jsonItem.syntheticKind !== 'externalSchemaNode'
      const itemIssues =
        jsonItem.syntheticKind === 'externalSchemasRoot' ||
        jsonItem.syntheticKind === 'externalSchemaDocument' ||
        jsonItem.syntheticKind === 'externalSchemaNode'
          ? undefined
          : issues?.[formatFieldPath(jsonItem.jsonPath)]
      const selectedCombinatorIndex = combinatorSelections[getTreeItemId(jsonItem.jsonPath)] ?? 0

      return (
        <JsonTreeRow
          item={jsonItem}
          isLeaf={isLeaf}
          editable={itemEditable}
          mode={mode}
          rootValue={value}
          isReferenceContainer={isReferenceContainer}
          issues={itemIssues}
          refTargetId={refTargetId}
          refTargetSummary={refTargetSummary}
          selectedCombinatorIndex={selectedCombinatorIndex}
          onJumpToRef={handleJumpToRef}
          onSelectCombinatorIndex={handleSelectCombinatorIndex}
          onCommit={handleCommit}
          onRemove={handleRemove}
          onAddChild={handleAddChild}
          onClone={handleClone}
          onRenameKey={handleRenameKey}
          recentActionLabel={recentActionItemId === jsonItem.id ? recentActionLabel : null}
        />
      )
    },
    [
      handleAddChild,
      handleClone,
      handleCommit,
      handleJumpToRef,
      handleSelectCombinatorIndex,
      handleRemove,
      handleRenameKey,
      combinatorSelections,
      isEditable,
      issues,
      externalSchemas,
      mode,
      recentActionItemId,
      recentActionLabel,
      value,
    ],
  )

  const contentEditable = isEditable && !content?.insideReferenceContainer

  return (
    <div className={cn(jsonViewEditorRoot, className)}>
      {searchable ? (
        <div className={jsonViewEditorToolbar}>
          <TextField
            size="xs"
            value={query}
            onChange={event => setQuery(event.target.value)}
            onKeyDown={event => {
              if (event.key === 'Enter') {
                event.preventDefault()
                event.stopPropagation()
              }
            }}
            placeholder="Search keys, values, $ref…"
            aria-label={`${name} search`}
            className={jsonViewEditorTextField}
            leftIcon={<Search className="h-3.5 w-3.5" />}
          />
        </div>
      ) : null}

      {content ? (
        (content.children?.length ?? 0) === 0 && content.jsonType !== 'array' && content.jsonType !== 'object' ? (
          <JsonTreeRow
            item={content}
            isLeaf
            editable={contentEditable}
            mode={mode}
            rootValue={value}
            isReferenceContainer={isReferenceContainerValue(content.jsonValue)}
            issues={issues?.[formatFieldPath(content.jsonPath)]}
            refTargetId={getRefTargetId(value, content, externalSchemas)}
            refTargetSummary={getRefTargetSummary(value, content, externalSchemas)}
            selectedCombinatorIndex={combinatorSelections[getTreeItemId(content.jsonPath)] ?? 0}
            onJumpToRef={handleJumpToRef}
            onSelectCombinatorIndex={handleSelectCombinatorIndex}
            onCommit={handleCommit}
            onRemove={handleRemove}
            onAddChild={handleAddChild}
            onClone={handleClone}
            onRenameKey={handleRenameKey}
          />
        ) : (
          <TreeView.Root
            ref={treeRootRef}
            size="xs"
            data={content}
            className={jsonViewEditorTree}
            selectedItemId={selectedItemId}
            expandAll={query.trim().length > 0 || defaultExpandAll}
            renderItem={renderItem}
            onItemDrag={isEditable ? handleItemDrag : undefined}
          />
        )
      ) : (
        <div className={jsonViewEditorEmptyState}>No matching JSON nodes</div>
      )}
    </div>
  )
}
