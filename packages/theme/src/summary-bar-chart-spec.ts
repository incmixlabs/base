import type { SummaryBarChartModel, SummaryBarChartModelBin } from './summary-bar-chart.js'

export type SummaryBarChartSpecColors = {
  foreground: string
  muted: string
  border: string
  primaryFill: string
  secondaryFill: string
}

export type CreateSummaryBarChartSpecOptions = {
  colors: SummaryBarChartSpecColors
  primaryLabel?: string
  secondaryLabel?: string
}

export type SummaryBarChartSpecDatum = {
  label: string
  segment: string
  value: number
  total: number
}

export type SummaryBarChartSpec = Record<string, unknown>

function createSpecData({
  bins,
  primaryLabel,
  secondaryLabel,
}: {
  bins: readonly SummaryBarChartModelBin[]
  primaryLabel: string
  secondaryLabel: string
}): SummaryBarChartSpecDatum[] {
  return bins.flatMap(bin => [
    {
      label: bin.label,
      segment: primaryLabel,
      value: bin.primary,
      total: bin.value,
    },
    {
      label: bin.label,
      segment: secondaryLabel,
      value: bin.secondary,
      total: bin.value,
    },
  ])
}

export function createSummaryBarChartSpec(
  model: SummaryBarChartModel,
  { colors, primaryLabel = 'Primary', secondaryLabel = 'Secondary' }: CreateSummaryBarChartSpecOptions,
): SummaryBarChartSpec {
  return {
    type: 'interval',
    data: createSpecData({ bins: model.bins, primaryLabel, secondaryLabel }),
    encode: {
      x: 'label',
      y: 'value',
      color: 'segment',
    },
    transform: [{ type: 'stackY' }],
    scale: {
      x: { padding: 0.12 },
      y: { domainMax: model.domainMax, nice: true },
      color: { range: [colors.primaryFill, colors.secondaryFill] },
    },
    axis: {
      x: {
        title: false,
        labelFill: colors.muted,
        labelFontSize: 11,
        labelAutoRotate: false,
        labelAutoHide: true,
        line: false,
        tick: false,
      },
      y: {
        title: false,
        label: false,
        grid: true,
        gridStroke: colors.border,
        gridLineDash: [3, 4],
        line: false,
        tick: false,
      },
    },
    style: {
      radiusTopLeft: 2,
      radiusTopRight: 2,
      maxWidth: 18,
    },
    tooltip: {
      title: 'label',
      items: [
        {
          field: 'value',
          name: (datum: SummaryBarChartSpecDatum) => datum.segment,
        },
        {
          field: 'total',
          name: 'Total',
        },
      ],
    },
    state: {
      active: {
        stroke: colors.foreground,
        lineWidth: 1,
      },
      inactive: {
        opacity: 0.72,
      },
    },
    interaction: {
      tooltip: {
        marker: false,
      },
      elementHighlight: true,
    },
    animate: {
      enter: {
        type: 'growInY',
        duration: 320,
      },
    },
  }
}
