import type { ThemeTokenMap, ThemeTokenPath } from './resolver.js'

export const THEME_SIZE_KEYS = ['xs', 'sm', 'md', 'lg', 'xl', '2x', '3x', '4x', '5x'] as const

export const THEME_SIZE_SLOTS = ['height', 'fontSize', 'paddingX', 'paddingY', 'lineHeight', 'iconSize', 'gap'] as const

export type ThemeSizeKey = (typeof THEME_SIZE_KEYS)[number]
export type ThemeSizeSlot = (typeof THEME_SIZE_SLOTS)[number]

export type ThemeSizeTokenValues = Record<ThemeSizeSlot, string>
export type ThemeSizeTokenInput = Readonly<Record<ThemeSizeKey, Readonly<ThemeSizeTokenValues>>>

export const themeSizeTokens = {
  xs: {
    height: '1.5rem',
    fontSize: '0.75rem',
    paddingX: '0.5rem',
    paddingY: '0.25rem',
    lineHeight: '1rem',
    iconSize: '0.75rem',
    gap: '0.25rem',
  },
  sm: {
    height: '1.75rem',
    fontSize: '0.875rem',
    paddingX: '0.625rem',
    paddingY: '0.25rem',
    lineHeight: '1.25rem',
    iconSize: '0.875rem',
    gap: '0.375rem',
  },
  md: {
    height: '2rem',
    fontSize: '1rem',
    paddingX: '0.75rem',
    paddingY: '0.25rem',
    lineHeight: '1.5rem',
    iconSize: '1rem',
    gap: '0.5rem',
  },
  lg: {
    height: '2.5rem',
    fontSize: '1.125rem',
    paddingX: '0.875rem',
    paddingY: '0.4375rem',
    lineHeight: '1.625rem',
    iconSize: '1.25rem',
    gap: '0.625rem',
  },
  xl: {
    height: '2.75rem',
    fontSize: '1.25rem',
    paddingX: '0.875rem',
    paddingY: '0.5rem',
    lineHeight: '1.75rem',
    iconSize: '1.5rem',
    gap: '0.6875rem',
  },
  '2x': {
    height: '5rem',
    fontSize: '1.5rem',
    paddingX: '1.25rem',
    paddingY: '1.5625rem',
    lineHeight: '1.875rem',
    iconSize: '1.75rem',
    gap: '0.875rem',
  },
  '3x': {
    height: '6rem',
    fontSize: '1.75rem',
    paddingX: '1.5rem',
    paddingY: '1.875rem',
    lineHeight: '2.25rem',
    iconSize: '2rem',
    gap: '1rem',
  },
  '4x': {
    height: '7.5rem',
    fontSize: '2.125rem',
    paddingX: '1.75rem',
    paddingY: '2.5rem',
    lineHeight: '2.5rem',
    iconSize: '2.5rem',
    gap: '1.25rem',
  },
  '5x': {
    height: '10rem',
    fontSize: '3rem',
    paddingX: '2.25rem',
    paddingY: '3.25rem',
    lineHeight: '3.5rem',
    iconSize: '3.5rem',
    gap: '1.5rem',
  },
} as const satisfies Record<ThemeSizeKey, ThemeSizeTokenValues>

export function getThemeSizeTokenPath(size: ThemeSizeKey, slot: ThemeSizeSlot): ThemeTokenPath {
  return `global.size.${size}.${slot}`
}

export function createThemeSizeTokenMap(tokens: ThemeSizeTokenInput = themeSizeTokens): ThemeTokenMap {
  return Object.fromEntries(
    THEME_SIZE_KEYS.flatMap(size =>
      THEME_SIZE_SLOTS.map(slot => [getThemeSizeTokenPath(size, slot), tokens[size][slot]]),
    ),
  ) as ThemeTokenMap
}
