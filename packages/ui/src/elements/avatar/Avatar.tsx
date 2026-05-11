'use client'

import * as React from 'react'
import { AvatarBase, useResolvedAvatarBaseProps } from './AvatarBase'
import { AvatarHoverCard } from './AvatarHoverCard'
import type { AvatarProps, AvatarSize } from './avatar.props'

export type { AvatarVariant } from './avatar.props'

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
      ...baseProps
    },
    ref,
  ) => {
    const { normalizedName, normalizedId, size, radius } = useResolvedAvatarBaseProps({
      id: idProp,
      name,
      size: sizeProp,
      radius: radiusProp,
    })

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
        <AvatarBase
          id={idProp}
          ref={ref}
          src={src}
          alt={alt}
          name={name}
          presence={presence}
          showPresence={showPresence}
          size={sizeProp}
          radius={radiusProp}
          {...baseProps}
        />
      </AvatarHoverCard>
    )
  },
)

Avatar.displayName = 'Avatar'

export type { AvatarHoverCardData, AvatarPresence } from './AvatarHoverCard'
export type { AvatarProps, AvatarSize }
export { Avatar }
