import type { FieldConfig, ParsedField, ParsedSchema } from '@bwalkt/core'
import type { Schema } from 'ajv'
import { AJV_FIELD_CONFIG_SYMBOL } from './field-config'

type JSONSchema = Schema & {
  properties?: Record<string, JSONSchema>
  items?: JSONSchema | JSONSchema[]
  enum?: unknown[]
  default?: unknown
  description?: string
  required?: string[]
  type?: string | string[]
  anyOf?: JSONSchema[]
  oneOf?: JSONSchema[]
  allOf?: JSONSchema[]
  format?: string
  minimum?: number
  maximum?: number
  minLength?: number
  maxLength?: number
  pattern?: string
  [AJV_FIELD_CONFIG_SYMBOL]?: unknown
}

export function parseSchema(schema: Schema): ParsedSchema {
  const jsonSchema = schema as JSONSchema

  if (jsonSchema.type !== 'object' || !jsonSchema.properties) {
    throw new Error('AjvProvider: Schema must be an object type with properties')
  }

  const fields = Object.entries(jsonSchema.properties).map(([key, fieldSchema]) =>
    parseField(key, fieldSchema, jsonSchema.required || []),
  )

  return { fields }
}

function parseField(key: string, fieldSchema: JSONSchema, requiredFields: string[]): ParsedField {
  const field: ParsedField = {
    key,
    type: getFieldType(fieldSchema),
    required: requiredFields.includes(key),
    description: fieldSchema.description,
    default: fieldSchema.default,
    fieldConfig: fieldSchema[AJV_FIELD_CONFIG_SYMBOL] as FieldConfig | undefined,
  }

  // Handle enums
  if (fieldSchema.enum) {
    field.options = fieldSchema.enum.map(value => [String(value), String(value)])
  }

  // Handle objects
  if (fieldSchema.type === 'object' && fieldSchema.properties) {
    field.schema = Object.entries(fieldSchema.properties).map(([subKey, subSchema]) =>
      parseField(subKey, subSchema as JSONSchema, fieldSchema.required || []),
    )
  }

  // Handle arrays
  if (fieldSchema.type === 'array' && fieldSchema.items) {
    const items = fieldSchema.items as JSONSchema
    if (items.type === 'object' && items.properties) {
      field.schema = Object.entries(items.properties).map(([subKey, subSchema]) =>
        parseField(subKey, subSchema as JSONSchema, items.required || []),
      )
    } else {
      // For primitive arrays, create a simple schema
      field.schema = [
        {
          key: 'value',
          type: getFieldType(items),
          required: false,
        },
      ]
    }
  }

  return field
}

function getFieldType(schema: JSONSchema): string {
  // Handle anyOf/oneOf/allOf
  if (schema.anyOf || schema.oneOf || schema.allOf) {
    const schemas = schema.anyOf || schema.oneOf || schema.allOf || []
    const types = schemas.map(s => getFieldType(s as JSONSchema))
    // Return the first non-null type
    return types.find(t => t !== 'null') || 'string'
  }

  // Handle type arrays (e.g., ["string", "null"])
  if (Array.isArray(schema.type)) {
    const nonNullType = schema.type.find(t => t !== 'null')
    return mapJsonTypeToFieldType(nonNullType || 'string', schema)
  }

  if (schema.enum) {
    return 'select'
  }

  return mapJsonTypeToFieldType(schema.type || 'string', schema)
}

function mapJsonTypeToFieldType(jsonType: string, schema: JSONSchema): string {
  switch (jsonType) {
    case 'string':
      if (schema.format === 'date' || schema.format === 'date-time') {
        return 'date'
      }
      if (schema.enum) {
        return 'select'
      }
      return 'string'
    case 'number':
    case 'integer':
      return 'number'
    case 'boolean':
      return 'boolean'
    case 'object':
      return 'object'
    case 'array':
      return 'array'
    default:
      return 'string'
  }
}
