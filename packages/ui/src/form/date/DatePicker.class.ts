import { semanticColorKeys, semanticColorVar } from '../../theme/props/color.prop'
import type { Color } from '../../theme/tokens'
import type { DateSize, DateVariant } from './date.props'
import {
  dateCalendarNavButton,
  dateCalendarNavButtonSizeStyles,
  dateCalendarNavIconSizeStyles,
  dateElementRadiusStyles,
  dateRadiusClassStyles,
  dateSurfaceButtonFrame,
  dateSurfaceDayHover,
  dateSurfaceDayMutedState,
  dateSurfaceFocusOutline,
  dateSurfaceInputFrame,
} from './date-surface.shared.class'

const joinClass = (...parts: string[]) => parts.join('')
const colorVar = (color: Color, token: Parameters<typeof semanticColorVar>[1]) => semanticColorVar(color, token)

export const datePickerTriggerGroupBase = 'flex w-full min-w-0 items-center'

export const datePickerTriggerGroupSizeStyles = {
  xs: 'gap-1',
  sm: 'gap-1.5',
  md: 'gap-2',
  lg: 'gap-2.5',
  xl: 'gap-[0.6875rem]',
  '2x': 'gap-3.5',
} as const satisfies Record<DateSize, string>

export const datePickerControlSizeStyles = {
  xs: 'h-6 px-2 py-1 text-xs leading-4',
  sm: 'h-7 px-2.5 py-1 text-sm leading-5',
  md: 'h-8 px-3 py-1 text-base leading-6',
  lg: 'h-10 px-3.5 py-[0.4375rem] text-lg leading-[1.625rem]',
  xl: 'h-11 px-3.5 py-2 text-xl leading-7',
  '2x': 'h-[5rem] px-5 py-[1.5625rem] text-2xl leading-[1.875rem]',
} as const satisfies Record<DateSize, string>

export const datePickerInput = [
  'flex flex-1 w-full min-w-0 items-center gap-1 rounded-[var(--element-border-radius,var(--radius-md))]',
  dateSurfaceInputFrame,
].join(' ')

export const datePickerInputSizeStyles = datePickerControlSizeStyles

export const datePickerCalendarButton = [
  'inline-flex items-center justify-center rounded-[var(--element-border-radius,var(--radius-md))]',
  dateSurfaceButtonFrame,
].join(' ')

export const datePickerCalendarButtonSizeStyles = {
  xs: 'h-6 w-6',
  sm: 'h-7 w-7',
  md: 'h-8 w-8',
  lg: 'h-10 w-10',
  xl: 'h-11 w-11',
  '2x': 'h-[5rem] w-[5rem]',
} as const satisfies Record<DateSize, string>

export const datePickerCalendarIcon = 'shrink-0'

export const datePickerCalendarIconControlSizeStyles = {
  xs: 'h-3 w-3',
  sm: 'h-3 w-3',
  md: 'h-3.5 w-3.5',
  lg: 'h-4 w-4',
  xl: 'h-5 w-5',
  '2x': 'h-6 w-6',
} as const satisfies Record<DateSize, string>

export const datePickerNavButton = dateCalendarNavButton

export const datePickerNavButtonSizeStyles = dateCalendarNavButtonSizeStyles

export const datePickerCalendarIconSizeStyles = dateCalendarNavIconSizeStyles

export const datePickerCalendarCell = 'grid place-items-center'

export const datePickerCalendarCellSizeStyles = {
  xs: 'h-7 w-7 text-sm leading-5',
  sm: 'h-8 w-8 text-base leading-6',
  md: 'h-[2.25rem] w-[2.25rem] text-lg leading-[1.625rem]',
  lg: 'h-10 w-10 text-xl leading-7',
  xl: 'h-12 w-12 text-2xl leading-[1.875rem]',
  '2x': 'h-14 w-14 text-3xl leading-9',
} as const satisfies Record<DateSize, string>

export const datePickerCalendarCellRadiusStyles = dateRadiusClassStyles

export const datePickerCalendarDayInteractive = [
  'appearance-none border-0 bg-transparent p-0 m-0 font-[inherit] text-inherit cursor-pointer text-center outline-none disabled:cursor-default disabled:opacity-100',
  dateSurfaceDayMutedState,
  dateSurfaceDayHover,
  dateSurfaceFocusOutline,
].join(' ')

export const datePickerTriggerGroupRadiusStyles = dateElementRadiusStyles

export const datePickerTriggerGroupVariantStyles = {
  soft: 'border-0 bg-neutral-soft',
  surface: 'border border-solid border-neutral bg-neutral-surface shadow-xs',
  outline: 'border border-solid border-neutral bg-neutral-background',
  ghost: 'border-0 bg-transparent',
  'floating-filled': 'border border-solid border-neutral bg-neutral-background',
  'floating-standard': 'border border-solid border-neutral bg-neutral-background',
  'floating-outlined': 'border border-solid border-neutral bg-neutral-background',
} as const satisfies Record<DateVariant, string>

export const datePickerTriggerGroupBorderColorStyles: Record<Color, string> = Object.fromEntries(
  semanticColorKeys.map(color => [
    color,
    [
      joinClass('border-', color),
      joinClass('focus-within:[border-color:', colorVar(color, 'solid'), ']'),
      joinClass('focus-within:[box-shadow:0_0_0_2px_', colorVar(color, 'solid-alpha'), ']'),
    ].join(' '),
  ]),
) as Record<Color, string>

export const datePickerTriggerGroupSolidColorStyles: Record<Color, string> = Object.fromEntries(
  semanticColorKeys.map(color => [
    color,
    [
      joinClass('bg-[', colorVar(color, 'solid-alpha'), ']'),
      joinClass('hover:bg-[color-mix(in_srgb,', colorVar(color, 'solid'), '_22%,transparent)]'),
      joinClass('focus-within:bg-[color-mix(in_srgb,', colorVar(color, 'solid'), '_28%,transparent)]'),
      joinClass('focus-within:[box-shadow:0_0_0_2px_', colorVar(color, 'solid-alpha'), ']'),
    ].join(' '),
  ]),
) as Record<Color, string>

export const datePickerTriggerGroupSoftColorStyles: Record<Color, string> = Object.fromEntries(
  semanticColorKeys.map(color => [
    color,
    [
      joinClass('bg-', color, '-soft'),
      joinClass('hover:bg-[', colorVar(color, 'soft-hover'), ']'),
      joinClass('focus-within:bg-[', colorVar(color, 'soft-hover'), ']'),
      joinClass('focus-within:[box-shadow:0_0_0_2px_', colorVar(color, 'solid-alpha'), ']'),
    ].join(' '),
  ]),
) as Record<Color, string>

export const datePickerCalendarSelectedColorStyles: Record<Color, string> = Object.fromEntries(
  semanticColorKeys.map(color => [
    color,
    [
      joinClass(
        '[&:hover:not([data-selected]):not([data-unavailable]):not(:disabled)]:bg-[',
        colorVar(color, 'solid-alpha'),
        ']',
      ),
      joinClass('[&[data-today]:not([data-selected])]:bg-[', colorVar(color, 'solid-alpha'), ']'),
      joinClass('data-[selected]:bg-', color, '-solid'),
      joinClass('data-[selected]:text-', color, '-contrast'),
    ].join(' '),
  ]),
) as Record<Color, string>

export const datePickerCalendarTypography = ''

export const datePickerCalendarHeadingSizeStyles = {
  xs: 'text-sm leading-5',
  sm: 'text-base leading-6',
  md: 'text-lg leading-[1.625rem]',
  lg: 'text-xl leading-7',
  xl: 'text-2xl leading-[1.875rem]',
  '2x': 'text-3xl leading-9',
} as const satisfies Record<DateSize, string>

export const datePickerCalendarHeading = datePickerCalendarTypography

export const datePickerCalendarPopover = 'rounded-[var(--element-border-radius,var(--radius-md))]'

export const datePickerCalendarPopoverSizeStyles = {
  xs: 'p-1',
  sm: 'p-1',
  md: 'p-1',
  lg: 'p-[0.4375rem]',
  xl: 'p-2',
  '2x': 'p-[1.5625rem]',
} as const satisfies Record<DateSize, string>

export const datePickerCalendarHeadingButton = 'gap-1'

export const datePickerCalendarWeekdayGrid = 'grid place-items-center'

export const datePickerCalendarDayGrid = 'grid place-items-center'

export const datePickerCalendarGridSizeStyles = {
  xs: 'grid-cols-[repeat(7,1.75rem)] gap-1',
  sm: 'grid-cols-[repeat(7,2rem)] gap-1.5',
  md: 'grid-cols-[repeat(7,2.25rem)] gap-2',
  lg: 'grid-cols-[repeat(7,2.5rem)] gap-2.5',
  xl: 'grid-cols-[repeat(7,3rem)] gap-[0.6875rem]',
  '2x': 'grid-cols-[repeat(7,3.5rem)] gap-3.5',
} as const satisfies Record<DateSize, string>

export const datePickerClassNames = [
  datePickerTriggerGroupBase,
  ...Object.values(datePickerTriggerGroupSizeStyles),
  ...Object.values(datePickerControlSizeStyles),
  datePickerInput,
  ...Object.values(datePickerInputSizeStyles),
  datePickerCalendarButton,
  ...Object.values(datePickerCalendarButtonSizeStyles),
  datePickerCalendarIcon,
  ...Object.values(datePickerCalendarIconControlSizeStyles),
  datePickerNavButton,
  ...Object.values(datePickerNavButtonSizeStyles),
  ...Object.values(datePickerCalendarIconSizeStyles),
  datePickerCalendarCell,
  ...Object.values(datePickerCalendarCellSizeStyles),
  ...Object.values(datePickerCalendarCellRadiusStyles),
  datePickerCalendarDayInteractive,
  ...Object.values(datePickerTriggerGroupRadiusStyles),
  ...Object.values(datePickerTriggerGroupVariantStyles),
  ...Object.values(datePickerTriggerGroupBorderColorStyles),
  ...Object.values(datePickerTriggerGroupSolidColorStyles),
  ...Object.values(datePickerTriggerGroupSoftColorStyles),
  ...Object.values(datePickerCalendarSelectedColorStyles),
  ...Object.values(datePickerCalendarHeadingSizeStyles),
  datePickerCalendarPopover,
  ...Object.values(datePickerCalendarPopoverSizeStyles),
  datePickerCalendarHeadingButton,
  datePickerCalendarWeekdayGrid,
  datePickerCalendarDayGrid,
  ...Object.values(datePickerCalendarGridSizeStyles),
]
