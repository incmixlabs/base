import { style, styleVariants } from '@vanilla-extract/css'
import { semanticColorKeys, semanticColorVar } from '@/theme/props/color.prop'
import { type Color, designTokens } from '@/theme/tokens'
import {
  type DateNextSize,
  dateNextCalendarHeadingGapBySize,
  dateNextCalendarNavIconSizeBySize,
  dateNextCalendarNavSizeBySize,
  dateNextCellSizeBySize,
  dateNextContainerPaddingBySize,
  dateNextMiniCalendarBodyGapBySize,
  dateNextRadiusValues,
  dateNextSizeValues,
  dateNextTitleFontSizeBySize,
} from './date-next.props'
import { getDateNextCalendarSurfaceRoot, getDateNextDisabledState } from './date-next-surface.shared'

const sizeValues = dateNextSizeValues as readonly DateNextSize[]

export const miniCalendarRoot = style(getDateNextCalendarSurfaceRoot())

export const miniCalendarRootDisabled = style(getDateNextDisabledState())

export const miniCalendarSizeStyles = styleVariants(
  Object.fromEntries(
    sizeValues.map(size => [
      size,
      {
        vars: {
          '--cell-size': dateNextCellSizeBySize[size],
          '--mini-cal-title-font-size': dateNextTitleFontSizeBySize[size],
          '--mini-cal-padding': dateNextContainerPaddingBySize[size],
          '--mini-cal-body-gap': dateNextMiniCalendarBodyGapBySize[size],
          '--mini-cal-header-gap': dateNextCalendarHeadingGapBySize[size],
          '--mini-cal-nav-size': dateNextCalendarNavSizeBySize[size],
          '--mini-cal-nav-icon-size': dateNextCalendarNavIconSizeBySize[size],
        },
      },
    ]),
  ),
)

export const miniCalendarRadiusStyles = styleVariants(
  Object.fromEntries(
    dateNextRadiusValues.map(radius => [
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
