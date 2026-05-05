import type {
  DbDiagramColumn,
  DbDiagramDocument,
  DbDiagramDomain,
  DbDiagramId,
  DbDiagramTable,
  DbDiagramType,
  DbDiagramTypeField,
} from './types'

export type DbTableDefinitionRowKind = 'domain' | 'type' | 'type-field' | 'table' | 'table-column'

export type DbTableDefinitionSectionKind = 'fields' | 'columns'

export type DbTableDefinitionRowValues = {
  name: string
  type: string
  length: string
  options: string
  defaultValue: string
  nullable: boolean | null
  check: string
}

export type DbTableDefinitionRow = {
  id: string
  kind: DbTableDefinitionRowKind
  domainId?: DbDiagramId
  typeId?: DbDiagramId
  fieldId?: DbDiagramId
  tableId?: DbDiagramId
  columnId?: DbDiagramId
  values: DbTableDefinitionRowValues
  subRows?: DbTableDefinitionRow[]
}

export type DbTableDefinitionEditColumn = keyof DbTableDefinitionRowValues

export type DbTableDefinitionMoveDirection = 'up' | 'down'

const nestedTypeMetadataKey = 'dbDefinitionEditorNestedType'
const nestedTypeOwnerTypeIdMetadataKey = 'dbDefinitionEditorNestedOwnerTypeId'
const nestedTypeOwnerFieldIdMetadataKey = 'dbDefinitionEditorNestedOwnerFieldId'

const fixedLengthTypes = new Set([
  'bigint',
  'bool',
  'boolean',
  'bigserial',
  'date',
  'int',
  'integer',
  'json',
  'jsonb',
  'smallint',
  'smallserial',
  'serial',
  'text',
  'timestamp',
  'timestamptz',
  'uuid',
])

const lengthCapableTypes = new Set(['char', 'character', 'decimal', 'numeric', 'string', 'varchar'])
const tableKinds = new Set<NonNullable<DbDiagramTable['kind']>>(['dim', 'stream', 'txn', 'lov'])

export const scalarDbTypeOptions = [
  'text',
  'varchar',
  'char',
  'int',
  'smallint',
  'bigint',
  'serial',
  'smallserial',
  'bigserial',
  'timestamptz',
  'json',
  'jsonb',
  'enum',
] as const

export const baseDbColumnTypes = [
  'text',
  'varchar',
  'char',
  'int',
  'integer',
  'bigint',
  'bool',
  'boolean',
  'date',
  'decimal',
  'json',
  'jsonb',
  'numeric',
  'serial',
  'bigserial',
  'smallint',
  'smallserial',
  'timestamp',
  'timestamptz',
  'uuid',
] as const

function nextObjectId(existingIds: Iterable<string>, prefix: string) {
  const used = new Set(existingIds)
  let index = used.size + 1
  let id = `${prefix}_${index}`
  while (used.has(id)) {
    index += 1
    id = `${prefix}_${index}`
  }
  return id
}

function nextCopyId(existingIds: Iterable<string>, sourceId: string) {
  const used = new Set(existingIds)
  const baseId = `${sourceId}_copy`
  if (!used.has(baseId)) return baseId

  let index = 2
  let id = `${baseId}_${index}`
  while (used.has(id)) {
    index += 1
    id = `${baseId}_${index}`
  }
  return id
}

function nextCopyName(existingNames: Iterable<string>, sourceName: string) {
  const used = new Set(Array.from(existingNames, name => name.toLowerCase()))
  const baseName = `${sourceName}_copy`
  if (!used.has(baseName.toLowerCase())) return baseName

  let index = 2
  let name = `${baseName}_${index}`
  while (used.has(name.toLowerCase())) {
    index += 1
    name = `${baseName}_${index}`
  }
  return name
}

function nextAvailableId(existingIds: Iterable<string>, preferredId: string) {
  const used = new Set(existingIds)
  if (!used.has(preferredId)) return preferredId

  let index = 2
  let id = `${preferredId}_${index}`
  while (used.has(id)) {
    index += 1
    id = `${preferredId}_${index}`
  }
  return id
}

function nextAvailableName(existingNames: Iterable<string>, preferredName: string) {
  const used = new Set(Array.from(existingNames, name => name.toLowerCase()))
  if (!used.has(preferredName.toLowerCase())) return preferredName

  let index = 2
  let name = `${preferredName}_${index}`
  while (used.has(name.toLowerCase())) {
    index += 1
    name = `${preferredName}_${index}`
  }
  return name
}

function insertAfterId<T extends { id: string }>(items: T[], sourceId: string, item: T) {
  const sourceIndex = items.findIndex(existingItem => existingItem.id === sourceId)
  if (sourceIndex < 0) return [...items, item]
  return [...items.slice(0, sourceIndex + 1), item, ...items.slice(sourceIndex + 1)]
}

function moveById<T extends { id: string }>(items: T[], sourceId: string, direction: DbTableDefinitionMoveDirection) {
  const sourceIndex = items.findIndex(existingItem => existingItem.id === sourceId)
  if (sourceIndex < 0) return items

  const targetIndex = direction === 'up' ? sourceIndex - 1 : sourceIndex + 1
  if (targetIndex < 0 || targetIndex >= items.length) return items

  const nextItems = [...items]
  const sourceItem = nextItems[sourceIndex]
  const targetItem = nextItems[targetIndex]
  if (!sourceItem || !targetItem) return items
  nextItems[sourceIndex] = targetItem
  nextItems[targetIndex] = sourceItem
  return nextItems
}

function normalizeTypeName(type: string) {
  return type.trim().toLowerCase()
}

export function isDbDefinitionLengthEditable(type: string) {
  const normalizedType = normalizeTypeName(type)
  if (!normalizedType || fixedLengthTypes.has(normalizedType)) return false
  return lengthCapableTypes.has(normalizedType)
}

function formatLength(length: number | string | undefined) {
  return length == null ? '' : String(length)
}

function parseLength(value: unknown): number | string | undefined {
  const text = String(value).trim()
  if (!text) return undefined
  const numeric = Number(text)
  return Number.isInteger(numeric) && numeric >= 0 ? numeric : text
}

function normalizeText(value: unknown) {
  return String(value).trim()
}

function parseTableKind(value: unknown): DbDiagramTable['kind'] {
  const kind = normalizeText(value).toLowerCase()
  return tableKinds.has(kind as NonNullable<DbDiagramTable['kind']>)
    ? (kind as NonNullable<DbDiagramTable['kind']>)
    : undefined
}

function getTypeFields(type: DbDiagramType) {
  return type.fields ?? []
}

function formatEnumValues(values: string[] | undefined) {
  return values?.map(value => `'${value}'`).join(', ') ?? ''
}

function parseEnumValues(value: unknown) {
  return String(value)
    .split(',')
    .map(part => part.trim().replace(/^['"]|['"]$/g, ''))
    .filter(Boolean)
}

function getDomainCheck(domain: DbDiagramDomain) {
  return domain.checks?.[0]?.expression ?? ''
}

export function isDbDefinitionNestedType(type: DbDiagramType) {
  return type.metadata?.[nestedTypeMetadataKey] === true
}

function getNestedTypeOwnerKey(typeId: DbDiagramId, fieldId: DbDiagramId) {
  return `${typeId}:${fieldId}`
}

function getNestedEditorTypeOwnerKey(type: DbDiagramType) {
  const ownerTypeId = type.metadata?.[nestedTypeOwnerTypeIdMetadataKey]
  const ownerFieldId = type.metadata?.[nestedTypeOwnerFieldIdMetadataKey]
  if (typeof ownerTypeId !== 'string' || typeof ownerFieldId !== 'string') return undefined
  return getNestedTypeOwnerKey(ownerTypeId, ownerFieldId)
}

function getNestedEditorTypeOwner(type: DbDiagramType) {
  const ownerTypeId = type.metadata?.[nestedTypeOwnerTypeIdMetadataKey]
  const ownerFieldId = type.metadata?.[nestedTypeOwnerFieldIdMetadataKey]
  if (typeof ownerTypeId !== 'string' || typeof ownerFieldId !== 'string') return undefined
  return { ownerTypeId, ownerFieldId }
}

function createTypeLookup(types: readonly DbDiagramType[]) {
  const byName = new Map<string, DbDiagramType>()
  const nestedByOwner = new Map<string, DbDiagramType>()

  for (const type of types) {
    if (!byName.has(type.name)) byName.set(type.name, type)

    const ownerKey = getNestedEditorTypeOwnerKey(type)
    if (ownerKey && !nestedByOwner.has(ownerKey)) {
      nestedByOwner.set(ownerKey, type)
    }
  }

  return { byName, nestedByOwner }
}

function resolveNestedTypeForField(
  typeId: DbDiagramId,
  field: DbDiagramTypeField,
  typeLookup?: ReturnType<typeof createTypeLookup>,
) {
  return typeLookup?.nestedByOwner.get(getNestedTypeOwnerKey(typeId, field.id)) ?? typeLookup?.byName.get(field.type)
}

function createDomainRow(domain: DbDiagramDomain): DbTableDefinitionRow {
  return {
    id: `domain:${domain.id}`,
    kind: 'domain',
    domainId: domain.id,
    values: {
      name: domain.name,
      type: domain.type,
      length: formatLength(domain.length),
      options: '',
      defaultValue: domain.defaultValue ?? '',
      nullable: domain.nullable ?? true,
      check: getDomainCheck(domain),
    },
  }
}

function createTypeFieldRow(
  typeId: DbDiagramId,
  field: DbDiagramTypeField,
  typeLookup?: ReturnType<typeof createTypeLookup>,
  visitedTypeIds = new Set<DbDiagramId>([typeId]),
): DbTableDefinitionRow {
  const nestedType = resolveNestedTypeForField(typeId, field, typeLookup)
  const canRenderNestedType = nestedType != null && !visitedTypeIds.has(nestedType.id)
  const nestedVisitedTypeIds = new Set(visitedTypeIds)
  if (nestedType) nestedVisitedTypeIds.add(nestedType.id)
  const subRows = canRenderNestedType
    ? getTypeFields(nestedType).map(nestedField =>
        createTypeFieldRow(nestedType.id, nestedField, typeLookup, nestedVisitedTypeIds),
      )
    : undefined

  return {
    id: `type:${typeId}:field:${field.id}`,
    kind: 'type-field',
    typeId,
    fieldId: field.id,
    values: {
      name: field.name,
      type: field.type,
      length: formatLength(field.length),
      options: '',
      defaultValue: field.defaultValue ?? '',
      nullable: field.nullable ?? true,
      check: '',
    },
    subRows: subRows && subRows.length > 0 ? subRows : undefined,
  }
}

function createTypeRow(type: DbDiagramType, typeLookup?: ReturnType<typeof createTypeLookup>): DbTableDefinitionRow {
  const fields = getTypeFields(type)
  const displayType = type.type ?? (type.values?.length ? 'enum' : '')
  return {
    id: `type:${type.id}`,
    kind: 'type',
    typeId: type.id,
    values: {
      name: type.name,
      type: displayType,
      length: formatLength(type.length),
      options: normalizeTypeName(displayType) === 'enum' ? formatEnumValues(type.values) : '',
      defaultValue: type.defaultValue ?? '',
      nullable: null,
      check: '',
    },
    subRows: fields.length > 0 ? fields.map(field => createTypeFieldRow(type.id, field, typeLookup)) : undefined,
  }
}

function createTableColumnRow(tableId: DbDiagramId, column: DbDiagramColumn): DbTableDefinitionRow {
  return {
    id: `table:${tableId}:column:${column.id}`,
    kind: 'table-column',
    tableId,
    columnId: column.id,
    values: {
      name: column.name,
      type: column.type,
      length: formatLength(column.length),
      options: '',
      defaultValue: column.defaultValue ?? '',
      nullable: column.nullable ?? !column.primaryKey,
      check: '',
    },
  }
}

function createTableRow(table: DbDiagramTable): DbTableDefinitionRow {
  return {
    id: `table:${table.id}`,
    kind: 'table',
    tableId: table.id,
    values: {
      name: table.name,
      type: table.kind ?? '',
      length: '',
      options: '',
      defaultValue: '',
      nullable: null,
      check: '',
    },
    subRows: table.columns.map(column => createTableColumnRow(table.id, column)),
  }
}

export function createDbDomainDefinitionRows(document: DbDiagramDocument) {
  return (document.domains ?? []).map(createDomainRow)
}

export function createDbTypeDefinitionRows(document: DbDiagramDocument) {
  const types = document.types ?? []
  const typeLookup = createTypeLookup(types)
  return types.filter(type => !isDbDefinitionNestedType(type)).map(type => createTypeRow(type, typeLookup))
}

export function createDbTableDefinitionRows(document: DbDiagramDocument, tableId?: DbDiagramId) {
  const tables = tableId ? document.tables.filter(table => table.id === tableId) : document.tables
  return tables.map(createTableRow)
}

function updateDomain(
  document: DbDiagramDocument,
  domainId: DbDiagramId,
  updater: (domain: DbDiagramDomain) => DbDiagramDomain,
) {
  return {
    ...document,
    domains: (document.domains ?? []).map(domain => (domain.id === domainId ? updater(domain) : domain)),
  }
}

function updateType(document: DbDiagramDocument, typeId: DbDiagramId, updater: (type: DbDiagramType) => DbDiagramType) {
  return {
    ...document,
    types: (document.types ?? []).map(type => (type.id === typeId ? updater(type) : type)),
  }
}

function updateTypeField(
  document: DbDiagramDocument,
  typeId: DbDiagramId,
  fieldId: DbDiagramId,
  updater: (field: DbDiagramTypeField) => DbDiagramTypeField,
) {
  return updateType(document, typeId, type => ({
    ...type,
    fields: getTypeFields(type).map(field => (field.id === fieldId ? updater(field) : field)),
  }))
}

function updateTable(
  document: DbDiagramDocument,
  tableId: DbDiagramId,
  updater: (table: DbDiagramTable) => DbDiagramTable,
) {
  return {
    ...document,
    tables: document.tables.map(table => (table.id === tableId ? updater(table) : table)),
  }
}

function updateColumn(
  document: DbDiagramDocument,
  tableId: DbDiagramId,
  columnId: DbDiagramId,
  updater: (column: DbDiagramColumn) => DbDiagramColumn,
) {
  return updateTable(document, tableId, table => ({
    ...table,
    columns: table.columns.map(column => (column.id === columnId ? updater(column) : column)),
  }))
}

function updateLengthAwareValue<T extends { type: string; length?: number | string }>(
  item: T,
  columnId: DbTableDefinitionEditColumn,
  value: unknown,
) {
  if (columnId === 'type') {
    const type = normalizeText(value)
    return { ...item, type, length: isDbDefinitionLengthEditable(type) ? item.length : undefined }
  }
  if (columnId === 'length') {
    return isDbDefinitionLengthEditable(item.type) ? { ...item, length: parseLength(value) } : item
  }
  return item
}

export function updateDbTableDefinitionValue(
  document: DbDiagramDocument,
  row: DbTableDefinitionRow,
  columnId: DbTableDefinitionEditColumn,
  value: unknown,
): DbDiagramDocument {
  if (row.kind === 'domain' && row.domainId) {
    return updateDomain(document, row.domainId, domain => {
      const nextDomain = updateLengthAwareValue(domain, columnId, value)
      if (columnId === 'name') return { ...nextDomain, name: normalizeText(value) }
      if (columnId === 'defaultValue') return { ...nextDomain, defaultValue: normalizeText(value) || undefined }
      if (columnId === 'nullable') return { ...nextDomain, nullable: Boolean(value) }
      if (columnId === 'check') {
        const expression = normalizeText(value)
        const existingChecks = nextDomain.checks ?? []
        return {
          ...nextDomain,
          checks: expression
            ? [
                {
                  ...(existingChecks[0] ?? { id: `${nextDomain.id}_check` }),
                  expression,
                },
                ...existingChecks.slice(1),
              ]
            : existingChecks.length > 1
              ? existingChecks.slice(1)
              : undefined,
        }
      }
      return nextDomain
    })
  }

  if (row.kind === 'type' && row.typeId) {
    return updateType(document, row.typeId, type => {
      if (columnId === 'name') {
        const name = normalizeText(value)
        if (!name) return type
        const existingNames = (document.types ?? [])
          .filter(existingType => existingType.id !== row.typeId)
          .map(t => t.name)
        return { ...type, name: nextAvailableName(existingNames, name) }
      }

      if (columnId === 'type') {
        const nextType = normalizeText(value)
        const normalizedType = normalizeTypeName(nextType)
        return {
          ...type,
          type: nextType || undefined,
          length: isDbDefinitionLengthEditable(nextType) ? type.length : undefined,
          values: normalizedType === 'enum' ? (type.values ?? []) : undefined,
          fields: nextType ? undefined : type.fields,
        }
      }

      if (columnId === 'length') {
        return isDbDefinitionLengthEditable(type.type ?? '') ? { ...type, length: parseLength(value) } : type
      }

      if (columnId === 'options') {
        if (normalizeTypeName(type.type ?? '') === 'enum') {
          return { ...type, values: parseEnumValues(value) }
        }
        return type
      }

      if (columnId === 'defaultValue') return { ...type, defaultValue: normalizeText(value) || undefined }

      return type
    })
  }

  if (row.kind === 'type-field' && row.typeId && row.fieldId) {
    return updateTypeField(document, row.typeId, row.fieldId, field => {
      const nextField = updateLengthAwareValue(field, columnId, value)
      if (columnId === 'name') return { ...nextField, name: normalizeText(value) }
      if (columnId === 'defaultValue') return { ...nextField, defaultValue: normalizeText(value) || undefined }
      if (columnId === 'nullable') return { ...nextField, nullable: Boolean(value) }
      return nextField
    })
  }

  if (row.kind === 'table' && row.tableId) {
    if (columnId !== 'name' && columnId !== 'type') return document
    if (columnId === 'type') {
      return updateTable(document, row.tableId, table => ({
        ...table,
        kind: parseTableKind(value),
      }))
    }
    return updateTable(document, row.tableId, table => ({ ...table, name: normalizeText(value) }))
  }

  if (row.kind === 'table-column' && row.tableId && row.columnId) {
    return updateColumn(document, row.tableId, row.columnId, column => {
      const nextColumn = updateLengthAwareValue(column, columnId, value)
      if (columnId === 'name') return { ...nextColumn, name: normalizeText(value) }
      if (columnId === 'defaultValue') return { ...nextColumn, defaultValue: normalizeText(value) || undefined }
      if (columnId === 'nullable') return { ...nextColumn, nullable: Boolean(value) }
      return nextColumn
    })
  }

  return document
}

export function addDbDomainDefinitionRow(document: DbDiagramDocument): DbDiagramDocument {
  const domainId = nextObjectId(
    (document.domains ?? []).map(domain => domain.id),
    'domain',
  )
  return {
    ...document,
    domains: [...(document.domains ?? []), { id: domainId, name: domainId, type: 'text' }],
  }
}

export function addDbTypeDefinitionRow(document: DbDiagramDocument): DbDiagramDocument {
  const typeId = nextObjectId(
    (document.types ?? []).map(type => type.id),
    'type',
  )
  return {
    ...document,
    types: [
      ...(document.types ?? []),
      {
        id: typeId,
        name: typeId,
        type: 'varchar',
      },
    ],
  }
}

export function addDbTypeFieldDefinitionRow(document: DbDiagramDocument, typeId: DbDiagramId): DbDiagramDocument {
  return updateType(document, typeId, type => {
    const fields = getTypeFields(type)
    const fieldId = nextObjectId(
      fields.map(field => field.id),
      'field',
    )
    return {
      ...type,
      type: undefined,
      length: undefined,
      defaultValue: undefined,
      values: undefined,
      fields: [...fields, { id: fieldId, name: fieldId, type: 'text', nullable: true }],
    }
  })
}

export function addDbTableDefinitionTable(document: DbDiagramDocument): DbDiagramDocument {
  const tableId = nextObjectId(
    document.tables.map(table => table.id),
    'table',
  )
  return {
    ...document,
    tables: [
      ...document.tables,
      {
        id: tableId,
        name: tableId,
        columns: [{ id: 'id', name: 'id', type: 'text', primaryKey: true, nullable: false }],
      },
    ],
  }
}

export function addDbTableDefinitionColumn(document: DbDiagramDocument, tableId: DbDiagramId): DbDiagramDocument {
  return updateTable(document, tableId, table => {
    const columnId = nextObjectId(
      table.columns.map(column => column.id),
      'column',
    )
    return {
      ...table,
      columns: [...table.columns, { id: columnId, name: columnId, type: 'text', nullable: true }],
    }
  })
}

export function addDbTableDefinitionSectionItem(
  document: DbDiagramDocument,
  tableId: DbDiagramId,
  section: DbTableDefinitionSectionKind,
): DbDiagramDocument {
  return section === 'columns' ? addDbTableDefinitionColumn(document, tableId) : document
}

export function addDbTableDefinitionChildRow(
  document: DbDiagramDocument,
  row: DbTableDefinitionRow,
): DbDiagramDocument {
  if (row.kind === 'type' && row.typeId) return addDbTypeFieldDefinitionRow(document, row.typeId)
  if (row.kind === 'table' && row.tableId) return addDbTableDefinitionColumn(document, row.tableId)
  return document
}

export function duplicateDbTableDefinitionRow(
  document: DbDiagramDocument,
  row: DbTableDefinitionRow,
): DbDiagramDocument {
  if (row.kind === 'domain' && row.domainId) {
    const source = document.domains?.find(domain => domain.id === row.domainId)
    if (!source) return document
    const copy: DbDiagramDomain = {
      ...source,
      id: nextCopyId(
        (document.domains ?? []).map(domain => domain.id),
        source.id,
      ),
      name: nextCopyName(
        (document.domains ?? []).map(domain => domain.name),
        source.name,
      ),
      checks: source.checks?.map(check => ({ ...check })),
    }
    return {
      ...document,
      domains: insertAfterId(document.domains ?? [], source.id, copy),
    }
  }

  if (row.kind === 'type' && row.typeId) {
    const source = document.types?.find(type => type.id === row.typeId)
    if (!source) return document
    const copy: DbDiagramType = {
      ...source,
      id: nextCopyId(
        (document.types ?? []).map(type => type.id),
        source.id,
      ),
      name: nextCopyName(
        (document.types ?? []).map(type => type.name),
        source.name,
      ),
      values: source.values ? [...source.values] : undefined,
      fields: source.fields ? source.fields.map(field => ({ ...field })) : undefined,
    }
    return {
      ...document,
      types: insertAfterId(document.types ?? [], source.id, copy),
    }
  }

  if (row.kind === 'type-field' && row.typeId && row.fieldId) {
    return updateType(document, row.typeId, type => {
      const fields = getTypeFields(type)
      const source = fields.find(field => field.id === row.fieldId)
      if (!source) return type
      const copy: DbDiagramTypeField = {
        ...source,
        id: nextCopyId(
          fields.map(field => field.id),
          source.id,
        ),
        name: nextCopyName(
          fields.map(field => field.name),
          source.name,
        ),
      }
      return { ...type, fields: insertAfterId(fields, source.id, copy) }
    })
  }

  if (row.kind === 'table' && row.tableId) {
    const source = document.tables.find(table => table.id === row.tableId)
    if (!source) return document
    const copy: DbDiagramTable = {
      ...source,
      id: nextCopyId(
        document.tables.map(table => table.id),
        source.id,
      ),
      name: nextCopyName(
        document.tables.map(table => table.name),
        source.name,
      ),
      columns: source.columns.map(column => ({
        ...column,
        references: column.references ? { ...column.references } : undefined,
      })),
      indexes: source.indexes?.map(index => ({ ...index, columnIds: [...index.columnIds] })),
      checks: source.checks?.map(check => ({ ...check })),
      uniqueConstraints: source.uniqueConstraints?.map(constraint => ({
        ...constraint,
        columnIds: [...constraint.columnIds],
      })),
    }
    return {
      ...document,
      tables: insertAfterId(document.tables, source.id, copy),
    }
  }

  if (row.kind === 'table-column' && row.tableId && row.columnId) {
    return updateTable(document, row.tableId, table => {
      const source = table.columns.find(column => column.id === row.columnId)
      if (!source) return table
      const copy: DbDiagramColumn = {
        ...source,
        id: nextCopyId(
          table.columns.map(column => column.id),
          source.id,
        ),
        name: nextCopyName(
          table.columns.map(column => column.name),
          source.name,
        ),
        references: source.references ? { ...source.references } : undefined,
      }
      return { ...table, columns: insertAfterId(table.columns, source.id, copy) }
    })
  }

  return document
}

export function indentDbTableDefinitionRow(document: DbDiagramDocument, row: DbTableDefinitionRow): DbDiagramDocument {
  if (row.kind === 'type-field' && row.typeId && row.fieldId) {
    const types = document.types ?? []
    const sourceType = types.find(type => type.id === row.typeId)
    const sourceFields = sourceType ? getTypeFields(sourceType) : []
    const sourceFieldIndex = sourceFields.findIndex(field => field.id === row.fieldId)
    if (!sourceType || sourceFieldIndex <= 0) return document

    const sourceField = sourceFields[sourceFieldIndex]
    const targetField = sourceFields[sourceFieldIndex - 1]
    if (!sourceField || !targetField) return document

    const existingTargetType = resolveNestedTypeForField(sourceType.id, targetField, createTypeLookup(types))
    if (existingTargetType?.id === sourceType.id) return document

    const nestedType: DbDiagramType =
      existingTargetType ??
      ({
        id: nextAvailableId(
          types.map(type => type.id),
          targetField.id,
        ),
        name: nextAvailableName(
          types.map(type => type.name),
          targetField.name,
        ),
        schemaId: sourceType.schemaId,
        description: targetField.description,
        metadata: {
          ...(targetField.metadata ?? {}),
          [nestedTypeMetadataKey]: true,
          [nestedTypeOwnerTypeIdMetadataKey]: sourceType.id,
          [nestedTypeOwnerFieldIdMetadataKey]: targetField.id,
        },
        fields: [],
      } satisfies DbDiagramType)

    const movedField = existingTargetType
      ? {
          ...sourceField,
          id: nextAvailableId(
            getTypeFields(existingTargetType).map(field => field.id),
            sourceField.id,
          ),
          name: nextAvailableName(
            getTypeFields(existingTargetType).map(field => field.name),
            sourceField.name,
          ),
        }
      : sourceField

    const nextTypes = types.map(type => {
      if (type.id === sourceType.id) {
        return {
          ...type,
          fields: getTypeFields(type).flatMap(field => {
            if (field.id === sourceField.id) return []
            if (!existingTargetType && field.id === targetField.id) {
              return [{ ...field, type: nestedType.name, length: undefined }]
            }
            return [field]
          }),
        }
      }

      if (type.id === nestedType.id) {
        return { ...type, fields: [...getTypeFields(type), movedField] }
      }

      return type
    })

    return {
      ...document,
      types: existingTargetType ? nextTypes : [...nextTypes, { ...nestedType, fields: [movedField] }],
    }
  }

  if (row.kind !== 'type' || !row.typeId) return document

  const types = document.types ?? []
  const sourceIndex = types.findIndex(type => type.id === row.typeId)
  if (sourceIndex <= 0) return document

  const sourceType = types[sourceIndex]
  const targetType = types[sourceIndex - 1]
  if (!sourceType || !targetType) return document

  const field: DbDiagramTypeField = {
    id: nextAvailableId(
      getTypeFields(targetType).map(existingField => existingField.id),
      sourceType.id,
    ),
    name: nextAvailableName(
      getTypeFields(targetType).map(existingField => existingField.name),
      sourceType.name,
    ),
    type: sourceType.name,
    nullable: true,
  }

  return {
    ...document,
    types: types.map(type => {
      if (type.id === targetType.id) {
        return { ...type, fields: [...getTypeFields(type), field] }
      }

      if (type.id === sourceType.id) {
        return {
          ...type,
          metadata: {
            ...(type.metadata ?? {}),
            [nestedTypeMetadataKey]: true,
            [nestedTypeOwnerTypeIdMetadataKey]: targetType.id,
            [nestedTypeOwnerFieldIdMetadataKey]: field.id,
          },
        }
      }

      return type
    }),
  }
}

export function outdentDbTableDefinitionRow(document: DbDiagramDocument, row: DbTableDefinitionRow): DbDiagramDocument {
  if (row.kind !== 'type-field' || !row.typeId || !row.fieldId) return document

  const types = document.types ?? []
  const sourceType = types.find(type => type.id === row.typeId)
  const sourceField = sourceType ? getTypeFields(sourceType).find(field => field.id === row.fieldId) : undefined
  if (!sourceType || !sourceField) return document

  const owner = isDbDefinitionNestedType(sourceType) ? getNestedEditorTypeOwner(sourceType) : undefined
  if (owner) {
    const ownerType = types.find(type => type.id === owner.ownerTypeId)
    const ownerFields = ownerType ? getTypeFields(ownerType) : []
    const ownerFieldIndex = ownerFields.findIndex(field => field.id === owner.ownerFieldId)
    if (!ownerType || ownerFieldIndex < 0) return document

    const movedField = {
      ...sourceField,
      id: nextAvailableId(
        ownerFields.map(field => field.id),
        sourceField.id,
      ),
      name: nextAvailableName(
        ownerFields.map(field => field.name),
        sourceField.name,
      ),
    }
    const sourceTypeFields = getTypeFields(sourceType).filter(field => field.id !== sourceField.id)

    return {
      ...document,
      types: types.flatMap(type => {
        if (type.id === ownerType.id) {
          return [
            {
              ...type,
              fields: [
                ...getTypeFields(type).slice(0, ownerFieldIndex + 1),
                movedField,
                ...getTypeFields(type).slice(ownerFieldIndex + 1),
              ],
            },
          ]
        }

        if (type.id === sourceType.id) {
          return sourceTypeFields.length > 0 ? [{ ...type, fields: sourceTypeFields }] : []
        }

        return [type]
      }),
    }
  }

  const newType: DbDiagramType = {
    id: nextAvailableId(
      types.map(type => type.id),
      sourceField.id,
    ),
    name: nextAvailableName(
      types.map(type => type.name),
      sourceField.name,
    ),
    schemaId: sourceType.schemaId,
    type: sourceField.type,
    length: sourceField.length,
    defaultValue: sourceField.defaultValue,
    description: sourceField.description,
    metadata: sourceField.metadata ? { ...sourceField.metadata } : undefined,
  }

  const nextDocument = updateType(document, sourceType.id, type => ({
    ...type,
    fields: getTypeFields(type).filter(field => field.id !== sourceField.id),
  }))

  return {
    ...nextDocument,
    types: insertAfterId(nextDocument.types ?? [], sourceType.id, newType),
  }
}

export function moveDbTableDefinitionRow(
  document: DbDiagramDocument,
  row: DbTableDefinitionRow,
  direction: DbTableDefinitionMoveDirection,
): DbDiagramDocument {
  if (row.kind === 'domain' && row.domainId) {
    return {
      ...document,
      domains: moveById(document.domains ?? [], row.domainId, direction),
    }
  }

  if (row.kind === 'type' && row.typeId) {
    return {
      ...document,
      types: moveById(document.types ?? [], row.typeId, direction),
    }
  }

  if (row.kind === 'type-field' && row.typeId && row.fieldId) {
    const fieldId = row.fieldId
    return updateType(document, row.typeId, type => ({
      ...type,
      fields: moveById(getTypeFields(type), fieldId, direction),
    }))
  }

  if (row.kind === 'table' && row.tableId) {
    return {
      ...document,
      tables: moveById(document.tables, row.tableId, direction),
    }
  }

  if (row.kind === 'table-column' && row.tableId && row.columnId) {
    const columnId = row.columnId
    return updateTable(document, row.tableId, table => ({
      ...table,
      columns: moveById(table.columns, columnId, direction),
    }))
  }

  return document
}

export function removeDbTableDefinitionRow(document: DbDiagramDocument, row: DbTableDefinitionRow): DbDiagramDocument {
  if (row.kind === 'domain' && row.domainId) {
    return { ...document, domains: (document.domains ?? []).filter(domain => domain.id !== row.domainId) }
  }

  if (row.kind === 'type' && row.typeId) {
    return { ...document, types: (document.types ?? []).filter(type => type.id !== row.typeId) }
  }

  if (row.kind === 'type-field' && row.typeId && row.fieldId) {
    return updateType(document, row.typeId, type => ({
      ...type,
      fields: getTypeFields(type).filter(field => field.id !== row.fieldId),
    }))
  }

  if (row.kind === 'table' && row.tableId) {
    return {
      ...document,
      tables: document.tables.filter(table => table.id !== row.tableId),
      relationships: (document.relationships ?? []).filter(
        relationship => relationship.sourceTableId !== row.tableId && relationship.targetTableId !== row.tableId,
      ),
    }
  }

  if (row.kind === 'table-column' && row.tableId && row.columnId) {
    const columnId = row.columnId
    return updateTable(
      {
        ...document,
        relationships: (document.relationships ?? []).filter(
          relationship =>
            !(
              (relationship.sourceTableId === row.tableId && relationship.sourceColumnIds.includes(columnId)) ||
              (relationship.targetTableId === row.tableId && relationship.targetColumnIds.includes(columnId))
            ),
        ),
      },
      row.tableId,
      table => ({
        ...table,
        columns: table.columns.filter(column => column.id !== columnId),
        indexes: table.indexes?.map(index => ({
          ...index,
          columnIds: index.columnIds.filter(indexColumnId => indexColumnId !== columnId),
        })),
        uniqueConstraints: table.uniqueConstraints?.map(constraint => ({
          ...constraint,
          columnIds: constraint.columnIds.filter(uniqueColumnId => uniqueColumnId !== columnId),
        })),
      }),
    )
  }

  return document
}

export function filterDbTableDefinitionRows(rows: DbTableDefinitionRow[], query: string): DbTableDefinitionRow[] {
  const normalizedQuery = query.trim().toLowerCase()
  if (!normalizedQuery) return rows

  return rows.flatMap(row => {
    const subRows = row.subRows ? filterDbTableDefinitionRows(row.subRows, normalizedQuery) : undefined
    const values = Object.values(row.values).join(' ').toLowerCase()
    const matches = values.includes(normalizedQuery)
    if (!matches && (!subRows || subRows.length === 0)) return []
    return [{ ...row, subRows }]
  })
}
