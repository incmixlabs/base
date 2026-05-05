'use client'

import { X } from 'lucide-react'
import * as React from 'react'
import { Avatar } from '@/elements/avatar/Avatar'
import type { AvatarProps, AvatarSize } from '@/elements/avatar/avatar.props'
import type { IconComponent } from '@/elements/icon.types'
import { cn } from '@/lib/utils'
import { SemanticColor } from '@/theme/props/color.prop'
import { normalizeEnumPropValue } from '@/theme/props/prop-def'
import { radiusStyleVariants } from '@/theme/radius.css'
import type { Color, Radius } from '@/theme/tokens'
import { Icon } from '../button/Icon'
import {
  badgeAvatarBase,
  badgeAvatarSizeVariants,
  badgeBase,
  badgeBaseCls,
  badgeColorVariants,
  badgeDeleteButtonBase,
  badgeDeleteButtonSizeVariants,
  badgeHighContrastByVariant,
  badgeHoverEnabledClass,
  badgeIconBase,
  badgeIconSizeVariants,
  badgeSizeVariants,
  badgeVariantBorderWidth,
} from './Badge.css'
import { badgePropDefs } from './badge.props'

type BadgeSize = (typeof badgePropDefs.size.values)[number]
type BadgeVariant = (typeof badgePropDefs.variant.values)[number]
const badgeAvatarSizeMap: Record<BadgeSize, AvatarSize> = {
  xs: 'xs',
  sm: 'sm',
  md: 'md',
}

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Size of the badge */
  size?: BadgeSize
  /** Visual variant */
  variant?: BadgeVariant
  /** Color scheme */
  color?: Color
  /** Border radius */
  radius?: Radius
  /** Whether to add high contrast */
  highContrast?: boolean
  /** Enable hover styles/cursor for interactive badges */
  hover?: boolean
  /** Optional leading icon rendered at the badge's controlled size */
  icon?: string | IconComponent
  /** Optional leading avatar for chip-style badges */
  avatar?: Omit<AvatarProps, 'size' | 'className'>
  /** Optional delete action for chip-style badges */
  onDelete?: () => void
  /** Optional custom delete icon component; defaults to a small x */
  deleteIcon?: IconComponent
  /** Accessible label for delete button */
  deleteLabel?: string
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      size = badgePropDefs.size.default,
      variant = 'soft',
      color = SemanticColor.slate,
      radius = 'full',
      highContrast = false,
      hover = badgePropDefs.hover.default,
      icon,
      avatar,
      onDelete,
      deleteIcon: DeleteIcon = X,
      deleteLabel = 'Remove',
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const safeSize = (normalizeEnumPropValue(badgePropDefs.size, size) ?? badgePropDefs.size.default) as BadgeSize
    const safeVariant = (normalizeEnumPropValue(badgePropDefs.variant, variant) ??
      badgePropDefs.variant.default) as BadgeVariant
    const safeColor = (normalizeEnumPropValue(badgePropDefs.color, color) ?? SemanticColor.slate) as Color
    const safeRadius = (normalizeEnumPropValue(badgePropDefs.radius, radius) ?? badgePropDefs.radius.default) as Radius
    const normalizedIconName = typeof icon === 'string' ? icon.trim() : ''
    const iconContent = normalizedIconName ? (
      <Icon icon={normalizedIconName} size={safeSize} style={{ color: 'inherit', width: 'auto', height: 'auto' }} />
    ) : icon ? (
      React.createElement(icon, { 'aria-hidden': true })
    ) : null

    return (
      <span
        ref={ref}
        className={cn(
          badgeBase,
          badgeBaseCls,
          badgeSizeVariants[safeSize],
          radiusStyleVariants[safeRadius],
          badgeVariantBorderWidth[safeVariant],
          badgeColorVariants[safeColor][safeVariant],
          hover && badgeHoverEnabledClass,
          hover && 'cursor-pointer',
          highContrast && 'af-high-contrast',
          highContrast && badgeHighContrastByVariant[safeVariant],
          className,
        )}
        {...props}
      >
        {iconContent ? <span className={cn(badgeIconBase, badgeIconSizeVariants[safeSize])}>{iconContent}</span> : null}
        {avatar && (
          <Avatar
            {...avatar}
            size={badgeAvatarSizeMap[safeSize]}
            className={cn(badgeAvatarBase, badgeAvatarSizeVariants[safeSize])}
          />
        )}
        {children}
        {onDelete && (
          <button
            type="button"
            aria-label={deleteLabel}
            onClick={event => {
              event.stopPropagation()
              onDelete()
            }}
            className={cn(badgeDeleteButtonBase, badgeDeleteButtonSizeVariants[safeSize])}
          >
            <DeleteIcon aria-hidden className="h-full w-full" />
          </button>
        )}
      </span>
    )
  },
)

Badge.displayName = 'Badge'

export { Badge }
