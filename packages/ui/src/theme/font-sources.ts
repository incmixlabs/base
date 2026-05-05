import {
  THEME_FONT_DISPLAY_VALUES as themeFontDisplayValues,
  THEME_FONT_FILE_FORMATS as themeFontFileFormats,
  THEME_FONT_SOURCE_KINDS as themeFontSourceKinds,
  isValidFontWeightDescriptor as themeIsValidFontWeightDescriptor,
  THEME_TYPOGRAPHY_SLOTS as themeTypographySlots,
} from '@incmix/theme'

export type {
  ThemeCssUrlFontSource,
  ThemeFileUrlFontSource,
  ThemeFontDisplay,
  ThemeFontFileFormat,
  ThemeFontSource,
  ThemeFontSourceKind,
  ThemeFontSourceMap,
  ThemeTypographySlot,
} from '@incmix/theme'

export const isValidFontWeightDescriptor = themeIsValidFontWeightDescriptor
export const THEME_FONT_DISPLAY_VALUES = themeFontDisplayValues
export const THEME_FONT_FILE_FORMATS = themeFontFileFormats
export const THEME_FONT_SOURCE_KINDS = themeFontSourceKinds
export const THEME_TYPOGRAPHY_SLOTS = themeTypographySlots
