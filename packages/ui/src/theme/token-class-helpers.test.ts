import { describe, expect, it } from 'vitest'
import {
  getSemanticColorClassRecipe,
  getSpacingUtilityClass,
  getThemeColorUtilityClass,
  radiusClassByToken,
} from './token-class-helpers'

describe('token-class-helpers public bridge', () => {
  it('exports radius, spacing, color, and surface class helpers', () => {
    expect(radiusClassByToken.lg).toBe('rounded-lg')
    expect(getSpacingUtilityClass('px', '4')).toBe('px-4')
    expect(getThemeColorUtilityClass('bg', 'primary-solid')).toBe('bg-primary-solid')
    expect(getSemanticColorClassRecipe('primary').fill.solid).toBe('bg-primary-solid')
  })
})
