'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { getHeightProps } from '@/theme/helpers/get-height-styles'
import { getWidthProps } from '@/theme/helpers/get-width-styles'
import type { HeightProps } from '@/theme/props/height.props'
import type { WidthProps } from '@/theme/props/width.props'

export interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    Omit<WidthProps, 'width'>,
    Omit<HeightProps, 'height'> {
  /** Width of the skeleton */
  width?: WidthProps['width'] | number
  /** Height of the skeleton */
  height?: HeightProps['height'] | number
  /** Whether to show loading animation */
  loading?: boolean
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ width, height, loading = true, children, ...props }, ref) => {
    if (!loading) {
      return <>{children}</>
    }

    const normalizedWidth = typeof width === 'number' ? `${width}px` : width
    const normalizedHeight = typeof height === 'number' ? `${height}px` : height
    const { className, style, minWidth, maxWidth, minHeight, maxHeight, ...domProps } = props
    const widthProps = getWidthProps({ width: normalizedWidth, minWidth, maxWidth })
    const heightProps = getHeightProps({ height: normalizedHeight, minHeight, maxHeight })

    return (
      <div
        ref={ref}
        className={cn(
          'animate-pulse rounded-md bg-[var(--color-slate-soft)]',
          widthProps.className,
          heightProps.className,
          className,
        )}
        style={{ ...widthProps.style, ...heightProps.style, ...style }}
        {...domProps}
      />
    )
  },
)

Skeleton.displayName = 'Skeleton'

// ============================================================================
// Skeleton Text - for text placeholders
// ============================================================================

export interface SkeletonTextProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Number of lines */
  lines?: number
  /** Gap between lines */
  gap?: 'sm' | 'md' | 'lg'
  /** Whether to show loading animation */
  loading?: boolean
}

const gapStyles = {
  sm: 'gap-1',
  md: 'gap-2',
  lg: 'gap-3',
}

const SkeletonText = React.forwardRef<HTMLDivElement, SkeletonTextProps>(
  ({ lines = 3, gap = 'md', loading = true, className, children, ...props }, ref) => {
    if (!loading) {
      return <>{children}</>
    }

    return (
      <div ref={ref} className={cn('flex flex-col', gapStyles[gap], className)} {...props}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={cn(
              'h-4 animate-pulse rounded bg-muted',
              // Make last line shorter for a more natural look
              index === lines - 1 && 'w-4/5',
            )}
          />
        ))}
      </div>
    )
  },
)

SkeletonText.displayName = 'SkeletonText'

// ============================================================================
// Skeleton Avatar - for avatar placeholders
// ============================================================================

export interface SkeletonAvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Size of the avatar */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2x'
  /** Whether to show loading animation */
  loading?: boolean
}

// TODO: Deduplicate this avatar size map by reusing a shared source from Avatar/theme tokens to prevent drift.
const avatarSizes = {
  xs: 'h-6 w-6',
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
  xl: 'h-16 w-16',
  '2x': 'h-20 w-20',
}

const SkeletonAvatar = React.forwardRef<HTMLDivElement, SkeletonAvatarProps>(
  ({ size = 'md', loading = true, className, children, ...props }, ref) => {
    if (!loading) {
      return <>{children}</>
    }

    return (
      <div ref={ref} className={cn('animate-pulse rounded-full bg-muted', avatarSizes[size], className)} {...props} />
    )
  },
)

SkeletonAvatar.displayName = 'SkeletonAvatar'

export { Skeleton, SkeletonAvatar, SkeletonText }
