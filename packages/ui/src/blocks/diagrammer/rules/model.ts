import type { DiagrammerDocument, DiagrammerEdge, DiagrammerNode, DiagrammerPort } from '../types'
import type {
  RulesDiagramAction,
  RulesDiagramConditionBranch,
  RulesDiagramDocument,
  RulesDiagramEdgePayload,
  RulesDiagramExpression,
  RulesDiagramId,
  RulesDiagramNode,
  RulesDiagramNodePayload,
  RulesDiagramResolvedTransition,
  RulesDiagramTransition,
  RulesDiagramValidationIssue,
  ValidateRulesDiagramDocumentOptions,
} from './types'

const RULE_NODE_PREFIX = 'rule-node:'
const RULE_TRANSITION_EDGE_PREFIX = 'rule-transition:'
const RULE_BRANCH_TRANSITION_PREFIX = 'rule-branch:'
const INPUT_PORT_ID = 'in'
const OUTPUT_PORT_ID = 'out'
const BRANCH_PORT_PREFIX = 'branch:'

export function getRulesDiagramNodeId(nodeId: RulesDiagramId) {
  return `${RULE_NODE_PREFIX}${nodeId}`
}

export function getRulesDiagramNodeModelId(diagramNodeId: RulesDiagramId) {
  return diagramNodeId.startsWith(RULE_NODE_PREFIX) ? diagramNodeId.slice(RULE_NODE_PREFIX.length) : diagramNodeId
}

export function getRulesInputPortId() {
  return INPUT_PORT_ID
}

export function getRulesOutputPortId() {
  return OUTPUT_PORT_ID
}

export function getRulesBranchPortId(branchId: RulesDiagramId) {
  return `${BRANCH_PORT_PREFIX}${branchId}`
}

export function getRulesTransitionEdgeId(transitionId: RulesDiagramId) {
  return `${RULE_TRANSITION_EDGE_PREFIX}${transitionId}`
}

function cloneExpression(expression: RulesDiagramExpression | undefined): RulesDiagramExpression | undefined {
  return expression
    ? { ...expression, metadata: expression.metadata ? { ...expression.metadata } : undefined }
    : undefined
}

function cloneAction(action: RulesDiagramAction | undefined): RulesDiagramAction | undefined {
  return action
    ? {
        ...action,
        expression: cloneExpression(action.expression),
        parameters: action.parameters ? { ...action.parameters } : undefined,
        metadata: action.metadata ? { ...action.metadata } : undefined,
      }
    : undefined
}

function cloneBranch(branch: RulesDiagramConditionBranch): RulesDiagramConditionBranch {
  return {
    ...branch,
    expression: cloneExpression(branch.expression),
    metadata: branch.metadata ? { ...branch.metadata } : undefined,
  }
}

function cloneNode(node: RulesDiagramNode): RulesDiagramNode {
  return {
    ...node,
    expression: cloneExpression(node.expression),
    action: cloneAction(node.action),
    branches: node.branches?.map(cloneBranch),
    metadata: node.metadata ? { ...node.metadata } : undefined,
  }
}

function cloneTransition(transition: RulesDiagramTransition): RulesDiagramTransition {
  return {
    ...transition,
    expression: cloneExpression(transition.expression),
    metadata: transition.metadata ? { ...transition.metadata } : undefined,
  }
}

export function createRulesDiagramDocument(document: Partial<RulesDiagramDocument> = {}): RulesDiagramDocument {
  const layoutNodes = document.layout?.nodes
  return {
    version: 1,
    ...document,
    nodes: document.nodes?.map(cloneNode) ?? [],
    transitions: document.transitions?.map(cloneTransition) ?? [],
    layout: document.layout
      ? {
          ...document.layout,
          nodes: layoutNodes
            ? Object.fromEntries(Object.entries(layoutNodes).map(([nodeId, position]) => [nodeId, { ...position }]))
            : undefined,
          viewport: document.layout.viewport ? { ...document.layout.viewport } : undefined,
        }
      : undefined,
  }
}

export function findRulesDiagramNode(document: RulesDiagramDocument, nodeId: RulesDiagramId) {
  return document.nodes.find(node => node.id === nodeId)
}

function createDefaultPosition(index: number) {
  const column = index % 4
  const row = Math.floor(index / 4)
  return {
    x: 80 + column * 300,
    y: 100 + row * 220,
  }
}

function getNodeIcon(node: RulesDiagramNode) {
  switch (node.kind) {
    case 'start':
      return 'play'
    case 'event':
      return 'radio'
    case 'condition':
      return 'git-branch'
    case 'action':
      return 'zap'
    case 'end':
      return 'circle-stop'
  }
}

function getNodeTone(node: RulesDiagramNode): NonNullable<DiagrammerNode['data']['tone']> {
  switch (node.kind) {
    case 'start':
    case 'event':
      return 'success'
    case 'condition':
      return 'warning'
    case 'action':
      return 'primary'
    case 'end':
      return 'neutral'
  }
}

function createNodeDescription(node: RulesDiagramNode) {
  if (node.description) return node.description
  if (node.action?.label) return node.action.label
  if (node.expression?.source) return node.expression.source
  return undefined
}

function createNodePorts(node: RulesDiagramNode): DiagrammerPort[] {
  switch (node.kind) {
    case 'start':
    case 'event':
      return [{ id: OUTPUT_PORT_ID, label: 'out', side: 'right', direction: 'output' }]
    case 'condition':
      return [
        { id: INPUT_PORT_ID, label: 'input', side: 'left', direction: 'input' },
        ...(node.branches && node.branches.length > 0
          ? node.branches.map(branch => ({
              id: getRulesBranchPortId(branch.id),
              label: branch.label,
              side: branch.isDefault ? ('bottom' as const) : ('right' as const),
              direction: 'output' as const,
              metadata: {
                branchId: branch.id,
                default: branch.isDefault,
              },
            }))
          : [{ id: OUTPUT_PORT_ID, label: 'out', side: 'right' as const, direction: 'output' as const }]),
      ]
    case 'action':
      return [
        { id: INPUT_PORT_ID, label: 'input', side: 'left', direction: 'input' },
        { id: OUTPUT_PORT_ID, label: 'next', side: 'right', direction: 'output' },
      ]
    case 'end':
      return [{ id: INPUT_PORT_ID, label: 'input', side: 'left', direction: 'input' }]
  }
}

function createRulesNode(node: RulesDiagramNode, index: number, document: RulesDiagramDocument) {
  const nodeId = getRulesDiagramNodeId(node.id)

  return {
    id: nodeId,
    type: 'rules-node',
    position: document.layout?.nodes?.[node.id] ?? document.layout?.nodes?.[nodeId] ?? createDefaultPosition(index),
    data: {
      label: node.label,
      description: createNodeDescription(node),
      icon: getNodeIcon(node),
      tone: getNodeTone(node),
      payload: {
        kind: 'rule-node',
        nodeId: node.id,
        node,
      },
      ports: createNodePorts(node),
      metadata: {
        nodeId: node.id,
        kind: node.kind,
      },
    },
  } satisfies DiagrammerNode<RulesDiagramNodePayload>
}

export function createRulesTransitionsFromBranches(document: RulesDiagramDocument): RulesDiagramResolvedTransition[] {
  const transitions: RulesDiagramResolvedTransition[] = []

  for (const node of document.nodes) {
    if (node.kind !== 'condition') continue
    for (const branch of node.branches ?? []) {
      if (!branch.targetNodeId) continue
      transitions.push({
        id: `${RULE_BRANCH_TRANSITION_PREFIX}${node.id}.${branch.id}->${branch.targetNodeId}`,
        sourceNodeId: node.id,
        targetNodeId: branch.targetNodeId,
        sourcePortId: getRulesBranchPortId(branch.id),
        targetPortId: INPUT_PORT_ID,
        label: branch.label,
        conditionBranchId: branch.id,
        expression: branch.expression,
        derivedFromBranch: true,
      })
    }
  }

  return transitions
}

export function getRulesDiagramTransitions(document: RulesDiagramDocument): RulesDiagramResolvedTransition[] {
  const transitionsById = new Map<RulesDiagramId, RulesDiagramResolvedTransition>()

  for (const transition of createRulesTransitionsFromBranches(document)) {
    transitionsById.set(transition.id, transition)
  }

  for (const transition of document.transitions ?? []) {
    transitionsById.set(transition.id, transition)
  }

  return [...transitionsById.values()]
}

function getSourcePortId(document: RulesDiagramDocument, transition: RulesDiagramResolvedTransition) {
  if (transition.sourcePortId) return transition.sourcePortId
  if (transition.conditionBranchId) return getRulesBranchPortId(transition.conditionBranchId)

  const sourceNode = findRulesDiagramNode(document, transition.sourceNodeId)
  if (sourceNode?.kind === 'condition' && sourceNode.branches?.[0]) {
    return getRulesBranchPortId(sourceNode.branches[0].id)
  }

  return OUTPUT_PORT_ID
}

function getTargetPortId(document: RulesDiagramDocument, transition: RulesDiagramResolvedTransition) {
  const targetPortId = transition.targetPortId ?? INPUT_PORT_ID
  const targetNode = findRulesDiagramNode(document, transition.targetNodeId)
  if (!targetNode) return targetPortId

  const targetPorts = createNodePorts(targetNode)
  return targetPorts.some(port => port.id === targetPortId) ? targetPortId : undefined
}

function createTransitionEdge(
  document: RulesDiagramDocument,
  transition: RulesDiagramResolvedTransition,
): DiagrammerEdge<RulesDiagramEdgePayload> {
  return {
    id: getRulesTransitionEdgeId(transition.id),
    type: 'smoothstep',
    source: getRulesDiagramNodeId(transition.sourceNodeId),
    target: getRulesDiagramNodeId(transition.targetNodeId),
    sourcePortId: getSourcePortId(document, transition),
    targetPortId: getTargetPortId(document, transition),
    data: {
      label: transition.label,
      payload: {
        kind: 'transition',
        transitionId: transition.id,
        transition,
      },
    },
  }
}

export function toRulesDiagrammerDocument(
  document: RulesDiagramDocument,
): DiagrammerDocument<RulesDiagramNodePayload, RulesDiagramEdgePayload> {
  return {
    version: 1,
    id: document.id,
    title: document.title,
    nodes: document.nodes.map((node, index) => createRulesNode(node, index, document)),
    edges: getRulesDiagramTransitions(document).map(transition => createTransitionEdge(document, transition)),
    viewport: document.layout?.viewport,
    metadata: {
      source: 'rules-diagram',
    },
  }
}

export function updateRulesDiagramLayoutFromDiagrammer(
  document: RulesDiagramDocument,
  diagramDocument: DiagrammerDocument<RulesDiagramNodePayload, RulesDiagramEdgePayload>,
): RulesDiagramDocument {
  const nextNodes = { ...(document.layout?.nodes ?? {}) }

  for (const node of diagramDocument.nodes) {
    nextNodes[getRulesDiagramNodeModelId(node.id)] = { ...node.position }
  }

  return {
    ...document,
    layout: {
      ...document.layout,
      nodes: nextNodes,
      viewport: diagramDocument.viewport ? { ...diagramDocument.viewport } : document.layout?.viewport,
    },
  }
}

function pushIssue(
  issues: RulesDiagramValidationIssue[],
  code: string,
  message: string,
  severity: RulesDiagramValidationIssue['severity'],
  owner: Pick<RulesDiagramValidationIssue, 'nodeId' | 'branchId' | 'transitionId'> = {},
) {
  issues.push({ code, message, severity, ...owner })
}

function createAdjacency(
  nodeIds: Set<RulesDiagramId>,
  transitions: RulesDiagramResolvedTransition[],
): Map<RulesDiagramId, Set<RulesDiagramId>> {
  const adjacency = new Map<RulesDiagramId, Set<RulesDiagramId>>()
  for (const nodeId of nodeIds) adjacency.set(nodeId, new Set())

  for (const transition of transitions) {
    if (!nodeIds.has(transition.sourceNodeId) || !nodeIds.has(transition.targetNodeId)) continue
    adjacency.get(transition.sourceNodeId)?.add(transition.targetNodeId)
  }

  return adjacency
}

function findCycleNode(adjacency: Map<RulesDiagramId, Set<RulesDiagramId>>) {
  const visiting = new Set<RulesDiagramId>()
  const visited = new Set<RulesDiagramId>()

  function visit(nodeId: RulesDiagramId): RulesDiagramId | null {
    if (visiting.has(nodeId)) return nodeId
    if (visited.has(nodeId)) return null

    visiting.add(nodeId)
    for (const nextNodeId of adjacency.get(nodeId) ?? []) {
      const cycleNodeId = visit(nextNodeId)
      if (cycleNodeId) return cycleNodeId
    }
    visiting.delete(nodeId)
    visited.add(nodeId)
    return null
  }

  for (const nodeId of adjacency.keys()) {
    const cycleNodeId = visit(nodeId)
    if (cycleNodeId) return cycleNodeId
  }

  return null
}

function collectReachableNodes(entryNodeIds: RulesDiagramId[], adjacency: Map<RulesDiagramId, Set<RulesDiagramId>>) {
  const reachable = new Set<RulesDiagramId>()
  const queue = [...entryNodeIds]

  while (queue.length > 0) {
    const nodeId = queue.shift()
    if (!nodeId || reachable.has(nodeId)) continue
    reachable.add(nodeId)

    for (const nextNodeId of adjacency.get(nodeId) ?? []) {
      if (!reachable.has(nextNodeId)) queue.push(nextNodeId)
    }
  }

  return reachable
}

export function validateRulesDiagramDocument(
  document: RulesDiagramDocument,
  options: ValidateRulesDiagramDocumentOptions = {},
): RulesDiagramValidationIssue[] {
  const issues: RulesDiagramValidationIssue[] = []
  const nodeIds = new Set<RulesDiagramId>()
  const explicitTransitionIds = new Set<RulesDiagramId>()

  for (const node of document.nodes) {
    if (nodeIds.has(node.id)) {
      pushIssue(issues, 'duplicate-node-id', `Duplicate rules node id: ${node.id}`, 'error', { nodeId: node.id })
    }
    nodeIds.add(node.id)

    const branchIds = new Set<RulesDiagramId>()
    let defaultBranchCount = 0

    if (node.kind === 'condition' && (!node.branches || node.branches.length === 0)) {
      pushIssue(issues, 'condition-without-branches', `Condition ${node.id} has no branches`, 'warning', {
        nodeId: node.id,
      })
    }

    for (const branch of node.branches ?? []) {
      if (branchIds.has(branch.id)) {
        pushIssue(issues, 'duplicate-branch-id', `Duplicate branch id ${branch.id} in condition ${node.id}`, 'error', {
          nodeId: node.id,
          branchId: branch.id,
        })
      }
      branchIds.add(branch.id)
      if (branch.isDefault) defaultBranchCount += 1

      if (!branch.targetNodeId) {
        pushIssue(issues, 'missing-branch-target', `Branch ${branch.id} has no target node`, 'error', {
          nodeId: node.id,
          branchId: branch.id,
        })
      } else if (
        !nodeIds.has(branch.targetNodeId) &&
        !document.nodes.some(candidate => candidate.id === branch.targetNodeId)
      ) {
        pushIssue(
          issues,
          'missing-branch-target-node',
          `Branch ${branch.id} references missing target node ${branch.targetNodeId}`,
          'error',
          { nodeId: node.id, branchId: branch.id },
        )
      }
    }

    if (defaultBranchCount > 1) {
      pushIssue(issues, 'multiple-default-branches', `Condition ${node.id} has multiple default branches`, 'error', {
        nodeId: node.id,
      })
    }
  }

  for (const transition of document.transitions ?? []) {
    if (explicitTransitionIds.has(transition.id)) {
      pushIssue(issues, 'duplicate-transition-id', `Duplicate transition id: ${transition.id}`, 'error', {
        transitionId: transition.id,
      })
    }
    explicitTransitionIds.add(transition.id)
  }

  const transitions = getRulesDiagramTransitions(document)

  for (const transition of transitions) {
    const sourceNode = findRulesDiagramNode(document, transition.sourceNodeId)
    const targetNode = findRulesDiagramNode(document, transition.targetNodeId)

    if (!sourceNode) {
      pushIssue(
        issues,
        'missing-transition-source-node',
        `Transition ${transition.id} references missing source node ${transition.sourceNodeId}`,
        'error',
        { transitionId: transition.id, nodeId: transition.sourceNodeId },
      )
    }

    if (!targetNode) {
      pushIssue(
        issues,
        'missing-transition-target-node',
        `Transition ${transition.id} references missing target node ${transition.targetNodeId}`,
        'error',
        { transitionId: transition.id, nodeId: transition.targetNodeId },
      )
    }

    if (transition.conditionBranchId && sourceNode) {
      const matchingBranch = sourceNode.branches?.some(branch => branch.id === transition.conditionBranchId)
      if (!matchingBranch) {
        pushIssue(
          issues,
          'missing-transition-branch',
          `Transition ${transition.id} references missing branch ${transition.conditionBranchId}`,
          'error',
          {
            transitionId: transition.id,
            nodeId: sourceNode.id,
            branchId: transition.conditionBranchId,
          },
        )
      }
    }
  }

  const entryNodeIds = document.nodes
    .filter(node => node.kind === 'start' || node.kind === 'event')
    .map(node => node.id)
  if (entryNodeIds.length === 0 && document.nodes.length > 0) {
    pushIssue(issues, 'missing-entry-node', 'Rules diagram has no start or event node', 'warning')
  }

  const adjacency = createAdjacency(nodeIds, transitions)

  if (entryNodeIds.length > 0) {
    const reachable = collectReachableNodes(entryNodeIds, adjacency)
    for (const node of document.nodes) {
      if (!reachable.has(node.id)) {
        pushIssue(issues, 'unreachable-node', `Node ${node.id} is unreachable from a start or event node`, 'warning', {
          nodeId: node.id,
        })
      }
    }
  }

  if (!options.allowCycles) {
    const cycleNodeId = findCycleNode(adjacency)
    if (cycleNodeId) {
      pushIssue(issues, 'cycle-detected', `Rules diagram contains a cycle at node ${cycleNodeId}`, 'error', {
        nodeId: cycleNodeId,
      })
    }
  }

  return issues
}
