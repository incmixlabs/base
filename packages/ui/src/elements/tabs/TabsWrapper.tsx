'use client'

import * as React from 'react'
import { Tabs } from './Tabs'
import type { TabsWrapperProps } from './tabs-wrapper.props'

export function TabsWrapper({
  data,
  defaultValue,
  onValueChange,
  onTabChange,
  renderItem,
  ...rootProps
}: TabsWrapperProps) {
  const values = React.useMemo(() => data.map(item => item.value), [data])
  const duplicateValue = React.useMemo(() => {
    const seen = new Set<string>()
    for (const value of values) {
      if (seen.has(value)) return value
      seen.add(value)
    }
    return null
  }, [values])

  if (duplicateValue) {
    throw new Error(`TabsWrapper data values must be unique. Duplicate value: "${duplicateValue}"`)
  }

  const hasExplicitDefault = defaultValue !== undefined
  const derivedDefaultValue = React.useMemo(() => {
    if (hasExplicitDefault) return defaultValue
    return data.find(item => item.active)?.value ?? data[0]?.value
  }, [data, defaultValue, hasExplicitDefault])

  const itemsByValue = React.useMemo(() => {
    return new Map(data.map(item => [item.value, item] as const))
  }, [data])

  const handleValueChange = React.useCallback(
    (value: string) => {
      onValueChange?.(value)
      const item = itemsByValue.get(value)
      if (item) onTabChange?.(item, value)
    },
    [itemsByValue, onTabChange, onValueChange],
  )

  const renderedItems = React.useMemo(() => {
    return data.map(item => {
      const defaultTrigger = (
        <Tabs.Trigger key={`${item.value}-trigger`} value={item.value} disabled={item.disabled}>
          {item.label}
        </Tabs.Trigger>
      )
      const defaultContent = (
        <Tabs.Content key={`${item.value}-content-default`} value={item.value}>
          {item.content}
        </Tabs.Content>
      )
      const overrides = renderItem?.(item, { trigger: defaultTrigger, content: defaultContent })

      return {
        key: item.value,
        trigger: overrides?.trigger ?? defaultTrigger,
        content: overrides?.content ?? defaultContent,
      }
    })
  }, [data, renderItem])

  return (
    <Tabs.Root {...rootProps} defaultValue={derivedDefaultValue} onValueChange={handleValueChange}>
      <Tabs.List>
        {renderedItems.map(({ key, trigger }) => (
          <React.Fragment key={key}>{trigger}</React.Fragment>
        ))}
      </Tabs.List>
      {renderedItems.map(({ key, content }) => (
        <React.Fragment key={`${key}-content`}>{content}</React.Fragment>
      ))}
    </Tabs.Root>
  )
}

TabsWrapper.displayName = 'TabsWrapper'

export type { TabsWrapperData, TabsWrapperItem, TabsWrapperProps, TabsWrapperRenderItem } from './tabs-wrapper.props'
