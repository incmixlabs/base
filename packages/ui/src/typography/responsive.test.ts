import { describe, expect, it } from 'vitest'
import { getResponsiveVariantClasses } from './responsive'

const baseMap = {
  sm: 'text-sm',
  md: 'text-md',
} as const

const responsiveMap = {
  md: {
    sm: 'cq-md:text-sm',
    md: 'cq-md:text-md',
  },
} as const

describe('getResponsiveVariantClasses', () => {
  it('falls back when generated responsive values are invalid', () => {
    const classes = getResponsiveVariantClasses(
      { initial: 'invalid', md: 'also-invalid' } as never,
      baseMap,
      responsiveMap,
      'sm',
      ['md'],
    )

    expect(classes).toBe('text-sm')
  })
})
