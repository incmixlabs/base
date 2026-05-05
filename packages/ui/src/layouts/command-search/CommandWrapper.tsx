'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { CommandSearchInput, type CommandSearchItem, CommandSearchProvider } from './CommandSearch'
import type {
  CommandWrapperData,
  CommandWrapperItem,
  CommandWrapperProps,
  CommandWrapperRenderItem,
  CommandWrapperSection,
} from './command-wrapper.types'

function toCommandItems({
  data,
  onSelectItem,
  onNavigate,
  renderItem,
}: {
  data: CommandWrapperData
  onSelectItem?: (item: CommandWrapperItem, section: CommandWrapperSection) => void
  onNavigate?: (href: string) => void
  renderItem?: CommandWrapperRenderItem
}): CommandSearchItem[] {
  return data.sections.flatMap(section =>
    section.items.map(item => {
      const defaultItem: CommandSearchItem = {
        id: item.id,
        label: item.label,
        description: item.description,
        keywords: item.keywords,
        shortcut: item.shortcut,
        section: section.label,
        onSelect: () => {
          item.onSelect?.()
          onSelectItem?.(item, section)
          if (!item.onSelect && item.href && typeof window !== 'undefined') {
            if (onNavigate) {
              onNavigate(item.href)
            } else {
              window.location.assign(item.href)
            }
          }
        },
      }
      return renderItem ? renderItem(section, item, defaultItem) : defaultItem
    }),
  )
}

export function CommandWrapper({
  data,
  triggerLabel = 'Search...',
  triggerClassName,
  className,
  children,
  onSelectItem,
  onNavigate,
  renderItem,
  renderTrigger,
}: CommandWrapperProps) {
  const items = React.useMemo(
    () => toCommandItems({ data, onSelectItem, onNavigate, renderItem }),
    [data, onSelectItem, onNavigate, renderItem],
  )
  const defaultTrigger = <CommandSearchInput triggerLabel={triggerLabel} className={triggerClassName} />

  return (
    <CommandSearchProvider items={items}>
      <div className={cn('inline-flex w-full items-center gap-2', className)}>
        {renderTrigger ? renderTrigger(defaultTrigger) : defaultTrigger}
        {children}
      </div>
    </CommandSearchProvider>
  )
}

export type {
  CommandWrapperData,
  CommandWrapperItem,
  CommandWrapperProps,
  CommandWrapperRenderItem,
  CommandWrapperSection,
} from './command-wrapper.types'
