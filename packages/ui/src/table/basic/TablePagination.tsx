'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import * as React from 'react'
import { Button } from '@/elements/button/Button'
import { IconButton } from '@/elements/button/IconButton'
import { ToggleGroup } from '@/elements/toggle/Toggle'
import type { toggleVariants } from '@/elements/toggle/toggle.props'
import { cn } from '@/lib/utils'
import { SemanticColor } from '@/theme/props/color.prop'
import { normalizeEnumPropValue } from '@/theme/props/prop-def'
import type { Color, Radius } from '@/theme/tokens'
import { tablePaginationPropDefs } from './table-pagination.props'

type TablePaginationSize = (typeof tablePaginationPropDefs.size.values)[number]
type PaginationItem = number | 'ellipsis'

function clampPage(page: number, totalPages: number) {
  return Math.min(Math.max(page, 1), totalPages)
}

function getPaginationItems(page: number, totalPages: number, siblingCount: number): PaginationItem[] {
  if (totalPages <= 0) return [1]

  const currentPage = clampPage(page, totalPages)
  const maxVisible = siblingCount * 2 + 5
  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  const leftSibling = Math.max(currentPage - siblingCount, 1)
  const rightSibling = Math.min(currentPage + siblingCount, totalPages)
  const showLeftEllipsis = leftSibling > 2
  const showRightEllipsis = rightSibling < totalPages - 1

  if (!showLeftEllipsis) {
    const leftRange = Array.from({ length: 3 + siblingCount * 2 }, (_, index) => index + 1)
    return [...leftRange, 'ellipsis', totalPages]
  }

  if (!showRightEllipsis) {
    const rightRangeStart = totalPages - (2 + siblingCount * 2)
    const rightRange = Array.from({ length: 3 + siblingCount * 2 }, (_, index) => rightRangeStart + index)
    return [1, 'ellipsis', ...rightRange]
  }

  const middleRange = Array.from({ length: rightSibling - leftSibling + 1 }, (_, index) => leftSibling + index)
  return [1, 'ellipsis', ...middleRange, 'ellipsis', totalPages]
}

function PaginationFirstIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M10 4L6 8L10 12" />
      <path d="M4.5 4V12" />
    </svg>
  )
}

function PaginationLastIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M6 4L10 8L6 12" />
      <path d="M11.5 4V12" />
    </svg>
  )
}

export interface TablePaginationProps extends Omit<React.HTMLAttributes<HTMLElement>, 'color'> {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  siblingCount?: number
  size?: TablePaginationSize
  variant?: (typeof toggleVariants)[number]
  color?: Color
  radius?: Radius
  flush?: boolean
  highContrast?: boolean
  disabled?: boolean
  prevLabel?: string | undefined
  nextLabel?: string | undefined
  showBoundary?: boolean
}

export const TablePagination = React.forwardRef<HTMLElement, TablePaginationProps>((incomingProps, ref) => {
  const {
    page,
    totalPages,
    onPageChange,
    siblingCount = 1,
    size = 'md',
    variant = 'soft',
    color = SemanticColor.slate,
    radius = 'full',
    flush = false,
    highContrast = false,
    disabled = false,
    prevLabel,
    nextLabel,
    showBoundary = true,
    className,
    style,
    'aria-label': ariaLabel = 'Table pagination',
    ...props
  } = incomingProps

  const safeSize = (normalizeEnumPropValue(tablePaginationPropDefs.size, size) ??
    tablePaginationPropDefs.size.default) as TablePaginationSize
  const safeColor = (normalizeEnumPropValue(tablePaginationPropDefs.color, color) ??
    tablePaginationPropDefs.color.default ??
    SemanticColor.slate) as Color
  const safeSiblingCount = Number.isFinite(siblingCount) ? Math.max(0, Math.trunc(siblingCount)) : 1

  const resolvedTotalPages = Math.max(1, totalPages)
  const currentPage = clampPage(page, resolvedTotalPages)
  const items = getPaginationItems(currentPage, resolvedTotalPages, safeSiblingCount)
  const previousDisabled = disabled || currentPage <= 1
  const nextDisabled = disabled || currentPage >= resolvedTotalPages

  const goToPage = (nextPage: number) => {
    if (disabled) return
    const clamped = clampPage(nextPage, resolvedTotalPages)
    if (clamped === currentPage) return
    onPageChange(clamped)
  }

  const handleToggleValueChange = (value: string[]) => {
    const selected = value[0]
    if (selected) {
      goToPage(Number(selected))
    }
  }

  const iconButtonProps = {
    size: safeSize,
    variant: 'ghost' as const,
    color: safeColor,
    radius,
    highContrast,
  }
  const buttonProps = {
    size: safeSize,
    variant: 'ghost' as const,
    color: safeColor,
    radius,
    highContrast,
  }
  const previousAriaLabel = prevLabel ?? 'Previous page'
  const nextAriaLabel = nextLabel ?? 'Next page'

  const previousControl =
    prevLabel === undefined ? (
      <IconButton
        {...iconButtonProps}
        disabled={previousDisabled}
        aria-label={previousAriaLabel}
        onClick={() => goToPage(currentPage - 1)}
      >
        <ChevronLeft aria-hidden="true" />
      </IconButton>
    ) : (
      <Button
        {...buttonProps}
        disabled={previousDisabled}
        aria-label={previousAriaLabel}
        onClick={() => goToPage(currentPage - 1)}
      >
        <ChevronLeft aria-hidden="true" />
        {prevLabel}
      </Button>
    )

  const nextControl =
    nextLabel === undefined ? (
      <IconButton
        {...iconButtonProps}
        disabled={nextDisabled}
        aria-label={nextAriaLabel}
        onClick={() => goToPage(currentPage + 1)}
      >
        <ChevronRight aria-hidden="true" />
      </IconButton>
    ) : (
      <Button
        {...buttonProps}
        disabled={nextDisabled}
        aria-label={nextAriaLabel}
        onClick={() => goToPage(currentPage + 1)}
      >
        {nextLabel}
        <ChevronRight aria-hidden="true" />
      </Button>
    )

  return (
    <nav ref={ref} aria-label={ariaLabel} className={className} style={style} {...props}>
      <div className="inline-flex items-center gap-0.5">
        {showBoundary && (
          <IconButton
            {...iconButtonProps}
            disabled={previousDisabled}
            aria-label="First page"
            onClick={() => goToPage(1)}
          >
            <PaginationFirstIcon aria-hidden="true" />
          </IconButton>
        )}

        {previousControl}

        <ToggleGroup.Root
          value={[String(currentPage)]}
          onValueChange={handleToggleValueChange}
          size={safeSize}
          variant={variant}
          color={safeColor}
          radius={radius}
          highContrast={highContrast}
          flush={flush}
        >
          {items.map((item, index) =>
            item === 'ellipsis' ? (
              <span
                key={`ellipsis-${index}`}
                aria-hidden="true"
                className={cn(
                  'inline-flex shrink-0 items-center justify-center text-muted-foreground',
                  safeSize === 'xs' && 'size-6 text-xs',
                  safeSize === 'sm' && 'size-7 text-sm',
                  safeSize === 'md' && 'size-8 text-sm',
                  safeSize === 'lg' && 'size-9 text-base',
                )}
              >
                ...
              </span>
            ) : (
              <ToggleGroup.Item
                key={item}
                value={String(item)}
                aria-current={item === currentPage ? 'page' : undefined}
                aria-label={item === currentPage ? `Current page, page ${item}` : `Go to page ${item}`}
                disabled={disabled}
              >
                {item}
              </ToggleGroup.Item>
            ),
          )}
        </ToggleGroup.Root>

        {nextControl}

        {showBoundary && (
          <IconButton
            {...iconButtonProps}
            disabled={nextDisabled}
            aria-label="Last page"
            onClick={() => goToPage(resolvedTotalPages)}
          >
            <PaginationLastIcon aria-hidden="true" />
          </IconButton>
        )}
      </div>
    </nav>
  )
})

TablePagination.displayName = 'TablePagination'
