'use client'

import * as React from 'react'
import { Icon } from '@/elements/button/Icon'
import { cn } from '@/lib/utils'
import { type PriorityIconPriority, priorityToneByValue } from './priority-icon.shared'

type PriorityIconSize = 'xs' | 'sm' | 'md' | 'lg'

export type { PriorityIconPriority } from './priority-icon.shared'
export { priorityToneByValue } from './priority-icon.shared'

export interface PriorityIconProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'color'> {
  priority: PriorityIconPriority
  size?: PriorityIconSize
}

const BAR_X_POSITIONS = [4, 8, 12, 16, 20] as const
const BAR_TOP_POSITIONS = [15, 12.5, 10, 7.5, 5] as const
const priorityIconSizeClassNames: Record<PriorityIconSize, string> = {
  xs: 'size-3',
  sm: 'size-4',
  md: 'size-5',
  lg: 'size-6',
}
const lucidePriorityIcons: Partial<Record<PriorityIconPriority, string>> = {
  none: 'circle-minus',
  critical: 'triangle-alert',
  blocker: 'square',
}
const ACTIVE_BARS_BY_PRIORITY: Record<Exclude<PriorityIconPriority, 'none' | 'blocker' | 'critical'>, number> = {
  low: 2,
  med: 3,
  medium: 3,
  high: 4,
}

function isBarPriority(
  value: PriorityIconPriority,
): value is Exclude<PriorityIconPriority, 'none' | 'blocker' | 'critical'> {
  return Object.hasOwn(ACTIVE_BARS_BY_PRIORITY, value)
}

function PriorityBars({ activeBars }: { activeBars: number }) {
  return (
    <>
      {BAR_X_POSITIONS.map((x, index) => {
        if (index >= activeBars) return null
        return <path key={x} d={`M${x} 20V${BAR_TOP_POSITIONS[index]}`} />
      })}
    </>
  )
}

export const PriorityIcon = React.forwardRef<HTMLSpanElement, PriorityIconProps>(function PriorityIcon(
  { priority, size = 'sm', className, style, ...props },
  ref,
) {
  const tone = priorityToneByValue[priority]
  const sizeClassName = priorityIconSizeClassNames[size]
  const lucideIcon = lucidePriorityIcons[priority]

  if (lucideIcon) {
    return (
      <span ref={ref} className={cn('inline-flex shrink-0', className)} style={style} {...props}>
        <Icon
          icon={lucideIcon}
          size={size}
          className="shrink-0"
          style={{ color: tone.color }}
          aria-hidden="true"
          iconProps={priority === 'blocker' ? { fill: 'currentColor', strokeWidth: 0 } : undefined}
        />
      </span>
    )
  }

  if (!isBarPriority(priority)) return null

  return (
    <span ref={ref} className={cn('inline-flex shrink-0', className)} style={style} {...props}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn(sizeClassName, 'shrink-0')}
        aria-hidden="true"
        style={{ color: tone.color }}
      >
        <PriorityBars activeBars={ACTIVE_BARS_BY_PRIORITY[priority]} />
      </svg>
    </span>
  )
})
