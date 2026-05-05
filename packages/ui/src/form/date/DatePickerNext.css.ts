import { createVar, style, styleVariants } from '@vanilla-extract/css'
import { semanticColorKeys, semanticColorVar } from '@/theme/props/color.prop'
import { radiusStyleVariants } from '@/theme/radius.css'
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
  dateNextSizeValues,
} from './date-next.props'
import {
  getDateNextCalendarButtonSurface,
  getDateNextCalendarTypography,
  getDateNextDayInteractiveStyle,
  getDateNextNavButtonSurface,
} from './date-next-surface.shared'
import { dateNextElementRadiusStyles } from './date-next-surface.shared.css'

const sizeValues = dateNextSizeValues as readonly DateNextSize[]
const controlHeightVar = createVar()
const controlFontSizeVar = createVar()
const controlLineHeightVar = createVar()
const controlPaddingInlineVar = createVar()
const controlPaddingBlockVar = createVar()
const controlIconSizeVar = createVar()
const controlGapVar = createVar()
const calendarDaySizeVar = createVar()
const calendarNavSizeVar = createVar()
const calendarFontSizeVar = createVar()
const calendarLineHeightVar = createVar()
const calendarGridGapVar = createVar()
const calendarPopoverPaddingVar = createVar()
const calendarHeadingGapVar = createVar()
export const datePickerTriggerGroupBase = style({
  display: 'flex',
  width: '100%',
  minWidth: 0,
  alignItems: 'center',
  gap: controlGapVar,
})

export const datePickerTriggerGroupSizeStyles = styleVariants(
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
          [controlIconSizeVar]: dateNextControlIconSizeBySize[size],
          [controlGapVar]: dateNextControlGapBySize[size],
          [calendarDaySizeVar]: dateNextCalendarDaySizeBySize[size],
          [calendarNavSizeVar]: dateNextCalendarNavSizeBySize[size],
          [calendarFontSizeVar]: dateNextCalendarFontSizeBySize[size],
          [calendarLineHeightVar]: dateNextCalendarLineHeightBySize[size],
          [calendarGridGapVar]: dateNextCalendarGridGapBySize[size],
          [calendarPopoverPaddingVar]: dateNextCalendarPopoverPaddingBySize[size],
          [calendarHeadingGapVar]: dateNextCalendarHeadingGapBySize[size],
        },
      },
    ]),
  ),
)

export const datePickerInput = style({
  display: 'flex',
  flex: 1,
  width: '100%',
  minWidth: 0,
  alignItems: 'center',
  gap: '0.25rem',
  height: controlHeightVar,
  borderRadius: 'var(--element-border-radius)',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: 'var(--border)',
  backgroundColor: 'var(--background)',
  paddingInline: controlPaddingInlineVar,
  paddingBlock: controlPaddingBlockVar,
  fontSize: controlFontSizeVar,
  lineHeight: controlLineHeightVar,
  transition:
    'background-color var(--af-motion-fast) var(--af-ease-standard), border-color var(--af-motion-fast) var(--af-ease-standard), box-shadow var(--af-motion-fast) var(--af-ease-standard)',
  selectors: {
    '&:focus-within': {
      borderColor: 'var(--ring)',
      boxShadow: '0 0 0 2px color-mix(in srgb, var(--ring) 24%, transparent)',
    },
  },
})

export const datePickerCalendarButton = style(getDateNextCalendarButtonSurface(controlHeightVar))

export const datePickerCalendarIcon = style({
  width: controlIconSizeVar,
  height: controlIconSizeVar,
})

export const datePickerNavButton = style(getDateNextNavButtonSurface(calendarNavSizeVar))

export const datePickerNavButtonSizeStyles = styleVariants(
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

export const datePickerCalendarIconSizeStyles = styleVariants(
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

export const datePickerCalendarCell = style({
  display: 'grid',
  placeItems: 'center',
})

export const datePickerCalendarCellSizeStyles = styleVariants(
  Object.fromEntries(
    sizeValues.map(size => [
      size,
      {
        width: dateNextCalendarDaySizeBySize[size],
        height: dateNextCalendarDaySizeBySize[size],
        fontSize: dateNextCalendarFontSizeBySize[size],
        lineHeight: dateNextCalendarLineHeightBySize[size],
      },
    ]),
  ),
)

export const datePickerCalendarCellRadiusStyles = radiusStyleVariants

export const datePickerCalendarDayInteractive = style(getDateNextDayInteractiveStyle())

export const datePickerTriggerGroupRadiusStyles = dateNextElementRadiusStyles

export const datePickerTriggerGroupVariantStyles = styleVariants({
  classic: {
    background:
      'linear-gradient(to bottom, var(--background), color-mix(in srgb, var(--color-neutral-soft) 30%, transparent))',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: semanticColorVar('neutral', 'border'),
    boxShadow: 'var(--shadow-xs)',
  },
  solid: {
    backgroundColor: semanticColorVar('neutral', 'primary-alpha'),
    borderWidth: 0,
  },
  soft: {
    backgroundColor: semanticColorVar('neutral', 'soft'),
    borderWidth: 0,
  },
  surface: {
    backgroundColor: semanticColorVar('neutral', 'surface'),
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: semanticColorVar('neutral', 'border'),
    boxShadow: 'var(--shadow-xs)',
  },
  outline: {
    backgroundColor: 'var(--background)',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: semanticColorVar('neutral', 'border'),
  },
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
})

export const datePickerTriggerGroupBorderColorStyles: Record<Color, string> = Object.fromEntries(
  semanticColorKeys.map(color => [
    color,
    style({
      borderColor: semanticColorVar(color, 'border'),
      selectors: {
        '&:focus-within': {
          borderColor: semanticColorVar(color, 'primary'),
          boxShadow: `0 0 0 2px ${semanticColorVar(color, 'primary-alpha')}`,
        },
      },
    }),
  ]),
) as Record<Color, string>

export const datePickerTriggerGroupSolidColorStyles: Record<Color, string> = Object.fromEntries(
  semanticColorKeys.map(color => [
    color,
    style({
      backgroundColor: semanticColorVar(color, 'primary-alpha'),
      selectors: {
        '&:hover': {
          backgroundColor: `color-mix(in srgb, ${semanticColorVar(color, 'primary')} 22%, transparent)`,
        },
        '&:focus-within': {
          backgroundColor: `color-mix(in srgb, ${semanticColorVar(color, 'primary')} 28%, transparent)`,
          boxShadow: `0 0 0 2px ${semanticColorVar(color, 'primary-alpha')}`,
        },
      },
    }),
  ]),
) as Record<Color, string>

export const datePickerTriggerGroupSoftColorStyles: Record<Color, string> = Object.fromEntries(
  semanticColorKeys.map(color => [
    color,
    style({
      backgroundColor: semanticColorVar(color, 'soft'),
      selectors: {
        '&:hover': {
          backgroundColor: semanticColorVar(color, 'soft-hover'),
        },
        '&:focus-within': {
          backgroundColor: semanticColorVar(color, 'soft-hover'),
          boxShadow: `0 0 0 2px ${semanticColorVar(color, 'primary-alpha')}`,
        },
      },
    }),
  ]),
) as Record<Color, string>

export const datePickerCalendarSelectedColorStyles: Record<Color, string> = Object.fromEntries(
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

export const datePickerCalendarTypography = style(
  getDateNextCalendarTypography(calendarFontSizeVar, calendarLineHeightVar),
)

export const datePickerCalendarHeadingSizeStyles = styleVariants(
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

export const datePickerCalendarHeading = datePickerCalendarTypography

export const datePickerCalendarPopover = style({
  borderRadius: 'var(--element-border-radius)',
  padding: calendarPopoverPaddingVar,
})

export const datePickerCalendarHeadingButton = style({
  gap: calendarHeadingGapVar,
})

const calendarGridBase = {
  display: 'grid' as const,
  placeItems: 'center' as const,
  gap: calendarGridGapVar,
}

export const datePickerCalendarWeekdayGrid = style(calendarGridBase)

export const datePickerCalendarDayGrid = style(calendarGridBase)

export const datePickerCalendarGridSizeStyles = styleVariants(
  Object.fromEntries(
    sizeValues.map(size => [
      size,
      {
        gridTemplateColumns: `repeat(7, ${dateNextCalendarDaySizeBySize[size]})`,
      },
    ]),
  ),
)
