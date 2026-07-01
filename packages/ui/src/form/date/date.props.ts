import { semanticColorKeys } from '@/theme/props/color.prop'
import { radii } from '@/theme/props/radius.prop'
import { controlSizeTokens, fontSizeRem, lineHeightRem } from '@/theme/token-maps'
import type { Size, TextFieldVariant } from '@/theme/tokens'

export const dateSizeValues = ['xs', 'sm', 'md', 'lg', 'xl', '2x'] as const satisfies readonly Size[]
export const dateVariantValues = [
  'soft',
  'surface',
  'outline',
  'ghost',
  'floating-filled',
  'floating-standard',
  'floating-outlined',
] as const satisfies readonly TextFieldVariant[]
export const dateColorValues = semanticColorKeys
export const dateRadiusValues = radii
export const dateVisibleMonthControlOptions = ['1', '2'] as const
export const dateVisibleMonthControlMapping = { '1': 1, '2': 2 } as const
export const dateVisibleMonthControlLabels = { '1': '1', '2': '2' } as const
export const dateNavButtonVariantValues = ['soft', 'outline', 'ghost'] as const
export const dateMiniCalendarSizeValues = dateSizeValues

export type DateSize = (typeof dateSizeValues)[number]
/** @deprecated Use DateSize. */
export type DateNextSize = DateSize
export type DateVariant = (typeof dateVariantValues)[number]
export type DateColor = (typeof dateColorValues)[number]
export type DateRadius = (typeof dateRadiusValues)[number]
export type DateNavButtonVariant = (typeof dateNavButtonVariantValues)[number]
export type DateMiniCalendarSize = DateSize
export type WeekStartsOn = 0 | 1 | 2 | 3 | 4 | 5 | 6
export type DateVariantColorMode = 'solid' | 'soft' | 'border'

export const dateIconSourceSizeBySize: Record<DateSize, DateSize> = {
  xs: 'xs',
  sm: 'xs',
  md: 'sm',
  lg: 'md',
  xl: 'lg',
  '2x': 'xl',
}

export const mapDateSizes = <T>(mapper: (size: DateSize) => T): Record<DateSize, T> =>
  Object.fromEntries(dateSizeValues.map(size => [size, mapper(size)])) as Record<DateSize, T>

/** Calendar cells use one tier up for font/lineHeight readability. */
export const dateCalendarFontSourceSizeBySize: Record<DateSize, Size> = {
  xs: 'sm',
  sm: 'md',
  md: 'lg',
  lg: 'xl',
  xl: '2x',
  '2x': '3x',
}
/** Cell size = 2× font size from the +1 source tier — keeps a consistent 50% font/cell ratio. */
const dateCalendarDayFallbackBySize = mapDateSizes(
  size => `calc(${fontSizeRem[dateCalendarFontSourceSizeBySize[size]]} * 2)`,
)
export const dateCalendarDaySizeBySize = mapDateSizes(size => dateCalendarDayFallbackBySize[size])
export const dateCalendarNavSizeBySize = dateCalendarDaySizeBySize
export const dateCalendarNavIconSizeBySize = mapDateSizes(size => fontSizeRem[size])
export const dateCalendarFontSizeBySize = mapDateSizes(size => fontSizeRem[dateCalendarFontSourceSizeBySize[size]])
export const dateCalendarLineHeightBySize = mapDateSizes(size => lineHeightRem[dateCalendarFontSourceSizeBySize[size]])

export const dateControlHeightBySize = mapDateSizes(size => controlSizeTokens[size].height)
export const dateControlFontSizeBySize = mapDateSizes(size => controlSizeTokens[size].fontSize)
export const dateControlLineHeightBySize = mapDateSizes(size => controlSizeTokens[size].lineHeight)
export const dateControlPaddingXBySize = mapDateSizes(size => controlSizeTokens[size].paddingX)
export const dateControlPaddingYBySize = mapDateSizes(size => controlSizeTokens[size].paddingY)
export const dateControlGapBySize = mapDateSizes(size => controlSizeTokens[size].gap)
export const dateControlIconSizeBySize = mapDateSizes(
  size => controlSizeTokens[dateIconSourceSizeBySize[size]].iconSize,
)

export const dateCellSizeBySize = dateCalendarDaySizeBySize
export const dateTitleFontSizeBySize = mapDateSizes(size => fontSizeRem[size])
export const dateTitleLineHeightBySize = mapDateSizes(size => lineHeightRem[size])
export const dateSecondaryFontSizeBySize = mapDateSizes(size => fontSizeRem[dateIconSourceSizeBySize[size]])
export const dateSecondaryLineHeightBySize = mapDateSizes(size => lineHeightRem[dateIconSourceSizeBySize[size]])
export const dateHeaderGapBySize = mapDateSizes(size => controlSizeTokens[size].gap)
export const dateContainerPaddingBySize = mapDateSizes(size => controlSizeTokens[size].paddingY)
export const dateCalendarGridGapBySize = mapDateSizes(size => controlSizeTokens[size].gap)
export const dateCalendarPopoverPaddingBySize = mapDateSizes(size => controlSizeTokens[size].paddingY)
export const dateCalendarHeadingGapBySize = mapDateSizes(size => controlSizeTokens[size].gap)
const dateRangeFieldMinWidthFallbackBySize = {
  xs: '7rem',
  sm: '8rem',
  md: '10rem',
  lg: '11rem',
  xl: '12rem',
  '2x': '13rem',
} as const satisfies Record<DateSize, string>
export const dateRangeFieldMinWidthBySize = dateRangeFieldMinWidthFallbackBySize
export const dateMiniCalendarBodyGapBySize = mapDateSizes(size => controlSizeTokens[size].gap)

export const isDateSize = (value: unknown): value is DateSize =>
  typeof value === 'string' && (dateSizeValues as readonly string[]).includes(value)

export const isDateVariant = (value: unknown): value is DateVariant =>
  typeof value === 'string' && (dateVariantValues as readonly string[]).includes(value)

export const normalizeDateVariant = (variant: TextFieldVariant | undefined): DateVariant => {
  if (variant?.startsWith('floating-')) {
    return 'outline'
  }
  if (isDateVariant(variant)) {
    return variant
  }
  return 'outline'
}

const variantColorModeByVariant: Record<DateVariant, DateVariantColorMode> = {
  soft: 'soft',
  surface: 'border',
  outline: 'border',
  ghost: 'border',
  'floating-filled': 'border',
  'floating-standard': 'border',
  'floating-outlined': 'border',
}

export const getDateVariantColorMode = (variant: DateVariant): DateVariantColorMode =>
  variantColorModeByVariant[variant]
