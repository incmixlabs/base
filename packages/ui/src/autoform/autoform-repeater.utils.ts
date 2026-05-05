import type { AutoFormNormalizedArrayNode } from '@incmix/core'
import { singularizeLabel } from '@/utils/strings'

export function getRepeaterStoreKey(node: AutoFormNormalizedArrayNode, repeaterScopeKey: string | undefined) {
  return repeaterScopeKey ? `${repeaterScopeKey}>${node.key}` : node.path
}

export function getRepeaterItemScopeKey(repeaterStoreKey: string, rowId: string) {
  return `${repeaterStoreKey}#${rowId}`
}

export function getArrayItemHeading(node: AutoFormNormalizedArrayNode, index: number, value: unknown) {
  const baseLabel = getArrayItemLabel(node, index)
  const summary = getArrayItemSummary(node, value)
  return summary ? `${baseLabel} · ${summary}` : baseLabel
}

export function getArrayItemLabel(node: AutoFormNormalizedArrayNode, index: number) {
  const baseLabel = node.label ?? node.key
  return `${baseLabel} ${index + 1}`
}

export function getAddArrayItemLabel(node: AutoFormNormalizedArrayNode) {
  return `${getAddArrayItemButtonText(node)} item`
}

export function getAddArrayItemButtonText(node: AutoFormNormalizedArrayNode) {
  const singular = singularizeLabel(node.label ?? node.key)
  return `Add ${singular}`
}

export function getEmptyArrayStateText(node: AutoFormNormalizedArrayNode) {
  const singular = singularizeLabel(node.label ?? node.key).toLowerCase()
  return `No ${singular} added yet.`
}

function getArrayItemSummary(node: AutoFormNormalizedArrayNode, value: unknown) {
  if (node.itemNode.kind === 'field') {
    return summarizeArrayItemValue(value)
  }

  if (!isSummaryObject(value)) return undefined

  for (const child of node.itemNode.nodes) {
    if (child.kind !== 'field') continue
    const nextValue = summarizeArrayItemValue(value[child.key])
    if (nextValue) return nextValue
  }

  return undefined
}

function summarizeArrayItemValue(value: unknown) {
  if (typeof value === 'string') {
    const trimmed = value.trim()
    return trimmed.length > 0 ? trimmed : undefined
  }
  if (typeof value === 'number') return String(value)
  return undefined
}

function isSummaryObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}
