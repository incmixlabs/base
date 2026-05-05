import type * as React from 'react'
import type { ScrollAreaProps } from './ScrollArea'

export type ScrollAreaWrapperItem = {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  content?: React.ReactNode
  leading?: React.ReactNode
  trailing?: React.ReactNode
}

export type ScrollAreaWrapperData = ScrollAreaWrapperItem[]

export type ScrollAreaWrapperRenderItem = (
  item: ScrollAreaWrapperItem,
  defaults: {
    leading: React.ReactNode
    title: React.ReactNode
    description: React.ReactNode
    trailing: React.ReactNode
    content: React.ReactNode
  },
) => Partial<{
  leading: React.ReactNode
  title: React.ReactNode
  description: React.ReactNode
  trailing: React.ReactNode
  content: React.ReactNode
}>

export type ScrollAreaWrapperProps = Omit<ScrollAreaProps, 'children'> & {
  data: ScrollAreaWrapperData
  contentClassName?: string
  itemClassName?: string
  renderItem?: ScrollAreaWrapperRenderItem
}
