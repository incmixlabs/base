import { describe, expect, it } from 'vitest'
import {
  formatPascalIdentifier,
  getNextPascalIdentifier,
  normalizeToken,
  splitDelimitedList,
  splitNormalizedPath,
} from './naming'

describe('naming utilities', () => {
  it('normalizes free-form tokens without component identity semantics', () => {
    expect(normalizeToken(' Data Display ')).toBe('data-display')
    expect(normalizeToken('SWOT / Matrix')).toBe('swot-matrix')
  })

  it('splits delimited lists and normalized paths', () => {
    expect(splitDelimitedList('local, composite, , form')).toEqual(['local', 'composite', 'form'])
    expect(splitNormalizedPath('Composites / Data Display')).toEqual(['composites', 'data-display'])
  })

  it('formats values as PascalCase identifiers', () => {
    expect(formatPascalIdentifier('swot analysis')).toBe('SwotAnalysis')
    expect(formatPascalIdentifier('3d card')).toBe('Component3dCard')
    expect(formatPascalIdentifier('')).toBe('UntitledComponent')
  })

  it('suggests the next non-conflicting PascalCase identifier', () => {
    expect(getNextPascalIdentifier('Untitled Component', ['UntitledComponent'], '')).toBe('UntitledComponent2')
    expect(getNextPascalIdentifier('Swot', ['Swot', 'Swot2'], 'Swot')).toBe('Swot')
  })
})
