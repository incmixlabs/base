export const THEME_TYPOGRAPHY_SLOTS = ['sans', 'serif', 'mono'] as const

export type ThemeTypographySlot = (typeof THEME_TYPOGRAPHY_SLOTS)[number]

export const THEME_FONT_SOURCE_KINDS = ['css-url', 'file-url'] as const

export type ThemeFontSourceKind = (typeof THEME_FONT_SOURCE_KINDS)[number]

export const THEME_FONT_FILE_FORMATS = ['woff2', 'woff', 'truetype', 'opentype'] as const

export type ThemeFontFileFormat = (typeof THEME_FONT_FILE_FORMATS)[number]

export const THEME_FONT_DISPLAY_VALUES = ['auto', 'block', 'swap', 'fallback', 'optional'] as const

export type ThemeFontDisplay = (typeof THEME_FONT_DISPLAY_VALUES)[number]

export type ThemeCssUrlFontSource = {
  kind: 'css-url'
  url: string
}

export type ThemeFileUrlFontSource = {
  kind: 'file-url'
  url: string
  format?: ThemeFontFileFormat
  weight?: string
  style?: 'normal' | 'italic'
  display?: ThemeFontDisplay
}

export type ThemeFontSource = ThemeCssUrlFontSource | ThemeFileUrlFontSource

export type ThemeFontSourceMap = Partial<Record<ThemeTypographySlot, ThemeFontSource | undefined>>

const FONT_WEIGHT_KEYWORDS = new Set(['normal', 'bold', 'lighter', 'bolder'])

function isNumericFontWeightToken(token: string) {
  if (!/^\d{1,4}$/.test(token)) return false
  const value = Number(token)
  return value >= 1 && value <= 1000
}

/** Validate CSS font-weight descriptors such as `400`, `bold`, or `400 700`. */
export function isValidFontWeightDescriptor(value: string): boolean {
  const trimmed = value.trim()
  if (!trimmed) return false

  const tokens = trimmed.split(/\s+/)
  if (tokens.length === 1) {
    const [token] = tokens
    return token !== undefined && (FONT_WEIGHT_KEYWORDS.has(token) || isNumericFontWeightToken(token))
  }

  if (tokens.length === 2) {
    const [start, end] = tokens
    return start !== undefined && end !== undefined && isNumericFontWeightToken(start) && isNumericFontWeightToken(end)
  }

  return false
}
