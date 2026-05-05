import { style, styleVariants } from '@vanilla-extract/css'
import { avatarPropDefs } from '@/elements/avatar/avatar.props'
import { radiusStyleVariants } from '@/theme/radius.css'
import { controlSizeTokens } from '@/theme/token-maps'
import { HUE_NAMES, type HueName } from '@/theme/tokens'
import { AVATAR_SOFT_TONES, AVATAR_SOLID_TONES, type AvatarSoftTone, type AvatarSolidTone } from './avatar.shared'

type AvatarSize = (typeof avatarPropDefs.size.values)[number]

export const avatarFallbackMuted = style({
  backgroundColor: 'color-mix(in oklch, var(--color-slate-soft) 70%, transparent)',
  color: 'var(--color-slate-text)',
})

export const avatarPresence = style({
  border: '1.5px solid var(--color-light-background)',
})

export const avatarPresenceBySize = styleVariants({
  xs: {
    width: '0.375rem',
    height: '0.375rem',
  },
  sm: {
    width: '0.5rem',
    height: '0.5rem',
  },
  md: {
    width: '0.625rem',
    height: '0.625rem',
  },
  lg: {
    width: '0.75rem',
    height: '0.75rem',
  },
  xl: {
    width: '0.875rem',
    height: '0.875rem',
  },
  '2x': {
    width: '1rem',
    height: '1rem',
  },
})

export const avatarPresenceByState = styleVariants({
  online: {
    backgroundColor: 'var(--color-success-primary)',
  },
  offline: {
    backgroundColor: 'var(--color-warning-primary)',
  },
  unknown: {
    backgroundColor: 'var(--color-neutral-text)',
  },
  busy: {
    backgroundColor: 'var(--color-error-primary)',
  },
})

export const avatarPresenceBusyLine = style({
  height: '1px',
  backgroundColor: 'var(--color-light-contrast)',
  transform: 'rotate(-45deg)',
  transformOrigin: 'center',
  borderRadius: '9999px',
})

export const avatarPresenceBusyLineBySize = styleVariants({
  xs: {
    width: '0.5rem',
  },
  sm: {
    width: '0.625rem',
  },
  md: {
    width: '0.75rem',
  },
  lg: {
    width: '0.875rem',
  },
  xl: {
    width: '1rem',
  },
  '2x': {
    width: '1.125rem',
  },
})

export const avatarDefaultIcon = style({
  width: '60%',
  height: '60%',
})

export const avatarSizeBySize = styleVariants(
  Object.fromEntries(
    avatarPropDefs.size.values.map(size => [
      size,
      {
        width: controlSizeTokens[size].height,
        height: controlSizeTokens[size].height,
        fontSize: controlSizeTokens[size].fontSize,
        lineHeight: controlSizeTokens[size].lineHeight,
      },
    ]),
  ) as Record<AvatarSize, { width: string; height: string; fontSize: string; lineHeight: string }>,
)

export const avatarRadiusByRadius = radiusStyleVariants

export const avatarSoftFallbackByHueTone = styleVariants(
  Object.fromEntries(
    HUE_NAMES.flatMap(hue =>
      AVATAR_SOFT_TONES.map(tone => [
        `${hue}-${tone}`,
        {
          backgroundColor: `var(--${hue}-${tone})`,
          color: `var(--${hue}-11)`,
        },
      ]),
    ),
  ) as Record<`${HueName}-${AvatarSoftTone}`, { backgroundColor: string; color: string }>,
)

export const avatarOverflowSoftByHue = styleVariants(
  Object.fromEntries(
    HUE_NAMES.map(hue => [
      hue,
      {
        backgroundColor: `var(--${hue}-6)`,
        color: `var(--${hue}-11)`,
        borderColor: `var(--${hue}-6)`,
      },
    ]),
  ) as Record<HueName, { backgroundColor: string; color: string; borderColor: string }>,
)

export const avatarOverflowSolidByHue = styleVariants(
  Object.fromEntries(
    HUE_NAMES.map(hue => [
      hue,
      {
        backgroundColor: `var(--${hue}-9)`,
        color: `var(--${hue}-contrast)`,
        borderColor: `var(--${hue}-9)`,
      },
    ]),
  ) as Record<HueName, { backgroundColor: string; color: string; borderColor: string }>,
)

export const avatarSolidFallbackByHueTone = styleVariants(
  Object.fromEntries(
    HUE_NAMES.flatMap(hue =>
      AVATAR_SOLID_TONES.map(tone => [
        `${hue}-${tone}`,
        {
          backgroundColor: `var(--${hue}-${tone})`,
          color: `var(--${hue}-contrast)`,
        },
      ]),
    ),
  ) as Record<`${HueName}-${AvatarSolidTone}`, { backgroundColor: string; color: string }>,
)
