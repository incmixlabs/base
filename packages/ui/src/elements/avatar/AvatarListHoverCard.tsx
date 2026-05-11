'use client'

import type * as React from 'react'
import { Flex } from '@/layouts/flex/Flex'
import type { Color, Radius } from '@/theme/tokens'
import { Text } from '@/typography'
import { HoverCard } from '../hover-card/HoverCard'
import type { PopoverContentVariant } from '../popover/popover.props'
import { AvatarCard } from './AvatarHoverCard'
import type { AvatarSize } from './avatar.props'
import { avatarListTitleSizeByAvatarSize, getHoverCardContentSize } from './avatar-hover-card.shared'
import type { AvatarListEntry } from './avatar-list-hover-card.shared'

export interface AvatarListHoverCardRenderProps {
  entries: AvatarListEntry[]
  size: AvatarSize
  title?: React.ReactNode
}

export type AvatarListHoverCardRenderer = (props: AvatarListHoverCardRenderProps) => React.ReactNode

export interface AvatarListHoverCardProps {
  children: React.ReactElement
  entries: AvatarListEntry[]
  size: AvatarSize
  title?: React.ReactNode
  renderHoverCard?: AvatarListHoverCardRenderer
  color?: Color
  variant?: PopoverContentVariant
  highContrast?: boolean
  radius?: Radius
  maxWidth?: 'sm' | 'md' | 'lg'
}

function getAvatarListSize(size: AvatarSize): AvatarSize {
  switch (size) {
    case 'xs':
      return 'xs'
    default:
      return 'sm'
  }
}

export function AvatarListHoverCard({
  children,
  entries,
  size,
  title,
  renderHoverCard,
  color,
  variant,
  highContrast,
  radius,
  maxWidth = 'md',
}: AvatarListHoverCardProps) {
  if (entries.length === 0 && !renderHoverCard) return children
  const listSize = getAvatarListSize(size)

  return (
    <HoverCard.Root>
      <HoverCard.Trigger render={children} />
      <HoverCard.Content
        size={getHoverCardContentSize(size)}
        maxWidth={maxWidth}
        color={color}
        variant={variant}
        highContrast={highContrast}
        radius={radius}
      >
        {renderHoverCard ? (
          renderHoverCard({ entries, size: listSize, title })
        ) : (
          <Flex direction="column" className="min-w-0 gap-1">
            {title ? (
              <Text size={avatarListTitleSizeByAvatarSize[listSize]} weight="medium">
                {title}
              </Text>
            ) : null}
            <ul className="m-0 min-w-0 list-none p-0">
              {entries.map(({ key, ...entry }) => (
                <li key={key}>
                  <AvatarCard {...entry} size={listSize} />
                </li>
              ))}
            </ul>
          </Flex>
        )}
      </HoverCard.Content>
    </HoverCard.Root>
  )
}
