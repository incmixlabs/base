import { describe, expect, it } from 'vitest'
import {
  autoFormDateRulesHintKey,
  getAutoFormDateRules,
  getAutoFormDateRulesFromHints,
  resolveAutoFormDateBounds,
  validateAutoFormDateRules,
} from './autoform-date-rules.props'

describe('autoform-date-rules.props', () => {
  it('parses date rules from schema hints', () => {
    const rules = getAutoFormDateRulesFromHints({
      [autoFormDateRulesHintKey]: {
        mode: 'future',
        minDate: '2026-04-01',
        minAge: 18,
      },
    })

    expect(rules).toEqual({
      mode: 'future',
      minDate: '2026-04-01',
      minAge: 18,
    })
  })

  it('resolves effective bounds from relative and absolute rules', () => {
    const now = new Date(2026, 2, 26, 9, 30)
    const bounds = resolveAutoFormDateBounds(
      'date',
      getAutoFormDateRules({
        mode: 'future',
        minDate: '2026-03-20',
        maxDate: '2026-06-01',
      }),
      now,
    )

    expect(bounds.minValue).toEqual(new Date(2026, 2, 27))
    expect(bounds.maxValue).toEqual(new Date(2026, 5, 1))
  })

  it('validates minAge and future rules deterministically', () => {
    const now = new Date(2026, 2, 26, 12, 0)

    expect(
      validateAutoFormDateRules(
        '2010-03-27',
        'date',
        getAutoFormDateRules({
          minAge: 18,
        }),
        now,
      ),
    ).toEqual(['Must be at least 18 years old.'])

    expect(
      validateAutoFormDateRules(
        '2026-03-26T11:00:00.000Z',
        'date-time',
        getAutoFormDateRules({
          mode: 'future',
        }),
        now,
      ),
    ).toEqual(['Date and time must be in the future.'])
  })
})
