'use client'

import * as React from 'react'
import { Timeline, type TimelineRootProps } from './Timeline'

export type TimelineWrapperItem = {
  step: number
  title: React.ReactNode
  date?: React.ReactNode
  content?: React.ReactNode
  indicator?: React.ReactNode
}

export type TimelineWrapperData = TimelineWrapperItem[]

export type TimelineWrapperRenderItem = (
  item: TimelineWrapperItem,
  defaults: {
    indicator: React.ReactNode
    separator: React.ReactNode
    header: React.ReactNode
    content: React.ReactNode
  },
) => Partial<{
  indicator: React.ReactNode
  separator: React.ReactNode
  header: React.ReactNode
  content: React.ReactNode
}>

export type TimelineWrapperProps = Omit<TimelineRootProps, 'children'> & {
  data: TimelineWrapperData
  renderItem?: TimelineWrapperRenderItem
}

export function TimelineWrapper({ data, renderItem, ...rootProps }: TimelineWrapperProps) {
  const steps = React.useMemo(() => data.map(item => item.step), [data])
  const duplicateStep = React.useMemo(() => {
    const seen = new Set<number>()
    for (const step of steps) {
      if (seen.has(step)) return step
      seen.add(step)
    }
    return null
  }, [steps])

  if (duplicateStep !== null) {
    throw new Error(`TimelineWrapper data steps must be unique. Duplicate step: ${duplicateStep}`)
  }

  const renderedItems = React.useMemo(() => {
    return data.map(item => {
      // biome-ignore lint/correctness/useJsxKeyInIterable: children of keyed Timeline.Item, not direct list elements
      const defaultIndicator = <Timeline.Indicator>{item.indicator}</Timeline.Indicator>
      // biome-ignore lint/correctness/useJsxKeyInIterable: children of keyed Timeline.Item
      const defaultSeparator = <Timeline.Separator />
      const defaultHeader = (
        // biome-ignore lint/correctness/useJsxKeyInIterable: children of keyed Timeline.Item
        <Timeline.Header>
          <Timeline.Title>{item.title}</Timeline.Title>
          {item.date != null ? <Timeline.Date>{item.date}</Timeline.Date> : null}
        </Timeline.Header>
      )
      // biome-ignore lint/correctness/useJsxKeyInIterable: children of keyed Timeline.Item
      const defaultContent = item.content != null ? <Timeline.Content>{item.content}</Timeline.Content> : null

      const overrides = renderItem?.(item, {
        indicator: defaultIndicator,
        separator: defaultSeparator,
        header: defaultHeader,
        content: defaultContent,
      })

      return {
        step: item.step,
        indicator: overrides?.indicator ?? defaultIndicator,
        separator: overrides?.separator ?? defaultSeparator,
        header: overrides?.header ?? defaultHeader,
        content: overrides?.content ?? defaultContent,
      }
    })
  }, [data, renderItem])

  return (
    <Timeline.Root {...rootProps}>
      {renderedItems.map(({ step, indicator, separator, header, content }) => (
        <Timeline.Item key={step} step={step}>
          {indicator}
          {separator}
          {header}
          {content}
        </Timeline.Item>
      ))}
    </Timeline.Root>
  )
}

TimelineWrapper.displayName = 'TimelineWrapper'
