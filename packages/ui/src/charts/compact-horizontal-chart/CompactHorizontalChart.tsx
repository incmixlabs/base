'use client'

import {
  type ChartValueFormatConfig,
  createPartToWholeChartModel,
  type PartToWholeChartColorResolver,
  type PartToWholeDatum,
} from '@incmix/theme'
import * as React from 'react'
import { useThemeRadius } from '@/elements/utils'
import { Box } from '@/layouts/box/Box'
import { Column, Row } from '@/layouts/flex/Flex'
import { cn } from '@/lib/utils'
import { normalizeEnumPropValue } from '@/theme/props/prop-def'
import type { Radius } from '@/theme/tokens'
import { Text } from '@/typography/text/Text'
import { type ChartPaletteColor, getChartSeriesColor, resolveChartColorValue } from '../chart-colors'
import {
  compactHorizontalChartEmptyClass,
  compactHorizontalChartMutedTextClass,
  compactHorizontalChartRootClass,
  compactHorizontalChartTextClass,
  compactHorizontalChartTrackClass,
} from './CompactHorizontalChart.css'
import {
  type CompactHorizontalChartLabelPlacement,
  type CompactHorizontalChartRadius,
  compactHorizontalChartPropDefs,
} from './props'

export type CompactHorizontalChartDatum = PartToWholeDatum

export interface CompactHorizontalChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: CompactHorizontalChartDatum[]
  title?: string
  description?: string
  color?: ChartPaletteColor
  maxValue?: number
  minVisiblePercent?: number
  labelPlacement?: CompactHorizontalChartLabelPlacement
  showValues?: boolean
  valueFormat?: ChartValueFormatConfig
  valueFormatter?: (value: number) => string
  radius?: CompactHorizontalChartRadius
  emptyMessage?: React.ReactNode
}

function getChartSurfaceRadius(radius: Radius): CompactHorizontalChartRadius {
  return radius === 'full' ? 'lg' : radius
}

const resolveCompactHorizontalChartColor: PartToWholeChartColorResolver = ({ color, index }) =>
  resolveChartColorValue(color, getChartSeriesColor(index))

export const CompactHorizontalChart = React.forwardRef<HTMLDivElement, CompactHorizontalChartProps>(
  (
    {
      data,
      title,
      description,
      color,
      maxValue,
      minVisiblePercent = compactHorizontalChartPropDefs.minVisiblePercent.default,
      labelPlacement = compactHorizontalChartPropDefs.labelPlacement.default,
      showValues = compactHorizontalChartPropDefs.showValues.default,
      valueFormat,
      valueFormatter,
      radius: radiusProp,
      emptyMessage = compactHorizontalChartPropDefs.emptyMessage.default,
      className,
      style,
      'aria-label': ariaLabel,
      ...props
    },
    ref,
  ) => {
    const safeColor = color
      ? normalizeEnumPropValue(compactHorizontalChartPropDefs.color, color)
      : compactHorizontalChartPropDefs.color.default
    const safeRadius =
      radiusProp === undefined
        ? undefined
        : (normalizeEnumPropValue(compactHorizontalChartPropDefs.radius, radiusProp) as Radius | undefined)
    const surfaceRadius = getChartSurfaceRadius(useThemeRadius(safeRadius))
    const safeLabelPlacement =
      normalizeEnumPropValue(compactHorizontalChartPropDefs.labelPlacement, labelPlacement) ??
      compactHorizontalChartPropDefs.labelPlacement.default
    const model = React.useMemo(
      () =>
        createPartToWholeChartModel(data, {
          title: title ?? 'Compact horizontal chart',
          color: safeColor,
          total: maxValue,
          minVisiblePercentage: minVisiblePercent,
          valueFormat,
          valueFormatter,
          resolveColor: resolveCompactHorizontalChartColor,
        }),
      [data, maxValue, minVisiblePercent, safeColor, title, valueFormat, valueFormatter],
    )
    const chartLabel = ariaLabel ?? model.summaryLabel
    return (
      <Box
        ref={ref}
        aria-label={chartLabel}
        className={cn(compactHorizontalChartRootClass, className)}
        p="5"
        radius={surfaceRadius}
        role="img"
        style={style}
        {...props}
      >
        <Column gap="5">
          {title || description ? (
            <Column gap="1">
              {title ? (
                <Text size="lg" weight="bold" className={compactHorizontalChartTextClass}>
                  {title}
                </Text>
              ) : null}
              {description ? (
                <Text size="sm" className={compactHorizontalChartMutedTextClass}>
                  {description}
                </Text>
              ) : null}
            </Column>
          ) : null}

          {model.items.length > 0 ? (
            <Column gap="4">
              {model.items.map((item, index) => {
                const value = showValues ? (
                  <Box
                    key={`${item.id}-${index}-value`}
                    asChild
                    flexShrink="0"
                    minWidth={safeLabelPlacement === 'left' ? '2.5rem' : undefined}
                  >
                    <Text
                      as="span"
                      align={safeLabelPlacement === 'left' ? 'right' : undefined}
                      className={cn(
                        'tabular-nums',
                        item.hasValue ? compactHorizontalChartTextClass : compactHorizontalChartMutedTextClass,
                      )}
                    >
                      {item.valueLabel}
                    </Text>
                  </Box>
                ) : null
                const track = (
                  <Box
                    key={`${item.id}-${index}-track`}
                    aria-hidden="true"
                    className={compactHorizontalChartTrackClass}
                    flexShrink="0"
                    height="0.75rem"
                    overflow="hidden"
                    radius={surfaceRadius}
                    title={`${item.label}: ${item.valueLabel}`}
                    width="full"
                  >
                    <Box
                      className="transition-[width]"
                      height="100%"
                      radius={surfaceRadius}
                      style={{
                        width: `${item.barPercentage}%`,
                        minWidth: item.percentage > 0 ? 4 : undefined,
                        backgroundColor: item.fillColor,
                      }}
                    />
                  </Box>
                )

                return safeLabelPlacement === 'left' ? (
                  <Row key={`${item.id}-${index}`} align="center" gap="3" minWidth="0">
                    <Box asChild flexBasis="10rem" flexShrink="0" minWidth="0">
                      <Text as="span" truncate className={compactHorizontalChartTextClass} title={item.label}>
                        {item.label}
                      </Text>
                    </Box>
                    <Box flexGrow="1" minWidth="0">
                      {track}
                    </Box>
                    {value}
                  </Row>
                ) : (
                  <Column key={`${item.id}-${index}`} gap="2" minWidth="0">
                    <Row align="baseline" gap="3" justify="between" minWidth="0">
                      <Box asChild minWidth="0">
                        <Text as="span" truncate className={compactHorizontalChartTextClass} title={item.label}>
                          {item.label}
                        </Text>
                      </Box>
                      {value}
                    </Row>
                    {track}
                  </Column>
                )
              })}
            </Column>
          ) : (
            <Column
              align="center"
              className={compactHorizontalChartEmptyClass}
              justify="center"
              minHeight="8rem"
              radius="md"
            >
              <Text as="span" size="sm">
                {emptyMessage}
              </Text>
            </Column>
          )}
        </Column>
      </Box>
    )
  },
)

CompactHorizontalChart.displayName = 'CompactHorizontalChart'
