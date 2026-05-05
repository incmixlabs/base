import { describe, expect, it } from 'vitest'
import { sampleDbSchemaDiagramDocument } from './sample-data'
import {
  addDbTableDefinitionChildRow,
  addDbDomainDefinitionRow,
  addDbTableDefinitionColumn,
  addDbTableDefinitionTable,
  addDbTypeDefinitionRow,
  addDbTypeFieldDefinitionRow,
  createDbDomainDefinitionRows,
  createDbTableDefinitionRows,
  createDbTypeDefinitionRows,
  duplicateDbTableDefinitionRow,
  indentDbTableDefinitionRow,
  isDbDefinitionLengthEditable,
  moveDbTableDefinitionRow,
  outdentDbTableDefinitionRow,
  removeDbTableDefinitionRow,
  updateDbTableDefinitionValue,
} from './table-definition-editor-model'
import type { DbDiagramDocument } from './types'

function createDocument(): DbDiagramDocument {
  return {
    ...sampleDbSchemaDiagramDocument,
    domains: sampleDbSchemaDiagramDocument.domains?.map(domain => ({
      ...domain,
      checks: domain.checks?.map(check => ({ ...check })),
    })),
    types: sampleDbSchemaDiagramDocument.types?.map(type => ({
      ...type,
      values: type.values ? [...type.values] : undefined,
      fields: type.fields?.map(field => ({ ...field })),
    })),
    tables: sampleDbSchemaDiagramDocument.tables.map(table => ({
      ...table,
      columns: table.columns.map(column => ({
        ...column,
        references: column.references ? { ...column.references } : undefined,
      })),
    })),
  }
}

describe('db table definition editor model', () => {
  it('builds domain, type, and table definition rows', () => {
    const document = createDocument()
    const domainRows = createDbDomainDefinitionRows(document)
    const typeRows = createDbTypeDefinitionRows(document)
    const tableRows = createDbTableDefinitionRows(document)

    expect(domainRows.map(row => row.values.name)).toContain('email_address')
    expect(typeRows[0]?.values.name).toBe('shipping_address')
    expect(typeRows[0]?.subRows?.map(row => row.values.name)).toEqual(['line_1', 'city', 'postal_code', 'country_code'])
    expect(tableRows.find(row => row.values.name === 'users')?.subRows?.map(row => row.values.name)).toEqual([
      'id',
      'email',
      'created_at',
    ])
  })

  it('updates domain, type field, and table column values', () => {
    const document = createDocument()
    const [domainRow] = createDbDomainDefinitionRows(document)
    const [typeRow] = createDbTypeDefinitionRows(document)
    const typeFieldRow = typeRow?.subRows?.find(row => row.values.name === 'line_1')
    const [tableRow] = createDbTableDefinitionRows(document, 'users')
    const emailColumnRow = tableRow?.subRows?.find(row => row.values.name === 'email')

    expect(domainRow).toBeDefined()
    expect(typeFieldRow).toBeDefined()
    expect(emailColumnRow).toBeDefined()

    const renamedDomain = updateDbTableDefinitionValue(document, domainRow!, 'name', 'email_text')
    const resizedField = updateDbTableDefinitionValue(renamedDomain, typeFieldRow!, 'length', 200)
    const nullableColumn = updateDbTableDefinitionValue(resizedField, emailColumnRow!, 'nullable', true)

    expect(nullableColumn.domains?.[0]?.name).toBe('email_text')
    expect(nullableColumn.types?.[0]?.fields?.find(field => field.id === 'line_1')?.length).toBe(200)
    expect(
      nullableColumn.tables.find(table => table.id === 'users')?.columns.find(column => column.id === 'email'),
    ).toMatchObject({
      nullable: true,
    })
  })

  it('adds domains, types, tables, and nested rows', () => {
    const document = createDocument()
    const withDomain = addDbDomainDefinitionRow(document)
    const withType = addDbTypeDefinitionRow(withDomain)
    const addedType = withType.types?.at(-1)
    const withTypeField = addedType ? addDbTypeFieldDefinitionRow(withType, addedType.id) : withType
    const withTable = addDbTableDefinitionTable(withTypeField)
    const addedTable = withTable.tables.at(-1)
    const withColumn = addedTable ? addDbTableDefinitionColumn(withTable, addedTable.id) : withTable

    expect(withDomain.domains).toHaveLength((document.domains ?? []).length + 1)
    expect(withType.types).toHaveLength((document.types ?? []).length + 1)
    expect(addedType).toMatchObject({ type: 'varchar' })
    expect(addedType?.fields).toBeUndefined()
    expect(withTypeField.types?.at(-1)?.fields).toHaveLength(1)
    expect(withTable.tables).toHaveLength(document.tables.length + 1)
    expect(withColumn.tables.at(-1)?.columns).toHaveLength(2)
  })

  it('supports scalar and enum types without child fields', () => {
    const document: DbDiagramDocument = {
      ...createDocument(),
      types: [
        ...(createDocument().types ?? []),
        { id: 'address-line-1', name: 'addressline1', type: 'varchar', length: 30 },
        { id: 'drink-options', name: 'drink_options', type: 'enum', values: ['coffee', 'tea', 'juice'] },
      ],
    }

    const rows = createDbTypeDefinitionRows(document)
    const scalarRow = rows.find(row => row.typeId === 'address-line-1')
    const enumRow = rows.find(row => row.typeId === 'drink-options')

    expect(scalarRow).toMatchObject({
      values: { name: 'addressline1', type: 'varchar', length: '30' },
      subRows: undefined,
    })
    expect(enumRow).toMatchObject({
      values: { name: 'drink_options', type: 'enum', options: "'coffee', 'tea', 'juice'", defaultValue: '' },
      subRows: undefined,
    })

    const resized = updateDbTableDefinitionValue(document, scalarRow!, 'length', 40)
    expect(resized.types?.find(type => type.id === 'address-line-1')).toMatchObject({ length: 40 })

    const updatedEnum = updateDbTableDefinitionValue(document, enumRow!, 'options', "'water', 'soda'")
    expect(updatedEnum.types?.find(type => type.id === 'drink-options')?.values).toEqual(['water', 'soda'])

    const updatedDefault = updateDbTableDefinitionValue(updatedEnum, enumRow!, 'defaultValue', "'coffee'")
    expect(updatedDefault.types?.find(type => type.id === 'drink-options')?.defaultValue).toBe("'coffee'")

    const compositeTypeRow = rows.find(row => row.typeId === 'shipping-address')
    expect(compositeTypeRow?.subRows).toHaveLength(4)

    const convertedScalar = updateDbTableDefinitionValue(document, compositeTypeRow!, 'type', 'jsonb')
    expect(convertedScalar.types?.find(type => type.id === 'shipping-address')).toMatchObject({
      type: 'jsonb',
      fields: undefined,
    })
    expect(
      createDbTypeDefinitionRows(convertedScalar).find(row => row.typeId === 'shipping-address')?.subRows,
    ).toBeUndefined()
  })

  it('adds children, duplicates, and removes rows from definition row actions', () => {
    const document = createDocument()
    const [typeRow] = createDbTypeDefinitionRows(document)
    const [tableRow] = createDbTableDefinitionRows(document, 'users')

    expect(typeRow).toBeDefined()
    expect(tableRow).toBeDefined()

    const withTypeChild = addDbTableDefinitionChildRow(document, typeRow!)
    expect(withTypeChild.types?.[0]?.fields).toHaveLength((document.types?.[0]?.fields?.length ?? 0) + 1)

    const emailColumnRow = tableRow?.subRows?.find(row => row.values.name === 'email')
    expect(emailColumnRow).toBeDefined()

    const withDuplicateColumn = duplicateDbTableDefinitionRow(withTypeChild, emailColumnRow!)
    expect(withDuplicateColumn.tables.find(table => table.id === 'users')?.columns.map(column => column.name)).toEqual([
      'id',
      'email',
      'email_copy',
      'created_at',
    ])

    const withoutOriginalColumn = removeDbTableDefinitionRow(withDuplicateColumn, emailColumnRow!)
    expect(
      withoutOriginalColumn.tables.find(table => table.id === 'users')?.columns.map(column => column.name),
    ).toEqual(['id', 'email_copy', 'created_at'])
  })

  it('moves type rows and fields through indent and outdent actions', () => {
    const document = createDocument()
    const billingType = {
      id: 'billing-address',
      schemaId: 'public',
      name: 'billing_address',
      fields: [{ id: 'line_1', name: 'line_1', type: 'varchar', length: 120, nullable: false }],
    }
    const withTwoTypes: DbDiagramDocument = {
      ...document,
      types: [...(document.types ?? []), billingType],
    }
    const billingTypeRow = createDbTypeDefinitionRows(withTwoTypes).find(row => row.typeId === billingType.id)

    expect(billingTypeRow).toBeDefined()

    const indented = indentDbTableDefinitionRow(withTwoTypes, billingTypeRow!)

    expect(indented.types?.find(type => type.id === 'shipping-address')?.fields?.at(-1)).toMatchObject({
      id: 'billing-address',
      name: 'billing_address',
      type: 'billing_address',
      nullable: true,
    })
    expect(indented.types?.find(type => type.id === 'billing-address')?.metadata).toMatchObject({
      dbDefinitionEditorNestedType: true,
    })
    expect(createDbTypeDefinitionRows(indented).map(row => row.typeId)).not.toContain('billing-address')
    expect(
      createDbTypeDefinitionRows(indented)
        .find(row => row.typeId === 'shipping-address')
        ?.subRows?.find(row => row.fieldId === 'billing-address')
        ?.subRows?.map(row => row.fieldId),
    ).toEqual(['line_1'])

    const lineOneRow = createDbTypeDefinitionRows(withTwoTypes)[0]?.subRows?.find(row => row.fieldId === 'line_1')
    expect(lineOneRow).toBeDefined()

    const outdented = outdentDbTableDefinitionRow(withTwoTypes, lineOneRow!)

    expect(outdented.types?.find(type => type.id === 'shipping-address')?.fields?.map(field => field.id)).not.toContain(
      'line_1',
    )
    expect(outdented.types?.find(type => type.id === 'line_1')).toMatchObject({
      name: 'line_1',
      schemaId: 'public',
      type: 'varchar',
      length: 160,
    })

    const postalCodeRow = createDbTypeDefinitionRows(document)[0]?.subRows?.find(row => row.fieldId === 'postal_code')
    expect(postalCodeRow).toBeDefined()

    const withIndentedField = indentDbTableDefinitionRow(document, postalCodeRow!)
    const shippingAddress = withIndentedField.types?.find(type => type.id === 'shipping-address')
    const cityType = withIndentedField.types?.find(type => type.name === 'city')

    expect(shippingAddress?.fields?.map(field => field.id)).toEqual(['line_1', 'city', 'country_code'])
    expect(shippingAddress?.fields?.find(field => field.id === 'city')).toMatchObject({
      type: 'city',
      length: undefined,
    })
    expect(cityType).toMatchObject({
      id: 'city',
      schemaId: 'public',
      fields: [{ id: 'postal_code', name: 'postal_code', type: 'varchar', length: 24, nullable: false }],
    })

    const [shippingAddressRow] = createDbTypeDefinitionRows(withIndentedField)
    const cityRow = shippingAddressRow?.subRows?.find(row => row.fieldId === 'city')

    expect(cityRow?.subRows?.map(row => row.fieldId)).toEqual(['postal_code'])
    expect(createDbTypeDefinitionRows(withIndentedField).map(row => row.typeId)).not.toContain(cityType?.id)

    const nestedPostalCodeRow = cityRow?.subRows?.find(row => row.fieldId === 'postal_code')
    expect(nestedPostalCodeRow).toBeDefined()

    const withOutdentedNestedField = outdentDbTableDefinitionRow(withIndentedField, nestedPostalCodeRow!)

    expect(
      withOutdentedNestedField.types?.find(type => type.id === 'shipping-address')?.fields?.map(field => field.id),
    ).toEqual(['line_1', 'city', 'postal_code', 'country_code'])
    expect(withOutdentedNestedField.types?.map(type => type.id)).not.toContain(cityType?.id)
    expect(
      createDbTypeDefinitionRows(withOutdentedNestedField)
        .find(row => row.typeId === 'shipping-address')
        ?.subRows?.find(row => row.fieldId === 'city')?.subRows,
    ).toBeUndefined()
  })

  it('keeps type names unique and resolves generated nested types by owner field', () => {
    const document = createDocument()
    const billingType = {
      id: 'billing-address',
      schemaId: 'public',
      name: 'billing_address',
      fields: [{ id: 'line_1', name: 'line_1', type: 'varchar', length: 120, nullable: false }],
    }
    const withTwoTypes: DbDiagramDocument = {
      ...document,
      types: [...(document.types ?? []), billingType],
    }
    const billingTypeRow = createDbTypeDefinitionRows(withTwoTypes).find(row => row.typeId === billingType.id)

    expect(billingTypeRow).toBeDefined()

    const renamed = updateDbTableDefinitionValue(withTwoTypes, billingTypeRow!, 'name', 'shipping_address')

    expect(renamed.types?.find(type => type.id === billingType.id)?.name).toBe('shipping_address_2')

    const ownerResolvedDocument: DbDiagramDocument = {
      ...document,
      types: [
        {
          id: 'wrong-city',
          schemaId: 'public',
          name: 'city',
          fields: [{ id: 'wrong', name: 'wrong', type: 'text' }],
        },
        {
          id: 'right-city',
          schemaId: 'public',
          name: 'city',
          metadata: {
            dbDefinitionEditorNestedType: true,
            dbDefinitionEditorNestedOwnerTypeId: 'shipping-address',
            dbDefinitionEditorNestedOwnerFieldId: 'city',
          },
          fields: [{ id: 'postal_code', name: 'postal_code', type: 'varchar', length: 24, nullable: false }],
        },
        ...(document.types ?? []),
      ],
    }

    const shippingAddressRow = createDbTypeDefinitionRows(ownerResolvedDocument).find(
      row => row.typeId === 'shipping-address',
    )
    const cityRow = shippingAddressRow?.subRows?.find(row => row.fieldId === 'city')

    expect(cityRow?.subRows?.map(row => row.fieldId)).toEqual(['postal_code'])

    const withExistingNestedTarget: DbDiagramDocument = {
      ...document,
      types: [
        ...(document.types ?? []).map(type =>
          type.id === 'shipping-address'
            ? {
                ...type,
                fields: type.fields?.map(field => (field.id === 'city' ? { ...field, type: 'address_detail' } : field)),
              }
            : type,
        ),
        {
          id: 'address-detail',
          schemaId: 'public',
          name: 'address_detail',
          fields: [{ id: 'postal_code', name: 'postal_code', type: 'text' }],
        },
      ],
    }
    const postalCodeRow = createDbTypeDefinitionRows(withExistingNestedTarget)
      .find(row => row.typeId === 'shipping-address')
      ?.subRows?.find(row => row.fieldId === 'postal_code')

    expect(postalCodeRow).toBeDefined()

    const rekeyed = indentDbTableDefinitionRow(withExistingNestedTarget, postalCodeRow!)

    expect(rekeyed.types?.find(type => type.id === 'address-detail')?.fields?.map(field => field.id)).toEqual([
      'postal_code',
      'postal_code_2',
    ])
  })

  it('moves definition rows up and down within their owning collection', () => {
    const document = createDocument()
    const billingType = {
      id: 'billing-address',
      schemaId: 'public',
      name: 'billing_address',
      fields: [{ id: 'line_1', name: 'line_1', type: 'varchar', length: 120, nullable: false }],
    }
    const withTwoTypes: DbDiagramDocument = {
      ...document,
      types: [...(document.types ?? []), billingType],
    }
    const billingTypeRow = createDbTypeDefinitionRows(withTwoTypes).find(row => row.typeId === billingType.id)

    expect(billingTypeRow).toBeDefined()

    const withMovedType = moveDbTableDefinitionRow(withTwoTypes, billingTypeRow!, 'up')

    expect(withMovedType.types?.map(type => type.name)).toEqual(['billing_address', 'shipping_address'])

    const cityFieldRow = createDbTypeDefinitionRows(document)[0]?.subRows?.find(row => row.fieldId === 'city')

    expect(cityFieldRow).toBeDefined()

    const withMovedField = moveDbTableDefinitionRow(document, cityFieldRow!, 'up')

    expect(withMovedField.types?.find(type => type.id === 'shipping-address')?.fields?.map(field => field.id)).toEqual([
      'city',
      'line_1',
      'postal_code',
      'country_code',
    ])

    const [usersTableRow] = createDbTableDefinitionRows(document, 'users')
    const emailColumnRow = usersTableRow?.subRows?.find(row => row.columnId === 'email')

    expect(usersTableRow).toBeDefined()
    expect(emailColumnRow).toBeDefined()

    const withMovedTable = moveDbTableDefinitionRow(document, usersTableRow!, 'down')

    expect(withMovedTable.tables.map(table => table.id)).toEqual(['orders', 'users', 'order-items'])

    const withMovedColumn = moveDbTableDefinitionRow(document, emailColumnRow!, 'up')

    expect(withMovedColumn.tables.find(table => table.id === 'users')?.columns.map(column => column.id)).toEqual([
      'email',
      'id',
      'created_at',
    ])
  })

  it('only allows length editing for length-capable types', () => {
    expect(isDbDefinitionLengthEditable('varchar')).toBe(true)
    expect(isDbDefinitionLengthEditable('integer')).toBe(false)
  })
})
