'use client'

import { createMapChartSummaryModel, type MapChartSummaryColorResolver } from '@incmix/theme'
import * as React from 'react'
import { IconButton } from '@/elements/button/IconButton'
import { Row } from '@/layouts/flex/Flex'
import { cn } from '@/lib/utils'
import { Text } from '@/typography/text/Text'
import { getChartSeriesColor, resolveChartColorValue } from '../chart-colors'
import { useChartPaletteSignature } from '../chart-palette-context'
import { type MapChartProjection, mapChartProjections } from './props'

export type { MapChartProjection } from './props'

export type MapChartPosition = [number, number] | [number, number, number]

export type MapChartGeometry =
  | {
      type: 'Polygon'
      coordinates: MapChartPosition[][]
    }
  | {
      type: 'MultiPolygon'
      coordinates: MapChartPosition[][][]
    }
  | {
      type: 'GeometryCollection'
      geometries: MapChartGeometry[]
    }

export type MapChartFeature = {
  type: 'Feature'
  id?: string | number
  properties?: Record<string, unknown>
  geometry: MapChartGeometry
}

export type MapChartLocationDatum = {
  id: string
  name: string
  value: number
  featureId?: string
  isoCode?: string
  color?: string
  flag?: string
}

export interface MapChartProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  features?: MapChartFeature[]
  locations?: MapChartLocationDatum[]
  title?: React.ReactNode
  metric?: React.ReactNode
  metricLabel?: React.ReactNode
  trend?: React.ReactNode
  height?: number
  mapMaxWidth?: React.CSSProperties['maxWidth']
  projection?: MapChartProjection
  summaryLimit?: number
  showSummary?: boolean
  showZoomControls?: boolean
  otherLabel?: React.ReactNode
  otherValue?: React.ReactNode
  valueFormatter?: (value: number) => string
  emptyMessage?: React.ReactNode
}

const MapChartCanvas = React.lazy(() => import('./MapChartCanvas').then(module => ({ default: module.MapChartCanvas })))
const DEFAULT_PROJECTION: MapChartProjection = mapChartProjections.mercator
const DEFAULT_MAP_HEIGHT = 402
const DEFAULT_MAP_MAX_WIDTH = 827

function assignForwardedRef<T>(ref: React.ForwardedRef<T>, value: T | null) {
  if (typeof ref === 'function') {
    ref(value)
    return
  }

  if (ref) {
    ref.current = value
  }
}

function defaultValueFormatter(value: number) {
  return new Intl.NumberFormat('en-US').format(value)
}

const resolveMapChartSummaryColor: MapChartSummaryColorResolver = ({ color, fallbackColor, role }) => {
  if (role === 'muted') return 'var(--color-neutral-soft)'
  return resolveChartColorValue(color, resolveChartColorValue(fallbackColor))
}

export const MapChart = React.forwardRef<HTMLDivElement, MapChartProps>(
  (
    {
      features = [],
      locations = [],
      title = 'Map chart',
      metric,
      metricLabel = 'Value',
      trend,
      height = DEFAULT_MAP_HEIGHT,
      mapMaxWidth = DEFAULT_MAP_MAX_WIDTH,
      projection = DEFAULT_PROJECTION,
      summaryLimit = 5,
      showSummary = true,
      showZoomControls = true,
      otherLabel = 'Other countries',
      otherValue,
      valueFormatter = defaultValueFormatter,
      emptyMessage = 'Add GeoJSON features to render the map.',
      className,
      ...props
    },
    ref,
  ) => {
    const chartRootRef = React.useRef<HTMLDivElement | null>(null)
    const [zoom, setZoom] = React.useState(1)
    const paletteSignature = useChartPaletteSignature()
    const safeHeight = Math.max(height, 240)
    const coloredLocations = React.useMemo(
      () =>
        locations.map((location, index) => ({
          ...location,
          color: resolveChartColorValue(location.color, getChartSeriesColor(index)),
        })),
      [locations],
    )
    const metricLabelText = typeof metricLabel === 'string' ? metricLabel : 'Value'
    const titleText = typeof title === 'string' ? title : 'Map chart'
    const otherLabelText = typeof otherLabel === 'string' ? otherLabel : 'Other locations'
    const summary = React.useMemo(
      () =>
        createMapChartSummaryModel({
          locations: coloredLocations,
          title: titleText,
          summaryLimit,
          otherLabel: otherLabelText,
          valueFormatter,
          resolveColor: resolveMapChartSummaryColor,
        }),
      [coloredLocations, otherLabelText, summaryLimit, titleText, valueFormatter],
    )
    const metricValue = metric ?? summary.totalLabel
    const resolvedOtherValue = otherValue ?? summary.other?.valueLabel ?? null
    const mapAriaLabel = summary.summaryLabel

    return (
      <div
        ref={node => {
          chartRootRef.current = node
          assignForwardedRef(ref, node)
        }}
        className={cn('overflow-hidden rounded-lg border border-border/70 bg-background shadow-sm', className)}
        {...props}
      >
        <div className={cn('grid', showSummary ? 'sm:grid-cols-[18rem_minmax(0,1fr)]' : undefined)}>
          {showSummary ? (
            <aside className="border-border/70 border-b p-5 sm:border-r sm:border-b-0">
              <Text size="lg" weight="bold" className="block text-foreground">
                {title}
              </Text>

              <div className="mt-8">
                <div className="flex flex-wrap items-center gap-2">
                  <Text as="span" size="3x" weight="bold" className="leading-none text-foreground">
                    {metricValue}
                  </Text>
                  {trend ? (
                    <span className="rounded-md bg-success-soft px-2 py-1 font-medium text-success-text text-xs">
                      {trend}
                    </span>
                  ) : null}
                </div>
                <Text as="p" size="sm" className="mt-2 text-muted-foreground">
                  {metricLabel}
                </Text>
              </div>

              <div className="mt-8 grid gap-4">
                {summary.items.map(location => (
                  <div key={location.id} className="flex min-w-0 items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: location.color }} />
                      <Text as="span" className="truncate text-muted-foreground">
                        {location.name}
                        {location.flag ? <span className="ml-1">{location.flag}</span> : null}
                      </Text>
                    </div>
                    <Text as="span" className="shrink-0 text-foreground tabular-nums">
                      {location.valueLabel}
                    </Text>
                  </div>
                ))}
                {otherLabel && resolvedOtherValue != null ? (
                  <div className="flex min-w-0 items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ background: summary.other?.color ?? 'var(--color-neutral-soft)' }}
                      />
                      <Text as="span" className="truncate text-muted-foreground">
                        {otherLabel}
                      </Text>
                    </div>
                    <Text as="span" className="shrink-0 text-foreground tabular-nums">
                      {resolvedOtherValue}
                    </Text>
                  </div>
                ) : null}
              </div>
            </aside>
          ) : null}

          <div className="min-w-0 overflow-hidden p-4">
            <div className="relative mx-auto w-full" style={{ maxWidth: mapMaxWidth }}>
              {showZoomControls ? (
                <Row align="center" gap="1" className="absolute top-0 right-0 z-10">
                  <IconButton
                    title="Zoom out"
                    aria-label="Zoom out"
                    size="md"
                    variant="outline"
                    className="font-semibold text-sm"
                    onClick={() => setZoom(current => Math.max(0.8, Number((current - 0.1).toFixed(2))))}
                  >
                    -
                  </IconButton>
                  <IconButton
                    title="Zoom in"
                    aria-label="Zoom in"
                    size="md"
                    variant="outline"
                    className="font-semibold text-sm"
                    onClick={() => setZoom(current => Math.min(1.6, Number((current + 0.1).toFixed(2))))}
                  >
                    +
                  </IconButton>
                </Row>
              ) : null}

              {features.length > 0 ? (
                <React.Suspense fallback={<div className="rounded-md bg-muted/20" style={{ height: safeHeight }} />}>
                  <MapChartCanvas
                    features={features}
                    locations={coloredLocations}
                    height={safeHeight}
                    projection={projection}
                    zoom={zoom}
                    metricLabel={metricLabelText}
                    valueFormatter={valueFormatter}
                    className="block w-full text-foreground"
                    label={mapAriaLabel}
                    paletteSignature={paletteSignature}
                  />
                </React.Suspense>
              ) : (
                <div
                  className="flex items-center justify-center rounded-md border border-border/70 border-dashed bg-muted/20 text-muted-foreground text-sm"
                  style={{ height: safeHeight }}
                >
                  {emptyMessage}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  },
)

MapChart.displayName = 'MapChart'
