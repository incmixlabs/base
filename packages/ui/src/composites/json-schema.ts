import type { JsonSchemaNode, JsonValue } from '@incmix/core'

export type DeriveCompositeJsonSchemaOptions = {
  $id?: string
  title?: string
  description?: string
  additionalProperties?: boolean
  includeDefaults?: boolean
}

export function deriveCompositeJsonSchema(
  sample: JsonValue,
  options: DeriveCompositeJsonSchemaOptions = {},
): JsonSchemaNode {
  const schema = deriveJsonSchemaNode(sample, options)

  return {
    ...(options.$id ? { $id: options.$id } : {}),
    ...(options.title ? { title: options.title } : {}),
    ...(options.description ? { description: options.description } : {}),
    ...schema,
  }
}

function deriveJsonSchemaNode(sample: JsonValue, options: DeriveCompositeJsonSchemaOptions): JsonSchemaNode {
  if (sample === null) return withDefault({ type: 'null' }, sample, options)

  if (Array.isArray(sample)) {
    return withDefault(
      {
        type: 'array',
        items: deriveArrayItemSchema(sample, options),
      },
      sample,
      options,
    )
  }

  switch (typeof sample) {
    case 'string':
      return withDefault({ type: 'string' }, sample, options)
    case 'number':
      return withDefault({ type: Number.isInteger(sample) ? 'integer' : 'number' }, sample, options)
    case 'boolean':
      return withDefault({ type: 'boolean' }, sample, options)
    case 'object':
      return deriveObjectSchema(sample, options)
    default:
      return {}
  }
}

function deriveObjectSchema(
  sample: Record<string, JsonValue | undefined>,
  options: DeriveCompositeJsonSchemaOptions,
): JsonSchemaNode {
  const properties: Record<string, JsonSchemaNode> = {}
  const required: string[] = []

  for (const [key, value] of Object.entries(sample)) {
    if (value === undefined) continue
    properties[key] = deriveJsonSchemaNode(value, options)
    required.push(key)
  }

  return withDefault(
    {
      type: 'object',
      additionalProperties: options.additionalProperties ?? false,
      ...(required.length > 0 ? { required } : {}),
      ...(Object.keys(properties).length > 0 ? { properties } : {}),
    },
    sample,
    options,
  )
}

function deriveArrayItemSchema(items: JsonValue[], options: DeriveCompositeJsonSchemaOptions): JsonSchemaNode {
  if (items.length === 0) return {}

  const schemas = items.map(item => deriveJsonSchemaNode(item, options))
  const uniqueSchemas = dedupeSchemas(schemas)
  if (uniqueSchemas.length === 1) return uniqueSchemas[0] ?? {}

  return { oneOf: uniqueSchemas }
}

function dedupeSchemas(schemas: JsonSchemaNode[]): JsonSchemaNode[] {
  const seen = new Set<string>()
  const unique: JsonSchemaNode[] = []

  for (const schema of schemas) {
    const key = JSON.stringify(canonicalizeSchema(schema))
    if (seen.has(key)) continue
    seen.add(key)
    unique.push(schema)
  }

  return unique
}

function canonicalizeSchema(value: JsonValue | JsonSchemaNode, key?: string): JsonValue | JsonSchemaNode {
  if (Array.isArray(value)) {
    const items = value.map(item => canonicalizeSchema(item as JsonValue | JsonSchemaNode)) as JsonValue[]
    if (key === 'required') return [...items].sort() as JsonValue[]
    return items
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([childKey, child]) => [childKey, canonicalizeSchema(child as JsonValue | JsonSchemaNode, childKey)]),
    ) as Record<string, JsonValue>
  }

  return value
}

function withDefault(
  schema: JsonSchemaNode,
  value: JsonValue | Record<string, JsonValue | undefined>,
  options: DeriveCompositeJsonSchemaOptions,
): JsonSchemaNode {
  if (!options.includeDefaults) return schema
  return { ...schema, default: normalizeDefaultValue(value) }
}

function normalizeDefaultValue(value: JsonValue | Record<string, JsonValue | undefined>): JsonValue {
  if (value === null || typeof value !== 'object') return value

  if (Array.isArray(value)) {
    return value.map(item => normalizeDefaultValue(item)) as JsonValue
  }

  return Object.fromEntries(
    Object.entries(value)
      .filter(([, entryValue]) => entryValue !== undefined)
      .map(([key, entryValue]) => [key, normalizeDefaultValue(entryValue as JsonValue)]),
  ) as JsonValue
}
