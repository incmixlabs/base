'use client'

import type * as React from 'react'
import { Badge } from '@/elements/badge/Badge'
import { Button } from '@/elements/button/Button'
import { Flex } from '@/layouts/flex/Flex'
import { cn } from '@/lib/utils'
import { Text } from '@/typography'
import { formatNumber } from '@/utils/number'
import {
  tableHeaderMetaBarClass,
  tableHeaderMetaContentClass,
  tableHeaderToolbarClass,
  tableHeaderToolbarLeftClass,
  tableHeaderToolbarRightClass,
} from './table-header.css'

export type TableHeaderAppliedFilter = {
  id: string
  label: string
  value: string
}

export interface TableHeaderProps {
  totalRows: number
  filteredRows?: number
  activeFilterCount?: number
  appliedFilters?: readonly TableHeaderAppliedFilter[]
  meta?: React.ReactNode
  actions?: React.ReactNode
  resetLabel?: React.ReactNode
  onReset?: () => void
  className?: string
}

export function TableHeader({
  totalRows,
  filteredRows,
  activeFilterCount = 0,
  appliedFilters,
  meta,
  actions,
  resetLabel = 'Reset',
  onReset,
  className,
}: TableHeaderProps) {
  const hasFilters = activeFilterCount > 0
  const rowCountLabel = hasFilters
    ? `Showing ${formatNumber(filteredRows ?? totalRows)} of ${formatNumber(totalRows)} rows`
    : `${formatNumber(totalRows)} rows`
  const resolvedMeta =
    appliedFilters !== undefined ? (
      <Flex direction="column" gap="2" className="min-w-0">
        <Text size="xs" weight="medium">
          Applied Filters
        </Text>
        {appliedFilters.length === 0 ? (
          <Text size="sm" color="slate">
            No filters applied yet.
          </Text>
        ) : (
          <Flex gap="2" className="min-w-0 flex-wrap">
            {appliedFilters.map(filter => (
              <Badge key={filter.id} color="primary" size="xs">
                {filter.label}: {filter.value}
              </Badge>
            ))}
          </Flex>
        )}
      </Flex>
    ) : (
      meta
    )

  return (
    <div className={className}>
      {resolvedMeta ? (
        <div className={tableHeaderMetaBarClass}>
          <div className={tableHeaderMetaContentClass}>{resolvedMeta}</div>
          <Text size="xs" color="primary" className="tabular-nums">
            {rowCountLabel}
          </Text>
        </div>
      ) : null}
      <div className={tableHeaderToolbarClass}>
        <Flex className={tableHeaderToolbarLeftClass}>
          {!resolvedMeta ? (
            <Text size="xs" color="primary" className="tabular-nums">
              {rowCountLabel}
            </Text>
          ) : null}
          {hasFilters && onReset ? (
            <Button variant="ghost" color="slate" size="sm" onClick={onReset} className="gap-1 text-xs">
              {resetLabel}
            </Button>
          ) : null}
        </Flex>
        <div className={cn(tableHeaderToolbarRightClass)}>{actions}</div>
      </div>
    </div>
  )
}
