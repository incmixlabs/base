'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { ScrollArea } from './ScrollArea'
import type { ScrollAreaWrapperProps } from './scroll-area-wrapper.types'

function hasContent(value: React.ReactNode) {
  return value !== null && value !== undefined && value !== false
}

export function ScrollAreaWrapper({
  data,
  contentClassName,
  itemClassName,
  renderItem,
  ...rootProps
}: ScrollAreaWrapperProps) {
  const ids = React.useMemo(() => data.map(item => item.id), [data])
  const duplicateId = React.useMemo(() => {
    const seen = new Set<string>()
    for (const id of ids) {
      if (seen.has(id)) return id
      seen.add(id)
    }
    return null
  }, [ids])

  if (duplicateId) {
    throw new Error(`ScrollAreaWrapper data ids must be unique. Duplicate id: "${duplicateId}"`)
  }

  return (
    <ScrollArea {...rootProps}>
      <div className={cn('px-4 py-4 pr-2', contentClassName)}>
        <div className="space-y-3">
          {data.map(item => {
            const defaultLeading = hasContent(item.leading) ? (
              <div className="shrink-0 text-muted-foreground">{item.leading}</div>
            ) : null
            const defaultTitle = hasContent(item.title) ? <div className="text-sm font-medium">{item.title}</div> : null
            const defaultDescription = hasContent(item.description) ? (
              <div className="text-xs text-muted-foreground">{item.description}</div>
            ) : null
            const defaultTrailing = hasContent(item.trailing) ? (
              <div className="shrink-0 text-xs text-muted-foreground">{item.trailing}</div>
            ) : null
            const defaultContent = hasContent(item.content) ? <div className="text-sm">{item.content}</div> : null

            const overrides = renderItem?.(item, {
              leading: defaultLeading,
              title: defaultTitle,
              description: defaultDescription,
              trailing: defaultTrailing,
              content: defaultContent,
            })

            const leading = overrides && 'leading' in overrides ? overrides.leading : defaultLeading
            const title = overrides && 'title' in overrides ? overrides.title : defaultTitle
            const description = overrides && 'description' in overrides ? overrides.description : defaultDescription
            const trailing = overrides && 'trailing' in overrides ? overrides.trailing : defaultTrailing
            const content = overrides && 'content' in overrides ? overrides.content : defaultContent
            const hasHeader =
              hasContent(leading) || hasContent(title) || hasContent(description) || hasContent(trailing)

            return (
              <div
                key={item.id}
                className={cn('rounded-lg border border-border/60 bg-background/60 p-3', itemClassName)}
              >
                {hasHeader && (
                  <div className="flex items-start gap-3">
                    {leading}
                    <div className="min-w-0 flex-1 space-y-1">
                      {title}
                      {description}
                    </div>
                    {trailing}
                  </div>
                )}
                {hasContent(content) ? <div className={cn(hasHeader && 'mt-3')}>{content}</div> : null}
              </div>
            )
          })}
        </div>
      </div>
    </ScrollArea>
  )
}

ScrollAreaWrapper.displayName = 'ScrollAreaWrapper'

export type {
  ScrollAreaWrapperData,
  ScrollAreaWrapperItem,
  ScrollAreaWrapperProps,
  ScrollAreaWrapperRenderItem,
} from './scroll-area-wrapper.types'
