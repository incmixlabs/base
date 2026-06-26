import { type SemanticColorClassRecipe, semanticColorClassRecipes } from '@/theme/helpers/semantic-color-recipe'
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

const surfaceUnoColorByVariant = {
  classic: recipe => `${recipe.fill.solid} ${recipe.border.default} ${recipe.text.contrast}`,
  solid: recipe => `${recipe.fill.solid} ${recipe.border.default} ${recipe.text.contrast}`,
  soft: recipe => `${recipe.fill.soft} ${recipe.border.transparent} ${recipe.text.default}`,
  surface: recipe =>
    `${recipe.fill.container} ${recipe.border.default} ${recipe.text.default} ${surfaceVariantSurfaceShadow}`,
  outline: recipe => `${recipe.fill.transparent} ${recipe.border.default} ${recipe.text.default}`,
  ghost: recipe => `${recipe.fill.transparent} ${recipe.border.transparent} ${recipe.text.default}`,
} satisfies Record<SurfaceVariant, (recipe: SemanticColorClassRecipe) => string>

const surfaceUnoHoverByVariant = {
  classic: () => 'hover:brightness-[0.96] active:brightness-[0.92]',
  solid: () => 'hover:brightness-[0.96] active:brightness-[0.92]',
  soft: recipe => `${recipe.state.hoverBg} active:brightness-[0.98]`,
  surface: recipe => `${recipe.state.hoverContainerBg} active:brightness-[0.98]`,
  outline: recipe => `${recipe.state.hoverBg} active:brightness-[0.98]`,
  ghost: recipe => `${recipe.state.hoverBg} active:brightness-[0.98]`,
} satisfies Record<SurfaceVariant, (recipe: SemanticColorClassRecipe) => string>

const surfaceUnoHighContrastByVariant = {
  classic: recipe => `[background-image:none] ${recipe.highContrast.solid}`,
  solid: recipe => recipe.highContrast.solid,
  soft: recipe => recipe.highContrast.soft,
  surface: recipe => recipe.highContrast.container,
  outline: recipe => recipe.highContrast.outline,
  ghost: recipe => recipe.highContrast.ghost,
} satisfies Record<SurfaceVariant, (recipe: SemanticColorClassRecipe) => string>

function surfaceUnoColorClassName(color: SurfaceColorKey, variant: SurfaceVariant) {
  return surfaceUnoColorByVariant[variant](semanticColorClassRecipes[color])
}

function surfaceUnoHoverClassName(color: SurfaceColorKey, variant: SurfaceVariant) {
  return surfaceUnoHoverByVariant[variant](semanticColorClassRecipes[color])
}

function surfaceUnoSelectedClassName(color: SurfaceColorKey) {
  return semanticColorClassRecipes[color].state.selectedBg
}

function surfaceUnoFocusClassName(color: SurfaceColorKey) {
  return semanticColorClassRecipes[color].state.focus
}

function surfaceUnoHighContrastClassName(color: SurfaceColorKey, variant: SurfaceVariant) {
  return surfaceUnoHighContrastByVariant[variant](semanticColorClassRecipes[color])
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

export const surfaceUnoHighContrastColorVariants = Object.fromEntries(
  SURFACE_COLOR_KEYS.map(color => [
    color,
    Object.fromEntries(surfaceVariants.map(variant => [variant, surfaceUnoHighContrastClassName(color, variant)])),
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
