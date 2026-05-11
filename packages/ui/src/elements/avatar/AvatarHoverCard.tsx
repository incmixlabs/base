'use client'

import type * as React from 'react'
import { HoverCard } from '@/elements/hover-card/HoverCard'
import { Flex } from '@/layouts/flex/Flex'
import { cn } from '@/lib/utils'
import type { Color, Radius } from '@/theme/tokens'
import { Text } from '@/typography'
import type { PopoverContentVariant } from '../popover/popover.props'
import { AvatarBase } from './AvatarBase'
import type { AvatarProps, AvatarSize } from './avatar.props'
import { avatarListTitleSizeByAvatarSize, getHoverCardContentSize } from './avatar-hover-card.shared'
import { avatarListItemBase, avatarListItemBySize } from './avatar-list.css'

export type AvatarPresence = 'offline' | 'unknown' | 'busy' | 'online'

export interface AvatarHoverCardData {
  title?: string
  email?: string
  description?: string
  presence?: AvatarPresence
  managerId?: string
  color?: Color
  variant?: PopoverContentVariant
  highContrast?: boolean
  radius?: Radius
}

export interface AvatarCardProps extends AvatarHoverCardData {
  avatar?: Pick<AvatarProps, 'id' | 'src' | 'name' | 'size' | 'radius'>
  size?: AvatarSize
}

export type AvatarHoverCardRenderer = (props: AvatarCardProps) => React.ReactNode

const avatarListDescriptionSizeByAvatarSize: Record<AvatarSize, 'xs' | 'sm' | 'md'> = {
  xs: 'xs',
  sm: 'xs',
  md: 'xs',
  lg: 'sm',
  xl: 'sm',
  '2x': 'md',
}

export function AvatarCard({ title, email, description, presence, managerId, avatar, size }: AvatarCardProps) {
  const resolvedSize = size ?? avatar?.size ?? 'sm'
  const secondaryText = email ?? description

  return (
    <Flex align="center" className={cn('min-w-0 w-full', avatarListItemBase, avatarListItemBySize[resolvedSize])}>
      {avatar ? (
        <span className="shrink-0">
          <AvatarBase
            id={avatar.id}
            src={avatar.src}
            name={avatar.name}
            size={resolvedSize}
            radius={avatar.radius}
            presence={presence}
            showPresence={Boolean(presence)}
          />
        </span>
      ) : null}
      <Flex direction="column" className="min-w-0 flex-1">
        {title ? (
          <Text size={avatarListTitleSizeByAvatarSize[resolvedSize]} weight="medium" truncate>
            {title}
          </Text>
        ) : null}
        {secondaryText ? (
          <Text size={avatarListDescriptionSizeByAvatarSize[resolvedSize]} color="neutral" truncate>
            {secondaryText}
          </Text>
        ) : null}
        {managerId ? (
          <Text size={avatarListDescriptionSizeByAvatarSize[resolvedSize]} color="neutral" truncate className="mt-0.5">
            {`Manager: ${managerId}`}
          </Text>
        ) : null}
      </Flex>
    </Flex>
  )
}

export interface AvatarHoverCardProps {
  hoverCard?: boolean | AvatarHoverCardData
  avatar?: Pick<AvatarProps, 'id' | 'src' | 'name' | 'size' | 'radius'>
  fallbackTitle?: string
  fallbackEmail?: string
  fallbackDescription?: string
  fallbackPresence?: AvatarPresence
  fallbackManagerId?: string
  renderHoverCard?: AvatarHoverCardRenderer
  children: React.ReactElement
}

export function AvatarHoverCard({
  hoverCard,
  avatar,
  fallbackTitle,
  fallbackEmail,
  fallbackDescription,
  fallbackPresence,
  fallbackManagerId,
  renderHoverCard,
  children,
}: AvatarHoverCardProps) {
  if (!hoverCard) return children

  const hoverData = typeof hoverCard === 'object' ? hoverCard : undefined
  const title = hoverData?.title ?? fallbackTitle
  const email = hoverData?.email ?? fallbackEmail
  const description = hoverData?.description ?? fallbackDescription
  const presence = hoverData?.presence ?? fallbackPresence
  const managerId = hoverData?.managerId ?? fallbackManagerId
  const cardProps: AvatarCardProps = {
    title,
    email,
    description,
    presence,
    managerId,
    avatar,
    size: avatar?.size,
    color: hoverData?.color,
    variant: hoverData?.variant,
    highContrast: hoverData?.highContrast,
    radius: hoverData?.radius,
  }
  const hasContent = Boolean(renderHoverCard || title || email || description || managerId || (presence && avatar))

  if (!hasContent) return children

  return (
    <HoverCard.Root>
      <HoverCard.Trigger render={children} />
      <HoverCard.Content
        size={getHoverCardContentSize(avatar?.size)}
        maxWidth="sm"
        color={hoverData?.color}
        variant={hoverData?.variant}
        highContrast={hoverData?.highContrast}
        radius={hoverData?.radius}
      >
        {renderHoverCard ? (
          renderHoverCard(cardProps)
        ) : (
          <AvatarCard
            size={avatar?.size}
            avatar={avatar}
            title={title}
            email={email}
            description={description}
            presence={presence}
            managerId={managerId}
          />
        )}
      </HoverCard.Content>
    </HoverCard.Root>
  )
}
