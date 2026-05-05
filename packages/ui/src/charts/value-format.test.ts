import { describe, expect, it } from 'vitest'
import { createChartValueFormatter, formatChartValue } from './value-format'

describe('chart value formatters', () => {
  it('formats numbers with a stable default precision', () => {
    expect(formatChartValue(12.34)).toBe('12.3')
    expect(formatChartValue(0)).toBe('0')
    expect(formatChartValue(-7.25)).toBe('-7.3')
  })

  it('formats whole-number percentages without treating values as ratios', () => {
    expect(formatChartValue(34, 'percent')).toBe('34%')
  })

  it('respects locale and fraction digit config', () => {
    expect(formatChartValue(1234.5, { kind: 'number', locale: 'de-DE', minimumFractionDigits: 2 })).toBe('1.234,50')
  })

  it('formats currency with an explicit JSON-safe config', () => {
    expect(formatChartValue(1234.5, { kind: 'currency', locale: 'en-US', currency: 'USD' })).toBe('$1,234.5')
  })

  it('creates reusable formatter functions from the same config', () => {
    const formatPercent = createChartValueFormatter('percent')

    expect(formatPercent(12.5)).toBe(formatChartValue(12.5, 'percent'))
  })
})
