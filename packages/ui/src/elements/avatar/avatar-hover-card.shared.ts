import type { AvatarSize } from './avatar.props'

export function getHoverCardContentSize(size: AvatarSize | undefined): 'sm' | 'md' | 'lg' {
  switch (size) {
    case 'xs':
    case 'sm':
      return 'sm'
    case 'md':
      return 'sm'
    case 'lg':
      return 'md'
    case 'xl':
    case '2x':
      return 'lg'
    default:
      return 'sm'
  }
}

export const avatarListTitleSizeByAvatarSize: Record<AvatarSize, 'xs' | 'sm' | 'md' | 'lg'> = {
  xs: 'xs',
  sm: 'sm',
  md: 'sm',
  lg: 'md',
  xl: 'md',
  '2x': 'lg',
}
