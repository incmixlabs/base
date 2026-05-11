import { style, styleVariants } from '@vanilla-extract/css'
import { semanticColorKeys, semanticColorVar } from '@/theme/props/color.prop'
import { type Color, designTokens } from '@/theme/tokens'
import {
  type DateSize,
  dateCalendarHeadingGapBySize,
  dateCalendarNavIconSizeBySize,
  dateCalendarNavSizeBySize,
  dateCellSizeBySize,
  dateContainerPaddingBySize,
  dateMiniCalendarBodyGapBySize,
  dateRadiusValues,
  dateSizeValues,
  dateTitleFontSizeBySize,
} from './date.props'
import { getDateCalendarSurfaceRoot, getDateDisabledState } from './date-surface.shared'

const sizeValues = dateSizeValues as readonly DateSize[]

export const miniCalendarRoot = style(getDateCalendarSurfaceRoot())

export const miniCalendarRootDisabled = style(getDateDisabledState())

export const miniCalendarSizeStyles = styleVariants(
  Object.fromEntries(
    sizeValues.map(size => [
      size,
      {
        vars: {
          '--cell-size': dateCellSizeBySize[size],
          '--mini-cal-title-font-size': dateTitleFontSizeBySize[size],
          '--mini-cal-padding': dateContainerPaddingBySize[size],
          '--mini-cal-body-gap': dateMiniCalendarBodyGapBySize[size],
          '--mini-cal-header-gap': dateCalendarHeadingGapBySize[size],
          '--mini-cal-nav-size': dateCalendarNavSizeBySize[size],
          '--mini-cal-nav-icon-size': dateCalendarNavIconSizeBySize[size],
        },
      },
    ]),
  ),
)

export const miniCalendarRadiusStyles = styleVariants(
  Object.fromEntries(
    dateRadiusValues.map(radius => [
      radius,
      {
        vars: {
          '--mini-cal-radius': designTokens.radius[radius],
        },
      },
    ]),
  ),
)

export const miniCalendarBody = style({
  padding: 'var(--mini-cal-padding)',
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--mini-cal-body-gap)',
})

export const miniCalendarHeaderTitle = style({
  fontSize: 'var(--mini-cal-title-font-size)',
  lineHeight: 1.2,
  fontWeight: 500,
  color: 'var(--foreground)',
})

export const miniCalendarHeader = style({
  gap: 'var(--mini-cal-header-gap)',
})

export const miniCalendarNavButton = style({
  width: 'var(--mini-cal-nav-size)',
  height: 'var(--mini-cal-nav-size)',
})

export const miniCalendarNavIcon = style({
  width: 'var(--mini-cal-nav-icon-size)',
  height: 'var(--mini-cal-nav-icon-size)',
})

export const miniCalendarDayColorStyles: Record<Color, string> = Object.fromEntries(
  semanticColorKeys.map(color => [
    color,
    style({
      vars: {
        '--mini-cal-accent': semanticColorVar(color, 'primary'),
        '--mini-cal-soft': semanticColorVar(color, 'primary-alpha'),
        '--mini-cal-fg': semanticColorVar(color, 'contrast'),
      },
    }),
  ]),
) as Record<Color, string>
