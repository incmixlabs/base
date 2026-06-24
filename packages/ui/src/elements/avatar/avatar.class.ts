export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2x'

export const avatarFallbackMuted = 'af-avatar-fallback-muted'
export const avatarPresence = 'af-avatar-presence'
export const avatarPresenceBusyLine = 'af-avatar-presence-busy-line'
export const avatarDefaultIcon = 'af-avatar-default-icon'

export const avatarPresenceBySize = {
  xs: 'w-[0.375rem] h-[0.375rem]',
  sm: 'w-[0.5rem] h-[0.5rem]',
  md: 'w-[0.625rem] h-[0.625rem]',
  lg: 'w-[0.75rem] h-[0.75rem]',
  xl: 'w-[0.875rem] h-[0.875rem]',
  '2x': 'w-[1rem] h-[1rem]',
} as const

export const avatarPresenceByState = {
  online: 'bg-[var(--color-success-primary)]',
  offline: 'bg-[var(--color-warning-primary)]',
  unknown: 'bg-[var(--color-neutral-text)]',
  busy: 'bg-[var(--color-error-primary)]',
} as const

export const avatarPresenceBusyLineBySize = {
  xs: 'w-[0.5rem]',
  sm: 'w-[0.625rem]',
  md: 'w-[0.75rem]',
  lg: 'w-[0.875rem]',
  xl: 'w-[1rem]',
  '2x': 'w-[1.125rem]',
} as const

export const avatarSizeBySize = {
  xs: 'af-avatar-size-xs',
  sm: 'af-avatar-size-sm',
  md: 'af-avatar-size-md',
  lg: 'af-avatar-size-lg',
  xl: 'af-avatar-size-xl',
  '2x': 'af-avatar-size-2x',
} as const

export const avatarRadiusByRadius = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  full: 'rounded-full',
} as const

// avatar-group classes
export const avatarGroupStackItem = 'af-avatar-group-stack-item'

export const avatarGroupStackBySize = {
  xs: 'af-avatar-group-stack-xs af-avatar-group-stack',
  sm: 'af-avatar-group-stack-sm af-avatar-group-stack',
  md: 'af-avatar-group-stack-md af-avatar-group-stack',
  lg: 'af-avatar-group-stack-lg af-avatar-group-stack',
  xl: 'af-avatar-group-stack-xl af-avatar-group-stack',
  '2x': 'af-avatar-group-stack-2x af-avatar-group-stack',
} as const

export const avatarGroupSpreadBySize = {
  xs: 'gap-[0.25rem]',
  sm: 'gap-[0.375rem]',
  md: 'gap-[0.5rem]',
  lg: 'gap-[0.625rem]',
  xl: 'gap-[0.6875rem]',
  '2x': 'gap-[0.875rem]',
} as const

export const avatarGroupOverflowStackMarginBySize = {
  xs: 'ml-0',
  sm: 'ml-[calc(0.375rem*-0.05)]',
  md: 'ml-[calc(0.5rem*-0.1)]',
  lg: 'ml-[calc(0.625rem*-0.2)]',
  xl: 'ml-[calc(0.6875rem*-0.25)]',
  '2x': 'ml-[calc(0.875rem*-0.5)]',
} as const

// avatar-list classes
export const avatarListItemBase = 'af-avatar-list-item-base'

export const avatarListItemBySize = {
  xs: 'gap-[calc(0.25rem*1.125)] py-[calc(0.25rem*0.5*0.5)]',
  sm: 'gap-[calc(0.375rem*1.125)] py-[calc(0.25rem*0.5)]',
  md: 'gap-[calc(0.5rem*1.125)] py-[calc(0.25rem*0.5)]',
  lg: 'gap-[calc(0.625rem*1.125)] py-[calc(0.4375rem*0.5)]',
  xl: 'gap-[calc(0.6875rem*1.125)] py-[calc(0.5rem*0.5)]',
  '2x': 'gap-[calc(0.875rem*1.125)] py-[calc(1.5625rem*0.5)]',
} as const

// avatar-pie classes
export const avatarPieRoot = 'af-avatar-pie-root'

export const avatarPieSizeBySize = {
  xs: 'w-[1.5rem] h-[1.5rem]',
  sm: 'w-[1.75rem] h-[1.75rem]',
  md: 'w-[2rem] h-[2rem]',
  lg: 'w-[2.5rem] h-[2.5rem]',
  xl: 'w-[2.75rem] h-[2.75rem]',
  '2x': 'w-[5rem] h-[5rem]',
} as const

export const avatarPieOverflowLabel = 'af-avatar-pie-overflow-label'
export const avatarPieSliceTwoFirst = 'af-avatar-pie-slice-two-first'
export const avatarPieSliceTwoSecond = 'af-avatar-pie-slice-two-second'
export const avatarPieSliceThreeFirst = 'af-avatar-pie-slice-three-first'
export const avatarPieSliceThreeSecond = 'af-avatar-pie-slice-three-second'
export const avatarPieSliceThreeThird = 'af-avatar-pie-slice-three-third'
