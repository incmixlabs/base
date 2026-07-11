import { describe, expect, it } from 'vitest'
import { isJsonObject } from './object'

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
