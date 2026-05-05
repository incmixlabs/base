import {
  type ChartColorInput,
  type ChartRole,
  getChartSeriesColorKey,
  isChartSemanticLane,
  normalizeChartColor,
  resolveConcreteChartRoleColor,
} from './chart.js'
import type { MapChartLocationDatum } from './map-chart-model.js'
import { type ChartValueFormatConfig, createChartValueFormatter } from './value-format.js'

export type MapChartSummaryColorResolverInput = {
  color: string
  fallbackColor: ChartColorInput
  role: ChartRole
  index: number
  location: MapChartLocationDatum
}

export type MapChartSummaryColorResolver = (input: MapChartSummaryColorResolverInput) => string | undefined

export type MapChartSummaryItem = MapChartLocationDatum & {
  color: string
  value: number
  valueLabel: string
}

export type MapChartSummaryOtherItem = {
  label: string
  color: string
  count: number
  total: number
  valueLabel: string
}

export type MapChartSummaryModel = {
  total: number
  totalLabel: string
  items: MapChartSummaryItem[]
  allItems: MapChartSummaryItem[]
  other: MapChartSummaryOtherItem | null
  summaryLabel: string
}

export type CreateMapChartSummaryModelOptions = {
  locations: readonly MapChartLocationDatum[]
  title?: string
  summaryLimit?: number
  otherLabel?: string
  otherColor?: string
  valueFormat?: ChartValueFormatConfig
  valueFormatter?: (value: number) => string
  resolveColor?: MapChartSummaryColorResolver
}

function isResolvableChartColor(color: string): color is ChartColorInput {
  return normalizeChartColor(color) !== undefined || isChartSemanticLane(color)
}

function getSafeValue(value: number) {
  return Number.isFinite(value) ? value : 0
}

function getSafeSummaryLimit(value: number) {
  const limit = Math.floor(value)
  return Number.isFinite(limit) ? Math.max(0, limit) : 0
}

function resolveDefaultMapChartSummaryColor({
  color,
  role,
}: Pick<MapChartSummaryColorResolverInput, 'color' | 'role'>) {
  if (isResolvableChartColor(color)) {
    return resolveConcreteChartRoleColor({ color, role }) ?? color
  }

  return color
}

function getSummaryLabel({
  title,
  items,
  hiddenCount,
}: {
  title?: string
  items: readonly MapChartSummaryItem[]
  hiddenCount: number
}) {
  const itemSummary = items.map(item => `${item.name} ${item.valueLabel}`).join(', ')
  const hiddenSummary = hiddenCount > 0 ? `, and ${hiddenCount} more` : ''
  const label = title ?? 'Map chart'

  return itemSummary ? `${label}: ${itemSummary}${hiddenSummary}` : label
}

export function createMapChartSummaryModel({
  locations,
  title,
  summaryLimit = 5,
  otherLabel = 'Other locations',
  otherColor = 'slate',
  valueFormat,
  valueFormatter,
  resolveColor,
}: CreateMapChartSummaryModelOptions): MapChartSummaryModel {
  const formatter = valueFormatter ?? createChartValueFormatter(valueFormat)
  const safeSummaryLimit = getSafeSummaryLimit(summaryLimit)
  const allItems = locations
    .map((location, index): MapChartSummaryItem => {
      const fallbackColor = getChartSeriesColorKey(index)
      const color = location.color ?? fallbackColor
      const value = getSafeValue(location.value)
      const resolvedColor =
        resolveColor?.({
          color,
          fallbackColor,
          role: 'fill',
          index,
          location,
        }) ?? resolveDefaultMapChartSummaryColor({ color, role: 'fill' })

      return {
        ...location,
        color: resolvedColor,
        value,
        valueLabel: formatter(value),
      }
    })
    .sort((a, b) => b.value - a.value)

  const items = safeSummaryLimit > 0 ? allItems.slice(0, safeSummaryLimit) : []
  const otherItems = safeSummaryLimit > 0 ? allItems.slice(safeSummaryLimit) : allItems
  const otherTotal = otherItems.reduce((total, location) => total + location.value, 0)
  const total = allItems.reduce((sum, location) => sum + location.value, 0)
  const otherResolvedColor =
    resolveColor?.({
      color: otherColor,
      fallbackColor: 'slate',
      role: 'muted',
      index: allItems.length,
      location: {
        id: '__other__',
        name: otherLabel,
        value: otherTotal,
        color: otherColor,
      },
    }) ?? resolveDefaultMapChartSummaryColor({ color: otherColor, role: 'muted' })

  return {
    total,
    totalLabel: formatter(total),
    items,
    allItems,
    other:
      otherItems.length > 0
        ? {
            label: otherLabel,
            color: otherResolvedColor,
            count: otherItems.length,
            total: otherTotal,
            valueLabel: formatter(otherTotal),
          }
        : null,
    summaryLabel: getSummaryLabel({
      title,
      items: allItems.slice(0, 10),
      hiddenCount: Math.max(0, allItems.length - 10),
    }),
  }
}
