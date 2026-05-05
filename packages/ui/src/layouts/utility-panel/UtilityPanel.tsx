'use client'

import { Button } from '@/elements/button/Button'
import { Sheet } from '@/elements/sheet/Sheet'
import { cn } from '@/lib/utils'

export interface UtilityPanelProps {
  triggerLabel: React.ReactNode
  title: React.ReactNode
  description?: React.ReactNode
  children: React.ReactNode
  side?: 'left' | 'right'
  className?: string
  triggerClassName?: string
}

export function UtilityPanel({
  triggerLabel,
  title,
  description,
  children,
  side = 'right',
  className,
  triggerClassName,
}: UtilityPanelProps) {
  return (
    <Sheet.Root>
      <Sheet.Trigger asChild>
        <Button size="sm" variant="outline" className={cn('gap-2', triggerClassName)} type="button">
          {triggerLabel}
        </Button>
      </Sheet.Trigger>
      <Sheet.Content side={side} className={className}>
        <Sheet.Header>
          <div>
            <Sheet.Title>{title}</Sheet.Title>
            {description ? <Sheet.Description>{description}</Sheet.Description> : null}
          </div>
          <Sheet.Close />
        </Sheet.Header>
        <Sheet.Body>{children}</Sheet.Body>
      </Sheet.Content>
    </Sheet.Root>
  )
}
