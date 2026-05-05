'use client'

import { Flex } from '@/layouts/flex/Flex'
import { cn } from '@/lib/utils'
import { Tooltip } from './Tooltip'
import type { TooltipWrapperItem, TooltipWrapperProps, TooltipWrapperRenderItem } from './tooltip-wrapper.types'

function ItemRow({ item, renderItem }: { item: TooltipWrapperItem; renderItem?: TooltipWrapperRenderItem }) {
  const defaultRender = (
    <div className="rounded-md border border-border/60 bg-background/60 p-2">
      <div className="text-xs text-muted-foreground">{item.label}</div>
      {item.value ? <div className="text-sm font-medium text-foreground">{item.value}</div> : null}
      {item.description ? <div className="mt-1 text-xs text-muted-foreground">{item.description}</div> : null}
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
  return (
    <Tooltip.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      <Tooltip.Trigger render={<span className={cn('inline-flex', className)} />}>{trigger}</Tooltip.Trigger>
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
          {data.title ? <div className="text-sm font-semibold">{data.title}</div> : null}
          {data.description ? <div className="text-xs text-muted-foreground">{data.description}</div> : null}
          {data.items?.length ? (
            <Flex direction="column" gap="2">
              {data.items.map(item => (
                <ItemRow key={item.id} item={item} renderItem={renderItem} />
              ))}
            </Flex>
          ) : null}
          {data.footer ? <div className="text-xs text-muted-foreground">{data.footer}</div> : null}
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
