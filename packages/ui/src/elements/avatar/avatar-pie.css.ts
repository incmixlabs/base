import { style, styleVariants } from '@vanilla-extract/css'
import { avatarPropDefs } from '@/elements/avatar/avatar.props'
import { controlSizeTokens } from '@/theme/token-maps'

type AvatarSize = (typeof avatarPropDefs.size.values)[number]

export const avatarPieRoot = style({
  isolation: 'isolate',
  backgroundColor: 'var(--color-background)',
  boxShadow: 'inset 0 0 0 1px var(--color-neutral-border-subtle)',
})

export const avatarPieSizeBySize = styleVariants(
  Object.fromEntries(
    avatarPropDefs.size.values.map(size => [
      size,
      {
        width: controlSizeTokens[size].height,
        height: controlSizeTokens[size].height,
      },
    ]),
  ) as Record<AvatarSize, { width: string; height: string }>,
)

export const avatarPieOverflowLabel = style({
  color: 'var(--color-slate-text)',
  backgroundColor: 'var(--color-slate-soft)',
})

export const avatarPieSliceTwoFirst = style({
  top: 0,
  left: 0,
  width: 'calc(50% - 1px)',
  height: '100%',
  borderTopLeftRadius: '9999px',
  borderBottomLeftRadius: '9999px',
})

export const avatarPieSliceTwoSecond = style({
  top: 0,
  left: 'calc(50% + 1px)',
  width: 'calc(50% - 1px)',
  height: '100%',
  borderTopRightRadius: '9999px',
  borderBottomRightRadius: '9999px',
})

export const avatarPieSliceThreeFirst = style({
  top: 0,
  left: 0,
  width: 'calc(50% - 1px)',
  height: 'calc(50% - 1px)',
  borderTopLeftRadius: '9999px',
})

export const avatarPieSliceThreeSecond = style({
  top: 'calc(50% + 1px)',
  left: 0,
  width: 'calc(50% - 1px)',
  height: 'calc(50% - 1px)',
  borderBottomLeftRadius: '9999px',
})

export const avatarPieSliceThreeThird = style({
  top: 0,
  left: 'calc(50% + 1px)',
  width: 'calc(50% - 1px)',
  height: '100%',
  borderTopRightRadius: '9999px',
  borderBottomRightRadius: '9999px',
})
