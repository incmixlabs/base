import { semanticColorKeys } from '@/theme/props/color.prop'
import { radii } from '@/theme/props/radius.prop'
import { dateNextSizeVar } from '@/theme/runtime/component-vars'
import { controlSizeTokens, fontSizeRem, fontSizes, lineHeightRem, lineHeights } from '@/theme/token-maps'
import type { Size, TextFieldVariant } from '@/theme/tokens'

export const dateNextSizeValues = ['xs', 'sm', 'md', 'lg', 'xl', '2x'] as const satisfies readonly Size[]
export const dateNextVariantValues = [
  'classic',
  'solid',
  'soft',
  'surface',
  'outline',
  'ghost',
  'floating-filled',
  'floating-standard',
  'floating-outlined',
] as const satisfies readonly TextFieldVariant[]
export const dateNextColorValues = semanticColorKeys
export const dateNextRadiusValues = radii
export const dateNextVisibleMonthControlOptions = ['1', '2'] as const
export const dateNextVisibleMonthControlMapping = { '1': 1, '2': 2 } as const
export const dateNextVisibleMonthControlLabels = { '1': '1', '2': '2' } as const
export const dateNextNavButtonVariantValues = ['soft', 'outline', 'ghost'] as const
export const dateNextMiniCalendarSizeValues = dateNextSizeValues

export type DateNextSize = (typeof dateNextSizeValues)[number]
export type DateNextVariant = (typeof dateNextVariantValues)[number]
export type DateNextColor = (typeof dateNextColorValues)[number]
export type DateNextRadius = (typeof dateNextRadiusValues)[number]
export type DateNextNavButtonVariant = (typeof dateNextNavButtonVariantValues)[number]
export type DateNextMiniCalendarSize = DateNextSize
export type WeekStartsOn = 0 | 1 | 2 | 3 | 4 | 5 | 6
export type DateNextVariantColorMode = 'solid' | 'soft' | 'border'

export const dateNextIconSourceSizeBySize: Record<DateNextSize, DateNextSize> = {
  xs: 'xs',
  sm: 'xs',
  md: 'sm',
  lg: 'md',
  xl: 'lg',
  '2x': 'xl',
}

export const mapDateNextSizes = <T>(mapper: (size: DateNextSize) => T): Record<DateNextSize, T> =>
  Object.fromEntries(dateNextSizeValues.map(size => [size, mapper(size)])) as Record<DateNextSize, T>

/** Calendar cells use one tier up for font/lineHeight readability. */
export const dateNextCalendarFontSourceSizeBySize: Record<DateNextSize, Size> = {
  xs: 'sm',
  sm: 'md',
  md: 'lg',
  lg: 'xl',
  xl: '2x',
  '2x': '3x',
}
/** Cell size = 2× font size from the +1 source tier — keeps a consistent 50% font/cell ratio. */
const dateNextCalendarDayFallbackBySize = mapDateNextSizes(
  size => `calc(${fontSizeRem[dateNextCalendarFontSourceSizeBySize[size]]} * 2)`,
)
export const dateNextCalendarDaySizeBySize = mapDateNextSizes(size =>
  dateNextSizeVar(size, 'calendarDaySize', dateNextCalendarDayFallbackBySize[size]),
)
export const dateNextCalendarNavSizeBySize = mapDateNextSizes(size =>
  dateNextSizeVar(size, 'calendarNavSize', dateNextCalendarDayFallbackBySize[size]),
)
export const dateNextCalendarNavIconSizeBySize = mapDateNextSizes(size =>
  dateNextSizeVar(size, 'calendarNavIconSize', fontSizes[size]),
)
export const dateNextCalendarFontSizeBySize = mapDateNextSizes(size =>
  dateNextSizeVar(size, 'calendarFontSize', fontSizeRem[dateNextCalendarFontSourceSizeBySize[size]]),
)
export const dateNextCalendarLineHeightBySize = mapDateNextSizes(size =>
  dateNextSizeVar(size, 'calendarLineHeight', lineHeightRem[dateNextCalendarFontSourceSizeBySize[size]]),
)

export const dateNextControlHeightBySize = mapDateNextSizes(size =>
  dateNextSizeVar(size, 'controlHeight', controlSizeTokens[size].height),
)
export const dateNextControlFontSizeBySize = mapDateNextSizes(size =>
  dateNextSizeVar(size, 'controlFontSize', controlSizeTokens[size].fontSize),
)
export const dateNextControlLineHeightBySize = mapDateNextSizes(size =>
  dateNextSizeVar(size, 'controlLineHeight', controlSizeTokens[size].lineHeight),
)
export const dateNextControlPaddingXBySize = mapDateNextSizes(size =>
  dateNextSizeVar(size, 'controlPaddingInline', controlSizeTokens[size].paddingX),
)
export const dateNextControlPaddingYBySize = mapDateNextSizes(size =>
  dateNextSizeVar(size, 'controlPaddingBlock', controlSizeTokens[size].paddingY),
)
export const dateNextControlGapBySize = mapDateNextSizes(size =>
  dateNextSizeVar(size, 'controlGap', controlSizeTokens[size].gap),
)
export const dateNextControlIconSizeBySize = mapDateNextSizes(size =>
  dateNextSizeVar(size, 'controlIconSize', controlSizeTokens[dateNextIconSourceSizeBySize[size]].iconSize),
)

export const dateNextCellSizeBySize = dateNextCalendarDaySizeBySize
export const dateNextTitleFontSizeBySize = mapDateNextSizes(size =>
  dateNextSizeVar(size, 'miniCalendarTitleFontSize', fontSizes[size]),
)
export const dateNextTitleLineHeightBySize = mapDateNextSizes(size => lineHeights[size])
export const dateNextSecondaryFontSizeBySize = mapDateNextSizes(size => fontSizes[dateNextIconSourceSizeBySize[size]])
export const dateNextSecondaryLineHeightBySize = mapDateNextSizes(
  size => lineHeights[dateNextIconSourceSizeBySize[size]],
)
export const dateNextHeaderGapBySize = mapDateNextSizes(size =>
  dateNextSizeVar(size, 'miniCalendarHeaderGap', controlSizeTokens[size].gap),
)
export const dateNextContainerPaddingBySize = mapDateNextSizes(size =>
  dateNextSizeVar(size, 'miniCalendarPadding', controlSizeTokens[size].paddingY),
)
export const dateNextCalendarGridGapBySize = mapDateNextSizes(size =>
  dateNextSizeVar(size, 'calendarGridGap', controlSizeTokens[size].gap),
)
export const dateNextCalendarPopoverPaddingBySize = mapDateNextSizes(size =>
  dateNextSizeVar(size, 'calendarPopoverPadding', controlSizeTokens[size].paddingY),
)
export const dateNextCalendarHeadingGapBySize = mapDateNextSizes(size =>
  dateNextSizeVar(size, 'calendarHeadingGap', controlSizeTokens[size].gap),
)
const dateNextRangeFieldMinWidthFallbackBySize = {
  xs: '7rem',
  sm: '8rem',
  md: '10rem',
  lg: '11rem',
  xl: '12rem',
  '2x': '13rem',
} as const satisfies Record<DateNextSize, string>
export const dateNextRangeFieldMinWidthBySize = mapDateNextSizes(size =>
  dateNextSizeVar(size, 'rangeFieldMinWidth', dateNextRangeFieldMinWidthFallbackBySize[size]),
)
export const dateNextMiniCalendarBodyGapBySize = mapDateNextSizes(size =>
  dateNextSizeVar(size, 'miniCalendarBodyGap', controlSizeTokens[size].gap),
)

export const isDateNextSize = (value: unknown): value is DateNextSize =>
  typeof value === 'string' && (dateNextSizeValues as readonly string[]).includes(value)

export const isDateNextVariant = (value: unknown): value is DateNextVariant =>
  typeof value === 'string' && (dateNextVariantValues as readonly string[]).includes(value)

export const normalizeDateNextVariant = (variant: TextFieldVariant | undefined): DateNextVariant => {
  if (variant?.startsWith('floating-')) {
    return 'outline'
  }
  if (isDateNextVariant(variant)) {
    return variant
  }
  return 'outline'
}

const variantColorModeByVariant: Record<DateNextVariant, DateNextVariantColorMode> = {
  classic: 'border',
  solid: 'solid',
  soft: 'soft',
  surface: 'border',
  outline: 'border',
  ghost: 'border',
  'floating-filled': 'border',
  'floating-standard': 'border',
  'floating-outlined': 'border',
}

export const getDateNextVariantColorMode = (variant: DateNextVariant): DateNextVariantColorMode =>
  variantColorModeByVariant[variant]
