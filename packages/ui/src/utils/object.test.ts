import { describe, expect, it } from 'vitest'
import { isJsonObject, parseStructuredJsonValue } from './object'

describe('isJsonObject', () => {
  it('accepts non-null objects and rejects arrays/null/primitives', () => {
    expect(isJsonObject({})).toBe(true)
    expect(isJsonObject({ id: 'site' })).toBe(true)
    expect(isJsonObject([])).toBe(false)
    expect(isJsonObject(null)).toBe(false)
    expect(isJsonObject('object')).toBe(false)
    expect(isJsonObject(1)).toBe(false)
  })
})

describe('parseStructuredJsonValue', () => {
  it('returns JSON objects and arrays', () => {
    expect(parseStructuredJsonValue('{"enabled":true}')).toEqual({ enabled: true })
    expect(parseStructuredJsonValue('["alpha","beta"]')).toEqual(['alpha', 'beta'])
  })

  it('ignores JSON primitives and invalid JSON', () => {
    expect(parseStructuredJsonValue('"ready"')).toBeUndefined()
    expect(parseStructuredJsonValue('3')).toBeUndefined()
    expect(parseStructuredJsonValue('{')).toBeUndefined()
  })
})
