import {
  type ThemeFontSourceMap,
  TYPOGRAPHY_DEFAULTS,
  TYPOGRAPHY_RESPONSIVE_PROFILE_DEFAULT,
  type TypographyResponsiveProfile,
} from '@incmix/theme'
import type { AvatarVariant } from '@/elements/avatar/Avatar'
import { chartDarkTokenColorMap, chartLightTokenColorMap } from './chart-token-map'
import type { Radius as ThemeRadius } from './tokens'

export interface ThemeColors {
  background: string
  foreground: string
  card: string
  cardForeground: string
  popover: string
  popoverForeground: string
  primary: string
  primaryForeground: string
  secondary: string
  secondaryForeground: string
  muted: string
  mutedForeground: string
  accent: string
  accentForeground: string
  destructive: string
  destructiveForeground: string
  border: string
  input: string
  ring: string
  chart1: string
  chart2: string
  chart3: string
  chart4: string
  chart5: string
}

export interface ThemeTypography {
  fontSans: string
  fontSerif: string
  fontMono: string
  letterSpacing: string
  responsiveProfile: TypographyResponsiveProfile
  fontSources: ThemeFontSourceMap
}

export interface ThemeLayout {
  radius: ThemeRadius
  spacing: string
  avatarVariant: AvatarVariant
  avatarRadius: ThemeRadius
}

export interface ThemeLocaleSettings {
  locale: string
  language: string
  country?: string
  timezone: string
}

export interface ThemeCalendarSettings {
  radius: ThemeRadius
  locale?: string
  timezone?: string
}

export interface ThemeShadow {
  color: string
  opacity: string
  blur: string
  spread: string
  offsetX: string
  offsetY: string
}

export interface ThemeConfig {
  colors: {
    light: ThemeColors
    dark: ThemeColors
  }
  typography: ThemeTypography
  layout: ThemeLayout
  locale: ThemeLocaleSettings
  calendar: ThemeCalendarSettings
  shadow: ThemeShadow
}

export const defaultThemeConfig: ThemeConfig = {
  colors: {
    light: {
      background: '0 0% 100%',
      foreground: '240 10% 3.9%',
      card: '0 0% 100%',
      cardForeground: '240 10% 3.9%',
      popover: '0 0% 100%',
      popoverForeground: '240 10% 3.9%',
      primary: '240 5.9% 10%',
      primaryForeground: '0 0% 98%',
      secondary: '240 4.8% 95.9%',
      secondaryForeground: '240 5.9% 10%',
      muted: '240 4.8% 95.9%',
      mutedForeground: '240 3.8% 46.1%',
      accent: '240 4.8% 95.9%',
      accentForeground: '240 5.9% 10%',
      destructive: '0 84.2% 60.2%',
      destructiveForeground: '0 0% 98%',
      border: '240 5.9% 90%',
      input: '240 5.9% 90%',
      ring: '240 5.9% 10%',
      chart1: chartLightTokenColorMap.chart1,
      chart2: chartLightTokenColorMap.chart2,
      chart3: chartLightTokenColorMap.chart3,
      chart4: chartLightTokenColorMap.chart4,
      chart5: chartLightTokenColorMap.chart5,
    },
    dark: {
      background: '240 10% 3.9%',
      foreground: '0 0% 98%',
      card: '240 10% 3.9%',
      cardForeground: '0 0% 98%',
      popover: '240 10% 3.9%',
      popoverForeground: '0 0% 98%',
      primary: '0 0% 98%',
      primaryForeground: '240 5.9% 10%',
      secondary: '240 3.7% 15.9%',
      secondaryForeground: '0 0% 98%',
      muted: '240 3.7% 15.9%',
      mutedForeground: '240 5% 64.9%',
      accent: '240 3.7% 15.9%',
      accentForeground: '0 0% 98%',
      destructive: '0 62.8% 30.6%',
      destructiveForeground: '0 0% 98%',
      border: '240 3.7% 15.9%',
      input: '240 3.7% 15.9%',
      ring: '240 4.9% 83.9%',
      chart1: chartDarkTokenColorMap.chart1,
      chart2: chartDarkTokenColorMap.chart2,
      chart3: chartDarkTokenColorMap.chart3,
      chart4: chartDarkTokenColorMap.chart4,
      chart5: chartDarkTokenColorMap.chart5,
    },
  },
  typography: {
    ...TYPOGRAPHY_DEFAULTS,
    letterSpacing: '0em',
    responsiveProfile: TYPOGRAPHY_RESPONSIVE_PROFILE_DEFAULT,
    fontSources: {},
  },
  layout: {
    radius: 'md',
    spacing: '0.25rem',
    avatarVariant: 'soft',
    avatarRadius: 'full',
  },
  locale: {
    locale: 'en-US',
    language: 'en',
    country: 'US',
    timezone: 'UTC',
  },
  calendar: {
    radius: 'md',
  },
  shadow: {
    color: '0 0% 0%',
    opacity: '0.1',
    blur: '10px',
    spread: '0px',
    offsetX: '0px',
    offsetY: '4px',
  },
}

export const presetThemes: Record<string, Partial<ThemeConfig>> = {
  sky: {
    colors: {
      light: {
        ...defaultThemeConfig.colors.light,
        primary: 'oklch(0.61 0.11 222)',
        primaryForeground: 'oklch(0.98 0.02 201)',
      },
      dark: {
        ...defaultThemeConfig.colors.dark,
        primary: 'oklch(0.71 0.13 215)',
        primaryForeground: 'oklch(0.3 0.05 230)',
      },
    },
  },
  zinc: defaultThemeConfig,
  slate: {
    colors: {
      light: {
        ...defaultThemeConfig.colors.light,
        primary: 'oklch(0.55 0.03 265)',
        primaryForeground: 'oklch(0.98 0.01 265)',
      },
      dark: {
        ...defaultThemeConfig.colors.dark,
        primary: 'oklch(0.87 0.01 265)',
        primaryForeground: 'oklch(0.21 0.02 265)',
      },
    },
  },
  rose: {
    colors: {
      light: {
        ...defaultThemeConfig.colors.light,
        primary: 'oklch(0.59 0.2 358)',
        primaryForeground: 'oklch(0.97 0.01 358)',
      },
      dark: {
        ...defaultThemeConfig.colors.dark,
        primary: 'oklch(0.59 0.2 358)',
        primaryForeground: 'oklch(0.97 0.01 358)',
      },
    },
  },
  blue: {
    colors: {
      light: {
        ...defaultThemeConfig.colors.light,
        primary: 'oklch(0.55 0.2 260)',
        primaryForeground: 'oklch(0.98 0.01 265)',
      },
      dark: {
        ...defaultThemeConfig.colors.dark,
        primary: 'oklch(0.65 0.2 260)',
        primaryForeground: 'oklch(0.21 0.02 265)',
      },
    },
  },
  green: {
    colors: {
      light: {
        ...defaultThemeConfig.colors.light,
        primary: 'oklch(0.55 0.16 150)',
        primaryForeground: 'oklch(0.97 0.01 150)',
      },
      dark: {
        ...defaultThemeConfig.colors.dark,
        primary: 'oklch(0.65 0.18 150)',
        primaryForeground: 'oklch(0.21 0.04 150)',
      },
    },
  },
  orange: {
    colors: {
      light: {
        ...defaultThemeConfig.colors.light,
        primary: 'oklch(0.7 0.17 55)',
        primaryForeground: 'oklch(0.98 0.01 90)',
      },
      dark: {
        ...defaultThemeConfig.colors.dark,
        primary: 'oklch(0.65 0.17 50)',
        primaryForeground: 'oklch(0.98 0.01 90)',
      },
    },
  },
  violet: {
    colors: {
      light: {
        ...defaultThemeConfig.colors.light,
        primary: 'oklch(0.55 0.22 300)',
        primaryForeground: 'oklch(0.98 0.01 300)',
      },
      dark: {
        ...defaultThemeConfig.colors.dark,
        primary: 'oklch(0.55 0.2 300)',
        primaryForeground: 'oklch(0.98 0.01 300)',
      },
    },
  },
}
