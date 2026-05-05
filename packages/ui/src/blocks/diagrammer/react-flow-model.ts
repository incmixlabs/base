import type { Connection, EdgeChange, NodeChange, Viewport } from '@xyflow/react'
import { applyEdgeChanges, applyNodeChanges } from '@xyflow/react'
import type {
  DiagrammerAdapter,
  DiagrammerDocument,
  DiagrammerEdge,
  DiagrammerFlowEdge,
  DiagrammerFlowNode,
  DiagrammerId,
} from './types'

function createEdgeId(connection: Connection) {
  const sourceHandle = connection.sourceHandle ? `:${connection.sourceHandle}` : ''
  const targetHandle = connection.targetHandle ? `:${connection.targetHandle}` : ''
  return `${connection.source}${sourceHandle}->${connection.target}${targetHandle}`
}

export function toDiagrammerFlowNodes<TNodePayload, TEdgePayload>(
  document: DiagrammerDocument<TNodePayload, TEdgePayload>,
  adapter?: DiagrammerAdapter<TNodePayload, TEdgePayload>,
): DiagrammerFlowNode<TNodePayload>[] {
  return document.nodes.map(node => ({
    id: node.id,
    type: 'diagrammer',
    position: node.position,
    width: node.width,
    height: node.height,
    parentId: node.parentId,
    selected: node.selected,
    draggable: node.draggable,
    selectable: node.selectable,
    data: {
      diagramNode: node,
      adapter: adapter as DiagrammerAdapter<TNodePayload, unknown> | undefined,
    },
  }))
}

export function toDiagrammerFlowEdges<TNodePayload, TEdgePayload>(
  document: DiagrammerDocument<TNodePayload, TEdgePayload>,
  adapter?: DiagrammerAdapter<TNodePayload, TEdgePayload>,
): DiagrammerFlowEdge<TEdgePayload>[] {
  return document.edges.map(edge => ({
    id: edge.id,
    type: edge.type || 'smoothstep',
    source: edge.source,
    target: edge.target,
    sourceHandle: edge.sourcePortId,
    targetHandle: edge.targetPortId,
    selected: edge.selected,
    animated: edge.animated,
    selectable: edge.selectable,
    label: edge.data?.label,
    data: {
      diagramEdge: edge,
      adapter: adapter as DiagrammerAdapter<unknown, TEdgePayload> | undefined,
    },
  }))
}

export function fromDiagrammerFlowNodes<TNodePayload, TEdgePayload>(
  document: DiagrammerDocument<TNodePayload, TEdgePayload>,
  nodes: DiagrammerFlowNode<TNodePayload>[],
): DiagrammerDocument<TNodePayload, TEdgePayload> {
  const currentById = new Map(document.nodes.map(node => [node.id, node]))
  const nextNodes = nodes.map(node => {
    const current = currentById.get(node.id) ?? node.data.diagramNode
    return {
      ...current,
      position: node.position,
      width: node.width ?? current.width,
      height: node.height ?? current.height,
      parentId: node.parentId ?? current.parentId,
      selected: node.selected,
      draggable: node.draggable ?? current.draggable,
      selectable: node.selectable ?? current.selectable,
    }
  })
  const survivingNodeIds = new Set(nextNodes.map(node => node.id))

  return {
    ...document,
    nodes: nextNodes,
    edges: document.edges.filter(edge => survivingNodeIds.has(edge.source) && survivingNodeIds.has(edge.target)),
  }
}

export function fromDiagrammerFlowEdges<TNodePayload, TEdgePayload>(
  document: DiagrammerDocument<TNodePayload, TEdgePayload>,
  edges: DiagrammerFlowEdge<TEdgePayload>[],
): DiagrammerDocument<TNodePayload, TEdgePayload> {
  const currentById = new Map(document.edges.map(edge => [edge.id, edge]))
  const nextEdges = edges.map(edge => {
    const current = currentById.get(edge.id) ?? edge.data?.diagramEdge
    const fallback: DiagrammerEdge<TEdgePayload> = {
      id: edge.id,
      type: edge.type,
      source: edge.source,
      target: edge.target,
      sourcePortId: edge.sourceHandle ?? undefined,
      targetPortId: edge.targetHandle ?? undefined,
      selected: edge.selected,
      animated: edge.animated,
      selectable: edge.selectable,
    }

    return {
      ...fallback,
      ...current,
      type: edge.type ?? current?.type,
      source: edge.source,
      target: edge.target,
      sourcePortId: edge.sourceHandle ?? undefined,
      targetPortId: edge.targetHandle ?? undefined,
      selected: edge.selected,
      animated: edge.animated,
      selectable: edge.selectable ?? current?.selectable,
    }
  })

  return { ...document, edges: nextEdges }
}

export function applyDiagrammerNodeChanges<TNodePayload, TEdgePayload>(
  document: DiagrammerDocument<TNodePayload, TEdgePayload>,
  changes: NodeChange<DiagrammerFlowNode<TNodePayload>>[],
  adapter?: DiagrammerAdapter<TNodePayload, TEdgePayload>,
): DiagrammerDocument<TNodePayload, TEdgePayload> {
  const flowNodes = toDiagrammerFlowNodes(document, adapter)
  return fromDiagrammerFlowNodes(document, applyNodeChanges(changes, flowNodes))
}

export function applyDiagrammerEdgeChanges<TNodePayload, TEdgePayload>(
  document: DiagrammerDocument<TNodePayload, TEdgePayload>,
  changes: EdgeChange<DiagrammerFlowEdge<TEdgePayload>>[],
  adapter?: DiagrammerAdapter<TNodePayload, TEdgePayload>,
): DiagrammerDocument<TNodePayload, TEdgePayload> {
  const flowEdges = toDiagrammerFlowEdges(document, adapter)
  return fromDiagrammerFlowEdges(document, applyEdgeChanges(changes, flowEdges))
}

export function connectDiagrammerNodes<TNodePayload, TEdgePayload>(
  document: DiagrammerDocument<TNodePayload, TEdgePayload>,
  connection: Connection,
  options: {
    id?: DiagrammerId
    type?: DiagrammerEdge<TEdgePayload>['type']
    data?: DiagrammerEdge<TEdgePayload>['data']
  } = {},
): DiagrammerDocument<TNodePayload, TEdgePayload> {
  if (!connection.source || !connection.target) return document

  const edge: DiagrammerEdge<TEdgePayload> = {
    id: options.id ?? createEdgeId(connection),
    type: options.type ?? 'smoothstep',
    source: connection.source,
    target: connection.target,
    sourcePortId: connection.sourceHandle ?? undefined,
    targetPortId: connection.targetHandle ?? undefined,
    data: options.data,
  }

  if (document.edges.some(existingEdge => existingEdge.id === edge.id)) return document

  return {
    ...document,
    edges: [...document.edges, edge],
  }
}

export function updateDiagrammerViewport<TNodePayload, TEdgePayload>(
  document: DiagrammerDocument<TNodePayload, TEdgePayload>,
  viewport: Viewport,
): DiagrammerDocument<TNodePayload, TEdgePayload> {
  return { ...document, viewport }
}
