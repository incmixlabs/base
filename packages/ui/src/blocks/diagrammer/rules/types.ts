import type { Viewport } from '@xyflow/react'

export type RulesDiagramId = string

export type RulesDiagramNodeKind = 'start' | 'event' | 'condition' | 'action' | 'end'

export type RulesDiagramExpressionLanguage = 'plain' | 'javascript' | 'jsonlogic' | 'cel' | 'dsl'

export interface RulesDiagramPosition {
  x: number
  y: number
}

export interface RulesDiagramLayout {
  /**
   * Positions keyed by rules model node id. Prefixed diagrammer ids are still
   * accepted by the adapter for compatibility.
   */
  nodes?: Record<RulesDiagramId, RulesDiagramPosition>
  viewport?: Viewport
}

export interface RulesDiagramExpression {
  language?: RulesDiagramExpressionLanguage
  source: string
  metadata?: Record<string, unknown>
}

export interface RulesDiagramAction {
  type: string
  label?: string
  expression?: RulesDiagramExpression
  parameters?: Record<string, unknown>
  metadata?: Record<string, unknown>
}

export interface RulesDiagramConditionBranch {
  id: RulesDiagramId
  label: string
  expression?: RulesDiagramExpression
  targetNodeId?: RulesDiagramId
  isDefault?: boolean
  metadata?: Record<string, unknown>
}

export interface RulesDiagramNode {
  id: RulesDiagramId
  kind: RulesDiagramNodeKind
  label: string
  description?: string
  expression?: RulesDiagramExpression
  action?: RulesDiagramAction
  branches?: RulesDiagramConditionBranch[]
  metadata?: Record<string, unknown>
}

export interface RulesDiagramTransition {
  id: RulesDiagramId
  sourceNodeId: RulesDiagramId
  targetNodeId: RulesDiagramId
  sourcePortId?: RulesDiagramId
  targetPortId?: RulesDiagramId
  label?: string
  conditionBranchId?: RulesDiagramId
  expression?: RulesDiagramExpression
  metadata?: Record<string, unknown>
}

export interface RulesDiagramResolvedTransition extends RulesDiagramTransition {
  derivedFromBranch?: boolean
}

export interface RulesDiagramDocument {
  version: 1
  id?: RulesDiagramId
  title?: string
  nodes: RulesDiagramNode[]
  transitions?: RulesDiagramTransition[]
  layout?: RulesDiagramLayout
  metadata?: Record<string, unknown>
}

export interface RulesDiagramNodePayload {
  kind: 'rule-node'
  nodeId: RulesDiagramId
  node: RulesDiagramNode
}

export interface RulesDiagramEdgePayload {
  kind: 'transition'
  transitionId: RulesDiagramId
  transition: RulesDiagramResolvedTransition
}

export interface RulesDiagramValidationIssue {
  code: string
  message: string
  severity: 'error' | 'warning'
  nodeId?: RulesDiagramId
  branchId?: RulesDiagramId
  transitionId?: RulesDiagramId
}

export interface ValidateRulesDiagramDocumentOptions {
  allowCycles?: boolean
}
