import type { Viewport } from '@xyflow/react'

export type DbDiagramId = string

export type DbDiagramDialect = 'generic' | 'postgresql' | 'mysql' | 'sqlite'

export interface DbDiagramPosition {
  x: number
  y: number
}

export interface DbDiagramLayout {
  nodes?: Record<DbDiagramId, DbDiagramPosition>
  viewport?: Viewport
}

export interface DbDiagramSchema {
  id: DbDiagramId
  name: string
  description?: string
  metadata?: Record<string, unknown>
}

export interface DbDiagramEnum {
  id: DbDiagramId
  schemaId?: DbDiagramId
  name: string
  values: string[]
  description?: string
  metadata?: Record<string, unknown>
}

export interface DbDiagramDomain {
  id: DbDiagramId
  schemaId?: DbDiagramId
  name: string
  type: string
  length?: number | string
  nullable?: boolean
  defaultValue?: string
  checks?: DbDiagramCheckConstraint[]
  description?: string
  metadata?: Record<string, unknown>
}

export interface DbDiagramTypeField {
  id: DbDiagramId
  name: string
  type: string
  length?: number | string
  nullable?: boolean
  defaultValue?: string
  description?: string
  metadata?: Record<string, unknown>
}

export interface DbDiagramType {
  id: DbDiagramId
  schemaId?: DbDiagramId
  name: string
  type?: string
  length?: number | string
  defaultValue?: string
  values?: string[]
  fields?: DbDiagramTypeField[]
  description?: string
  metadata?: Record<string, unknown>
}

export interface DbDiagramExtension {
  id: DbDiagramId
  name: string
  schemaId?: DbDiagramId
  version?: string
  description?: string
  metadata?: Record<string, unknown>
}

export type DbDiagramReferenceAction = 'cascade' | 'restrict' | 'set null' | 'set default' | 'no action'

export interface DbDiagramColumnReference {
  tableId: DbDiagramId
  columnId: DbDiagramId
  name?: string
  onDelete?: DbDiagramReferenceAction
  onUpdate?: DbDiagramReferenceAction
}

export interface DbDiagramColumn {
  id: DbDiagramId
  name: string
  type: string
  length?: number | string
  nullable?: boolean
  primaryKey?: boolean
  unique?: boolean
  defaultValue?: string
  generated?: string
  references?: DbDiagramColumnReference
  description?: string
  metadata?: Record<string, unknown>
}

export type DbDiagramTableKind = 'dim' | 'stream' | 'txn' | 'lov'

export interface DbDiagramIndex {
  id: DbDiagramId
  name?: string
  columnIds: DbDiagramId[]
  unique?: boolean
  method?: string
  predicate?: string
  metadata?: Record<string, unknown>
}

export interface DbDiagramCheckConstraint {
  id: DbDiagramId
  name?: string
  expression: string
  metadata?: Record<string, unknown>
}

export interface DbDiagramUniqueConstraint {
  id: DbDiagramId
  name?: string
  columnIds: DbDiagramId[]
  metadata?: Record<string, unknown>
}

export interface DbDiagramTable {
  id: DbDiagramId
  schemaId?: DbDiagramId
  name: string
  kind?: DbDiagramTableKind
  columns: DbDiagramColumn[]
  description?: string
  indexes?: DbDiagramIndex[]
  checks?: DbDiagramCheckConstraint[]
  uniqueConstraints?: DbDiagramUniqueConstraint[]
  metadata?: Record<string, unknown>
}

export type DbDiagramViewKind = 'view' | 'materialized-view'

export interface DbDiagramViewColumn {
  id: DbDiagramId
  name: string
  type?: string
  description?: string
  metadata?: Record<string, unknown>
}

export interface DbDiagramView {
  id: DbDiagramId
  schemaId?: DbDiagramId
  name: string
  kind?: DbDiagramViewKind
  columns?: DbDiagramViewColumn[]
  definition: string
  description?: string
  metadata?: Record<string, unknown>
}

export interface DbDiagramSequenceOwner {
  tableId: DbDiagramId
  columnId: DbDiagramId
}

export interface DbDiagramSequence {
  id: DbDiagramId
  schemaId?: DbDiagramId
  name: string
  type?: string
  startWith?: number
  incrementBy?: number
  minValue?: number
  maxValue?: number
  cache?: number
  cycle?: boolean
  ownedBy?: DbDiagramSequenceOwner
  description?: string
  metadata?: Record<string, unknown>
}

export interface DbDiagramFunctionArgument {
  name?: string
  type: string
  mode?: 'in' | 'out' | 'inout' | 'variadic'
  defaultValue?: string
}

export type DbDiagramFunctionVolatility = 'immutable' | 'stable' | 'volatile'

export interface DbDiagramFunction {
  id: DbDiagramId
  schemaId?: DbDiagramId
  name: string
  arguments?: DbDiagramFunctionArgument[]
  returns: string
  language?: string
  body: string
  volatility?: DbDiagramFunctionVolatility
  description?: string
  metadata?: Record<string, unknown>
}

export type DbDiagramTriggerTiming = 'before' | 'after' | 'instead of'
export type DbDiagramTriggerEvent = 'insert' | 'update' | 'delete' | 'truncate'

export interface DbDiagramTrigger {
  id: DbDiagramId
  tableId: DbDiagramId
  name: string
  timing: DbDiagramTriggerTiming
  events: DbDiagramTriggerEvent[]
  functionId?: DbDiagramId
  functionName?: string
  functionArgs?: string[]
  forEach?: 'row' | 'statement'
  condition?: string
  description?: string
  metadata?: Record<string, unknown>
}

export type DbDiagramPolicyCommand = 'all' | 'select' | 'insert' | 'update' | 'delete'

export interface DbDiagramPolicy {
  id: DbDiagramId
  tableId: DbDiagramId
  name: string
  command?: DbDiagramPolicyCommand
  permissive?: boolean
  roles?: string[]
  using?: string
  check?: string
  description?: string
  metadata?: Record<string, unknown>
}

export type DbDiagramRelationshipCardinality = 'one-to-one' | 'one-to-many' | 'many-to-one' | 'many-to-many'

export interface DbDiagramRelationship {
  id: DbDiagramId
  name?: string
  sourceTableId: DbDiagramId
  sourceColumnIds: DbDiagramId[]
  targetTableId: DbDiagramId
  targetColumnIds: DbDiagramId[]
  cardinality?: DbDiagramRelationshipCardinality
  onDelete?: DbDiagramReferenceAction
  onUpdate?: DbDiagramReferenceAction
  identifying?: boolean
  metadata?: Record<string, unknown>
}

export interface DbDiagramDocument {
  version: 1
  id?: DbDiagramId
  title?: string
  dialect?: DbDiagramDialect
  schemas?: DbDiagramSchema[]
  extensions?: DbDiagramExtension[]
  domains?: DbDiagramDomain[]
  types?: DbDiagramType[]
  enums?: DbDiagramEnum[]
  tables: DbDiagramTable[]
  views?: DbDiagramView[]
  sequences?: DbDiagramSequence[]
  functions?: DbDiagramFunction[]
  triggers?: DbDiagramTrigger[]
  policies?: DbDiagramPolicy[]
  relationships?: DbDiagramRelationship[]
  layout?: DbDiagramLayout
  metadata?: Record<string, unknown>
}

export type DbDiagramNodePayload =
  | {
      kind: 'table'
      tableId: DbDiagramId
      table: DbDiagramTable
    }
  | {
      kind: 'enum'
      enumId: DbDiagramId
      enum: DbDiagramEnum
    }
  | {
      kind: 'domain'
      domainId: DbDiagramId
      domain: DbDiagramDomain
    }
  | {
      kind: 'view'
      viewId: DbDiagramId
      view: DbDiagramView
    }
  | {
      kind: 'sequence'
      sequenceId: DbDiagramId
      sequence: DbDiagramSequence
    }
  | {
      kind: 'function'
      functionId: DbDiagramId
      function: DbDiagramFunction
    }

export interface DbDiagramEdgePayload {
  kind: 'relationship'
  relationshipId: DbDiagramId
  relationship: DbDiagramRelationship
}

export interface DbDiagramValidationIssue {
  code: string
  message: string
  severity: 'error' | 'warning'
  schemaId?: DbDiagramId
  tableId?: DbDiagramId
  columnId?: DbDiagramId
  domainId?: DbDiagramId
  typeId?: DbDiagramId
  fieldId?: DbDiagramId
  enumId?: DbDiagramId
  extensionId?: DbDiagramId
  viewId?: DbDiagramId
  sequenceId?: DbDiagramId
  functionId?: DbDiagramId
  triggerId?: DbDiagramId
  policyId?: DbDiagramId
  relationshipId?: DbDiagramId
}
