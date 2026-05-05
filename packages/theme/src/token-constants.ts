/**
 * Shared token constants used by runtime code and build-time token generation.
 * This module must remain free of @/ path alias imports so build scripts can
 * consume it directly.
 */

/** Default typography font stacks (mirrors defaultThemeConfig.typography). */
export const TYPOGRAPHY_DEFAULTS = {
  fontSans:
    '"Geist Variable", "Geist", ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
  fontSerif: '"Newsreader Variable", "Newsreader", ui-serif, Georgia, "Times New Roman", serif',
  fontMono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
} as const

/** Named responsive typography profiles surfaced through ThemeProvider/theme config. */
export const TYPOGRAPHY_RESPONSIVE_PROFILES = ['compact', 'balanced', 'expressive'] as const

export type TypographyResponsiveProfile = (typeof TYPOGRAPHY_RESPONSIVE_PROFILES)[number]

export const TYPOGRAPHY_RESPONSIVE_PROFILE_DEFAULT: TypographyResponsiveProfile = 'balanced'

export const TYPOGRAPHY_RESPONSIVE_PROFILE_VARS: Record<
  TypographyResponsiveProfile,
  {
    textScale: string
    textLeading: string
    headingScale: string
    headingLeading: string
    uiScale: string
    uiLeading: string
  }
> = {
  compact: {
    textScale: '0.9',
    textLeading: '0.94',
    headingScale: '0.84',
    headingLeading: '0.9',
    uiScale: '0.9',
    uiLeading: '0.94',
  },
  balanced: {
    textScale: '1',
    textLeading: '1',
    headingScale: '1',
    headingLeading: '1',
    uiScale: '1',
    uiLeading: '1',
  },
  expressive: {
    textScale: '1.16',
    textLeading: '1.1',
    headingScale: '1.32',
    headingLeading: '1.16',
    uiScale: '1.12',
    uiLeading: '1.08',
  },
} as const

export const RHYTHM_RESPONSIVE_PROFILE_VARS: Record<
  TypographyResponsiveProfile,
  {
    cardPaddingBySize: { xs: string; sm: string; md: string; lg: string; xl: string }
    sectionSpaceBySize: { '1': string; '2': string; '3': string; '4': string }
    fieldGroupRowGap: string
    fieldGroupColumnGap: string
  }
> = {
  compact: {
    cardPaddingBySize: {
      xs: '0.375rem',
      sm: '0.5rem',
      md: '0.625rem',
      lg: '0.75rem',
      xl: '1rem',
    },
    sectionSpaceBySize: {
      '1': '1rem',
      '2': '1.5rem',
      '3': '2.5rem',
      '4': '4rem',
    },
    fieldGroupRowGap: '0.75rem',
    fieldGroupColumnGap: '1.5rem',
  },
  balanced: {
    cardPaddingBySize: {
      xs: '0.5rem',
      sm: '0.75rem',
      md: '0.875rem',
      lg: '1rem',
      xl: '1.375rem',
    },
    sectionSpaceBySize: {
      '1': '1.5rem',
      '2': '2.5rem',
      '3': '4rem',
      '4': '6rem',
    },
    fieldGroupRowGap: '1rem',
    fieldGroupColumnGap: '2rem',
  },
  expressive: {
    cardPaddingBySize: {
      xs: '0.75rem',
      sm: '1rem',
      md: '1.25rem',
      lg: '1.5rem',
      xl: '2rem',
    },
    sectionSpaceBySize: {
      '1': '2rem',
      '2': '3.5rem',
      '3': '5.5rem',
      '4': '8rem',
    },
    fieldGroupRowGap: '1.5rem',
    fieldGroupColumnGap: '3rem',
  },
} as const

/** Spacing scale indices resolved to CSS pixel dimensions. */
export const SPACING_TO_PIXELS: Record<string, string> = {
  '0': '0px',
  '1': '4px',
  '2': '8px',
  '3': '12px',
  '4': '16px',
  '5': '24px',
  '6': '32px',
  '7': '32px',
  '8': '40px',
  '9': '48px',
}

export const BORDER_RADIUS_TO_PIXELS = {
  none: '0',
  sm: '4px',
  md: '8px',
  lg: '20px',
  full: '9999px',
} as const
