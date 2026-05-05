import { cn } from '@/lib/utils'
import type { Color } from '@/theme/tokens'

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

/** variantStyles export. */
export const variantStyles: Record<string, string> = {
  classic: cn(
    'border border-input',
    'bg-gradient-to-b from-background to-muted/30 text-foreground shadow-sm',
    'focus:border-ring',
    'focus:ring-2 focus:ring-ring focus:ring-offset-2',
  ),
  solid: cn(
    'border-0',
    'bg-primary/10 text-foreground',
    'focus:bg-primary/15',
    'focus:ring-2 focus:ring-ring focus:ring-offset-2',
  ),
  soft: cn(
    'border-0',
    'bg-secondary text-foreground',
    'hover:bg-secondary/80',
    'focus:bg-secondary/80',
    'focus:ring-2 focus:ring-ring focus:ring-offset-2',
  ),
  surface: cn(
    'border border-input',
    'bg-background text-foreground shadow-sm',
    'focus:border-ring',
    'focus:ring-2 focus:ring-ring focus:ring-offset-2',
  ),
  outline: cn(
    'border border-input',
    'bg-background text-foreground',
    'focus:border-ring',
    'focus:ring-2 focus:ring-ring focus:ring-offset-2',
  ),
  ghost: cn(
    'border-0',
    'bg-transparent text-foreground',
    'hover:bg-accent',
    'focus:bg-accent',
    'focus:ring-2 focus:ring-ring focus:ring-offset-2',
  ),
}

// ============================================================================
// Variant Styles - Container Focus-Within (for compound inputs)
// ============================================================================

/** containerVariantStyles export. */
export const containerVariantStyles: Record<string, string> = {
  classic: cn(
    'border border-input',
    'bg-gradient-to-b from-background to-muted/30 text-foreground shadow-sm',
    'focus-within:border-ring',
    'focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
  ),
  solid: cn(
    'border-0',
    'bg-primary/10 text-foreground',
    'focus-within:bg-primary/15',
    'focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
  ),
  soft: cn(
    'border-0',
    'bg-secondary text-foreground',
    'hover:bg-secondary/80',
    'focus-within:bg-secondary/80',
    'focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
  ),
  surface: cn(
    'border border-input',
    'bg-background text-foreground shadow-sm',
    'focus-within:border-ring',
    'focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
  ),
  outline: cn(
    'border border-input',
    'bg-background text-foreground',
    'focus-within:border-ring',
    'focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
  ),
  ghost: cn(
    'border-0',
    'bg-transparent text-foreground',
    'hover:bg-accent',
    'focus-within:bg-accent',
    'focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
  ),
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
  'border-[color:var(--fc-primary)] focus:border-[color:var(--fc-primary)] focus:ring-[color:var(--fc-primary-alpha)]',
)

/** Color styles for compound inputs (focus-within pseudo-class). */
export const containerColorStyles = colorRecord(
  '',
  'border-[color:var(--fc-primary)] focus-within:border-[color:var(--fc-primary)] focus-within:ring-[color:var(--fc-primary-alpha)]',
)

/** Solid variant color styles (background colors). */
export const solidColorStyles = colorRecord(
  '',
  'bg-[color:var(--fc-soft-bg)] focus:bg-[color:var(--fc-soft-bg-hover)] focus-within:bg-[color:var(--fc-soft-bg-hover)] focus:ring-[color:var(--fc-primary-alpha)] focus-within:ring-[color:var(--fc-primary-alpha)]',
)

/** Highlight color styles for dropdowns/listboxes. */
export const highlightColorStyles = colorRecord('bg-accent', 'bg-[color:var(--fc-soft-bg)] text-[color:var(--fc-text)]')

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
