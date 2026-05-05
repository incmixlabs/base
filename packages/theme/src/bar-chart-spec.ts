export type BarChartDatum = {
  label: string
  value: number
}

export type BarChartSpecColors = {
  foreground: string
  muted: string
  border: string
  fill: string
  fillSoft: string
}

export type CreateBarChartSpecOptions = {
  colors: BarChartSpecColors
  showValueLabels?: boolean
  valueLabelOffset?: number
}

export type BarChartSpec = Record<string, unknown>

function getBarChartDomainMax(data: readonly BarChartDatum[]) {
  const maxValue = data.reduce((max, item) => Math.max(max, Number.isFinite(item.value) ? item.value : 0), 0)
  return maxValue > 0 ? Math.ceil(maxValue * 1.24) : 1
}

export function createBarChartSpec(
  data: readonly BarChartDatum[],
  { colors, showValueLabels = true, valueLabelOffset = 0 }: CreateBarChartSpecOptions,
): BarChartSpec {
  const safeData = data.map(item => ({
    ...item,
    value: Number.isFinite(item.value) ? item.value : 0,
  }))

  return {
    type: 'interval',
    data: safeData,
    encode: {
      x: 'label',
      y: 'value',
    },
    scale: {
      x: { padding: 0.36 },
      y: { domainMax: getBarChartDomainMax(safeData), nice: true },
    },
    axis: {
      x: {
        title: false,
        labelFill: colors.muted,
        labelFontSize: 12,
        labelAutoRotate: false,
        line: false,
        tick: false,
      },
      y: {
        title: false,
        labelFill: colors.muted,
        labelFontSize: 11,
        grid: true,
        gridStroke: colors.border,
        gridLineDash: [4, 6],
        line: false,
        tick: false,
      },
    },
    style: {
      fill: colors.fill,
      radiusTopLeft: 10,
      radiusTopRight: 10,
      maxWidth: 72,
    },
    labels: showValueLabels
      ? [
          {
            text: 'value',
            position: 'top',
            fill: colors.foreground,
            fontSize: 12,
            fontWeight: 700,
            dy: -valueLabelOffset,
          },
        ]
      : [],
    tooltip: {
      title: 'label',
      items: [{ field: 'value', name: 'Value' }],
    },
    state: {
      active: {
        fill: colors.fill,
        stroke: colors.foreground,
        lineWidth: 1,
        shadowColor: colors.fillSoft,
        shadowBlur: 10,
      },
      inactive: { opacity: 0.62 },
    },
    interaction: {
      tooltip: {
        marker: false,
      },
      elementHighlight: {
        background: true,
      },
    },
    animate: {
      enter: {
        type: 'growInY',
        duration: 520,
      },
    },
  }
}
