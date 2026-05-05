'use client'

import {
  createMapChartModel,
  createMapChartModelColors,
  createMapChartSpec,
  getChartSeriesColorKey,
  type MapChartLocationColorResolver,
  resolveChartThemeColor,
} from '@incmix/theme'
import * as React from 'react'
import { useOptionalThemeProviderContext } from '@/theme/theme-provider.context'
import { createChartStyleThemeTokenOutput } from '../chart-colors'
import type { MapChartFeature, MapChartLocationDatum } from './MapChart'
import type { MapChartProjection } from './props'

export type MapChartCanvasProps = {
  features: MapChartFeature[]
  locations: MapChartLocationDatum[]
  height: number
  projection: MapChartProjection
  zoom: number
  metricLabel: string
  valueFormatter: (value: number) => string
  className?: string
  label: string
  paletteSignature?: string
}

export function MapChartCanvas({
  features,
  locations,
  height,
  projection,
  zoom,
  metricLabel,
  valueFormatter,
  className,
  label,
  paletteSignature,
}: MapChartCanvasProps) {
  const containerRef = React.useRef<HTMLDivElement | null>(null)
  const theme = useOptionalThemeProviderContext()
  const themeColorSignature = JSON.stringify({
    appearance: theme?.appearance,
    semanticColors: theme?.semanticColors,
  })

  React.useEffect(() => {
    const container = containerRef.current
    if (!container || features.length === 0) return

    let disposed = false
    let chart:
      | {
          destroy: () => void
          options: (options: Record<string, unknown>) => unknown
          render: () => Promise<unknown>
        }
      | undefined

    const chartTheme = createChartStyleThemeTokenOutput(window.getComputedStyle(container))
    const mapColors = createMapChartModelColors(chartTheme)
    const resolveLocationColor: MapChartLocationColorResolver = ({ location, index }) => {
      const fallbackColor = getChartSeriesColorKey(index)
      return resolveChartThemeColor({ theme: chartTheme, color: location.color, fallbackColor, role: 'fill' })
    }
    const mapModel = createMapChartModel({
      features,
      locations,
      colors: mapColors,
      valueFormatter,
      resolveLocationColor,
    })

    container.dataset.themeColorSignature = themeColorSignature
    container.dataset.chartPaletteSignature = paletteSignature ?? ''
    container.replaceChildren()

    const setup = async () => {
      try {
        const { Chart } = await import('@antv/g2')
        if (disposed) return

        chart = new Chart({
          container,
          autoFit: true,
          height,
          padding: 0,
        })

        chart.options(
          createMapChartSpec({
            features: mapModel.features,
            projection,
            metricLabel,
            baseFill: mapColors.baseFill,
            baseStroke: mapColors.baseStroke,
            activeStroke: mapColors.activeStroke,
          }) as Record<string, unknown>,
        )

        await chart.render()
      } catch (error) {
        if (!disposed) {
          console.error('Failed to render MapChartCanvas', error)
        }
      }
    }

    void setup()

    return () => {
      disposed = true
      chart?.destroy()
      container.replaceChildren()
    }
  }, [features, height, locations, metricLabel, paletteSignature, projection, themeColorSignature, valueFormatter])

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        height,
        transform: zoom === 1 ? undefined : `scale(${zoom})`,
        transformOrigin: 'center',
        transition: 'transform 160ms ease',
      }}
      role="img"
      aria-label={label}
    />
  )
}
