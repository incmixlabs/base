import {
  type ThemeFontSourceMap,
  TYPOGRAPHY_DEFAULTS,
  TYPOGRAPHY_RESPONSIVE_PROFILE_DEFAULT,
  type TypographyResponsiveProfile,
} from '@incmix/theme'
import type { AvatarVariant } from '@/elements/avatar/Avatar'
import type { Radius as ThemeRadius } from './tokens'

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
  typography: ThemeTypography
  layout: ThemeLayout
  locale: ThemeLocaleSettings
  calendar: ThemeCalendarSettings
  shadow: ThemeShadow
}

export const defaultThemeConfig: ThemeConfig = {
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
