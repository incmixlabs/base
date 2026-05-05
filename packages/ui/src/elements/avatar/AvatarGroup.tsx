'use client'

import * as React from 'react'
import { Flex } from '@/layouts/flex/Flex'
import { partitionVisibleOverflow } from '@/lib/overflow'
import { cn } from '@/lib/utils'
import type { Color, Radius } from '@/theme/tokens'
import type { PopoverContentVariant } from '../popover/popover.props'
import { Avatar, type AvatarProps, type AvatarSize, type AvatarVariant } from './Avatar'
import { AvatarListHoverCard, type AvatarListHoverCardRenderer } from './AvatarListHoverCard'
import { AVATAR_SIZE_CLASS, AvatarProvider, avatarSizeStyles, useAvatarContext } from './avatar.context'
import { avatarOverflowSoftByHue, avatarOverflowSolidByHue, avatarRadiusByRadius } from './avatar.css'
import { stringToHue } from './avatar.shared'
import {
  avatarGroupOverflowStackMarginBySize,
  avatarGroupSpreadBySize,
  avatarGroupStackBySize,
  avatarGroupStackItem,
} from './avatar-group.css'
import { getAvatarListEntry } from './avatar-list-hover-card.shared'

type AvatarGroupLayout = 'spread' | 'stack'
export interface AvatarGroupHoverCardProps {
  title?: React.ReactNode
  color?: Color
  variant?: PopoverContentVariant
  highContrast?: boolean
  radius?: Radius
}

function isAvatarElement(child: React.ReactNode): child is React.ReactElement<AvatarProps> {
  return (
    React.isValidElement(child) &&
    (child.type === Avatar || (child.type as { displayName?: string }).displayName === 'Avatar')
  )
}

export interface AvatarGroupProps {
  /** Maximum avatars to show before +N indicator */
  max?: number
  /** Size of avatars */
  size?: AvatarSize
  /** Layout style - spread (side by side) or stack (overlapping) */
  layout?: AvatarGroupLayout
  /** Fallback avatar color treatment for children */
  variant?: AvatarVariant
  /** Additional class names */
  className?: string
  /** Avatar children */
  children: React.ReactNode
  /** Callback when overflow indicator is clicked */
  onOverflowClick?: (overflowCount: number, overflowChildren: React.ReactNode[]) => void
  /** Custom render for overflow indicator */
  renderOverflow?: (count: number) => React.ReactNode
  /** Show a hover card listing all identities in the group */
  hoverCard?: boolean | AvatarGroupHoverCardProps
  /** Show presence indicators on avatar surfaces */
  showPresence?: boolean
  /** Custom render for the group hover card content */
  renderHoverCard?: AvatarListHoverCardRenderer
  /** Show a hover card listing overflow identities */
  overflowHoverCard?: boolean | AvatarGroupHoverCardProps
}

function AvatarGroup({
  max,
  size = 'sm',
  layout = 'stack',
  variant,
  className,
  children,
  onOverflowClick,
  renderOverflow,
  hoverCard = true,
  showPresence = false,
  renderHoverCard,
  overflowHoverCard = true,
  ref,
  ...props
}: AvatarGroupProps & { ref?: React.Ref<HTMLDivElement> }) {
  const avatarContext = useAvatarContext()
  const hoverCardConfig = typeof hoverCard === 'object' ? hoverCard : undefined
  const overflowHoverCardConfig = typeof overflowHoverCard === 'object' ? overflowHoverCard : undefined
  const groupHoverCardTitle = hoverCardConfig?.title ?? 'People'
  const groupHoverCardColor = hoverCardConfig?.color
  const groupHoverCardVariant = hoverCardConfig?.variant
  const groupHoverCardHighContrast = hoverCardConfig?.highContrast
  const groupHoverCardRadius = hoverCardConfig?.radius
  const groupOverflowHoverCardTitle = overflowHoverCardConfig?.title ?? 'People'
  const groupOverflowHoverCardColor = overflowHoverCardConfig?.color
  const groupOverflowHoverCardVariant = overflowHoverCardConfig?.variant
  const groupOverflowHoverCardHighContrast = overflowHoverCardConfig?.highContrast
  const groupOverflowHoverCardRadius = overflowHoverCardConfig?.radius
  const childrenArray = React.Children.toArray(children)
  const {
    visibleCount,
    visibleItems: visibleChildren,
    overflowCount: remainingCount,
    overflowItems: overflowChildren,
  } = partitionVisibleOverflow(childrenArray, max, { reserveOverflowSlot: true })
  const groupRadius = avatarContext.radius ?? 'full'
  const groupVariant = variant ?? avatarContext.variant

  const isStack = layout === 'stack'
  const visibleListSpacing = isStack ? avatarGroupStackBySize[size] : avatarGroupSpreadBySize[size]
  const rootSpacing = isStack ? undefined : avatarGroupSpreadBySize[size]
  const overflowHue = React.useMemo(() => {
    const seed = overflowChildren
      .map((child, index) => {
        if (React.isValidElement(child)) {
          const childProps = child.props as Partial<AvatarProps>
          return childProps.id ?? childProps.name ?? childProps.src ?? String(child.key ?? index)
        }
        return String(index)
      })
      .join('|')
    return stringToHue(seed || `overflow:${remainingCount}:${visibleCount}`)
  }, [overflowChildren, remainingCount, visibleCount])

  const handleOverflowClick = () => {
    if (onOverflowClick && remainingCount > 0) {
      onOverflowClick(remainingCount, overflowChildren)
    }
  }

  const allListEntries = childrenArray.flatMap((child, index) => {
    const entry = getAvatarListEntry(child, index, size, groupRadius)
    return entry ? [entry] : []
  })
  const overflowListEntries = overflowChildren.flatMap((child, index) => {
    const entry = getAvatarListEntry(child, index, size, groupRadius)
    return entry ? [entry] : []
  })

  const visibleAvatarNodes = visibleChildren.map((child, index) => {
    const key = React.isValidElement(child) && child.key != null ? child.key : index
    const childProps = isAvatarElement(child) ? (child.props as Partial<AvatarProps>) : undefined

    return (
      <span
        key={key}
        className={cn('relative', avatarRadiusByRadius[groupRadius], isStack && avatarGroupStackItem)}
        style={isStack ? { zIndex: index + 1 } : undefined}
      >
        {isAvatarElement(child)
          ? React.cloneElement(child, {
              size,
              ...(showPresence ? { showPresence: childProps?.showPresence ?? true } : null),
              ...(hoverCard && childProps?.hoverCard === undefined ? { hoverCard: false } : null),
            })
          : child}
      </span>
    )
  })

  const hasVisibleAvatars = visibleAvatarNodes.length > 0
  const visibleAvatarGroup = hasVisibleAvatars ? (
    <Flex data-slot="avatar-group-list" align="center" className={visibleListSpacing}>
      {visibleAvatarNodes}
    </Flex>
  ) : null

  const overflowNode =
    remainingCount > 0
      ? (() => {
          const overflowTriggerClassName = cn(
            'relative inline-flex items-center justify-center font-medium border border-solid transition-[opacity,background-color,color,border-color] duration-150 ease-in-out',
            avatarSizeStyles[size],
            avatarRadiusByRadius[groupRadius],
            groupVariant === 'solid' ? avatarOverflowSolidByHue[overflowHue] : avatarOverflowSoftByHue[overflowHue],
            isStack && avatarGroupStackItem,
            isStack && !overflowHoverCard && avatarGroupOverflowStackMarginBySize[size],
            onOverflowClick && 'cursor-pointer hover:opacity-90',
            !onOverflowClick && 'cursor-default',
            AVATAR_SIZE_CLASS,
          )

          const overflowContent = renderOverflow ? renderOverflow(remainingCount) : `+${remainingCount}`
          const overflowTrigger = onOverflowClick ? (
            <button
              type="button"
              onClick={handleOverflowClick}
              className={cn(overflowTriggerClassName, 'appearance-none p-0 border-0 bg-transparent')}
              aria-label={`${remainingCount} more`}
            >
              {overflowContent}
            </button>
          ) : (
            <span className={overflowTriggerClassName} aria-label={`${remainingCount} more`} role="img">
              {overflowContent}
            </span>
          )

          if (!overflowHoverCard) return overflowTrigger

          return (
            <AvatarListHoverCard
              entries={overflowListEntries}
              size={size}
              title={groupOverflowHoverCardTitle}
              color={groupOverflowHoverCardColor}
              variant={groupOverflowHoverCardVariant}
              highContrast={groupOverflowHoverCardHighContrast}
              radius={groupOverflowHoverCardRadius}
            >
              <Flex
                as="span"
                display="inline-flex"
                className={cn(isStack && 'relative', isStack && avatarGroupOverflowStackMarginBySize[size])}
                style={isStack ? { zIndex: 0 } : undefined}
              >
                {overflowTrigger}
              </Flex>
            </AvatarListHoverCard>
          )
        })()
      : null

  const contentNode = (
    <>
      {hoverCard && hasVisibleAvatars ? (
        <AvatarListHoverCard
          entries={allListEntries}
          size={size}
          title={groupHoverCardTitle}
          renderHoverCard={renderHoverCard}
          color={groupHoverCardColor}
          variant={groupHoverCardVariant}
          highContrast={groupHoverCardHighContrast}
          radius={groupHoverCardRadius}
        >
          {visibleAvatarGroup ?? <span />}
        </AvatarListHoverCard>
      ) : (
        visibleAvatarGroup
      )}
      {overflowNode}
    </>
  )

  return (
    <AvatarProvider variant={groupVariant} radius={groupRadius}>
      <Flex ref={ref} align="center" className={cn('isolate', rootSpacing, className)} {...props}>
        {contentNode}
      </Flex>
    </AvatarProvider>
  )
}

export { AvatarGroup }
