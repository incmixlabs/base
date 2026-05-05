export type PartToWholeDatum = {
  id?: string
  label: string
  value?: number | null
  color?: string
}

export type PartToWholeModelItem<TDatum extends PartToWholeDatum = PartToWholeDatum> = {
  datum: TDatum
  id: string
  label: string
  value: number
  hasValue: boolean
  percentage: number
  barPercentage: number
  color?: string
}

export type PartToWholeModel<TDatum extends PartToWholeDatum = PartToWholeDatum> = {
  total: number
  items: PartToWholeModelItem<TDatum>[]
}

export type CreatePartToWholeModelOptions = {
  total?: number
  minVisiblePercentage?: number
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function normalizeValue(value: number | null | undefined) {
  if (typeof value !== 'number' || !Number.isFinite(value)) return null
  return Math.max(0, value)
}

export function createPartToWholeModel<TDatum extends PartToWholeDatum>(
  data: readonly TDatum[],
  options: CreatePartToWholeModelOptions = {},
): PartToWholeModel<TDatum> {
  const values = data.map(item => normalizeValue(item.value))
  const valueTotal = values.reduce<number>((total, value) => total + (value ?? 0), 0)
  const explicitTotal = normalizeValue(options.total)
  const total: number = explicitTotal != null && explicitTotal > 0 ? explicitTotal : valueTotal
  const minVisiblePercentage = clamp(options.minVisiblePercentage ?? 0, 0, 100)

  return {
    total,
    items: data.map((item, index) => {
      const value = values[index]
      const hasValue = value != null
      const safeValue = value ?? 0
      const percentage = total > 0 ? clamp((safeValue / total) * 100, 0, 100) : 0
      const barPercentage = safeValue > 0 ? Math.max(percentage, minVisiblePercentage) : 0

      return {
        datum: item,
        id: item.id ?? item.label,
        label: item.label,
        value: safeValue,
        hasValue,
        percentage,
        barPercentage,
        color: item.color,
      }
    }),
  }
}
