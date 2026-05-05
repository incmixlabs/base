import { describe, expect, it } from 'vitest'
import type { AutoformChartDef } from './chart-contract'
import { createAutoformChartSeriesData, getAutoformChartRows } from './chart-data'

type SalesRow = {
  region: string
  revenue: number
}

const salesRows: SalesRow[] = [
  { region: 'East', revenue: 12 },
  { region: 'West', revenue: 8 },
  { region: 'East', revenue: 5 },
]

describe('chart data helpers', () => {
  it('uses inline chart data when no external rows are supplied', () => {
    const chart: AutoformChartDef<SalesRow> = {
      id: 'sales',
      type: 'bar',
      dataSource: { kind: 'inline', rows: salesRows },
    }

    expect(getAutoformChartRows(chart)).toBe(salesRows)
  })

  it('maps renderer-neutral encodings into chart series data', () => {
    const chart: AutoformChartDef<SalesRow> = {
      id: 'sales',
      type: 'bar',
      dataSource: { kind: 'rows' },
      encodings: { x: 'region', y: 'revenue' },
    }

    expect(createAutoformChartSeriesData(chart, salesRows)).toMatchObject([
      { label: 'East', value: 12 },
      { label: 'West', value: 8 },
      { label: 'East', value: 5 },
    ])
  })

  it('aggregates rows by label when aggregate is configured', () => {
    const chart: AutoformChartDef<SalesRow> = {
      id: 'sales',
      type: 'bar',
      dataSource: { kind: 'rows' },
      encodings: { x: 'region', y: 'revenue' },
      aggregate: 'sum',
    }

    expect(createAutoformChartSeriesData(chart, salesRows)).toMatchObject([
      { label: 'East', value: 17 },
      { label: 'West', value: 8 },
    ])
  })

  it.each([
    ['count', 2, 1],
    ['avg', 8.5, 8],
    ['min', 5, 8],
    ['max', 12, 8],
  ] as const)('aggregates rows by label with %s', (aggregate, eastValue, westValue) => {
    const chart: AutoformChartDef<SalesRow> = {
      id: 'sales',
      type: 'bar',
      dataSource: { kind: 'rows' },
      encodings: { x: 'region', y: 'revenue' },
      aggregate,
    }

    expect(createAutoformChartSeriesData(chart, salesRows)).toMatchObject([
      { label: 'East', value: eastValue },
      { label: 'West', value: westValue },
    ])
  })

  it('supports custom aggregate functions', () => {
    let receivedValueField: string | undefined
    const chart: AutoformChartDef<SalesRow> = {
      id: 'sales',
      type: 'bar',
      dataSource: { kind: 'rows' },
      encodings: { x: 'region', y: 'revenue' },
      aggregate: (rows, valueField) => {
        receivedValueField = valueField
        return rows.length * 10
      },
    }

    expect(createAutoformChartSeriesData(chart, salesRows)).toMatchObject([
      { label: 'East', value: 20 },
      { label: 'West', value: 10 },
    ])
    expect(receivedValueField).toBe('revenue')
  })
})
