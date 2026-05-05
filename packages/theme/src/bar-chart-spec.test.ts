import { describe, expect, it } from 'vitest'
import { createBarChartSpec } from './bar-chart-spec.js'

const colors = {
  foreground: '#111827',
  muted: '#64748b',
  border: '#cbd5e1',
  fill: '#f97316',
  fillSoft: '#fed7aa',
}

describe('createBarChartSpec', () => {
  it('creates deterministic G2 interval specs from normalized options', () => {
    const spec = createBarChartSpec(
      [
        { label: 'A', value: 10 },
        { label: 'B', value: 20 },
      ],
      { colors, valueLabelOffset: 4 },
    )

    expect(spec).toMatchObject({
      type: 'interval',
      encode: { x: 'label', y: 'value' },
      scale: { y: { domainMax: 25, nice: true } },
      style: { fill: '#f97316', radiusTopLeft: 10, radiusTopRight: 10 },
      state: { active: { stroke: '#111827', shadowColor: '#fed7aa' } },
    })
    expect(spec.labels).toEqual([
      {
        text: 'value',
        position: 'top',
        fill: '#111827',
        fontSize: 12,
        fontWeight: 700,
        dy: -4,
      },
    ])
  })

  it('uses a stable empty-domain fallback and can suppress labels', () => {
    const spec = createBarChartSpec([{ label: 'A', value: 0 }], { colors, showValueLabels: false })

    expect(spec.scale).toMatchObject({ y: { domainMax: 1 } })
    expect(spec.labels).toEqual([])
  })

  it('sanitizes non-finite plotted values before emitting the spec', () => {
    const spec = createBarChartSpec(
      [
        { label: 'Valid', value: 10 },
        { label: 'Invalid', value: Number.NaN },
        { label: 'PosInf', value: Number.POSITIVE_INFINITY },
        { label: 'NegInf', value: Number.NEGATIVE_INFINITY },
      ],
      { colors },
    )

    expect(spec.data).toEqual([
      { label: 'Valid', value: 10 },
      { label: 'Invalid', value: 0 },
      { label: 'PosInf', value: 0 },
      { label: 'NegInf', value: 0 },
    ])
    expect(spec.scale).toMatchObject({ y: { domainMax: 13 } })
  })
})
