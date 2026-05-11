import { createVar, style, styleVariants } from '@vanilla-extract/css'
import { designTokens } from '@/theme/tokens'
import { dateRadiusValues } from './date.props'
import { getDateMonthPickerIconStyle, getDateNavButtonSurface, getDateNavIconStyle } from './date-surface.shared'

export const dateElementRadiusStyles = styleVariants(
  Object.fromEntries(
    dateRadiusValues.map(radius => [
      radius,
      {
        vars: {
          '--element-border-radius': designTokens.radius[radius],
        },
      },
    ]),
  ),
)

export const dateControlIconSizeVar = createVar()
export const dateCalendarNavSizeVar = createVar()
export const dateCalendarNavIconSizeVar = createVar()

export const dateCalendarNavButton = style(getDateNavButtonSurface(dateCalendarNavSizeVar))

export const dateCalendarNavIcon = style(getDateNavIconStyle(dateCalendarNavIconSizeVar))

export const dateCalendarMonthPickerIcon = style(getDateMonthPickerIconStyle(dateControlIconSizeVar))
