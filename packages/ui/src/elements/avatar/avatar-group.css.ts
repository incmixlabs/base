import { globalStyle, style, styleVariants } from '@vanilla-extract/css'
import { avatarPropDefs } from '@/elements/avatar/avatar.props'
import { controlSizeTokens } from '@/theme/token-maps'

const avatarSizes = avatarPropDefs.size.values
type AvatarSize = (typeof avatarPropDefs.size.values)[number]

export const avatarGroupStackItem = style({
  boxShadow: '0 0 0 2px var(--color-background)',
  selectors: {
    '&:hover, &:focus-within': {
      zIndex: 20,
    },
  },
})

export const avatarGroupStackBySize = styleVariants(
  Object.fromEntries(avatarSizes.map(size => [size, {}])) as Record<AvatarSize, Record<string, never>>,
)

const stackOverlapBySize: Record<AvatarSize, number> = {
  xs: 0,
  sm: -0.05,
  md: -0.1,
  lg: -0.2,
  xl: -0.25,
  '2x': -0.5,
}

for (const size of avatarSizes) {
  globalStyle(`${avatarGroupStackBySize[size]} > * + *`, {
    marginLeft: `calc(${controlSizeTokens[size].gap} * ${stackOverlapBySize[size]})`,
  })
}

export const avatarGroupSpreadBySize = styleVariants(
  Object.fromEntries(avatarSizes.map(size => [size, { gap: controlSizeTokens[size].gap }])) as Record<
    AvatarSize,
    { gap: string }
  >,
)

export const avatarGroupOverflowStackMarginBySize = styleVariants(
  Object.fromEntries(
    avatarSizes.map(size => [
      size,
      { marginLeft: `calc(${controlSizeTokens[size].gap} * ${stackOverlapBySize[size]})` },
    ]),
  ) as Record<AvatarSize, { marginLeft: string }>,
)
