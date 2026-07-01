import { cn } from '../lib/utils'
import type { Color } from '../theme/tokens'

/**
 * Shared text-field styling utilities.
 *
 * Color-dependent classes use static var() references to --fc-* CSS custom
 * properties. Components must set these via `style={formColorVars[color]}`
 * (from form-color.ts) on a parent element.
 */

// ============================================================================
// Variant Styles - Input Focus (for single inputs like TextField)
// ============================================================================

const inputFocus =
  'focus:border-primary focus:outline-solid focus:outline-2 focus:outline-offset-2 focus:outline-primary'

const containerFocus =
  'focus-within:border-primary focus-within:outline-solid focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-primary'

const classicSurface = 'border border-neutral bg-neutral-surface text-neutral shadow-sm'
const outlineSurface = 'border border-neutral bg-neutral-background text-neutral'
const solidSurface = 'border-0 bg-primary-soft text-primary'
const softSurface = 'border-0 bg-neutral-soft text-neutral'
const ghostSurface = 'border-0 bg-transparent text-neutral'
const ghostInteraction = 'hover:bg-neutral-soft focus:bg-neutral-soft'

/** variantStyles export. */
export const variantStyles: Record<string, string> = {
  classic: cn(classicSurface, inputFocus),
  solid: cn(solidSurface, 'focus:bg-primary-soft-hover', inputFocus),
  soft: cn(softSurface, 'hover:bg-neutral-soft-hover focus:bg-neutral-soft-hover', inputFocus),
  surface: cn(outlineSurface, 'shadow-sm', inputFocus),
  outline: cn(outlineSurface, inputFocus),
  ghost: cn(ghostSurface, ghostInteraction, inputFocus),
}

// ============================================================================
// Variant Styles - Container Focus-Within (for compound inputs)
// ============================================================================

/** containerVariantStyles export. */
export const containerVariantStyles: Record<string, string> = {
  classic: cn(classicSurface, containerFocus),
  solid: cn(solidSurface, 'focus-within:bg-primary-soft-hover', containerFocus),
  soft: cn(softSurface, 'hover:bg-neutral-soft-hover focus-within:bg-neutral-soft-hover', containerFocus),
  surface: cn(outlineSurface, 'shadow-sm', containerFocus),
  outline: cn(outlineSurface, containerFocus),
  ghost: cn(ghostSurface, 'hover:bg-neutral-soft focus-within:bg-neutral-soft', containerFocus),
}

// ============================================================================
// Color Styles
// All classes reference --fc-* vars set by formColorVars inline styles.
// ============================================================================

const semanticColors = [
  'primary',
  'secondary',
  'accent',
  'neutral',
  'info',
  'success',
  'warning',
  'error',
] as const satisfies readonly Color[]

function colorRecord(defaultCls: string, semanticCls: string): Record<Color, string> {
  return {
    slate: defaultCls,
    inverse: defaultCls,
    light: defaultCls,
    dark: defaultCls,
    ...Object.fromEntries(semanticColors.map(c => [c, semanticCls])),
  } as Record<Color, string>
}

/** Color styles for single inputs (focus pseudo-class). */
export const colorStyles = colorRecord(
  '',
  '[border-color:var(--fc-solid)] focus:[border-color:var(--fc-solid)] focus:[outline-color:var(--fc-solid-alpha)]',
)

/** Color styles for compound inputs (focus-within pseudo-class). */
export const containerColorStyles = colorRecord(
  '',
  '[border-color:var(--fc-solid)] focus-within:[border-color:var(--fc-solid)] focus-within:[outline-color:var(--fc-solid-alpha)]',
)

/** Solid variant color styles (background colors). */
export const solidColorStyles = colorRecord(
  '',
  'bg-[color:var(--fc-soft-bg)] text-[color:var(--fc-text)] focus:bg-[color:var(--fc-soft-bg-hover)] focus-within:bg-[color:var(--fc-soft-bg-hover)] focus:[outline-color:var(--fc-solid-alpha)] focus-within:[outline-color:var(--fc-solid-alpha)]',
)

/** Highlight color styles for dropdowns/listboxes. */
export const highlightColorStyles = colorRecord(
  'bg-accent-soft text-accent',
  'bg-[color:var(--fc-soft-bg)] text-[color:var(--fc-text)]',
)

export const textFieldStylesClassNames = [
  ...Object.values(variantStyles),
  ...Object.values(containerVariantStyles),
  ...Object.values(colorStyles),
  ...Object.values(containerColorStyles),
  ...Object.values(solidColorStyles),
  ...Object.values(highlightColorStyles),
]

// ============================================================================
// Helper Functions
// ============================================================================

/** getBaseVariant export. */
export function getBaseVariant(variant?: string): string {
  if (variant?.startsWith('floating-')) {
    return 'outline'
  }
  return variant ?? 'outline'
}
