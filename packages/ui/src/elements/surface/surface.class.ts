import { normalizeChartColor, semanticColorKeys } from '@/theme/props/color.prop'
import { type Color, SURFACE_COLOR_KEYS, type SurfaceColorKey } from '@/theme/tokens'
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
