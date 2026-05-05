import Ajv from 'ajv'
import { describe, expect, it, vi } from 'vitest'
import { clearAjvValidatorCache, createAjvValidator, type FieldErrorMap } from './ajv-validation'

describe('createAjvValidator', () => {
  it('validates values and maps errors by stable field paths', () => {
    const validator = createAjvValidator({
      $id: 'schema:account',
      type: 'object',
      required: ['email'],
      properties: {
        email: { type: 'string', format: 'email' },
        profile: {
          type: 'object',
          required: ['age'],
          properties: {
            age: { type: 'number', minimum: 18 },
          },
        },
      },
    })

    const result = validator.validate({
      email: 'invalid-email',
      profile: { age: 16 },
    })

    expect(result.valid).toBe(false)
    expect(result.errors.email).toBeTruthy()
    expect(result.errors['profile.age']).toBeTruthy()
  })

  it('supports field-level validation filtering', () => {
    const validator = createAjvValidator({
      type: 'object',
      required: ['email', 'name'],
      properties: {
        email: { type: 'string', format: 'email' },
        name: { type: 'string', minLength: 2 },
      },
    })

    const values = { email: 'bad', name: '' }
    const emailOnly = validator.validateField('email', values)
    const nameOnly = validator.validateField(['name'], values)

    expect(emailOnly.valid).toBe(false)
    expect(emailOnly.errors.email).toBeTruthy()
    expect(emailOnly.errors.name).toBeUndefined()

    expect(nameOnly.valid).toBe(false)
    expect(nameOnly.errors.name).toBeTruthy()
    expect(nameOnly.errors.email).toBeUndefined()
  })

  it('caches compiled validators by schema id', () => {
    clearAjvValidatorCache()
    const ajv = new Ajv({ allErrors: true, strict: false })
    const compileSpy = vi.spyOn(ajv, 'compile')

    const schema = {
      type: 'object',
      properties: { name: { type: 'string' } },
    } as const

    const first = createAjvValidator(schema, { ajv, schemaId: 'schema:cached' })
    const second = createAjvValidator(schema, { ajv, schemaId: 'schema:cached' })

    first.validate({ name: 'ok' })
    second.validate({ name: 'ok' })

    expect(compileSpy).toHaveBeenCalledTimes(1)
  })

  it('does not share compiled validators across different Ajv instances', () => {
    clearAjvValidatorCache()
    const ajvA = new Ajv({ allErrors: true, strict: false })
    const ajvB = new Ajv({ allErrors: true, strict: false })
    const compileSpyA = vi.spyOn(ajvA, 'compile')
    const compileSpyB = vi.spyOn(ajvB, 'compile')

    const schema = {
      type: 'object',
      properties: { name: { type: 'string' } },
    } as const

    createAjvValidator(schema, { ajv: ajvA, schemaId: 'schema:shared-id' })
    createAjvValidator(schema, { ajv: ajvB, schemaId: 'schema:shared-id' })

    expect(compileSpyA).toHaveBeenCalledTimes(1)
    expect(compileSpyB).toHaveBeenCalledTimes(1)
  })

  it('uses deterministic schema ids for boolean schemas', () => {
    const validatorTrueA = createAjvValidator(true)
    const validatorTrueB = createAjvValidator(true)
    const validatorFalse = createAjvValidator(false)

    expect(validatorTrueA.schemaId).toBe('schema:boolean:true')
    expect(validatorTrueB.schemaId).toBe('schema:boolean:true')
    expect(validatorFalse.schemaId).toBe('schema:boolean:false')
  })

  it('reuses shared default Ajv for default-path cache hits', () => {
    clearAjvValidatorCache()
    const compileSpy = vi.spyOn(Ajv.prototype, 'compile')

    const schema = {
      $id: 'schema:default-ajv-cache',
      type: 'object',
      properties: { age: { type: 'number' } },
    } as const

    createAjvValidator(schema)
    createAjvValidator(schema)

    expect(compileSpy).toHaveBeenCalledTimes(1)
    compileSpy.mockRestore()
  })

  it('returns root-level errors under $root', () => {
    const validator = createAjvValidator({
      type: 'string',
      minLength: 5,
    })

    const result = validator.validate('abc')

    expect(result.valid).toBe(false)
    expect(getFirstMessage(result.errors, '$root')).toBeTruthy()
  })

  it('validates runtime-generated conditional schemas with shared defs', () => {
    const validator = createAjvValidator({
      $id: 'schema:dynamic-signup-validation',
      type: 'object',
      required: ['accountType', 'profile'],
      $defs: {
        profile: {
          type: 'object',
          required: ['email'],
          properties: {
            email: { type: 'string', format: 'email' },
          },
        },
      },
      properties: {
        accountType: {
          type: 'string',
          enum: ['individual', 'business'],
        },
        profile: { $ref: '#/$defs/profile' },
        companyName: { type: 'string', minLength: 2 },
      },
      if: {
        properties: {
          accountType: { const: 'business' },
        },
      },
      // biome-ignore lint/suspicious/noThenProperty: JSON Schema uses `then` for conditional branches.
      then: {
        required: ['companyName'],
      },
    })

    const individualResult = validator.validate({
      accountType: 'individual',
      profile: { email: 'person@example.com' },
    })
    const invalidBusinessResult = validator.validate({
      accountType: 'business',
      profile: { email: 'not-an-email' },
    })
    const validBusinessResult = validator.validate({
      accountType: 'business',
      companyName: 'Boardwalk',
      profile: { email: 'ops@boardwalk.test' },
    })

    expect(individualResult.valid).toBe(true)
    expect(validBusinessResult.valid).toBe(true)

    expect(invalidBusinessResult.valid).toBe(false)
    expect(invalidBusinessResult.errors.companyName).toBeTruthy()
    expect(invalidBusinessResult.errors['profile.email']).toBeTruthy()
  })
})

function getFirstMessage(errors: FieldErrorMap, key: string): string | undefined {
  return errors[key]?.[0]
}
