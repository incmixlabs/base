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

export const dateSurfaceControlFrame = 'border border-solid border-neutral bg-neutral-background text-neutral'

const dateSurfaceFocusRingStyle =
  '[border-color:var(--color-primary-border)] [box-shadow:0_0_0_2px_var(--color-primary-primary-alpha)]'

const prefixDateSurfaceFocusRing = (prefix: 'focus-within' | 'focus-visible') =>
  dateSurfaceFocusRingStyle
    .split(' ')
    .map(className => `${prefix}:${className}`)
    .join(' ')

export const dateSurfaceFocusWithin = prefixDateSurfaceFocusRing('focus-within')

export const dateSurfaceFocusVisible = prefixDateSurfaceFocusRing('focus-visible')

export const dateSurfaceFocusOutline =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'

export const dateSurfaceFrameTransition =
  'transition-[background-color,border-color,box-shadow] duration-150 ease-in-out'

export const dateSurfaceInputFrame = [dateSurfaceControlFrame, dateSurfaceFocusWithin, dateSurfaceFrameTransition].join(
  ' ',
)

export const dateSurfaceButtonFrame = [
  dateSurfaceControlFrame,
  dateSurfaceFocusVisible,
  dateSurfaceFrameTransition,
].join(' ')

export const dateSurfacePopover = 'border border-neutral bg-neutral-surface text-neutral shadow-md'

export const dateSurfacePanel = 'border border-neutral bg-neutral-background text-neutral'

export const dateSurfaceDivider = 'border-neutral'

export const dateSurfaceFooterDivider = `border-t ${dateSurfaceDivider}`

export const dateSurfaceText = 'text-neutral'

export const dateSurfaceMutedText = 'text-muted'

export const dateSurfaceSubtleText = 'text-muted opacity-60'

export const dateSurfaceTextHover = 'hover:text-neutral hover:opacity-70'

export const dateSurfaceIconText = 'text-muted transition-colors hover:text-neutral hover:opacity-100'

export const dateSurfaceDayMutedState =
  'data-[outside-month]:text-muted data-[outside-month]:opacity-60 data-[unavailable]:text-muted data-[unavailable]:opacity-60'

export const dateSurfaceDayHover =
  '[&:hover:not([data-unavailable]):not([data-selected])]:bg-accent-soft data-[unavailable]:hover:bg-transparent'

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
  dateSurfaceControlFrame,
  dateSurfaceFocusWithin,
  dateSurfaceFocusVisible,
  dateSurfaceFocusOutline,
  dateSurfaceFrameTransition,
  dateSurfaceInputFrame,
  dateSurfaceButtonFrame,
  dateSurfacePopover,
  dateSurfacePanel,
  dateSurfaceDivider,
  dateSurfaceFooterDivider,
  dateSurfaceText,
  dateSurfaceMutedText,
  dateSurfaceSubtleText,
  dateSurfaceTextHover,
  dateSurfaceIconText,
  dateSurfaceDayMutedState,
  dateSurfaceDayHover,
  ...Object.values(dateCalendarNavButtonSizeStyles),
  ...Object.values(dateCalendarNavIconSizeStyles),
]
