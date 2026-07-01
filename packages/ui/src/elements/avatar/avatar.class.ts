import type { avatarPropDefs } from './avatar.props'

export type AvatarSize = (typeof avatarPropDefs.size.values)[number]

export const avatarFallbackMuted =
  'bg-[color-mix(in_oklch,var(--color-slate-soft)_70%,transparent)] text-[var(--color-slate-text)]'
export const avatarPresence = 'border-[1.5px] border-solid border-[var(--color-light-background)]'
export const avatarPresenceBusyLine = 'h-[1px] bg-[var(--color-light-contrast)] -rotate-45 origin-center rounded-full'
export const avatarDefaultIcon = 'w-3/5 h-3/5'

export const avatarPresenceBySize = {
  xs: 'w-[0.375rem] h-[0.375rem]',
  sm: 'w-[0.5rem] h-[0.5rem]',
  md: 'w-[0.625rem] h-[0.625rem]',
  lg: 'w-[0.75rem] h-[0.75rem]',
  xl: 'w-[0.875rem] h-[0.875rem]',
  '2x': 'w-[1rem] h-[1rem]',
} as const satisfies Record<AvatarSize, string>

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
} as const satisfies Record<AvatarSize, string>

export const avatarSizeBySize = {
  xs: 'w-[1.5rem] h-[1.5rem] text-xs leading-4',
  sm: 'w-[1.75rem] h-[1.75rem] text-sm leading-5',
  md: 'w-[2rem] h-[2rem] text-base leading-6',
  lg: 'w-[2.5rem] h-[2.5rem] text-lg leading-[1.625rem]',
  xl: 'w-[2.75rem] h-[2.75rem] text-xl leading-7',
  '2x': 'w-[5rem] h-[5rem] text-2xl leading-[1.875rem]',
} as const satisfies Record<AvatarSize, string>

export const avatarRadiusByRadius = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  full: 'rounded-full',
} as const

// avatar-group classes
export const avatarGroupStackItem = 'shadow-[0_0_0_2px_var(--color-neutral-background)] hover:z-20 focus-within:z-20'

export const avatarGroupStackBySize = {
  xs: 'flex -space-x-0',
  sm: 'flex [&>*+*]:-ml-[0.01875rem]',
  md: 'flex [&>*+*]:-ml-[0.05rem]',
  lg: 'flex [&>*+*]:-ml-[0.125rem]',
  xl: 'flex [&>*+*]:-ml-[0.171875rem]',
  '2x': 'flex [&>*+*]:-ml-[0.4375rem]',
} as const satisfies Record<AvatarSize, string>

export const avatarGroupSpreadBySize = {
  xs: 'gap-[0.25rem]',
  sm: 'gap-[0.375rem]',
  md: 'gap-[0.5rem]',
  lg: 'gap-[0.625rem]',
  xl: 'gap-[0.6875rem]',
  '2x': 'gap-[0.875rem]',
} as const satisfies Record<AvatarSize, string>

export const avatarGroupOverflowStackMarginBySize = {
  xs: '-ml-0',
  sm: '-ml-[0.01875rem]',
  md: '-ml-[0.05rem]',
  lg: '-ml-[0.125rem]',
  xl: '-ml-[0.171875rem]',
  '2x': '-ml-[0.4375rem]',
} as const satisfies Record<AvatarSize, string>

// avatar-list classes
export const avatarListItemBase = '[&+&]:mt-[2px]'

export const avatarListItemBySize = {
  xs: 'gap-[calc(0.25rem*1.125)] py-[calc(0.25rem*0.5*0.5)]',
  sm: 'gap-[calc(0.375rem*1.125)] py-[calc(0.25rem*0.5)]',
  md: 'gap-[calc(0.5rem*1.125)] py-[calc(0.25rem*0.5)]',
  lg: 'gap-[calc(0.625rem*1.125)] py-[calc(0.4375rem*0.5)]',
  xl: 'gap-[calc(0.6875rem*1.125)] py-[calc(0.5rem*0.5)]',
  '2x': 'gap-[calc(0.875rem*1.125)] py-[calc(1.5625rem*0.5)]',
} as const satisfies Record<AvatarSize, string>

// avatar-pie classes
export const avatarPieRoot =
  'isolate bg-[var(--color-neutral-background)] shadow-[inset_0_0_0_1px_var(--color-neutral-border-subtle)]'

export const avatarPieSizeBySize = {
  xs: 'w-6 h-6',
  sm: 'w-7 h-7',
  md: 'w-8 h-8',
  lg: 'w-10 h-10',
  xl: 'w-11 h-11',
  '2x': 'w-20 h-20',
} as const satisfies Record<AvatarSize, string>

export const avatarPieOverflowLabel = 'text-[var(--color-slate-text)] bg-[var(--color-slate-soft)]'
export const avatarPieSliceTwoFirst = 'absolute top-0 left-0 w-[calc(50%-1px)] h-full rounded-l-full'
export const avatarPieSliceTwoSecond = 'absolute top-0 left-[calc(50%+1px)] w-[calc(50%-1px)] h-full rounded-r-full'
export const avatarPieSliceThreeFirst = 'absolute top-0 left-0 w-[calc(50%-1px)] h-[calc(50%-1px)] rounded-tl-full'
export const avatarPieSliceThreeSecond =
  'absolute top-[calc(50%+1px)] left-0 w-[calc(50%-1px)] h-[calc(50%-1px)] rounded-bl-full'
export const avatarPieSliceThreeThird = 'absolute top-0 left-[calc(50%+1px)] w-[calc(50%-1px)] h-full rounded-r-full'
