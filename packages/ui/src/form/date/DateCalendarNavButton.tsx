'use client'

import type * as React from 'react'
import { IconButton } from '@/elements/button/IconButton'
import { cn } from '@/lib/utils'
import type { Color, Radius } from '@/theme/tokens'

export interface DateCalendarNavButtonProps
  extends Omit<React.ComponentPropsWithoutRef<typeof IconButton>, 'size' | 'variant' | 'color' | 'radius'> {
  color: Color
  radius: Radius
  variant?: 'soft' | 'outline' | 'ghost'
  bordered: boolean
  accentColor: string
  softColor: string
  foregroundColor: string
}

export function DateCalendarNavButton({
  variant,
  bordered,
  color,
  radius,
  accentColor,
  softColor,
  foregroundColor,
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
        resolvedVariant === 'outline'
          ? 'border border-[var(--rdp-accent-color)] bg-transparent text-[var(--rdp-accent-color)] hover:bg-[var(--rdp-accent-background-color)] hover:text-[var(--rdp-accent-color)]'
          : resolvedVariant === 'soft'
            ? 'border border-transparent bg-[var(--rdp-accent-background-color)] text-[var(--rdp-accent-color)] hover:bg-[var(--rdp-accent-color)] hover:text-[var(--rdp-accent-foreground)]'
            : 'border border-transparent bg-transparent text-[var(--rdp-accent-color)] hover:bg-[var(--rdp-accent-background-color)] hover:text-[var(--rdp-accent-color)]',
        className,
      )}
      style={
        {
          '--rdp-accent-color': accentColor,
          '--rdp-accent-background-color': softColor,
          '--rdp-accent-foreground': foregroundColor,
        } as React.CSSProperties
      }
      {...props}
    />
  )
}
