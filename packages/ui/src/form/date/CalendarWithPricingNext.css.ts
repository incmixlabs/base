import { createVar, style, styleVariants } from '@vanilla-extract/css'
import { semanticColorKeys, semanticColorVar } from '@/theme/props/color.prop'
import { radiusStyleVariants } from '@/theme/radius.css'
import type { Color } from '@/theme/tokens'
import {
  type DateNextSize,
  dateNextCalendarDaySizeBySize,
  dateNextCalendarFontSizeBySize,
  dateNextCalendarLineHeightBySize,
  dateNextCalendarNavIconSizeBySize,
  dateNextCalendarNavSizeBySize,
  dateNextControlGapBySize,
  dateNextSizeValues,
} from './date-next.props'
import {
  getDateNextCalendarTypography,
  getDateNextDayGridStyle,
  getDateNextDayInteractiveStyle,
  getDateNextNavButtonSurface,
  getDateNextWeekdayRowStyle,
} from './date-next-surface.shared'
import { dateNextElementRadiusStyles } from './date-next-surface.shared.css'

const sizeValues = dateNextSizeValues as readonly DateNextSize[]
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
        width: dateNextCalendarDaySizeBySize[size],
        /* ~1.6× standard height to fit price row */
        height: `calc(${dateNextCalendarDaySizeBySize[size]} * 1.6)`,
        fontSize: dateNextCalendarFontSizeBySize[size],
        lineHeight: dateNextCalendarLineHeightBySize[size],
      },
    ]),
  ),
)

export const pricingDayCellRadiusStyles = radiusStyleVariants

export const pricingDayInteractive = style(getDateNextDayInteractiveStyle())

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

export const pricingCalendarTypography = style(
  getDateNextCalendarTypography(calendarFontSizeVar, calendarLineHeightVar),
)

export const pricingWeekdayGrid = style(getDateNextWeekdayRowStyle())

export const pricingDayGrid = style(getDateNextDayGridStyle())

export const pricingNavButton = style(getDateNextNavButtonSurface(calendarNavSizeVar))

export const pricingGridSizeStyles = styleVariants(
  Object.fromEntries(
    sizeValues.map(size => [
      size,
      {
        gridTemplateColumns: `repeat(7, ${dateNextCalendarDaySizeBySize[size]})`,
        gap: dateNextControlGapBySize[size],
      },
    ]),
  ),
)

export const pricingNavButtonSizeStyles = styleVariants(
  Object.fromEntries(
    sizeValues.map(size => [
      size,
      {
        width: dateNextCalendarNavSizeBySize[size],
        height: dateNextCalendarNavSizeBySize[size],
      },
    ]),
  ),
)

export const pricingCalendarIconSizeStyles = styleVariants(
  Object.fromEntries(
    sizeValues.map(size => [
      size,
      {
        width: dateNextCalendarNavIconSizeBySize[size],
        height: dateNextCalendarNavIconSizeBySize[size],
      },
    ]),
  ),
)

export const pricingHeadingSizeStyles = styleVariants(
  Object.fromEntries(
    sizeValues.map(size => [
      size,
      {
        fontSize: dateNextCalendarFontSizeBySize[size],
        lineHeight: dateNextCalendarLineHeightBySize[size],
      },
    ]),
  ),
)

export const pricingCalendarRadiusStyles = dateNextElementRadiusStyles
