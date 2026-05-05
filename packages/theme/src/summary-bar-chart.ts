export type SummaryBarChartDatum = {
  label: string
  value: number
  secondary?: number
}

export type SummaryBarChartModelBin = {
  label: string
  value: number
  primary: number
  secondary: number
}

export type SummaryBarChartModel = {
  bins: SummaryBarChartModelBin[]
  domainMax: number
}

export type CreateSummaryBarChartModelOptions = {
  domainMax?: number
}

function getFiniteNonNegativeValue(value: number | undefined) {
  return typeof value === 'number' && Number.isFinite(value) && value > 0 ? value : 0
}

export function createSummaryBarChartModel(
  data: readonly SummaryBarChartDatum[],
  options: CreateSummaryBarChartModelOptions = {},
): SummaryBarChartModel {
  const normalized = data.map(item => {
    const value = getFiniteNonNegativeValue(item.value)
    const secondary = Math.min(value, getFiniteNonNegativeValue(item.secondary))
    const primary = Math.max(0, value - secondary)

    return {
      label: item.label,
      value,
      primary,
      secondary,
    }
  })
  const maxValue = normalized.reduce((max, item) => Math.max(max, item.value), 0)
  const optionDomainMax = getFiniteNonNegativeValue(options.domainMax)
  const domainMax = Math.max(optionDomainMax, maxValue, 1)

  return {
    domainMax,
    bins: normalized,
  }
}
