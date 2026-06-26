'use client'

import { X } from 'lucide-react'
import * as React from 'react'
import { Avatar } from '@/elements/avatar/Avatar'
import type { AvatarProps, AvatarSize } from '@/elements/avatar/avatar.props'
import type { IconComponent } from '@/elements/icon.types'
import { composeRefs } from '@/lib/compose-refs'
import { cn } from '@/lib/utils'
import { getMarginProps } from '@/theme/helpers/get-margin-styles'
import { SemanticColor } from '@/theme/props/color.prop'
import type { MarginProps } from '@/theme/props/margin.props'
import { normalizeBooleanPropValue, normalizeEnumPropValue } from '@/theme/props/prop-def'
import { radiusStyleVariants } from '@/theme/radius.css'
import type { Color, Radius, Responsive } from '@/theme/tokens'
import { Icon } from '../button/Icon'
import { resolveResponsiveEnumProp } from '../utils'
import {
  badgeAvatarBase,
  badgeAvatarSizeVariants,
  badgeBase,
  badgeBaseCls,
  badgeColorVariants,
  badgeDeleteButtonBase,
  badgeDeleteButtonSizeVariants,
  badgeHighContrastColorVariants,
  badgeHighContrastHoverColorVariants,
  badgeHoverColorVariants,
  badgeIconBase,
  badgeIconSizeVariants,
  badgeSizeVariants,
  badgeVariantBorderWidth,
} from './badge.class'
import { badgePropDefs } from './badge.props'

type BadgeSize = (typeof badgePropDefs.size.values)[number]
type BadgeVariant = (typeof badgePropDefs.variant.values)[number]
const badgeAvatarSizeMap: Record<BadgeSize, AvatarSize> = {
  xs: 'xs',
  sm: 'sm',
  md: 'md',
}

export interface BadgeProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'color'>, MarginProps {
  /** Size of the badge */
  size?: Responsive<BadgeSize>
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
  asChild?: boolean
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      size = badgePropDefs.size.default,
      variant = 'soft',
      color = SemanticColor.slate,
      radius = badgePropDefs.radius.default,
      asChild = false,
      highContrast = false,
      hover = badgePropDefs.hover.default,
      icon,
      avatar,
      onDelete,
      deleteIcon: DeleteIcon = X,
      deleteLabel = 'Remove',
      className,
      children,
      style,
      m,
      mx,
      my,
      mt,
      mr,
      mb,
      ml,
      ...props
    },
    ref,
  ) => {
    const safeSize = resolveResponsiveEnumProp(size, badgePropDefs.size)
    const safeVariant = (normalizeEnumPropValue(badgePropDefs.variant, variant) ??
      badgePropDefs.variant.default) as BadgeVariant
    const safeColor = (normalizeEnumPropValue(badgePropDefs.color, color) ?? SemanticColor.slate) as Color
    const safeRadius = (normalizeEnumPropValue(badgePropDefs.radius, radius) ?? badgePropDefs.radius.default) as Radius
    const safeHighContrast = normalizeBooleanPropValue(badgePropDefs.highContrast, highContrast) ?? false
    const safeHover = normalizeBooleanPropValue(badgePropDefs.hover, hover) ?? false
    const marginProps = getMarginProps({ m, mx, my, mt, mr, mb, ml })
    const normalizedIconName = typeof icon === 'string' ? icon.trim() : ''
    const iconContent = normalizedIconName ? (
      <Icon icon={normalizedIconName} size={safeSize} style={{ color: 'inherit', width: 'auto', height: 'auto' }} />
    ) : icon ? (
      React.createElement(icon, { 'aria-hidden': true })
    ) : null
    const colorVariantClassName = safeHighContrast
      ? badgeHighContrastColorVariants[safeColor][safeVariant]
      : badgeColorVariants[safeColor][safeVariant]
    const combinedStyles = {
      ...marginProps.style,
      ...style,
    }

    const badgeClasses = cn(
      badgeBase,
      badgeBaseCls,
      badgeSizeVariants[safeSize],
      radiusStyleVariants[safeRadius],
      badgeVariantBorderWidth[safeVariant],
      colorVariantClassName,
      safeHover &&
        (safeHighContrast
          ? badgeHighContrastHoverColorVariants[safeColor][safeVariant]
          : badgeHoverColorVariants[safeColor][safeVariant]),
      safeHover && 'cursor-pointer',
      safeHighContrast && 'af-high-contrast',
      marginProps.className,
      className,
    )

    const renderBadgeContent = (content: React.ReactNode) => (
      <>
        {iconContent ? <span className={cn(badgeIconBase, badgeIconSizeVariants[safeSize])}>{iconContent}</span> : null}
        {avatar && (
          <Avatar
            {...avatar}
            size={badgeAvatarSizeMap[safeSize]}
            className={cn(badgeAvatarBase, badgeAvatarSizeVariants[safeSize])}
          />
        )}
        {content}
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
      </>
    )

    if (asChild && React.isValidElement(children)) {
      const childElement = children as React.ReactElement<Record<string, unknown>> & {
        ref?: React.Ref<HTMLSpanElement>
      }
      const childProps = childElement.props as {
        className?: string
        style?: React.CSSProperties
        children?: React.ReactNode
      }
      const childRef = childElement.ref

      return React.cloneElement(childElement, {
        ...props,
        ref: childRef ? composeRefs(ref, childRef) : ref,
        className: cn(badgeClasses, childProps.className),
        style: { ...combinedStyles, ...childProps.style },
        children: renderBadgeContent(childProps.children),
      } as Record<string, unknown>)
    }

    return (
      <span ref={ref} className={badgeClasses} style={combinedStyles} {...props}>
        {renderBadgeContent(children)}
      </span>
    )
  },
)

Badge.displayName = 'Badge'

export { Badge }
