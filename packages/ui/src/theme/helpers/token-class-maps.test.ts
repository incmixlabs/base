import { describe, expect, it } from 'vitest'
import {
  getResponsiveMappedUtilityClasses,
  getResponsiveSpacingUtilityClasses,
  getThemeColorUtilityClass,
} from './token-class-maps'

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
