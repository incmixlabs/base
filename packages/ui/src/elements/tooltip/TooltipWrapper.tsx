'use client'

import * as React from 'react'
import { Flex } from '@/layouts/flex/Flex'
import { cn } from '@/lib/utils'
import { Tooltip } from './Tooltip'
import type { TooltipWrapperItem, TooltipWrapperProps, TooltipWrapperRenderItem } from './tooltip-wrapper.types'

function ItemRow({ item, renderItem }: { item: TooltipWrapperItem; renderItem?: TooltipWrapperRenderItem }) {
  const defaultRender = (
    <div className="rounded-md border border-neutral bg-neutral-surface p-2">
      <div className="text-xs text-neutral opacity-70">{item.label}</div>
      {item.value != null ? <div className="text-sm font-medium text-neutral">{item.value}</div> : null}
      {item.description != null ? <div className="mt-1 text-xs text-neutral opacity-70">{item.description}</div> : null}
    </div>
  )
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
          {data.title != null ? <div className="text-sm font-semibold">{data.title}</div> : null}
          {data.description != null ? <div className="text-xs text-neutral opacity-70">{data.description}</div> : null}
          {data.items?.length ? (
            <Flex direction="column" gap="2">
              {data.items.map(item => (
                <ItemRow key={item.id} item={item} renderItem={renderItem} />
              ))}
            </Flex>
          ) : null}
          {data.footer != null ? <div className="text-xs text-neutral opacity-70">{data.footer}</div> : null}
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
