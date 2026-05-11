import { createVar, style, styleVariants } from '@vanilla-extract/css'
import { semanticColorKeys, semanticColorVar } from '@/theme/props/color.prop'
import type { Color } from '@/theme/tokens'
import {
  type DateSize,
  dateContainerPaddingBySize,
  dateControlGapBySize,
  dateControlIconSizeBySize,
  dateControlPaddingXBySize,
  dateControlPaddingYBySize,
  dateSecondaryFontSizeBySize,
  dateSecondaryLineHeightBySize,
  dateSizeValues,
  dateTitleFontSizeBySize,
  dateTitleLineHeightBySize,
} from './date.props'
import { getDateDisabledState } from './date-surface.shared'

const sizeValues = dateSizeValues as readonly DateSize[]

/* ── Appointment chrome vars ── */
const titleFontSizeVar = createVar()
const titleLineHeightVar = createVar()
const footerFontSizeVar = createVar()
const footerLineHeightVar = createVar()
const buttonGapVar = createVar()
const slotPaddingVar = createVar()
const footerPaddingXVar = createVar()
const footerPaddingYVar = createVar()
const iconSizeVar = createVar()
const slotWidthVar = createVar()
const slotHeightVar = createVar()

/* ── Bespoke slot dimension tokens ── */
const appointmentSlotWidthBySize: Record<DateSize, string> = {
  xs: '5.5rem',
  sm: '6rem',
  md: '7rem',
  lg: '8rem',
  xl: '9rem',
  '2x': '10rem',
}

const appointmentSlotHeightBySize: Record<DateSize, string> = {
  xs: '11.25rem',
  sm: '12.5rem',
  md: '13.75rem',
  lg: '15rem',
  xl: '16.25rem',
  '2x': '17.5rem',
}

/* ── Root ── */
export const appointmentPickerRoot = style({
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: 'var(--border)',
  backgroundColor: 'var(--background)',
})
export const appointmentPickerRootDisabled = style(getDateDisabledState())

/* ── Size variants ── */
export const appointmentPickerSizeStyles = styleVariants(
  Object.fromEntries(
    sizeValues.map(size => {
      return [
        size,
        {
          vars: {
            [titleFontSizeVar]: dateTitleFontSizeBySize[size],
            [titleLineHeightVar]: dateTitleLineHeightBySize[size],
            [footerFontSizeVar]: dateSecondaryFontSizeBySize[size],
            [footerLineHeightVar]: dateSecondaryLineHeightBySize[size],
            [buttonGapVar]: dateControlGapBySize[size],
            [slotPaddingVar]: dateContainerPaddingBySize[size],
            [footerPaddingXVar]: dateControlPaddingXBySize[size],
            [footerPaddingYVar]: dateControlPaddingYBySize[size],
            [iconSizeVar]: dateControlIconSizeBySize[size],
            [slotWidthVar]: appointmentSlotWidthBySize[size],
            [slotHeightVar]: appointmentSlotHeightBySize[size],
          },
        },
      ]
    }),
  ),
)

/* ── Title ── */
export const appointmentPickerTitle = style({
  fontSize: titleFontSizeVar,
  lineHeight: titleLineHeightVar,
  fontWeight: 600,
})

/* ── Color styles (sets CSS custom props for slot hover/selected) ── */
export const appointmentPickerColorStyles: Record<Color, string> = Object.fromEntries(
  semanticColorKeys.map(color => [
    color,
    style({
      vars: {
        '--appt-slot-accent': semanticColorVar(color, 'primary'),
        '--appt-slot-soft': semanticColorVar(color, 'primary-alpha'),
        '--appt-slot-fg': semanticColorVar(color, 'contrast'),
      },
    }),
  ]),
) as Record<Color, string>

/* ── Footer text ── */
export const appointmentPickerFooterText = style({
  fontSize: footerFontSizeVar,
  lineHeight: footerLineHeightVar,
})

/* ── Slot container padding ── */
export const appointmentPickerSlotContainer = style({
  padding: slotPaddingVar,
})

/* ── Slot button gap ── */
export const appointmentPickerSlotGap = style({
  marginBottom: buttonGapVar,
})

/* ── Footer padding ── */
export const appointmentPickerFooterPadding = style({
  paddingInline: footerPaddingXVar,
  paddingBlock: footerPaddingYVar,
})

/* ── Slot panel default dimensions (overrideable via inline style) ── */
export const appointmentPickerSlotWidth = style({
  width: slotWidthVar,
})

export const appointmentPickerSlotHeight = style({
  height: slotHeightVar,
})

/* ── Check icon ── */
export const appointmentPickerCheckIcon = style({
  width: iconSizeVar,
  height: iconSizeVar,
  flexShrink: 0,
})
