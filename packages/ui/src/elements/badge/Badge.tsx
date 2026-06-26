'use client'

import { X } from 'lucide-react'
import * as React from 'react'
import { Avatar } from '@/elements/avatar/Avatar'
import type { AvatarProps, AvatarSize } from '@/elements/avatar/avatar.props'
import type { IconComponent } from '@/elements/icon.types'
import { composeRefs } from '@/lib/compose-refs'
import { cn } from '@/lib/utils'
import { getMarginProps } from '@/theme/helpers/get-margin-styles'
import { radiusClassByToken } from '@/theme/helpers/token-class-maps'
import { SemanticColor } from '@/theme/props/color.prop'
import type { MarginProps } from '@/theme/props/margin.props'
import { normalizeBooleanPropValue, normalizeEnumPropValue } from '@/theme/props/prop-def'
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
type BadgeSlotProps = {
  className?: string
  style?: React.CSSProperties
  children?: React.ReactNode
  ref?: React.Ref<HTMLSpanElement>
  role?: React.AriaRole
}

const badgeAvatarSizeMap: Record<BadgeSize, AvatarSize> = {
  xs: 'xs',
  sm: 'sm',
  md: 'md',
}

const badgeAvatarStyleMap: Record<BadgeSize, React.CSSProperties> = {
  xs: { width: '1.25rem', height: '1.25rem' },
  sm: { width: '1.5rem', height: '1.5rem' },
  md: { width: '1.75rem', height: '1.75rem' },
}

const badgeDeleteButtonStyleMap: Record<BadgeSize, React.CSSProperties> = {
  xs: { width: '10px', height: '10px' },
  sm: { width: '12px', height: '12px' },
  md: { width: '14px', height: '14px' },
}

const interactiveBadgeHostTags = new Set(['a', 'button', 'input', 'select', 'textarea', 'summary', 'label'])
const interactiveBadgeRoles = new Set(['button', 'link', 'menuitem', 'option', 'tab'])

function isInteractiveBadgeHost(element: React.ReactElement, props: BadgeSlotProps) {
  return (
    (typeof element.type === 'string' && interactiveBadgeHostTags.has(element.type)) ||
    (props.role !== undefined && interactiveBadgeRoles.has(props.role))
  )
}

export interface BadgeProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'color'>, MarginProps {
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
    const safeSize = (normalizeEnumPropValue(badgePropDefs.size, size) ?? badgePropDefs.size.default) as BadgeSize
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
      radiusClassByToken[safeRadius],
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

    const deleteButton = onDelete ? (
      <button
        type="button"
        aria-label={deleteLabel}
        onClick={event => {
          event.stopPropagation()
          onDelete()
        }}
        style={badgeDeleteButtonStyleMap[safeSize]}
        className={cn(badgeDeleteButtonBase, badgeDeleteButtonSizeVariants[safeSize])}
      >
        <DeleteIcon aria-hidden className="h-full w-full" strokeWidth={1.8} />
      </button>
    ) : null

    const renderBadgeContent = (content: React.ReactNode) => (
      <>
        {iconContent ? <span className={cn(badgeIconBase, badgeIconSizeVariants[safeSize])}>{iconContent}</span> : null}
        {avatar && (
          <Avatar
            {...avatar}
            size={badgeAvatarSizeMap[safeSize]}
            style={badgeAvatarStyleMap[safeSize]}
            className={cn(badgeAvatarBase, badgeAvatarSizeVariants[safeSize])}
          />
        )}
        {content}
        {deleteButton}
      </>
    )

    if (asChild && React.isValidElement(children)) {
      const childElement = children as React.ReactElement<Record<string, unknown>>
      const childProps = childElement.props as BadgeSlotProps
      const childRef = childProps.ref

      if (onDelete && isInteractiveBadgeHost(childElement, childProps)) {
        return (
          <span ref={ref} className={badgeClasses} style={combinedStyles} {...props}>
            {renderBadgeContent(children)}
          </span>
        )
      }

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
