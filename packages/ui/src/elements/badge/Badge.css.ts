import { createVar, globalStyle, style, styleVariants } from '@vanilla-extract/css'
import { getControlSizeValues } from '@/elements/control-size'
import {
  surfaceColorVariants,
  surfaceHighContrastByVariant,
  surfaceHoverEnabledClass,
} from '@/elements/surface/surface.css'
import { badgeSizeVar } from '@/theme/runtime/component-vars'
import type { Color } from '@/theme/tokens'
import type { BadgeVariant } from './badge.props'
import { badgePropDefs } from './badge.props'

export const badgeBaseCls =
  'inline-flex items-center justify-center font-medium whitespace-nowrap shrink-0 leading-none h-fit'
export const badgeBase = style({
  borderStyle: 'solid',
  borderWidth: 0,
})
const badgeIconSizeVar = createVar()
const badgeDeleteIconSizeVar = createVar()
export const badgeIconBase = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  lineHeight: 1,
})
export const badgeDeleteButtonBase = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  padding: 0,
  border: 0,
  background: 'transparent',
  color: 'inherit',
  lineHeight: 1,
  cursor: 'pointer',
})
export const badgeAvatarBase = style({
  flexShrink: 0,
})

globalStyle(`${badgeIconBase} svg`, {
  width: badgeIconSizeVar,
  height: badgeIconSizeVar,
  flexShrink: 0,
})

globalStyle(`${badgeDeleteButtonBase} svg`, {
  width: badgeDeleteIconSizeVar,
  height: badgeDeleteIconSizeVar,
  flexShrink: 0,
})

type BadgeSize = (typeof badgePropDefs.size.values)[number]

const getBadgeSizeStyle = (size: BadgeSize) => {
  const token = getControlSizeValues(size)
  return {
    fontSize: badgeSizeVar(size, 'fontSize', token.fontSize),
    lineHeight: badgeSizeVar(size, 'lineHeight', token.lineHeight),
    paddingInline: badgeSizeVar(size, 'paddingInline', token.paddingX),
    paddingBlock: badgeSizeVar(size, 'paddingBlock', token.paddingY),
    gap: badgeSizeVar(size, 'gap', token.gap),
  }
}

const getBadgeIconSizeStyle = (size: BadgeSize) => {
  const token = getControlSizeValues(size)
  return {
    vars: {
      [badgeIconSizeVar]: badgeSizeVar(size, 'deleteButtonSize', token.iconSize),
    },
  }
}

const getBadgeDeleteButtonSizeStyle = (size: BadgeSize) => {
  const token = getControlSizeValues(size)
  return {
    width: badgeSizeVar(size, 'deleteButtonSize', token.iconSize),
    height: badgeSizeVar(size, 'deleteButtonSize', token.iconSize),
    marginInlineStart: badgeSizeVar(size, 'deleteButtonMarginStart', '0.125rem'),
    vars: {
      [badgeDeleteIconSizeVar]: badgeSizeVar(size, 'deleteButtonSize', token.iconSize),
    },
  }
}

const getBadgeAvatarSizeStyle = (size: BadgeSize) => {
  const token = getControlSizeValues(size)
  const avatarSize = `calc(${token.lineHeight} + 0.25rem)`
  return {
    marginInlineStart: badgeSizeVar(size, 'avatarMarginStart', '-0.25rem'),
    selectors: {
      '&.af-avatar-size': {
        width: badgeSizeVar(size, 'avatarSize', avatarSize),
        height: badgeSizeVar(size, 'avatarSize', avatarSize),
        fontSize: `calc(${token.fontSize} * 0.75)`,
        lineHeight: badgeSizeVar(size, 'avatarSize', avatarSize),
      },
    },
  }
}

export const badgeSizeVariants: Record<BadgeSize, string> = styleVariants(
  Object.fromEntries(badgePropDefs.size.values.map(size => [size, getBadgeSizeStyle(size)])) as Record<
    BadgeSize,
    ReturnType<typeof getBadgeSizeStyle>
  >,
)

export const badgeDeleteButtonSizeVariants: Record<BadgeSize, string> = styleVariants(
  Object.fromEntries(badgePropDefs.size.values.map(size => [size, getBadgeDeleteButtonSizeStyle(size)])) as Record<
    BadgeSize,
    ReturnType<typeof getBadgeDeleteButtonSizeStyle>
  >,
)

export const badgeIconSizeVariants: Record<BadgeSize, string> = styleVariants(
  Object.fromEntries(badgePropDefs.size.values.map(size => [size, getBadgeIconSizeStyle(size)])) as Record<
    BadgeSize,
    ReturnType<typeof getBadgeIconSizeStyle>
  >,
)

export const badgeAvatarSizeVariants: Record<BadgeSize, string> = styleVariants(
  Object.fromEntries(badgePropDefs.size.values.map(size => [size, getBadgeAvatarSizeStyle(size)])) as Record<
    BadgeSize,
    ReturnType<typeof getBadgeAvatarSizeStyle>
  >,
)

export const badgeColorVariants = surfaceColorVariants as Record<Color, Record<BadgeVariant, string>>

export const badgeHoverEnabledClass = surfaceHoverEnabledClass

export const badgeHighContrastByVariant = surfaceHighContrastByVariant as Record<BadgeVariant, string>

export const badgeVariantBorderWidth = styleVariants({
  solid: { borderWidth: 0 },
  soft: { borderWidth: 0 },
  outline: { borderWidth: 1 },
  surface: { borderWidth: 1 },
})
