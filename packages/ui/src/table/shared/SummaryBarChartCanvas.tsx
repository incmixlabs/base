'use client'

import type { Chart as G2Chart } from '@antv/g2'
import { createSummaryBarChartSpec, createSummaryBarChartSpecColors, type SummaryBarChartModel } from '@incmix/theme'
import * as React from 'react'
import { createChartStyleThemeTokenOutput } from '@/charts/chart-colors'
import { useOptionalThemeProviderContext } from '@/theme/theme-provider.context'
import type { Color } from '@/theme/tokens'

export type SummaryBarChartCanvasProps = {
  model: SummaryBarChartModel
  height: number
  color: Color
  secondaryColor: Color
  primaryLabel: string
  secondaryLabel: string
  className?: string
  label: string
}

export function SummaryBarChartCanvas({
  model,
  height,
  color,
  secondaryColor,
  primaryLabel,
  secondaryLabel,
  className,
  label,
}: SummaryBarChartCanvasProps) {
  const containerRef = React.useRef<HTMLDivElement | null>(null)
  const theme = useOptionalThemeProviderContext()
  const themeColorSignature = JSON.stringify({
    appearance: theme?.appearance,
    semanticColors: theme?.semanticColors,
  })

  React.useEffect(() => {
    const container = containerRef.current
    if (!container || model.bins.length === 0) return

    let disposed = false
    let chart: G2Chart | undefined
    const chartTheme = createChartStyleThemeTokenOutput(window.getComputedStyle(container))
    const colors = createSummaryBarChartSpecColors({ theme: chartTheme, color, secondaryColor })

    container.dataset.themeColorSignature = themeColorSignature
    container.replaceChildren()

    const setup = async () => {
      try {
        const { Chart } = await import('@antv/g2')
        if (disposed) return

        chart = new Chart({
          container,
          autoFit: true,
          height,
          paddingLeft: 0,
          paddingRight: 0,
          paddingTop: 2,
          paddingBottom: 18,
        })

        chart.options(
          createSummaryBarChartSpec(model, {
            colors,
            primaryLabel,
            secondaryLabel,
          }),
        )

        await chart.render()
      } catch (error) {
        if (!disposed) {
          console.error('Failed to render SummaryBarChartCanvas', error)
        }
      }
    }

    void setup()

    return () => {
      disposed = true
      chart?.destroy()
      container.replaceChildren()
    }
  }, [color, height, model, primaryLabel, secondaryColor, secondaryLabel, themeColorSignature])

  return <div ref={containerRef} className={className} style={{ height }} role="img" aria-label={label} />
}

SummaryBarChartCanvas.displayName = 'SummaryBarChartCanvas'
