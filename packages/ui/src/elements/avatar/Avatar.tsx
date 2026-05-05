'use client'

import * as React from 'react'
import { Flex } from '@/layouts/flex/Flex'
import { cn } from '@/lib/utils'
import { AvatarHoverCard } from './AvatarHoverCard'
import { AVATAR_SIZE_CLASS, useAvatarContext } from './avatar.context'
import {
  avatarDefaultIcon,
  avatarFallbackMuted,
  avatarPresence,
  avatarPresenceBusyLine,
  avatarPresenceBusyLineBySize,
  avatarPresenceBySize,
  avatarPresenceByState,
  avatarRadiusByRadius,
  avatarSizeBySize,
  avatarSoftFallbackByHueTone,
  avatarSolidFallbackByHueTone,
} from './avatar.css'
import type { AvatarProps, AvatarSize } from './avatar.props'
import { stringToAvatarSoftTone, stringToAvatarSolidTone, stringToHue } from './avatar.shared'

export type { AvatarVariant } from './avatar.props'

function formatPresenceLabel(presence: NonNullable<AvatarProps['presence']>) {
  return presence.charAt(0).toUpperCase() + presence.slice(1)
}

const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>(
  (
    {
      id: idProp,
      src,
      alt,
      name,
      title,
      email,
      description,
      presence,
      managerId,
      showPresence = false,
      hoverCard = true,
      renderHoverCard,
      size: sizeProp,
      radius: radiusProp,
      className,
      style,
      ...props
    },
    ref,
  ) => {
    const ctx = useAvatarContext()
    const size = sizeProp ?? 'sm'
    const radius = radiusProp ?? ctx.radius ?? 'full'
    const avatarVariant = ctx.variant ?? 'soft'
    const fallbackVariant = avatarVariant

    const [hasError, setHasError] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(!!src)

    React.useEffect(() => {
      setHasError(false)
      setIsLoading(!!src)
    }, [src])

    const showImage = src && !hasError
    const showFallback = !showImage || isLoading

    const normalizedName = React.useMemo(() => name?.trim().replace(/\s+/g, ' '), [name])
    const normalizedId = React.useMemo(() => idProp?.trim(), [idProp])

    const initials = React.useMemo(() => {
      if (!normalizedName) return ''
      return normalizedName
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }, [normalizedName])

    const colorSeed = normalizedId ? `${normalizedId}:${normalizedName ?? ''}` : normalizedName
    const resolvedHue = colorSeed ? stringToHue(colorSeed) : undefined
    const resolvedSoftTone = colorSeed ? stringToAvatarSoftTone(colorSeed) : undefined
    const resolvedSolidTone = colorSeed ? stringToAvatarSolidTone(colorSeed) : undefined
    const softToneClass =
      fallbackVariant === 'soft' && resolvedHue && resolvedSoftTone
        ? avatarSoftFallbackByHueTone[`${resolvedHue}-${resolvedSoftTone}`]
        : undefined
    const solidToneClass =
      fallbackVariant === 'solid' && resolvedHue && resolvedSolidTone
        ? avatarSolidFallbackByHueTone[`${resolvedHue}-${resolvedSolidTone}`]
        : undefined

    const avatarNode = (
      <Flex
        as="span"
        ref={ref}
        position="relative"
        display="inline-flex"
        flexShrink="0"
        align="center"
        justify="center"
        id={idProp}
        className={cn(
          AVATAR_SIZE_CLASS,
          avatarSizeBySize[size],
          avatarRadiusByRadius[radius],
          showFallback && !resolvedHue && avatarFallbackMuted,
          softToneClass,
          solidToneClass,
          className,
        )}
        style={style}
        {...props}
      >
        <Flex
          as="span"
          align="center"
          justify="center"
          className={cn('h-full w-full overflow-hidden', avatarRadiusByRadius[radius])}
        >
          {showImage && (
            <img
              src={src}
              alt={alt || normalizedName || 'Avatar'}
              className={cn('h-full w-full object-cover', isLoading && 'opacity-0')}
              onLoad={() => setIsLoading(false)}
              onError={() => {
                setHasError(true)
                setIsLoading(false)
              }}
            />
          )}
          {showFallback && (
            <Flex as="span" align="center" justify="center" className="font-medium">
              {initials || (
                <svg className={avatarDefaultIcon} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              )}
            </Flex>
          )}
        </Flex>
        {showPresence && presence ? (
          <Flex
            as="span"
            align="center"
            justify="center"
            className={cn(
              'pointer-events-none absolute top-0 right-0 translate-x-[30%] -translate-y-[30%] box-border rounded-full z-1',
              avatarPresence,
              avatarPresenceBySize[size],
              avatarPresenceByState[presence],
            )}
            aria-label={formatPresenceLabel(presence)}
            role="img"
          >
            {presence === 'busy' ? (
              <span className={cn(avatarPresenceBusyLine, avatarPresenceBusyLineBySize[size])} aria-hidden="true" />
            ) : null}
          </Flex>
        ) : null}
      </Flex>
    )

    return (
      <AvatarHoverCard
        hoverCard={hoverCard}
        avatar={{ id: normalizedId, src, name: normalizedName, size, radius }}
        fallbackTitle={title ?? normalizedName}
        fallbackEmail={email}
        fallbackDescription={description}
        fallbackPresence={presence}
        fallbackManagerId={managerId}
        renderHoverCard={renderHoverCard}
      >
        {avatarNode}
      </AvatarHoverCard>
    )
  },
)

Avatar.displayName = 'Avatar'

export type { AvatarHoverCardData, AvatarPresence } from './AvatarHoverCard'
export type { AvatarProps, AvatarSize }
export { Avatar }
