import { createVar, style, styleVariants } from '@vanilla-extract/css'
import { semanticColorKeys, semanticColorVar } from '@/theme/props/color.prop'
import type { Color } from '@/theme/tokens'
import {
  type DateNextSize,
  dateNextCalendarDaySizeBySize,
  dateNextCalendarFontSizeBySize,
  dateNextCalendarGridGapBySize,
  dateNextCalendarHeadingGapBySize,
  dateNextCalendarLineHeightBySize,
  dateNextCalendarNavIconSizeBySize,
  dateNextCalendarNavSizeBySize,
  dateNextCalendarPopoverPaddingBySize,
  dateNextControlFontSizeBySize,
  dateNextControlGapBySize,
  dateNextControlHeightBySize,
  dateNextControlIconSizeBySize,
  dateNextControlLineHeightBySize,
  dateNextControlPaddingXBySize,
  dateNextControlPaddingYBySize,
  dateNextRangeFieldMinWidthBySize,
  dateNextSizeValues,
} from './date-next.props'
import {
  getDateNextCalendarButtonSurface,
  getDateNextCalendarTypography,
  getDateNextDayInteractiveStyle,
} from './date-next-surface.shared'
import {
  dateNextCalendarNavIconSizeVar,
  dateNextCalendarNavSizeVar,
  dateNextControlIconSizeVar,
  dateNextElementRadiusStyles,
} from './date-next-surface.shared.css'

const sizeValues = dateNextSizeValues as readonly DateNextSize[]
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

export const rangeCalendarButton = style(getDateNextCalendarButtonSurface(controlHeightVar))

export const rangeCalendarIcon = style({
  width: dateNextControlIconSizeVar,
  height: dateNextControlIconSizeVar,
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

export const rangeCalendarTypography = style(getDateNextCalendarTypography(calendarFontSizeVar, calendarLineHeightVar))

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

export const rangeCalendarDayInteractive = style(getDateNextDayInteractiveStyle({ unavailableLineThrough: true }))

export const rangeTriggerGroupSizeStyles = styleVariants(
  Object.fromEntries(
    sizeValues.map(size => [
      size,
      {
        vars: {
          [controlHeightVar]: dateNextControlHeightBySize[size],
          [controlFontSizeVar]: dateNextControlFontSizeBySize[size],
          [controlLineHeightVar]: dateNextControlLineHeightBySize[size],
          [controlPaddingInlineVar]: dateNextControlPaddingXBySize[size],
          [controlPaddingBlockVar]: dateNextControlPaddingYBySize[size],
          [dateNextControlIconSizeVar]: dateNextControlIconSizeBySize[size],
          [controlGapVar]: dateNextControlGapBySize[size],
          [controlFieldMinWidthVar]: dateNextRangeFieldMinWidthBySize[size],
          [calendarDaySizeVar]: dateNextCalendarDaySizeBySize[size],
          [dateNextCalendarNavSizeVar]: dateNextCalendarNavSizeBySize[size],
          [dateNextCalendarNavIconSizeVar]: dateNextCalendarNavIconSizeBySize[size],
          [calendarFontSizeVar]: dateNextCalendarFontSizeBySize[size],
          [calendarLineHeightVar]: dateNextCalendarLineHeightBySize[size],
          [calendarGridGapVar]: dateNextCalendarGridGapBySize[size],
          [calendarHeadingGapVar]: dateNextCalendarHeadingGapBySize[size],
          [calendarPopoverPaddingVar]: dateNextCalendarPopoverPaddingBySize[size],
        },
      },
    ]),
  ),
)

export const rangeTriggerGroupRadiusStyles = dateNextElementRadiusStyles

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
