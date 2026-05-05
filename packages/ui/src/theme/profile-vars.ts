import {
  RHYTHM_RESPONSIVE_PROFILE_VARS,
  TYPOGRAPHY_RESPONSIVE_PROFILE_VARS,
  type TypographyResponsiveProfile,
} from '@incmix/theme'
import type { CSSProperties } from 'react'
import type { typographyBreakpoints } from './tokens'

export const THEME_PROFILE_VAR_NAMES = {
  responsiveProfile: '--theme-typography-responsive-profile',
  textScale: '--theme-typography-text-scale',
  textLeading: '--theme-typography-text-leading',
  headingScale: '--theme-typography-heading-scale',
  headingLeading: '--theme-typography-heading-leading',
  uiScale: '--theme-typography-ui-scale',
  uiLeading: '--theme-typography-ui-leading',
  cardPaddingXs: '--theme-rhythm-card-padding-xs',
  cardPaddingSm: '--theme-rhythm-card-padding-sm',
  cardPaddingMd: '--theme-rhythm-card-padding-md',
  cardPaddingLg: '--theme-rhythm-card-padding-lg',
  cardPaddingXl: '--theme-rhythm-card-padding-xl',
  sectionSpace1: '--theme-rhythm-section-space-1',
  sectionSpace2: '--theme-rhythm-section-space-2',
  sectionSpace3: '--theme-rhythm-section-space-3',
  sectionSpace4: '--theme-rhythm-section-space-4',
  fieldGroupRowGap: '--theme-rhythm-field-group-row-gap',
  fieldGroupColumnGap: '--theme-rhythm-field-group-column-gap',
  breakpointXs: '--theme-typography-breakpoint-xs',
  breakpointSm: '--theme-typography-breakpoint-sm',
  breakpointMd: '--theme-typography-breakpoint-md',
  breakpointLg: '--theme-typography-breakpoint-lg',
  breakpointXl: '--theme-typography-breakpoint-xl',
} as const

export type ThemeProfileSignalSnapshot = {
  responsiveProfile: string
  textScale: string
  headingScale: string
  cardPaddingMd: string
  sectionSpace4: string
  fieldGroupRowGap: string
}

export function buildThemeResponsiveProfileVars(
  profile: TypographyResponsiveProfile,
  breakpoints: typeof typographyBreakpoints,
): CSSProperties {
  const typographyVars = TYPOGRAPHY_RESPONSIVE_PROFILE_VARS[profile]
  const rhythmVars = RHYTHM_RESPONSIVE_PROFILE_VARS[profile]

  return {
    [THEME_PROFILE_VAR_NAMES.responsiveProfile]: profile,
    [THEME_PROFILE_VAR_NAMES.textScale]: typographyVars.textScale,
    [THEME_PROFILE_VAR_NAMES.textLeading]: typographyVars.textLeading,
    [THEME_PROFILE_VAR_NAMES.headingScale]: typographyVars.headingScale,
    [THEME_PROFILE_VAR_NAMES.headingLeading]: typographyVars.headingLeading,
    [THEME_PROFILE_VAR_NAMES.uiScale]: typographyVars.uiScale,
    [THEME_PROFILE_VAR_NAMES.uiLeading]: typographyVars.uiLeading,
    [THEME_PROFILE_VAR_NAMES.cardPaddingXs]: rhythmVars.cardPaddingBySize.xs,
    [THEME_PROFILE_VAR_NAMES.cardPaddingSm]: rhythmVars.cardPaddingBySize.sm,
    [THEME_PROFILE_VAR_NAMES.cardPaddingMd]: rhythmVars.cardPaddingBySize.md,
    [THEME_PROFILE_VAR_NAMES.cardPaddingLg]: rhythmVars.cardPaddingBySize.lg,
    [THEME_PROFILE_VAR_NAMES.cardPaddingXl]: rhythmVars.cardPaddingBySize.xl,
    [THEME_PROFILE_VAR_NAMES.sectionSpace1]: rhythmVars.sectionSpaceBySize['1'],
    [THEME_PROFILE_VAR_NAMES.sectionSpace2]: rhythmVars.sectionSpaceBySize['2'],
    [THEME_PROFILE_VAR_NAMES.sectionSpace3]: rhythmVars.sectionSpaceBySize['3'],
    [THEME_PROFILE_VAR_NAMES.sectionSpace4]: rhythmVars.sectionSpaceBySize['4'],
    [THEME_PROFILE_VAR_NAMES.fieldGroupRowGap]: rhythmVars.fieldGroupRowGap,
    [THEME_PROFILE_VAR_NAMES.fieldGroupColumnGap]: rhythmVars.fieldGroupColumnGap,
    [THEME_PROFILE_VAR_NAMES.breakpointXs]: breakpoints.xs,
    [THEME_PROFILE_VAR_NAMES.breakpointSm]: breakpoints.sm,
    [THEME_PROFILE_VAR_NAMES.breakpointMd]: breakpoints.md,
    [THEME_PROFILE_VAR_NAMES.breakpointLg]: breakpoints.lg,
    [THEME_PROFILE_VAR_NAMES.breakpointXl]: breakpoints.xl,
  } as CSSProperties
}

export function readThemeResponsiveProfileSignals(styles: CSSStyleDeclaration): ThemeProfileSignalSnapshot {
  return {
    responsiveProfile: styles.getPropertyValue(THEME_PROFILE_VAR_NAMES.responsiveProfile).trim(),
    textScale: styles.getPropertyValue(THEME_PROFILE_VAR_NAMES.textScale).trim(),
    headingScale: styles.getPropertyValue(THEME_PROFILE_VAR_NAMES.headingScale).trim(),
    cardPaddingMd: styles.getPropertyValue(THEME_PROFILE_VAR_NAMES.cardPaddingMd).trim(),
    sectionSpace4: styles.getPropertyValue(THEME_PROFILE_VAR_NAMES.sectionSpace4).trim(),
    fieldGroupRowGap: styles.getPropertyValue(THEME_PROFILE_VAR_NAMES.fieldGroupRowGap).trim(),
  }
}
