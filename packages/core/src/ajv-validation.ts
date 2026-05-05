import Ajv, { type ErrorObject, type Schema, type ValidateFunction } from 'ajv'
import addFormats from 'ajv-formats'

export type FieldPath = string | Array<string | number>
export type FieldErrorMap = Record<string, string[]>

export type ValidationResult = {
  valid: boolean
  errors: FieldErrorMap
}

export type AjvValidatorOptions = {
  /** Reuse this instance to share compiled-validator cache across calls. */
  ajv?: Ajv
  schemaId?: string
  /**
   * Applied only when `ajv` is not provided.
   * Note: passing `ajvOptions` creates a new Ajv instance per `createAjvValidator` call.
   * If you need cache reuse with custom options, pass a shared `ajv` instance instead.
   */
  ajvOptions?: ConstructorParameters<typeof Ajv>[0]
}

let schemaKeyCache = new WeakMap<object, string>()
let compiledByAjv = new WeakMap<Ajv, Map<string, ValidateFunction>>()
let sharedDefaultAjv: Ajv | undefined
let cacheCounter = 0

export function createAjvValidator(schema: Schema, options: AjvValidatorOptions = {}) {
  let ajv = options.ajv
  if (!ajv) {
    if (options.ajvOptions) {
      ajv = createDefaultAjv(options.ajvOptions)
    } else {
      if (!sharedDefaultAjv) {
        sharedDefaultAjv = createDefaultAjv()
      }
      ajv = sharedDefaultAjv
    }
  }
  const schemaId = resolveSchemaId(schema, options.schemaId)

  const validateFn = getOrCompileValidator(ajv, schema, schemaId)

  return {
    schemaId,
    validate(values: unknown): ValidationResult {
      const valid = validateFn(values)
      if (valid) return { valid: true, errors: {} }

      return {
        valid: false,
        errors: toFieldErrorMap(validateFn.errors ?? []),
      }
    },
    validateField(path: FieldPath, values: unknown): ValidationResult {
      const base = this.validate(values)
      if (base.valid) return base

      const normalizedPath = normalizeFieldPath(path)
      const prefix = normalizedPath ? `${normalizedPath}.` : ''
      const filtered: FieldErrorMap = {}

      for (const [errorPath, messages] of Object.entries(base.errors)) {
        if (errorPath === normalizedPath || errorPath.startsWith(prefix)) {
          filtered[errorPath] = messages
        }
      }

      return {
        valid: Object.keys(filtered).length === 0,
        errors: filtered,
      }
    },
  }
}

export function clearAjvValidatorCache() {
  sharedDefaultAjv = undefined
  compiledByAjv = new WeakMap<Ajv, Map<string, ValidateFunction>>()
  schemaKeyCache = new WeakMap<object, string>()
  cacheCounter = 0
}

function createDefaultAjv(ajvOptions?: ConstructorParameters<typeof Ajv>[0]) {
  const ajv = new Ajv({
    allErrors: true,
    strict: false,
    verbose: true,
    ...ajvOptions,
  })
  addFormats(ajv)
  return ajv
}

function getOrCompileValidator(ajv: Ajv, schema: Schema, schemaId: string): ValidateFunction {
  let ajvCache = compiledByAjv.get(ajv)
  if (!ajvCache) {
    ajvCache = new Map<string, ValidateFunction>()
    compiledByAjv.set(ajv, ajvCache)
  }

  const cached = ajvCache.get(schemaId)
  if (cached) return cached

  const validate = ajv.compile(schema)
  ajvCache.set(schemaId, validate)
  return validate
}

function resolveSchemaId(schema: Schema, explicitSchemaId?: string): string {
  if (explicitSchemaId?.trim()) return explicitSchemaId

  if (typeof schema === 'boolean') {
    return schema ? 'schema:boolean:true' : 'schema:boolean:false'
  }

  const schemaId = (schema as { $id?: unknown }).$id
  if (typeof schemaId === 'string' && schemaId.trim()) return schemaId

  if (typeof schema === 'object' && schema !== null) {
    const existing = schemaKeyCache.get(schema as object)
    if (existing) return existing
    const generated = `schema:auto:${++cacheCounter}`
    schemaKeyCache.set(schema as object, generated)
    return generated
  }

  return `schema:auto:${++cacheCounter}`
}

function normalizeFieldPath(path: FieldPath): string {
  if (Array.isArray(path)) {
    return path
      .map(segment => String(segment))
      .filter(Boolean)
      .join('.')
  }
  return path
}

function toFieldErrorMap(errors: ErrorObject[]): FieldErrorMap {
  const map: FieldErrorMap = {}

  for (const error of errors) {
    const key = ajvErrorToFieldPath(error)
    const message = error.message ?? 'Validation error'
    if (!map[key]) map[key] = []
    map[key].push(message)
  }

  return map
}

function ajvErrorToFieldPath(error: ErrorObject): string {
  const basePath = normalizeInstancePath(error.instancePath)
  if (error.keyword === 'required') {
    const missing = (error.params as { missingProperty?: string }).missingProperty
    if (missing) return basePath ? `${basePath}.${missing}` : missing
  }
  return basePath || '$root'
}

function normalizeInstancePath(instancePath: string): string {
  if (!instancePath) return ''
  return instancePath.split('/').filter(Boolean).map(decodeJsonPointerSegment).join('.')
}

function decodeJsonPointerSegment(segment: string): string {
  return segment.replaceAll('~1', '/').replaceAll('~0', '~')
}
