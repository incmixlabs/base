import { style, styleVariants } from '@vanilla-extract/css'
import { semanticColorKeys, semanticColorVar } from '@/theme/props/color.prop'
import type { Color } from '@/theme/tokens'

// ── Toolbar button color variants (ghost-like pattern) ──

export const toolbarButtonColorVariants: Record<Color, string> = styleVariants(
  Object.fromEntries(
    semanticColorKeys.map(color => [
      color,
      {
        color: semanticColorVar(color, 'text'),
        backgroundColor: 'transparent',
        selectors: {
          '&:hover:not(:disabled)': {
            backgroundColor: semanticColorVar(color, 'soft'),
          },
          '&:active:not(:disabled)': {
            backgroundColor: semanticColorVar(color, 'soft-hover'),
          },
        },
      },
    ]),
  ) as Record<Color, object>,
)

// ── Active (pressed) button state ──

export const toolbarButtonActiveVariants: Record<Color, string> = styleVariants(
  Object.fromEntries(
    semanticColorKeys.map(color => [
      color,
      {
        backgroundColor: semanticColorVar(color, 'soft'),
        color: semanticColorVar(color, 'text'),
        selectors: {
          '&:hover:not(:disabled)': {
            backgroundColor: semanticColorVar(color, 'soft-hover'),
          },
        },
      },
    ]),
  ) as Record<Color, object>,
)

// ── Toolbar container surface ──
// Uses popover CSS variables for consistency with other floating UI elements.

export const toolbarSurfaceCls = style({
  backgroundColor: 'var(--popover)',
  color: 'var(--popover-foreground)',
  borderColor: 'var(--border)',
})

// ── Separator ──

export const toolbarSeparatorCls = style({
  backgroundColor: 'var(--border)',
})
