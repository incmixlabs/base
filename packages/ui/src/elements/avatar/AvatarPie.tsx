'use client'

import * as React from 'react'
import { Flex } from '@/layouts/flex/Flex'
import { cn } from '@/lib/utils'
import type { AvatarProps, AvatarSize } from './Avatar'
import { AvatarListHoverCard } from './AvatarListHoverCard'
import { useAvatarContext } from './avatar.context'
import { avatarPropDefs } from './avatar.props'
import { getAvatarListEntry } from './avatar-list-hover-card.shared'
import {
  avatarPieOverflowLabel,
  avatarPieRoot,
  avatarPieSizeBySize,
  avatarPieSliceThreeFirst,
  avatarPieSliceThreeSecond,
  avatarPieSliceThreeThird,
  avatarPieSliceTwoFirst,
  avatarPieSliceTwoSecond,
} from './avatar-pie.css'

const avatarPieSliceClassesByCount = {
  1: ['inset-0'],
  2: [avatarPieSliceTwoFirst, avatarPieSliceTwoSecond],
  3: [avatarPieSliceThreeFirst, avatarPieSliceThreeSecond, avatarPieSliceThreeThird],
} as const

export interface AvatarPieHoverCardProps {
  title?: React.ReactNode
  color?: import('@/theme/tokens').Color
  variant?: import('../popover/popover.props').PopoverContentVariant
  highContrast?: boolean
  radius?: import('@/theme/tokens').Radius
}

export interface AvatarPieProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: AvatarSize
  children: React.ReactNode
  hoverCard?: boolean | AvatarPieHoverCardProps
}

function getAvatarPieOverflowLabel(hiddenCount: number) {
  return hiddenCount > 9 ? '+' : `${hiddenCount}+`
}

function getAvatarPieInnerSize(size: AvatarSize, count: number): AvatarSize {
  const sizes = avatarPropDefs.size.values
  const sizeIndex = sizes.indexOf(size)
  if (sizeIndex === -1) return size

  const offset = count >= 3 ? 2 : count === 2 ? 1 : 0
  return sizes[Math.max(0, sizeIndex - offset)] ?? size
}

const AvatarPie = React.forwardRef<HTMLSpanElement, AvatarPieProps>(
  ({ size = 'md', className, children, hoverCard = true, ...props }, ref) => {
    const avatarContext = useAvatarContext()
    const allChildren = React.Children.toArray(children)
    const entries = React.useMemo(
      () =>
        allChildren.flatMap((child, index) => {
          const entry = getAvatarListEntry(child, index, size, avatarContext.radius ?? 'full')
          return entry ? [entry] : []
        }),
      [allChildren, size, avatarContext.radius],
    )
    const childrenArray =
      allChildren.length > 3
        ? [...allChildren.slice(0, 2), getAvatarPieOverflowLabel(allChildren.length - 2)]
        : allChildren.slice(0, 3)
    const innerSize = getAvatarPieInnerSize(size, childrenArray.length)
    const sliceClasses = avatarPieSliceClassesByCount[childrenArray.length as 1 | 2 | 3] ?? []

    const pieNode = (
      <Flex
        as="span"
        ref={ref}
        position="relative"
        display="inline-flex"
        flexShrink="0"
        overflow="hidden"
        radius="full"
        className={cn(avatarPieRoot, avatarPieSizeBySize[size], className)}
        {...props}
      >
        {childrenArray.map((child, index) => {
          const sliceClassName = sliceClasses[index] ?? 'inset-0'

          if (!React.isValidElement(child)) {
            const hiddenCount = allChildren.length - 2
            return (
              <span
                key={index}
                data-slot="avatar-pie-slice"
                className={cn('absolute overflow-hidden', sliceClassName)}
                role="img"
                aria-label={`${hiddenCount} more people`}
              >
                <Flex
                  as="span"
                  align="center"
                  justify="center"
                  className={cn('absolute inset-0 font-semibold leading-none', avatarPieOverflowLabel)}
                >
                  {child}
                </Flex>
              </span>
            )
          }

          const childProps = child.props as Partial<AvatarProps>
          const key = child.key ?? index

          return (
            <span key={key} data-slot="avatar-pie-slice" className={cn('absolute overflow-hidden', sliceClassName)}>
              <span data-slot="avatar-pie-slice-avatar" className="absolute inset-0 h-full w-full">
                {React.cloneElement(child as React.ReactElement<AvatarProps>, {
                  ...childProps,
                  size: innerSize,
                  radius: 'none',
                  hoverCard: hoverCard ? false : childProps.hoverCard,
                  className: cn('absolute inset-0 h-full w-full', childProps.className),
                })}
              </span>
            </span>
          )
        })}
      </Flex>
    )

    if (!hoverCard || entries.length === 0) return pieNode

    const hoverCardConfig = typeof hoverCard === 'object' ? hoverCard : undefined

    return (
      <AvatarListHoverCard
        entries={entries}
        size={size}
        title={hoverCardConfig?.title ?? 'People'}
        color={hoverCardConfig?.color}
        variant={hoverCardConfig?.variant}
        highContrast={hoverCardConfig?.highContrast}
        radius={hoverCardConfig?.radius}
      >
        {pieNode}
      </AvatarListHoverCard>
    )
  },
)

AvatarPie.displayName = 'AvatarPie'

export { AvatarPie }
