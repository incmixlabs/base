import { describe, expect, it } from 'vitest'
import { cloneJsonValue, isJsonObject, isJsonValue } from './json-value'

describe('JSON value utilities', () => {
  it('accepts JSON-compatible values and rejects non-plain objects', () => {
    expect(isJsonValue('')).toBe(true)
    expect(isJsonValue([])).toBe(true)
    expect(isJsonValue({})).toBe(true)
    expect(isJsonValue({ label: 'Ready', items: [1, true, null] })).toBe(true)
    expect(isJsonValue([[['nested']]])).toBe(true)
    expect(isJsonValue(Number.NaN)).toBe(false)
    expect(isJsonValue(Number.POSITIVE_INFINITY)).toBe(false)
    expect(isJsonValue(new Date())).toBe(false)
    expect(isJsonObject(Object.create(null))).toBe(true)
  })

  it('clones JSON values and drops undefined object entries', () => {
    const value = {
      label: 'Ready',
      nested: { count: 2 },
      items: [{ name: 'First' }, { name: 'Second', skipped: undefined }],
      skipped: undefined,
    } as never
    const cloned = cloneJsonValue(value)

    expect(cloned).toEqual({
      label: 'Ready',
      nested: { count: 2 },
      items: [{ name: 'First' }, { name: 'Second' }],
    })
    expect(cloned).not.toBe(value)
    expect((cloned as { nested: object }).nested).not.toBe(value.nested)
    expect((cloned as { items: object[] }).items[0]).not.toBe(value.items[0])
  })
})
