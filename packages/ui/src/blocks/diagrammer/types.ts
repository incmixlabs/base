import type { EdgeProps, NodeProps, Viewport, XYPosition } from '@xyflow/react'
import type * as React from 'react'

export type DiagrammerId = string

export type DiagrammerPortSide = 'top' | 'right' | 'bottom' | 'left'
export type DiagrammerPortDirection = 'input' | 'output' | 'both'

export interface DiagrammerPort {
  id: DiagrammerId
  label?: string
  side?: DiagrammerPortSide
  direction?: DiagrammerPortDirection
  metadata?: Record<string, unknown>
}

export interface DiagrammerNodeData<TPayload = unknown> extends Record<string, unknown> {
  label: string
  description?: string
  icon?: string
  tone?: 'neutral' | 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error'
  payload?: TPayload
  ports?: DiagrammerPort[]
  collapsed?: boolean
  metadata?: Record<string, unknown>
}

export interface DiagrammerNode<TPayload = unknown> {
  id: DiagrammerId
  type?: string
  position: XYPosition
  width?: number
  height?: number
  data: DiagrammerNodeData<TPayload>
  parentId?: DiagrammerId
  selected?: boolean
  draggable?: boolean
  selectable?: boolean
}

export interface DiagrammerEdgeData<TPayload = unknown> extends Record<string, unknown> {
  label?: string
  payload?: TPayload
  metadata?: Record<string, unknown>
}

export interface DiagrammerEdge<TPayload = unknown> {
  id: DiagrammerId
  type?: 'default' | 'straight' | 'step' | 'smoothstep' | string
  source: DiagrammerId
  target: DiagrammerId
  sourcePortId?: DiagrammerId
  targetPortId?: DiagrammerId
  data?: DiagrammerEdgeData<TPayload>
  selected?: boolean
  animated?: boolean
  selectable?: boolean
}

export interface DiagrammerDocument<TNodePayload = unknown, TEdgePayload = unknown> {
  version: 1
  id?: DiagrammerId
  title?: string
  nodes: DiagrammerNode<TNodePayload>[]
  edges: DiagrammerEdge<TEdgePayload>[]
  viewport?: Viewport
  metadata?: Record<string, unknown>
}

export interface DiagrammerValidationIssue {
  code: string
  message: string
  severity: 'error' | 'warning'
  nodeId?: DiagrammerId
  edgeId?: DiagrammerId
}

export interface DiagrammerNodeRendererProps<TPayload = unknown> {
  node: DiagrammerNode<TPayload>
  selected?: boolean
}

export interface DiagrammerEdgeRendererProps<TPayload = unknown> {
  edge: DiagrammerEdge<TPayload>
  selected?: boolean
}

export interface DiagrammerAdapter<TNodePayload = unknown, TEdgePayload = unknown> {
  renderNode?: (props: DiagrammerNodeRendererProps<TNodePayload>) => React.ReactNode
  renderEdgeLabel?: (props: DiagrammerEdgeRendererProps<TEdgePayload>) => React.ReactNode
  validateConnection?: (input: {
    sourceId: DiagrammerId
    targetId: DiagrammerId
    sourcePortId?: DiagrammerId
    targetPortId?: DiagrammerId
    document: DiagrammerDocument<TNodePayload, TEdgePayload>
  }) => boolean
  validateDocument?: (document: DiagrammerDocument<TNodePayload, TEdgePayload>) => DiagrammerValidationIssue[]
}

export type DiagrammerFlowNode<TPayload = unknown> = import('@xyflow/react').Node<
  {
    diagramNode: DiagrammerNode<TPayload>
    adapter?: DiagrammerAdapter<TPayload, unknown>
  },
  'diagrammer'
>

export type DiagrammerFlowEdge<TPayload = unknown> = import('@xyflow/react').Edge<{
  diagramEdge: DiagrammerEdge<TPayload>
  adapter?: DiagrammerAdapter<unknown, TPayload>
}>

export type DiagrammerFlowNodeProps = NodeProps<DiagrammerFlowNode>
export type DiagrammerFlowEdgeProps = EdgeProps<DiagrammerFlowEdge>
