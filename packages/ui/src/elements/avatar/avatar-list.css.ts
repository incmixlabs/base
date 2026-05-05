import { style, styleVariants } from '@vanilla-extract/css'
import { avatarPropDefs } from '@/elements/avatar/avatar.props'
import { controlSizeTokens } from '@/theme/token-maps'

type AvatarSize = (typeof avatarPropDefs.size.values)[number]

export const avatarListItemBase = style({
  selectors: {
    '& + &': {
      marginTop: '0.125rem',
    },
  },
})

export const avatarListItemBySize = styleVariants(
  Object.fromEntries(
    avatarPropDefs.size.values.map(size => [
      size,
      {
        gap: `calc(${controlSizeTokens[size].gap} * 1.125)`,
        padding: `calc(${controlSizeTokens[size].paddingY} * 0.5) 0`,
      },
    ]),
  ) as Record<AvatarSize, { gap: string; padding: string }>,
)
