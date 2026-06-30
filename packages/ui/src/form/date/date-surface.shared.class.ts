import { semanticColorKeys } from '../../theme/props/color.prop'
import type { Color, Radius } from '../../theme/tokens'
import type { DateSize } from './date.props'

type DateCalendarNavButtonVariant = 'soft' | 'outline' | 'ghost'

const dateRadiusKeys = ['none', 'sm', 'md', 'lg', 'full'] as const satisfies readonly Radius[]

export const dateRadiusClassStyles = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  full: 'rounded-full',
} as const satisfies Record<Radius, string>

const dateElementRadiusValues = {
  none: '0',
  sm: 'var(--radius-sm)',
  md: 'var(--radius-md)',
  lg: 'var(--radius-lg)',
  full: '9999px',
} as const satisfies Record<Radius, string>

export const dateElementRadiusStyles = Object.fromEntries(
  dateRadiusKeys.map(radius => [
    radius,
    `${dateRadiusClassStyles[radius]} [--element-border-radius:${dateElementRadiusValues[radius]}]`,
  ]),
) as Record<Radius, string>

export const dateCalendarNavButton =
  'inline-flex items-center justify-center rounded-[var(--element-border-radius,var(--radius-md))] p-0'

export const dateCalendarNavButtonColorStyles = Object.fromEntries(
  semanticColorKeys.map(color => [
    color,
    {
      soft: `!border-transparent !bg-${color}-soft !text-${color} hover:!bg-${color}-solid hover:!text-${color}-contrast`,
      outline: `!border-${color} !bg-transparent !text-${color} hover:!bg-${color}-soft hover:!text-${color}`,
      ghost: `!border-transparent !bg-transparent !text-${color} hover:!bg-${color}-soft hover:!text-${color}`,
    },
  ]),
) as Record<Color, Record<DateCalendarNavButtonVariant, string>>

export const dateCalendarNavIcon = 'shrink-0'

export const dateCalendarMonthPickerIcon = 'h-[48%] w-[48%] shrink-0 opacity-85'

export const dateCalendarNavButtonSizeStyles = {
  xs: 'h-7 w-7',
  sm: 'h-8 w-8',
  md: 'h-[2.25rem] w-[2.25rem]',
  lg: 'h-10 w-10',
  xl: 'h-12 w-12',
  '2x': 'h-14 w-14',
} as const satisfies Record<DateSize, string>

export const dateCalendarNavIconSizeStyles = {
  xs: 'h-3 w-3',
  sm: 'h-3.5 w-3.5',
  md: 'h-4 w-4',
  lg: 'h-[1.125rem] w-[1.125rem]',
  xl: 'h-5 w-5',
  '2x': 'h-6 w-6',
} as const satisfies Record<DateSize, string>

export const dateSurfaceSharedClassNames = [
  ...Object.values(dateRadiusClassStyles),
  ...Object.values(dateElementRadiusStyles),
  dateCalendarNavButton,
  ...Object.values(dateCalendarNavButtonColorStyles).flatMap(variantMap => Object.values(variantMap)),
  dateCalendarNavIcon,
  dateCalendarMonthPickerIcon,
  ...Object.values(dateCalendarNavButtonSizeStyles),
  ...Object.values(dateCalendarNavIconSizeStyles),
]
