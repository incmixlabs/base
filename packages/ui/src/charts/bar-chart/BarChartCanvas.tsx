'use client'

import { createBarChartSpec, createBarChartSpecColors } from '@incmix/theme'
import * as React from 'react'
import { useOptionalThemeProviderContext } from '@/theme/theme-provider.context'
import { type ChartPaletteColor, createChartStyleThemeTokenOutput } from '../chart-colors'
import type { BarChartDatum } from './BarChart'

export type BarChartCanvasProps = {
  data: BarChartDatum[]
  height: number
  color: ChartPaletteColor
  showValueLabels: boolean
  valueLabelOffset: number
  className?: string
  label: string
  paletteSignature?: string
}

export function BarChartCanvas({
  data,
  height,
  color,
  showValueLabels,
  valueLabelOffset,
  className,
  label,
  paletteSignature,
}: BarChartCanvasProps) {
  const containerRef = React.useRef<HTMLDivElement | null>(null)
  const theme = useOptionalThemeProviderContext()
  const themeColorSignature = JSON.stringify({
    appearance: theme?.appearance,
    semanticColors: theme?.semanticColors,
  })

  React.useEffect(() => {
    const container = containerRef.current
    if (!container || data.length === 0) return

    let disposed = false
    let chart:
      | {
          destroy: () => void
          options: (options: Record<string, unknown>) => unknown
          render: () => Promise<unknown>
        }
      | undefined
    const styles = window.getComputedStyle(container)
    const chartTheme = createChartStyleThemeTokenOutput(styles)
    const colors = createBarChartSpecColors({ theme: chartTheme, color })

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
          paddingLeft: 44,
          paddingRight: 12,
          paddingTop: showValueLabels ? Math.max(34, valueLabelOffset + 24) : 18,
          paddingBottom: 42,
        })

        chart.options(
          createBarChartSpec(data, {
            colors,
            showValueLabels,
            valueLabelOffset,
          }),
        )

        await chart.render()
      } catch (error) {
        if (!disposed) {
          console.error('Failed to render BarChartCanvas', error)
        }
      }
    }

    void setup()

    return () => {
      disposed = true
      chart?.destroy()
      container.replaceChildren()
    }
  }, [data, color, height, paletteSignature, showValueLabels, themeColorSignature, valueLabelOffset])

  return <div ref={containerRef} className={className} style={{ height }} role="img" aria-label={label} />
}
