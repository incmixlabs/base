import { describe, expect, it } from 'vitest'
import {
  createDbRelationshipsFromColumnReferences,
  createDbDiagramDocument,
  toDbDiagrammerDocument,
  updateDbDiagramLayoutFromDiagrammer,
  validateDbDiagramDocument,
} from './model'
import { sampleDbSchemaDiagramDocument } from './sample-data'
import type { DbDiagramDocument } from './types'

describe('db diagram model', () => {
  it('defensively copies top-level and nested schema arrays', () => {
    const input: DbDiagramDocument = {
      version: 1,
      domains: [
        {
          id: 'email',
          name: 'email_address',
          type: 'text',
          checks: [{ id: 'format', expression: "VALUE LIKE '%@%'" }],
        },
      ],
      tables: [
        {
          id: 'users',
          name: 'users',
          columns: [{ id: 'id', name: 'id', type: 'uuid' }],
        },
      ],
      views: [{ id: 'active-users', name: 'active_users', definition: 'SELECT id FROM users' }],
      sequences: [{ id: 'user-number', name: 'user_number_seq', ownedBy: { tableId: 'users', columnId: 'id' } }],
      functions: [{ id: 'touch', name: 'touch_updated_at', returns: 'trigger', arguments: [], body: 'SELECT 1;' }],
      triggers: [{ id: 'users-touch', tableId: 'users', name: 'users_touch', timing: 'before', events: ['update'] }],
      policies: [{ id: 'users-policy', tableId: 'users', name: 'users_policy', roles: ['app_user'] }],
      layout: { nodes: { 'db-table:users': { x: 10, y: 20 } } },
    }

    const result = createDbDiagramDocument(input)

    expect(result.domains).not.toBe(input.domains)
    expect(result.domains?.[0].checks).not.toBe(input.domains?.[0].checks)
    expect(result.tables).not.toBe(input.tables)
    expect(result.tables[0].columns).not.toBe(input.tables[0].columns)
    expect(result.views).not.toBe(input.views)
    expect(result.sequences?.[0].ownedBy).not.toBe(input.sequences?.[0].ownedBy)
    expect(result.functions?.[0].arguments).not.toBe(input.functions?.[0].arguments)
    expect(result.triggers?.[0].events).not.toBe(input.triggers?.[0].events)
    expect(result.policies?.[0].roles).not.toBe(input.policies?.[0].roles)
    expect(result.layout?.nodes?.['db-table:users']).not.toBe(input.layout?.nodes?.['db-table:users'])
  })

  it('maps tables, columns, and relationships into a diagrammer document', () => {
    const result = toDbDiagrammerDocument(sampleDbSchemaDiagramDocument)

    expect(result.nodes.map(node => node.id)).toContain('db-table:users')
    expect(result.nodes.map(node => node.id)).toEqual(
      expect.arrayContaining([
        'db-view:order-summary',
        'db-domain:email-address',
        'db-sequence:order-number-seq',
        'db-function:touch-updated-at',
      ]),
    )
    expect(result.nodes.find(node => node.id === 'db-table:orders')?.data.ports?.map(port => port.id)).toContain(
      'column:user_id',
    )
    expect(result.nodes.find(node => node.id === 'db-view:order-summary')?.data.ports?.map(port => port.id)).toContain(
      'view-column:customer_email',
    )
    expect(result.edges).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'db-relationship:orders-user',
          source: 'db-table:orders',
          sourcePortId: 'column:user_id',
          target: 'db-table:users',
          targetPortId: 'column:id',
        }),
      ]),
    )
  })

  it('syncs diagram positions and viewport back into the db layout', () => {
    const diagramDocument = toDbDiagrammerDocument(sampleDbSchemaDiagramDocument)
    const result = updateDbDiagramLayoutFromDiagrammer(sampleDbSchemaDiagramDocument, {
      ...diagramDocument,
      viewport: { x: 10, y: 20, zoom: 0.8 },
      nodes: diagramDocument.nodes.map(node =>
        node.id === 'db-table:users' ? { ...node, position: { x: 240, y: 320 } } : node,
      ),
    })

    expect(result.layout?.nodes?.['db-table:users']).toEqual({ x: 240, y: 320 })
    expect(result.layout?.viewport).toEqual({ x: 10, y: 20, zoom: 0.8 })
  })

  it('validates missing relationship endpoints', () => {
    const issues = validateDbDiagramDocument({
      version: 1,
      tables: [{ id: 'orders', name: 'orders', columns: [{ id: 'id', name: 'id', type: 'uuid' }] }],
      relationships: [
        {
          id: 'bad',
          sourceTableId: 'orders',
          sourceColumnIds: ['missing'],
          targetTableId: 'users',
          targetColumnIds: ['id'],
        },
      ],
    })

    expect(issues.map(issue => issue.code)).toEqual(
      expect.arrayContaining(['missing-relationship-target-table', 'missing-relationship-source-column']),
    )
    expect(issues).toHaveLength(2)
  })

  it('validates duplicate schema ids', () => {
    const issues = validateDbDiagramDocument({
      version: 1,
      schemas: [
        { id: 'public', name: 'public' },
        { id: 'public', name: 'other_public' },
      ],
      tables: [],
    })

    expect(issues.map(issue => issue.code)).toEqual(['duplicate-schema-id'])
  })

  it('validates duplicate explicit relationship ids', () => {
    const issues = validateDbDiagramDocument({
      version: 1,
      tables: [
        { id: 'users', name: 'users', columns: [{ id: 'id', name: 'id', type: 'uuid' }] },
        { id: 'orders', name: 'orders', columns: [{ id: 'user_id', name: 'user_id', type: 'uuid' }] },
      ],
      relationships: [
        {
          id: 'duplicate',
          sourceTableId: 'orders',
          sourceColumnIds: ['user_id'],
          targetTableId: 'users',
          targetColumnIds: ['id'],
        },
        {
          id: 'duplicate',
          sourceTableId: 'orders',
          sourceColumnIds: ['user_id'],
          targetTableId: 'users',
          targetColumnIds: ['id'],
        },
      ],
    })

    expect(issues.map(issue => issue.code)).toEqual(['duplicate-relationship-id'])
  })

  it('validates secondary schema object references', () => {
    const issues = validateDbDiagramDocument({
      version: 1,
      tables: [{ id: 'users', name: 'users', columns: [{ id: 'id', name: 'id', type: 'uuid' }] }],
      views: [
        {
          id: 'active-users',
          name: 'active_users',
          definition: 'SELECT id FROM users',
          columns: [
            { id: 'id', name: 'id' },
            { id: 'id', name: 'duplicate_id' },
          ],
        },
      ],
      sequences: [{ id: 'bad-sequence', name: 'bad_sequence', ownedBy: { tableId: 'users', columnId: 'missing' } }],
      triggers: [
        {
          id: 'bad-trigger',
          tableId: 'missing-table',
          name: 'bad_trigger',
          timing: 'before',
          events: [],
          functionId: 'missing-function',
        },
      ],
      policies: [{ id: 'bad-policy', tableId: 'missing-table', name: 'bad_policy' }],
    })

    expect(issues.map(issue => issue.code)).toEqual(
      expect.arrayContaining([
        'duplicate-view-column-id',
        'missing-sequence-owner-column',
        'trigger-without-events',
        'missing-trigger-table',
        'missing-trigger-function',
        'missing-policy-table',
      ]),
    )
  })

  it('uses structural ids for derived relationships when FK names repeat', () => {
    const relationships = createDbRelationshipsFromColumnReferences({
      version: 1,
      tables: [
        {
          id: 'orders',
          name: 'orders',
          columns: [
            {
              id: 'buyer_id',
              name: 'buyer_id',
              type: 'uuid',
              references: { tableId: 'users', columnId: 'id', name: 'user_fkey' },
            },
            {
              id: 'seller_id',
              name: 'seller_id',
              type: 'uuid',
              references: { tableId: 'users', columnId: 'id', name: 'user_fkey' },
            },
          ],
        },
        { id: 'users', name: 'users', columns: [{ id: 'id', name: 'id', type: 'uuid' }] },
      ],
    })

    expect(relationships.map(relationship => relationship.id)).toEqual([
      'ref:orders.buyer_id->users.id',
      'ref:orders.seller_id->users.id',
    ])
    expect(relationships.map(relationship => relationship.name)).toEqual(['user_fkey', 'user_fkey'])
  })
})
