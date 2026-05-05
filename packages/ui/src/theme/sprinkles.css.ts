import { createSprinkles, defineProperties } from '@vanilla-extract/sprinkles'
import { breakpointMedia } from './helpers/responsive/breakpoints'
import { fontSizes, letterSpacings, lineHeights, radii, shadows, space } from './token-maps'

const colors = {
  background: 'var(--background)',
  foreground: 'var(--foreground)',
  muted: 'var(--color-neutral-soft)',
  mutedForeground: 'color-mix(in oklch, var(--color-neutral-text) 68%, transparent)',
  border: 'var(--color-neutral-border)',
  primary: 'var(--color-primary-primary)',
  primaryForeground: 'var(--color-primary-contrast)',
  accent: 'var(--color-accent-soft)',
  accentForeground: 'var(--color-accent-text)',
  secondary: 'var(--color-secondary-primary)',
  neutral: 'var(--color-neutral-primary)',
  info: 'var(--color-info-primary)',
  success: 'var(--color-success-primary)',
  warning: 'var(--color-warning-primary)',
  error: 'var(--color-error-primary)',
} as const

const borderColors = {
  ...colors,
  primary: 'var(--color-primary-border)',
  secondary: 'var(--color-secondary-border)',
  accent: 'var(--color-accent-border)',
  neutral: 'var(--color-neutral-border)',
  info: 'var(--color-info-border)',
  success: 'var(--color-success-border)',
  warning: 'var(--color-warning-border)',
  error: 'var(--color-error-border)',
} as const

const responsive = defineProperties({
  conditions: {
    initial: {},
    sm: { '@media': breakpointMedia.up('sm') },
    md: { '@media': breakpointMedia.up('md') },
    lg: { '@media': breakpointMedia.up('lg') },
  },
  defaultCondition: 'initial',
  properties: {
    display: ['none', 'block', 'inline-block', 'flex', 'inline-flex', 'grid'],
    flexDirection: ['row', 'column'],
    alignItems: ['stretch', 'flex-start', 'center', 'flex-end'],
    justifyContent: ['flex-start', 'center', 'flex-end', 'space-between'],
    gap: space,
    rowGap: space,
    columnGap: space,
    padding: space,
    paddingTop: space,
    paddingBottom: space,
    paddingLeft: space,
    paddingRight: space,
    margin: space,
    marginTop: space,
    marginBottom: space,
    marginLeft: space,
    marginRight: space,
    color: colors,
    backgroundColor: colors,
    borderRadius: radii,
    borderColor: borderColors,
    fontSize: fontSizes,
    lineHeight: lineHeights,
    letterSpacing: letterSpacings,
    boxShadow: shadows,
    width: ['auto', '100%'],
    height: ['auto', '100%'],
  },
  shorthands: {
    p: ['padding'],
    pt: ['paddingTop'],
    pb: ['paddingBottom'],
    pl: ['paddingLeft'],
    pr: ['paddingRight'],
    px: ['paddingLeft', 'paddingRight'],
    py: ['paddingTop', 'paddingBottom'],
    m: ['margin'],
    mt: ['marginTop'],
    mb: ['marginBottom'],
    ml: ['marginLeft'],
    mr: ['marginRight'],
    mx: ['marginLeft', 'marginRight'],
    my: ['marginTop', 'marginBottom'],
    bg: ['backgroundColor'],
  },
})

export const sprinkles = createSprinkles(responsive)
export type Sprinkles = Parameters<typeof sprinkles>[0]
