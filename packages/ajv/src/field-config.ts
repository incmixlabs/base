import type { FieldConfig } from '@bwalkt/core'
import type { Schema } from 'ajv'

// Symbol for storing field configuration in JSON schema
export const AJV_FIELD_CONFIG_SYMBOL = Symbol('AjvFieldConfig')

type JSONSchema = Schema & {
  [AJV_FIELD_CONFIG_SYMBOL]?: FieldConfig
}

/**
 * Extends a JSON schema field with AutoForm field configuration
 *
 * @param schema - JSON schema field to extend
 * @param config - AutoForm field configuration
 * @returns Extended JSON schema with field config
 */
export function withFieldConfig<T extends Schema>(
  schema: T,
  config: FieldConfig,
): T & { [AJV_FIELD_CONFIG_SYMBOL]: FieldConfig } {
  return Object.assign({}, schema, {
    [AJV_FIELD_CONFIG_SYMBOL]: config,
  }) as T & { [AJV_FIELD_CONFIG_SYMBOL]: FieldConfig }
}

/**
 * Helper to create a JSON schema field with AutoForm configuration
 *
 * @param type - JSON schema type
 * @param config - AutoForm field configuration
 * @returns JSON schema with field config
 */
export function createField(type: string | { type: string; [key: string]: unknown }, config?: FieldConfig): JSONSchema {
  const schema: JSONSchema = typeof type === 'string' ? { type } : type

  if (config) {
    schema[AJV_FIELD_CONFIG_SYMBOL] = config
  }

  return schema
}
