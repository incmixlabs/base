export function isJsonObject<T extends Record<string, unknown> = Record<string, unknown>>(value: unknown): value is T {
  return value != null && typeof value === 'object' && !Array.isArray(value)
}

export type JsonPrimitiveValue = string | number | boolean | null
export type JsonObjectValue = { [key: string]: JsonValue }
export type JsonArrayValue = JsonValue[]
export type JsonValue = JsonPrimitiveValue | JsonObjectValue | JsonArrayValue
export type StructuredJsonValue = JsonObjectValue | JsonArrayValue

export function parseStructuredJsonValue(value: string): StructuredJsonValue | undefined {
  try {
    const parsedValue = JSON.parse(value) as JsonValue
    return parsedValue !== null && typeof parsedValue === 'object' ? parsedValue : undefined
  } catch {
    return undefined
  }
}
