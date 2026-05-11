import { createVar, style, styleVariants } from '@vanilla-extract/css'
import { semanticColorKeys, semanticColorVar } from '@/theme/props/color.prop'
import type { Color } from '@/theme/tokens'
import {
  type DateSize,
  dateCalendarDaySizeBySize,
  dateCalendarFontSizeBySize,
  dateCalendarGridGapBySize,
  dateCalendarHeadingGapBySize,
  dateCalendarLineHeightBySize,
  dateCalendarNavIconSizeBySize,
  dateCalendarNavSizeBySize,
  dateCalendarPopoverPaddingBySize,
  dateControlFontSizeBySize,
  dateControlGapBySize,
  dateControlHeightBySize,
  dateControlIconSizeBySize,
  dateControlLineHeightBySize,
  dateControlPaddingXBySize,
  dateControlPaddingYBySize,
  dateRangeFieldMinWidthBySize,
  dateSizeValues,
} from './date.props'
import {
  getDateCalendarButtonSurface,
  getDateCalendarTypography,
  getDateDayInteractiveStyle,
} from './date-surface.shared'
import {
  dateCalendarNavIconSizeVar,
  dateCalendarNavSizeVar,
  dateControlIconSizeVar,
  dateElementRadiusStyles,
} from './date-surface.shared.css'

const sizeValues = dateSizeValues as readonly DateSize[]
const controlHeightVar = createVar()
const controlFontSizeVar = createVar()
const controlLineHeightVar = createVar()
const controlPaddingInlineVar = createVar()
const controlPaddingBlockVar = createVar()
const controlGapVar = createVar()
const controlFieldMinWidthVar = createVar()
const calendarDaySizeVar = createVar()
const calendarFontSizeVar = createVar()
const calendarLineHeightVar = createVar()
const calendarGridGapVar = createVar()
const calendarHeadingGapVar = createVar()
const calendarPopoverPaddingVar = createVar()
export const rangeTriggerGroupBase = style({
  display: 'flex',
  alignItems: 'center',
  gap: controlGapVar,
})

export const rangeInputSurface = style({
  display: 'flex',
  alignItems: 'center',
  minWidth: `calc(${controlFieldMinWidthVar} * 2 + ${controlGapVar})`,
  height: controlHeightVar,
  gap: controlGapVar,
  borderRadius: 'var(--element-border-radius)',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: 'var(--border)',
  backgroundColor: 'var(--background)',
  paddingInline: controlPaddingInlineVar,
  paddingBlock: controlPaddingBlockVar,
  transition:
    'background-color var(--af-motion-fast) var(--af-ease-standard), border-color var(--af-motion-fast) var(--af-ease-standard), box-shadow var(--af-motion-fast) var(--af-ease-standard)',
  selectors: {
    '&:focus-within': {
      borderColor: 'var(--ring)',
      boxShadow: '0 0 0 2px color-mix(in srgb, var(--ring) 24%, transparent)',
    },
  },
})

export const rangeDateInput = style({
  display: 'flex',
  minWidth: controlFieldMinWidthVar,
  alignItems: 'center',
  gap: '0.25rem',
  fontSize: controlFontSizeVar,
  lineHeight: controlLineHeightVar,
})

export const rangeCalendarButton = style(getDateCalendarButtonSurface(controlHeightVar))

export const rangeCalendarIcon = style({
  width: dateControlIconSizeVar,
  height: dateControlIconSizeVar,
})

export const rangeCalendarCell = style({
  display: 'grid',
  placeItems: 'center',
  width: calendarDaySizeVar,
  height: calendarDaySizeVar,
  fontSize: calendarFontSizeVar,
  lineHeight: calendarLineHeightVar,
  borderRadius: 0,
  selectors: {
    '&[data-selection-start]': {
      borderTopLeftRadius: '0.375rem',
      borderBottomLeftRadius: '0.375rem',
    },
    '&[data-selection-end]': {
      borderTopRightRadius: '0.375rem',
      borderBottomRightRadius: '0.375rem',
    },
    '&[data-selection-start][data-selection-end]': {
      borderRadius: '0.375rem',
    },
  },
})

export const rangeCalendarTypography = style(getDateCalendarTypography(calendarFontSizeVar, calendarLineHeightVar))

export const rangeCalendarDualHeader = style({
  display: 'grid',
  gridTemplateColumns: 'auto 1fr 1fr auto',
  alignItems: 'center',
  gap: calendarHeadingGapVar,
})

export const rangeCalendarMonthColumns = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: calendarGridGapVar,
})

export const rangeCalendarPopover = style({
  padding: calendarPopoverPaddingVar,
})

export const rangeCalendarMonthHeadingButton = style({
  gap: calendarHeadingGapVar,
  fontSize: calendarFontSizeVar,
  lineHeight: calendarLineHeightVar,
})

export const rangeCalendarDayInteractive = style(getDateDayInteractiveStyle({ unavailableLineThrough: true }))

export const rangeTriggerGroupSizeStyles = styleVariants(
  Object.fromEntries(
    sizeValues.map(size => [
      size,
      {
        vars: {
          [controlHeightVar]: dateControlHeightBySize[size],
          [controlFontSizeVar]: dateControlFontSizeBySize[size],
          [controlLineHeightVar]: dateControlLineHeightBySize[size],
          [controlPaddingInlineVar]: dateControlPaddingXBySize[size],
          [controlPaddingBlockVar]: dateControlPaddingYBySize[size],
          [dateControlIconSizeVar]: dateControlIconSizeBySize[size],
          [controlGapVar]: dateControlGapBySize[size],
          [controlFieldMinWidthVar]: dateRangeFieldMinWidthBySize[size],
          [calendarDaySizeVar]: dateCalendarDaySizeBySize[size],
          [dateCalendarNavSizeVar]: dateCalendarNavSizeBySize[size],
          [dateCalendarNavIconSizeVar]: dateCalendarNavIconSizeBySize[size],
          [calendarFontSizeVar]: dateCalendarFontSizeBySize[size],
          [calendarLineHeightVar]: dateCalendarLineHeightBySize[size],
          [calendarGridGapVar]: dateCalendarGridGapBySize[size],
          [calendarHeadingGapVar]: dateCalendarHeadingGapBySize[size],
          [calendarPopoverPaddingVar]: dateCalendarPopoverPaddingBySize[size],
        },
      },
    ]),
  ),
)

export const rangeTriggerGroupRadiusStyles = dateElementRadiusStyles

export const rangeCalendarSelectedColorStyles: Record<Color, string> = Object.fromEntries(
  semanticColorKeys.map(color => [
    color,
    style({
      selectors: {
        '&[data-selected]:not([data-selection-start]):not([data-selection-end])': {
          backgroundColor: semanticColorVar(color, 'soft'),
          color: semanticColorVar(color, 'text'),
        },
        '&[data-selection-start], &[data-selection-end]': {
          backgroundColor: semanticColorVar(color, 'primary'),
          color: semanticColorVar(color, 'contrast'),
        },
      },
    }),
  ]),
) as Record<Color, string>
