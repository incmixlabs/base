import { describe, expect, it } from 'vitest'
import {
  getResponsiveMappedUtilityClasses,
  getResponsiveSpacingUtilityClasses,
  getThemeColorUtilityClass,
} from './token-class-maps'
import { getSemanticColorClassRecipe, semanticColorClassRecipes } from './semantic-color-recipe'

describe('theme token class maps', () => {
  it('maps common semantic color tokens to clean utility classes', () => {
    expect(getThemeColorUtilityClass('bg', 'primary-primary')).toBe('bg-primary')
    expect(getThemeColorUtilityClass('text', 'primary-contrast')).toBe('text-primary-foreground')
    expect(getThemeColorUtilityClass('border', 'neutral-border')).toBe('border-border')
  })

  it('maps raw palette tokens to arbitrary variable utilities', () => {
    expect(getThemeColorUtilityClass('bg', 'orange-6')).toBe('bg-[var(--orange-6)]')
    expect(getThemeColorUtilityClass('text', 'teal-11')).toBe('text-[var(--teal-11)]')
    expect(getThemeColorUtilityClass('border', 'brown-4')).toBe('border-[var(--brown-4)]')
  })

  it('maps unmapped semantic and chart tokens to arbitrary variable utilities', () => {
    expect(getThemeColorUtilityClass('bg', 'primary-soft')).toBe('bg-[var(--color-primary-soft)]')
    expect(getThemeColorUtilityClass('border', 'chart1')).toBe('border-[var(--chart-1)]')
  })

  it('resolves semantic color class recipes by role', () => {
    const recipe = getSemanticColorClassRecipe('primary')

    expect(recipe.fill.container).toBe('bg-primary-surface')
    expect(recipe.fill.soft).toBe('bg-primary-soft')
    expect(recipe.text.default).toBe('text-primary')
    expect(recipe.text.contrast).toBe('text-primary-contrast')
    expect(recipe.border.default).toBe('border-primary')
    expect(recipe.state.hoverBg).toBe('hover:bg-primary-highlight')
    expect(recipe.state.activeBg).toBe('active:bg-[var(--color-primary-soft-hover)]')
    expect(recipe.state.selectedBg).toBe('data-[selected]:bg-primary-highlight')
  })

  it('keeps structural and chart interaction states variant-specific', () => {
    expect(getSemanticColorClassRecipe('neutral').state.hoverBg).toBe('hover:bg-[var(--color-neutral-soft-hover)]')
    expect(getSemanticColorClassRecipe('neutral').state.activeBg).toBe('active:bg-[var(--color-neutral-soft-hover)]')
    expect(getSemanticColorClassRecipe('neutral').state.hoverContainerBg).toBe(
      'hover:bg-[var(--color-neutral-surface-hover)]',
    )
    expect(getSemanticColorClassRecipe('chart1').state.hoverBg).toBe(
      'hover:bg-[color-mix(in_oklch,var(--chart-1)_36%,var(--color-light-surface))]',
    )
    expect(getSemanticColorClassRecipe('chart1').state.hoverContainerBg).toBe(
      'hover:bg-[color-mix(in_oklch,var(--chart-1)_18%,var(--color-light-surface))]',
    )
    expect(getSemanticColorClassRecipe('chart1').state.activeBg).toBe(
      'active:bg-[color-mix(in_oklch,var(--chart-1)_36%,var(--color-light-surface))]',
    )
    expect(getSemanticColorClassRecipe('chart1').state.activeContainerBg).toBe(
      'active:bg-[color-mix(in_oklch,var(--chart-1)_18%,var(--color-light-surface))]',
    )
  })

  it('normalizes chart aliases in semantic color class recipes', () => {
    expect(getSemanticColorClassRecipe('chart-1')).toEqual(semanticColorClassRecipes['chart-1'])
    expect(getSemanticColorClassRecipe('chart-1').colorName).toBe('chart1')
    expect(semanticColorClassRecipes['chart-1'].fill.soft).toBe('bg-chart1-soft')
  })

  it('does not emit classes for missing tokens', () => {
    expect(getThemeColorUtilityClass('bg', undefined)).toBeUndefined()
  })

  it('maps responsive token classes with shared breakpoint prefixes', () => {
    expect(
      getResponsiveMappedUtilityClasses(
        { initial: 'hidden', md: 'block', xl: 'grid' },
        {
          block: 'block',
          grid: 'grid',
          hidden: 'hidden',
        },
      ),
    ).toBe('hidden md:block xl:grid')
  })

  it('returns undefined when responsive spacing contains a custom value', () => {
    expect(getResponsiveSpacingUtilityClasses('p', { initial: '2', md: '1.5rem' })).toBeUndefined()
  })
})
