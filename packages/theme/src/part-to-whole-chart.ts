import {
  type ChartColorInput,
  type ChartRole,
  getChartSeriesColorKey,
  isChartSemanticLane,
  normalizeChartColor,
  resolveConcreteChartRoleColor,
} from './chart.js'
import {
  type CreatePartToWholeModelOptions,
  createPartToWholeModel,
  type PartToWholeDatum,
  type PartToWholeModelItem,
} from './part-to-whole.js'
import { type ChartValueFormatConfig, createChartValueFormatter } from './value-format.js'

export type PartToWholeChartColorResolverInput<
  TDatum extends PartToWholeDatum = PartToWholeDatum,
  TItem extends PartToWholeModelItem<TDatum> = PartToWholeModelItem<TDatum>,
> = {
  color: string
  fallbackColor: ChartColorInput
  role: ChartRole
  index: number
  item: TItem
}

export type PartToWholeChartColorResolver<TDatum extends PartToWholeDatum = PartToWholeDatum> = (
  input: PartToWholeChartColorResolverInput<TDatum>,
) => string | undefined

export type PartToWholeChartModelItem<TDatum extends PartToWholeDatum = PartToWholeDatum> =
  PartToWholeModelItem<TDatum> & {
    fillColor: string
    valueLabel: string
  }

export type PartToWholeChartModel<TDatum extends PartToWholeDatum = PartToWholeDatum> = {
  total: number
  items: PartToWholeChartModelItem<TDatum>[]
  summaryLabel: string
}

export type CreatePartToWholeChartModelOptions<TDatum extends PartToWholeDatum = PartToWholeDatum> =
  CreatePartToWholeModelOptions & {
    title?: string
    color?: string
    maxSummaryItems?: number
    valueFormat?: ChartValueFormatConfig
    valueFormatter?: (value: number) => string
    resolveColor?: PartToWholeChartColorResolver<TDatum>
  }

function isResolvableChartColor(color: string): color is ChartColorInput {
  return normalizeChartColor(color) !== undefined || isChartSemanticLane(color)
}

function resolveDefaultPartToWholeChartColor({
  color,
  role,
}: Pick<PartToWholeChartColorResolverInput, 'color' | 'role'>) {
  if (isResolvableChartColor(color)) {
    return resolveConcreteChartRoleColor({ color, role }) ?? color
  }

  return color
}

function getPartToWholeSummaryLabel<TDatum extends PartToWholeDatum>({
  title,
  items,
  maxSummaryItems,
}: {
  title?: string
  items: readonly PartToWholeChartModelItem<TDatum>[]
  maxSummaryItems: number
}) {
  const visibleItems = items.slice(0, Math.max(0, maxSummaryItems))
  const itemSummary = visibleItems.map(item => `${item.label} ${item.valueLabel}`).join(', ')
  const hiddenCount = items.length - visibleItems.length
  const hiddenSummary = hiddenCount > 0 ? `, and ${hiddenCount} more` : ''
  const label = title ?? 'Part-to-whole chart'

  return itemSummary ? `${label}: ${itemSummary}${hiddenSummary}` : label
}

export function createPartToWholeChartModel<TDatum extends PartToWholeDatum>(
  data: readonly TDatum[],
  options: CreatePartToWholeChartModelOptions<TDatum> = {},
): PartToWholeChartModel<TDatum> {
  const valueFormatter = options.valueFormatter ?? createChartValueFormatter(options.valueFormat)
  const baseModel = createPartToWholeModel(data, {
    total: options.total,
    minVisiblePercentage: options.minVisiblePercentage,
  })
  const items = baseModel.items.map((item, index): PartToWholeChartModelItem<TDatum> => {
    const fallbackColor = getChartSeriesColorKey(index)
    const color = item.color ?? options.color ?? fallbackColor
    const fillColor =
      options.resolveColor?.({
        color,
        fallbackColor,
        role: 'fill',
        index,
        item,
      }) ?? resolveDefaultPartToWholeChartColor({ color, role: 'fill' })

    return {
      ...item,
      fillColor,
      valueLabel: item.hasValue ? valueFormatter(item.value) : 'n/a',
    }
  })

  return {
    total: baseModel.total,
    items,
    summaryLabel: getPartToWholeSummaryLabel({
      title: options.title,
      items,
      maxSummaryItems: options.maxSummaryItems ?? 10,
    }),
  }
}
