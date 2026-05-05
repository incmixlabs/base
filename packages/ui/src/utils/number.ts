const defaultNumberFormatter = new Intl.NumberFormat('en-US')

export function formatNumber(value: number): string {
  return defaultNumberFormatter.format(value)
}
