import { createVar, style, styleVariants } from '@vanilla-extract/css'
import { semanticColorKeys, semanticColorVar } from '@/theme/props/color.prop'
import { radiusStyleVariants } from '@/theme/radius.css'
import type { Color } from '@/theme/tokens'
import {
  type DateSize,
  dateCalendarDaySizeBySize,
  dateCalendarFontSizeBySize,
  dateCalendarLineHeightBySize,
  dateCalendarNavIconSizeBySize,
  dateCalendarNavSizeBySize,
  dateControlGapBySize,
  dateSizeValues,
} from './date.props'
import {
  getDateCalendarTypography,
  getDateDayGridStyle,
  getDateDayInteractiveStyle,
  getDateNavButtonSurface,
  getDateWeekdayRowStyle,
} from './date-surface.shared'
import { dateElementRadiusStyles } from './date-surface.shared.css'

const sizeValues = dateSizeValues as readonly DateSize[]
const calendarNavSizeVar = createVar()
const calendarFontSizeVar = createVar()
const calendarLineHeightVar = createVar()

/** Day cell: two-line layout (day number + price). Taller than standard single-line cells. */
export const pricingDayCell = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.0625rem',
})

export const pricingDayCellSizeStyles = styleVariants(
  Object.fromEntries(
    sizeValues.map(size => [
      size,
      {
        width: dateCalendarDaySizeBySize[size],
        /* ~1.6× standard height to fit price row */
        height: `calc(${dateCalendarDaySizeBySize[size]} * 1.6)`,
        fontSize: dateCalendarFontSizeBySize[size],
        lineHeight: dateCalendarLineHeightBySize[size],
      },
    ]),
  ),
)

export const pricingDayCellRadiusStyles = radiusStyleVariants

export const pricingDayInteractive = style(getDateDayInteractiveStyle())

/** Price label below day number. */
export const pricingPriceLabel = style({
  fontSize: '0.625em',
  lineHeight: 1,
  opacity: 0.85,
  whiteSpace: 'nowrap',
  selectors: {
    '[data-highlighted] > &': {
      color: 'var(--color-success-text)',
      fontWeight: 600,
      opacity: 1,
    },
    '[data-selected] > &': {
      opacity: 0.9,
    },
  },
})

export const pricingSelectedColorStyles: Record<Color, string> = Object.fromEntries(
  semanticColorKeys.map(color => [
    color,
    style({
      selectors: {
        '&:hover:not([data-selected]):not([data-unavailable]):not(:disabled)': {
          backgroundColor: semanticColorVar(color, 'primary-alpha'),
        },
        '&[data-today]:not([data-selected])': {
          backgroundColor: semanticColorVar(color, 'primary-alpha'),
        },
        '&[data-selected]': {
          backgroundColor: semanticColorVar(color, 'primary'),
          color: semanticColorVar(color, 'contrast'),
        },
      },
    }),
  ]),
) as Record<Color, string>

export const pricingCalendarTypography = style(getDateCalendarTypography(calendarFontSizeVar, calendarLineHeightVar))

export const pricingWeekdayGrid = style(getDateWeekdayRowStyle())

export const pricingDayGrid = style(getDateDayGridStyle())

export const pricingNavButton = style(getDateNavButtonSurface(calendarNavSizeVar))

export const pricingGridSizeStyles = styleVariants(
  Object.fromEntries(
    sizeValues.map(size => [
      size,
      {
        gridTemplateColumns: `repeat(7, ${dateCalendarDaySizeBySize[size]})`,
        gap: dateControlGapBySize[size],
      },
    ]),
  ),
)

export const pricingNavButtonSizeStyles = styleVariants(
  Object.fromEntries(
    sizeValues.map(size => [
      size,
      {
        width: dateCalendarNavSizeBySize[size],
        height: dateCalendarNavSizeBySize[size],
      },
    ]),
  ),
)

export const pricingCalendarIconSizeStyles = styleVariants(
  Object.fromEntries(
    sizeValues.map(size => [
      size,
      {
        width: dateCalendarNavIconSizeBySize[size],
        height: dateCalendarNavIconSizeBySize[size],
      },
    ]),
  ),
)

export const pricingHeadingSizeStyles = styleVariants(
  Object.fromEntries(
    sizeValues.map(size => [
      size,
      {
        fontSize: dateCalendarFontSizeBySize[size],
        lineHeight: dateCalendarLineHeightBySize[size],
      },
    ]),
  ),
)

export const pricingCalendarRadiusStyles = dateElementRadiusStyles
