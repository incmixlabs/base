import { semanticColorKeys } from '../../theme/props/color.prop'
import type { Color } from '../../theme/tokens'
import type { DateSize } from './date.props'
import { dateRadiusClassStyles } from './date-surface.shared.class'

export const miniCalendarRoot = 'inline-flex w-max max-w-full flex-col border border-solid border-border bg-background'

export const miniCalendarRootDisabled = 'opacity-50 pointer-events-none'

export const miniCalendarSizeStyles = {
  xs: 'text-xs leading-4',
  sm: 'text-sm leading-5',
  md: 'text-base leading-6',
  lg: 'text-lg leading-[1.625rem]',
  xl: 'text-xl leading-7',
  '2x': 'text-2xl leading-[1.875rem]',
} as const satisfies Record<DateSize, string>

export const miniCalendarRadiusStyles = dateRadiusClassStyles

export const miniCalendarBody = 'flex flex-col'

export const miniCalendarBodySizeStyles = {
  xs: 'gap-1 p-1',
  sm: 'gap-1.5 p-1',
  md: 'gap-2 p-1',
  lg: 'gap-2.5 p-[0.4375rem]',
  xl: 'gap-[0.6875rem] p-2',
  '2x': 'gap-3.5 p-[1.5625rem]',
} as const satisfies Record<DateSize, string>

export const miniCalendarHeaderTitle = 'font-medium text-foreground'

export const miniCalendarHeaderTitleSizeStyles = {
  xs: 'text-xs leading-[1.2]',
  sm: 'text-sm leading-[1.2]',
  md: 'text-base leading-[1.2]',
  lg: 'text-lg leading-[1.2]',
  xl: 'text-xl leading-[1.2]',
  '2x': 'text-2xl leading-[1.2]',
} as const satisfies Record<DateSize, string>

export const miniCalendarHeader = ''

export const miniCalendarHeaderSizeStyles = {
  xs: 'gap-1',
  sm: 'gap-1.5',
  md: 'gap-2',
  lg: 'gap-2.5',
  xl: 'gap-[0.6875rem]',
  '2x': 'gap-3.5',
} as const satisfies Record<DateSize, string>

export const miniCalendarNavButton = ''

export const miniCalendarNavButtonSizeStyles = {
  xs: 'h-7 w-7',
  sm: 'h-8 w-8',
  md: 'h-[2.25rem] w-[2.25rem]',
  lg: 'h-10 w-10',
  xl: 'h-12 w-12',
  '2x': 'h-14 w-14',
} as const satisfies Record<DateSize, string>

export const miniCalendarNavIcon = 'shrink-0'

export const miniCalendarNavIconSizeStyles = {
  xs: 'h-3 w-3',
  sm: 'h-3.5 w-3.5',
  md: 'h-4 w-4',
  lg: 'h-[1.125rem] w-[1.125rem]',
  xl: 'h-5 w-5',
  '2x': 'h-6 w-6',
} as const satisfies Record<DateSize, string>

export const miniCalendarDayColorStyles: Record<Color, string> = Object.fromEntries(
  semanticColorKeys.map(color => [color, `text-${color}`]),
) as Record<Color, string>

export const miniCalendarClassNames = [
  miniCalendarRoot,
  miniCalendarRootDisabled,
  ...Object.values(miniCalendarSizeStyles),
  ...Object.values(miniCalendarRadiusStyles),
  miniCalendarBody,
  ...Object.values(miniCalendarBodySizeStyles),
  miniCalendarHeaderTitle,
  ...Object.values(miniCalendarHeaderTitleSizeStyles),
  ...Object.values(miniCalendarHeaderSizeStyles),
  ...Object.values(miniCalendarNavButtonSizeStyles),
  miniCalendarNavIcon,
  ...Object.values(miniCalendarNavIconSizeStyles),
  ...Object.values(miniCalendarDayColorStyles),
]
