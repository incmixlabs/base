'use client'

import { Braces, Brackets, Hash, Quote, ToggleLeft } from 'lucide-react'
import * as React from 'react'
import { Badge } from '@/elements/badge/Badge'
import type { TreeDataItem, TreeRenderItemParams } from '@/elements/tree-view/TreeView'
import { TreeView } from '@/elements/tree-view/TreeView'
import { cn } from '@/lib/utils'
import { Text } from '@/typography/text/Text'
import {
  jsonDiffViewEmpty,
  jsonDiffViewKey,
  jsonDiffViewKeyText,
  jsonDiffViewRoot,
  jsonDiffViewRow,
  jsonDiffViewRowAdded,
  jsonDiffViewRowModified,
  jsonDiffViewRowRemoved,
  jsonDiffViewSummary,
  jsonDiffViewValue,
} from './JsonDiffView.css'
import type { JsonDiffViewProps } from './json-diff-view.props'
import type { JsonValue } from './json-value.types'

type JsonPathSegment = string | number
type JsonPath = JsonPathSegment[]
type JsonNodeType = 'object' | 'array' | 'string' | 'number' | 'boolean' | 'null'
type JsonDiffKind = 'unchanged' | 'added' | 'removed' | 'modified'

type JsonDiffTreeItem = TreeDataItem & {
  jsonPath: JsonPath
  diffKind: JsonDiffKind
  jsonType: JsonNodeType
  beforeValue?: JsonValue
  afterValue?: JsonValue
}

export type { JsonDiffViewProps } from './json-diff-view.props'

function isJsonArray(value: JsonValue | undefined): value is JsonValue[] {
  return Array.isArray(value)
}

function isJsonObject(value: JsonValue | undefined): value is Record<string, JsonValue> {
  return value !== null && value !== undefined && typeof value === 'object' && !Array.isArray(value)
}

function getJsonType(value: JsonValue | undefined): JsonNodeType {
  if (value === null || value === undefined) return 'null'
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

function getSummary(value: JsonValue | undefined): string {
  if (value === undefined) return 'missing'
  if (value === null) return 'null'
  if (Array.isArray(value)) return `${value.length} item${value.length === 1 ? '' : 's'}`
  if (typeof value === 'object') return `${Object.keys(value).length} key${Object.keys(value).length === 1 ? '' : 's'}`
  if (typeof value === 'string') return value.length === 0 ? 'empty string' : `"${value}"`
  return String(value)
}

function getTreeItemId(path: JsonPath): string {
  return path.length === 0 ? 'root' : `root/${path.map(segment => encodeURIComponent(String(segment))).join('/')}`
}

function jsonValuesEqual(left: JsonValue | undefined, right: JsonValue | undefined): boolean {
  return JSON.stringify(left) === JSON.stringify(right)
}

function buildDiffTree(
  name: string,
  before: JsonValue | undefined,
  after: JsonValue | undefined,
  path: JsonPath,
  hideUnchanged: boolean,
): JsonDiffTreeItem | null {
  const beforeType = getJsonType(before)
  const afterType = getJsonType(after)
  const preferredValue = after !== undefined ? after : before
  const jsonType = getJsonType(preferredValue)

  let diffKind: JsonDiffKind
  if (before === undefined) {
    diffKind = 'added'
  } else if (after === undefined) {
    diffKind = 'removed'
  } else if (jsonValuesEqual(before, after)) {
    diffKind = 'unchanged'
  } else if (beforeType !== afterType) {
    diffKind = 'modified'
  } else {
    diffKind = 'modified'
  }

  const children: JsonDiffTreeItem[] = []

  if (isJsonObject(before) || isJsonObject(after)) {
    const keys = new Set([...Object.keys(before ?? {}), ...Object.keys(after ?? {})])
    for (const key of keys) {
      const child = buildDiffTree(
        key,
        isJsonObject(before) ? before[key] : undefined,
        isJsonObject(after) ? after[key] : undefined,
        [...path, key],
        hideUnchanged,
      )
      if (child) children.push(child)
    }
  } else if (isJsonArray(before) || isJsonArray(after)) {
    const beforeLength = isJsonArray(before) ? before.length : 0
    const afterLength = isJsonArray(after) ? after.length : 0
    const maxLength = Math.max(beforeLength, afterLength)
    for (let index = 0; index < maxLength; index += 1) {
      const child = buildDiffTree(
        `[${index}]`,
        isJsonArray(before) ? before[index] : undefined,
        isJsonArray(after) ? after[index] : undefined,
        [...path, index],
        hideUnchanged,
      )
      if (child) children.push(child)
    }
  }

  const hasChangedChildren = children.some(child => child.diffKind !== 'unchanged')
  const effectiveKind = diffKind === 'unchanged' && hasChangedChildren ? 'modified' : diffKind

  if (hideUnchanged && effectiveKind === 'unchanged' && children.length === 0) {
    return null
  }

  return {
    id: getTreeItemId(path),
    name,
    icon: getTypeIcon(jsonType),
    jsonPath: path,
    diffKind: effectiveKind,
    jsonType,
    beforeValue: before,
    afterValue: after,
    className:
      effectiveKind === 'added'
        ? jsonDiffViewRowAdded
        : effectiveKind === 'removed'
          ? jsonDiffViewRowRemoved
          : effectiveKind === 'modified'
            ? jsonDiffViewRowModified
            : undefined,
    children: children.length > 0 ? children : undefined,
  }
}

function getRowSummary(item: JsonDiffTreeItem): string {
  if (item.diffKind === 'added') return getSummary(item.afterValue)
  if (item.diffKind === 'removed') return getSummary(item.beforeValue)
  if (item.diffKind === 'modified') return `${getSummary(item.beforeValue)} -> ${getSummary(item.afterValue)}`
  return getSummary(item.afterValue)
}

function getBadgeColor(kind: JsonDiffKind): 'neutral' | 'info' | 'warning' | 'error' {
  switch (kind) {
    case 'added':
      return 'info'
    case 'removed':
      return 'error'
    case 'modified':
      return 'warning'
    default:
      return 'neutral'
  }
}

function getBadgeLabel(kind: JsonDiffKind): string {
  switch (kind) {
    case 'added':
      return 'Added'
    case 'removed':
      return 'Removed'
    case 'modified':
      return 'Modified'
    default:
      return 'Unchanged'
  }
}

function renderDiffRow({ item }: TreeRenderItemParams) {
  const diffItem = item as JsonDiffTreeItem

  return (
    <div className={jsonDiffViewRow}>
      <div className={jsonDiffViewKey}>
        <span className={jsonDiffViewKeyText}>{diffItem.name}</span>
        <Text size="xs" color="secondary" wrap="nowrap">
          {diffItem.jsonType}
        </Text>
      </div>
      <div className={jsonDiffViewValue}>
        <span className={jsonDiffViewSummary}>{getRowSummary(diffItem)}</span>
        {diffItem.diffKind !== 'unchanged' ? (
          <Badge size="xs" variant="soft" color={getBadgeColor(diffItem.diffKind)}>
            {getBadgeLabel(diffItem.diffKind)}
          </Badge>
        ) : null}
      </div>
    </div>
  )
}

export function JsonDiffView({
  before,
  after,
  name = 'root',
  hideUnchanged = false,
  defaultExpandAll = true,
  className,
  ...props
}: JsonDiffViewProps) {
  const data = React.useMemo(
    () => buildDiffTree(name, before, after, [], hideUnchanged),
    [after, before, hideUnchanged, name],
  )

  if (!data) {
    return (
      <div className={cn(jsonDiffViewRoot, className)} {...props}>
        <div className={jsonDiffViewEmpty}>No JSON differences.</div>
      </div>
    )
  }

  return (
    <div className={cn(jsonDiffViewRoot, className)} {...props}>
      <TreeView.Root data={data} expandAll={defaultExpandAll} renderItem={renderDiffRow} />
    </div>
  )
}
