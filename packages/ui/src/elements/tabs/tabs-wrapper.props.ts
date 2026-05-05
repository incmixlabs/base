import type * as React from 'react'
import type { TabsRootProps } from './Tabs'

export type TabsWrapperItem = {
  value: string
  label: React.ReactNode
  content: React.ReactNode
  disabled?: boolean
  active?: boolean
}

export type TabsWrapperData = TabsWrapperItem[]

export type TabsWrapperRenderItem = (
  item: TabsWrapperItem,
  defaults: { trigger: React.ReactNode; content: React.ReactNode },
) => Partial<{ trigger: React.ReactNode; content: React.ReactNode }>

export type TabsWrapperProps = Omit<TabsRootProps, 'children' | 'onValueChange'> & {
  data: TabsWrapperData
  onValueChange?: (value: string) => void
  onTabChange?: (item: TabsWrapperItem, value: string) => void
  renderItem?: TabsWrapperRenderItem
}
