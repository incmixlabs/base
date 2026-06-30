'use client'

import type * as React from 'react'
import { IconButton } from '@/elements/button/IconButton'
import { cn } from '@/lib/utils'
import type { Color, Radius } from '@/theme/tokens'
import { dateCalendarNavButtonColorStyles } from './date-surface.shared.class'

export interface DateCalendarNavButtonProps
  extends Omit<React.ComponentPropsWithoutRef<typeof IconButton>, 'size' | 'variant' | 'color' | 'radius'> {
  color: Color
  radius: Radius
  variant?: 'soft' | 'outline' | 'ghost'
  bordered: boolean
}

export function DateCalendarNavButton({
  variant,
  bordered,
  color,
  radius,
  className,
  ...props
}: DateCalendarNavButtonProps) {
  const resolvedVariant = variant ?? (bordered ? 'outline' : 'soft')

  return (
    <IconButton
      variant={resolvedVariant === 'outline' ? 'outline' : resolvedVariant === 'ghost' ? 'ghost' : 'soft'}
      size="sm"
      color={color}
      radius={radius}
      className={cn(
        'shrink-0 touch-manipulation [-webkit-tap-highlight-color:transparent]',
        '[&_svg]:size-5 [&_svg]:stroke-[2.4]',
        dateCalendarNavButtonColorStyles[color]?.[resolvedVariant],
        className,
      )}
      {...props}
    />
  )
}
