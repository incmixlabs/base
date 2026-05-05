import { describe, expect, it } from 'vitest'
import {
  createRulesDiagramDocument,
  createRulesTransitionsFromBranches,
  toRulesDiagrammerDocument,
  updateRulesDiagramLayoutFromDiagrammer,
  validateRulesDiagramDocument,
} from './model'
import { sampleRulesDiagramModelDocument } from './sample-data'
import type { RulesDiagramDocument } from './types'

describe('rules diagram model', () => {
  it('defensively copies nodes, branches, transitions, and layout', () => {
    const input: RulesDiagramDocument = {
      version: 1,
      nodes: [
        {
          id: 'condition',
          kind: 'condition',
          label: 'Condition',
          branches: [{ id: 'yes', label: 'yes', targetNodeId: 'action' }],
        },
      ],
      transitions: [{ id: 'start-condition', sourceNodeId: 'start', targetNodeId: 'condition' }],
      layout: { nodes: { condition: { x: 10, y: 20 } } },
    }

    const result = createRulesDiagramDocument(input)

    expect(result.nodes).not.toBe(input.nodes)
    expect(result.nodes[0].branches).not.toBe(input.nodes[0].branches)
    expect(result.transitions).not.toBe(input.transitions)
    expect(result.layout?.nodes).not.toBe(input.layout?.nodes)
    expect(result.layout?.nodes?.condition).not.toBe(input.layout?.nodes?.condition)
  })

  it('maps rules nodes, branches, and transitions into a diagrammer document', () => {
    const result = toRulesDiagrammerDocument(sampleRulesDiagramModelDocument)

    expect(result.nodes.map(node => node.id)).toContain('rule-node:vip-check')
    expect(result.nodes.find(node => node.id === 'rule-node:vip-check')?.data.ports?.map(port => port.id)).toEqual(
      expect.arrayContaining(['in', 'branch:yes', 'branch:no']),
    )
    expect(result.edges).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'rule-transition:order-vip-check',
          source: 'rule-node:order-received',
          target: 'rule-node:vip-check',
        }),
        expect.objectContaining({
          id: 'rule-transition:rule-branch:vip-check.yes->cart-total-check',
          source: 'rule-node:vip-check',
          sourcePortId: 'branch:yes',
          target: 'rule-node:cart-total-check',
          targetPortId: 'in',
        }),
      ]),
    )
  })

  it('syncs diagram positions and viewport back into the rules layout', () => {
    const diagramDocument = toRulesDiagrammerDocument(sampleRulesDiagramModelDocument)
    const result = updateRulesDiagramLayoutFromDiagrammer(sampleRulesDiagramModelDocument, {
      ...diagramDocument,
      viewport: { x: 40, y: 50, zoom: 0.9 },
      nodes: diagramDocument.nodes.map(node =>
        node.id === 'rule-node:vip-check' ? { ...node, position: { x: 500, y: 340 } } : node,
      ),
    })

    expect(result.layout?.nodes?.['vip-check']).toEqual({ x: 500, y: 340 })
    expect(result.layout?.viewport).toEqual({ x: 40, y: 50, zoom: 0.9 })
  })

  it('supports legacy prefixed layout keys on read', () => {
    const result = toRulesDiagrammerDocument({
      version: 1,
      nodes: [{ id: 'start', kind: 'start', label: 'Start' }],
      layout: { nodes: { 'rule-node:start': { x: 120, y: 140 } } },
    })

    expect(result.nodes[0].position).toEqual({ x: 120, y: 140 })
  })

  it('derives branch transitions from condition targets', () => {
    const transitions = createRulesTransitionsFromBranches(sampleRulesDiagramModelDocument)

    expect(transitions.map(transition => transition.id)).toEqual(
      expect.arrayContaining([
        'rule-branch:vip-check.yes->cart-total-check',
        'rule-branch:vip-check.no->standard-pricing',
      ]),
    )
  })

  it('does not assign dangling input handles when a transition targets an event node', () => {
    const result = toRulesDiagrammerDocument({
      version: 1,
      nodes: [
        { id: 'start', kind: 'start', label: 'Start' },
        { id: 'event', kind: 'event', label: 'Event' },
      ],
      transitions: [{ id: 'start-event', sourceNodeId: 'start', targetNodeId: 'event' }],
    })

    expect(result.edges[0].targetPortId).toBeUndefined()
  })

  it('validates missing branch targets and unreachable nodes', () => {
    const issues = validateRulesDiagramDocument({
      version: 1,
      nodes: [
        { id: 'start', kind: 'start', label: 'Start' },
        {
          id: 'condition',
          kind: 'condition',
          label: 'Condition',
          branches: [{ id: 'yes', label: 'yes' }],
        },
        { id: 'orphan', kind: 'action', label: 'Orphan' },
      ],
      transitions: [{ id: 'start-condition', sourceNodeId: 'start', targetNodeId: 'condition' }],
    })

    expect(issues.map(issue => issue.code)).toEqual(
      expect.arrayContaining(['missing-branch-target', 'unreachable-node']),
    )
  })

  it('validates duplicate branch and transition ids', () => {
    const issues = validateRulesDiagramDocument({
      version: 1,
      nodes: [
        { id: 'start', kind: 'start', label: 'Start' },
        {
          id: 'condition',
          kind: 'condition',
          label: 'Condition',
          branches: [
            { id: 'yes', label: 'yes', targetNodeId: 'start' },
            { id: 'yes', label: 'yes again', targetNodeId: 'start' },
          ],
        },
      ],
      transitions: [
        { id: 'duplicate', sourceNodeId: 'start', targetNodeId: 'condition' },
        { id: 'duplicate', sourceNodeId: 'condition', targetNodeId: 'start' },
      ],
    })

    expect(issues.map(issue => issue.code)).toEqual(
      expect.arrayContaining(['duplicate-branch-id', 'duplicate-transition-id']),
    )
  })

  it('detects cycles unless explicitly allowed', () => {
    const document: RulesDiagramDocument = {
      version: 1,
      nodes: [
        { id: 'start', kind: 'start', label: 'Start' },
        { id: 'action', kind: 'action', label: 'Action' },
      ],
      transitions: [
        { id: 'start-action', sourceNodeId: 'start', targetNodeId: 'action' },
        { id: 'action-start', sourceNodeId: 'action', targetNodeId: 'start' },
      ],
    }

    expect(validateRulesDiagramDocument(document).map(issue => issue.code)).toContain('cycle-detected')
    expect(validateRulesDiagramDocument(document, { allowCycles: true }).map(issue => issue.code)).not.toContain(
      'cycle-detected',
    )
  })
})
