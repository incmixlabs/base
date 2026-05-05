import { describe, expect, it } from 'vitest'
import { applyDiagrammerNodeChanges, connectDiagrammerNodes, toDiagrammerFlowNodes } from './react-flow-model'
import type { DiagrammerDocument } from './types'

function createDocument(): DiagrammerDocument {
  return {
    version: 1,
    nodes: [
      { id: 'a', position: { x: 0, y: 0 }, data: { label: 'A' } },
      { id: 'b', position: { x: 100, y: 0 }, data: { label: 'B' } },
    ],
    edges: [{ id: 'a-b', source: 'a', target: 'b' }],
  }
}

describe('diagrammer React Flow model adapters', () => {
  it('maps document nodes to diagrammer flow nodes', () => {
    const nodes = toDiagrammerFlowNodes(createDocument())

    expect(nodes[0]).toMatchObject({
      id: 'a',
      type: 'diagrammer',
      position: { x: 0, y: 0 },
      data: { diagramNode: { id: 'a' } },
    })
  })

  it('applies React Flow position changes back to the document', () => {
    const result = applyDiagrammerNodeChanges(createDocument(), [
      {
        id: 'a',
        type: 'position',
        position: { x: 40, y: 70 },
      },
    ])

    expect(result.nodes.find(node => node.id === 'a')?.position).toEqual({ x: 40, y: 70 })
  })

  it('connects nodes with a stable generated edge id', () => {
    const result = connectDiagrammerNodes(
      { ...createDocument(), edges: [] },
      {
        source: 'a',
        target: 'b',
        sourceHandle: 'out',
        targetHandle: 'in',
      },
    )

    expect(result.edges).toEqual([
      {
        id: 'a:out->b:in',
        type: 'smoothstep',
        source: 'a',
        target: 'b',
        sourcePortId: 'out',
        targetPortId: 'in',
        data: undefined,
      },
    ])
  })

  it('removes connected edges when React Flow removes a node', () => {
    const result = applyDiagrammerNodeChanges(createDocument(), [{ id: 'a', type: 'remove' }])

    expect(result.nodes.map(node => node.id)).toEqual(['b'])
    expect(result.edges).toEqual([])
  })
})
