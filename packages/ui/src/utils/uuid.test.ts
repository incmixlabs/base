import { describe, expect, it } from 'vitest'
import { uuid } from './uuid'

const UUID_V7_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/

describe('uuid utility', () => {
  it('creates UUID v7 values for persisted object identity', () => {
    const id = uuid()

    expect(id).toMatch(UUID_V7_PATTERN)
  })

  it('creates distinct values across calls', () => {
    expect(uuid()).not.toBe(uuid())
  })
})
