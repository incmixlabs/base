import type {
  DiagrammerDocument,
  DiagrammerEdge,
  DiagrammerId,
  DiagrammerNode,
  DiagrammerValidationIssue,
} from './types'

export function createDiagrammerDocument<TNodePayload = unknown, TEdgePayload = unknown>(
  document: Partial<DiagrammerDocument<TNodePayload, TEdgePayload>> = {},
): DiagrammerDocument<TNodePayload, TEdgePayload> {
  return {
    version: 1,
    ...document,
    nodes: [...(document.nodes ?? [])],
    edges: [...(document.edges ?? [])],
  }
}

export function addDiagrammerNode<TNodePayload, TEdgePayload>(
  document: DiagrammerDocument<TNodePayload, TEdgePayload>,
  node: DiagrammerNode<TNodePayload>,
): DiagrammerDocument<TNodePayload, TEdgePayload> {
  if (document.nodes.some(existingNode => existingNode.id === node.id)) {
    throw new Error(`Diagram node already exists: ${node.id}`)
  }

  return {
    ...document,
    nodes: [...document.nodes, node],
  }
}

export function updateDiagrammerNode<TNodePayload, TEdgePayload>(
  document: DiagrammerDocument<TNodePayload, TEdgePayload>,
  nodeId: DiagrammerId,
  updater:
    | Partial<DiagrammerNode<TNodePayload>>
    | ((node: DiagrammerNode<TNodePayload>) => DiagrammerNode<TNodePayload>),
): DiagrammerDocument<TNodePayload, TEdgePayload> {
  let didUpdate = false
  const nodes = document.nodes.map(node => {
    if (node.id !== nodeId) return node
    didUpdate = true
    const updated = typeof updater === 'function' ? updater(node) : { ...node, ...updater }
    return { ...updated, id: node.id }
  })

  if (!didUpdate) return document
  return { ...document, nodes }
}

export function moveDiagrammerNode<TNodePayload, TEdgePayload>(
  document: DiagrammerDocument<TNodePayload, TEdgePayload>,
  nodeId: DiagrammerId,
  position: DiagrammerNode<TNodePayload>['position'],
): DiagrammerDocument<TNodePayload, TEdgePayload> {
  return updateDiagrammerNode(document, nodeId, node => ({ ...node, position }))
}

export function deleteDiagrammerNode<TNodePayload, TEdgePayload>(
  document: DiagrammerDocument<TNodePayload, TEdgePayload>,
  nodeId: DiagrammerId,
): DiagrammerDocument<TNodePayload, TEdgePayload> {
  const nodes = document.nodes.filter(node => node.id !== nodeId)
  const edges = document.edges.filter(edge => edge.source !== nodeId && edge.target !== nodeId)

  if (nodes.length === document.nodes.length && edges.length === document.edges.length) return document
  return { ...document, nodes, edges }
}

export function addDiagrammerEdge<TNodePayload, TEdgePayload>(
  document: DiagrammerDocument<TNodePayload, TEdgePayload>,
  edge: DiagrammerEdge<TEdgePayload>,
): DiagrammerDocument<TNodePayload, TEdgePayload> {
  if (document.edges.some(existingEdge => existingEdge.id === edge.id)) {
    throw new Error(`Diagram edge already exists: ${edge.id}`)
  }

  return {
    ...document,
    edges: [...document.edges, edge],
  }
}

export function updateDiagrammerEdge<TNodePayload, TEdgePayload>(
  document: DiagrammerDocument<TNodePayload, TEdgePayload>,
  edgeId: DiagrammerId,
  updater:
    | Partial<DiagrammerEdge<TEdgePayload>>
    | ((edge: DiagrammerEdge<TEdgePayload>) => DiagrammerEdge<TEdgePayload>),
): DiagrammerDocument<TNodePayload, TEdgePayload> {
  let didUpdate = false
  const edges = document.edges.map(edge => {
    if (edge.id !== edgeId) return edge
    didUpdate = true
    const updated = typeof updater === 'function' ? updater(edge) : { ...edge, ...updater }
    return { ...updated, id: edge.id }
  })

  if (!didUpdate) return document
  return { ...document, edges }
}

export function deleteDiagrammerEdge<TNodePayload, TEdgePayload>(
  document: DiagrammerDocument<TNodePayload, TEdgePayload>,
  edgeId: DiagrammerId,
): DiagrammerDocument<TNodePayload, TEdgePayload> {
  const edges = document.edges.filter(edge => edge.id !== edgeId)

  if (edges.length === document.edges.length) return document
  return { ...document, edges }
}

export function validateDiagrammerDocument<TNodePayload, TEdgePayload>(
  document: DiagrammerDocument<TNodePayload, TEdgePayload>,
): DiagrammerValidationIssue[] {
  const issues: DiagrammerValidationIssue[] = []
  const nodeIds = new Set<DiagrammerId>()
  const edgeIds = new Set<DiagrammerId>()

  for (const node of document.nodes) {
    if (nodeIds.has(node.id)) {
      issues.push({
        code: 'duplicate-node-id',
        message: `Duplicate node id: ${node.id}`,
        severity: 'error',
        nodeId: node.id,
      })
    }
    nodeIds.add(node.id)
  }

  for (const edge of document.edges) {
    if (edgeIds.has(edge.id)) {
      issues.push({
        code: 'duplicate-edge-id',
        message: `Duplicate edge id: ${edge.id}`,
        severity: 'error',
        edgeId: edge.id,
      })
    }
    edgeIds.add(edge.id)

    if (!nodeIds.has(edge.source)) {
      issues.push({
        code: 'missing-edge-source',
        message: `Edge ${edge.id} references missing source node ${edge.source}`,
        severity: 'error',
        edgeId: edge.id,
      })
    }

    if (!nodeIds.has(edge.target)) {
      issues.push({
        code: 'missing-edge-target',
        message: `Edge ${edge.id} references missing target node ${edge.target}`,
        severity: 'error',
        edgeId: edge.id,
      })
    }
  }

  return issues
}
