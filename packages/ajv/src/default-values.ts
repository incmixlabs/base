import type { Schema } from 'ajv'

type JSONSchema = Schema & {
  properties?: Record<string, JSONSchema>
  items?: JSONSchema | JSONSchema[]
  default?: unknown
  type?: string | string[]
  anyOf?: JSONSchema[]
  oneOf?: JSONSchema[]
  allOf?: JSONSchema[]
  required?: string[]
}

export function getDefaultValues(schema: Schema): Record<string, unknown> {
  const jsonSchema = schema as JSONSchema

  if (jsonSchema.type !== 'object' || !jsonSchema.properties) {
    return {}
  }

  const defaults: Record<string, unknown> = {}

  for (const [key, fieldSchema] of Object.entries(jsonSchema.properties)) {
    const fieldDefault = getFieldDefault(fieldSchema)
    if (fieldDefault !== undefined) {
      defaults[key] = fieldDefault
    }
  }

  return defaults
}

function getFieldDefault(schema: JSONSchema): unknown {
  // If explicit default is provided, use it
  if (schema.default !== undefined) {
    return schema.default
  }

  // Handle anyOf/oneOf/allOf
  if (schema.anyOf || schema.oneOf || schema.allOf) {
    const schemas = schema.anyOf || schema.oneOf || schema.allOf || []
    for (const subSchema of schemas) {
      const defaultValue = getFieldDefault(subSchema as JSONSchema)
      if (defaultValue !== undefined) {
        return defaultValue
      }
    }
  }

  // Handle type arrays (e.g., ["string", "null"])
  const type = Array.isArray(schema.type) ? schema.type.find(t => t !== 'null') : schema.type

  // Return type-specific defaults
  switch (type) {
    case 'object':
      if (schema.properties) {
        const objectDefaults: Record<string, unknown> = {}
        for (const [key, subSchema] of Object.entries(schema.properties)) {
          const subDefault = getFieldDefault(subSchema)
          if (subDefault !== undefined) {
            objectDefaults[key] = subDefault
          }
        }
        return Object.keys(objectDefaults).length > 0 ? objectDefaults : undefined
      }
      return undefined

    case 'array':
      // Return empty array as default for arrays
      return []

    case 'string':
      return ''

    case 'number':
    case 'integer':
      return 0

    case 'boolean':
      return false

    default:
      return undefined
  }
}
