import type { ParsedSchema, SchemaProvider, SchemaValidation } from '@bwalkt/core'
import type { JSONSchemaType, Schema } from 'ajv'
import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import { getDefaultValues } from './default-values'
import { parseSchema } from './schema-parser'

export class AjvProvider<T = unknown> implements SchemaProvider<T> {
  private ajv: Ajv
  private compiledSchema: any

  /**
   * Provider to use AJV JSON schemas for AutoForm
   *
   * @param schema - JSON Schema to use for validation
   * @param ajvOptions - Optional Ajv configuration options
   */
  constructor(
    private schema: JSONSchemaType<T> | Schema,
    ajvOptions: Record<string, unknown> = {},
  ) {
    if (!schema) {
      throw new Error('AjvProvider: schema is required')
    }

    this.ajv = new Ajv({
      allErrors: true,
      verbose: true,
      ...ajvOptions,
    })

    // Add format validators (email, date-time, etc.)
    addFormats(this.ajv)

    this.compiledSchema = this.ajv.compile(this.schema)

    // Bind methods to preserve 'this' context
    this.parseSchema = this.parseSchema.bind(this)
    this.validateSchema = this.validateSchema.bind(this)
    this.getDefaultValues = this.getDefaultValues.bind(this)
  }

  parseSchema(): ParsedSchema {
    return parseSchema(this.schema)
  }

  validateSchema(values: T): SchemaValidation {
    const valid = this.compiledSchema(values)

    if (valid) {
      return { success: true, data: values } as const
    }

    const errors = this.compiledSchema.errors || []
    return {
      success: false,
      errors: errors.map((error: any) => ({
        path: error.instancePath ? (error.instancePath as string).split('/').filter(Boolean) : [],
        message: error.message || 'Validation error',
      })),
    } as const
  }

  getDefaultValues(): Record<string, unknown> {
    return getDefaultValues(this.schema)
  }
}
