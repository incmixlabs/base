import { describe, expect, it } from 'vitest'
import { resolveTableEngine } from './table-engine'

describe('table engine helpers', () => {
  it('resolves a controlled engine before the default engine', () => {
    expect(resolveTableEngine({ engine: 'virtual', defaultEngine: 'basic' })).toBe('virtual')
  })

  it('falls back to the default engine and then basic', () => {
    expect(resolveTableEngine({ defaultEngine: 'virtual' })).toBe('virtual')
    expect(resolveTableEngine({})).toBe('basic')
  })
})
