import type * as React from 'react'
import type { CommandSearchItem } from './CommandSearch'

export type CommandWrapperItem = {
  id: string
  label: string
  description?: string
  keywords?: string[]
  shortcut?: string[]
  href?: string
  onSelect?: () => void
}

export type CommandWrapperSection = {
  id: string
  label?: string
  items: CommandWrapperItem[]
}

export type CommandWrapperData = {
  sections: CommandWrapperSection[]
}

export type CommandWrapperRenderItem = (
  section: CommandWrapperSection,
  item: CommandWrapperItem,
  defaultItem: CommandSearchItem,
) => CommandSearchItem

export type CommandWrapperProps = {
  data: CommandWrapperData
  triggerLabel?: string
  triggerClassName?: string
  className?: string
  children?: React.ReactNode
  onSelectItem?: (item: CommandWrapperItem, section: CommandWrapperSection) => void
  onNavigate?: (href: string) => void
  renderItem?: CommandWrapperRenderItem
  renderTrigger?: (defaultTrigger: React.ReactNode) => React.ReactNode
}
