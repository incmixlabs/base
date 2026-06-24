import { describe, expect, it } from 'vitest'
import {
  resolveInteractiveFillColor,
  resolveInteractiveForegroundToken,
  resolveInteractiveUnfilledColor,
  resolveSurfaceBackgroundColor,
  resolveSurfaceForegroundColor,
  resolveSurfaceToneColor,
  resolveSurfaceToneStyle,
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

describe('surface color and text resolution helpers', () => {
  it('resolves semantic and chart foreground colors', () => {
    // Semantic solid vs soft
    expect(resolveSurfaceForegroundColor('primary', undefined, 'solid')).toBe('var(--color-primary-contrast)')
    expect(resolveSurfaceForegroundColor('primary', undefined, 'soft')).toBe('var(--color-primary-text)')

    // Explicit semantic overrides
    expect(resolveSurfaceForegroundColor('primary', 'contrast', 'soft')).toBe('var(--color-primary-contrast)')
    expect(resolveSurfaceForegroundColor('primary', 'inverse', 'soft')).toBe('var(--color-inverse-text)')

    // Chart solid vs soft
    expect(resolveSurfaceForegroundColor('chart1', undefined, 'solid')).toBe('var(--chart-1-contrast)')
    expect(resolveSurfaceForegroundColor('chart1', undefined, 'soft')).toBe(
      'color-mix(in oklch, var(--chart-1) 34%, var(--color-dark-primary))',
    )
  })

  it('resolves semantic and chart background colors', () => {
    expect(resolveSurfaceBackgroundColor('primary', 'solid')).toBe('var(--color-primary-primary)')
    expect(resolveSurfaceBackgroundColor('primary', 'soft')).toBe('var(--color-primary-soft)')
    expect(resolveSurfaceBackgroundColor('primary', 'surface')).toBe('var(--color-primary-surface)')

    expect(resolveSurfaceBackgroundColor('chart1', 'solid')).toBe('var(--chart-1)')
    expect(resolveSurfaceBackgroundColor('chart1', 'soft')).toBe(
      'color-mix(in oklch, var(--chart-1) 28%, var(--color-light-surface))',
    )
  })

  it('resolves unified tone styles', () => {
    const style = resolveSurfaceToneStyle('primary', 'soft', 'contrast')
    expect(style).toEqual({
      backgroundColor: 'var(--color-primary-soft)',
      color: 'var(--color-primary-contrast)',
    })

    expect(resolveSurfaceToneStyle(undefined)).toBeNull()
    expect(resolveSurfaceToneStyle('invalid-color-key')).toBeNull()
  })
})
