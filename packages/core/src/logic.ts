import type { SchemaProvider } from './schema-provider'
import type { ParsedField, ParsedSchema } from './types'

export function parseSchema(schemaProvider: SchemaProvider): ParsedSchema {
  const schema = schemaProvider.parseSchema()
  return {
    ...schema,
    fields: sortFieldsByOrder(schema.fields),
  }
}

export function validateSchema(schemaProvider: SchemaProvider, values: unknown) {
  return schemaProvider.validateSchema(values)
}

export function getDefaultValues(schemaProvider: SchemaProvider): Record<string, unknown> {
  return schemaProvider.getDefaultValues()
}

// Check if value is a plain object (not Date, RegExp, File, class instances, etc.)
const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === 'object' && !Array.isArray(value) && Object.getPrototypeOf(value) === Object.prototype

// Check if a value is considered empty (null, undefined, "", [], {})
const isEmptyValue = (value: unknown): boolean =>
  value === null ||
  value === undefined ||
  value === '' ||
  (Array.isArray(value) && value.length === 0) ||
  (isPlainObject(value) && Object.keys(value).length === 0)

// Recursively remove empty values from an object (null, undefined, "", [], {})
export function removeEmptyValues<T extends Record<string, unknown>>(values: T): Partial<T> {
  const result: Partial<T> = {}
  for (const key in values) {
    const value = values[key]
    if (isEmptyValue(value)) {
      continue
    }

    if (Array.isArray(value)) {
      const newArray = value.map((item: unknown) => {
        if (isPlainObject(item)) {
          return removeEmptyValues(item)
        }
        return item
      })
      result[key] = newArray.filter((item: unknown) => !isEmptyValue(item)) as any
    } else if (isPlainObject(value)) {
      result[key] = removeEmptyValues(value) as any
    } else {
      result[key] = value as any
    }
  }

  return result
}

/**
 * Sort the fields by order.
 * If no order is set, the field will be sorted based on the order in the schema.
 */
export function sortFieldsByOrder(fields: ParsedField[] | undefined): ParsedField[] {
  if (!fields) return []
  const sortedFields = fields
    .map((field): ParsedField => {
      if (field.schema) {
        return {
          ...field,
          schema: sortFieldsByOrder(field.schema),
        }
      }
      return field
    })
    .sort((a, b) => {
      const fieldA: number = a.fieldConfig?.order ?? 0
      const fieldB = b.fieldConfig?.order ?? 0
      return fieldA - fieldB
    })

  return sortedFields
}
