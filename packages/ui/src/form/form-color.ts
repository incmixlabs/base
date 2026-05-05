import type { Color } from '@/theme/tokens'
import { designTokens } from '@/theme/tokens'

/**
 * Shared CSS custom properties for form component color theming.
 *
 * Components set these variables via inline `style` and reference them
 * with static Tailwind arbitrary-value classes. This ensures Tailwind's
 * static scanner can always extract the class names at build time.
 *
 * Token properties mapped:
 *   --fc-primary         → color.primary        (border, bg on checked)
 *   --fc-primary-alpha   → color.primaryAlpha    (ring on focus/checked)
 *   --fc-contrast        → color.contrast        (text on solid checked)
 *   --fc-text            → color.text            (text on soft/outline)
 *   --fc-soft-bg         → color.softBackground  (bg for soft variant)
 *   --fc-soft-bg-hover   → color.softBackgroundHover
 */

const sc = designTokens.color

export interface FormColorVars {
  '--fc-primary': string
  '--fc-primary-alpha': string
  '--fc-contrast': string
  '--fc-text': string
  '--fc-soft-bg': string
  '--fc-soft-bg-hover': string
}

function buildVars(c: (typeof sc)[keyof typeof sc]): FormColorVars {
  return {
    '--fc-primary': c.primary,
    '--fc-primary-alpha': c.primaryAlpha,
    '--fc-contrast': c.contrast,
    '--fc-text': c.text,
    '--fc-soft-bg': c.softBackground,
    '--fc-soft-bg-hover': c.softBackgroundHover,
  }
}

export const formColorVars: Record<Color, FormColorVars> = {
  slate: buildVars(sc.slate),
  primary: buildVars(sc.primary),
  secondary: buildVars(sc.secondary),
  accent: buildVars(sc.accent),
  neutral: buildVars(sc.neutral),
  info: buildVars(sc.info),
  success: buildVars(sc.success),
  warning: buildVars(sc.warning),
  error: buildVars(sc.error),
  inverse: buildVars(sc.inverse),
  light: buildVars(sc.light),
  dark: buildVars(sc.dark),
}
