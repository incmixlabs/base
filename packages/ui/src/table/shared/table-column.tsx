'use client'

import type * as React from 'react'
import { Icon } from '@/elements/button/Icon'
import { cn } from '@/lib/utils'
import { tableSortButtonClass, tableSortIconActiveClass, tableSortIconClass } from './table-header.shared.css'

export type TableSortDirection = 'asc' | 'desc' | false

export interface TableSortableHeaderContentProps {
  active: boolean
  direction: TableSortDirection
  onClick: React.MouseEventHandler<HTMLButtonElement>
  children: React.ReactNode
  className?: string
  iconClassName?: string
  activeIconClassName?: string
}

export interface TableColumnHeaderContentProps {
  isPlaceholder?: boolean
  sortable?: boolean
  sortDirection?: TableSortDirection
  onSort?: React.MouseEventHandler<HTMLButtonElement>
  children: React.ReactNode
  className?: string
  iconClassName?: string
  activeIconClassName?: string
}

function getSortIcon(direction: TableSortDirection) {
  if (direction === 'asc') return 'chevron-up'
  if (direction === 'desc') return 'chevron-down'
  return 'chevrons-up-down'
}

export function TableSortableHeaderContent({
  active,
  direction,
  onClick,
  children,
  className,
  iconClassName,
  activeIconClassName,
}: TableSortableHeaderContentProps) {
  const isSorted = direction !== false

  return (
    <button type="button" onClick={onClick} className={cn('p-0', tableSortButtonClass, className)}>
      <span>{children}</span>
      <Icon
        aria-hidden="true"
        icon={getSortIcon(direction)}
        size="xs"
        className={cn(
          tableSortIconClass,
          iconClassName,
          (isSorted || active) && tableSortIconActiveClass,
          isSorted && activeIconClassName,
        )}
      />
    </button>
  )
}

export function TableColumnHeaderContent({
  isPlaceholder,
  sortable,
  sortDirection = false,
  onSort,
  children,
  className,
  iconClassName,
  activeIconClassName,
}: TableColumnHeaderContentProps) {
  if (isPlaceholder) return null

  if (sortable && onSort) {
    return (
      <TableSortableHeaderContent
        active={sortDirection !== false}
        direction={sortDirection}
        onClick={onSort}
        className={className}
        iconClassName={iconClassName}
        activeIconClassName={activeIconClassName}
      >
        {children}
      </TableSortableHeaderContent>
    )
  }

  return <>{children}</>
}
