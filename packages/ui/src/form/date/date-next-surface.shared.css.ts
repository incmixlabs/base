import { createVar, style, styleVariants } from '@vanilla-extract/css'
import { designTokens } from '@/theme/tokens'
import { dateNextRadiusValues } from './date-next.props'
import {
  getDateNextMonthPickerIconStyle,
  getDateNextNavButtonSurface,
  getDateNextNavIconStyle,
} from './date-next-surface.shared'

export const dateNextElementRadiusStyles = styleVariants(
  Object.fromEntries(
    dateNextRadiusValues.map(radius => [
      radius,
      {
        vars: {
          '--element-border-radius': designTokens.radius[radius],
        },
      },
    ]),
  ),
)

export const dateNextControlIconSizeVar = createVar()
export const dateNextCalendarNavSizeVar = createVar()
export const dateNextCalendarNavIconSizeVar = createVar()

export const dateNextCalendarNavButton = style(getDateNextNavButtonSurface(dateNextCalendarNavSizeVar))

export const dateNextCalendarNavIcon = style(getDateNextNavIconStyle(dateNextCalendarNavIconSizeVar))

export const dateNextCalendarMonthPickerIcon = style(getDateNextMonthPickerIconStyle(dateNextControlIconSizeVar))
