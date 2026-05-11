import * as React from 'react'
import type { Radius } from '@/theme/tokens'
import type { AvatarCardProps } from './AvatarHoverCard'
import type { AvatarProps, AvatarSize } from './avatar.props'

export interface AvatarListEntry extends AvatarCardProps {
  key: React.Key
}

export function getAvatarListEntry(
  child: React.ReactNode,
  index: number,
  size: AvatarSize,
  radius: Radius,
): AvatarListEntry | null {
  if (!React.isValidElement(child)) return null

  const childProps = child.props as Partial<AvatarProps>
  const hoverData = typeof childProps.hoverCard === 'object' ? childProps.hoverCard : undefined
  const hasEntryData = [
    childProps.id,
    childProps.src,
    childProps.name,
    childProps.title,
    childProps.email,
    childProps.description,
    childProps.presence,
    childProps.managerId,
    hoverData?.title,
    hoverData?.email,
    hoverData?.description,
    hoverData?.presence,
    hoverData?.managerId,
  ].some(value => value != null && value !== '')
  const hasAvatarData = childProps.id != null || childProps.src != null || childProps.name != null

  if (!hasEntryData) return null

  return {
    key: child.key ?? index,
    size,
    avatar: hasAvatarData
      ? {
          id: childProps.id,
          src: childProps.src,
          name: childProps.name,
          size,
          radius: childProps.radius ?? radius,
        }
      : undefined,
    title: hoverData?.title ?? childProps.title ?? childProps.name,
    email: hoverData?.email ?? childProps.email,
    description: hoverData?.description ?? childProps.description,
    presence: hoverData?.presence ?? childProps.presence,
    managerId: hoverData?.managerId ?? childProps.managerId,
  }
}
