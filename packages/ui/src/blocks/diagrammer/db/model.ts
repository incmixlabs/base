import type { DiagrammerDocument, DiagrammerEdge, DiagrammerNode, DiagrammerPort } from '../types'
import type {
  DbDiagramColumn,
  DbDiagramDocument,
  DbDiagramDomain,
  DbDiagramEdgePayload,
  DbDiagramEnum,
  DbDiagramFunction,
  DbDiagramId,
  DbDiagramNodePayload,
  DbDiagramRelationship,
  DbDiagramSequence,
  DbDiagramTable,
  DbDiagramType,
  DbDiagramTypeField,
  DbDiagramValidationIssue,
  DbDiagramView,
} from './types'

const TABLE_NODE_PREFIX = 'db-table:'
const ENUM_NODE_PREFIX = 'db-enum:'
const DOMAIN_NODE_PREFIX = 'db-domain:'
const VIEW_NODE_PREFIX = 'db-view:'
const SEQUENCE_NODE_PREFIX = 'db-sequence:'
const FUNCTION_NODE_PREFIX = 'db-function:'
const COLUMN_PORT_PREFIX = 'column:'
const VIEW_COLUMN_PORT_PREFIX = 'view-column:'
const RELATIONSHIP_EDGE_PREFIX = 'db-relationship:'

export function getDbTableNodeId(tableId: DbDiagramId) {
  return `${TABLE_NODE_PREFIX}${tableId}`
}

export function getDbEnumNodeId(enumId: DbDiagramId) {
  return `${ENUM_NODE_PREFIX}${enumId}`
}

export function getDbDomainNodeId(domainId: DbDiagramId) {
  return `${DOMAIN_NODE_PREFIX}${domainId}`
}

export function getDbViewNodeId(viewId: DbDiagramId) {
  return `${VIEW_NODE_PREFIX}${viewId}`
}

export function getDbSequenceNodeId(sequenceId: DbDiagramId) {
  return `${SEQUENCE_NODE_PREFIX}${sequenceId}`
}

export function getDbFunctionNodeId(functionId: DbDiagramId) {
  return `${FUNCTION_NODE_PREFIX}${functionId}`
}

export function getDbColumnPortId(columnId: DbDiagramId) {
  return `${COLUMN_PORT_PREFIX}${columnId}`
}

export function getDbViewColumnPortId(columnId: DbDiagramId) {
  return `${VIEW_COLUMN_PORT_PREFIX}${columnId}`
}

export function getDbRelationshipEdgeId(relationshipId: DbDiagramId) {
  return `${RELATIONSHIP_EDGE_PREFIX}${relationshipId}`
}

function cloneColumn(column: DbDiagramColumn): DbDiagramColumn {
  return {
    ...column,
    references: column.references ? { ...column.references } : undefined,
  }
}

function cloneTypeField(field: DbDiagramTypeField): DbDiagramTypeField {
  return { ...field }
}

function cloneType(type: DbDiagramType): DbDiagramType {
  return {
    ...type,
    values: type.values ? [...type.values] : undefined,
    fields: type.fields?.map(cloneTypeField),
  }
}

function cloneTable(table: DbDiagramTable): DbDiagramTable {
  return {
    ...table,
    columns: table.columns.map(cloneColumn),
    indexes: table.indexes?.map(index => ({ ...index, columnIds: [...index.columnIds] })),
    checks: table.checks?.map(check => ({ ...check })),
    uniqueConstraints: table.uniqueConstraints?.map(constraint => ({
      ...constraint,
      columnIds: [...constraint.columnIds],
    })),
  }
}

function cloneDomain(domain: DbDiagramDomain): DbDiagramDomain {
  return {
    ...domain,
    checks: domain.checks?.map(check => ({ ...check })),
  }
}

function cloneView(view: DbDiagramView): DbDiagramView {
  return {
    ...view,
    columns: view.columns?.map(column => ({ ...column })),
  }
}

function cloneSequence(sequence: DbDiagramSequence): DbDiagramSequence {
  return {
    ...sequence,
    ownedBy: sequence.ownedBy ? { ...sequence.ownedBy } : undefined,
  }
}

function cloneFunction(dbFunction: DbDiagramFunction): DbDiagramFunction {
  return {
    ...dbFunction,
    arguments: dbFunction.arguments?.map(argument => ({ ...argument })),
  }
}

function cloneRelationship(relationship: DbDiagramRelationship): DbDiagramRelationship {
  return {
    ...relationship,
    sourceColumnIds: [...relationship.sourceColumnIds],
    targetColumnIds: [...relationship.targetColumnIds],
  }
}

export function createDbDiagramDocument(document: Partial<DbDiagramDocument> = {}): DbDiagramDocument {
  const layoutNodes = document.layout?.nodes
  return {
    version: 1,
    ...document,
    schemas: document.schemas?.map(schema => ({ ...schema })) ?? [],
    extensions: document.extensions?.map(extension => ({ ...extension })) ?? [],
    domains: document.domains?.map(cloneDomain) ?? [],
    enums: document.enums?.map(dbEnum => ({ ...dbEnum, values: [...dbEnum.values] })) ?? [],
    types: document.types?.map(cloneType) ?? [],
    tables: document.tables?.map(cloneTable) ?? [],
    views: document.views?.map(cloneView) ?? [],
    sequences: document.sequences?.map(cloneSequence) ?? [],
    functions: document.functions?.map(cloneFunction) ?? [],
    triggers:
      document.triggers?.map(trigger => ({
        ...trigger,
        events: [...trigger.events],
        functionArgs: trigger.functionArgs ? [...trigger.functionArgs] : undefined,
      })) ?? [],
    policies:
      document.policies?.map(policy => ({
        ...policy,
        roles: policy.roles ? [...policy.roles] : undefined,
      })) ?? [],
    relationships: document.relationships?.map(cloneRelationship) ?? [],
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

export function findDbTable(document: DbDiagramDocument, tableId: DbDiagramId) {
  return document.tables.find(table => table.id === tableId)
}

export function findDbColumn(table: DbDiagramTable, columnId: DbDiagramId) {
  return table.columns.find(column => column.id === columnId)
}

export function findDbFunction(document: DbDiagramDocument, functionId: DbDiagramId) {
  return document.functions?.find(dbFunction => dbFunction.id === functionId)
}

export function createDbRelationshipsFromColumnReferences(document: DbDiagramDocument): DbDiagramRelationship[] {
  const relationships: DbDiagramRelationship[] = []

  for (const table of document.tables) {
    for (const column of table.columns) {
      if (!column.references) continue
      relationships.push({
        id: `ref:${table.id}.${column.id}->${column.references.tableId}.${column.references.columnId}`,
        name: column.references.name,
        sourceTableId: table.id,
        sourceColumnIds: [column.id],
        targetTableId: column.references.tableId,
        targetColumnIds: [column.references.columnId],
        cardinality: 'many-to-one',
        onDelete: column.references.onDelete,
        onUpdate: column.references.onUpdate,
      })
    }
  }

  return relationships
}

export function getDbDiagramRelationships(document: DbDiagramDocument): DbDiagramRelationship[] {
  const relationshipsById = new Map<DbDiagramId, DbDiagramRelationship>()

  for (const relationship of createDbRelationshipsFromColumnReferences(document)) {
    relationshipsById.set(relationship.id, relationship)
  }

  for (const relationship of document.relationships ?? []) {
    relationshipsById.set(relationship.id, relationship)
  }

  return [...relationshipsById.values()]
}

function createDefaultPosition(index: number) {
  const column = index % 3
  const row = Math.floor(index / 3)
  return {
    x: 80 + column * 340,
    y: 80 + row * 260,
  }
}

function getColumnPortLabel(column: DbDiagramColumn) {
  const markers = [
    column.primaryKey ? 'pk' : null,
    column.references ? 'fk' : null,
    column.nullable === false || column.primaryKey ? 'not null' : null,
  ].filter(Boolean)

  return `${column.name} ${column.type}${markers.length > 0 ? ` ${markers.join(' ')}` : ''}`
}

function createTablePorts(table: DbDiagramTable): DiagrammerPort[] {
  return table.columns.map(column => ({
    id: getDbColumnPortId(column.id),
    label: getColumnPortLabel(column),
    side: column.references ? 'left' : 'right',
    direction: 'both',
    metadata: {
      tableId: table.id,
      columnId: column.id,
      primaryKey: column.primaryKey,
      foreignKey: Boolean(column.references),
    },
  }))
}

function createTableNode(
  table: DbDiagramTable,
  index: number,
  document: DbDiagramDocument,
): DiagrammerNode<DbDiagramNodePayload> {
  const nodeId = getDbTableNodeId(table.id)

  return {
    id: nodeId,
    type: 'db-table',
    position: document.layout?.nodes?.[nodeId] ?? createDefaultPosition(index),
    data: {
      label: table.name,
      description: table.description,
      icon: 'table-2',
      tone: 'primary',
      payload: {
        kind: 'table',
        tableId: table.id,
        table,
      },
      ports: createTablePorts(table),
      metadata: {
        tableId: table.id,
        schemaId: table.schemaId,
      },
    },
  }
}

function createEnumNode(
  dbEnum: DbDiagramEnum,
  index: number,
  document: DbDiagramDocument,
): DiagrammerNode<DbDiagramNodePayload> {
  const nodeId = getDbEnumNodeId(dbEnum.id)

  return {
    id: nodeId,
    type: 'db-enum',
    position: document.layout?.nodes?.[nodeId] ?? createDefaultPosition(index),
    data: {
      label: dbEnum.name,
      description: dbEnum.values.join(', '),
      icon: 'list-tree',
      tone: 'accent',
      payload: {
        kind: 'enum',
        enumId: dbEnum.id,
        enum: dbEnum,
      },
      metadata: {
        enumId: dbEnum.id,
        schemaId: dbEnum.schemaId,
      },
    },
  }
}

function createDomainNode(
  domain: DbDiagramDomain,
  index: number,
  document: DbDiagramDocument,
): DiagrammerNode<DbDiagramNodePayload> {
  const nodeId = getDbDomainNodeId(domain.id)

  return {
    id: nodeId,
    type: 'db-domain',
    position: document.layout?.nodes?.[nodeId] ?? createDefaultPosition(index),
    data: {
      label: domain.name,
      description: domain.description ?? domain.type,
      icon: 'braces',
      tone: 'secondary',
      payload: {
        kind: 'domain',
        domainId: domain.id,
        domain,
      },
      metadata: {
        domainId: domain.id,
        schemaId: domain.schemaId,
      },
    },
  }
}

function getViewColumnPortLabel(column: NonNullable<DbDiagramView['columns']>[number]) {
  return column.type ? `${column.name} ${column.type}` : column.name
}

function createViewPorts(view: DbDiagramView): DiagrammerPort[] {
  return (view.columns ?? []).map(column => ({
    id: getDbViewColumnPortId(column.id),
    label: getViewColumnPortLabel(column),
    side: 'right',
    direction: 'both',
    metadata: {
      viewId: view.id,
      columnId: column.id,
    },
  }))
}

function createViewNode(
  view: DbDiagramView,
  index: number,
  document: DbDiagramDocument,
): DiagrammerNode<DbDiagramNodePayload> {
  const nodeId = getDbViewNodeId(view.id)
  const kind = view.kind ?? 'view'

  return {
    id: nodeId,
    type: 'db-view',
    position: document.layout?.nodes?.[nodeId] ?? createDefaultPosition(index),
    data: {
      label: view.name,
      description: view.description ?? (kind === 'materialized-view' ? 'materialized view' : 'view'),
      icon: kind === 'materialized-view' ? 'gallery-horizontal-end' : 'table-properties',
      tone: kind === 'materialized-view' ? 'accent' : 'info',
      payload: {
        kind: 'view',
        viewId: view.id,
        view,
      },
      ports: createViewPorts(view),
      metadata: {
        viewId: view.id,
        schemaId: view.schemaId,
        kind,
      },
    },
  }
}

function createSequenceNode(
  sequence: DbDiagramSequence,
  index: number,
  document: DbDiagramDocument,
): DiagrammerNode<DbDiagramNodePayload> {
  const nodeId = getDbSequenceNodeId(sequence.id)

  return {
    id: nodeId,
    type: 'db-sequence',
    position: document.layout?.nodes?.[nodeId] ?? createDefaultPosition(index),
    data: {
      label: sequence.name,
      description: sequence.description ?? sequence.type ?? 'sequence',
      icon: 'list-ordered',
      tone: 'neutral',
      payload: {
        kind: 'sequence',
        sequenceId: sequence.id,
        sequence,
      },
      metadata: {
        sequenceId: sequence.id,
        schemaId: sequence.schemaId,
      },
    },
  }
}

function formatFunctionSignature(dbFunction: DbDiagramFunction) {
  const args = dbFunction.arguments?.map(argument => argument.type).join(', ') ?? ''
  return `${dbFunction.name}(${args}) -> ${dbFunction.returns}`
}

function createFunctionNode(
  dbFunction: DbDiagramFunction,
  index: number,
  document: DbDiagramDocument,
): DiagrammerNode<DbDiagramNodePayload> {
  const nodeId = getDbFunctionNodeId(dbFunction.id)

  return {
    id: nodeId,
    type: 'db-function',
    position: document.layout?.nodes?.[nodeId] ?? createDefaultPosition(index),
    data: {
      label: dbFunction.name,
      description: dbFunction.description ?? formatFunctionSignature(dbFunction),
      icon: 'sigma',
      tone: 'warning',
      payload: {
        kind: 'function',
        functionId: dbFunction.id,
        function: dbFunction,
      },
      metadata: {
        functionId: dbFunction.id,
        schemaId: dbFunction.schemaId,
      },
    },
  }
}

function createRelationshipEdge(relationship: DbDiagramRelationship): DiagrammerEdge<DbDiagramEdgePayload> {
  return {
    id: getDbRelationshipEdgeId(relationship.id),
    type: 'smoothstep',
    source: getDbTableNodeId(relationship.sourceTableId),
    target: getDbTableNodeId(relationship.targetTableId),
    sourcePortId: relationship.sourceColumnIds[0] ? getDbColumnPortId(relationship.sourceColumnIds[0]) : undefined,
    targetPortId: relationship.targetColumnIds[0] ? getDbColumnPortId(relationship.targetColumnIds[0]) : undefined,
    data: {
      label: relationship.name ?? relationship.cardinality,
      payload: {
        kind: 'relationship',
        relationshipId: relationship.id,
        relationship,
      },
    },
  }
}

export function toDbDiagrammerDocument(
  document: DbDiagramDocument,
): DiagrammerDocument<DbDiagramNodePayload, DbDiagramEdgePayload> {
  const tableNodes = document.tables.map((table, index) => createTableNode(table, index, document))
  const viewNodes = (document.views ?? []).map((view, index) =>
    createViewNode(view, tableNodes.length + index, document),
  )
  const enumNodes = (document.enums ?? []).map((dbEnum, index) =>
    createEnumNode(dbEnum, tableNodes.length + viewNodes.length + index, document),
  )
  const domainNodes = (document.domains ?? []).map((domain, index) =>
    createDomainNode(domain, tableNodes.length + viewNodes.length + enumNodes.length + index, document),
  )
  const sequenceNodes = (document.sequences ?? []).map((sequence, index) =>
    createSequenceNode(
      sequence,
      tableNodes.length + viewNodes.length + enumNodes.length + domainNodes.length + index,
      document,
    ),
  )
  const functionNodes = (document.functions ?? []).map((dbFunction, index) =>
    createFunctionNode(
      dbFunction,
      tableNodes.length + viewNodes.length + enumNodes.length + domainNodes.length + sequenceNodes.length + index,
      document,
    ),
  )

  return {
    version: 1,
    id: document.id,
    title: document.title,
    nodes: [...tableNodes, ...viewNodes, ...enumNodes, ...domainNodes, ...sequenceNodes, ...functionNodes],
    edges: getDbDiagramRelationships(document).map(createRelationshipEdge),
    viewport: document.layout?.viewport,
    metadata: {
      source: 'db-diagram',
      dialect: document.dialect,
    },
  }
}

export function updateDbDiagramLayoutFromDiagrammer(
  document: DbDiagramDocument,
  diagramDocument: DiagrammerDocument<DbDiagramNodePayload, DbDiagramEdgePayload>,
): DbDiagramDocument {
  const nextNodes = { ...(document.layout?.nodes ?? {}) }

  for (const node of diagramDocument.nodes) {
    nextNodes[node.id] = { ...node.position }
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

function pushDuplicateIssue(
  issues: DbDiagramValidationIssue[],
  code: string,
  message: string,
  owner: Pick<
    DbDiagramValidationIssue,
    | 'schemaId'
    | 'tableId'
    | 'columnId'
    | 'domainId'
    | 'typeId'
    | 'fieldId'
    | 'enumId'
    | 'extensionId'
    | 'viewId'
    | 'sequenceId'
    | 'functionId'
    | 'triggerId'
    | 'policyId'
    | 'relationshipId'
  > = {},
) {
  issues.push({ code, message, severity: 'error', ...owner })
}

export function validateDbDiagramDocument(document: DbDiagramDocument): DbDiagramValidationIssue[] {
  const issues: DbDiagramValidationIssue[] = []
  const schemaIds = new Set<DbDiagramId>()
  const tableIds = new Set<DbDiagramId>()
  const domainIds = new Set<DbDiagramId>()
  const typeIds = new Set<DbDiagramId>()
  const enumIds = new Set<DbDiagramId>()
  const extensionIds = new Set<DbDiagramId>()
  const viewIds = new Set<DbDiagramId>()
  const sequenceIds = new Set<DbDiagramId>()
  const functionIds = new Set<DbDiagramId>()
  const triggerIds = new Set<DbDiagramId>()
  const policyIds = new Set<DbDiagramId>()
  const explicitRelationshipIds = new Set<DbDiagramId>()

  for (const schema of document.schemas ?? []) {
    if (schemaIds.has(schema.id)) {
      pushDuplicateIssue(issues, 'duplicate-schema-id', `Duplicate schema id: ${schema.id}`, { schemaId: schema.id })
    }
    schemaIds.add(schema.id)
  }

  for (const extension of document.extensions ?? []) {
    if (extensionIds.has(extension.id)) {
      pushDuplicateIssue(issues, 'duplicate-extension-id', `Duplicate extension id: ${extension.id}`, {
        extensionId: extension.id,
      })
    }
    extensionIds.add(extension.id)

    if (extension.schemaId && !schemaIds.has(extension.schemaId)) {
      issues.push({
        code: 'missing-extension-schema',
        message: `Extension ${extension.id} references missing schema ${extension.schemaId}`,
        severity: 'error',
        extensionId: extension.id,
        schemaId: extension.schemaId,
      })
    }
  }

  for (const domain of document.domains ?? []) {
    if (domainIds.has(domain.id)) {
      pushDuplicateIssue(issues, 'duplicate-domain-id', `Duplicate domain id: ${domain.id}`, { domainId: domain.id })
    }
    domainIds.add(domain.id)

    if (domain.schemaId && !schemaIds.has(domain.schemaId)) {
      issues.push({
        code: 'missing-domain-schema',
        message: `Domain ${domain.id} references missing schema ${domain.schemaId}`,
        severity: 'error',
        domainId: domain.id,
        schemaId: domain.schemaId,
      })
    }
  }

  for (const type of document.types ?? []) {
    if (typeIds.has(type.id)) {
      pushDuplicateIssue(issues, 'duplicate-type-id', `Duplicate type id: ${type.id}`, { typeId: type.id })
    }
    typeIds.add(type.id)

    if (type.schemaId && !schemaIds.has(type.schemaId)) {
      issues.push({
        code: 'missing-type-schema',
        message: `Type ${type.id} references missing schema ${type.schemaId}`,
        severity: 'error',
        typeId: type.id,
        schemaId: type.schemaId,
      })
    }

    const fieldIds = new Set<DbDiagramId>()
    for (const field of type.fields ?? []) {
      if (fieldIds.has(field.id)) {
        pushDuplicateIssue(issues, 'duplicate-type-field-id', `Duplicate field id ${field.id} in type ${type.id}`, {
          typeId: type.id,
          fieldId: field.id,
        })
      }
      fieldIds.add(field.id)
    }
  }

  for (const table of document.tables) {
    if (tableIds.has(table.id)) {
      pushDuplicateIssue(issues, 'duplicate-table-id', `Duplicate table id: ${table.id}`, { tableId: table.id })
    }
    tableIds.add(table.id)

    if (table.schemaId && !schemaIds.has(table.schemaId)) {
      issues.push({
        code: 'missing-table-schema',
        message: `Table ${table.id} references missing schema ${table.schemaId}`,
        severity: 'error',
        tableId: table.id,
        schemaId: table.schemaId,
      })
    }

    const columnIds = new Set<DbDiagramId>()
    for (const column of table.columns) {
      if (columnIds.has(column.id)) {
        pushDuplicateIssue(issues, 'duplicate-column-id', `Duplicate column id ${column.id} in table ${table.id}`, {
          tableId: table.id,
          columnId: column.id,
        })
      }
      columnIds.add(column.id)
    }
  }

  for (const view of document.views ?? []) {
    if (viewIds.has(view.id)) {
      pushDuplicateIssue(issues, 'duplicate-view-id', `Duplicate view id: ${view.id}`, { viewId: view.id })
    }
    viewIds.add(view.id)

    if (view.schemaId && !schemaIds.has(view.schemaId)) {
      issues.push({
        code: 'missing-view-schema',
        message: `View ${view.id} references missing schema ${view.schemaId}`,
        severity: 'error',
        viewId: view.id,
        schemaId: view.schemaId,
      })
    }

    const columnIds = new Set<DbDiagramId>()
    for (const column of view.columns ?? []) {
      if (columnIds.has(column.id)) {
        pushDuplicateIssue(issues, 'duplicate-view-column-id', `Duplicate column id ${column.id} in view ${view.id}`, {
          viewId: view.id,
          columnId: column.id,
        })
      }
      columnIds.add(column.id)
    }
  }

  for (const sequence of document.sequences ?? []) {
    if (sequenceIds.has(sequence.id)) {
      pushDuplicateIssue(issues, 'duplicate-sequence-id', `Duplicate sequence id: ${sequence.id}`, {
        sequenceId: sequence.id,
      })
    }
    sequenceIds.add(sequence.id)

    if (sequence.schemaId && !schemaIds.has(sequence.schemaId)) {
      issues.push({
        code: 'missing-sequence-schema',
        message: `Sequence ${sequence.id} references missing schema ${sequence.schemaId}`,
        severity: 'error',
        sequenceId: sequence.id,
        schemaId: sequence.schemaId,
      })
    }

    if (sequence.ownedBy) {
      const table = findDbTable(document, sequence.ownedBy.tableId)
      if (!table) {
        issues.push({
          code: 'missing-sequence-owner-table',
          message: `Sequence ${sequence.id} references missing owner table ${sequence.ownedBy.tableId}`,
          severity: 'error',
          sequenceId: sequence.id,
          tableId: sequence.ownedBy.tableId,
        })
      } else if (!findDbColumn(table, sequence.ownedBy.columnId)) {
        issues.push({
          code: 'missing-sequence-owner-column',
          message: `Sequence ${sequence.id} references missing owner column ${sequence.ownedBy.columnId}`,
          severity: 'error',
          sequenceId: sequence.id,
          tableId: table.id,
          columnId: sequence.ownedBy.columnId,
        })
      }
    }
  }

  for (const dbFunction of document.functions ?? []) {
    if (functionIds.has(dbFunction.id)) {
      pushDuplicateIssue(issues, 'duplicate-function-id', `Duplicate function id: ${dbFunction.id}`, {
        functionId: dbFunction.id,
      })
    }
    functionIds.add(dbFunction.id)

    if (dbFunction.schemaId && !schemaIds.has(dbFunction.schemaId)) {
      issues.push({
        code: 'missing-function-schema',
        message: `Function ${dbFunction.id} references missing schema ${dbFunction.schemaId}`,
        severity: 'error',
        functionId: dbFunction.id,
        schemaId: dbFunction.schemaId,
      })
    }
  }

  for (const dbEnum of document.enums ?? []) {
    if (enumIds.has(dbEnum.id)) {
      pushDuplicateIssue(issues, 'duplicate-enum-id', `Duplicate enum id: ${dbEnum.id}`, { enumId: dbEnum.id })
    }
    enumIds.add(dbEnum.id)

    if (dbEnum.schemaId && !schemaIds.has(dbEnum.schemaId)) {
      issues.push({
        code: 'missing-enum-schema',
        message: `Enum ${dbEnum.id} references missing schema ${dbEnum.schemaId}`,
        severity: 'error',
        enumId: dbEnum.id,
        schemaId: dbEnum.schemaId,
      })
    }
  }

  for (const trigger of document.triggers ?? []) {
    if (triggerIds.has(trigger.id)) {
      pushDuplicateIssue(issues, 'duplicate-trigger-id', `Duplicate trigger id: ${trigger.id}`, {
        triggerId: trigger.id,
      })
    }
    triggerIds.add(trigger.id)

    if (trigger.events.length === 0) {
      issues.push({
        code: 'trigger-without-events',
        message: `Trigger ${trigger.id} has no events`,
        severity: 'error',
        triggerId: trigger.id,
      })
    }

    const table = findDbTable(document, trigger.tableId)
    if (!table) {
      issues.push({
        code: 'missing-trigger-table',
        message: `Trigger ${trigger.id} references missing table ${trigger.tableId}`,
        severity: 'error',
        triggerId: trigger.id,
        tableId: trigger.tableId,
      })
    }

    if (trigger.functionId && !findDbFunction(document, trigger.functionId)) {
      issues.push({
        code: 'missing-trigger-function',
        message: `Trigger ${trigger.id} references missing function ${trigger.functionId}`,
        severity: 'error',
        triggerId: trigger.id,
        functionId: trigger.functionId,
      })
    }
  }

  for (const policy of document.policies ?? []) {
    if (policyIds.has(policy.id)) {
      pushDuplicateIssue(issues, 'duplicate-policy-id', `Duplicate policy id: ${policy.id}`, { policyId: policy.id })
    }
    policyIds.add(policy.id)

    if (!findDbTable(document, policy.tableId)) {
      issues.push({
        code: 'missing-policy-table',
        message: `Policy ${policy.id} references missing table ${policy.tableId}`,
        severity: 'error',
        policyId: policy.id,
        tableId: policy.tableId,
      })
    }
  }

  for (const relationship of document.relationships ?? []) {
    if (explicitRelationshipIds.has(relationship.id)) {
      pushDuplicateIssue(issues, 'duplicate-relationship-id', `Duplicate relationship id: ${relationship.id}`, {
        relationshipId: relationship.id,
      })
    }
    explicitRelationshipIds.add(relationship.id)
  }

  for (const relationship of getDbDiagramRelationships(document)) {
    const sourceTable = findDbTable(document, relationship.sourceTableId)
    const targetTable = findDbTable(document, relationship.targetTableId)

    if (!sourceTable) {
      issues.push({
        code: 'missing-relationship-source-table',
        message: `Relationship ${relationship.id} references missing source table ${relationship.sourceTableId}`,
        severity: 'error',
        relationshipId: relationship.id,
        tableId: relationship.sourceTableId,
      })
    }

    if (!targetTable) {
      issues.push({
        code: 'missing-relationship-target-table',
        message: `Relationship ${relationship.id} references missing target table ${relationship.targetTableId}`,
        severity: 'error',
        relationshipId: relationship.id,
        tableId: relationship.targetTableId,
      })
    }

    for (const columnId of relationship.sourceColumnIds) {
      if (sourceTable && !findDbColumn(sourceTable, columnId)) {
        issues.push({
          code: 'missing-relationship-source-column',
          message: `Relationship ${relationship.id} references missing source column ${columnId}`,
          severity: 'error',
          relationshipId: relationship.id,
          tableId: relationship.sourceTableId,
          columnId,
        })
      }
    }

    for (const columnId of relationship.targetColumnIds) {
      if (targetTable && !findDbColumn(targetTable, columnId)) {
        issues.push({
          code: 'missing-relationship-target-column',
          message: `Relationship ${relationship.id} references missing target column ${columnId}`,
          severity: 'error',
          relationshipId: relationship.id,
          tableId: relationship.targetTableId,
          columnId,
        })
      }
    }
  }

  return issues
}
