'use client'

import * as React from 'react'
import { Flex } from '@/layouts/flex/Flex'
import { cn } from '@/lib/utils'
import { Text } from '@/typography'
import { Tooltip } from './Tooltip'
import type { TooltipWrapperItem, TooltipWrapperProps, TooltipWrapperRenderItem } from './tooltip-wrapper.types'

function hasRenderableContent(value: React.ReactNode) {
  return value != null && typeof value !== 'boolean'
}

function hasItemContent(item: TooltipWrapperItem) {
  return hasRenderableContent(item.label) || hasRenderableContent(item.value) || hasRenderableContent(item.description)
}

function ItemRow({ item, renderItem }: { item: TooltipWrapperItem; renderItem?: TooltipWrapperRenderItem }) {
  const defaultRender = hasItemContent(item) ? (
    <div className="rounded-md border border-neutral bg-neutral-surface p-2">
      {hasRenderableContent(item.label) ? (
        <Text as="div" size="xs" color="neutral" muted>
          {item.label}
        </Text>
      ) : null}
      {hasRenderableContent(item.value) ? <div className="text-sm font-medium text-neutral">{item.value}</div> : null}
      {hasRenderableContent(item.description) ? (
        <Text as="div" size="xs" color="neutral" muted className="mt-1">
          {item.description}
        </Text>
      ) : null}
    </div>
  ) : null
  return <>{renderItem ? renderItem(item, defaultRender) : defaultRender}</>
}

export function TooltipWrapper({
  data,
  trigger,
  open,
  defaultOpen,
  onOpenChange,
  showArrow = true,
  renderItem,
  variant = 'solid',
  color = 'inverse',
  highContrast = false,
  radius,
  size = 'sm',
  maxWidth = 'sm',
  side = 'top',
  align = 'center',
  sideOffset = 6,
  alignOffset = 0,
  className,
  contentClassName,
}: TooltipWrapperProps) {
  const elementTrigger = React.isValidElement(trigger)
    ? (trigger as React.ReactElement<{ className?: string; children?: React.ReactNode }>)
    : null
  const hasItemsContent = Boolean(data.items?.length && (renderItem || data.items.some(hasItemContent)))

  return (
    <Tooltip.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      {elementTrigger ? (
        <Tooltip.Trigger
          render={
            className
              ? React.cloneElement(elementTrigger, {
                  className: cn(elementTrigger.props.className, className),
                })
              : elementTrigger
          }
        >
          {elementTrigger.props.children}
        </Tooltip.Trigger>
      ) : (
        <Tooltip.Trigger render={<span className={cn('inline-flex', className)} />}>{trigger}</Tooltip.Trigger>
      )}
      <Tooltip.Content
        variant={variant}
        color={color}
        highContrast={highContrast}
        radius={radius}
        size={size}
        maxWidth={maxWidth}
        side={side}
        align={align}
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        className={contentClassName}
      >
        {showArrow ? <Tooltip.Arrow variant={variant} color={color} /> : null}
        <Flex direction="column" gap="2">
          {hasRenderableContent(data.title) ? <div className="text-sm font-semibold">{data.title}</div> : null}
          {hasRenderableContent(data.description) ? (
            <Text as="div" size="xs" color="neutral" muted>
              {data.description}
            </Text>
          ) : null}
          {hasItemsContent ? (
            <Flex direction="column" gap="2">
              {data.items?.map(item => (
                <ItemRow key={item.id} item={item} renderItem={renderItem} />
              ))}
            </Flex>
          ) : null}
          {hasRenderableContent(data.footer) ? (
            <Text as="div" size="xs" color="neutral" muted>
              {data.footer}
            </Text>
          ) : null}
        </Flex>
      </Tooltip.Content>
    </Tooltip.Root>
  )
}

export type {
  TooltipWrapperData,
  TooltipWrapperItem,
  TooltipWrapperProps,
  TooltipWrapperRenderItem,
} from './tooltip-wrapper.types'
