export const chartValueFormatKinds = ['number', 'percent', 'currency'] as const

export type ChartValueFormatKind = (typeof chartValueFormatKinds)[number]

export type ChartValueFormatConfig =
  | ChartValueFormatKind
  | {
      kind?: ChartValueFormatKind
      locale?: string
      currency?: string
      minimumFractionDigits?: number
      maximumFractionDigits?: number
    }

function normalizeValueFormat(format: ChartValueFormatConfig | undefined) {
  if (typeof format === 'string') return { kind: format }
  return format ?? { kind: 'number' }
}

/**
 * Formats chart display values from JSON-safe config.
 *
 * Percent formatting treats values as whole-number percentages, so `34`
 * renders as `34%`. It intentionally does not use Intl percent style, which
 * treats values as ratios.
 */
export function formatChartValue(value: number, format?: ChartValueFormatConfig): string {
  const config = normalizeValueFormat(format)
  const kind = config.kind ?? 'number'
  const minimumFractionDigits = Math.max(0, config.minimumFractionDigits ?? 0)
  const maximumFractionDigits = Math.max(
    minimumFractionDigits,
    config.maximumFractionDigits ?? Math.max(minimumFractionDigits, 1),
  )
  const formatterOptions = {
    minimumFractionDigits,
    maximumFractionDigits,
  }

  if (kind === 'currency') {
    try {
      return new Intl.NumberFormat(config.locale ?? 'en-US', {
        ...formatterOptions,
        style: 'currency',
        currency: config.currency ?? 'USD',
      }).format(value)
    } catch {
      return new Intl.NumberFormat('en-US', {
        ...formatterOptions,
        style: 'currency',
        currency: 'USD',
      }).format(value)
    }
  }

  let formattedValue: string
  try {
    formattedValue = new Intl.NumberFormat(config.locale ?? 'en-US', formatterOptions).format(value)
  } catch {
    formattedValue = new Intl.NumberFormat('en-US', formatterOptions).format(value)
  }

  return kind === 'percent' ? `${formattedValue}%` : formattedValue
}

export function createChartValueFormatter(format?: ChartValueFormatConfig): (value: number) => string {
  return value => formatChartValue(value, format)
}
