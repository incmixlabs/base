import { describe, expect, it } from 'vitest'
import {
  resolveInteractiveFillColor,
  resolveInteractiveForegroundToken,
  resolveInteractiveUnfilledColor,
  resolveSurfaceToneColor,
  SemanticColor,
  semanticColorVar,
} from './color.prop'

describe('interactive color resolution', () => {
  it('maps only neutral fills to inverse', () => {
    expect(resolveInteractiveFillColor(SemanticColor.neutral)).toBe(SemanticColor.inverse)
    expect(resolveInteractiveFillColor(SemanticColor.light)).toBe(SemanticColor.light)
    expect(resolveInteractiveFillColor(SemanticColor.dark)).toBe(SemanticColor.dark)
  })

  it('maps static dark and light unfilled controls to the readable neutral lane', () => {
    expect(resolveInteractiveUnfilledColor(SemanticColor.neutral)).toBe(SemanticColor.neutral)
    expect(resolveInteractiveUnfilledColor(SemanticColor.light)).toBe(SemanticColor.neutral)
    expect(resolveInteractiveUnfilledColor(SemanticColor.dark)).toBe(SemanticColor.neutral)
    expect(resolveInteractiveForegroundToken(SemanticColor.neutral)).toBe('text')
    expect(resolveInteractiveForegroundToken(SemanticColor.inverse)).toBe('primary')
    expect(resolveInteractiveForegroundToken(SemanticColor.light)).toBe('text')
    expect(resolveInteractiveForegroundToken(SemanticColor.dark)).toBe('text')
  })

  it('preserves chromatic semantic lanes', () => {
    expect(resolveInteractiveFillColor(SemanticColor.primary)).toBe(SemanticColor.primary)
    expect(resolveInteractiveFillColor(SemanticColor.info)).toBe(SemanticColor.info)
    expect(resolveInteractiveUnfilledColor(SemanticColor.inverse)).toBe(SemanticColor.inverse)
    expect(resolveInteractiveForegroundToken(SemanticColor.primary)).toBe('text')
  })

  it('rejects unsupported runtime semantic lanes', () => {
    expect(() => semanticColorVar('default' as never, 'primary')).toThrow('Unsupported semantic color: default')
    expect(() => resolveInteractiveFillColor('default' as never)).toThrow('Unsupported semantic color: default')
  })
})

describe('surface tone resolution', () => {
  it('keeps neutral on the neutral surface lane', () => {
    expect(resolveSurfaceToneColor(SemanticColor.neutral)).toBe(SemanticColor.neutral)
    expect(resolveSurfaceToneColor(SemanticColor.inverse)).toBe(SemanticColor.inverse)
  })

  it('preserves semantic color lanes for surface hosts', () => {
    expect(resolveSurfaceToneColor(SemanticColor.primary)).toBe(SemanticColor.primary)
    expect(resolveSurfaceToneColor(SemanticColor.info)).toBe(SemanticColor.info)
  })
})
