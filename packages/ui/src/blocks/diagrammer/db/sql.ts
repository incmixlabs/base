import { findDbColumn, findDbTable, getDbDiagramRelationships } from './model'
import type {
  DbDiagramDialect,
  DbDiagramDocument,
  DbDiagramDomain,
  DbDiagramExtension,
  DbDiagramFunction,
  DbDiagramIndex,
  DbDiagramPolicy,
  DbDiagramReferenceAction,
  DbDiagramRelationship,
  DbDiagramSequence,
  DbDiagramTable,
  DbDiagramTrigger,
  DbDiagramView,
} from './types'

export interface FormatDbDiagramSqlOptions {
  dialect?: DbDiagramDialect
  includeSchemas?: boolean
  includeEnums?: boolean
  includeExtensions?: boolean
  includeDomains?: boolean
  includeSequences?: boolean
  includeViews?: boolean
  includeFunctions?: boolean
  includeTriggers?: boolean
  includePolicies?: boolean
  includeIndexes?: boolean
  includeForeignKeys?: boolean
}

function quoteIdentifier(identifier: string, dialect: DbDiagramDialect) {
  const quote = dialect === 'mysql' ? '`' : '"'
  return `${quote}${identifier.replaceAll(quote, quote + quote)}${quote}`
}

function quoteString(value: string) {
  return `'${value.replaceAll("'", "''")}'`
}

function createDollarQuoteDelimiter(body: string) {
  if (!body.includes('$$')) return '$$'

  let index = 1
  while (body.includes(`$fn${index}$`)) index += 1
  return `$fn${index}$`
}

function supportsSchemaDdl(dialect: DbDiagramDialect) {
  return dialect === 'postgresql' || dialect === 'mysql'
}

function supportsSchemaQualifier(dialect: DbDiagramDialect) {
  return dialect === 'postgresql' || dialect === 'mysql'
}

function formatQualifiedName(
  document: DbDiagramDocument,
  item: { schemaId?: string; name: string },
  dialect: DbDiagramDialect,
) {
  if (!supportsSchemaQualifier(dialect)) return quoteIdentifier(item.name, dialect)

  const schema = item.schemaId ? document.schemas?.find(candidate => candidate.id === item.schemaId) : undefined
  return schema
    ? `${quoteIdentifier(schema.name, dialect)}.${quoteIdentifier(item.name, dialect)}`
    : quoteIdentifier(item.name, dialect)
}

function formatReferenceAction(action: DbDiagramReferenceAction | undefined) {
  return action?.toUpperCase()
}

function getPrimaryKeyColumnIds(table: DbDiagramTable) {
  return table.columns.filter(column => column.primaryKey).map(column => column.id)
}

function formatColumnDefinition(table: DbDiagramTable, columnId: string, dialect: DbDiagramDialect) {
  const column = findDbColumn(table, columnId)
  return column ? quoteIdentifier(column.name, dialect) : quoteIdentifier(columnId, dialect)
}

function formatTableColumnDefinition(column: DbDiagramTable['columns'][number], dialect: DbDiagramDialect) {
  const parts = [quoteIdentifier(column.name, dialect), column.type]

  if (column.generated) parts.push(`GENERATED ALWAYS AS (${column.generated}) STORED`)
  if (column.nullable === false || column.primaryKey) parts.push('NOT NULL')
  if (column.defaultValue !== undefined) parts.push(`DEFAULT ${column.defaultValue}`)

  return parts.join(' ')
}

function formatConstraintName(name: string, dialect: DbDiagramDialect) {
  return quoteIdentifier(name, dialect)
}

function assertPostgresqlFeature(dialect: DbDiagramDialect, feature: string) {
  if (dialect !== 'postgresql') {
    throw new Error(`${feature} DDL export is only supported for PostgreSQL: ${dialect}`)
  }
}

function formatExtension(document: DbDiagramDocument, extension: DbDiagramExtension) {
  const options: string[] = []

  if (extension.schemaId) {
    const schema = document.schemas?.find(candidate => candidate.id === extension.schemaId)
    if (schema) {
      options.push(`SCHEMA ${quoteIdentifier(schema.name, 'postgresql')}`)
    }
  }
  if (extension.version) options.push(`VERSION ${quoteString(extension.version)}`)

  const withOptions = options.length > 0 ? ` WITH ${options.join(' ')}` : ''

  return `CREATE EXTENSION IF NOT EXISTS ${quoteIdentifier(extension.name, 'postgresql')}${withOptions};`
}

function formatDomain(document: DbDiagramDocument, domain: DbDiagramDomain, dialect: DbDiagramDialect) {
  assertPostgresqlFeature(dialect, 'Domain')

  const parts = [`CREATE DOMAIN ${formatQualifiedName(document, domain, dialect)} AS ${domain.type}`]
  if (domain.defaultValue !== undefined) parts.push(`DEFAULT ${domain.defaultValue}`)
  if (domain.nullable === false) parts.push('NOT NULL')
  for (const check of domain.checks ?? []) {
    const name = check.name ? `CONSTRAINT ${formatConstraintName(check.name, dialect)} ` : ''
    parts.push(`${name}CHECK (${check.expression})`)
  }

  return `${parts.join(' ')};`
}

function formatSequence(document: DbDiagramDocument, sequence: DbDiagramSequence, dialect: DbDiagramDialect) {
  assertPostgresqlFeature(dialect, 'Sequence')

  const parts = [`CREATE SEQUENCE ${formatQualifiedName(document, sequence, dialect)}`]
  if (sequence.type) parts.push(`AS ${sequence.type}`)
  if (sequence.incrementBy !== undefined) parts.push(`INCREMENT BY ${sequence.incrementBy}`)
  if (sequence.minValue !== undefined) parts.push(`MINVALUE ${sequence.minValue}`)
  if (sequence.maxValue !== undefined) parts.push(`MAXVALUE ${sequence.maxValue}`)
  if (sequence.startWith !== undefined) parts.push(`START WITH ${sequence.startWith}`)
  if (sequence.cache !== undefined) parts.push(`CACHE ${sequence.cache}`)
  if (sequence.cycle) parts.push('CYCLE')

  return `${parts.join(' ')};`
}

function formatSequenceOwnership(document: DbDiagramDocument, sequence: DbDiagramSequence, dialect: DbDiagramDialect) {
  assertPostgresqlFeature(dialect, 'Sequence')

  if (!sequence.ownedBy) return null
  const table = findDbTable(document, sequence.ownedBy.tableId)
  const column = table ? findDbColumn(table, sequence.ownedBy.columnId) : undefined
  if (!table || !column) return null

  return `ALTER SEQUENCE ${formatQualifiedName(document, sequence, dialect)} OWNED BY ${formatQualifiedName(
    document,
    table,
    dialect,
  )}.${quoteIdentifier(column.name, dialect)};`
}

function formatSequenceOwnershipStatements(document: DbDiagramDocument, dialect: DbDiagramDialect) {
  const statements: string[] = []

  for (const sequence of document.sequences ?? []) {
    const statement = formatSequenceOwnership(document, sequence, dialect)
    if (statement) statements.push(statement)
  }

  return statements
}

function formatTableDefinition(document: DbDiagramDocument, table: DbDiagramTable, dialect: DbDiagramDialect) {
  const lines = table.columns.map(column => `  ${formatTableColumnDefinition(column, dialect)}`)
  const primaryKeyColumnIds = getPrimaryKeyColumnIds(table)

  if (primaryKeyColumnIds.length > 0) {
    lines.push(
      `  CONSTRAINT ${formatConstraintName(`${table.name}_pkey`, dialect)} PRIMARY KEY (${primaryKeyColumnIds
        .map(columnId => formatColumnDefinition(table, columnId, dialect))
        .join(', ')})`,
    )
  }

  for (const column of table.columns) {
    if (!column.unique) continue
    lines.push(
      `  CONSTRAINT ${formatConstraintName(`${table.name}_${column.name}_key`, dialect)} UNIQUE (${quoteIdentifier(
        column.name,
        dialect,
      )})`,
    )
  }

  for (const constraint of table.uniqueConstraints ?? []) {
    lines.push(
      `  CONSTRAINT ${formatConstraintName(constraint.name ?? `${table.name}_${constraint.id}_key`, dialect)} UNIQUE (${constraint.columnIds
        .map(columnId => formatColumnDefinition(table, columnId, dialect))
        .join(', ')})`,
    )
  }

  for (const check of table.checks ?? []) {
    lines.push(
      `  CONSTRAINT ${formatConstraintName(check.name ?? `${table.name}_${check.id}_check`, dialect)} CHECK (${check.expression})`,
    )
  }

  return `CREATE TABLE ${formatQualifiedName(document, table, dialect)} (\n${lines.join(',\n')}\n);`
}

function formatRelationshipConstraint(
  document: DbDiagramDocument,
  relationship: DbDiagramRelationship,
  dialect: DbDiagramDialect,
) {
  if (dialect === 'sqlite') {
    throw new Error(`SQLite export cannot add foreign key constraints after table creation: ${relationship.id}`)
  }

  const sourceTable = findDbTable(document, relationship.sourceTableId)
  const targetTable = findDbTable(document, relationship.targetTableId)
  if (!sourceTable || !targetTable) return null
  if (
    relationship.sourceColumnIds.length === 0 ||
    relationship.targetColumnIds.length === 0 ||
    relationship.sourceColumnIds.length !== relationship.targetColumnIds.length
  ) {
    throw new Error(
      `Relationship ${relationship.id} must reference the same non-zero number of source and target columns`,
    )
  }

  const sourceColumns = relationship.sourceColumnIds
    .map(columnId => formatColumnDefinition(sourceTable, columnId, dialect))
    .join(', ')
  const targetColumns = relationship.targetColumnIds
    .map(columnId => formatColumnDefinition(targetTable, columnId, dialect))
    .join(', ')
  const parts = [
    `ALTER TABLE ${formatQualifiedName(document, sourceTable, dialect)}`,
    `ADD CONSTRAINT ${formatConstraintName(relationship.name ?? `${sourceTable.name}_${relationship.sourceColumnIds.join('_')}_fkey`, dialect)}`,
    `FOREIGN KEY (${sourceColumns})`,
    `REFERENCES ${formatQualifiedName(document, targetTable, dialect)} (${targetColumns})`,
  ]
  const onDelete = formatReferenceAction(relationship.onDelete)
  const onUpdate = formatReferenceAction(relationship.onUpdate)

  if (onDelete) parts.push(`ON DELETE ${onDelete}`)
  if (onUpdate) parts.push(`ON UPDATE ${onUpdate}`)

  return `${parts.join(' ')};`
}

function formatIndex(
  document: DbDiagramDocument,
  table: DbDiagramTable,
  index: DbDiagramIndex,
  dialect: DbDiagramDialect,
) {
  if (index.method && dialect !== 'postgresql') {
    throw new Error(`Index ${index.id} uses method ${index.method}, which is only supported by PostgreSQL export`)
  }
  if (index.predicate && dialect === 'mysql') {
    throw new Error(`Index ${index.id} uses a predicate, which is not supported by MySQL export`)
  }

  const unique = index.unique ? 'UNIQUE ' : ''
  const method = index.method && dialect === 'postgresql' ? ` USING ${index.method}` : ''
  const predicate = index.predicate ? ` WHERE ${index.predicate}` : ''
  const name = quoteIdentifier(index.name ?? `${table.name}_${index.id}_idx`, dialect)
  const columns = index.columnIds.map(columnId => formatColumnDefinition(table, columnId, dialect)).join(', ')

  return `CREATE ${unique}INDEX ${name} ON ${formatQualifiedName(document, table, dialect)}${method} (${columns})${predicate};`
}

function formatView(document: DbDiagramDocument, view: DbDiagramView, dialect: DbDiagramDialect) {
  const kind = view.kind ?? 'view'
  if (kind === 'materialized-view') assertPostgresqlFeature(dialect, 'Materialized view')

  const viewType = kind === 'materialized-view' ? 'MATERIALIZED VIEW' : 'VIEW'
  const columns =
    view.columns && view.columns.length > 0
      ? ` (${view.columns.map(column => quoteIdentifier(column.name, dialect)).join(', ')})`
      : ''

  return `CREATE ${viewType} ${formatQualifiedName(document, view, dialect)}${columns} AS\n${view.definition};`
}

function formatFunctionArgument(
  argument: NonNullable<DbDiagramFunction['arguments']>[number],
  dialect: DbDiagramDialect,
) {
  const mode = argument.mode ? `${argument.mode.toUpperCase()} ` : ''
  const name = argument.name ? `${quoteIdentifier(argument.name, dialect)} ` : ''
  const defaultValue = argument.defaultValue !== undefined ? ` DEFAULT ${argument.defaultValue}` : ''

  return `${mode}${name}${argument.type}${defaultValue}`
}

function formatFunction(document: DbDiagramDocument, dbFunction: DbDiagramFunction, dialect: DbDiagramDialect) {
  assertPostgresqlFeature(dialect, 'Function')

  const args = dbFunction.arguments?.map(argument => formatFunctionArgument(argument, dialect)).join(', ') ?? ''
  const language = dbFunction.language ?? 'sql'
  const volatility = dbFunction.volatility ? ` ${dbFunction.volatility.toUpperCase()}` : ''
  const delimiter = createDollarQuoteDelimiter(dbFunction.body)

  return `CREATE FUNCTION ${formatQualifiedName(document, dbFunction, dialect)}(${args}) RETURNS ${
    dbFunction.returns
  } LANGUAGE ${language}${volatility} AS ${delimiter}\n${dbFunction.body}\n${delimiter};`
}

function formatTriggerFunctionName(document: DbDiagramDocument, trigger: DbDiagramTrigger, dialect: DbDiagramDialect) {
  if (trigger.functionId) {
    const dbFunction = document.functions?.find(candidate => candidate.id === trigger.functionId)
    if (dbFunction) return formatQualifiedName(document, dbFunction, dialect)
  }

  if (trigger.functionName) return quoteIdentifier(trigger.functionName, dialect)
  throw new Error(`Trigger ${trigger.id} references an unresolved function and must provide functionName`)
}

function formatTrigger(document: DbDiagramDocument, trigger: DbDiagramTrigger, dialect: DbDiagramDialect) {
  assertPostgresqlFeature(dialect, 'Trigger')

  const table = findDbTable(document, trigger.tableId)
  if (!table) return null

  const timing = trigger.timing.toUpperCase()
  const events = trigger.events.map(event => event.toUpperCase()).join(' OR ')
  const forEach = trigger.forEach ? ` FOR EACH ${trigger.forEach.toUpperCase()}` : ''
  const condition = trigger.condition ? ` WHEN (${trigger.condition})` : ''
  const args = trigger.functionArgs?.join(', ') ?? ''

  return `CREATE TRIGGER ${quoteIdentifier(trigger.name, dialect)} ${timing} ${events} ON ${formatQualifiedName(
    document,
    table,
    dialect,
  )}${forEach}${condition} EXECUTE FUNCTION ${formatTriggerFunctionName(document, trigger, dialect)}(${args});`
}

function formatPolicy(document: DbDiagramDocument, policy: DbDiagramPolicy, dialect: DbDiagramDialect) {
  assertPostgresqlFeature(dialect, 'Policy')

  const table = findDbTable(document, policy.tableId)
  if (!table) return null

  const mode = policy.permissive === false ? ' AS RESTRICTIVE' : ''
  const command = policy.command ? ` FOR ${policy.command.toUpperCase()}` : ''
  const roles =
    policy.roles && policy.roles.length > 0
      ? ` TO ${policy.roles.map(role => quoteIdentifier(role, dialect)).join(', ')}`
      : ''
  const using = policy.using ? ` USING (${policy.using})` : ''
  const check = policy.check ? ` WITH CHECK (${policy.check})` : ''

  return `CREATE POLICY ${quoteIdentifier(policy.name, dialect)} ON ${formatQualifiedName(
    document,
    table,
    dialect,
  )}${mode}${command}${roles}${using}${check};`
}

export function formatDbDiagramSql(document: DbDiagramDocument, options: FormatDbDiagramSqlOptions = {}) {
  const dialect = options.dialect ?? document.dialect ?? 'postgresql'
  const includeSchemas = options.includeSchemas ?? true
  const includeEnums = options.includeEnums ?? true
  const includeExtensions = options.includeExtensions ?? true
  const includeDomains = options.includeDomains ?? true
  const includeSequences = options.includeSequences ?? true
  const includeViews = options.includeViews ?? true
  const includeFunctions = options.includeFunctions ?? true
  const includeTriggers = options.includeTriggers ?? true
  const includePolicies = options.includePolicies ?? true
  const includeIndexes = options.includeIndexes ?? true
  const includeForeignKeys = options.includeForeignKeys ?? true
  const statements: string[] = []

  if (includeSchemas && supportsSchemaDdl(dialect)) {
    for (const schema of document.schemas ?? []) {
      statements.push(`CREATE SCHEMA IF NOT EXISTS ${quoteIdentifier(schema.name, dialect)};`)
    }
  }

  if (includeExtensions && (document.extensions?.length ?? 0) > 0) {
    assertPostgresqlFeature(dialect, 'Extension')
    for (const extension of document.extensions ?? []) {
      statements.push(formatExtension(document, extension))
    }
  }

  if (includeDomains && (document.domains?.length ?? 0) > 0) {
    for (const domain of document.domains ?? []) {
      statements.push(formatDomain(document, domain, dialect))
    }
  }

  if (includeEnums && dialect !== 'postgresql' && (document.enums?.length ?? 0) > 0) {
    throw new Error(`Enum DDL export is only supported for PostgreSQL: ${dialect}`)
  }

  if (includeEnums && dialect === 'postgresql') {
    for (const dbEnum of document.enums ?? []) {
      statements.push(
        `CREATE TYPE ${formatQualifiedName(document, dbEnum, dialect)} AS ENUM (${dbEnum.values.map(quoteString).join(', ')});`,
      )
    }
  }

  if (includeSequences && (document.sequences?.length ?? 0) > 0) {
    for (const sequence of document.sequences ?? []) {
      statements.push(formatSequence(document, sequence, dialect))
    }
  }

  for (const table of document.tables) {
    statements.push(formatTableDefinition(document, table, dialect))
  }

  if (includeSequences && (document.sequences?.length ?? 0) > 0) {
    statements.push(...formatSequenceOwnershipStatements(document, dialect))
  }

  if (includeForeignKeys) {
    for (const relationship of getDbDiagramRelationships(document)) {
      const statement = formatRelationshipConstraint(document, relationship, dialect)
      if (statement) statements.push(statement)
    }
  }

  if (includeIndexes) {
    for (const table of document.tables) {
      for (const index of table.indexes ?? []) {
        statements.push(formatIndex(document, table, index, dialect))
      }
    }
  }

  if (includeFunctions) {
    for (const dbFunction of document.functions ?? []) {
      statements.push(formatFunction(document, dbFunction, dialect))
    }
  }

  if (includeViews) {
    for (const view of document.views ?? []) {
      statements.push(formatView(document, view, dialect))
    }
  }

  if (includeTriggers) {
    for (const trigger of document.triggers ?? []) {
      const statement = formatTrigger(document, trigger, dialect)
      if (statement) statements.push(statement)
    }
  }

  if (includePolicies) {
    for (const policy of document.policies ?? []) {
      const statement = formatPolicy(document, policy, dialect)
      if (statement) statements.push(statement)
    }
  }

  return statements.join('\n\n')
}
