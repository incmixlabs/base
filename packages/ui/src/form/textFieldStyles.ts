import { cn } from '../lib/utils'
import type { Color } from '../theme/tokens'

/**
 * Shared text-field styling utilities.
 *
 * Color-dependent classes map directly to semantic color lanes. Keep these as
 * literal class strings so the Tailwind/Uno scanner can extract every lane.
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

type SemanticFormColor = (typeof semanticColors)[number]

function colorRecord(defaultCls: string, semanticCls: Record<SemanticFormColor, string>): Record<Color, string> {
  return {
    slate: defaultCls,
    inverse: defaultCls,
    light: defaultCls,
    dark: defaultCls,
    ...semanticCls,
  } satisfies Record<Color, string>
}

const semanticColorFocusStyles = {
  primary:
    '[border-color:var(--color-primary-solid)] focus:[border-color:var(--color-primary-solid)] focus:[outline-color:var(--color-primary-solid-alpha)]',
  secondary:
    '[border-color:var(--color-secondary-solid)] focus:[border-color:var(--color-secondary-solid)] focus:[outline-color:var(--color-secondary-solid-alpha)]',
  accent:
    '[border-color:var(--color-accent-solid)] focus:[border-color:var(--color-accent-solid)] focus:[outline-color:var(--color-accent-solid-alpha)]',
  neutral:
    '[border-color:var(--color-neutral-solid)] focus:[border-color:var(--color-neutral-solid)] focus:[outline-color:var(--color-neutral-solid-alpha)]',
  info: '[border-color:var(--color-info-solid)] focus:[border-color:var(--color-info-solid)] focus:[outline-color:var(--color-info-solid-alpha)]',
  success:
    '[border-color:var(--color-success-solid)] focus:[border-color:var(--color-success-solid)] focus:[outline-color:var(--color-success-solid-alpha)]',
  warning:
    '[border-color:var(--color-warning-solid)] focus:[border-color:var(--color-warning-solid)] focus:[outline-color:var(--color-warning-solid-alpha)]',
  error:
    '[border-color:var(--color-error-solid)] focus:[border-color:var(--color-error-solid)] focus:[outline-color:var(--color-error-solid-alpha)]',
} as const satisfies Record<SemanticFormColor, string>

const semanticContainerColorFocusStyles = {
  primary:
    '[border-color:var(--color-primary-solid)] focus-within:[border-color:var(--color-primary-solid)] focus-within:[outline-color:var(--color-primary-solid-alpha)]',
  secondary:
    '[border-color:var(--color-secondary-solid)] focus-within:[border-color:var(--color-secondary-solid)] focus-within:[outline-color:var(--color-secondary-solid-alpha)]',
  accent:
    '[border-color:var(--color-accent-solid)] focus-within:[border-color:var(--color-accent-solid)] focus-within:[outline-color:var(--color-accent-solid-alpha)]',
  neutral:
    '[border-color:var(--color-neutral-solid)] focus-within:[border-color:var(--color-neutral-solid)] focus-within:[outline-color:var(--color-neutral-solid-alpha)]',
  info: '[border-color:var(--color-info-solid)] focus-within:[border-color:var(--color-info-solid)] focus-within:[outline-color:var(--color-info-solid-alpha)]',
  success:
    '[border-color:var(--color-success-solid)] focus-within:[border-color:var(--color-success-solid)] focus-within:[outline-color:var(--color-success-solid-alpha)]',
  warning:
    '[border-color:var(--color-warning-solid)] focus-within:[border-color:var(--color-warning-solid)] focus-within:[outline-color:var(--color-warning-solid-alpha)]',
  error:
    '[border-color:var(--color-error-solid)] focus-within:[border-color:var(--color-error-solid)] focus-within:[outline-color:var(--color-error-solid-alpha)]',
} as const satisfies Record<SemanticFormColor, string>

const semanticSolidColorStyles = {
  primary:
    'bg-primary-soft text-primary focus:bg-primary-soft-hover focus-within:bg-primary-soft-hover focus:[outline-color:var(--color-primary-solid-alpha)] focus-within:[outline-color:var(--color-primary-solid-alpha)]',
  secondary:
    'bg-secondary-soft text-secondary focus:bg-secondary-soft-hover focus-within:bg-secondary-soft-hover focus:[outline-color:var(--color-secondary-solid-alpha)] focus-within:[outline-color:var(--color-secondary-solid-alpha)]',
  accent:
    'bg-accent-soft text-accent focus:bg-accent-soft-hover focus-within:bg-accent-soft-hover focus:[outline-color:var(--color-accent-solid-alpha)] focus-within:[outline-color:var(--color-accent-solid-alpha)]',
  neutral:
    'bg-neutral-soft text-neutral focus:bg-neutral-soft-hover focus-within:bg-neutral-soft-hover focus:[outline-color:var(--color-neutral-solid-alpha)] focus-within:[outline-color:var(--color-neutral-solid-alpha)]',
  info: 'bg-info-soft text-info focus:bg-info-soft-hover focus-within:bg-info-soft-hover focus:[outline-color:var(--color-info-solid-alpha)] focus-within:[outline-color:var(--color-info-solid-alpha)]',
  success:
    'bg-success-soft text-success focus:bg-success-soft-hover focus-within:bg-success-soft-hover focus:[outline-color:var(--color-success-solid-alpha)] focus-within:[outline-color:var(--color-success-solid-alpha)]',
  warning:
    'bg-warning-soft text-warning focus:bg-warning-soft-hover focus-within:bg-warning-soft-hover focus:[outline-color:var(--color-warning-solid-alpha)] focus-within:[outline-color:var(--color-warning-solid-alpha)]',
  error:
    'bg-error-soft text-error focus:bg-error-soft-hover focus-within:bg-error-soft-hover focus:[outline-color:var(--color-error-solid-alpha)] focus-within:[outline-color:var(--color-error-solid-alpha)]',
} as const satisfies Record<SemanticFormColor, string>

const semanticHighlightColorStyles = {
  primary: 'bg-primary-soft text-primary',
  secondary: 'bg-secondary-soft text-secondary',
  accent: 'bg-accent-soft text-accent',
  neutral: 'bg-neutral-soft text-neutral',
  info: 'bg-info-soft text-info',
  success: 'bg-success-soft text-success',
  warning: 'bg-warning-soft text-warning',
  error: 'bg-error-soft text-error',
} as const satisfies Record<SemanticFormColor, string>

export const solidTextColorStyles = {
  slate: 'text-[color:var(--color-slate-solid)]',
  primary: 'text-[color:var(--color-primary-solid)]',
  secondary: 'text-[color:var(--color-secondary-solid)]',
  accent: 'text-[color:var(--color-accent-solid)]',
  neutral: 'text-[color:var(--color-neutral-solid)]',
  info: 'text-[color:var(--color-info-solid)]',
  success: 'text-[color:var(--color-success-solid)]',
  warning: 'text-[color:var(--color-warning-solid)]',
  error: 'text-[color:var(--color-error-solid)]',
  inverse: 'text-[color:var(--color-inverse-solid)]',
  light: 'text-[color:var(--color-light-solid)]',
  dark: 'text-[color:var(--color-dark-solid)]',
} as const satisfies Record<Color, string>

/** Color styles for single inputs (focus pseudo-class). */
export const colorStyles = colorRecord('', semanticColorFocusStyles)

/** Color styles for compound inputs (focus-within pseudo-class). */
export const containerColorStyles = colorRecord('', semanticContainerColorFocusStyles)

/** Solid variant color styles (background colors). */
export const solidColorStyles = colorRecord('', semanticSolidColorStyles)

/** Highlight color styles for dropdowns/listboxes. */
export const highlightColorStyles = colorRecord('bg-accent-soft text-accent', semanticHighlightColorStyles)

export const textFieldStylesClassNames = [
  ...Object.values(variantStyles),
  ...Object.values(containerVariantStyles),
  ...Object.values(colorStyles),
  ...Object.values(containerColorStyles),
  ...Object.values(solidColorStyles),
  ...Object.values(highlightColorStyles),
  ...Object.values(solidTextColorStyles),
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
