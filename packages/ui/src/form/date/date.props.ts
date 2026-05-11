import { semanticColorKeys } from '@/theme/props/color.prop'
import { radii } from '@/theme/props/radius.prop'
import { dateSizeVar } from '@/theme/runtime/component-vars'
import { controlSizeTokens, fontSizeRem, fontSizes, lineHeightRem, lineHeights } from '@/theme/token-maps'
import type { Size, TextFieldVariant } from '@/theme/tokens'

export const dateSizeValues = ['xs', 'sm', 'md', 'lg', 'xl', '2x'] as const satisfies readonly Size[]
export const dateVariantValues = [
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
export const dateColorValues = semanticColorKeys
export const dateRadiusValues = radii
export const dateVisibleMonthControlOptions = ['1', '2'] as const
export const dateVisibleMonthControlMapping = { '1': 1, '2': 2 } as const
export const dateVisibleMonthControlLabels = { '1': '1', '2': '2' } as const
export const dateNavButtonVariantValues = ['soft', 'outline', 'ghost'] as const
export const dateMiniCalendarSizeValues = dateSizeValues

export type DateSize = (typeof dateSizeValues)[number]
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
export const dateCalendarDaySizeBySize = mapDateSizes(size =>
  dateSizeVar(size, 'calendarDaySize', dateCalendarDayFallbackBySize[size]),
)
export const dateCalendarNavSizeBySize = mapDateSizes(size =>
  dateSizeVar(size, 'calendarNavSize', dateCalendarDayFallbackBySize[size]),
)
export const dateCalendarNavIconSizeBySize = mapDateSizes(size =>
  dateSizeVar(size, 'calendarNavIconSize', fontSizes[size]),
)
export const dateCalendarFontSizeBySize = mapDateSizes(size =>
  dateSizeVar(size, 'calendarFontSize', fontSizeRem[dateCalendarFontSourceSizeBySize[size]]),
)
export const dateCalendarLineHeightBySize = mapDateSizes(size =>
  dateSizeVar(size, 'calendarLineHeight', lineHeightRem[dateCalendarFontSourceSizeBySize[size]]),
)

export const dateControlHeightBySize = mapDateSizes(size =>
  dateSizeVar(size, 'controlHeight', controlSizeTokens[size].height),
)
export const dateControlFontSizeBySize = mapDateSizes(size =>
  dateSizeVar(size, 'controlFontSize', controlSizeTokens[size].fontSize),
)
export const dateControlLineHeightBySize = mapDateSizes(size =>
  dateSizeVar(size, 'controlLineHeight', controlSizeTokens[size].lineHeight),
)
export const dateControlPaddingXBySize = mapDateSizes(size =>
  dateSizeVar(size, 'controlPaddingInline', controlSizeTokens[size].paddingX),
)
export const dateControlPaddingYBySize = mapDateSizes(size =>
  dateSizeVar(size, 'controlPaddingBlock', controlSizeTokens[size].paddingY),
)
export const dateControlGapBySize = mapDateSizes(size => dateSizeVar(size, 'controlGap', controlSizeTokens[size].gap))
export const dateControlIconSizeBySize = mapDateSizes(size =>
  dateSizeVar(size, 'controlIconSize', controlSizeTokens[dateIconSourceSizeBySize[size]].iconSize),
)

export const dateCellSizeBySize = dateCalendarDaySizeBySize
export const dateTitleFontSizeBySize = mapDateSizes(size =>
  dateSizeVar(size, 'miniCalendarTitleFontSize', fontSizes[size]),
)
export const dateTitleLineHeightBySize = mapDateSizes(size => lineHeights[size])
export const dateSecondaryFontSizeBySize = mapDateSizes(size => fontSizes[dateIconSourceSizeBySize[size]])
export const dateSecondaryLineHeightBySize = mapDateSizes(size => lineHeights[dateIconSourceSizeBySize[size]])
export const dateHeaderGapBySize = mapDateSizes(size =>
  dateSizeVar(size, 'miniCalendarHeaderGap', controlSizeTokens[size].gap),
)
export const dateContainerPaddingBySize = mapDateSizes(size =>
  dateSizeVar(size, 'miniCalendarPadding', controlSizeTokens[size].paddingY),
)
export const dateCalendarGridGapBySize = mapDateSizes(size =>
  dateSizeVar(size, 'calendarGridGap', controlSizeTokens[size].gap),
)
export const dateCalendarPopoverPaddingBySize = mapDateSizes(size =>
  dateSizeVar(size, 'calendarPopoverPadding', controlSizeTokens[size].paddingY),
)
export const dateCalendarHeadingGapBySize = mapDateSizes(size =>
  dateSizeVar(size, 'calendarHeadingGap', controlSizeTokens[size].gap),
)
const dateRangeFieldMinWidthFallbackBySize = {
  xs: '7rem',
  sm: '8rem',
  md: '10rem',
  lg: '11rem',
  xl: '12rem',
  '2x': '13rem',
} as const satisfies Record<DateSize, string>
export const dateRangeFieldMinWidthBySize = mapDateSizes(size =>
  dateSizeVar(size, 'rangeFieldMinWidth', dateRangeFieldMinWidthFallbackBySize[size]),
)
export const dateMiniCalendarBodyGapBySize = mapDateSizes(size =>
  dateSizeVar(size, 'miniCalendarBodyGap', controlSizeTokens[size].gap),
)

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

export const getDateVariantColorMode = (variant: DateVariant): DateVariantColorMode =>
  variantColorModeByVariant[variant]
