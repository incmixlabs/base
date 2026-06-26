import { normalizeChartColor, semanticColorKeys } from '@/theme/props/color.prop'
import { type Color, SURFACE_COLOR_KEYS, type SurfaceColorKey } from '@/theme/tokens'
import { surfaceVariantSurfaceShadow } from './Surface.css'
import { type SurfaceShape, type SurfaceVariant, surfaceShapes, surfaceVariants } from './surface.props'

export const surfaceHoverEnabledClass = 'surface-hover-enabled'

export const surfaceSquare = 'surface-square'

export const surfaceShapeVariants = Object.fromEntries(
  surfaceShapes.map(shape => [shape, `surface-shape-${shape}`]),
) as Record<SurfaceShape, string>

function surfaceColorClassName(color: SurfaceColorKey, variant: SurfaceVariant) {
  const normalizedChartColor = normalizeChartColor(color)
  const colorToken = normalizedChartColor ?? color
  return `surface-color-${colorToken} surface-variant-${variant}`
}

export const surfaceColorVariants = Object.fromEntries(
  SURFACE_COLOR_KEYS.map(color => [
    color,
    Object.fromEntries(surfaceVariants.map(variant => [variant, surfaceColorClassName(color, variant)])),
  ]),
) as Record<SurfaceColorKey, Record<SurfaceVariant, string>>

function surfaceUtilityColorName(color: SurfaceColorKey) {
  return normalizeChartColor(color) ?? color
}

const chromaticSurfaceColorNames = ['primary', 'secondary', 'accent', 'info', 'success', 'warning', 'error'] as const
const chromaticSurfaceColorSet = new Set<string>(chromaticSurfaceColorNames)

function surfaceStateBackgroundClassName(colorName: string) {
  return chromaticSurfaceColorSet.has(colorName) ? `bg-${colorName}-highlight` : `bg-${colorName}-soft`
}

function surfaceFocusOutlineClassName(colorName: string) {
  return chromaticSurfaceColorSet.has(colorName) ? `outline-${colorName}-highlight` : `outline-${colorName}`
}

const surfaceUnoColorByVariant = {
  classic: colorName => `bg-${colorName}-solid border-${colorName} text-${colorName}-contrast`,
  solid: colorName => `bg-${colorName}-solid border-${colorName} text-${colorName}-contrast`,
  soft: colorName => `bg-${colorName}-soft border-transparent text-${colorName}`,
  surface: colorName => `bg-${colorName}-surface border-${colorName} text-${colorName} ${surfaceVariantSurfaceShadow}`,
  outline: colorName => `bg-transparent border-${colorName} text-${colorName}`,
  ghost: colorName => `bg-transparent border-transparent text-${colorName}`,
} satisfies Record<SurfaceVariant, (colorName: string) => string>

const surfaceUnoHoverByVariant = {
  classic: () => 'hover:brightness-[0.96] active:brightness-[0.92]',
  solid: () => 'hover:brightness-[0.96] active:brightness-[0.92]',
  soft: colorName => `hover:${surfaceStateBackgroundClassName(colorName)} active:brightness-[0.98]`,
  surface: colorName => `hover:${surfaceStateBackgroundClassName(colorName)} active:brightness-[0.98]`,
  outline: colorName => `hover:${surfaceStateBackgroundClassName(colorName)} active:brightness-[0.98]`,
  ghost: colorName => `hover:${surfaceStateBackgroundClassName(colorName)} active:brightness-[0.98]`,
} satisfies Record<SurfaceVariant, (colorName: string) => string>

function surfaceUnoColorClassName(color: SurfaceColorKey, variant: SurfaceVariant) {
  const colorName = surfaceUtilityColorName(color)
  return surfaceUnoColorByVariant[variant](colorName)
}

function surfaceUnoHoverClassName(color: SurfaceColorKey, variant: SurfaceVariant) {
  const colorName = surfaceUtilityColorName(color)
  return surfaceUnoHoverByVariant[variant](colorName)
}

function surfaceUnoSelectedClassName(color: SurfaceColorKey) {
  const colorName = surfaceUtilityColorName(color)
  return `data-[selected]:${surfaceStateBackgroundClassName(colorName)}`
}

function surfaceUnoFocusClassName(color: SurfaceColorKey) {
  const colorName = surfaceUtilityColorName(color)
  return `focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:${surfaceFocusOutlineClassName(colorName)}`
}

export const surfaceUnoColorVariants = Object.fromEntries(
  SURFACE_COLOR_KEYS.map(color => [
    color,
    Object.fromEntries(surfaceVariants.map(variant => [variant, surfaceUnoColorClassName(color, variant)])),
  ]),
) as Record<SurfaceColorKey, Record<SurfaceVariant, string>>

export const surfaceUnoHoverColorVariants = Object.fromEntries(
  SURFACE_COLOR_KEYS.map(color => [
    color,
    Object.fromEntries(surfaceVariants.map(variant => [variant, surfaceUnoHoverClassName(color, variant)])),
  ]),
) as Record<SurfaceColorKey, Record<SurfaceVariant, string>>

export const surfaceUnoSelectedColorVariants = Object.fromEntries(
  SURFACE_COLOR_KEYS.map(color => [color, surfaceUnoSelectedClassName(color)]),
) as Record<SurfaceColorKey, string>

export const surfaceUnoFocusColorVariants = Object.fromEntries(
  SURFACE_COLOR_KEYS.map(color => [color, surfaceUnoFocusClassName(color)]),
) as Record<SurfaceColorKey, string>

const floatingVariant = {
  solid: 'solid',
  soft: 'soft',
  surface: 'surface',
  outline: 'outline',
} as const
type FloatingVariant = (typeof floatingVariant)[keyof typeof floatingVariant]
const floatingVariants = Object.values(floatingVariant)

export const surfaceArrowFillVariants = Object.fromEntries(
  semanticColorKeys.map(color => [
    color,
    Object.fromEntries(floatingVariants.map(variant => [variant, `surface-color-${color} surface-arrow-${variant}`])),
  ]),
) as Record<Color, Record<FloatingVariant, string>>

export const floatingArrowBase = 'surface-floating-arrow'

export const surfaceHighContrastByVariant = Object.fromEntries(
  surfaceVariants.map(variant => [variant, `surface-high-contrast-${variant}`]),
) as Record<SurfaceVariant, string>
