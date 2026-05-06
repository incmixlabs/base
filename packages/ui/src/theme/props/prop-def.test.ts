import { describe, expect, it } from 'vitest'
import { normalizeBooleanPropValue, normalizeEnumPropValue } from './prop-def'

describe('prop-def normalization', () => {
  const enumDef = {
    type: 'enum',
    values: ['soft', 'surface', 'solid'] as const,
    default: 'surface',
  }

  it('normalizes enum props by trimming and matching case-insensitively', () => {
    expect(normalizeEnumPropValue(enumDef, ' Soft ')).toBe('soft')
    expect(normalizeEnumPropValue(enumDef, 'SURFACE')).toBe('surface')
  })

  it('can preserve exact-case enum matching when requested', () => {
    expect(normalizeEnumPropValue(enumDef, ' Soft ', { caseSensitive: true })).toBe('surface')
  })

  it('falls back to the enum default for invalid or non-string values', () => {
    expect(normalizeEnumPropValue(enumDef, 'invalid')).toBe('surface')
    expect(normalizeEnumPropValue(enumDef, '')).toBe('surface')
    expect(normalizeEnumPropValue(enumDef, null)).toBe('surface')
    expect(normalizeEnumPropValue(enumDef, undefined)).toBe('surface')
    expect(normalizeEnumPropValue(enumDef, true)).toBe('surface')
  })

  it('normalizes boolean props from booleans and true/false strings', () => {
    const booleanDef = { type: 'boolean', default: false } as const

    expect(normalizeBooleanPropValue(booleanDef, true)).toBe(true)
    expect(normalizeBooleanPropValue(booleanDef, false)).toBe(false)
    expect(normalizeBooleanPropValue(booleanDef, ' TRUE ')).toBe(true)
    expect(normalizeBooleanPropValue(booleanDef, ' false ')).toBe(false)
    expect(normalizeBooleanPropValue(booleanDef, 'False')).toBe(false)
  })

  it('falls back to the boolean default for unsupported values', () => {
    const defaultTrueDef = { type: 'boolean', default: true } as const
    const defaultUndefinedDef = { type: 'boolean', default: undefined } as const

    expect(normalizeBooleanPropValue(defaultTrueDef, 'yes')).toBe(true)
    expect(normalizeBooleanPropValue(defaultTrueDef, '')).toBe(true)
    expect(normalizeBooleanPropValue(defaultTrueDef, null)).toBe(true)
    expect(normalizeBooleanPropValue(defaultTrueDef, undefined)).toBe(true)
    expect(normalizeBooleanPropValue(defaultUndefinedDef, 'yes')).toBeUndefined()
  })
})
