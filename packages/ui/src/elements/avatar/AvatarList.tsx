'use client'

import * as React from 'react'
import { Checkbox } from '@/form/Checkbox'
import type { FormSize } from '@/form/form-size'
import { pickerIndicatorBySize, pickerOptionItemBase, pickerOptionItemBySize } from '@/form/picker-popup.css'
import { Flex } from '@/layouts/flex/Flex'
import { cn } from '@/lib/utils'
import { Text } from '@/typography'
import { AvatarCard, type AvatarCardProps, AvatarHoverCard } from './AvatarHoverCard'
import type { AvatarListItem } from './avatar-list.props'

export interface AvatarListProps {
  items: AvatarListItem[]
  size?: FormSize
  className?: string
  emptyText?: React.ReactNode
  showHoverCard?: boolean
  selectable?: boolean
  selectedIds?: string[]
  onSelectedIdsChange?: (selectedIds: string[]) => void
}

function toAvatarCardProps(item: AvatarListItem, size: FormSize): AvatarCardProps {
  return {
    size,
    avatar: {
      id: item.id,
      src: item.avatar,
      name: item.name,
      size,
      radius: 'full',
    },
    title: item.title ?? item.name,
    email: item.email,
    description: item.description,
    presence: item.presence,
    managerId: item.managerId,
  }
}

export function AvatarList({
  items,
  size = 'sm',
  className,
  emptyText = 'No people',
  showHoverCard = true,
  selectable = false,
  selectedIds,
  onSelectedIdsChange,
}: AvatarListProps) {
  const [uncontrolledSelectedIds, setUncontrolledSelectedIds] = React.useState<string[]>([])
  const resolvedSelectedIds = selectedIds ?? uncontrolledSelectedIds

  const toggleSelected = React.useCallback(
    (id: string) => {
      const nextSelectedIds = resolvedSelectedIds.includes(id)
        ? resolvedSelectedIds.filter(currentId => currentId !== id)
        : [...resolvedSelectedIds, id]

      if (selectedIds === undefined) {
        setUncontrolledSelectedIds(nextSelectedIds)
      }

      onSelectedIdsChange?.(nextSelectedIds)
    },
    [onSelectedIdsChange, resolvedSelectedIds, selectedIds],
  )

  if (items.length === 0) {
    return (
      <Text size="sm" color="neutral" className={className}>
        {emptyText}
      </Text>
    )
  }

  return (
    <ul className={cn('m-0 min-w-0 list-none p-0', className)} role={selectable ? 'listbox' : undefined}>
      {items.map(item => {
        const cardProps = toAvatarCardProps(item, size)
        const hoverCard = item.hoverCard ?? showHoverCard
        const isSelected = resolvedSelectedIds.includes(item.id)
        const isDisabled = Boolean(item.disabled)

        const rowContent = (
          <Flex align="center" gap="2" className="min-w-0 w-full">
            {selectable ? (
              <Checkbox
                checked={isSelected}
                disabled={isDisabled}
                size={size}
                onCheckedChange={() => undefined}
                className={cn('pointer-events-none shrink-0', pickerIndicatorBySize[size])}
              />
            ) : null}
            <div className="min-w-0 flex-1">
              <AvatarCard {...cardProps} />
            </div>
          </Flex>
        )

        return (
          <li key={item.id}>
            <Flex
              role={selectable ? 'option' : undefined}
              aria-selected={selectable ? isSelected : undefined}
              aria-disabled={isDisabled || undefined}
              tabIndex={selectable && !isDisabled ? 0 : undefined}
              align="center"
              className={cn('relative min-w-0', selectable && cn(pickerOptionItemBase, pickerOptionItemBySize[size]))}
              onClick={selectable && !isDisabled ? () => toggleSelected(item.id) : undefined}
              onKeyDown={
                selectable && !isDisabled
                  ? event => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        toggleSelected(item.id)
                      }
                    }
                  : undefined
              }
            >
              {hoverCard ? (
                <AvatarHoverCard
                  hoverCard={hoverCard}
                  avatar={cardProps.avatar}
                  fallbackTitle={cardProps.title}
                  fallbackEmail={cardProps.email}
                  fallbackDescription={cardProps.description}
                  fallbackPresence={cardProps.presence}
                  fallbackManagerId={cardProps.managerId}
                >
                  <span className="min-w-0 w-full">{rowContent}</span>
                </AvatarHoverCard>
              ) : (
                rowContent
              )}
            </Flex>
          </li>
        )
      })}
    </ul>
  )
}

AvatarList.displayName = 'AvatarList'
