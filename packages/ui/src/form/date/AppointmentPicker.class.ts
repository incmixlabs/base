import { semanticColorKeys } from '../../theme/props/color.prop'
import type { Color } from '../../theme/tokens'
import type { DateSize } from './date.props'

export const appointmentPickerRoot = 'border border-solid border-border bg-background'

export const appointmentPickerRootDisabled = 'opacity-50 pointer-events-none'

export const appointmentPickerSizeStyles = {
  xs: 'text-xs leading-4',
  sm: 'text-sm leading-5',
  md: 'text-base leading-6',
  lg: 'text-lg leading-[1.625rem]',
  xl: 'text-xl leading-7',
  '2x': 'text-2xl leading-[1.875rem]',
} as const satisfies Record<DateSize, string>

export const appointmentPickerTitle = 'font-semibold'

export const appointmentPickerTitleSizeStyles = appointmentPickerSizeStyles

export const appointmentPickerSlotHoverColorStyles: Record<Color, string> = Object.fromEntries(
  semanticColorKeys.map(color => [color, `hover:!bg-${color}-soft hover:!text-foreground`]),
) as Record<Color, string>

export const appointmentPickerFooterText = ''

export const appointmentPickerFooterTextSizeStyles = {
  xs: 'text-xs leading-4',
  sm: 'text-xs leading-4',
  md: 'text-sm leading-5',
  lg: 'text-base leading-6',
  xl: 'text-lg leading-[1.625rem]',
  '2x': 'text-xl leading-7',
} as const satisfies Record<DateSize, string>

export const appointmentPickerSlotContainer = ''

export const appointmentPickerSlotContainerSizeStyles = {
  xs: 'p-1',
  sm: 'p-1',
  md: 'p-1',
  lg: 'p-[0.4375rem]',
  xl: 'p-2',
  '2x': 'p-[1.5625rem]',
} as const satisfies Record<DateSize, string>

export const appointmentPickerSlotGap = ''

export const appointmentPickerSlotGapSizeStyles = {
  xs: 'mb-1',
  sm: 'mb-1.5',
  md: 'mb-2',
  lg: 'mb-2.5',
  xl: 'mb-[0.6875rem]',
  '2x': 'mb-3.5',
} as const satisfies Record<DateSize, string>

export const appointmentPickerFooterPadding = ''

export const appointmentPickerFooterPaddingSizeStyles = {
  xs: 'px-2 py-1',
  sm: 'px-2.5 py-1',
  md: 'px-3 py-1',
  lg: 'px-3.5 py-[0.4375rem]',
  xl: 'px-3.5 py-2',
  '2x': 'px-5 py-[1.5625rem]',
} as const satisfies Record<DateSize, string>

export const appointmentPickerSlotWidth = ''

export const appointmentPickerSlotWidthSizeStyles = {
  xs: 'w-[5.5rem]',
  sm: 'w-24',
  md: 'w-28',
  lg: 'w-32',
  xl: 'w-36',
  '2x': 'w-40',
} as const satisfies Record<DateSize, string>

export const appointmentPickerSlotHeight = ''

export const appointmentPickerSlotHeightSizeStyles = {
  xs: 'h-[11.25rem]',
  sm: 'h-[12.5rem]',
  md: 'h-[13.75rem]',
  lg: 'h-[15rem]',
  xl: 'h-[16.25rem]',
  '2x': 'h-[17.5rem]',
} as const satisfies Record<DateSize, string>

export const appointmentPickerCheckIcon = 'shrink-0'

export const appointmentPickerCheckIconSizeStyles = {
  xs: 'h-3 w-3',
  sm: 'h-3 w-3',
  md: 'h-3.5 w-3.5',
  lg: 'h-4 w-4',
  xl: 'h-5 w-5',
  '2x': 'h-6 w-6',
} as const satisfies Record<DateSize, string>

export const appointmentPickerClassNames = [
  appointmentPickerRoot,
  appointmentPickerRootDisabled,
  ...Object.values(appointmentPickerSizeStyles),
  appointmentPickerTitle,
  ...Object.values(appointmentPickerTitleSizeStyles),
  ...Object.values(appointmentPickerSlotHoverColorStyles),
  ...Object.values(appointmentPickerFooterTextSizeStyles),
  ...Object.values(appointmentPickerSlotContainerSizeStyles),
  ...Object.values(appointmentPickerSlotGapSizeStyles),
  ...Object.values(appointmentPickerFooterPaddingSizeStyles),
  ...Object.values(appointmentPickerSlotWidthSizeStyles),
  ...Object.values(appointmentPickerSlotHeightSizeStyles),
  appointmentPickerCheckIcon,
  ...Object.values(appointmentPickerCheckIconSizeStyles),
]
