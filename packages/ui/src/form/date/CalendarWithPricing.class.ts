import { semanticColorKeys, semanticColorVar } from '../../theme/props/color.prop'
import type { Color } from '../../theme/tokens'
import {
  datePickerCalendarDayGrid,
  datePickerCalendarDayInteractive,
  datePickerCalendarHeadingSizeStyles,
  datePickerCalendarIconSizeStyles,
  datePickerCalendarWeekdayGrid,
  datePickerNavButton,
  datePickerNavButtonSizeStyles,
} from './DatePicker.class'
import type { DateSize } from './date.props'
import { dateElementRadiusStyles, dateRadiusClassStyles } from './date-surface.shared.class'

const joinClass = (...parts: string[]) => parts.join('')
const colorVar = (color: Color, token: Parameters<typeof semanticColorVar>[1]) => semanticColorVar(color, token)

export const pricingDayCell = 'flex flex-col items-center justify-center gap-[0.0625rem]'

export const pricingDayCellSizeStyles = {
  xs: 'h-[2.8rem] w-7 text-sm leading-5',
  sm: 'h-[3.2rem] w-8 text-base leading-6',
  md: 'h-[3.6rem] w-[2.25rem] text-lg leading-[1.625rem]',
  lg: 'h-16 w-10 text-xl leading-7',
  xl: 'h-[4.8rem] w-12 text-2xl leading-[1.875rem]',
  '2x': 'h-[5.6rem] w-14 text-3xl leading-9',
} as const satisfies Record<DateSize, string>

export const pricingDayCellRadiusStyles = dateRadiusClassStyles

export const pricingDayInteractive = datePickerCalendarDayInteractive

export const pricingPriceLabel = 'text-[0.625em] leading-none opacity-85 whitespace-nowrap'

export const pricingSelectedColorStyles: Record<Color, string> = Object.fromEntries(
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

export const pricingCalendarTypography = ''
export const pricingWeekdayGrid = datePickerCalendarWeekdayGrid
export const pricingDayGrid = datePickerCalendarDayGrid
export const pricingNavButton = datePickerNavButton

export const pricingGridSizeStyles = {
  xs: 'grid-cols-[repeat(7,1.75rem)] gap-1',
  sm: 'grid-cols-[repeat(7,2rem)] gap-1.5',
  md: 'grid-cols-[repeat(7,2.25rem)] gap-2',
  lg: 'grid-cols-[repeat(7,2.5rem)] gap-2.5',
  xl: 'grid-cols-[repeat(7,3rem)] gap-[0.6875rem]',
  '2x': 'grid-cols-[repeat(7,3.5rem)] gap-3.5',
} as const satisfies Record<DateSize, string>

export const pricingNavButtonSizeStyles = datePickerNavButtonSizeStyles
export const pricingCalendarIconSizeStyles = datePickerCalendarIconSizeStyles
export const pricingHeadingSizeStyles = datePickerCalendarHeadingSizeStyles
export const pricingCalendarRadiusStyles = dateElementRadiusStyles

export const calendarWithPricingClassNames = [
  pricingDayCell,
  ...Object.values(pricingDayCellSizeStyles),
  ...Object.values(pricingDayCellRadiusStyles),
  pricingDayInteractive,
  pricingPriceLabel,
  ...Object.values(pricingSelectedColorStyles),
  pricingWeekdayGrid,
  pricingDayGrid,
  pricingNavButton,
  ...Object.values(pricingGridSizeStyles),
  ...Object.values(pricingNavButtonSizeStyles),
  ...Object.values(pricingCalendarIconSizeStyles),
  ...Object.values(pricingHeadingSizeStyles),
  ...Object.values(pricingCalendarRadiusStyles),
]
