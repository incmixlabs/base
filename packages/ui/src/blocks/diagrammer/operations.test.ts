import { describe, expect, it } from 'vitest'
import {
  addDiagrammerEdge,
  addDiagrammerNode,
  createDiagrammerDocument,
  deleteDiagrammerNode,
  moveDiagrammerNode,
  updateDiagrammerEdge,
  updateDiagrammerNode,
  validateDiagrammerDocument,
} from './operations'
import type { DiagrammerDocument } from './types'

function createDocument(): DiagrammerDocument {
  return {
    version: 1,
    nodes: [
      { id: 'a', position: { x: 0, y: 0 }, data: { label: 'A' } },
      { id: 'b', position: { x: 100, y: 0 }, data: { label: 'B' } },
    ],
    edges: [
      { id: 'a-b', source: 'a', target: 'b' },
      { id: 'b-a', source: 'b', target: 'a' },
    ],
  }
}

describe('diagrammer operations', () => {
  it('adds and moves nodes immutably', () => {
    const document = createDiagrammerDocument()
    const withNode = addDiagrammerNode(document, {
      id: 'a',
      position: { x: 0, y: 0 },
      data: { label: 'A' },
    })
    const moved = moveDiagrammerNode(withNode, 'a', { x: 120, y: 80 })

    expect(document.nodes).toEqual([])
    expect(withNode.nodes[0].position).toEqual({ x: 0, y: 0 })
    expect(moved.nodes[0].position).toEqual({ x: 120, y: 80 })
  })

  it('deletes connected edges when deleting a node', () => {
    const document = addDiagrammerEdge(
      addDiagrammerNode(
        addDiagrammerNode(createDiagrammerDocument(), {
          id: 'a',
          position: { x: 0, y: 0 },
          data: { label: 'A' },
        }),
        {
          id: 'b',
          position: { x: 100, y: 0 },
          data: { label: 'B' },
        },
      ),
      { id: 'a-b', source: 'a', target: 'b' },
    )

    const result = deleteDiagrammerNode(document, 'a')

    expect(result.nodes.map(node => node.id)).toEqual(['b'])
    expect(result.edges).toEqual([])
  })

  it('validates duplicate ids and missing edge endpoints', () => {
    const issues = validateDiagrammerDocument({
      version: 1,
      nodes: [
        { id: 'a', position: { x: 0, y: 0 }, data: { label: 'A' } },
        { id: 'a', position: { x: 20, y: 20 }, data: { label: 'Duplicate A' } },
      ],
      edges: [{ id: 'bad', source: 'a', target: 'missing' }],
    })

    expect(issues.map(issue => issue.code)).toEqual(['duplicate-node-id', 'missing-edge-target'])
  })

  it('does not allow node ids to be mutated through update paths', () => {
    const result = updateDiagrammerNode(createDocument(), 'a', node => ({
      ...node,
      id: 'b',
      data: { ...node.data, label: 'Renamed' },
    }))

    expect(result.nodes.map(node => node.id)).toEqual(['a', 'b'])
    expect(result.nodes.find(node => node.id === 'a')?.data.label).toBe('Renamed')
    expect(validateDiagrammerDocument(result).map(issue => issue.code)).not.toContain('duplicate-node-id')
    expect(() =>
      addDiagrammerNode(result, {
        id: 'b',
        position: { x: 200, y: 0 },
        data: { label: 'Duplicate B' },
      }),
    ).toThrow('Diagram node already exists: b')
  })

  it('does not allow edge ids to be mutated through update paths', () => {
    const result = updateDiagrammerEdge(createDocument(), 'a-b', edge => ({
      ...edge,
      id: 'b-a',
      data: { label: 'renamed' },
    }))

    expect(result.edges.map(edge => edge.id)).toEqual(['a-b', 'b-a'])
    expect(result.edges.find(edge => edge.id === 'a-b')?.data?.label).toBe('renamed')
    expect(validateDiagrammerDocument(result).map(issue => issue.code)).not.toContain('duplicate-edge-id')
    expect(() => addDiagrammerEdge(result, { id: 'b-a', source: 'b', target: 'a' })).toThrow(
      'Diagram edge already exists: b-a',
    )
  })
})
