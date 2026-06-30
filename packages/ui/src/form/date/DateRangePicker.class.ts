import { semanticColorKeys } from '../../theme/props/color.prop'
import type { Color } from '../../theme/tokens'
import type { DateSize } from './date.props'
import { dateElementRadiusStyles } from './date-surface.shared.class'

const joinClass = (...parts: string[]) => parts.join('')

export const rangeTriggerGroupBase = 'flex items-center'

export const rangeTriggerGroupSizeStyles = {
  xs: 'gap-1',
  sm: 'gap-1.5',
  md: 'gap-2',
  lg: 'gap-2.5',
  xl: 'gap-[0.6875rem]',
  '2x': 'gap-3.5',
} as const satisfies Record<DateSize, string>

export const rangeInputSurface =
  'flex items-center rounded-[var(--element-border-radius,var(--radius-md))] border border-solid border-border bg-background transition-[background-color,border-color,box-shadow] duration-150 ease-in-out focus-within:border-ring focus-within:[box-shadow:0_0_0_2px_color-mix(in_srgb,var(--ring)_24%,transparent)]'

export const rangeInputSurfaceSizeStyles = {
  xs: 'h-6 min-w-[calc(7rem*2+0.25rem)] gap-1 px-2 py-1',
  sm: 'h-7 min-w-[calc(8rem*2+0.375rem)] gap-1.5 px-2.5 py-1',
  md: 'h-8 min-w-[calc(10rem*2+0.5rem)] gap-2 px-3 py-1',
  lg: 'h-10 min-w-[calc(11rem*2+0.625rem)] gap-2.5 px-3.5 py-[0.4375rem]',
  xl: 'h-11 min-w-[calc(12rem*2+0.6875rem)] gap-[0.6875rem] px-3.5 py-2',
  '2x': 'h-[5rem] min-w-[calc(13rem*2+0.875rem)] gap-3.5 px-5 py-[1.5625rem]',
} as const satisfies Record<DateSize, string>

export const rangeDateInput = 'flex items-center gap-1'

export const rangeDateInputSizeStyles = {
  xs: 'min-w-[7rem] text-xs leading-4',
  sm: 'min-w-[8rem] text-sm leading-5',
  md: 'min-w-[10rem] text-base leading-6',
  lg: 'min-w-[11rem] text-lg leading-[1.625rem]',
  xl: 'min-w-[12rem] text-xl leading-7',
  '2x': 'min-w-[13rem] text-2xl leading-[1.875rem]',
} as const satisfies Record<DateSize, string>

export const rangeCalendarButton =
  'inline-flex items-center justify-center rounded-[var(--element-border-radius,var(--radius-md))] border border-solid border-border bg-background transition-[background-color,border-color,box-shadow] duration-150 ease-in-out focus-visible:border-ring focus-visible:[box-shadow:0_0_0_2px_color-mix(in_srgb,var(--ring)_24%,transparent)]'

export const rangeCalendarButtonSizeStyles = {
  xs: 'h-6 w-6',
  sm: 'h-7 w-7',
  md: 'h-8 w-8',
  lg: 'h-10 w-10',
  xl: 'h-11 w-11',
  '2x': 'h-[5rem] w-[5rem]',
} as const satisfies Record<DateSize, string>

export const rangeCalendarIcon = 'shrink-0'

export const rangeCalendarIconSizeStyles = {
  xs: 'h-3 w-3',
  sm: 'h-3 w-3',
  md: 'h-3.5 w-3.5',
  lg: 'h-4 w-4',
  xl: 'h-5 w-5',
  '2x': 'h-6 w-6',
} as const satisfies Record<DateSize, string>

export const rangeCalendarCell =
  'grid place-items-center rounded-none [&[data-selection-start]]:rounded-l-md [&[data-selection-end]]:rounded-r-md [&[data-selection-start][data-selection-end]]:rounded-md'

export const rangeCalendarCellSizeStyles = {
  xs: 'h-7 w-7 text-sm leading-5',
  sm: 'h-8 w-8 text-base leading-6',
  md: 'h-[2.25rem] w-[2.25rem] text-lg leading-[1.625rem]',
  lg: 'h-10 w-10 text-xl leading-7',
  xl: 'h-12 w-12 text-2xl leading-[1.875rem]',
  '2x': 'h-14 w-14 text-3xl leading-9',
} as const satisfies Record<DateSize, string>

export const rangeCalendarTypography = ''

export const rangeCalendarTypographySizeStyles = {
  xs: 'text-sm leading-5',
  sm: 'text-base leading-6',
  md: 'text-lg leading-[1.625rem]',
  lg: 'text-xl leading-7',
  xl: 'text-2xl leading-[1.875rem]',
  '2x': 'text-3xl leading-9',
} as const satisfies Record<DateSize, string>

export const rangeCalendarDualHeader = 'grid grid-cols-[auto_1fr_1fr_auto] items-center'

export const rangeCalendarDualHeaderSizeStyles = rangeTriggerGroupSizeStyles

export const rangeCalendarMonthColumns = 'grid grid-cols-2'

export const rangeCalendarMonthColumnsSizeStyles = {
  xs: 'gap-1',
  sm: 'gap-1.5',
  md: 'gap-2',
  lg: 'gap-2.5',
  xl: 'gap-[0.6875rem]',
  '2x': 'gap-3.5',
} as const satisfies Record<DateSize, string>

export const rangeCalendarPopover = ''

export const rangeCalendarPopoverSizeStyles = {
  xs: 'p-1',
  sm: 'p-1',
  md: 'p-1',
  lg: 'p-[0.4375rem]',
  xl: 'p-2',
  '2x': 'p-[1.5625rem]',
} as const satisfies Record<DateSize, string>

export const rangeCalendarMonthHeadingButton = ''

export const rangeCalendarMonthHeadingButtonSizeStyles = {
  xs: 'gap-1 text-sm leading-5',
  sm: 'gap-1.5 text-base leading-6',
  md: 'gap-2 text-lg leading-[1.625rem]',
  lg: 'gap-2.5 text-xl leading-7',
  xl: 'gap-[0.6875rem] text-2xl leading-[1.875rem]',
  '2x': 'gap-3.5 text-3xl leading-9',
} as const satisfies Record<DateSize, string>

export const rangeCalendarDayInteractive =
  'appearance-none border-0 bg-transparent p-0 m-0 font-[inherit] text-inherit cursor-pointer text-center outline-none data-[outside-month]:text-muted-foreground/60 data-[unavailable]:text-muted-foreground/60 data-[unavailable]:line-through [&:hover:not([data-unavailable]):not([data-selected])]:bg-accent data-[unavailable]:hover:bg-transparent focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-default disabled:opacity-100'

export const rangeTriggerGroupRadiusStyles = dateElementRadiusStyles

export const rangeCalendarSelectedColorStyles: Record<Color, string> = Object.fromEntries(
  semanticColorKeys.map(color => [
    color,
    [
      joinClass('[&[data-selected]:not([data-selection-start]):not([data-selection-end])]:bg-', color, '-soft'),
      joinClass('[&[data-selected]:not([data-selection-start]):not([data-selection-end])]:text-', color),
      joinClass('[&[data-selection-start]]:bg-', color, '-solid'),
      joinClass('[&[data-selection-start]]:text-', color, '-contrast'),
      joinClass('[&[data-selection-end]]:bg-', color, '-solid'),
      joinClass('[&[data-selection-end]]:text-', color, '-contrast'),
    ].join(' '),
  ]),
) as Record<Color, string>

export const dateRangePickerClassNames = [
  rangeTriggerGroupBase,
  ...Object.values(rangeTriggerGroupSizeStyles),
  rangeInputSurface,
  ...Object.values(rangeInputSurfaceSizeStyles),
  rangeDateInput,
  ...Object.values(rangeDateInputSizeStyles),
  rangeCalendarButton,
  ...Object.values(rangeCalendarButtonSizeStyles),
  rangeCalendarIcon,
  ...Object.values(rangeCalendarIconSizeStyles),
  rangeCalendarCell,
  ...Object.values(rangeCalendarCellSizeStyles),
  ...Object.values(rangeCalendarTypographySizeStyles),
  rangeCalendarDualHeader,
  ...Object.values(rangeCalendarDualHeaderSizeStyles),
  rangeCalendarMonthColumns,
  ...Object.values(rangeCalendarMonthColumnsSizeStyles),
  ...Object.values(rangeCalendarPopoverSizeStyles),
  ...Object.values(rangeCalendarMonthHeadingButtonSizeStyles),
  rangeCalendarDayInteractive,
  ...Object.values(rangeTriggerGroupRadiusStyles),
  ...Object.values(rangeCalendarSelectedColorStyles),
]
