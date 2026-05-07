import { style, styleVariants } from '@vanilla-extract/css'
import {
  chartColorContrastVar,
  chartColorVar,
  normalizeChartColor,
  resolveInteractiveFillColor,
  resolveInteractiveForegroundToken,
  resolveInteractiveUnfilledColor,
  resolveSurfaceToneColor,
  semanticColorKeys,
  semanticColorVar,
} from '@/theme/props/color.prop'
import { surfaceShapeVar, surfaceVariantVar } from '@/theme/runtime/component-vars'
import { type Color, SURFACE_COLOR_KEYS, type SurfaceColorKey } from '@/theme/tokens'

export const surfaceHoverEnabledClass = 'surface-hover-enabled'

export const surfaceSquare = style({
  aspectRatio: '1 / 1',
})

export const surfaceShapeVariants = styleVariants({
  rect: {},
  square: {
    aspectRatio: '1 / 1',
  },
  ellipse: {
    borderRadius: surfaceShapeVar('ellipse', 'radius', '50%'),
  },
  circle: {
    borderRadius: surfaceShapeVar('circle', 'radius', '9999px'),
    aspectRatio: '1 / 1',
  },
  hexagon: {
    clipPath: 'polygon(25% 6.7%, 75% 6.7%, 100% 50%, 75% 93.3%, 25% 93.3%, 0% 50%)',
  },
  pill: {
    borderRadius: surfaceShapeVar('pill', 'radius', '9999px'),
  },
})

function interactionSelectors({
  hover,
  active,
  highContrastHover = { filter: 'contrast(1.1) saturate(1.2)' },
  highContrastActive = { filter: 'contrast(1.15) saturate(1.25)' },
}: {
  hover: Record<string, string>
  active: Record<string, string>
  highContrastHover?: Record<string, string>
  highContrastActive?: Record<string, string>
}) {
  return {
    [`&.${surfaceHoverEnabledClass}:hover`]: hover,
    [`&.${surfaceHoverEnabledClass}.af-high-contrast:hover`]: highContrastHover,
    [`&.${surfaceHoverEnabledClass}:active`]: active,
    [`&.${surfaceHoverEnabledClass}.af-high-contrast:active`]: highContrastActive,
  }
}

function getHighContrastFilledBackgroundToken(color: Color) {
  return color === 'neutral' || color === 'light' || color === 'dark' || color === 'inverse' ? 'primary' : 'text'
}

function getChartReadableTextColor(chartVar: string) {
  return `color-mix(in oklch, ${chartVar} 34%, var(--color-dark-primary))`
}

function getChartSurfaceBorderColor(chartVar: string) {
  return `color-mix(in oklch, ${chartVar} 28%, var(--color-light-border))`
}

const createSemanticSurfaceVariantStyles = (color: Color) => ({
  classic: (() => {
    const surfaceTone = resolveSurfaceToneColor(color)
    const highContrastBackgroundToken = getHighContrastFilledBackgroundToken(surfaceTone)
    return style({
      color: semanticColorVar(surfaceTone, 'contrast'),
      borderColor: semanticColorVar(surfaceTone, 'text'),
      backgroundImage: `linear-gradient(to bottom, color-mix(in oklch, ${semanticColorVar(surfaceTone, 'primary')} 88%, white), ${semanticColorVar(surfaceTone, 'primary')})`,
      selectors: {
        '&.af-high-contrast': {
          backgroundImage: 'none',
          backgroundColor: semanticColorVar(surfaceTone, highContrastBackgroundToken),
          borderColor: semanticColorVar(surfaceTone, highContrastBackgroundToken),
          color: semanticColorVar(surfaceTone, 'contrast'),
        },
        ...interactionSelectors({
          hover: { filter: 'brightness(0.96)' },
          active: { filter: 'brightness(0.92)' },
        }),
      },
    })
  })(),
  solid: (() => {
    const surfaceTone = resolveSurfaceToneColor(color)
    const highContrastBackgroundToken = getHighContrastFilledBackgroundToken(surfaceTone)
    return style({
      color: semanticColorVar(surfaceTone, 'contrast'),
      borderColor: semanticColorVar(surfaceTone, 'text'),
      backgroundColor: semanticColorVar(surfaceTone, 'primary'),
      selectors: {
        '&.af-high-contrast': {
          backgroundColor: semanticColorVar(surfaceTone, highContrastBackgroundToken),
          borderColor: semanticColorVar(surfaceTone, highContrastBackgroundToken),
          color: semanticColorVar(surfaceTone, 'contrast'),
        },
        ...interactionSelectors({
          hover: { filter: 'brightness(0.96)' },
          active: { filter: 'brightness(0.92)' },
        }),
      },
    })
  })(),
  soft: (() => {
    const surfaceTone = resolveSurfaceToneColor(color)
    return style({
      color: semanticColorVar(surfaceTone, 'text'),
      borderColor: 'transparent',
      backgroundColor: semanticColorVar(surfaceTone, 'soft'),
      selectors: {
        '&.af-high-contrast': {
          backgroundColor: semanticColorVar(surfaceTone, 'soft-hover'),
          color: semanticColorVar(surfaceTone, 'text'),
        },
        ...interactionSelectors({
          hover: { backgroundColor: semanticColorVar(surfaceTone, 'soft-hover') },
          active: { filter: 'brightness(0.98)' },
        }),
      },
    })
  })(),
  surface: (() => {
    const surfaceTone = resolveSurfaceToneColor(color)
    return style({
      color: semanticColorVar(surfaceTone, 'text'),
      borderColor: semanticColorVar(surfaceTone, 'border'),
      backgroundColor: semanticColorVar(surfaceTone, 'surface'),
      boxShadow: surfaceVariantVar('surface', 'boxShadow', 'var(--shadow-xs)'),
      selectors: {
        '&.af-high-contrast': {
          borderColor: semanticColorVar(surfaceTone, 'text'),
          color: semanticColorVar(surfaceTone, 'text'),
        },
        ...interactionSelectors({
          hover: { backgroundColor: semanticColorVar(surfaceTone, 'surface-hover') },
          active: { filter: 'brightness(0.98)' },
        }),
      },
    })
  })(),
  outline: (() => {
    const unfilledColor = resolveInteractiveUnfilledColor(color)
    const foregroundToken = resolveInteractiveForegroundToken(color)
    return style({
      color: semanticColorVar(unfilledColor, foregroundToken),
      borderColor: semanticColorVar(unfilledColor, 'border'),
      backgroundColor: 'transparent',
      selectors: {
        '&.af-high-contrast': {
          borderColor: semanticColorVar(unfilledColor, 'border'),
          color: semanticColorVar(unfilledColor, foregroundToken),
        },
        ...interactionSelectors({
          hover: { backgroundColor: semanticColorVar(unfilledColor, 'soft') },
          active: { backgroundColor: semanticColorVar(unfilledColor, 'soft-hover') },
          highContrastHover: { backgroundColor: semanticColorVar(unfilledColor, 'soft') },
          highContrastActive: { backgroundColor: semanticColorVar(unfilledColor, 'soft-hover') },
        }),
      },
    })
  })(),
  ghost: (() => {
    const unfilledColor = resolveInteractiveUnfilledColor(color)
    const foregroundToken = resolveInteractiveForegroundToken(color)
    return style({
      color: semanticColorVar(unfilledColor, foregroundToken),
      borderColor: 'transparent',
      backgroundColor: 'transparent',
      selectors: {
        '&.af-high-contrast': {
          color: semanticColorVar(unfilledColor, foregroundToken),
        },
        ...interactionSelectors({
          hover: { backgroundColor: semanticColorVar(unfilledColor, 'soft') },
          active: { backgroundColor: semanticColorVar(unfilledColor, 'soft-hover') },
        }),
      },
    })
  })(),
})

const createChartSurfaceVariantStyles = (color: SurfaceColorKey) => {
  const normalizedChartColor = normalizeChartColor(color)

  if (!normalizedChartColor) {
    return createSemanticSurfaceVariantStyles(color as Color)
  }

  const chartVar = chartColorVar(normalizedChartColor)
  const chartContrast = chartColorContrastVar(normalizedChartColor)
  const chartText = getChartReadableTextColor(chartVar)

  return {
    classic: style({
      color: chartContrast,
      borderColor: chartVar,
      backgroundImage: `linear-gradient(to bottom, color-mix(in oklch, ${chartVar} 88%, white), ${chartVar})`,
      selectors: {
        '&.af-high-contrast': {
          backgroundImage: 'none',
          backgroundColor: chartVar,
          borderColor: chartVar,
          color: chartContrast,
        },
        ...interactionSelectors({
          hover: { filter: 'brightness(0.96)' },
          active: { filter: 'brightness(0.92)' },
        }),
      },
    }),
    solid: style({
      color: chartContrast,
      borderColor: chartVar,
      backgroundColor: chartVar,
      selectors: {
        '&.af-high-contrast': {
          backgroundColor: chartVar,
          borderColor: chartVar,
          color: chartContrast,
        },
        ...interactionSelectors({
          hover: { filter: 'brightness(0.96)' },
          active: { filter: 'brightness(0.92)' },
        }),
      },
    }),
    soft: style({
      color: chartText,
      borderColor: 'transparent',
      backgroundColor: `color-mix(in oklch, ${chartVar} 28%, var(--color-light-surface))`,
      selectors: {
        '&.af-high-contrast': {
          backgroundColor: `color-mix(in oklch, ${chartVar} 36%, var(--color-light-surface))`,
          color: chartText,
        },
        ...interactionSelectors({
          hover: { backgroundColor: `color-mix(in oklch, ${chartVar} 36%, var(--color-light-surface))` },
          active: { filter: 'brightness(0.98)' },
        }),
      },
    }),
    surface: style({
      color: chartText,
      borderColor: getChartSurfaceBorderColor(chartVar),
      backgroundColor: `color-mix(in oklch, ${chartVar} 12%, var(--color-light-surface))`,
      boxShadow: surfaceVariantVar('surface', 'boxShadow', 'var(--shadow-xs)'),
      selectors: {
        '&.af-high-contrast': {
          borderColor: `color-mix(in oklch, ${chartVar} 40%, var(--color-light-border))`,
          color: chartText,
        },
        ...interactionSelectors({
          hover: { backgroundColor: `color-mix(in oklch, ${chartVar} 18%, var(--color-light-surface))` },
          active: { filter: 'brightness(0.98)' },
        }),
      },
    }),
    outline: style({
      color: chartText,
      borderColor: getChartSurfaceBorderColor(chartVar),
      backgroundColor: 'transparent',
      selectors: {
        '&.af-high-contrast': {
          borderColor: `color-mix(in oklch, ${chartVar} 40%, var(--color-light-border))`,
          color: chartText,
        },
        ...interactionSelectors({
          hover: { backgroundColor: `color-mix(in oklch, ${chartVar} 10%, var(--color-light-surface))` },
          active: { backgroundColor: `color-mix(in oklch, ${chartVar} 16%, var(--color-light-surface))` },
          highContrastHover: { backgroundColor: `color-mix(in oklch, ${chartVar} 10%, var(--color-light-surface))` },
          highContrastActive: { backgroundColor: `color-mix(in oklch, ${chartVar} 16%, var(--color-light-surface))` },
        }),
      },
    }),
    ghost: style({
      color: chartText,
      borderColor: 'transparent',
      backgroundColor: 'transparent',
      selectors: {
        '&.af-high-contrast': {
          color: chartText,
        },
        ...interactionSelectors({
          hover: { backgroundColor: `color-mix(in oklch, ${chartVar} 10%, var(--color-light-surface))` },
          active: { backgroundColor: `color-mix(in oklch, ${chartVar} 16%, var(--color-light-surface))` },
        }),
      },
    }),
  }
}

/**
 * Canonical shared surface visual contract.
 *
 * This module owns reusable Vanilla Extract class maps for components whose
 * root behaves as a single colored surface: Button, Badge, Surface, Popover,
 * Tooltip, Callout, card-like controls, and similar one-box affordances.
 *
 * The public prop/metadata contract lives in `surface.props.tsx` and is
 * re-exported from `@incmix/ui/elements`. Keep component-specific state maps
 * local when a component has additional visual state that is not represented by
 * a single surface layer, such as checked indicators or progress tracks.
 */
export const surfaceColorVariants = Object.fromEntries(
  SURFACE_COLOR_KEYS.map(color => [color, createChartSurfaceVariantStyles(color)]),
) as Record<SurfaceColorKey, Record<'classic' | 'solid' | 'soft' | 'surface' | 'outline' | 'ghost', string>>

// ── Arrow fill variants (shared by Tooltip + Popover) ──

type FloatingVariant = 'solid' | 'soft' | 'surface' | 'outline'

const createArrowFillByVariant = (color: Color) => {
  const fillColor = resolveInteractiveFillColor(color)
  const unfilledColor = resolveInteractiveUnfilledColor(color)
  return {
    solid: style({ fill: semanticColorVar(fillColor, 'primary'), color: semanticColorVar(fillColor, 'primary') }),
    soft: style({ fill: semanticColorVar(fillColor, 'soft'), color: 'transparent' }),
    surface: style({ fill: semanticColorVar(fillColor, 'surface'), color: semanticColorVar(fillColor, 'border') }),
    outline: style({ fill: 'transparent', color: semanticColorVar(unfilledColor, 'border') }),
  }
}

export const surfaceArrowFillVariants = Object.fromEntries(
  semanticColorKeys.map(color => [color, createArrowFillByVariant(color)]),
) as Record<Color, Record<FloatingVariant, string>>

/** Base class for the arrow wrapper — positions at popup edge + rotates per data-side */
export const floatingArrowBase = style({
  display: 'flex',
  selectors: {
    // popup below trigger → arrow at top, pointing up (default SVG orientation)
    '&[data-side="bottom"]': { top: 0, transform: 'translateY(-100%)' },
    // popup above trigger → arrow at bottom, pointing down
    '&[data-side="top"]': { bottom: 0, transform: 'translateY(100%) rotate(180deg)' },
    // popup right of trigger → arrow at left, pointing left
    '&[data-side="right"]': { left: 0, transform: 'translateX(-100%) rotate(-90deg)' },
    // popup left of trigger → arrow at right, pointing right
    '&[data-side="left"]': { right: 0, transform: 'translateX(100%) rotate(90deg)' },
  },
})

export const surfaceHighContrastByVariant = styleVariants({
  classic: {
    filter: 'saturate(1.1) brightness(0.95)',
  },
  solid: {
    filter: 'saturate(1.1) brightness(0.95)',
  },
  soft: {
    filter: 'saturate(1.2)',
  },
  surface: {},
  outline: {
    fontWeight: 600,
  },
  ghost: {
    fontWeight: 600,
  },
})
