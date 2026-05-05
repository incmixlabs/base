'use client'

import type * as React from 'react'
import { KEYBOARD_KEYS } from '@/lib/keyboard-keys'
import { cn } from '@/lib/utils'
import {
  getNextTableColumnResizeSize,
  resolveTableColumnResizeBounds,
  type TableColumnResizeBounds,
} from './table-column-resize'

const tableColumnResizeHandleClass =
  'absolute inset-y-0 right-0 z-[1] w-2 cursor-col-resize touch-none select-none bg-transparent transition-colors duration-[120ms] focus-visible:outline-none'

export interface TableColumnResizeHandleProps {
  columnId: string
  header: unknown
  currentSize: number
  currentSizing?: Record<string, number>
  minSize?: number
  maxSize?: number
  isResizing?: boolean
  className?: string
  activeClassName?: string
  onMouseDown: React.MouseEventHandler<HTMLDivElement>
  onTouchStart: React.TouchEventHandler<HTMLDivElement>
  onResize: (columnId: string, nextSize: number) => void
  onReset: () => void
}

export function getTableColumnResizeLabel(header: unknown, columnId: string) {
  return typeof header === 'string' && header.trim() ? header : columnId
}

function getCurrentColumnSize({
  columnId,
  currentSize,
  currentSizing,
}: Pick<TableColumnResizeHandleProps, 'columnId' | 'currentSize' | 'currentSizing'>) {
  return currentSizing?.[columnId] ?? currentSize
}

function getNextColumnSize({
  bounds,
  columnId,
  currentSize,
  currentSizing,
  event,
}: {
  bounds: TableColumnResizeBounds
  columnId: string
  currentSize: number
  currentSizing?: Record<string, number>
  event: React.KeyboardEvent<HTMLDivElement>
}) {
  return getNextTableColumnResizeSize({
    currentSize: getCurrentColumnSize({ columnId, currentSize, currentSizing }),
    direction: event.key === KEYBOARD_KEYS.arrowRight ? 'increase' : 'decrease',
    shiftKey: event.shiftKey,
    ...bounds,
  })
}

export function TableColumnResizeHandle({
  columnId,
  header,
  currentSize,
  currentSizing,
  minSize,
  maxSize,
  isResizing,
  className,
  activeClassName,
  onMouseDown,
  onTouchStart,
  onResize,
  onReset,
}: TableColumnResizeHandleProps) {
  const bounds = resolveTableColumnResizeBounds({ minSize, maxSize })

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== KEYBOARD_KEYS.arrowLeft && event.key !== KEYBOARD_KEYS.arrowRight) return
    event.preventDefault()
    event.stopPropagation()
    onResize(
      columnId,
      getNextColumnSize({
        bounds,
        columnId,
        currentSize,
        currentSizing,
        event,
      }),
    )
  }

  return (
    <div
      role="separator"
      aria-orientation="vertical"
      aria-valuemin={bounds.minSize}
      aria-valuemax={bounds.maxSize}
      aria-valuenow={currentSize}
      aria-label={`Resize ${getTableColumnResizeLabel(header, columnId)} column`}
      tabIndex={0}
      className={cn(tableColumnResizeHandleClass, className, isResizing && activeClassName)}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      onKeyDown={handleKeyDown}
      onDoubleClick={onReset}
    />
  )
}
