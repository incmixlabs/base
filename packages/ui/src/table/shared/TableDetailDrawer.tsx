'use client'

import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import * as React from 'react'
import { Button } from '@/elements/button/Button'
import { Sheet } from '@/elements/sheet/Sheet'
import { Flex } from '@/layouts/flex/Flex'
import { cn } from '@/lib/utils'
import { humanizeKey } from '@/utils/strings'

// ─── Types ──────────────────────────────────────────────────────────────────

export type DetailEntry = {
  key: string
  label: string
  value: React.ReactNode
}

export interface TableDetailDrawerProps {
  /** Whether the drawer is open */
  open: boolean
  /** Called when the drawer should close */
  onOpenChange: (open: boolean) => void
  /** Title for the drawer header */
  title?: React.ReactNode
  /** Entries to display as key-value pairs */
  entries?: DetailEntry[]
  /** Total number of navigable rows */
  rowCount: number
  /** Index of the currently displayed row */
  currentIndex: number
  /** Navigate to a row by index */
  onNavigate: (index: number) => void
  /** Whether detail data is loading (for async fetch) */
  isLoading?: boolean
  /** Custom content renderer (overrides default key-value display) */
  children?: React.ReactNode
  /** Max width of the drawer (default: 480) */
  maxWidth?: number
}

// ─── Default Key-Value Content ──────────────────────────────────────────────

function DefaultDetailContent({ entries, isLoading }: { entries: DetailEntry[]; isLoading?: boolean }) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-3 py-2">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="flex flex-col gap-1.5">
            <div className="h-3 w-20 animate-pulse rounded bg-muted" />
            <div className="h-4 w-full animate-pulse rounded bg-muted" />
          </div>
        ))}
      </div>
    )
  }

  if (entries.length === 0) {
    return <p className="text-sm text-muted-foreground">No details available.</p>
  }

  return (
    <dl className="flex flex-col gap-3">
      {entries.map(entry => (
        <div key={entry.key} className="flex flex-col gap-0.5">
          <dt className="text-xs font-medium text-muted-foreground">{entry.label}</dt>
          <dd className="break-words text-sm text-foreground">{entry.value ?? '—'}</dd>
        </div>
      ))}
    </dl>
  )
}

// ─── Component ──────────────────────────────────────────────────────────────

export function TableDetailDrawer({
  open,
  onOpenChange,
  title,
  entries = [],
  rowCount,
  currentIndex,
  onNavigate,
  isLoading,
  children,
  maxWidth = 480,
}: TableDetailDrawerProps) {
  const hasPrev = currentIndex > 0
  const hasNext = currentIndex < rowCount - 1

  // Keyboard navigation
  React.useEffect(() => {
    if (!open) return
    const handler = (event: KeyboardEvent) => {
      // Don't intercept if user is in an input or textarea
      const tag = (event.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return

      if (event.key === 'ArrowUp' || (event.key === 'ArrowLeft' && event.metaKey)) {
        if (hasPrev) {
          event.preventDefault()
          onNavigate(currentIndex - 1)
        }
      } else if (event.key === 'ArrowDown' || (event.key === 'ArrowRight' && event.metaKey)) {
        if (hasNext) {
          event.preventDefault()
          onNavigate(currentIndex + 1)
        }
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, hasPrev, hasNext, currentIndex, onNavigate])

  return (
    <Sheet.Root open={open} onOpenChange={onOpenChange}>
      <Sheet.Content side="right" style={{ maxWidth }}>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <Sheet.Title className={cn('text-sm font-semibold', !title && 'sr-only')}>
            {title ?? 'Row details'}
          </Sheet.Title>

          <Flex align="center" gap="1">
            <span className="text-xs text-muted-foreground">
              {currentIndex + 1} / {rowCount}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate(currentIndex - 1)}
              disabled={!hasPrev}
              aria-label="Previous row"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate(currentIndex + 1)}
              disabled={!hasNext}
              aria-label="Next row"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)} aria-label="Close drawer">
              <X className="h-4 w-4" />
            </Button>
          </Flex>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {children ?? <DefaultDetailContent entries={entries} isLoading={isLoading} />}
        </div>
      </Sheet.Content>
    </Sheet.Root>
  )
}

TableDetailDrawer.displayName = 'TableDetailDrawer'

// ─── Utility: convert a plain object to DetailEntry[] ───────────────────────

export function objectToDetailEntries(obj: Record<string, unknown>): DetailEntry[] {
  return Object.entries(obj).map(([key, value]) => ({
    key,
    label: humanizeKey(key),
    value: formatDetailValue(value),
  }))
}

function formatDetailValue(value: unknown): React.ReactNode {
  if (value === null || value === undefined) return '—'
  if (value instanceof Date) {
    // TODO-INTL: use browser locale (undefined) or accept a locale prop instead of hardcoding en-US
    return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(value)
  }
  if (Array.isArray(value)) return value.join(', ')
  if (typeof value === 'object')
    return (
      <pre style={{ fontSize: '0.75rem', whiteSpace: 'pre-wrap', margin: 0 }}>{JSON.stringify(value, null, 2)}</pre>
    )
  return String(value)
}
